import { Router } from "express";
import {
  register,
  login,
  getMe,
  logout,
  refresh,
  getUsers,
  updateUserRole,
  updateProfile, changePassword
} from "../controllers/AuthController";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);

// Protected routes
router.put("/profile", requireAuth, updateProfile);
router.put("/password", requireAuth, changePassword);
router.get("/me", requireAuth, getMe);
router.post("/logout", requireAuth, logout);

router.get("/users", requireAuth, getUsers);
router.patch("/users/:id/role", requireAuth, updateUserRole);

export default router;
