'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import AuthGuard from '../../_components/AuthGuard';
import axios from '@/lib/axios';
import { ENDPOINTS } from '@/lib/endpoints';

interface Delivery {
    _id: string;
    pickupAddress: string;
    dropoffAddress: string;
    packageSize: string;
    packageDescription: string;
    estimatedPrice: number;
    status: 'pending' | 'accepted' | 'picked_up' | 'delivered' | 'cancelled';
    createdAt: string;
    driver?: { fullName: string; phone: string };
    customer: { fullName: string; phone: string };
}

const statusConfig = {
    pending: { label: 'Pending', bg: 'bg-yellow-100', text: 'text-yellow-700', icon: '⏳' },
    accepted: { label: 'Accepted', bg: 'bg-blue-100', text: 'text-blue-700', icon: '✅' },
    picked_up: { label: 'Picked Up', bg: 'bg-purple-100', text: 'text-purple-700', icon: '📦' },
    delivered: { label: 'Delivered', bg: 'bg-green-100', text: 'text-green-700', icon: '🎉' },
    cancelled: { label: 'Cancelled', bg: 'bg-red-100', text: 'text-red-700', icon: '❌' },
};

const steps = ['pending', 'accepted', 'picked_up', 'delivered'];

export default function OrderDetailPage() {
    const { id } = useParams();
    const [delivery, setDelivery] = useState<Delivery | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await axios.get(ENDPOINTS.DELIVERY_BY_ID(id as string));
                setDelivery(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetch();
    }, [id]);

    const handleCancel = async () => {
        if (!delivery) return;
        setCancelling(true);
        try {
            await axios.patch(ENDPOINTS.CANCEL_DELIVERY(delivery._id));
            setDelivery({ ...delivery, status: 'cancelled' });
        } catch (err) {
            console.error(err);
        } finally {
            setCancelling(false);
        }
    };

    if (isLoading) {
        return (
            <AuthGuard>
                <div className="flex items-center justify-center py-20">
                    <p className="text-gray-400 text-sm">Loading order details...</p>
                </div>
            </AuthGuard>
        );
    }

    if (!delivery) {
        return (
            <AuthGuard>
                <div className="text-center py-20">
                    <p className="text-gray-600 font-semibold">Order not found</p>
                    <Link href="/customer/orders" className="text-[#FF6B35] text-sm mt-2 inline-block hover:underline">
                        ← Back to orders
                    </Link>
                </div>
            </AuthGuard>
        );
    }

    const status = statusConfig[delivery.status];
    const currentStep = steps.indexOf(delivery.status);

    return (
        <AuthGuard>
            <div className="space-y-6 max-w-2xl mx-auto">

                {/* Back */}
                <Link href="/customer/orders" className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#FF6B35] transition-colors">
                    ← Back to orders
                </Link>

                {/* Status Card */}
                <div className="bg-gradient-to-br from-[#1A1A2E] to-[#2d2d4e] rounded-2xl p-8 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${status.bg} ${status.text}`}>
                            {status.icon} {status.label}
                        </span>
                        <span className="text-gray-400 text-xs">
                            {new Date(delivery.createdAt).toLocaleDateString('en-NP', {
                                day: 'numeric', month: 'short', year: 'numeric'
                            })}
                        </span>
                    </div>
                    <p className="text-gray-300 text-sm mb-1">Order ID</p>
                    <p className="font-mono text-xs text-gray-400">{delivery._id}</p>

                    {/* Progress Steps */}
                    {delivery.status !== 'cancelled' && (
                        <div className="mt-6">
                            <div className="flex items-center justify-between relative">
                                <div className="absolute top-3 left-0 right-0 h-0.5 bg-white/10" />
                                <div
                                    className="absolute top-3 left-0 h-0.5 bg-[#FF6B35] transition-all"
                                    style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                                />
                                {steps.map((step, i) => (
                                    <div key={step} className="flex flex-col items-center gap-2 relative z-10">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i <= currentStep ? 'bg-[#FF6B35] text-white' : 'bg-white/10 text-gray-500'
                                            }`}>
                                            {i < currentStep ? '✓' : i + 1}
                                        </div>
                                        <span className="text-xs text-gray-400 capitalize hidden sm:block">
                                            {step === 'picked_up' ? 'Picked Up' : step.charAt(0).toUpperCase() + step.slice(1)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Delivery Details */}
                <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
                    <h2 className="font-bold text-[#1A1A2E]">Delivery Details</h2>
                    <div className="space-y-3">
                        <div className="flex items-start gap-3">
                            <span className="w-2.5 h-2.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                            <div>
                                <p className="text-xs text-gray-400 mb-0.5">Pickup</p>
                                <p className="text-sm font-medium text-[#1A1A2E]">{delivery.pickupAddress}</p>
                            </div>
                        </div>
                        <div className="border-l-2 border-dashed border-gray-200 ml-1 h-4" />
                        <div className="flex items-start gap-3">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                            <div>
                                <p className="text-xs text-gray-400 mb-0.5">Dropoff</p>
                                <p className="text-sm font-medium text-[#1A1A2E]">{delivery.dropoffAddress}</p>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-100 pt-4 grid grid-cols-3 gap-4">
                        <div>
                            <p className="text-xs text-gray-400 mb-1">Package Size</p>
                            <p className="text-sm font-semibold text-[#1A1A2E] capitalize">{delivery.packageSize}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 mb-1">Description</p>
                            <p className="text-sm font-semibold text-[#1A1A2E]">{delivery.packageDescription}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 mb-1">Price</p>
                            <p className="text-sm font-bold text-[#FF6B35]">NPR {delivery.estimatedPrice}</p>
                        </div>
                    </div>
                </div>

                {/* Driver Info */}
                {delivery.driver ? (
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <h2 className="font-bold text-[#1A1A2E] mb-4">Driver Info</h2>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-[#FF6B35] font-bold text-lg">
                                {delivery.driver.fullName.charAt(0)}
                            </div>
                            <div>
                                <p className="font-semibold text-[#1A1A2E]">{delivery.driver.fullName}</p>
                                <p className="text-sm text-gray-500">{delivery.driver.phone}</p>
                            </div>
                            <div className="ml-auto">
                                <span className="text-yellow-500 text-sm">★★★★★</span>
                                <p className="text-xs text-gray-400 text-right">4.9</p>
                            </div>
                        </div>
                    </div>
                ) : delivery.status === 'pending' ? (
                    <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
                        <div className="text-3xl mb-2">🔍</div>
                        <p className="text-gray-600 font-semibold text-sm">Looking for a driver...</p>
                        <p className="text-gray-400 text-xs mt-1">A nearby driver will accept your request shortly</p>
                    </div>
                ) : null}

                {/* Cancel Button */}
                {delivery.status === 'pending' && (
                    <button
                        onClick={handleCancel}
                        disabled={cancelling}
                        className="w-full border-2 border-red-200 text-red-500 py-3 rounded-lg font-semibold text-sm hover:bg-red-50 transition-all disabled:opacity-60"
                    >
                        {cancelling ? 'Cancelling...' : 'Cancel Delivery'}
                    </button>
                )}

            </div>
        </AuthGuard>
    );
}