'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { ENDPOINTS } from '@/lib/endpoints';

interface Order {
    _id: string;
    earnings: number;
    deliveredAt: string;
    delivery: {
        pickupAddress: string;
        dropoffAddress: string;
        packageSize: string;
    };
}

export default function EarningsPage() {
    const [data, setData] = useState<{ totalEarnings: number; totalDeliveries: number; orders: Order[] }>({
        totalEarnings: 0, totalDeliveries: 0, orders: []
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await axios.get(ENDPOINTS.EARNINGS);
                setData(res.data);
            } catch {
            } finally {
                setIsLoading(false);
            }
        };
        fetch();
    }, []);

    const avgEarning = data.totalDeliveries > 0
        ? Math.round(data.totalEarnings / data.totalDeliveries)
        : 0;

    return (
        <div className="space-y-6">

            <div>
                <h1 className="text-2xl font-bold text-[#1A1A2E]">My Earnings</h1>
                <p className="text-gray-500 text-sm mt-1">Track your income from completed deliveries</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: 'Total Earned', value: `NPR ${data.totalEarnings}`, icon: '💰', color: 'text-[#FF6B35]' },
                    { label: 'Deliveries Done', value: data.totalDeliveries, icon: '✅', color: 'text-green-600' },
                    { label: 'Avg Per Delivery', value: `NPR ${avgEarning}`, icon: '📊', color: 'text-blue-600' },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-sm">
                        <div className="text-3xl mb-3">{stat.icon}</div>
                        <p className={`text-3xl font-bold ${stat.color}`}>{isLoading ? '...' : stat.value}</p>
                        <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Earnings Banner */}
            <div className="bg-gradient-to-r from-[#FF6B35] to-[#ff8c5a] rounded-2xl p-6 text-white">
                <p className="text-white/80 text-sm mb-1">Total Balance</p>
                <p className="text-4xl font-bold">NPR {isLoading ? '...' : data.totalEarnings}</p>
                <p className="text-white/70 text-xs mt-2">From {data.totalDeliveries} completed deliveries</p>
            </div>

            {/* Orders List */}
            <div>
                <h2 className="font-bold text-[#1A1A2E] text-lg mb-4">Delivery History</h2>

                {isLoading ? (
                    <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
                        <p className="text-gray-400 text-sm">Loading history...</p>
                    </div>
                ) : data.orders.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                        <div className="text-5xl mb-4">📭</div>
                        <p className="text-gray-600 font-semibold">No completed deliveries yet</p>
                        <p className="text-gray-400 text-sm mt-1">Your earnings history will appear here</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {data.orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-2xl p-5 shadow-sm flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-lg">✅</div>
                                    <div>
                                        <p className="font-semibold text-[#1A1A2E] text-sm">
                                            {order.delivery?.pickupAddress} → {order.delivery?.dropoffAddress}
                                        </p>
                                        <p className="text-gray-400 text-xs mt-0.5 capitalize">
                                            {order.delivery?.packageSize} package
                                            {order.deliveredAt && ` • ${new Date(order.deliveredAt).toLocaleDateString('en-NP', { day: 'numeric', month: 'short' })}`}
                                        </p>
                                    </div>
                                </div>
                                <p className="font-bold text-[#FF6B35] flex-shrink-0">NPR {order.earnings}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}