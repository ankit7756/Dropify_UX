import mongoose, { Document, Schema } from 'mongoose';

export interface IDelivery extends Document {
    customer: mongoose.Types.ObjectId;
    driver?: mongoose.Types.ObjectId;
    pickupAddress: string;
    dropoffAddress: string;
    packageSize: 'small' | 'medium' | 'large';
    packageDescription: string;
    estimatedPrice: number;
    status: 'pending' | 'accepted' | 'picked_up' | 'delivered' | 'cancelled';
    createdAt: Date;
    updatedAt: Date;
}

const deliverySchema = new Schema<IDelivery>(
    {
        customer: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        driver: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: null
        },
        pickupAddress: {
            type: String,
            required: true,
            trim: true
        },
        dropoffAddress: {
            type: String,
            required: true,
            trim: true
        },
        packageSize: {
            type: String,
            enum: ['small', 'medium', 'large'],
            required: true
        },
        packageDescription: {
            type: String,
            required: true,
            trim: true
        },
        estimatedPrice: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'picked_up', 'delivered', 'cancelled'],
            default: 'pending'
        }
    },
    { timestamps: true }
);

export default mongoose.model<IDelivery>('Delivery', deliverySchema);