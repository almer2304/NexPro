import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getAgentProperties, getAgentInquiries } from "@/lib/supabase/actions";
import { formatPrice, timeAgo } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Building2, Eye, TrendingUp, MessageSquare, ExternalLink } from "lucide-react";
import { TogglePublishButton, DeleteListingButton, PropertyStatusButton } from "./listing-actions";
import type { PropertyStatus } from "@/types";

export const metadata = { title: "Listing Saya | Dashboard" };

const rentPeriodLabel: Record<string, string> = { day: "/hari", week: "/mgg", month: "/bln" };

export default async function ListingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "agent") redirect("/dashboard");

  const [properties, inquiries] = await Promise.all([getAgentProperties(), getAgentInquiries()]);
  const published = properties.filter((p) => p.is_published);
  const drafts = properties.filter((p) => !p.is_published);
  const featured = properties.filter((p) => p.is_featured && p.is_published);
  const pendingInquiries = inquiries.filter((i) => i.status === "pending").length;

  const inquiryMap: Record<string, number> = {};
  inquiries.forEach((inq) => {
    const pid = (inq.properties as { id?: string } | null)?.id;
    if (pid) inquiryMap[pid] = (inquiryMap[pid] ?? 0) + 1;
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#000802] dark:text-white">Listing Saya</h1>
          <p className="text-sm text-[#476083] dark:text-slate-400 font-label mt-0.5">Kelola semua listing properti kamu</p>
        </div>
        <Link href="/dashboard/new-listing">
          <Button variant="emerald" size="sm"><Plus size={16} /> Listing Baru</Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Listing", value: properties.length, icon: Building2, color: "text-[#000802]", bg: "bg-[#f3f4f5]" },
          { label: "Dipublikasi", value: published.length, icon: Eye, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Featured", value: featured.length, icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Pesan Pending", value: pendingInquiries, icon: MessageSquare, color: "text-amber-600", bg: "bg-amber-50" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-[#e1e3e4] dark:border-slate-800">
            <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
              <Icon size={18} className={color} />
            </div>
            <p className="text-2xl font-black text-[#000802] dark:text-white">{value}</p>
            <p className="text-xs text-[#476083] dark:text-slate-400 font-label mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {properties.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-[#c4c6cf] py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#f3f4f5] flex items-center justify-center mx-auto mb-5">
            <Building2 size={28} className="text-[#c4c6cf]" />
          </div>
          <h3 className="text-lg font-bold text-[#191c1d] dark:text-white mb-2">Belum ada listing</h3>
          <p className="text-sm text-[#476083] font-label max-w-xs mx-auto mb-6">
            Buat listing pertamamu dan jangkau ribuan pembeli & penyewa di seluruh Indonesia.
          </p>
          <Link href="/dashboard/new-listing"><Button size="lg"><Plus size={16} /> Buat Listing Pertama</Button></Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-[#e1e3e4] dark:border-slate-800 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#f3f4f5] dark:border-slate-800">
            <div className="flex gap-2 flex-wrap">
              <span className="text-xs font-bold font-label px-2.5 py-1 rounded-full bg-[#000802] text-white">Semua ({properties.length})</span>
              <span className="text-xs font-bold font-label px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">Live ({published.length})</span>
              <span className="text-xs font-bold font-label px-2.5 py-1 rounded-full bg-[#f3f4f5] text-[#476083]">Draft ({drafts.length})</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="bg-[#f8f9fa] dark:bg-slate-800">
                  {["Properti", "Harga", "Status", "Pesan", "Publikasi", "Update", "Aksi"].map((h) => (
                    <th key={h} className={`px-4 py-3 text-left text-[10px] font-black text-[#476083] uppercase tracking-wider font-label ${h === "Aksi" ? "text-right" : ""} ${["Pesan", "Update"].includes(h) ? "hidden sm:table-cell" : ""}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3f4f5] dark:divide-slate-800">
                {properties.map((p) => {
                  const inquiryCount = inquiryMap[p.id] ?? 0;
                  const propStatus = ((p as any).property_status ?? "available") as PropertyStatus;
                  const period = p.listing_type === "rent" ? (rentPeriodLabel[(p as any).rent_period ?? "month"] ?? "/bln") : "";

                  return (
                    <tr key={p.id} className="hover:bg-[#f8f9fa] dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#f3f4f5] shrink-0">
                            {p.main_image_url
                              ? <img src={p.main_image_url} alt="" className="w-full h-full object-cover" />
                              : <div className="w-full h-full flex items-center justify-center"><Building2 size={18} className="text-[#c4c6cf]" /></div>
                            }
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-[#191c1d] dark:text-white truncate max-w-[160px]">{p.title}</p>
                            <p className="text-xs text-[#476083] font-label truncate mt-0.5">{p.city}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <p className="text-sm font-black text-emerald-600 whitespace-nowrap">{formatPrice(p.price)}</p>
                        <p className="text-[10px] text-[#74777f] font-label">{p.listing_type === "rent" ? period : "dijual"}</p>
                      </td>

                      <td className="px-4 py-4">
                        <PropertyStatusButton propertyId={p.id} currentStatus={propStatus} listingType={p.listing_type} />
                      </td>

                      <td className="px-4 py-4 hidden sm:table-cell">
                        {inquiryCount > 0 ? (
                          <Link href="/dashboard/inquiries">
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full hover:bg-blue-100 transition-colors">
                              <MessageSquare size={10} /> {inquiryCount}
                            </span>
                          </Link>
                        ) : <span className="text-xs text-[#c4c6cf] font-label">—</span>}
                      </td>

                      <td className="px-4 py-4">
                        <Badge variant={p.is_published ? "emerald-soft" : "outline"}>
                          {p.is_published ? "Live" : "Draft"}
                        </Badge>
                      </td>

                      <td className="px-4 py-4 hidden sm:table-cell">
                        <p className="text-xs text-[#74777f] font-label whitespace-nowrap">{timeAgo(p.updated_at)}</p>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-1">
                          {p.is_published && (
                            <Link href={`/properties/${p.slug}`} target="_blank">
                              <button className="p-2 rounded-lg text-[#476083] hover:bg-[#f3f4f5] hover:text-emerald-600 transition-colors"><ExternalLink size={14} /></button>
                            </Link>
                          )}
                          <Link href={`/dashboard/edit/${p.id}`}>
                            <button className="px-2 py-1.5 rounded-lg text-[#476083] hover:bg-[#f3f4f5] hover:text-[#191c1d] transition-colors text-xs font-bold font-label">Edit</button>
                          </Link>
                          <TogglePublishButton propertyId={p.id} isPublished={p.is_published} />
                          <DeleteListingButton propertyId={p.id} title={p.title} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-3 bg-[#f8f9fa] dark:bg-slate-800 border-t border-[#f3f4f5] dark:border-slate-700 flex items-center justify-between">
            <p className="text-xs text-[#74777f] font-label">{properties.length} listing</p>
            <Link href="/dashboard/new-listing"><Button size="sm" variant="outline"><Plus size={13} /> Tambah</Button></Link>
          </div>
        </div>
      )}
    </div>
  );
}
