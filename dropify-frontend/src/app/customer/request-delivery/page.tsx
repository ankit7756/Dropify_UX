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

export default function RequestDeliveryPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const { register, handleSubmit, watch, formState: { errors } } = useForm<DeliveryData>({
        resolver: zodResolver(deliverySchema),
        defaultValues: { packageSize: 'small' },
    });

    const selectedSize = watch('packageSize');

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
            <div className="max-w-2xl mx-auto space-y-6">

                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-[#1A1A2E]">Request a Delivery</h1>
                    <p className="text-gray-500 text-sm mt-1">Fill in the details and get an instant price estimate</p>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm font-medium">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    {/* Addresses */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
                        <h2 className="font-bold text-[#1A1A2E]">Pickup & Dropoff</h2>

                        <div>
                            <label className="block text-sm font-semibold text-[#1A1A2E] mb-1">
                                Pickup Address
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-3 flex items-center text-green-500">●</span>
                                <input
                                    {...register('pickupAddress')}
                                    type="text"
                                    placeholder="e.g. Thamel, Kathmandu"
                                    className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] transition-all"
                                />
                            </div>
                            {errors.pickupAddress && <p className="text-red-500 text-xs mt-1">⚠ {errors.pickupAddress.message}</p>}
                        </div>

                        <div className="border-l-2 border-dashed border-gray-200 ml-3 h-4" />

                        <div>
                            <label className="block text-sm font-semibold text-[#1A1A2E] mb-1">
                                Dropoff Address
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-3 flex items-center text-red-500">●</span>
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

                    {/* Package Size */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <h2 className="font-bold text-[#1A1A2E] mb-4">Package Size</h2>
                        <div className="grid grid-cols-3 gap-3">
                            {Object.entries(sizeInfo).map(([size, info]) => (
                                <label
                                    key={size}
                                    className={`cursor-pointer rounded-xl border-2 p-4 text-center transition-all ${selectedSize === size
                                            ? 'border-[#FF6B35] bg-orange-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <input {...register('packageSize')} type="radio" value={size} className="hidden" />
                                    <div className="text-2xl mb-2">{info.icon}</div>
                                    <p className="font-bold text-[#1A1A2E] text-sm">{info.label}</p>
                                    <p className="text-gray-400 text-xs mt-1">{info.desc}</p>
                                    <p className="text-[#FF6B35] font-bold text-sm mt-2">{info.price}</p>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Package Description */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <h2 className="font-bold text-[#1A1A2E] mb-4">Package Description</h2>
                        <textarea
                            {...register('packageDescription')}
                            rows={3}
                            placeholder="e.g. Phone charger and laptop sleeve in a small box"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] transition-all resize-none"
                        />
                        {errors.packageDescription && <p className="text-red-500 text-xs mt-1">⚠ {errors.packageDescription.message}</p>}
                    </div>

                    {/* Price Preview */}
                    <div className="bg-gradient-to-br from-[#1A1A2E] to-[#2d2d4e] rounded-2xl p-6 text-white flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Estimated Price</p>
                            <p className="text-3xl font-bold text-[#FF6B35] mt-1">
                                {sizeInfo[selectedSize as keyof typeof sizeInfo].price}
                            </p>
                            <p className="text-gray-400 text-xs mt-1">Based on {selectedSize} package size</p>
                        </div>
                        <div className="text-5xl">
                            {sizeInfo[selectedSize as keyof typeof sizeInfo].icon}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#FF6B35] text-white py-4 rounded-lg font-bold text-base hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Creating request...' : 'Get Price Confirmation →'}
                    </button>

                </form>
            </div>
        </AuthGuard>
    );
}