import { Request, Response } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "../server";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { redisClient } from "../lib/redis";

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
      refreshToken, // I WILL MOVE THIS TO HTTP-ONLY COOKIE IN PRODUCTION
    });
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

    await redisClient.setEx(`refresh_token:${user.id}`, 604800, refreshToken);

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
      refreshToken,
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

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("[Logout Error]:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
