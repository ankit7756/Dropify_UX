'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import AuthGuard from '../_components/AuthGuard';
import axios from '@/lib/axios';
import { ENDPOINTS } from '@/lib/endpoints';

const deliverySchema = z.object({
    pickupAddress: z.string().min(5, 'Enter a valid pickup address'),
    dropoffAddress: z.string().min(5, 'Enter a valid dropoff address'),
    packageSize: z.enum(['small', 'medium', 'large']),
    packageDescription: z.string().min(3, 'Describe your package briefly'),
});

type DeliveryData = z.infer<typeof deliverySchema>;

const sizeInfo = {
    small: { icon: '📱', label: 'Small', desc: 'Documents, phone accessories', price: 'NPR 150' },
    medium: { icon: '🎒', label: 'Medium', desc: 'Bags, tiffin boxes', price: 'NPR 300' },
    large: { icon: '📦', label: 'Large', desc: 'Furniture, large items', price: 'NPR 500' },
};

const KTM_LOCATIONS: Record<string, { x: number; y: number; label: string }> = {
    thamel: { x: 38, y: 28, label: 'Thamel' },
    patan: { x: 45, y: 72, label: 'Patan' },
    bhaktapur: { x: 78, y: 45, label: 'Bhaktapur' },
    baneshwor: { x: 58, y: 38, label: 'Baneshwor' },
    lalitpur: { x: 47, y: 68, label: 'Lalitpur' },
    boudha: { x: 62, y: 22, label: 'Boudha' },
    kirtipur: { x: 28, y: 62, label: 'Kirtipur' },
    koteshwor: { x: 68, y: 52, label: 'Koteshwor' },
    lazimpat: { x: 42, y: 20, label: 'Lazimpat' },
    balaju: { x: 30, y: 30, label: 'Balaju' },
};

function getLocation(address: string) {
    const lower = address.toLowerCase();
    for (const [key, val] of Object.entries(KTM_LOCATIONS)) {
        if (lower.includes(key)) return val;
    }
    return null;
}

