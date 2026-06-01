import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/auth.routes';
import deliveryRoutes from './routes/delivery.routes';
import orderRoutes from './routes/order.routes';

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Dropify Backend Running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Dropify server running on port ${PORT}`);
});