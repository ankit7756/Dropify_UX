'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import DriverAuthGuard from '../_components/DriverAuthGuard';
import axios from '@/lib/axios';
import { ENDPOINTS } from '@/lib/endpoints';

const profileSchema = z.object({
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().min(10, 'Enter a valid phone number'),
});

type ProfileData = z.infer<typeof profileSchema>;

export default function DriverProfilePage() {
    const { user, login } = useAuth();
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileData>({
        resolver: zodResolver(profileSchema),
        defaultValues: { fullName: user?.fullName ?? '', phone: '' },
    });

    const onSubmit = async (data: ProfileData) => {
        setError('');
        try {
            const res = await axios.patch(ENDPOINTS.UPDATE_PROFILE, data);
            login(res.data, document.cookie.match(/dropify_token=([^;]+)/)?.[1] ?? '');
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update profile');
        }
    };

    return (
        <DriverAuthGuard>
            <div className="max-w-2xl mx-auto space-y-6">

                <div>
                    <h1 className="text-2xl font-bold text-[#1A1A2E]">Driver Profile</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your driver account</p>
                </div>

                {/* Avatar */}
                <div className="bg-[#1A1A2E] rounded-2xl p-6 flex items-center gap-5">
                    <div className="w-16 h-16 rounded-full bg-orange-900/40 flex items-center justify-center text-[#FF6B35] font-bold text-2xl flex-shrink-0">
                        {user?.fullName?.charAt(0) ?? 'D'}
                    </div>
                    <div>
                        <p className="font-bold text-white text-lg">{user?.fullName}</p>
                        <p className="text-gray-400 text-sm">{user?.email}</p>
                        <div className="flex items-center gap-3 mt-2">
                            <span className="bg-[#FF6B35] text-white text-xs font-semibold px-3 py-1 rounded-full">Driver</span>
                            <span className="text-yellow-400 text-sm">★ 4.9</span>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5">
                    <h2 className="font-bold text-[#1A1A2E]">Personal Information</h2>

                    {saved && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-green-600 text-sm font-medium">✅ Profile updated successfully</p>
                        </div>
                    )}
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm font-medium">⚠ {error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-[#1A1A2E] mb-1">Full Name</label>
                            <input {...register('fullName')} type="text"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] transition-all" />
                            {errors.fullName && <p className="text-red-500 text-xs mt-1">⚠ {errors.fullName.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#1A1A2E] mb-1">Email Address</label>
                            <input type="email" defaultValue={user?.email} disabled
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none bg-gray-50 text-gray-400" />
                            <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#1A1A2E] mb-1">Phone Number</label>
                            <input {...register('phone')} type="tel" placeholder="+977 98XXXXXXXX"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] transition-all" />
                            {errors.phone && <p className="text-red-500 text-xs mt-1">⚠ {errors.phone.message}</p>}
                        </div>

                        <button type="submit" disabled={isSubmitting}
                            className="w-full bg-[#FF6B35] text-white py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60">
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </div>

                {/* Vehicle Info */}
                <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5">
                    <h2 className="font-bold text-[#1A1A2E]">Vehicle Information</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-[#1A1A2E] mb-1">Vehicle Type</label>
                            <select className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#FF6B35] transition-all bg-white">
                                <option>Motorcycle</option>
                                <option>Scooter</option>
                                <option>Car</option>
                                <option>Van</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-[#1A1A2E] mb-1">License Plate</label>
                            <input type="text" placeholder="BA 1 PA 2345"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] transition-all" />
                        </div>
                    </div>
                    <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
                        className="w-full border-2 border-[#1A1A2E] text-[#1A1A2E] py-3 rounded-lg font-semibold text-sm hover:bg-[#1A1A2E] hover:text-white transition-all">
                        Update Vehicle Info
                    </button>
                </div>

            </div>
        </DriverAuthGuard>
    );
}