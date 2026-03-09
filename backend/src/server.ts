import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Load environment variables from the root directory
dotenv.config({ path: '../.env' });

const app = express();
export const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'Buffet API is running successfully!'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`[Server]: Running on http://localhost:${PORT}`);
});