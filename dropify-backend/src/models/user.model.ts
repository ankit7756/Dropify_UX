import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    role: 'customer' | 'driver';
    createdAt: Date;
    updatedAt: Date;
}

// User schema definition
const userSchema = new Schema<IUser>(
    {
        fullName: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        phone: {
            type: String,
            required: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ['customer', 'driver'],
            default: 'customer'
        }
    },
    { timestamps: true }
);

export default mongoose.model<IUser>('User', userSchema);