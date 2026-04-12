import { Router } from "express";
import {register, login, getMe, logout, refresh} from "../controllers/AuthController";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);

// Protected routes
router.get("/me", requireAuth, getMe);
router.post("/logout", requireAuth, logout);

export default router;
