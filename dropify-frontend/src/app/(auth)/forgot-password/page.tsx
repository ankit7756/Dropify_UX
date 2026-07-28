'use client';

import { useState } from 'react';
import Link from 'next/link';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
    email: z.string().email('Enter a valid email address'),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
    const [submitted, setSubmitted] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        await new Promise(r => setTimeout(r, 1500));
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center px-4 py-12 relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-[#FF6B35] opacity-5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-5%] w-72 h-72 bg-[#1A1A2E] opacity-5 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                <div className="bg-white rounded-2xl shadow-lg p-8">

                    <div className="text-center mb-8">
                        <Link href="/" className="text-2xl font-bold text-[#FF6B35]">Dropify</Link>
                        <h1 className="text-2xl font-bold text-[#1A1A2E] mt-4">Forgot Password</h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Enter your email and we'll send you a reset link
                        </p>
                    </div>

                    {submitted ? (
                        <div className="text-center py-6 space-y-4">
                            <div className="text-5xl">📧</div>
                            <p className="font-bold text-[#1A1A2E]">Check your email</p>
                            <p className="text-gray-500 text-sm">
                                We've sent a password reset link to your email address. Check your inbox and follow the instructions.
                            </p>
                            <Link
                                href="/login"
                                className="inline-block mt-4 text-[#FF6B35] font-semibold text-sm hover:underline"
                            >
                                ← Back to Login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-[#1A1A2E] mb-1">
                                    Email Address
                                </label>
                                <input
                                    {...register('email')}
                                    type="email"
                                    placeholder="arjun@gmail.com"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] transition-all"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-xs mt-1">⚠ {errors.email.message}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-[#FF6B35] text-white py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
                            >
                                {isSubmitting ? 'Sending...' : 'Send Reset Link →'}
                            </button>

                            <p className="text-center text-sm text-gray-500">
                                Remember your password?{' '}
                                <Link href="/login" className="text-[#FF6B35] font-semibold hover:underline">
                                    Log In
                                </Link>
                            </p>
                        </form>
                    )}

                </div>
            </div>
        </div>
    );
}