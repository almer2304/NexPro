import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center px-6 py-16 bg-white min-h-screen">
        <div className="w-full max-w-md">
          <Link href="/" className="block mb-10">
            <span className="text-2xl font-black tracking-tight text-[#000802]">
              Nex<span className="text-emerald-500">Pro</span>
            </span>
          </Link>
          {children}
        </div>
      </div>
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=90"
          alt="Premium architecture"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#000802]/80 via-[#006d36]/40 to-[#000802]/60" />
        <div className="relative z-10 flex items-end p-16 w-full">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-sm">
            <p className="text-white text-lg font-semibold leading-relaxed mb-4">
              &quot;NexPro membuat pencarian rumah impian di Jakarta sangat mudah.&quot;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-black">A</div>
              <div>
                <p className="text-white font-bold text-sm">Arya Wijaya</p>
                <p className="text-white/60 text-xs font-label">Jakarta Selatan</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
