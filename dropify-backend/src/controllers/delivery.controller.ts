import { Request, Response } from 'express';
import Delivery from '../models/delivery.model';

const calculatePrice = (packageSize: string): number => {
    const prices: Record<string, number> = {
        small: 150,
        medium: 300,
        large: 500
    };
    return prices[packageSize] || 150;
};

// Customer creates a delivery request
export const createDelivery = async (req: Request, res: Response): Promise<void> => {
    try {
        const { pickupAddress, dropoffAddress, packageSize, packageDescription } = req.body;
        const estimatedPrice = calculatePrice(packageSize);

        const delivery = await Delivery.create({
            customer: (req as any).user._id,
            pickupAddress,
            dropoffAddress,
            packageSize,
            packageDescription,
            estimatedPrice
        });

        res.status(201).json(delivery);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Get all pending deliveries — for drivers to see
export const getPendingDeliveries = async (req: Request, res: Response): Promise<void> => {
    try {
        const deliveries = await Delivery.find({ status: 'pending' })
            .populate('customer', 'fullName phone')
            .sort({ createdAt: -1 });

        res.json(deliveries);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Get customer's own delivery history
export const getMyDeliveries = async (req: Request, res: Response): Promise<void> => {
    try {
        const deliveries = await Delivery.find({ customer: (req as any).user._id })
            .populate('driver', 'fullName phone')
            .sort({ createdAt: -1 });

        res.json(deliveries);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Get single delivery by ID
export const getDeliveryById = async (req: Request, res: Response): Promise<void> => {
    try {
        const delivery = await Delivery.findById(req.params.id)
            .populate('customer', 'fullName phone')
            .populate('driver', 'fullName phone');

        if (!delivery) {
            res.status(404).json({ message: 'Delivery not found' });
            return;
        }

        res.json(delivery);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Customer cancels a delivery
export const cancelDelivery = async (req: Request, res: Response): Promise<void> => {
    try {
        const delivery = await Delivery.findById(req.params.id);

        if (!delivery) {
            res.status(404).json({ message: 'Delivery not found' });
            return;
        }

        if (delivery.status !== 'pending') {
            res.status(400).json({ message: 'Cannot cancel a delivery that is already in progress' });
            return;
        }

        delivery.status = 'cancelled';
        await delivery.save();

        res.json({ message: 'Delivery cancelled successfully', delivery });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};