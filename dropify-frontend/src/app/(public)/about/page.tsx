import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="w-full">

            {/* Hero */}
            <section className="bg-gradient-to-br from-[#1A1A2E] to-[#2d2d4e] text-white py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <span className="inline-block bg-[#FF6B35] text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
                        About Dropify
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Logistics handled with <span className="text-[#FF6B35]">velocity</span>
                    </h1>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                        Dropify is Kathmandu Valley's most reliable on-demand parcel delivery platform — connecting customers with verified drivers for fast, transparent, and affordable deliveries.
                    </p>
                </div>
            </section>

            <section className="py-20 px-6 bg-white">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-[#1A1A2E] mb-6">Our Mission</h2>
                        <p className="text-gray-500 leading-relaxed mb-4">
                            We started Dropify because we were frustrated with unreliable delivery services in Kathmandu. Late parcels, no tracking, hidden fees — we decided to fix it.
                        </p>
                        <p className="text-gray-500 leading-relaxed mb-4">
                            Our mission is simple — make parcel delivery as easy as calling a ride. Fast, transparent, and available to everyone across the Kathmandu Valley.
                        </p>
                        <p className="text-gray-500 leading-relaxed">
                            From a small phone charger in Thamel to large furniture in Bhaktapur — we handle it all with the same level of care and speed.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { value: '500+', label: 'Active Drivers', icon: '🚗' },
                            { value: '10,000+', label: 'Deliveries Made', icon: '📦' },
                            { value: '45 min', label: 'Avg Delivery Time', icon: '⏱️' },
                            { value: '4.8★', label: 'Customer Rating', icon: '⭐' },
                        ].map((stat) => (
                            <div key={stat.label} className="bg-[#F5F5F5] rounded-2xl p-5 text-center">
                                <div className="text-3xl mb-2">{stat.icon}</div>
                                <p className="text-2xl font-bold text-[#FF6B35]">{stat.value}</p>
                                <p className="text-gray-500 text-xs mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 px-6 bg-[#F5F5F5]">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl font-bold text-[#1A1A2E]">What We Stand For</h2>
                        <div className="w-16 h-1 bg-[#FF6B35] mx-auto rounded-full mt-3" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { icon: '⚡', title: 'Speed', desc: 'We obsess over delivery times. Our drivers are trained to move fast without compromising safety or care.' },
                            { icon: '🔒', title: 'Trust', desc: 'Every driver is verified and background checked. Your parcels are handled by professionals you can trust.' },
                            { icon: '💡', title: 'Transparency', desc: 'No hidden fees. No surprises. You see the price before you confirm and track every step of the journey.' },
                        ].map((v) => (
                            <div key={v.title} className="bg-white rounded-2xl p-8 shadow-sm text-center hover:shadow-md transition-shadow">
                                <div className="text-4xl mb-4">{v.icon}</div>
                                <h3 className="text-xl font-bold text-[#1A1A2E] mb-3">{v.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Coverage */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl font-bold text-[#1A1A2E]">Where We Operate</h2>
                        <div className="w-16 h-1 bg-[#FF6B35] mx-auto rounded-full mt-3" />
                        <p className="text-gray-500 mt-4 max-w-xl mx-auto">Currently serving all major areas across Kathmandu Valley</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { area: 'Thamel', icon: '🏙️' },
                            { area: 'Patan', icon: '🏛️' },
                            { area: 'Bhaktapur', icon: '🏯' },
                            { area: 'Baneshwor', icon: '🌆' },
                            { area: 'Lazimpat', icon: '🏢' },
                            { area: 'Kirtipur', icon: '🏘️' },
                            { area: 'Boudha', icon: '⛩️' },
                            { area: 'Koteshwor', icon: '🌃' },
                        ].map((loc) => (
                            <div key={loc.area} className="bg-[#F5F5F5] rounded-xl p-4 text-center hover:bg-orange-50 transition-colors">
                                <div className="text-2xl mb-2">{loc.icon}</div>
                                <p className="font-semibold text-[#1A1A2E] text-sm">{loc.area}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6 bg-[#1A1A2E] text-white text-center">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-3xl font-bold mb-4">Ready to experience Dropify?</h2>
                    <p className="text-gray-400 mb-8">Join thousands of customers and drivers already on the platform.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/register" className="inline-block bg-[#FF6B35] text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                            Send a Parcel
                        </Link>
                        <Link href="/register?role=driver" className="inline-block border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#1A1A2E] transition-all">
                            Become a Driver
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
}