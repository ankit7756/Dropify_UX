import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-[#1A1A2E] text-white">
            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <h2 className="text-2xl font-bold text-[#FF6B35] mb-3">Dropify</h2>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                            Logistics handled with velocity. On-demand parcel delivery across Kathmandu — fast, reliable, and trackable.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/" className="hover:text-[#FF6B35] transition-colors">Home</Link></li>
                            <li><Link href="/about" className="hover:text-[#FF6B35] transition-colors">About</Link></li>
                            <li><Link href="/register" className="hover:text-[#FF6B35] transition-colors">Sign Up</Link></li>
                            <li><Link href="/login" className="hover:text-[#FF6B35] transition-colors">Login</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Support</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/customer/support" className="hover:text-[#FF6B35] transition-colors">Help Center</Link></li>
                            <li><span className="hover:text-[#FF6B35] cursor-pointer transition-colors">Privacy Policy</span></li>
                            <li><span className="hover:text-[#FF6B35] cursor-pointer transition-colors">Terms of Service</span></li>
                            <li><span className="hover:text-[#FF6B35] cursor-pointer transition-colors">Contact Us</span></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-500">
                    © 2026 Dropify Logistics. All rights reserved. Kathmandu, Nepal.
                </div>
            </div>
        </footer>
    );
}