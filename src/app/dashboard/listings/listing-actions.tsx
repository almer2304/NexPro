"use client";
import { useState } from "react";
import { Eye, EyeOff, Trash2, Loader2, Tag } from "lucide-react";
import { updateListing, deleteListing } from "@/lib/supabase/actions";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import type { PropertyStatus } from "@/types";

export function TogglePublishButton({ propertyId, isPublished }: { propertyId: string; isPublished: boolean }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleToggle() {
    setLoading(true);
    try {
      await updateListing(propertyId, { is_published: !isPublished });
      toast("success", isPublished ? "Listing dinonaktifkan" : "Listing sekarang live! 🚀");
      router.refresh();
    } catch (err: unknown) {
      toast("error", err instanceof Error ? err.message : "Gagal update listing");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={handleToggle} disabled={loading} title={isPublished ? "Nonaktifkan" : "Publikasikan"}
      className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
        isPublished ? "text-emerald-600 hover:bg-emerald-50" : "text-[#74777f] hover:bg-[#f3f4f5] hover:text-[#191c1d]"
      }`}>
      {loading ? <Loader2 size={15} className="animate-spin" /> : isPublished ? <Eye size={15} /> : <EyeOff size={15} />}
    </button>
  );
}

export function PropertyStatusButton({
  propertyId,
  currentStatus,
  listingType,
}: {
  propertyId: string;
  currentStatus: PropertyStatus;
  listingType: string;
}) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const options: { value: PropertyStatus; label: string; color: string }[] =
    listingType === "sale"
      ? [
          { value: "available", label: "Tersedia", color: "text-emerald-600" },
          { value: "sold", label: "Terjual", color: "text-red-600" },
        ]
      : [
          { value: "available", label: "Tersedia", color: "text-emerald-600" },
          { value: "rented", label: "Sedang Disewa", color: "text-orange-500" },
        ];

  async function setStatus(status: PropertyStatus) {
    setOpen(false);
    if (status === currentStatus) return;
    setLoading(true);
    try {
      await updateListing(propertyId, { property_status: status });
      toast("success", `Status diubah: ${options.find(o => o.value === status)?.label}`);
      router.refresh();
    } catch (err: unknown) {
      toast("error", err instanceof Error ? err.message : "Gagal mengubah status");
    } finally {
      setLoading(false);
    }
  }

  const current = options.find((o) => o.value === currentStatus) ?? options[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={loading}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors disabled:opacity-50 ${
          currentStatus === "available"
            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            : "bg-red-50 text-red-600 hover:bg-red-100"
        }`}
        title="Ubah status"
      >
        {loading ? <Loader2 size={12} className="animate-spin" /> : <Tag size={12} />}
        {current.label}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 bg-white border border-[#e1e3e4] rounded-xl shadow-lg z-20 py-1 min-w-[140px]">
            {options.map((opt) => (
              <button key={opt.value} onClick={() => setStatus(opt.value)}
                className={`w-full px-4 py-2.5 text-left text-xs font-bold transition-colors hover:bg-[#f3f4f5] ${opt.color} ${opt.value === currentStatus ? "bg-[#f8f9fa]" : ""}`}>
                {opt.value === currentStatus ? "✓ " : ""}{opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function DeleteListingButton({ propertyId, title }: { propertyId: string; title: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`Yakin ingin menghapus "${title}"?\nTindakan ini tidak bisa dibatalkan.`)) return;
    setLoading(true);
    try {
      await deleteListing(propertyId);
      toast("success", "Listing berhasil dihapus");
      router.refresh();
    } catch (err: unknown) {
      toast("error", err instanceof Error ? err.message : "Gagal menghapus listing");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={handleDelete} disabled={loading} title="Hapus"
      className="p-2 rounded-lg text-[#74777f] hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-50">
      {loading ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
    </button>
  );
}
