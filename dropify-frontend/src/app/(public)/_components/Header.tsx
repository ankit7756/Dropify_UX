'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
    const { user, logout } = useAuth();

    return (
        <header className="w-full bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold text-[#FF6B35]">
                    Dropify
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/" className="text-[#1A1A2E] hover:text-[#FF6B35] font-medium transition-colors">
                        Home
                    </Link>
                    <Link href="/about" className="text-[#1A1A2E] hover:text-[#FF6B35] font-medium transition-colors">
                        About
                    </Link>
                </nav>

                <div className="flex items-center gap-3">
                    {user ? (
                        <>
                            <Link
                                href={user.role === 'driver' ? '/driver/dashboard' : '/customer/dashboard'}
                                className="border-2 border-[#1A1A2E] text-[#1A1A2E] px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#1A1A2E] hover:text-white transition-all"
                            >
                                Dashboard
                            </Link>
                            <button
                                onClick={logout}
                                className="bg-[#FF6B35] text-white px-4 py-2 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="border-2 border-[#1A1A2E] text-[#1A1A2E] px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#1A1A2E] hover:text-white transition-all"
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="bg-[#FF6B35] text-white px-4 py-2 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}