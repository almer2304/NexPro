import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAgentAnalytics } from "@/lib/supabase/actions";
import { formatPrice } from "@/lib/utils";
import { TrendingUp, Eye, MessageSquare, Building2, BarChart3, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Analytics | Dashboard" };

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "agent") redirect("/dashboard");

  const stats = await getAgentAnalytics();

  const totalViews = stats.reduce((s, p) => s + p.view_count, 0);
  const totalInquiries = stats.reduce((s, p) => s + p.inquiry_count, 0);
  const totalPublished = stats.filter((p) => p.is_published).length;
  const conversionRate = totalViews > 0 ? ((totalInquiries / totalViews) * 100).toFixed(1) : "0.0";

  // Sort by views desc
  const sorted = [...stats].sort((a, b) => b.view_count - a.view_count);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-[#000802]">Analytics</h1>
        <p className="text-sm text-[#476083] font-label mt-0.5">Performance overview for all your listings</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Views", value: totalViews.toLocaleString(), icon: Eye, color: "bg-blue-50 text-blue-600", change: "All time" },
          { label: "Total Inquiries", value: totalInquiries, icon: MessageSquare, color: "bg-emerald-50 text-emerald-600", change: "All time" },
          { label: "Published Listings", value: totalPublished, icon: Building2, color: "bg-[#f3f4f5] text-[#000802]", change: `${stats.length} total` },
          { label: "Conversion Rate", value: `${conversionRate}%`, icon: TrendingUp, color: "bg-amber-50 text-amber-600", change: "Views → Inquiries" },
        ].map(({ label, value, icon: Icon, color, change }) => (
          <div key={label} className="bg-white rounded-2xl border border-[#e1e3e4] p-5">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
              <Icon size={18} />
            </div>
            <p className="text-2xl font-black text-[#000802]">{value}</p>
            <p className="text-sm font-bold text-[#191c1d] mt-0.5">{label}</p>
            <p className="text-xs text-[#74777f] font-label mt-0.5">{change}</p>
          </div>
        ))}
      </div>

      {/* Per-Property Stats Table */}
      <div className="bg-white rounded-2xl border border-[#e1e3e4] overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-[#f3f4f5]">
          <BarChart3 size={18} className="text-emerald-500" />
          <h2 className="font-bold text-[#191c1d]">Listing Performance</h2>
        </div>

        {sorted.length === 0 ? (
          <div className="py-16 text-center text-[#74777f] font-label text-sm">No listings yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f8f9fa]">
                  {["Property", "Status", "Views", "Inquiries", "Conversion", "Price", ""].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] font-black text-[#476083] uppercase tracking-wider font-label">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3f4f5]">
                {sorted.map((p) => {
                  const conv = p.view_count > 0
                    ? ((p.inquiry_count / p.view_count) * 100).toFixed(1)
                    : "0.0";
                  const convNum = parseFloat(conv);

                  return (
                    <tr key={p.id} className="hover:bg-[#f8f9fa] transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl overflow-hidden bg-[#f3f4f5] shrink-0">
                            {p.main_image_url && <img src={p.main_image_url} alt="" className="w-full h-full object-cover" />}
                          </div>
                          <p className="text-sm font-bold text-[#191c1d] truncate max-w-[160px]">{p.title}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${p.is_published ? "bg-emerald-100 text-emerald-700" : "bg-[#f3f4f5] text-[#476083]"}`}>
                          {p.is_published ? "Live" : "Draft"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Eye size={13} className="text-blue-500" />
                          <span className="text-sm font-bold text-[#191c1d]">{p.view_count.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <MessageSquare size={13} className="text-emerald-500" />
                          <span className="text-sm font-bold text-[#191c1d]">{p.inquiry_count}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-[#e1e3e4] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full transition-all"
                              style={{ width: `${Math.min(convNum * 5, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-[#476083] font-label">{conv}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-black text-emerald-600">{formatPrice(p.price)}</span>
                      </td>
                      <td className="px-5 py-4">
                        {p.is_published && (
                          <Link href={`/properties/${(p as { slug?: string }).slug ?? p.id}`} target="_blank">
                            <button className="p-1.5 rounded-lg text-[#476083] hover:text-emerald-600 hover:bg-[#f3f4f5] transition-colors">
                              <ExternalLink size={14} />
                            </button>
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
