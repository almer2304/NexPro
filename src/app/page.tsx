import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Search, Building2, Home, Map, TrendingUp, Star, Users, Award } from "lucide-react";
import { getFeaturedProperties } from "@/lib/supabase/actions";
import { PropertyCard } from "@/components/modules/property-card";
import { Button } from "@/components/ui/button";
import { HeroSearchBar } from "./hero-search-bar";

export const metadata: Metadata = {
  title: "NexPro — Indonesia's Premium Property Marketplace",
};

const STATS = [
  { label: "Properties Listed", value: "12,400+", icon: Building2 },
  { label: "Happy Clients", value: "8,200+", icon: Users },
  { label: "Cities Covered", value: "48", icon: Map },
  { label: "Awards Won", value: "32", icon: Award },
];

const PROPERTY_TYPES = [
  { label: "Houses", type: "house", icon: Home, count: "4,200+", bg: "bg-emerald-50", color: "text-emerald-600", border: "border-emerald-100" },
  { label: "Apartments", type: "apartment", icon: Building2, count: "6,800+", bg: "bg-blue-50", color: "text-blue-600", border: "border-blue-100" },
  { label: "Land", type: "land", icon: Map, count: "1,400+", bg: "bg-amber-50", color: "text-amber-600", border: "border-amber-100" },
  { label: "Trending", type: "", icon: TrendingUp, count: "Hot Picks", bg: "bg-purple-50", color: "text-purple-600", border: "border-purple-100" },
];

export default async function HomePage() {
  const featured = await getFeaturedProperties(6);

  return (
    <>
      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-20 px-6 overflow-hidden">
        {/* BG Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=90"
            alt="Luxury modern villa"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#000802]/70 via-[#000802]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#000802]/60 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto py-24">
          {/* Headline */}
          <div className="max-w-3xl mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 text-emerald-300 text-xs font-bold uppercase tracking-widest mb-6 font-label">
              <Star size={12} fill="currentColor" /> Indonesia&apos;s #1 Premium Marketplace
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.05] tracking-tighter mb-6 text-balance">
              Curating{" "}
              <span className="text-emerald-400">Space</span>{" "}
              &amp;{" "}
              <span className="text-emerald-400">Light</span>
            </h1>
            <p className="text-xl text-white/70 font-medium leading-relaxed max-w-xl">
              Discover a handpicked collection of architectural masterpieces designed for modern living across Indonesia.
            </p>
          </div>

          {/* Search Bar — client component for interactivity */}
          <HeroSearchBar />

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-8 mt-12">
            {STATS.map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
                  <Icon size={18} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-xl font-black text-white">{value}</p>
                  <p className="text-xs text-white/60 font-label">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-px h-8 bg-white/30" />
          <div className="w-5 h-5 border-2 border-white/30 rounded-full" />
        </div>
      </section>

      {/* ── PROPERTY TYPE NAVIGATOR ──────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="section-label">Browse by Category</span>
            <h2 className="section-title">What Are You Looking For?</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {PROPERTY_TYPES.map(({ label, type, icon: Icon, count, bg, color, border }) => (
              <Link
                key={label}
                href={type ? `/search?property_type=${type}` : "/search"}
                className={`group p-8 rounded-2xl border-2 ${bg} ${border} hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 cursor-pointer`}
              >
                <div className={`w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-sm`}>
                  <Icon size={24} className={color} />
                </div>
                <p className="text-lg font-bold text-[#191c1d] mb-1">{label}</p>
                <p className={`text-sm font-semibold ${color} font-label`}>{count} properties</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PROPERTIES ──────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#f8f9fa]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-14">
            <div>
              <span className="section-label">Curated Listings</span>
              <h2 className="section-title">Featured Residences</h2>
            </div>
            <Link href="/search?is_featured=true">
              <Button variant="outline" className="hidden md:flex gap-2 group">
                Explore All
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {featured.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featured.map((property, i) => (
                <PropertyCard key={property.id} property={property} index={i} variant="featured" />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-[#e1e3e4]">
              <Building2 size={48} className="text-[#c4c6cf] mx-auto mb-4" />
              <p className="text-[#476083] font-medium">No featured properties yet.</p>
              <Link href="/search" className="mt-4 inline-block">
                <Button>Browse All Properties</Button>
              </Link>
            </div>
          )}

          <div className="text-center mt-10 md:hidden">
            <Link href="/search">
              <Button size="lg">View All Properties</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY NEXPRO CTA ────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#000802] relative overflow-hidden">
        {/* Decorative emerald glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          <span className="section-label text-emerald-400">For Agents</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
            List Your Property.<br />
            <span className="text-emerald-400">Reach Thousands.</span>
          </h2>
          <p className="text-[#788898] text-lg mb-10 max-w-xl mx-auto">
            Join over 2,000 verified agents on NexPro. Get your listings in front of qualified buyers and renters across Indonesia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup?role=agent">
              <Button size="xl" variant="emerald">
                Start as an Agent <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href="/search">
              <Button size="xl" variant="glass">
                Browse Properties
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
