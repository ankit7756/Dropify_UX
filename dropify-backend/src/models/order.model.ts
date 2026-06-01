import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
    delivery: mongoose.Types.ObjectId;
    driver: mongoose.Types.ObjectId;
    customer: mongoose.Types.ObjectId;
    status: 'accepted' | 'picked_up' | 'delivered' | 'cancelled';
    acceptedAt: Date;
    pickedUpAt?: Date;
    deliveredAt?: Date;
    earnings: number;
    createdAt: Date;
    updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
    {
        delivery: {
            type: Schema.Types.ObjectId,
            ref: 'Delivery',
            required: true
        },
        driver: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        customer: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        status: {
            type: String,
            enum: ['accepted', 'picked_up', 'delivered', 'cancelled'],
            default: 'accepted'
        },
        acceptedAt: {
            type: Date,
            default: Date.now
        },
        pickedUpAt: {
            type: Date
        },
        deliveredAt: {
            type: Date
        },
        earnings: {
            type: Number,
            required: true
        }
    },
    { timestamps: true }
);

export default mongoose.model<IOrder>('Order', orderSchema);