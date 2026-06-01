import { Router } from 'express';
import {
    acceptDelivery,
    markPickedUp,
    markDelivered,
    getMyOrders,
    getEarnings
} from '../controllers/order.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.post('/accept/:deliveryId', protect, acceptDelivery);
router.patch('/:orderId/pickup', protect, markPickedUp);
router.patch('/:orderId/deliver', protect, markDelivered);
router.get('/my', protect, getMyOrders);
router.get('/earnings', protect, getEarnings);

export default router;