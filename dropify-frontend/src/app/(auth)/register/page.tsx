'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import { ENDPOINTS } from '@/lib/endpoints';
import { useAuth } from '@/context/AuthContext';

const registerSchema = z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Enter a valid email address'),
    phone: z.string().min(10, 'Enter a valid phone number'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    role: z.enum(['customer', 'driver']),
    terms: z.boolean().refine((val) => val === true, 'You must agree to the terms'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

type RegisterData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterData>({
        resolver: zodResolver(registerSchema),
        defaultValues: { role: 'customer' },
    });

    const selectedRole = watch('role');

    const onSubmit = async (data: RegisterData) => {
        setIsLoading(true);
        setError('');
        try {
            const res = await axios.post(ENDPOINTS.REGISTER, {
                fullName: data.fullName,
                email: data.email,
                phone: data.phone,
                password: data.password,
                role: data.role,
            });
            login(res.data, res.data.token);
            if (res.data.role === 'driver') {
                router.push('/driver/dashboard');
            } else {
                router.push('/customer/dashboard');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center px-4 py-12 relative overflow-hidden">

            <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-[#FF6B35] opacity-5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-5%] w-72 h-72 bg-[#1A1A2E] opacity-5 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                <div className="bg-white rounded-2xl shadow-lg p-8">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <Link href="/" className="text-2xl font-bold text-[#FF6B35]">Dropify</Link>
                        <h1 className="text-2xl font-bold text-[#1A1A2E] mt-4">Join the velocity network</h1>
                        <p className="text-gray-500 text-sm mt-1">Start moving parcels with Kinetic speed today</p>
                    </div>

                    {/* Role Toggle */}
                    <div className="flex bg-[#F5F5F5] rounded-xl p-1 mb-6">
                        <label className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all ${selectedRole === 'customer' ? 'bg-white shadow text-[#FF6B35]' : 'text-gray-400 hover:text-gray-600'}`}>
                            <input {...register('role')} type="radio" value="customer" className="hidden" />
                            <span>📦</span> Send Parcels
                        </label>
                        <label className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all ${selectedRole === 'driver' ? 'bg-white shadow text-[#FF6B35]' : 'text-gray-400 hover:text-gray-600'}`}>
                            <input {...register('role')} type="radio" value="driver" className="hidden" />
                            <span>🚗</span> Drive & Earn
                        </label>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm font-medium">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-semibold text-[#1A1A2E] mb-1">Full Name</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-sm">👤</span>
                                <input
                                    {...register('fullName')}
                                    type="text"
                                    placeholder="Ankit Sharma"
                                    className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] transition-all"
                                />
                            </div>
                            {errors.fullName && <p className="text-red-500 text-xs mt-1">⚠ {errors.fullName.message}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-[#1A1A2E] mb-1">Email Address</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-sm">✉️</span>
                                <input
                                    {...register('email')}
                                    type="email"
                                    placeholder="ankit.sharma@example.com"
                                    className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] transition-all"
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs mt-1">⚠ {errors.email.message}</p>}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-semibold text-[#1A1A2E] mb-1">Phone Number</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-sm">📞</span>
                                <input
                                    {...register('phone')}
                                    type="tel"
                                    placeholder="+977 98XXXXXXXX"
                                    className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] transition-all"
                                />
                            </div>
                            {errors.phone && <p className="text-red-500 text-xs mt-1">⚠ {errors.phone.message}</p>}
                        </div>

                        {/* Password row */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-semibold text-[#1A1A2E] mb-1">Password</label>
                                <div className="relative">
                                    <input
                                        {...register('password')}
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        className="w-full px-3 py-3 pr-10 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] transition-all"
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-[#1A1A2E] text-xs font-medium">
                                        {showPassword ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-xs mt-1">⚠ {errors.password.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-[#1A1A2E] mb-1">Confirm</label>
                                <div className="relative">
                                    <input
                                        {...register('confirmPassword')}
                                        type={showConfirm ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        className="w-full px-3 py-3 pr-10 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] transition-all"
                                    />
                                    <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                                        className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-[#1A1A2E] text-xs font-medium">
                                        {showConfirm ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">⚠ {errors.confirmPassword.message}</p>}
                            </div>
                        </div>

                        {/* Terms */}
                        <div className="flex items-start gap-3 pt-1">
                            <input
                                {...register('terms')}
                                type="checkbox"
                                id="terms"
                                className="mt-0.5 w-4 h-4 accent-[#FF6B35] cursor-pointer flex-shrink-0"
                            />
                            <label htmlFor="terms" className="text-xs text-gray-500 leading-relaxed cursor-pointer">
                                I agree to the{' '}
                                <span className="text-[#FF6B35] font-semibold hover:underline cursor-pointer">Terms of Service</span>
                                {' '}and{' '}
                                <span className="text-[#FF6B35] font-semibold hover:underline cursor-pointer">Privacy Policy</span>
                                {' '}of Dropify Logistics.
                            </label>
                        </div>
                        {errors.terms && <p className="text-red-500 text-xs -mt-2">⚠ {errors.terms.message}</p>}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#FF6B35] text-white py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                        >
                            {isLoading ? 'Creating account...' : 'Sign Up →'}
                        </button>

                    </form>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Already have an account?{' '}
                        <Link href="/login" className="text-[#FF6B35] font-semibold hover:underline">
                            Log In
                        </Link>
                    </p>

                </div>

                {/* Footer note */}
                <p className="text-center text-xs text-gray-400 mt-6">
                    © 2026 Dropify Logistics. All rights reserved.
                </p>
            </div>
        </div>
    );
}