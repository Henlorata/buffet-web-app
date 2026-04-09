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

    let orders;

    if (role === "CUSTOMER") {
      // Customers only see their own orders
      orders = await prisma.order.findMany({
        where: { userId },
        include: {
          items: {
            include: { product: { select: { name: true, imageUrl: true } } },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      // Bartenders and Admins see all active orders (not completed/canceled)
      orders = await prisma.order.findMany({
        where: {
          status: { in: ["NEW", "PREPARING", "READY"] },
        },
        include: {
          user: { select: { fullName: true } },
          items: { include: { product: { select: { name: true } } } },
          handledBy: { select: { fullName: true } },
        },
        orderBy: { createdAt: "asc" },
      });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("[Get Orders Error]:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// PATCH /api/orders/:id/status
export const updateOrderStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId, role } = req.user!;
    const { status } = updateStatusSchema.parse(req.body);

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    // Authorization checks
    if (role === "CUSTOMER") {
      // Customers can ONLY cancel, and ONLY if the order is still 'NEW'
      if (status !== "CANCELLED" || order.status !== "NEW") {
        res.status(403).json({
          error: "Customers can only cancel orders that are in NEW status",
        });
        return;
      }
      if (order.userId !== userId) {
        res.status(403).json({ error: "Cannot modify someone else's order" });
        return;
      }
    }

    // Process the update
    await prisma.$transaction(async (tx) => {
      // If cancelling, we MUST restock the items
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
          handledById: role !== "CUSTOMER" ? userId : undefined, // Record which bartender handled it
        },
      });
    });

    const updatedOrder = await prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { fullName: true } },
        handledBy: { select: { fullName: true } }, // Bartender's name
        items: { include: { product: { select: { name: true } } } },
      }
    });

    res.status(200).json({ message: `Order status updated to ${status}`, order: updatedOrder });
    io.emit("order-status-updated", updatedOrder);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json({ error: "Validation failed", details: error.errors });
    } else {
      console.error("[Update Order Error]:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};
