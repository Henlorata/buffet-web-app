import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../server";
import { io } from "../server";

// Schemas
const orderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
});

const createOrderSchema = z.object({
  items: z
    .array(orderItemSchema)
    .min(1, "Order must contain at least one item"),
});

const updateStatusSchema = z.object({
  status: z.enum(["PREPARING", "READY", "COMPLETED", "CANCELLED"]),
  reason: z.string().optional(),
  adminCode: z.string().optional(),
});

// POST /api/orders
export const createOrder = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { items } = createOrderSchema.parse(req.body);

    // Prisma Transaction (Error in a transaction = rollback)
    const newOrder = await prisma.$transaction(async (tx) => {
      let totalAmount = 0;
      const orderItemsData = [];

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product || !product.isActive) {
          throw new Error(`Product not found or inactive: ${item.productId}`);
        }

        if (product.stockQuantity < item.quantity) {
          throw new Error(
            `Insufficient stock for ${product.name}. Available: ${product.stockQuantity}`,
          );
        }

        totalAmount += product.price * item.quantity;

        orderItemsData.push({
          productId: product.id,
          quantity: item.quantity,
          unitPriceAtPurchase: product.price,
        });

        await tx.product.update({
          where: { id: product.id },
          data: { stockQuantity: { decrement: item.quantity } },
        });
      }

      const order = await tx.order.create({
        data: {
          userId,
          totalAmount,
          status: "NEW",
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: { include: { product: { select: { name: true } } } },
        },
      });

      return order;
    });

    res
      .status(201)
      .json({ message: "Order placed successfully", order: newOrder });
  io.emit("new-order-received", newOrder);
  io.emit("product-quantity-changed", newOrder.items.map(i => ({ productId: i.productId, newStock: i.quantity })));
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json({ error: "Validation failed", details: error.errors });
    } else if (
      error.message.includes("Insufficient stock") ||
      error.message.includes("Product not found")
    ) {
      res.status(409).json({ error: error.message });
    } else {
      console.error("[Create Order Error]:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

// GET /api/orders
export const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, role } = req.user!;
    const { view } = req.query;

    let orders;

    if (view === "kitchen") {
      if (role === "CUSTOMER") {
        res.status(403).json({ error: "Nincs jogosultságod a konyhai nézethez" });
        return;
      }
      orders = await prisma.order.findMany({
        where: role === "CUSTOMER" ? { userId } : { status: { in: ["NEW", "PREPARING", "READY"] } },
        include: {
          user: { select: { fullName: true } },
          cancelledBy: { select: { fullName: true } },
          items: { include: { product: { select: { id: true, name: true, imageUrl: true, price: true, isActive: true, stockQuantity: true } } } },
          handledBy: { select: { fullName: true } },
        },
        orderBy: role === "CUSTOMER" ? { createdAt: "desc" } : { createdAt: "asc" },
      });
    }
    else {
      orders = await prisma.order.findMany({
        where: { userId },
        include: {
          cancelledBy: { select: { fullName: true } },
          items: { include: { product: { select: { id: true, name: true, imageUrl: true, price: true, isActive: true, stockQuantity: true } } } },
        },
        orderBy: { createdAt: "desc" },
      });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("[Get Orders Error]:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// PATCH /api/orders/:id/status
export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId, role } = req.user!;
    const { status, reason, adminCode } = updateStatusSchema.parse(req.body);

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      res.status(404).json({ error: "Rendelés nem található" });
      return;
    }

    if (status === "CANCELLED") {
      if (role === "CUSTOMER") {
        if (order.status !== "NEW") {
          res.status(403).json({ error: "Már készülő rendelést nem mondhatsz le. Érdeklődj a pultnál!" });
          return;
        }
      }
      else if (role === "BARTENDER") {
        if (order.status !== "NEW") {
          if (adminCode !== "12345" && role !== "ADMIN") {
            res.status(403).json({ error: "Elfogadott rendelés törléséhez műszakvezetői kód szükséges!" });
            return;
          }
          if (!reason || reason.length < 5) {
            res.status(400).json({ error: "Elfogadott rendelésnél az indoklás kötelező!" });
            return;
          }
        }
      }
    }

    await prisma.$transaction(async (tx) => {
      if (status === "CANCELLED" && order.status !== "CANCELLED") {
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stockQuantity: { increment: item.quantity } },
          });
        }
      }

      await tx.order.update({
        where: { id },
        data: {
          status,
          cancellationReason: reason,
          cancelledById: status === "CANCELLED" ? userId : undefined,
          handledById: role !== "CUSTOMER" ? userId : undefined,
        },
      });
    });

    res.status(200).json({ message: "Státusz sikeresen frissítve" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Validációs hiba", details: error.errors });
    } else {
      console.error("[Update Order Error]:", error);
      res.status(500).json({ error: "Belső szerver hiba" });
    }
  }
};

// GET /api/orders/stats
export const getAdminStats = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== "ADMIN") { res.status(403).json({ error: "Nincs jogosultságod" }); return; }

    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const statusStats = await prisma.order.groupBy({
      by: ['status'],
      _count: { id: true },
      _sum: { totalAmount: true }
    });

    const recentOrders = await prisma.order.findMany({
      where: {
        createdAt: { gte: sevenDaysAgo },
        status: "COMPLETED"
      },
      select: { totalAmount: true, createdAt: true }
    });

    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _count: { id: true },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5
    });

    const productDetails = await prisma.product.findMany({
      where: { id: { in: topProducts.map(p => p.productId) } },
      select: { id: true, name: true }
    });

    const popularProducts = topProducts.map(tp => ({
      name: productDetails.find(pd => pd.id === tp.productId)?.name || "Ismeretlen",
      count: tp._sum.quantity || 0
    }));

    const dailyStats: Record<string, { revenue: number, orders: number }> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today); d.setDate(d.getDate() - i);
      dailyStats[d.toISOString().split('T')[0]] = { revenue: 0, orders: 0 };
    }

    recentOrders.forEach(order => {
      const dateKey = order.createdAt.toISOString().split('T')[0];
      if (dailyStats[dateKey]) {
        dailyStats[dateKey].revenue += order.totalAmount;
        dailyStats[dateKey].orders += 1;
      }
    });

    res.status(200).json({
      statusBreakdown: statusStats.map(s => ({ status: s.status, count: s._count.id })),
      totalRevenue: statusStats.find(s => s.status === 'COMPLETED')?._sum.totalAmount || 0,
      totalOrders: statusStats.reduce((acc, s) => acc + s._count.id, 0),
      weeklyChart: Object.entries(dailyStats).map(([date, stats]) => ({ date, ...stats })),
      popularProducts
    });
  } catch (error) {
    res.status(500).json({ error: "Hiba a statisztika generálásakor" });
  }
};