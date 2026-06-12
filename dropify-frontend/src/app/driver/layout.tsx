import DriverAuthGuard from './_components/DriverAuthGuard';
import DriverHeader from './_components/DriverHeader';

export default function DriverLayout({ children }: { children: React.ReactNode }) {
    return (
        <DriverAuthGuard>
            <div className="min-h-screen flex flex-col bg-[#F5F5F5]">
                <DriverHeader />
                <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
                    {children}
                </main>
                <footer className="bg-[#1A1A2E] py-4 text-center text-xs text-gray-500">
                    © 2026 Dropify Logistics — Driver Portal
                </footer>
            </div>
        </DriverAuthGuard>
    );
}