function RouteMapPreview({ pickup, dropoff }: { pickup: string; dropoff: string }) {
    const pickupLoc = getLocation(pickup);
    const dropoffLoc = getLocation(dropoff);
    const hasRoute = pickupLoc && dropoffLoc;

    const distKm = hasRoute
        ? Math.round(Math.sqrt(Math.pow(pickupLoc.x - dropoffLoc.x, 2) + Math.pow(pickupLoc.y - dropoffLoc.y, 2)) * 0.18 * 10) / 10
        : null;
    const timeMin = distKm ? Math.round(distKm * 3.5 + 8) : null;

    return (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 pt-5 pb-3 flex items-center justify-between">
                <h2 className="font-bold text-[#1A1A2E]">Route Preview</h2>
                {hasRoute && (
                    <div className="flex gap-3">
                        <span className="text-xs bg-blue-50 text-blue-600 font-semibold px-2.5 py-1 rounded-full">
                            ~{distKm} km
                        </span>
                        <span className="text-xs bg-orange-50 text-[#FF6B35] font-semibold px-2.5 py-1 rounded-full">
                            ~{timeMin} min
                        </span>
                    </div>
                )}
            </div>

            {/* SVG Map */}
            <div className="relative mx-4 mb-4 rounded-xl overflow-hidden bg-[#e8f0e8]" style={{ height: 220 }}>
                <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
                    {/* Background */}
                    <rect width="100" height="100" fill="#e8f0e8" />

                    {/* Roads */}
                    <line x1="0" y1="38" x2="100" y2="38" stroke="#fff" strokeWidth="1.2" opacity="0.6" />
                    <line x1="0" y1="55" x2="100" y2="55" stroke="#fff" strokeWidth="1.2" opacity="0.6" />
                    <line x1="40" y1="0" x2="40" y2="100" stroke="#fff" strokeWidth="1.2" opacity="0.6" />
                    <line x1="62" y1="0" x2="62" y2="100" stroke="#fff" strokeWidth="1.2" opacity="0.6" />
                    <line x1="20" y1="20" x2="80" y2="80" stroke="#fff" strokeWidth="0.8" opacity="0.4" />
                    <line x1="80" y1="20" x2="20" y2="80" stroke="#fff" strokeWidth="0.8" opacity="0.4" />

                    {/* Ring road */}
                    <ellipse cx="50" cy="50" rx="30" ry="25" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.5" strokeDasharray="3,2" />

                    {/* Water body */}
                    <ellipse cx="52" cy="48" rx="6" ry="4" fill="#b3d4e8" opacity="0.7" />

                    {/* Location dots */}
                    {Object.values(KTM_LOCATIONS).map((loc) => (
                        <g key={loc.label}>
                            <circle cx={loc.x} cy={loc.y} r="1.2" fill="#9CA3AF" opacity="0.6" />
                            <text x={loc.x + 1.5} y={loc.y + 0.5} fontSize="2.5" fill="#6B7280" opacity="0.8">{loc.label}</text>
                        </g>
                    ))}

                    {/* Route line */}
                    {hasRoute && (
                        <>
                            <line
                                x1={pickupLoc.x} y1={pickupLoc.y}
                                x2={dropoffLoc.x} y2={dropoffLoc.y}
                                stroke="#FF6B35" strokeWidth="1.5"
                                strokeDasharray="3,1.5"
                                opacity="0.9"
                            />
                            {/* Pickup marker */}
                            <circle cx={pickupLoc.x} cy={pickupLoc.y} r="3" fill="#22C55E" />
                            <circle cx={pickupLoc.x} cy={pickupLoc.y} r="1.2" fill="white" />
                            {/* Dropoff marker */}
                            <circle cx={dropoffLoc.x} cy={dropoffLoc.y} r="3" fill="#FF6B35" />
                            <circle cx={dropoffLoc.x} cy={dropoffLoc.y} r="1.2" fill="white" />
                        </>
                    )}
                </svg>

                {/* Overlay labels */}
                {hasRoute ? (
                    <>
                        <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-lg shadow">
                            📍 {pickupLoc.label}
                        </div>
                        <div className="absolute top-3 right-3 bg-[#FF6B35] text-white text-xs font-semibold px-2 py-1 rounded-lg shadow">
                            🎯 {dropoffLoc.label}
                        </div>
                    </>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center bg-white/80 backdrop-blur rounded-xl px-5 py-3">
                            <p className="text-gray-600 font-semibold text-sm">Enter addresses to preview route</p>
                            <p className="text-gray-400 text-xs mt-1">Try: Thamel, Patan, Boudha, Baneshwor...</p>
                        </div>
                    </div>
                )}

                {/* Map label */}
                <div className="absolute bottom-2 right-2 bg-black/30 text-white text-xs px-2 py-0.5 rounded">
                    Kathmandu Valley
                </div>
            </div>

            {/* Route info bar */}
            {hasRoute && (
                <div className="mx-4 mb-4 bg-gray-50 rounded-xl p-3 grid grid-cols-3 gap-3 text-center">
                    <div>
                        <p className="text-xs text-gray-400 mb-0.5">Distance</p>
                        <p className="font-bold text-[#1A1A2E] text-sm">{distKm} km</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 mb-0.5">Est. Time</p>
                        <p className="font-bold text-[#1A1A2E] text-sm">{timeMin} min</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 mb-0.5">Traffic</p>
                        <p className="font-bold text-green-500 text-sm">Moderate</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function RequestDeliveryPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const { register, handleSubmit, watch, formState: { errors } } = useForm<DeliveryData>({
        resolver: zodResolver(deliverySchema),
        defaultValues: { packageSize: 'small' },
    });

    const selectedSize = watch('packageSize');
    const pickupAddress = watch('pickupAddress') ?? '';
    const dropoffAddress = watch('dropoffAddress') ?? '';

    const onSubmit = async (data: DeliveryData) => {
        setIsLoading(true);
        setError('');
        try {
            const res = await axios.post(ENDPOINTS.CREATE_DELIVERY, data);
            router.push(`/customer/price-confirmation?deliveryId=${res.data._id}&price=${res.data.estimatedPrice}&size=${res.data.packageSize}`);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create delivery request.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthGuard>
            <div className="space-y-6">

                <div>
                    <h1 className="text-2xl font-bold text-[#1A1A2E]">Request a Delivery</h1>
                    <p className="text-gray-500 text-sm mt-1">Fill in the details and get an instant price estimate</p>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm font-medium">{error}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

                    {/* Left — Form only (no price preview here) */}
                    <form id="delivery-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
                            <h2 className="font-bold text-[#1A1A2E]">Pickup & Dropoff</h2>
                            <div>
                                <label className="block text-sm font-semibold text-[#1A1A2E] mb-1">Pickup Address</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-3 flex items-center text-green-500 text-xs">●</span>
                                    <input
                                        {...register('pickupAddress')}
                                        type="text"
                                        placeholder="e.g. Thamel, Kathmandu"
                                        className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] transition-all"
                                    />
                                </div>
                                {errors.pickupAddress && <p className="text-red-500 text-xs mt-1">⚠ {errors.pickupAddress.message}</p>}
                            </div>
                            <div className="border-l-2 border-dashed border-gray-200 ml-3 h-3" />
                            <div>
                                <label className="block text-sm font-semibold text-[#1A1A2E] mb-1">Dropoff Address</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-3 flex items-center text-red-500 text-xs">●</span>
                                    <input
                                        {...register('dropoffAddress')}
                                        type="text"
                                        placeholder="e.g. Lalitpur, Patan"
                                        className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] transition-all"
                                    />
                                </div>
                                {errors.dropoffAddress && <p className="text-red-500 text-xs mt-1">⚠ {errors.dropoffAddress.message}</p>}
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <h2 className="font-bold text-[#1A1A2E] mb-4">Package Size</h2>
                            <div className="grid grid-cols-3 gap-3">
                                {Object.entries(sizeInfo).map(([size, info]) => (
                                    <label key={size} className={`cursor-pointer rounded-xl border-2 p-4 text-center transition-all ${selectedSize === size ? 'border-[#FF6B35] bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                                        }`}>
                                        <input {...register('packageSize')} type="radio" value={size} className="hidden" />
                                        <div className="text-2xl mb-2">{info.icon}</div>
                                        <p className="font-bold text-[#1A1A2E] text-sm">{info.label}</p>
                                        <p className="text-gray-400 text-xs mt-1">{info.desc}</p>
                                        <p className="text-[#FF6B35] font-bold text-sm mt-2">{info.price}</p>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <h2 className="font-bold text-[#1A1A2E] mb-3">Package Description</h2>
                            <textarea
                                {...register('packageDescription')}
                                rows={4}
                                placeholder="e.g. Phone charger and laptop sleeve in a small box"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] transition-all resize-none"
                            />
                            {errors.packageDescription && <p className="text-red-500 text-xs mt-1">⚠ {errors.packageDescription.message}</p>}
                        </div>

                    </form>

                    {/* Right — Map + Price + Button */}
                    <div className="lg:sticky lg:top-24 space-y-4">

                        <RouteMapPreview pickup={pickupAddress} dropoff={dropoffAddress} />

                        {/* Tips */}
                        <div className="bg-white rounded-2xl p-5 shadow-sm">
                            <h3 className="font-bold text-[#1A1A2E] text-sm mb-3">💡 Tips</h3>
                            <ul className="space-y-2 text-xs text-gray-500">
                                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">●</span>Enter area names like Thamel, Patan, Boudha to preview the route</li>
                                <li className="flex items-start gap-2"><span className="text-[#FF6B35] mt-0.5">●</span>Price is fixed based on package size — no surge pricing</li>
                                <li className="flex items-start gap-2"><span className="text-blue-400 mt-0.5">●</span>Average driver response time is under 5 minutes</li>
                            </ul>
                        </div>

                        {/* Price Preview — moved here */}
                        <div className="bg-gradient-to-br from-[#1A1A2E] to-[#2d2d4e] rounded-2xl p-6 text-white flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Estimated Price</p>
                                <p className="text-3xl font-bold text-[#FF6B35] mt-1">
                                    {sizeInfo[selectedSize as keyof typeof sizeInfo].price}
                                </p>
                                <p className="text-gray-400 text-xs mt-1">Based on {selectedSize} package size</p>
                            </div>
                            <div className="text-5xl">{sizeInfo[selectedSize as keyof typeof sizeInfo].icon}</div>
                        </div>

                        {/* Submit button — full width here */}
                        <button
                            type="submit"
                            form="delivery-form"
                            disabled={isLoading}
                            className="w-full bg-[#FF6B35] text-white py-4 rounded-lg font-bold text-base hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Creating request...' : 'Get Price Confirmation →'}
                        </button>

                    </div>
                </div>
            </div>
        </AuthGuard>
    );
}