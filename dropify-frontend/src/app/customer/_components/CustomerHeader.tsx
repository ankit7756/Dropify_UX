'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function CustomerHeader() {
    const { user, logout } = useAuth();

    return (
        <header className="w-full bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link href="/customer/dashboard" className="text-xl font-bold text-[#FF6B35]">
                    Dropify
                </Link>

                <nav className="hidden md:flex items-center gap-6">
                    <Link href="/customer/dashboard" className="text-sm font-medium text-gray-600 hover:text-[#FF6B35] transition-colors">Dashboard</Link>
                    <Link href="/customer/request-delivery" className="text-sm font-medium text-gray-600 hover:text-[#FF6B35] transition-colors">Send Parcel</Link>
                    <Link href="/customer/orders" className="text-sm font-medium text-gray-600 hover:text-[#FF6B35] transition-colors">My Orders</Link>
                    <Link href="/customer/support" className="text-sm font-medium text-gray-600 hover:text-[#FF6B35] transition-colors">Support</Link>
                </nav>

                <div className="flex items-center gap-3">
                    <Link href="/customer/profile" className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#FF6B35] transition-colors">
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-[#FF6B35] font-bold text-sm">
                            {user?.fullName?.charAt(0) ?? 'U'}
                        </div>
                        <span className="hidden md:block font-medium">{user?.fullName}</span>
                    </Link>
                    <button onClick={logout} className="text-sm text-gray-500 hover:text-red-500 transition-colors font-medium">
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
}