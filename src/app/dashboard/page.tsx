import { createClient } from "@/lib/supabase/server";
import { getAgentProperties, getAgentInquiries, getUserFavorites } from "@/lib/supabase/actions";
import { Building2, MessageSquare, Heart, TrendingUp, Eye, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, timeAgo } from "@/lib/utils";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user!.id).single();

  const isAgent = profile?.role === "agent";

  const [properties, inquiries, favorites] = await Promise.all([
    isAgent ? getAgentProperties() : Promise.resolve([]),
    getAgentInquiries(),
    getUserFavorites(),
  ]);

  const publishedCount = properties.filter((p) => p.is_published).length;
  const pendingInquiries = inquiries.filter((i) => i.status === "pending").length;

  const stats = isAgent
    ? [
        { label: "Total Listing", value: properties.length, icon: Building2, color: "bg-navy-50 text-navy-900", trend: "+2 bulan ini" },
        { label: "Dipublikasi", value: publishedCount, icon: Eye, color: "bg-emerald-50 text-emerald-700", trend: `${properties.length - publishedCount} draft` },
        { label: "Pesan Masuk", value: inquiries.length, icon: MessageSquare, color: "bg-blue-50 text-blue-700", trend: `${pendingInquiries} pending` },
        { label: "Tersimpan", value: favorites.length, icon: Heart, color: "bg-red-50 text-red-700", trend: "Wishlist kamu" },
      ]
    : [
        { label: "Properti Tersimpan", value: favorites.length, icon: Heart, color: "bg-red-50 text-red-700", trend: "Wishlist kamu" },
        { label: "Pesan Terkirim", value: inquiries.length, icon: MessageSquare, color: "bg-blue-50 text-blue-700", trend: "Total pesan" },
      ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#000802] dark:text-white">
            Selamat datang, {profile?.full_name?.split(" ")[0] ?? "pengguna"} 👋
          </h1>
          <p className="text-[#476083] font-label mt-1">
            {new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        {isAgent && (
          <Link href="/dashboard/new-listing">
            <Button size="sm" variant="emerald">+ Listing Baru</Button>
          </Link>
        )}
      </div>

      {/* Stats Grid */}
      <div className={`grid grid-cols-2 ${isAgent ? "lg:grid-cols-4" : "lg:grid-cols-2"} gap-4`}>
        {stats.map(({ label, value, icon: Icon, color, trend }) => (
          <div key={label} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-[#e1e3e4] dark:border-slate-800">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-4`}>
              <Icon size={20} />
            </div>
            <p className="text-3xl font-black text-[#000802]">{value}</p>
            <p className="text-sm font-bold text-[#191c1d] mt-0.5">{label}</p>
            <p className="text-xs text-[#74777f] font-label mt-1">{trend}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Listings (agent) */}
        {isAgent && (
          <div className="bg-white rounded-2xl border border-[#e1e3e4] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e1e3e4]">
              <h2 className="font-bold text-[#191c1d]">Recent Listings</h2>
              <Link href="/dashboard/listings" className="text-xs text-emerald-600 font-bold font-label hover:underline">
                View all
              </Link>
            </div>
            <div className="divide-y divide-[#f3f4f5]">
              {properties.slice(0, 4).map((p) => (
                <div key={p.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#f3f4f5] shrink-0">
                    {p.main_image_url && (
                      <img src={p.main_image_url} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#191c1d] truncate">{p.title}</p>
                    <p className="text-xs text-[#476083] font-label">{formatPrice(p.price)}</p>
                  </div>
                  <Badge variant={p.is_published ? "emerald-soft" : "outline"}>
                    {p.is_published ? "Live" : "Draft"}
                  </Badge>
                </div>
              ))}
              {properties.length === 0 && (
                <div className="px-6 py-10 text-center">
                  <p className="text-sm text-[#74777f] font-label mb-3">No listings yet</p>
                  <Link href="/dashboard/new-listing">
                    <Button size="sm">+ Add First Listing</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recent Inquiries */}
        <div className="bg-white rounded-2xl border border-[#e1e3e4] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#e1e3e4]">
            <h2 className="font-bold text-[#191c1d]">Recent Inquiries</h2>
            <Link href="/dashboard/inquiries" className="text-xs text-emerald-600 font-bold font-label hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-[#f3f4f5]">
            {inquiries.slice(0, 4).map((inq) => (
              <div key={inq.id} className="px-6 py-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-sm font-bold text-[#191c1d] truncate flex-1">
                    {(inq.properties as { title?: string })?.title ?? "Property"}
                  </p>
                  <Badge variant={inq.status as "pending" | "contacted" | "closed"}>
                    {inq.status}
                  </Badge>
                </div>
                <p className="text-xs text-[#476083] font-label line-clamp-1">{inq.message}</p>
                <p className="text-[10px] text-[#74777f] font-label mt-1 flex items-center gap-1">
                  <Clock size={10} /> {timeAgo(inq.created_at)}
                </p>
              </div>
            ))}
            {inquiries.length === 0 && (
              <div className="px-6 py-10 text-center">
                <p className="text-sm text-[#74777f] font-label">No inquiries yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
