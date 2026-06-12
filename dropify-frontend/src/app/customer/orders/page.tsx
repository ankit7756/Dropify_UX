'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AuthGuard from '../_components/AuthGuard';
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
    driver?: { fullName: string; phone: string };
}

const statusConfig = {
    pending: { label: 'Pending', bg: 'bg-yellow-100', text: 'text-yellow-700' },
    accepted: { label: 'Accepted', bg: 'bg-blue-100', text: 'text-blue-700' },
    picked_up: { label: 'Picked Up', bg: 'bg-purple-100', text: 'text-purple-700' },
    delivered: { label: 'Delivered', bg: 'bg-green-100', text: 'text-green-700' },
    cancelled: { label: 'Cancelled', bg: 'bg-red-100', text: 'text-red-700' },
};

export default function OrdersPage() {
    const [deliveries, setDeliveries] = useState<Delivery[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await axios.get(ENDPOINTS.MY_DELIVERIES);
                setDeliveries(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetch();
    }, []);

    const filtered = filter === 'all' ? deliveries : deliveries.filter(d => d.status === filter);

    return (
        <AuthGuard>
            <div className="space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#1A1A2E]">My Orders</h1>
                        <p className="text-gray-500 text-sm mt-1">Track and manage all your deliveries</p>
                    </div>
                    <Link
                        href="/customer/request-delivery"
                        className="bg-[#FF6B35] text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
                    >
                        + New Delivery
                    </Link>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 flex-wrap">
                    {['all', 'pending', 'accepted', 'picked_up', 'delivered', 'cancelled'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all capitalize ${filter === f
                                    ? 'bg-[#FF6B35] text-white'
                                    : 'bg-white text-gray-500 hover:text-[#FF6B35] border border-gray-200'
                                }`}
                        >
                            {f === 'picked_up' ? 'Picked Up' : f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Orders List */}
                {isLoading ? (
                    <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
                        <p className="text-gray-400 text-sm">Loading orders...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                        <div className="text-5xl mb-4">📭</div>
                        <p className="text-gray-600 font-semibold mb-1">No orders found</p>
                        <p className="text-gray-400 text-sm mb-6">
                            {filter === 'all' ? 'Start by requesting your first delivery' : `No ${filter} orders`}
                        </p>
                        {filter === 'all' && (
                            <Link
                                href="/customer/request-delivery"
                                className="inline-block bg-[#FF6B35] text-white px-6 py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
                            >
                                Send a Parcel
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filtered.map((delivery) => {
                            const status = statusConfig[delivery.status];
                            return (
                                <Link
                                    key={delivery._id}
                                    href={`/customer/orders/${delivery._id}`}
                                    className="block bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.bg} ${status.text}`}>
                                                    {status.label}
                                                </span>
                                                <span className="text-xs text-gray-400 capitalize">{delivery.packageSize} package</span>
                                                {delivery.driver && (
                                                    <span className="text-xs text-gray-400">• Driver: {delivery.driver.fullName}</span>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                                                    <span className="text-gray-700 truncate">{delivery.pickupAddress}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                                                    <span className="text-gray-700 truncate">{delivery.dropoffAddress}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="font-bold text-[#FF6B35]">NPR {delivery.estimatedPrice}</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {new Date(delivery.createdAt).toLocaleDateString('en-NP', {
                                                    day: 'numeric', month: 'short', year: 'numeric'
                                                })}
                                            </p>
                                            <p className="text-xs text-[#FF6B35] mt-2 font-medium">View details →</p>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </AuthGuard>
    );
}