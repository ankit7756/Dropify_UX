import Link from 'next/link';

export default function LandingPage() {
    return (
        <div className="w-full">

            {/* Hero */}
            <section className="bg-gradient-to-br from-[#1A1A2E] to-[#2d2d4e] text-white py-24 px-6 relative overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-[#FF6B35] opacity-5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-[-10%] left-[-5%] w-72 h-72 bg-[#FF6B35] opacity-5 rounded-full blur-3xl pointer-events-none" />
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
                    <div className="flex-1 text-center md:text-left">
                        <span className="inline-block bg-[#FF6B35] text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
                            Now available in Kathmandu
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                            Fast. Reliable.{' '}
                            <span className="text-[#FF6B35]">Delivered to You.</span>
                        </h1>
                        <p className="text-gray-300 text-lg mb-8 max-w-lg">
                            Experience kinetic velocity in logistics. From local urban deliveries to high-volume merchant orders — we move your world with precision and trust across Kathmandu Valley.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <Link href="/register" className="inline-block text-center px-8 py-3 rounded-lg font-semibold bg-[#FF6B35] text-white hover:opacity-90 transition-opacity">
                                Send a Parcel →
                            </Link>
                            <Link href="/register?role=driver" className="inline-block text-center px-8 py-3 rounded-lg font-semibold border-2 border-white text-white hover:bg-white hover:text-[#1A1A2E] transition-all">
                                Become a Driver
                            </Link>
                        </div>
                    </div>
                    <div className="flex-1 flex justify-center">
                        <div className="bg-white/10 backdrop-blur rounded-2xl p-8 w-full max-w-sm text-center border border-white/10">
                            <div className="text-6xl mb-4">📦</div>
                            <p className="text-white font-semibold text-lg">Your parcel, delivered fast</p>
                            <p className="text-gray-300 text-sm mt-2">Average delivery time under 45 minutes</p>
                            <div className="mt-6 bg-[#FF6B35] rounded-xl p-4">
                                <p className="text-white text-sm font-medium">Starting from</p>
                                <p className="text-white text-3xl font-bold">NPR 150</p>
                            </div>
                            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                                {[
                                    { value: '500+', label: 'Drivers' },
                                    { value: '45min', label: 'Avg Time' },
                                    { value: '4.8★', label: 'Rating' },
                                ].map((s) => (
                                    <div key={s.label} className="bg-white/10 rounded-lg p-2">
                                        <p className="text-white font-bold text-sm">{s.value}</p>
                                        <p className="text-gray-400 text-xs">{s.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl font-bold text-[#1A1A2E]">How Dropify Works</h2>
                        <div className="w-16 h-1 bg-[#FF6B35] mx-auto rounded-full mt-3" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { step: '01', icon: '📋', title: 'Request', desc: 'Enter pickup and delivery details in seconds through our seamless platform.' },
                            { step: '02', icon: '🚗', title: 'Pick-up', desc: 'A verified driver arrives at your doorstep for a contact-free pickup.' },
                            { step: '03', icon: '📍', title: 'Transit', desc: 'Monitor your package in real time as it moves toward the destination.' },
                            { step: '04', icon: '✅', title: 'Delivered', desc: 'Real-time confirmation once your parcel safely reaches its destination.' },
                        ].map((item) => (
                            <div key={item.step} className="flex flex-col items-center text-center p-6 rounded-xl hover:bg-gray-50 transition-all group">
                                <div className="w-16 h-16 bg-orange-50 flex items-center justify-center rounded-full mb-4 group-hover:bg-[#FF6B35] transition-colors">
                                    <span className="text-2xl">{item.icon}</span>
                                </div>
                                <span className="text-[#FF6B35] font-bold text-xs mb-1">{item.step}</span>
                                <h3 className="font-bold text-[#1A1A2E] mb-2">{item.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Bento Grid */}
            <section className="py-20 px-6 bg-[#F5F5F5]">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl font-bold text-[#1A1A2E]">Why Choose Dropify</h2>
                        <div className="w-16 h-1 bg-[#FF6B35] mx-auto rounded-full mt-3" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[220px]">
                        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm p-8 flex flex-col justify-between overflow-hidden relative group hover:shadow-md transition-shadow">
                            <div className="relative z-10">
                                <span className="bg-orange-50 text-[#FF6B35] px-3 py-1 rounded-full text-xs font-bold mb-4 inline-block">LIVE TRACKING</span>
                                <h3 className="text-xl font-bold text-[#1A1A2E] mb-2">Real-time Precision</h3>
                                <p className="text-gray-500 max-w-md text-sm">Never wonder where your parcel is. Our GPS tracking provides live updates every few seconds across Kathmandu Valley.</p>
                            </div>
                            <div className="absolute bottom-[-20%] right-[-5%] opacity-5 group-hover:opacity-10 transition-opacity text-[200px]">📍</div>
                        </div>
                        <div className="bg-[#1A1A2E] text-white rounded-2xl shadow-sm p-8 flex flex-col justify-between hover:shadow-md transition-shadow">
                            <span className="bg-[#FF6B35] text-white w-fit px-3 py-1 rounded-full text-xs font-bold">VERIFIED</span>
                            <div>
                                <h3 className="font-bold text-xl mb-2">Verified Drivers</h3>
                                <p className="text-gray-400 text-sm">Every driver undergoes background checks and training for total peace of mind.</p>
                            </div>
                            <span className="text-4xl">🛡️</span>
                        </div>
                        <div className="bg-white rounded-2xl shadow-sm p-8 flex flex-col justify-center text-center hover:shadow-md transition-shadow">
                            <div className="text-4xl font-bold text-[#FF6B35] mb-2">99.8%</div>
                            <p className="font-bold text-[#1A1A2E]">On-Time Delivery</p>
                            <p className="text-gray-500 text-sm mt-1">Our record speaks for itself.</p>
                        </div>
                        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm p-8 flex items-center gap-8 hover:shadow-md transition-shadow">
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-[#1A1A2E] mb-2">Transparent Pricing</h3>
                                <p className="text-gray-500 text-sm mb-4">No hidden fees. Premium service starting from NPR 150. Pay only for what you send.</p>
                                <Link href="/register" className="text-[#FF6B35] font-bold text-sm flex items-center gap-1 hover:gap-3 transition-all">
                                    Get Started →
                                </Link>
                            </div>
                            <div className="hidden sm:flex flex-col gap-2 flex-shrink-0">
                                {[
                                    { size: 'Small', price: 'NPR 150' },
                                    { size: 'Medium', price: 'NPR 300' },
                                    { size: 'Large', price: 'NPR 500' },
                                ].map((p) => (
                                    <div key={p.size} className="flex items-center justify-between gap-8 bg-gray-50 rounded-lg px-4 py-2">
                                        <span className="text-sm text-gray-600">{p.size}</span>
                                        <span className="text-sm font-bold text-[#FF6B35]">{p.price}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl font-bold text-[#1A1A2E]">Trusted by Thousands</h2>
                        <div className="w-16 h-1 bg-[#FF6B35] mx-auto rounded-full mt-3" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { name: 'Sanjay Thapa', role: 'Retailer, Lazimpat', quote: 'Dropify has completely changed how we handle orders. The speed is unmatched and the tracking interface is a joy to use.' },
                            { name: 'Priya Sharma', role: 'Entrepreneur, Thamel', quote: 'Reliable and professional. The drivers are always polite and my fragile shipments arrive in perfect condition every time.' },
                            { name: 'Rohan Basnet', role: 'CEO, Logistics Plus', quote: 'As a high-volume merchant, I need logistics that can keep up. Dropify makes managing 100+ daily shipments effortless.' },
                        ].map((t) => (
                            <div key={t.name} className="bg-white rounded-2xl shadow-sm p-8 border-l-4 border-[#FF6B35] hover:shadow-md transition-shadow">
                                <div className="flex gap-1 text-[#FF6B35] mb-4">
                                    {'★★★★★'.split('').map((s, i) => <span key={i} className="text-sm">{s}</span>)}
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">"{t.quote}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-[#FF6B35] font-bold text-sm">
                                        {t.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#1A1A2E] text-sm">{t.name}</p>
                                        <p className="text-gray-500 text-xs">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 px-6 bg-[#1A1A2E] text-white">
                <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {[
                        { value: '500+', label: 'Active Drivers' },
                        { value: '10,000+', label: 'Deliveries Made' },
                        { value: '45 min', label: 'Avg Delivery Time' },
                        { value: '4.8★', label: 'Customer Rating' },
                    ].map((stat) => (
                        <div key={stat.label}>
                            <p className="text-3xl font-bold text-[#FF6B35]">{stat.value}</p>
                            <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Banner */}
            <section className="py-12 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-[#FF6B35] rounded-2xl p-8 md:p-16 flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3" />
                        <div className="relative z-10 text-center md:text-left">
                            <h2 className="text-white text-2xl md:text-3xl font-bold mb-3">Ready to move your first package?</h2>
                            <p className="text-white/80 text-base max-w-xl">Join over 10,000 businesses and individuals who trust Dropify for their daily logistics needs across Kathmandu Valley.</p>
                        </div>
                        <div className="relative z-10 flex flex-col items-center gap-2">
                            <Link href="/register" className="inline-block bg-[#1A1A2E] text-white px-10 py-4 rounded-lg font-bold text-base hover:opacity-90 transition-opacity shadow-xl">
                                Get Started Now
                            </Link>
                            <p className="text-white/60 text-xs">No credit card required</p>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}