import { Router } from 'express';
import { register, login, getMe, logout } from '../controllers/AuthController';
import { requireAuth } from '../middlewares/requireAuth';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', requireAuth, getMe);
router.post('/logout', requireAuth, logout);

export default router;