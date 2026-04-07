"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { updateInquiryStatus } from "@/lib/supabase/actions";
import { toast } from "@/components/ui/toast";

type Status = "pending" | "contacted" | "closed";

const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "contacted", label: "Contacted" },
  { value: "closed", label: "Closed" },
];

export function InquiryStatusButton({
  inquiryId,
  currentStatus,
}: {
  inquiryId: string;
  currentStatus: string;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleChange(status: Status) {
    setOpen(false);
    if (status === currentStatus) return;
    setLoading(true);
    try {
      await updateInquiryStatus(inquiryId, status);
      toast("success", `Status updated to ${status}`);
      router.refresh();
    } catch {
      toast("error", "Failed to update status");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative shrink-0">
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={loading}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#f3f4f5] hover:bg-[#e7e8e9] transition-colors text-xs font-bold text-[#476083]"
      >
        Update <ChevronDown size={12} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-xl shadow-card-hover border border-[#e1e3e4] overflow-hidden z-20">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleChange(opt.value)}
                className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors ${
                  opt.value === currentStatus
                    ? "bg-[#f3f4f5] text-[#191c1d]"
                    : "text-[#476083] hover:bg-[#f8f9fa] hover:text-[#191c1d]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
