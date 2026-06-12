'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { ENDPOINTS } from '@/lib/endpoints';

interface Delivery {
    _id: string;
    pickupAddress: string;
    dropoffAddress: string;
    packageSize: string;
    packageDescription: string;
    estimatedPrice: number;
    customer: { fullName: string; phone: string };
    createdAt: string;
}

export default function JobsPage() {
    const [jobs, setJobs] = useState<Delivery[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [accepting, setAccepting] = useState<string | null>(null);
    const [accepted, setAccepted] = useState<string | null>(null);

    const fetchJobs = async () => {
        try {
            const res = await axios.get(ENDPOINTS.PENDING_DELIVERIES);
            setJobs(res.data);
        } catch {
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
        const interval = setInterval(fetchJobs, 15000);
        return () => clearInterval(interval);
    }, []);

    const handleAccept = async (deliveryId: string) => {
        setAccepting(deliveryId);
        try {
            await axios.post(ENDPOINTS.ACCEPT_DELIVERY(deliveryId));
            setAccepted(deliveryId);
            setJobs(prev => prev.filter(j => j._id !== deliveryId));
        } catch {
        } finally {
            setAccepting(null);
        }
    };

    const sizeIcon: Record<string, string> = { small: '📱', medium: '🎒', large: '📦' };

    return (
        <div className="space-y-6">

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#1A1A2E]">Available Jobs</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {isLoading ? 'Loading...' : `${jobs.length} job${jobs.length !== 1 ? 's' : ''} available near you`}
                    </p>
                </div>
                <button
                    onClick={() => { setIsLoading(true); fetchJobs(); }}
                    className="border border-gray-200 text-gray-500 px-4 py-2 rounded-lg text-sm font-medium hover:border-[#FF6B35] hover:text-[#FF6B35] transition-all"
                >
                    🔄 Refresh
                </button>
            </div>

            {accepted && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                    <p className="text-green-700 font-semibold text-sm">✅ Job accepted! Head to the pickup location.</p>
                </div>
            )}

            {isLoading ? (
                <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
                    <p className="text-gray-400 text-sm">Loading available jobs...</p>
                </div>
            ) : jobs.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                    <div className="text-5xl mb-4">🔍</div>
                    <p className="text-gray-600 font-semibold">No jobs available right now</p>
                    <p className="text-gray-400 text-sm mt-1">New requests appear automatically. Page refreshes every 15 seconds.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {jobs.map((job) => (
                        <div key={job._id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between gap-4 mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-2xl">
                                        {sizeIcon[job.packageSize] ?? '📦'}
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#1A1A2E] capitalize">{job.packageSize} Package</p>
                                        <p className="text-gray-400 text-xs mt-0.5">{job.packageDescription}</p>
                                    </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-2xl font-bold text-[#FF6B35]">NPR {job.estimatedPrice}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {new Date(job.createdAt).toLocaleTimeString('en-NP', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-3 text-sm">
                                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0" />
                                    <span className="text-gray-700">{job.pickupAddress}</span>
                                </div>
                                <div className="border-l-2 border-dashed border-gray-200 ml-1 h-3" />
                                <div className="flex items-center gap-3 text-sm">
                                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0" />
                                    <span className="text-gray-700">{job.dropoffAddress}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-[#FF6B35] font-bold text-xs">
                                        {job.customer?.fullName?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-[#1A1A2E]">{job.customer?.fullName}</p>
                                        <p className="text-xs text-gray-400">{job.customer?.phone}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleAccept(job._id)}
                                    disabled={accepting === job._id}
                                    className="bg-[#FF6B35] text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
                                >
                                    {accepting === job._id ? 'Accepting...' : 'Accept Job →'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}