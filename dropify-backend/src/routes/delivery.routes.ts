import { Router } from 'express';
import { createDelivery, getPendingDeliveries, getMyDeliveries, getDeliveryById, cancelDelivery } from '../controllers/delivery.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.post('/', protect, createDelivery);
router.get('/pending', protect, getPendingDeliveries);
router.get('/my', protect, getMyDeliveries);
router.get('/:id', protect, getDeliveryById);
router.patch('/:id/cancel', protect, cancelDelivery);

export default router;