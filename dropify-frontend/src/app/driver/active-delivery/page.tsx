'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { ENDPOINTS } from '@/lib/endpoints';

interface Order {
    _id: string;
    status: 'accepted' | 'picked_up' | 'delivered' | 'cancelled';
    earnings: number;
    delivery: {
        pickupAddress: string;
        dropoffAddress: string;
        packageSize: string;
        packageDescription: string;
        estimatedPrice: number;
    };
    customer: { fullName: string; phone: string };
}

export default function ActiveDeliveryPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);

    const fetchOrders = async () => {
        try {
            const res = await axios.get(ENDPOINTS.MY_ORDERS);
            const active = res.data.filter((o: Order) => o.status !== 'delivered' && o.status !== 'cancelled');
            setOrders(active);
        } catch {
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handlePickup = async (orderId: string) => {
        setUpdating(orderId);
        try {
            await axios.patch(ENDPOINTS.MARK_PICKUP(orderId));
            fetchOrders();
        } catch {
        } finally {
            setUpdating(null);
        }
    };

    const handleDeliver = async (orderId: string) => {
        setUpdating(orderId);
        try {
            await axios.patch(ENDPOINTS.MARK_DELIVERED(orderId));
            fetchOrders();
        } catch {
        } finally {
            setUpdating(null);
        }
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">

            <div>
                <h1 className="text-2xl font-bold text-[#1A1A2E]">Active Delivery</h1>
                <p className="text-gray-500 text-sm mt-1">Manage your current jobs</p>
            </div>

            {isLoading ? (
                <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
                    <p className="text-gray-400 text-sm">Loading...</p>
                </div>
            ) : orders.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                    <div className="text-5xl mb-4">🚗</div>
                    <p className="text-gray-600 font-semibold">No active deliveries</p>
                    <p className="text-gray-400 text-sm mt-1 mb-6">Accept a job from Available Jobs to get started</p>
                    <a href="/driver/jobs" className="inline-block bg-[#FF6B35] text-white px-6 py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity">
                        Browse Jobs →
                    </a>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white rounded-2xl shadow-sm overflow-hidden">

                            {/* Status Banner */}
                            <div className={`px-6 py-3 text-sm font-semibold ${order.status === 'accepted' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                                }`}>
                                {order.status === 'accepted' ? '🔵 Head to pickup location' : '🟣 Parcel picked up — deliver now'}
                            </div>

                            <div className="p-6 space-y-5">

                                {/* Route */}
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <span className="w-3 h-3 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs text-gray-400">Pickup</p>
                                            <p className="font-semibold text-[#1A1A2E] text-sm">{order.delivery?.pickupAddress}</p>
                                        </div>
                                    </div>
                                    <div className="border-l-2 border-dashed border-gray-200 ml-1.5 h-4" />
                                    <div className="flex items-start gap-3">
                                        <span className="w-3 h-3 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs text-gray-400">Dropoff</p>
                                            <p className="font-semibold text-[#1A1A2E] text-sm">{order.delivery?.dropoffAddress}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Package Info */}
                                <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <p className="text-xs text-gray-400 mb-1">Size</p>
                                        <p className="font-semibold text-[#1A1A2E] text-sm capitalize">{order.delivery?.packageSize}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 mb-1">Earnings</p>
                                        <p className="font-bold text-[#FF6B35] text-sm">NPR {order.earnings}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 mb-1">Customer</p>
                                        <p className="font-semibold text-[#1A1A2E] text-sm">{order.customer?.fullName?.split(' ')[0]}</p>
                                    </div>
                                </div>

                                {/* Action Button */}
                                {order.status === 'accepted' && (
                                    <button
                                        onClick={() => handlePickup(order._id)}
                                        disabled={updating === order._id}
                                        className="w-full bg-[#1A1A2E] text-white py-3 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
                                    >
                                        {updating === order._id ? 'Updating...' : '📦 Mark as Picked Up'}
                                    </button>
                                )}

                                {order.status === 'picked_up' && (
                                    <button
                                        onClick={() => handleDeliver(order._id)}
                                        disabled={updating === order._id}
                                        className="w-full bg-[#FF6B35] text-white py-3 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
                                    >
                                        {updating === order._id ? 'Updating...' : '✅ Mark as Delivered'}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}