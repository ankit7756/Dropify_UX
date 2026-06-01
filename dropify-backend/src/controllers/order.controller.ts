import { Request, Response } from 'express';
import Order from '../models/order.model';
import Delivery from '../models/delivery.model';

// Driver accepts a delivery request
export const acceptDelivery = async (req: Request, res: Response): Promise<void> => {
    try {
        const delivery = await Delivery.findById(req.params.deliveryId);

        if (!delivery) {
            res.status(404).json({ message: 'Delivery not found' });
            return;
        }

        if (delivery.status !== 'pending') {
            res.status(400).json({ message: 'Delivery is no longer available' });
            return;
        }

        delivery.status = 'accepted';
        delivery.driver = (req as any).user._id;
        await delivery.save();

        const order = await Order.create({
            delivery: delivery._id,
            driver: (req as any).user._id,
            customer: delivery.customer,
            status: 'accepted',
            earnings: delivery.estimatedPrice
        });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Driver marks as picked up
export const markPickedUp = async (req: Request, res: Response): Promise<void> => {
    try {
        const order = await Order.findById(req.params.orderId);

        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }

        if (order.status !== 'accepted') {
            res.status(400).json({ message: 'Order must be accepted before picking up' });
            return;
        }

        order.status = 'picked_up';
        order.pickedUpAt = new Date();
        await order.save();

        await Delivery.findByIdAndUpdate(order.delivery, { status: 'picked_up' });

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Driver marks as delivered
export const markDelivered = async (req: Request, res: Response): Promise<void> => {
    try {
        const order = await Order.findById(req.params.orderId);

        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }

        if (order.status !== 'picked_up') {
            res.status(400).json({ message: 'Order must be picked up before marking delivered' });
            return;
        }

        order.status = 'delivered';
        order.deliveredAt = new Date();
        await order.save();

        await Delivery.findByIdAndUpdate(order.delivery, { status: 'delivered' });

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Driver gets their active orders
export const getMyOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const orders = await Order.find({ driver: (req as any).user._id })
            .populate('delivery')
            .populate('customer', 'fullName phone')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Driver gets earnings from completed orders
export const getEarnings = async (req: Request, res: Response): Promise<void> => {
    try {
        const orders = await Order.find({
            driver: (req as any).user._id,
            status: 'delivered'
        }).populate('delivery', 'pickupAddress dropoffAddress packageSize estimatedPrice');

        const totalEarnings = orders.reduce((sum, order) => sum + order.earnings, 0);

        res.json({
            totalEarnings,
            totalDeliveries: orders.length,
            orders
        });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};