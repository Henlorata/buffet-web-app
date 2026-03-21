import { Router } from 'express';
import { createOrder, getOrders, updateOrderStatus } from '../controllers/OrderController';
import { requireAuth } from '../middlewares/requireAuth';

const router = Router();

// ALL order routes require authentication
router.use(requireAuth);

router.post('/', createOrder);
router.get('/', getOrders);
router.patch('/:id/status', updateOrderStatus);

export default router;