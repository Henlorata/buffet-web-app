import { Router } from 'express';
import { getCategories, getProducts } from '../controllers/ProductController';

const router = Router();

// Public routes
router.get('/categories', getCategories);
router.get('/', getProducts);

export default router;