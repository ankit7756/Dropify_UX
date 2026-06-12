'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import AuthGuard from '../_components/AuthGuard';
import axios from '@/lib/axios';
import { ENDPOINTS } from '@/lib/endpoints';

const profileSchema = z.object({
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().min(10, 'Enter a valid phone number'),
});

type ProfileData = z.infer<typeof profileSchema>;

export default function CustomerProfilePage() {
    const { user, login } = useAuth();
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            fullName: user?.fullName ?? '',
            phone: '',
        },
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
        <AuthGuard>
            <div className="max-w-2xl mx-auto space-y-6">

                <div>
                    <h1 className="text-2xl font-bold text-[#1A1A2E]">My Profile</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your account information</p>
                </div>

                {/* Avatar Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm flex items-center gap-5">
                    <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center text-[#FF6B35] font-bold text-2xl flex-shrink-0">
                        {user?.fullName?.charAt(0) ?? 'U'}
                    </div>
                    <div>
                        <p className="font-bold text-[#1A1A2E] text-lg">{user?.fullName}</p>
                        <p className="text-gray-500 text-sm">{user?.email}</p>
                        <span className="inline-block mt-2 bg-orange-100 text-[#FF6B35] text-xs font-semibold px-3 py-1 rounded-full capitalize">
                            {user?.role}
                        </span>
                    </div>
                </div>

                {/* Edit Form */}
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
                            <input
                                {...register('fullName')}
                                type="text"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] transition-all"
                            />
                            {errors.fullName && <p className="text-red-500 text-xs mt-1">⚠ {errors.fullName.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#1A1A2E] mb-1">Email Address</label>
                            <input
                                type="email"
                                defaultValue={user?.email}
                                disabled
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none bg-gray-50 text-gray-400"
                            />
                            <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#1A1A2E] mb-1">Phone Number</label>
                            <input
                                {...register('phone')}
                                type="tel"
                                placeholder="+977 98XXXXXXXX"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] transition-all"
                            />
                            {errors.phone && <p className="text-red-500 text-xs mt-1">⚠ {errors.phone.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-[#FF6B35] text-white py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
                        >
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </div>

                {/* Danger Zone */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-100">
                    <h2 className="font-bold text-red-500 mb-1">Danger Zone</h2>
                    <p className="text-gray-400 text-xs mb-4">These actions are irreversible. Please be careful.</p>
                    <button className="border-2 border-red-200 text-red-500 px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-red-50 transition-all">
                        Delete Account
                    </button>
                </div>

            </div>
        </AuthGuard>
    );
}