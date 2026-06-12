'use client';

import { useState } from 'react';

const faqs = [
    { q: 'How long does delivery take?', a: 'Most deliveries within Kathmandu Valley are completed within 45 minutes. Longer distances may take up to 2 hours.' },
    { q: 'How is the price calculated?', a: 'Pricing is based on package size. Small parcels start at NPR 150, medium at NPR 300, and large at NPR 500. No hidden fees.' },
    { q: 'Can I cancel my delivery?', a: 'Yes, you can cancel a delivery while it is still in Pending status. Once a driver accepts, cancellation is not available.' },
    { q: 'What if my package is damaged?', a: 'Dropify ensures safe handling. If your package arrives damaged, contact support within 24 hours with photos and we will resolve it.' },
    { q: 'How do I track my delivery?', a: 'After placing a request, go to My Orders and click on your delivery to see live tracking and driver information.' },
    { q: 'What areas do you cover?', a: 'We currently cover all areas within Kathmandu Valley including Kathmandu, Lalitpur, and Bhaktapur districts.' },
];

export default function SupportPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">

            <div>
                <h1 className="text-2xl font-bold text-[#1A1A2E]">Help & Support</h1>
                <p className="text-gray-500 text-sm mt-1">We're here to help you with anything</p>
            </div>

            {/* Contact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { icon: '📞', label: 'Call Us', value: '+977 01-XXXXXXX', desc: 'Mon–Fri, 9am–6pm' },
                    { icon: '✉️', label: 'Email Us', value: 'support@dropify.com', desc: 'Reply within 24 hours' },
                    { icon: '💬', label: 'Live Chat', value: 'Start Chat', desc: 'Available 24/7' },
                ].map((c) => (
                    <div key={c.label} className="bg-white rounded-2xl p-5 shadow-sm text-center hover:shadow-md transition-shadow">
                        <div className="text-3xl mb-3">{c.icon}</div>
                        <p className="font-bold text-[#1A1A2E] text-sm">{c.label}</p>
                        <p className="text-[#FF6B35] text-sm font-medium mt-1">{c.value}</p>
                        <p className="text-gray-400 text-xs mt-1">{c.desc}</p>
                    </div>
                ))}
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-bold text-[#1A1A2E] mb-5">Frequently Asked Questions</h2>
                <div className="space-y-3">
                    {faqs.map((faq, i) => (
                        <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
                            <button
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                            >
                                <span className="font-semibold text-[#1A1A2E] text-sm">{faq.q}</span>
                                <span className={`text-[#FF6B35] font-bold text-lg transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                            </button>
                            {openFaq === i && (
                                <div className="px-4 pb-4">
                                    <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-bold text-[#1A1A2E] mb-5">Send us a Message</h2>

                {submitted && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-600 text-sm font-medium">✅ Message sent! We'll get back to you within 24 hours.</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-[#1A1A2E] mb-1">Subject</label>
                        <select className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#FF6B35] transition-all bg-white">
                            <option>Delivery Issue</option>
                            <option>Payment Problem</option>
                            <option>Account Help</option>
                            <option>Driver Complaint</option>
                            <option>Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#1A1A2E] mb-1">Message</label>
                        <textarea
                            rows={4}
                            placeholder="Describe your issue in detail..."
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] transition-all resize-none"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#FF6B35] text-white py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
                    >
                        Send Message →
                    </button>
                </form>
            </div>

        </div>
    );
}