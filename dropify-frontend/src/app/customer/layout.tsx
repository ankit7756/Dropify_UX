import CustomerHeader from './_components/CustomerHeader';
import AuthGuard from './_components/AuthGuard';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard>
            <div className="min-h-screen flex flex-col bg-[#F5F5F5]">
                <CustomerHeader />
                <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
                    {children}
                </main>
                <footer className="bg-white border-t border-gray-100 py-4 text-center text-xs text-gray-400">
                    © 2026 Dropify Logistics. All rights reserved. Kathmandu, Nepal.
                </footer>
            </div>
        </AuthGuard>
    );
}