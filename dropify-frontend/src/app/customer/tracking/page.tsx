'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
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
    driver?: { fullName: string; phone: string };
}

function TrackingContent() {
    const searchParams = useSearchParams();
    const deliveryId = searchParams.get('deliveryId');
    const [delivery, setDelivery] = useState<Delivery | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!deliveryId) { setIsLoading(false); return; }
        const fetch = async () => {
            try {
                const res = await axios.get(ENDPOINTS.DELIVERY_BY_ID(deliveryId));
                setDelivery(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetch();
        const interval = setInterval(fetch, 10000);
        return () => clearInterval(interval);
    }, [deliveryId]);

    const statusSteps = [
        { key: 'pending', label: 'Order Placed', desc: 'Looking for a nearby driver', icon: '📋' },
        { key: 'accepted', label: 'Driver Assigned', desc: 'Driver is heading to pickup', icon: '🚗' },
        { key: 'picked_up', label: 'Picked Up', desc: 'Your parcel is on the way', icon: '📦' },
        { key: 'delivered', label: 'Delivered', desc: 'Parcel delivered successfully', icon: '✅' },
    ];

    const statusOrder = ['pending', 'accepted', 'picked_up', 'delivered'];
    const currentIndex = delivery ? statusOrder.indexOf(delivery.status) : 0;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-gray-400 text-sm">Loading tracking info...</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[#1A1A2E]">Live Tracking</h1>
                <p className="text-gray-500 text-sm mt-1">Updates every 10 seconds</p>
            </div>

            {/* Map Placeholder */}
            <div className="bg-gradient-to-br from-[#1A1A2E] to-[#2d2d4e] rounded-2xl overflow-hidden h-48 relative flex items-center justify-center">
                <div className="absolute inset-0 opacity-10">
                    <div className="w-full h-full" style={{
                        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 30px, rgba(255,255,255,0.1) 30px, rgba(255,255,255,0.1) 31px), repeating-linear-gradient(90deg, transparent, transparent 30px, rgba(255,255,255,0.1) 30px, rgba(255,255,255,0.1) 31px)'
                    }} />
                </div>
                <div className="relative z-10 text-center">
                    <div className="text-4xl mb-2">🗺️</div>
                    <p className="text-white font-semibold text-sm">Live Map</p>
                    <p className="text-gray-400 text-xs mt-1">Kathmandu Valley</p>
                </div>
                <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur rounded-lg px-3 py-2">
                    <p className="text-white text-xs font-medium">📍 {delivery?.pickupAddress ?? 'Pickup'}</p>
                </div>
                <div className="absolute bottom-4 right-4 bg-[#FF6B35]/80 backdrop-blur rounded-lg px-3 py-2">
                    <p className="text-white text-xs font-medium">🎯 {delivery?.dropoffAddress ?? 'Dropoff'}</p>
                </div>
            </div>

            {/* Status Steps */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-bold text-[#1A1A2E] mb-6">Delivery Progress</h2>
                <div className="space-y-4">
                    {statusSteps.map((step, i) => {
                        const isDone = i < currentIndex;
                        const isCurrent = i === currentIndex;
                        return (
                            <div key={step.key} className="flex items-start gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${isDone ? 'bg-green-100' : isCurrent ? 'bg-orange-100' : 'bg-gray-100'
                                    }`}>
                                    {isDone ? '✅' : step.icon}
                                </div>
                                <div className="flex-1 pt-1">
                                    <p className={`font-semibold text-sm ${isCurrent ? 'text-[#FF6B35]' : isDone ? 'text-green-600' : 'text-gray-400'}`}>
                                        {step.label}
                                        {isCurrent && <span className="ml-2 text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">Current</span>}
                                    </p>
                                    <p className="text-gray-400 text-xs mt-0.5">{step.desc}</p>
                                </div>
                                {i < statusSteps.length - 1 && (
                                    <div className={`absolute ml-5 mt-10 w-0.5 h-4 ${isDone ? 'bg-green-300' : 'bg-gray-200'}`} />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Driver Card */}
            {delivery?.driver ? (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="font-bold text-[#1A1A2E] mb-4">Your Driver</h2>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-[#FF6B35] font-bold text-lg">
                            {delivery.driver.fullName.charAt(0)}
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-[#1A1A2E]">{delivery.driver.fullName}</p>
                            <p className="text-sm text-gray-500">{delivery.driver.phone}</p>
                            <span className="text-yellow-500 text-xs">★★★★★ 4.9</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
                    <div className="text-3xl mb-2">🔍</div>
                    <p className="text-gray-600 font-semibold text-sm">Finding a driver...</p>
                    <p className="text-gray-400 text-xs mt-1">This usually takes less than 2 minutes</p>
                </div>
            )}

            {delivery?.status === 'delivered' && (
                <Link
                    href="/customer/orders"
                    className="block w-full text-center bg-[#FF6B35] text-white py-3 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity"
                >
                    View All Orders →
                </Link>
            )}
        </div>
    );
}

export default function TrackingPage() {
    return (
        <AuthGuard>
            <Suspense fallback={<div className="text-center py-20"><p className="text-gray-400">Loading...</p></div>}>
                <TrackingContent />
            </Suspense>
        </AuthGuard>
    );
}