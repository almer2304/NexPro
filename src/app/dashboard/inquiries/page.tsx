import { getAgentInquiries } from "@/lib/supabase/actions";
import { Badge } from "@/components/ui/badge";
import { timeAgo } from "@/lib/utils";
import { MessageSquare, User, Building2, Clock } from "lucide-react";
import { InquiryStatusButton } from "./status-button";

export default async function InquiriesPage() {
  const inquiries = await getAgentInquiries();

  const pending = inquiries.filter((i) => i.status === "pending");
  const contacted = inquiries.filter((i) => i.status === "contacted");
  const closed = inquiries.filter((i) => i.status === "closed");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#000802]">Inquiries</h1>
        <p className="text-sm text-[#476083] font-label mt-1">{inquiries.length} total — {pending.length} pending response</p>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Pending", count: pending.length, color: "bg-amber-50 text-amber-700 border-amber-100" },
          { label: "Contacted", count: contacted.length, color: "bg-blue-50 text-blue-700 border-blue-100" },
          { label: "Closed", count: closed.length, color: "bg-gray-50 text-gray-600 border-gray-100" },
        ].map(({ label, count, color }) => (
          <div key={label} className={`rounded-2xl border p-5 ${color}`}>
            <p className="text-2xl font-black">{count}</p>
            <p className="text-xs font-bold uppercase tracking-wider font-label mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Inquiries List */}
      {inquiries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-[#c4c6cf] p-16 text-center">
          <MessageSquare size={48} className="text-[#c4c6cf] mx-auto mb-4" />
          <h3 className="text-lg font-bold text-[#191c1d] mb-2">No inquiries yet</h3>
          <p className="text-sm text-[#476083] font-label">When buyers message about your properties, they&apos;ll appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inq) => {
            const buyer = inq.profiles as { full_name?: string; avatar_url?: string; phone_number?: string } | null;
            const property = inq.properties as { title?: string; slug?: string } | null;
            return (
              <div key={inq.id} className="bg-white rounded-2xl border border-[#e1e3e4] p-6">
                <div className="flex items-start gap-4">
                  {/* Buyer avatar */}
                  <div className="w-11 h-11 rounded-full bg-[#f3f4f5] flex items-center justify-center shrink-0 overflow-hidden">
                    {buyer?.avatar_url ? (
                      <img src={buyer.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User size={18} className="text-[#74777f]" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-sm font-bold text-[#191c1d]">{buyer?.full_name ?? "Anonymous"}</p>
                      <Badge variant={inq.status as "pending" | "contacted" | "closed"}>
                        {inq.status}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#476083] font-label mb-3">
                      <Building2 size={12} className="text-emerald-500" />
                      <span className="truncate">{property?.title ?? "Deleted property"}</span>
                      <span className="text-[#c4c6cf]">•</span>
                      <Clock size={12} />
                      {timeAgo(inq.created_at)}
                    </div>

                    <p className="text-sm text-[#476083] bg-[#f8f9fa] rounded-xl px-4 py-3 font-label">
                      &ldquo;{inq.message}&rdquo;
                    </p>

                    {buyer?.phone_number && (
                      <a
                        href={`tel:${buyer.phone_number}`}
                        className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-emerald-600 hover:text-emerald-700 font-label"
                      >
                        📞 {buyer.phone_number}
                      </a>
                    )}
                  </div>

                  {/* Status actions */}
                  <InquiryStatusButton inquiryId={inq.id} currentStatus={inq.status} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
