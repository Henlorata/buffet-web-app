import { Request, Response } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "../server";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { redisClient } from "../lib/redis";
import jwt from "jsonwebtoken";
import { io } from "../server";

// Input validation
const registerSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  fullName: z.string().min(2, "Full name is required"),
});

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      res.status(409).json({ error: "User with this email already exists" });
      return;
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(validatedData.password, salt);

    // Create the user in the database
    const newUser = await prisma.user.create({
      data: {
        email: validatedData.email,
        passwordHash,
        fullName: validatedData.fullName,
      },
    });

    const accessToken = generateAccessToken(newUser.id, newUser.role);
    const refreshToken = generateRefreshToken(newUser.id);

    await redisClient.setEx(
      `refresh_token:${newUser.id}`,
      604800,
      refreshToken,
    ); // 7 days expiration

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Response
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role,
      },
      accessToken,
    });
    io.emit("new-user-registered", newUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Validation failed", details: error });
    } else {
      console.error("[Register Error]:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(
      validatedData.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    // Generate tokens
    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    await redisClient.setEx(`refresh_token:${user.id}`, 7 * 24 * 60 * 60, refreshToken);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Response
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
      accessToken,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Validation failed", details: error });
    } else {
      console.error("[Login Error]:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

// GET /api/auth/me (Protected Route)
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId; // From auth middleware

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("[GetMe Error]:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST /api/auth/logout (Protected Route)
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (userId) {
      await redisClient.del(`refresh_token:${userId}`); // Invalidate the refresh token = effectively logout
    }
    res.clearCookie('refreshToken');

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("[Logout Error]:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      res.status(401).json({ error: 'No refresh token found' });
      return;
    }

    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any;
    const newAccessToken = generateAccessToken(payload.userId, payload.role);

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
};

// GET /api/auth/users
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== "ADMIN") { res.status(403).json({ error: "Nincs jogosultságod!" }); return; }

    const users = await prisma.user.findMany({
      select: { id: true, fullName: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: "desc" }
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Szerver hiba" });
  }
};

// PATCH /api/auth/users/:id/role
export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== "ADMIN") { res.status(403).json({ error: "Nincs jogosultságod!" }); return; }

    const { id } = req.params as { id: string };
    const { role } = req.body;

    if (!["ADMIN", "BARTENDER", "CUSTOMER"].includes(role)) {
      res.status(400).json({ error: "Érvénytelen szerepkör" }); return;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, fullName: true, email: true, role: true }
    });

    res.status(200).json({ message: "Szerepkör frissítve", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: "Szerver hiba" });
  }
};

const updateProfileSchema = z.object({
  fullName: z.string().min(2, "A név túl rövid"),
  email: z.string().email("Érvénytelen e-mail cím"),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "A jelenlegi jelszó megadása kötelező"),
  newPassword: z.string().min(6, "Az új jelszónak legalább 6 karakternek kell lennie"),
});

// PUT /api/auth/profile
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { fullName, email } = updateProfileSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser && existingUser.id !== userId) {
      res.status(409).json({ error: "Ez az e-mail cím már foglalt egy másik fiók által!" });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { fullName, email },
      select: { id: true, email: true, fullName: true, role: true }
    });

    res.status(200).json({ message: "Profil sikeresen frissítve", user: updatedUser });
  } catch (error: any) {
    if (error instanceof z.ZodError) res.status(400).json({ error: "Validációs hiba", details: (error as z.ZodError).format() });
    else res.status(500).json({ error: "Szerver hiba" });
  }
};

// PUT /api/auth/password
export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) { res.status(404).json({ error: "Felhasználó nem található" }); return; }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ error: "A jelenlegi jelszó helytelen!" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash }
    });

    res.status(200).json({ message: "Jelszó sikeresen megváltoztatva!" });
  } catch (error: any) {
    if (error instanceof z.ZodError) res.status(400).json({ error: "Validációs hiba", details: (error as z.ZodError).format() });
    else res.status(500).json({ error: "Szerver hiba" });
  }
};