import type { Metadata } from "next";
import Link from "next/link";
import { Building2, Users, Award, MapPin, ArrowRight, Target, Eye, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Tentang Kami | NexPro" };

const STATS = [
  { value: "12.400+", label: "Properti Terdaftar" },
  { value: "8.200+", label: "Klien Puas" },
  { value: "2.000+", label: "Agen Terverifikasi" },
  { value: "48", label: "Kota di Indonesia" },
];

const TEAM = [
  { name: "Andi Pratama", role: "CEO & Co-Founder", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80" },
  { name: "Sari Dewi", role: "CTO & Co-Founder", img: "https://images.unsplash.com/photo-1494790108755-2616b612b1e0?w=200&q=80" },
  { name: "Budi Santoso", role: "Head of Operations", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80" },
  { name: "Rina Kusuma", role: "Head of Marketing", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80" },
];

const VALUES = [
  { icon: Target, title: "Misi Kami", desc: "Menjadi platform properti paling terpercaya di Indonesia, menghubungkan jutaan pembeli, penyewa, dan agen properti dalam satu ekosistem digital yang transparan dan efisien." },
  { icon: Eye, title: "Visi Kami", desc: "Menciptakan dunia di mana setiap orang Indonesia dapat menemukan properti impian mereka dengan mudah, aman, dan cepat — kapan saja dan di mana saja." },
  { icon: Heart, title: "Nilai Kami", desc: "Kami percaya bahwa kepercayaan, transparansi, dan inovasi adalah fondasi dari setiap transaksi properti yang sukses. Setiap keputusan kami berpusat pada kepuasan pengguna." },
];

export default function AboutPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-[#000802] text-white py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-emerald-500/5 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.1)_0%,transparent_70%)]" />
        <div className="max-w-4xl mx-auto text-center relative">
          <span className="inline-block px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6 font-label">
            Tentang NexPro
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Membangun Masa Depan<br />
            <span className="text-emerald-400">Properti Indonesia</span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            NexPro lahir dari keyakinan sederhana: setiap orang berhak mendapatkan properti impian mereka dengan proses yang mudah, transparan, dan terpercaya.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 bg-white border-b border-[#e1e3e4]">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-4xl font-black text-[#000802]">{value}</p>
              <p className="text-sm text-[#476083] font-label mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="py-20 px-6 bg-[#f8f9fa]">
        <div className="max-w-3xl mx-auto">
          <span className="section-label">Cerita Kami</span>
          <h2 className="text-3xl font-extrabold text-[#000802] mb-6">Dari Garasi ke Platform Nasional</h2>
          <div className="space-y-4 text-[#476083] font-label leading-relaxed">
            <p>
              NexPro didirikan pada tahun 2023 oleh sekelompok profesional teknologi dan properti yang frustrasi dengan cara kerja pasar properti Indonesia yang konvensional — penuh dengan informasi tidak akurat, proses yang rumit, dan kurangnya transparansi.
            </p>
            <p>
              Kami memulai dengan satu pertanyaan sederhana: <em>"Bagaimana jika mencari properti semudah memesan makanan online?"</em> Dari satu kantor kecil di Jakarta Selatan, kami membangun platform yang kini melayani lebih dari 8.000 pengguna aktif di seluruh Indonesia.
            </p>
            <p>
              Hari ini, NexPro adalah marketplace properti premium yang menghubungkan lebih dari 2.000 agen terverifikasi dengan jutaan pencari properti — dari Jakarta hingga Bali, dari Bandung hingga Surabaya.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="section-label">Prinsip Kami</span>
            <h2 className="section-title">Misi, Visi & Nilai</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-8 bg-[#f8f9fa] rounded-2xl border border-[#e1e3e4]">
                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mb-5">
                  <Icon size={22} className="text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-[#000802] mb-3">{title}</h3>
                <p className="text-sm text-[#476083] font-label leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-6 bg-[#f8f9fa]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="section-label">Tim Kami</span>
            <h2 className="section-title">Orang-Orang di Balik NexPro</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TEAM.map(({ name, role, img }) => (
              <div key={name} className="text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-4 border-white shadow-md">
                  <img src={img} alt={name} className="w-full h-full object-cover" />
                </div>
                <p className="font-bold text-[#191c1d] text-sm">{name}</p>
                <p className="text-xs text-[#476083] font-label mt-0.5">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-[#000802] text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white mb-4">Bergabung Bersama Kami</h2>
          <p className="text-white/60 font-label mb-8">
            Jadilah bagian dari komunitas properti digital terbesar di Indonesia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup?role=agent">
              <Button size="lg" variant="emerald">Daftar Sebagai Agen <ArrowRight size={16} /></Button>
            </Link>
            <Link href="/search">
              <Button size="lg" variant="glass">Cari Properti</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
