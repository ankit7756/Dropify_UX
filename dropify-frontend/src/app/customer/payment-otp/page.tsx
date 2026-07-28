'use client';

import { useState, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AuthGuard from '../_components/AuthGuard';

// function to handle OTP input and verification
function PaymentOTPContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const deliveryId = searchParams.get('deliveryId');
    const price = searchParams.get('price');

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [verified, setVerified] = useState(false);
    const inputs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        if (value && index < 5) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };


    const handleVerify = async () => {
        const code = otp.join('');
        if (code.length !== 6) {
            setError('Enter the complete 6-digit OTP');
            return;
        }
        setIsLoading(true);
        setError('');
        await new Promise(r => setTimeout(r, 1500));
        setVerified(true);
        setIsLoading(false);
        setTimeout(() => {
            router.push(`/customer/tracking?deliveryId=${deliveryId}`);
        }, 2000);
    };

    if (verified) {
        return (
            <div className="max-w-md mx-auto text-center py-12">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-[#1A1A2E] mb-2">Payment Confirmed!</h2>
                <p className="text-gray-500 text-sm">Your delivery request is now active. Redirecting to tracking...</p>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[#1A1A2E]">Payment Verification</h1>
                <p className="text-gray-500 text-sm mt-1">Enter the 6-digit OTP to confirm your payment</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm text-center space-y-6">
                <div className="bg-orange-50 rounded-xl p-4">
                    <p className="text-gray-500 text-sm">Amount to Pay</p>
                    <p className="text-3xl font-bold text-[#FF6B35] mt-1">NPR {price}</p>
                </div>

                <div>
                    <p className="text-sm text-gray-500 mb-4">
                        Enter OTP sent to your registered phone number.
                        <span className="block text-xs text-gray-400 mt-1">(Use any 6 digits for demo)</span>
                    </p>
                    <div className="flex gap-2 justify-center">
                        {otp.map((digit, i) => (
                            <input
                                key={i}
                                ref={el => { inputs.current[i] = el; }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={e => handleChange(i, e.target.value)}
                                onKeyDown={e => handleKeyDown(i, e)}
                                className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-200 rounded-lg outline-none focus:border-[#FF6B35] transition-all"
                            />
                        ))}
                    </div>
                    {error && <p className="text-red-500 text-xs mt-3">⚠ {error}</p>}
                </div>

                <button
                    onClick={handleVerify}
                    disabled={isLoading}
                    className="w-full bg-[#FF6B35] text-white py-3 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                    {isLoading ? 'Verifying...' : 'Verify & Pay →'}
                </button>
            </div>
        </div>
    );
}

export default function PaymentOTPPage() {
    return (
        <AuthGuard>
            <Suspense fallback={<div className="text-center py-20"><p className="text-gray-400">Loading...</p></div>}>
                <PaymentOTPContent />
            </Suspense>
        </AuthGuard>
    );
}