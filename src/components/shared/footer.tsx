"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Mail, Phone } from "lucide-react";

// Halaman yang tidak perlu footer
const HIDE_FOOTER = ["/dashboard", "/login", "/signup", "/forgot-password", "/auth/", "/compare", "/search"];

export function Footer() {
  const pathname = usePathname();
  if (HIDE_FOOTER.some((p) => pathname.startsWith(p))) return null;

  return (
    <footer className="bg-[#000802] text-white">
      <div className="max-w-screen-xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="lg:col-span-2">
            <span className="text-2xl font-black tracking-tight">Nex<span className="text-emerald-400">Pro</span></span>
            <p className="text-[#b8c8da] text-sm mt-4 leading-relaxed max-w-sm font-label">
              Marketplace properti premium Indonesia. Kurasikan ruang terbaik untuk pembeli, penyewa, dan investor.
            </p>
            <div className="flex flex-col gap-3 mt-6">
              {[
                { icon: MapPin, text: "Jakarta Selatan, DKI Jakarta 12190" },
                { icon: Mail, text: "hello@nexpro.id" },
                { icon: Phone, text: "+62 21 5000 8888" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-sm text-[#788898]">
                  <Icon size={14} className="text-emerald-500 shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-5 font-label">Browse</p>
            <ul className="space-y-3">
              {[
                { href: "/search?listing_type=sale", label: "Beli Properti" },
                { href: "/search?listing_type=rent", label: "Sewa Properti" },
                { href: "/search?property_type=apartment", label: "Apartemen" },
                { href: "/search?property_type=house", label: "Rumah" },
                { href: "/search?property_type=land", label: "Tanah" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-[#788898] hover:text-emerald-400 transition-colors font-label">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-5 font-label">Company</p>
            <ul className="space-y-3">
              {[
                { href: "/about", label: "Tentang Kami" },
                { href: "/signup?role=agent", label: "Untuk Agen" },
                { href: "/about#team", label: "Tim Kami" },
                { href: "/privacy", label: "Kebijakan Privasi" },
                { href: "/terms", label: "Syarat & Ketentuan" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-[#788898] hover:text-emerald-400 transition-colors font-label">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#788898] font-label">© {new Date().getFullYear()} NexPro Indonesia. All rights reserved.</p>
          <p className="text-xs text-[#788898] font-label">Built with ❤️ for the Indonesian property market.</p>
        </div>
      </div>
    </footer>
  );
}
