'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import axios from '@/lib/axios';
import { ENDPOINTS } from '@/lib/endpoints';

interface EarningsData {
    totalEarnings: number;
    totalDeliveries: number;
    orders: any[];
}

export default function DriverDashboard() {
    const { user } = useAuth();
    const [earnings, setEarnings] = useState<EarningsData>({ totalEarnings: 0, totalDeliveries: 0, orders: [] });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await axios.get(ENDPOINTS.EARNINGS);
                setEarnings(res.data);
            } catch {
            } finally {
                setIsLoading(false);
            }
        };
        fetch();
    }, []);

    const recentOrders = earnings.orders.slice(0, 3);

    return (
        <div className="space-y-8">

            {/* Welcome Banner */}
            <div className="bg-gradient-to-br from-[#1A1A2E] to-[#2d2d4e] rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="absolute right-0 top-0 w-48 h-48 bg-[#FF6B35]/10 rounded-full -translate-y-1/2 translate-x-1/4" />
                <div className="relative z-10">
                    <p className="text-gray-400 text-sm mb-1">Welcome back, Driver 👋</p>
                    <h1 className="text-2xl font-bold mb-1">{user?.fullName}</h1>
                    <p className="text-gray-400 text-sm mb-6">{user?.email}</p>
                    <div className="flex gap-4">
                        <Link
                            href="/driver/jobs"
                            className="bg-[#FF6B35] text-white px-6 py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
                        >
                            View Available Jobs →
                        </Link>
                        <Link
                            href="/driver/active-delivery"
                            className="border border-white/30 text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-white/10 transition-all"
                        >
                            Active Delivery
                        </Link>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                    { label: 'Total Earnings', value: `NPR ${earnings.totalEarnings}`, icon: '💰', color: 'text-[#FF6B35]' },
                    { label: 'Completed Jobs', value: earnings.totalDeliveries, icon: '✅', color: 'text-green-600' },
                    { label: 'Rating', value: '4.9★', icon: '⭐', color: 'text-yellow-500' },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm">
                        <div className="text-2xl mb-2">{stat.icon}</div>
                        <p className={`text-2xl font-bold ${stat.color}`}>{isLoading ? '...' : stat.value}</p>
                        <p className="text-gray-500 text-xs mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-lg font-bold text-[#1A1A2E] mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { href: '/driver/jobs', icon: '🔍', label: 'Find Jobs', desc: 'Browse available deliveries' },
                        { href: '/driver/active-delivery', icon: '🚗', label: 'Active Job', desc: 'View current delivery' },
                        { href: '/driver/earnings', icon: '💰', label: 'Earnings', desc: 'View your income' },
                        { href: '/driver/profile', icon: '👤', label: 'Profile', desc: 'Manage your account' },
                    ].map((action) => (
                        <Link
                            key={action.href}
                            href={action.href}
                            className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group"
                        >
                            <div className="text-3xl mb-3">{action.icon}</div>
                            <p className="font-semibold text-[#1A1A2E] text-sm group-hover:text-[#FF6B35] transition-colors">{action.label}</p>
                            <p className="text-gray-400 text-xs mt-1">{action.desc}</p>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recent Completed */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-[#1A1A2E]">Recent Deliveries</h2>
                    <Link href="/driver/earnings" className="text-sm text-[#FF6B35] hover:underline font-medium">View all →</Link>
                </div>

                {isLoading ? (
                    <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
                        <p className="text-gray-400 text-sm">Loading...</p>
                    </div>
                ) : recentOrders.length === 0 ? (
                    <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
                        <div className="text-4xl mb-3">🚗</div>
                        <p className="font-semibold text-[#1A1A2E]">No deliveries yet</p>
                        <p className="text-gray-400 text-sm mt-1 mb-4">Accept your first job to start earning</p>
                        <Link href="/driver/jobs" className="inline-block bg-[#FF6B35] text-white px-6 py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity">
                            Browse Jobs →
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recentOrders.map((order: any) => (
                            <div key={order._id} className="bg-white rounded-2xl p-5 shadow-sm flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-lg">✅</div>
                                    <div>
                                        <p className="font-semibold text-[#1A1A2E] text-sm">
                                            {order.delivery?.pickupAddress} → {order.delivery?.dropoffAddress}
                                        </p>
                                        <p className="text-gray-400 text-xs mt-0.5 capitalize">{order.delivery?.packageSize} package</p>
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