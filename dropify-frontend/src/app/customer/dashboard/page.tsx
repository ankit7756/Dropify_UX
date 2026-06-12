'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import axios from '@/lib/axios';
import { ENDPOINTS } from '@/lib/endpoints';

interface Delivery {
    _id: string;
    pickupAddress: string;
    dropoffAddress: string;
    packageSize: string;
    estimatedPrice: number;
    status: 'pending' | 'accepted' | 'picked_up' | 'delivered' | 'cancelled';
    createdAt: string;
}

const statusConfig = {
    pending: { label: 'Pending', bg: 'bg-yellow-100', text: 'text-yellow-700' },
    accepted: { label: 'Accepted', bg: 'bg-blue-100', text: 'text-blue-700' },
    picked_up: { label: 'Picked Up', bg: 'bg-purple-100', text: 'text-purple-700' },
    delivered: { label: 'Delivered', bg: 'bg-green-100', text: 'text-green-700' },
    cancelled: { label: 'Cancelled', bg: 'bg-red-100', text: 'text-red-700' },
};

export default function CustomerDashboard() {
    const { user } = useAuth();
    const [deliveries, setDeliveries] = useState<Delivery[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDeliveries = async () => {
            try {
                const res = await axios.get(ENDPOINTS.MY_DELIVERIES);
                setDeliveries(res.data);
            } catch (err) {
                console.error('Failed to fetch deliveries');
            } finally {
                setIsLoading(false);
            }
        };
        fetchDeliveries();
    }, []);

    const active = deliveries.filter(d => ['pending', 'accepted', 'picked_up'].includes(d.status));
    const completed = deliveries.filter(d => d.status === 'delivered');
    const cancelled = deliveries.filter(d => d.status === 'cancelled');

    return (
        <div className="space-y-8">

            {/* Welcome */}
            <div className="bg-gradient-to-br from-[#1A1A2E] to-[#2d2d4e] rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="absolute right-0 top-0 w-48 h-48 bg-[#FF6B35]/10 rounded-full -translate-y-1/2 translate-x-1/4" />
                <div className="relative z-10">
                    <p className="text-gray-400 text-sm mb-1">Welcome back 👋</p>
                    <h1 className="text-2xl font-bold mb-1">{user?.fullName}</h1>
                    <p className="text-gray-400 text-sm">{user?.email}</p>
                    <Link
                        href="/customer/request-delivery"
                        className="inline-block mt-6 bg-[#FF6B35] text-white px-6 py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
                    >
                        + Request New Delivery
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Orders', value: deliveries.length, icon: '📦', color: 'text-[#1A1A2E]' },
                    { label: 'Active', value: active.length, icon: '🚗', color: 'text-blue-600' },
                    { label: 'Delivered', value: completed.length, icon: '✅', color: 'text-green-600' },
                    { label: 'Cancelled', value: cancelled.length, icon: '❌', color: 'text-red-500' },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm">
                        <div className="text-2xl mb-2">{stat.icon}</div>
                        <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                        <p className="text-gray-500 text-xs mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-lg font-bold text-[#1A1A2E] mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { href: '/customer/request-delivery', icon: '📦', label: 'Send Parcel', desc: 'Request a delivery' },
                        { href: '/customer/orders', icon: '📋', label: 'My Orders', desc: 'View all orders' },
                        { href: '/customer/tracking', icon: '📍', label: 'Track Order', desc: 'Live tracking' },
                        { href: '/customer/support', icon: '💬', label: 'Support', desc: 'Get help' },
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

            {/* Recent Orders */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-[#1A1A2E]">Recent Orders</h2>
                    <Link href="/customer/orders" className="text-sm text-[#FF6B35] hover:underline font-medium">
                        View all →
                    </Link>
                </div>

                {isLoading ? (
                    <div className="bg-white rounded-2xl p-8 text-center">
                        <p className="text-gray-400 text-sm">Loading orders...</p>
                    </div>
                ) : deliveries.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                        <div className="text-5xl mb-4">📭</div>
                        <p className="text-gray-600 font-semibold mb-1">No orders yet</p>
                        <p className="text-gray-400 text-sm mb-6">Start by requesting your first delivery</p>
                        <Link
                            href="/customer/request-delivery"
                            className="inline-block bg-[#FF6B35] text-white px-6 py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
                        >
                            Send a Parcel
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {deliveries.slice(0, 5).map((delivery) => {
                            const status = statusConfig[delivery.status];
                            return (
                                <div key={delivery._id} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.bg} ${status.text}`}>
                                                    {status.label}
                                                </span>
                                                <span className="text-xs text-gray-400 capitalize">{delivery.packageSize} package</span>
                                            </div>
                                            <div className="flex items-start gap-2 text-sm">
                                                <div className="flex flex-col gap-1 flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-green-500 text-xs">●</span>
                                                        <span className="text-gray-700 truncate">{delivery.pickupAddress}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-red-500 text-xs">●</span>
                                                        <span className="text-gray-700 truncate">{delivery.dropoffAddress}</span>
                                                    </div>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <p className="font-bold text-[#FF6B35]">NPR {delivery.estimatedPrice}</p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {new Date(delivery.createdAt).toLocaleDateString('en-NP', {
                                                            day: 'numeric', month: 'short'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

        </div>
    );
}