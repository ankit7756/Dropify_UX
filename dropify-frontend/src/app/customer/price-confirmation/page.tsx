'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import AuthGuard from '../_components/AuthGuard';

function PriceConfirmationContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const deliveryId = searchParams.get('deliveryId');
    const price = searchParams.get('price');
    const size = searchParams.get('size');

    const handleConfirm = () => {
        router.push(`/customer/payment-otp?deliveryId=${deliveryId}&price=${price}`);
    };

    return (
        <div className="max-w-md mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[#1A1A2E]">Price Confirmation</h1>
                <p className="text-gray-500 text-sm mt-1">Review your delivery details before proceeding</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
                <h2 className="font-bold text-[#1A1A2E]">Order Summary</h2>
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Package Size</span>
                        <span className="font-semibold text-[#1A1A2E] capitalize">{size}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Delivery Fee</span>
                        <span className="font-semibold text-[#1A1A2E]">NPR {price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Service Charge</span>
                        <span className="font-semibold text-[#1A1A2E]">NPR 0</span>
                    </div>
                    <div className="border-t border-gray-100 pt-3 flex justify-between">
                        <span className="font-bold text-[#1A1A2E]">Total</span>
                        <span className="font-bold text-[#FF6B35] text-lg">NPR {price}</span>
                    </div>
                </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
                <p className="text-sm text-orange-700 font-medium">💳 Payment via OTP verification</p>
                <p className="text-xs text-orange-600 mt-1">You will receive a 6-digit OTP to confirm your payment</p>
            </div>

            <div className="space-y-3">
                <button
                    onClick={handleConfirm}
                    className="w-full bg-[#FF6B35] text-white py-4 rounded-lg font-bold text-base hover:opacity-90 transition-opacity"
                >
                    Confirm & Proceed to Payment →
                </button>
                <Link
                    href="/customer/request-delivery"
                    className="block w-full text-center border-2 border-gray-200 text-gray-500 py-3 rounded-lg font-semibold text-sm hover:border-gray-300 transition-all"
                >
                    ← Go Back
                </Link>
            </div>
        </div>
    );
}

export default function PriceConfirmationPage() {
    return (
        <AuthGuard>
            <Suspense fallback={<div className="text-center py-20"><p className="text-gray-400 text-sm">Loading...</p></div>}>
                <PriceConfirmationContent />
            </Suspense>
        </AuthGuard>
    );
}