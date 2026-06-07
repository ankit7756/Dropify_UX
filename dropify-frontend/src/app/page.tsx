export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1A2E]">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-[#FF6B35] mb-4">
          Dropify
        </h1>
        <p className="text-white text-lg">
          Logistics handled with velocity
        </p>
        <button className="mt-6 bg-[#FF6B35] text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
          Get Started
        </button>
      </div>
    </div>
  );
}