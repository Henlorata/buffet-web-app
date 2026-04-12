import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { connectRedis } from "./lib/redis";
import cookieParser from 'cookie-parser';
import { createServer } from "http"; // Új import
import { Server } from "socket.io"; // Új import
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import orderRoutes from "./routes/orderRoutes";

dotenv.config({ path: "../../.env" });

const app = express();
const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173', // A frontended címe
    methods: ["GET", "POST", "PATCH"],
    credentials: true
  }
});

export const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

io.on("connection", (socket) => {
  console.log(`[Socket]: Kliens csatlakozott: ${socket.id}`);
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Health check
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

// Start server
const bootstrap = async () => {
  try {
    await connectRedis();
    httpServer.listen(PORT, () => {
      console.log(`[Server]: Running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("[Server Setup Error]:", error);
    process.exit(1);
  }
};

bootstrap();