import { Request, Response } from 'express';
import { prisma } from '../server';

// GET /api/products/categories
export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        products: {
          where: { isActive: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    res.status(200).json(categories);
  } catch (error) {
    console.error('[GetCategories Error]:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/products
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: {
          select: { name: true, slug: true }
        }
      },
      orderBy: { name: 'asc' },
    });

    res.status(200).json(products);
  } catch (error) {
    console.error('[GetProducts Error]:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};