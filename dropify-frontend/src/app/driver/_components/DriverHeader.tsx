'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function DriverHeader() {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    const links = [
        { href: '/driver/dashboard', label: 'Dashboard' },
        { href: '/driver/jobs', label: 'Available Jobs' },
        { href: '/driver/active-delivery', label: 'Active Delivery' },
        { href: '/driver/earnings', label: 'Earnings' },
    ];

    return (
        <header className="w-full bg-[#1A1A2E] sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link href="/driver/dashboard" className="text-xl font-bold text-[#FF6B35]">
                    Dropify <span className="text-white text-sm font-normal">Driver</span>
                </Link>

                <nav className="hidden md:flex items-center gap-6">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-sm font-medium transition-colors ${pathname === link.href
                                    ? 'text-[#FF6B35]'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    <Link href="/driver/profile" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                        <div className="w-8 h-8 rounded-full bg-orange-900/40 flex items-center justify-center text-[#FF6B35] font-bold text-sm">
                            {user?.fullName?.charAt(0) ?? 'D'}
                        </div>
                        <span className="hidden md:block font-medium">{user?.fullName?.split(' ')[0]}</span>
                    </Link>
                    <button onClick={logout} className="text-sm text-gray-400 hover:text-red-400 transition-colors font-medium">
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
}