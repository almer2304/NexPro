import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        {/* Large 404 */}
        <div className="relative mb-8 select-none">
          <p className="text-[160px] font-black text-[#e7e8e9] leading-none tracking-tighter">404</p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white rounded-3xl px-8 py-4 shadow-glass border border-[#e1e3e4]">
              <span className="text-2xl font-extrabold text-[#000802]">
                Nex<span className="text-emerald-500">Pro</span>
              </span>
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-extrabold text-[#000802] mb-3">Page Not Found</h1>
        <p className="text-[#476083] font-label mb-8 leading-relaxed">
          The property or page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button size="lg">
              <Home size={18} /> Go Home
            </Button>
          </Link>
          <Link href="/search">
            <Button variant="outline" size="lg">
              <Search size={18} /> Browse Properties
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
