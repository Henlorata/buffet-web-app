import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { connectRedis } from './lib/redis';
import authRoutes from './routes/authRoutes';

dotenv.config({ path: '../../.env' });

const app = express();
export const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'Buffet API is running successfully!'
  });
});

// Start server and initialize connections
const bootstrap = async () => {
  try {
    await connectRedis();
    app.listen(PORT, () => {
      console.log(`[Server]: Running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('[Server Setup Error]:', error);
    process.exit(1);
  }
};

bootstrap();