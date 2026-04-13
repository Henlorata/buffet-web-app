import { Request, Response } from "express";
import { prisma } from "../server";
import { z } from "zod";
import { io } from "../server";

const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.number().min(0),
  stockQuantity: z.number().min(0),
  imageUrl: z.string().url().or(z.literal("")).optional(),
  categoryId: z.string().min(1),
});

const updateProductSchema = productSchema.partial().extend({
  isActive: z.boolean().optional(),
});

const categorySchema = z.object({
  name: z.string().min(2, "A kategória neve túl rövid!"),
});

// GET /api/products/categories
export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      include: { products: { where: { isActive: true } } },
      orderBy: { name: "asc" },
    });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST /api/products/categories
export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== "ADMIN") { res.status(403).json({ error: "Csak adminisztrátor hozhat létre kategóriát!" }); return; }

    const { name } = categorySchema.parse(req.body);
    const slug = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const newCategory = await prisma.category.create({ data: { name, slug } });
    res.status(201).json({ message: "Kategória létrehozva", category: newCategory });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// PUT /api/products/categories/:id
export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== "ADMIN") { res.status(403).json({ error: "Csak adminisztrátor módosíthat kategóriát!" }); return; }

    const { id } = req.params;
    const { name } = categorySchema.parse(req.body);
    const slug = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { name, slug }
    });
    res.status(200).json({ message: "Kategória frissítve", category: updatedCategory });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// GET /api/products
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: { select: { name: true, slug: true } },
        favoritedBy: { select: { userId: true } }
      },
      orderBy: { name: "asc" },
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST /api/products
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== "ADMIN") { res.status(403).json({ error: "Csak adminisztrátor hozhat létre terméket!" }); return; }

    const data = productSchema.parse(req.body);

    const newProduct = await prisma.product.create({
      data: { ...data, imageUrl: data.imageUrl || null },
      include: { category: { select: { name: true } } }
    });

    res.status(201).json({ message: "Termék létrehozva", product: newProduct });
  } catch (error: any) {
    if (error instanceof z.ZodError) res.status(400).json({ error: "Validációs hiba", details: error.errors });
    else res.status(500).json({ error: "Szerver hiba" });
  }
};

// PUT /api/products/:id
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== "ADMIN") { res.status(403).json({ error: "Csak adminisztrátor módosíthat terméket!" }); return; }

    const { id } = req.params;
    const data = updateProductSchema.parse(req.body);

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { ...data, imageUrl: data.imageUrl === "" ? null : data.imageUrl },
      include: { category: { select: { name: true } } }
    });

    io.emit("product-quantity-changed", [{ productId: updatedProduct.id, newStock: updatedProduct.stockQuantity }]);

    res.status(200).json({ message: "Termék frissítve", product: updatedProduct });
  } catch (error: any) {
    if (error instanceof z.ZodError) res.status(400).json({ error: "Validációs hiba", details: error.errors });
    else res.status(500).json({ error: "Szerver hiba" });
  }
};

// DELETE /api/products/categories/:id
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== "ADMIN") {
      res.status(403).json({ error: "Csak adminisztrátor törölhet kategóriát!" });
      return;
    }

    const { id } = req.params;

    await prisma.$transaction(async (tx) => {
      await tx.product.deleteMany({ where: { categoryId: id } });
      await tx.category.delete({ where: { id } });
    });

    res.status(200).json({ message: "Kategória és termékei sikeresen törölve." });
  } catch (error: any) {
    if (error.code === 'P2003') {
      res.status(409).json({ error: "Nem törölhető! A kategóriában lévő termékek már szerepelnek korábbi rendelésekben. Kérlek, inkább inaktiváld a termékeket a listában!" });
    } else {
      res.status(500).json({ error: "Szerver hiba a törlés során." });
    }
  }
};

// POST /api/products/:id/favorite
export const toggleFavorite = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: productId } = req.params;
    const userId = req.user!.userId;

    const existingFavorite = await prisma.favorite.findUnique({
      where: { userId_productId: { userId, productId } }
    });

    if (existingFavorite) {
      await prisma.favorite.delete({ where: { id: existingFavorite.id } });
      res.status(200).json({ isFavorite: false });
    } else {
      await prisma.favorite.create({ data: { userId, productId } });
      res.status(200).json({ isFavorite: true });
    }
  } catch (error) {
    res.status(500).json({ error: "Szerver hiba a kedvenceknél" });
  }
};