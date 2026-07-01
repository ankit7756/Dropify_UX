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

const driverPositions: Record<string, { x: number; y: number }> = {
    pending: { x: 38, y: 28 },
    accepted: { x: 44, y: 35 },
    picked_up: { x: 50, y: 50 },
    delivered: { x: 45, y: 68 },
};

function LiveMapSection({ delivery }: { delivery: Delivery | null }) {
    const status = delivery?.status ?? 'pending';
    const driverPos = driverPositions[status] ?? driverPositions.pending;

    return (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 pt-5 pb-3 flex items-center justify-between">
                <div>
                    <h2 className="font-bold text-[#1A1A2E]">Live Tracking</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Kathmandu Valley • Updates every 10s</p>
                </div>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    Live
                </span>
            </div>

            <div className="relative mx-4 rounded-xl overflow-hidden bg-[#e8f0e8]" style={{ height: 260 }}>
                <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
                    <rect width="100" height="100" fill="#e8f0e8" />

                    {/* Roads */}
                    <line x1="0" y1="38" x2="100" y2="38" stroke="#fff" strokeWidth="1.2" opacity="0.6" />
                    <line x1="0" y1="55" x2="100" y2="55" stroke="#fff" strokeWidth="1.2" opacity="0.6" />
                    <line x1="40" y1="0" x2="40" y2="100" stroke="#fff" strokeWidth="1.2" opacity="0.6" />
                    <line x1="62" y1="0" x2="62" y2="100" stroke="#fff" strokeWidth="1.2" opacity="0.6" />
                    <line x1="20" y1="20" x2="80" y2="80" stroke="#fff" strokeWidth="0.8" opacity="0.4" />
                    <ellipse cx="50" cy="50" rx="30" ry="25" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.5" strokeDasharray="3,2" />
                    <ellipse cx="52" cy="48" rx="6" ry="4" fill="#b3d4e8" opacity="0.7" />

                    {/* Location labels */}
                    {[
                        { x: 38, y: 28, label: 'Thamel' },
                        { x: 45, y: 72, label: 'Patan' },
                        { x: 62, y: 22, label: 'Boudha' },
                        { x: 58, y: 38, label: 'Baneshwor' },
                        { x: 68, y: 52, label: 'Koteshwor' },
                    ].map((loc) => (
                        <g key={loc.label}>
                            <circle cx={loc.x} cy={loc.y} r="1" fill="#9CA3AF" opacity="0.5" />
                            <text x={loc.x + 1.5} y={loc.y + 0.5} fontSize="2.5" fill="#6B7280" opacity="0.7">{loc.label}</text>
                        </g>
                    ))}

                    {/* Route line */}
                    <line x1="38" y1="28" x2="45" y2="72"
                        stroke="#FF6B35" strokeWidth="1.5" strokeDasharray="3,1.5" opacity="0.7" />

                    {/* Pickup */}
                    <circle cx={38} cy={28} r="3" fill="#22C55E" />
                    <circle cx={38} cy={28} r="1.2" fill="white" />

                    {/* Dropoff */}
                    <circle cx={45} cy={72} r="3" fill="#FF6B35" />
                    <circle cx={45} cy={72} r="1.2" fill="white" />

                    {/* Driver position */}
                    {status !== 'delivered' && (
                        <>
                            <circle cx={driverPos.x} cy={driverPos.y} r="4.5" fill="#1A1A2E" opacity="0.15" />
                            <circle cx={driverPos.x} cy={driverPos.y} r="3" fill="#1A1A2E" />
                            <text x={driverPos.x} y={driverPos.y + 1} fontSize="3" fill="white" textAnchor="middle">🚗</text>
                        </>
                    )}
                </svg>

                {/* Overlay badges */}
                <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-lg shadow">
                    📍 {delivery?.pickupAddress?.split(',')[0] ?? 'Pickup'}
                </div>
                <div className="absolute top-3 right-3 bg-[#FF6B35] text-white text-xs font-semibold px-2 py-1 rounded-lg shadow">
                    🎯 {delivery?.dropoffAddress?.split(',')[0] ?? 'Dropoff'}
                </div>

                {status === 'delivered' && (
                    <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                        <div className="bg-white rounded-xl px-5 py-3 text-center shadow-lg">
                            <div className="text-3xl mb-1">🎉</div>
                            <p className="font-bold text-green-600 text-sm">Delivered!</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Info bar */}
            <div className="mx-4 my-4 bg-gray-50 rounded-xl p-3 grid grid-cols-3 gap-3 text-center">
                <div>
                    <p className="text-xs text-gray-400 mb-0.5">Est. Time</p>
                    <p className="font-bold text-[#1A1A2E] text-sm">
                        {status === 'delivered' ? 'Done' : status === 'pending' ? 'TBD' : '~15 min'}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-gray-400 mb-0.5">Distance</p>
                    <p className="font-bold text-[#1A1A2E] text-sm">~4.2 km</p>
                </div>
                <div>
                    <p className="text-xs text-gray-400 mb-0.5">Price</p>
                    <p className="font-bold text-[#FF6B35] text-sm">NPR {delivery?.estimatedPrice ?? '—'}</p>
                </div>
            </div>
        </div>
    );
}

function TrackingContent() {
    const searchParams = useSearchParams();
    const deliveryId = searchParams.get('deliveryId');
    const [delivery, setDelivery] = useState<Delivery | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!deliveryId) { setIsLoading(false); return; }
        const fetchData = async () => {
            try {
                const res = await axios.get(ENDPOINTS.DELIVERY_BY_ID(deliveryId));
                setDelivery(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, [deliveryId]);

    const statusSteps = [
        { key: 'pending', label: 'Order Placed', desc: 'Looking for a nearby driver', icon: '📋' },
        { key: 'accepted', label: 'Driver Assigned', desc: 'Driver is heading to your pickup', icon: '🚗' },
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

            {/* Left — Map */}
            <div className="space-y-4">
                <LiveMapSection delivery={delivery} />

                {/* Driver Card */}
                {delivery?.driver ? (
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
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
                            <div className="text-right">
                                <span className="text-xs bg-green-50 text-green-600 font-semibold px-2.5 py-1 rounded-full">On the way</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl p-5 shadow-sm text-center">
                        <div className="text-3xl mb-2">🔍</div>
                        <p className="text-gray-600 font-semibold text-sm">Finding a driver...</p>
                        <p className="text-gray-400 text-xs mt-1">This usually takes less than 2 minutes</p>
                    </div>
                )}
            </div>

            {/* Right — Status */}
            <div className="space-y-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#1A1A2E]">Live Tracking</h1>
                    <p className="text-gray-500 text-sm mt-1">Auto-refreshes every 10 seconds</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="font-bold text-[#1A1A2E] mb-6">Delivery Progress</h2>
                    <div className="space-y-5">
                        {statusSteps.map((step, i) => {
                            const isDone = i < currentIndex;
                            const isCurrent = i === currentIndex;
                            return (
                                <div key={step.key} className="flex items-start gap-4 relative">
                                    {i < statusSteps.length - 1 && (
                                        <div className={`absolute left-5 top-10 w-0.5 h-5 ${isDone ? 'bg-green-300' : 'bg-gray-200'}`} />
                                    )}
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${isDone ? 'bg-green-100' : isCurrent ? 'bg-orange-100' : 'bg-gray-100'
                                        }`}>
                                        {isDone ? '✅' : step.icon}
                                    </div>
                                    <div className="flex-1 pt-1.5">
                                        <div className="flex items-center gap-2">
                                            <p className={`font-semibold text-sm ${isCurrent ? 'text-[#FF6B35]' : isDone ? 'text-green-600' : 'text-gray-400'
                                                }`}>
                                                {step.label}
                                            </p>
                                            {isCurrent && (
                                                <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">
                                                    Current
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-400 text-xs mt-0.5">{step.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Order Summary */}
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                    <h2 className="font-bold text-[#1A1A2E] mb-4">Order Summary</h2>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                            <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                            <span className="text-gray-500 text-xs w-12 flex-shrink-0">From</span>
                            <span className="text-[#1A1A2E] font-medium">{delivery?.pickupAddress ?? '—'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                            <span className="text-gray-500 text-xs w-12 flex-shrink-0">To</span>
                            <span className="text-[#1A1A2E] font-medium">{delivery?.dropoffAddress ?? '—'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                            <span className="text-gray-500 text-xs w-12 flex-shrink-0">Size</span>
                            <span className="text-[#1A1A2E] font-medium capitalize">{delivery?.packageSize ?? '—'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="w-2 h-2 rounded-full bg-[#FF6B35] flex-shrink-0" />
                            <span className="text-gray-500 text-xs w-12 flex-shrink-0">Price</span>
                            <span className="text-[#FF6B35] font-bold">NPR {delivery?.estimatedPrice ?? '—'}</span>
                        </div>
                    </div>
                </div>

                {delivery?.status === 'delivered' && (
                    <Link
                        href="/customer/orders"
                        className="block w-full text-center bg-[#FF6B35] text-white py-3 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity"
                    >
                        View All Orders →
                    </Link>
                )}
            </div>
        </div>
    );
}

export default function TrackingPage() {
    return (
        <AuthGuard>
            <Suspense fallback={
                <div className="text-center py-20">
                    <p className="text-gray-400">Loading...</p>
                </div>
            }>
                <TrackingContent />
            </Suspense>
        </AuthGuard>
    );
}