"use client";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { X, ImagePlus, CheckCircle, CheckCircle2 } from "lucide-react";
import { listingSchema, type ListingInput } from "@/lib/validations";
import { createListing, uploadPropertyImages } from "@/lib/supabase/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

const STEPS = ["Info Dasar", "Lokasi & Detail", "Foto & Publikasi"];

export function NewListingForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const { register, handleSubmit, watch, setValue, trigger, formState: { errors } } = useForm<ListingInput>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      listing_type: "sale",
      property_type: "house",
      rent_period: "month",
      bedrooms: 0,
      bathrooms: 0,
      is_published: false,
      is_featured: false,
    },
  });

  const listingType = watch("listing_type");
  const propertyType = watch("property_type");
  const rentPeriod = watch("rent_period");
  const isPublished = watch("is_published");
  const isFeatured = watch("is_featured");

  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const newFiles = [...imageFiles, ...files].slice(0, 10);
    setImageFiles(newFiles);
    setImagePreviews(newFiles.map((f) => URL.createObjectURL(f)));
    e.target.value = "";
  }, [imageFiles]);

  function removeImage(idx: number) {
    setImageFiles((p) => p.filter((_, i) => i !== idx));
    setImagePreviews((p) => p.filter((_, i) => i !== idx));
  }

  async function goNext() {
    const stepFields: (keyof ListingInput)[][] = [
      ["title", "price", "listing_type", "property_type"],
      ["address", "city", "bedrooms", "bathrooms"],
      [],
    ];
    const valid = await trigger(stepFields[step]);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  async function onSubmit(data: ListingInput) {
    setIsSubmitting(true);
    try {
      let imageUrls: string[] = [];
      if (imageFiles.length > 0) {
        const fd = new FormData();
        imageFiles.forEach((f) => fd.append("images", f));
        imageUrls = await uploadPropertyImages(fd);
      }
      await createListing(data, imageUrls);
      toast("success", data.is_published ? "Listing berhasil dipublikasikan! 🎉" : "Draft disimpan!");
      router.push("/dashboard/listings");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal membuat listing";
      if (msg.includes("violates row-level security")) {
        toast("error", "Akses ditolak. Pastikan akun kamu terdaftar sebagai agent.");
      } else {
        toast("error", msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const rentPeriodLabel: Record<string, string> = { day: "/hari", week: "/minggu", month: "/bulan" };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" suppressHydrationWarning>
      {/* Step Progress */}
      <div className="bg-white rounded-2xl p-6 border border-[#e1e3e4]">
        <div className="flex items-center">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                  i < step ? "bg-emerald-500 text-white" : i === step ? "bg-[#000802] text-white ring-4 ring-[#000802]/20" : "bg-[#f3f4f5] text-[#74777f]"
                }`}>
                  {i < step ? <CheckCircle size={14} /> : i + 1}
                </div>
                <span className="text-[10px] font-bold text-[#476083] mt-1.5 font-label whitespace-nowrap hidden sm:block">{label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 transition-colors ${i < step ? "bg-emerald-500" : "bg-[#e1e3e4]"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.2 }} className="bg-white rounded-2xl border border-[#e1e3e4] p-6 sm:p-8 space-y-6">

          {/* ── Step 0: Info Dasar ── */}
          {step === 0 && (
            <>
              <h2 className="text-lg font-bold text-[#191c1d]">Informasi Dasar</h2>

              <Input {...register("title")} label="Judul Properti"
                placeholder="cth. Villa Minimalis dengan Kolam Renang di Kemang"
                error={errors.title?.message} autoComplete="off" />

              {/* Listing Type */}
              <div>
                <label className="input-label">Tipe Listing</label>
                <div className="grid grid-cols-2 gap-3">
                  {(["sale", "rent"] as const).map((t) => (
                    <button key={t} type="button"
                      onClick={() => { setValue("listing_type", t, { shouldValidate: true }); if (t === "rent") setValue("rent_period", "month"); }}
                      className={`py-3.5 rounded-xl border-2 font-bold text-sm transition-all ${
                        listingType === t ? "border-[#000802] bg-[#000802] text-white" : "border-[#c4c6cf] text-[#476083] hover:border-[#000802]"
                      }`}>
                      {t === "sale" ? "Dijual" : "Disewakan"}
                    </button>
                  ))}
                </div>
                <input type="hidden" {...register("listing_type")} />
              </div>

              {/* Rent Period — only show for rent */}
              <AnimatePresence>
                {listingType === "rent" && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                    <label className="input-label">Periode Sewa</label>
                    <div className="grid grid-cols-3 gap-3">
                      {([
                        { value: "day", label: "Harian", desc: "per hari" },
                        { value: "week", label: "Mingguan", desc: "per minggu" },
                        { value: "month", label: "Bulanan", desc: "per bulan" },
                      ] as const).map(({ value, label, desc }) => (
                        <button key={value} type="button"
                          onClick={() => setValue("rent_period", value, { shouldValidate: true })}
                          className={`py-3 px-2 rounded-xl border-2 text-center transition-all ${
                            rentPeriod === value
                              ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                              : "border-[#c4c6cf] text-[#476083] hover:border-emerald-400"
                          }`}>
                          <p className="font-bold text-sm">{label}</p>
                          <p className="text-[10px] font-label opacity-70 mt-0.5">{desc}</p>
                        </button>
                      ))}
                    </div>
                    <input type="hidden" {...register("rent_period")} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Property Type */}
              <div>
                <label className="input-label">Tipe Properti</label>
                <div className="grid grid-cols-3 gap-3">
                  {(["house", "apartment", "land"] as const).map((t) => (
                    <button key={t} type="button"
                      onClick={() => setValue("property_type", t, { shouldValidate: true })}
                      className={`py-3 rounded-xl border-2 font-bold text-sm transition-all ${
                        propertyType === t ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-[#c4c6cf] text-[#476083] hover:border-emerald-400"
                      }`}>
                      {t === "house" ? "Rumah" : t === "apartment" ? "Apartemen" : "Tanah"}
                    </button>
                  ))}
                </div>
                <input type="hidden" {...register("property_type")} />
                {errors.property_type && <p className="mt-1 text-xs text-red-600 font-label">{errors.property_type.message}</p>}
              </div>

              <Input {...register("price")} label={`Harga (IDR)${listingType === "rent" ? ` ${rentPeriodLabel[rentPeriod ?? "month"]}` : ""}`}
                type="number" placeholder="cth. 5000000000"
                error={errors.price?.message} autoComplete="off" />

              <div>
                <label className="input-label">Deskripsi (Opsional)</label>
                <textarea {...register("description")} rows={4} autoComplete="off"
                  placeholder="Deskripsikan properti, fitur, dan lingkungan sekitar..."
                  className="w-full px-4 py-3 rounded-xl border border-[#c4c6cf] bg-white text-sm text-[#191c1d] placeholder:text-[#74777f] resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
              </div>
            </>
          )}

          {/* ── Step 1: Lokasi & Detail ── */}
          {step === 1 && (
            <>
              <h2 className="text-lg font-bold text-[#191c1d]">Lokasi & Detail Properti</h2>
              <Input {...register("address")} label="Alamat Lengkap" placeholder="Jl. Kemang Raya No. 47" error={errors.address?.message} autoComplete="off" />
              <Input {...register("city")} label="Kota" placeholder="Jakarta" error={errors.city?.message} autoComplete="off" />
              <div className="grid grid-cols-2 gap-4">
                <Input {...register("latitude")} label="Latitude (opsional)" type="number" step="any" placeholder="-6.2615" autoComplete="off" />
                <Input {...register("longitude")} label="Longitude (opsional)" type="number" step="any" placeholder="106.8106" autoComplete="off" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input {...register("bedrooms")} label="Kamar Tidur" type="number" min="0" placeholder="3" error={errors.bedrooms?.message} autoComplete="off" />
                <Input {...register("bathrooms")} label="Kamar Mandi" type="number" min="0" placeholder="2" error={errors.bathrooms?.message} autoComplete="off" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input {...register("building_size")} label="Luas Bangunan (m²)" type="number" placeholder="200" autoComplete="off" />
                <Input {...register("land_size")} label="Luas Tanah (m²)" type="number" placeholder="300" autoComplete="off" />
              </div>
            </>
          )}

          {/* ── Step 2: Foto & Publikasi ── */}
          {step === 2 && (
            <>
              <h2 className="text-lg font-bold text-[#191c1d]">Foto & Pengaturan Publikasi</h2>
              <div>
                <label className="input-label">Foto Properti (maks. 10)</label>
                <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-[#c4c6cf] rounded-2xl cursor-pointer bg-[#f8f9fa] hover:bg-[#f3f4f5] hover:border-emerald-400 transition-all">
                  <ImagePlus size={28} className="text-[#c4c6cf] mb-2" />
                  <p className="text-sm font-semibold text-[#476083]">Klik untuk upload foto</p>
                  <p className="text-xs text-[#74777f] font-label mt-1">PNG, JPG, WEBP maks. 10MB</p>
                  <input type="file" accept="image/*" multiple onChange={handleImageSelect} className="hidden" />
                </label>
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mt-4">
                    {imagePreviews.map((src, i) => (
                      <div key={i} className="relative aspect-square rounded-xl overflow-hidden group border border-[#e1e3e4]">
                        <img src={src} alt="" className="w-full h-full object-cover" />
                        {i === 0 && <div className="absolute bottom-0 left-0 right-0 bg-emerald-500 text-white text-[8px] font-black text-center py-0.5 font-label">UTAMA</div>}
                        <button type="button" onClick={() => removeImage(i)}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <ToggleRow label="Tampilkan sebagai Featured" desc="Listing featured muncul di halaman utama"
                checked={isFeatured} onChange={() => setValue("is_featured", !isFeatured)} />

              <ToggleRow label="Publikasikan Sekarang" desc="Jika mati, listing disimpan sebagai draft"
                checked={isPublished} onChange={() => setValue("is_published", !isPublished)} highlight />

              <div className={`flex items-center gap-3 p-3 rounded-xl text-sm font-label ${
                isPublished ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-[#f8f9fa] text-[#476083] border border-[#e1e3e4]"
              }`}>
                <CheckCircle2 size={16} className={isPublished ? "text-emerald-500" : "text-[#c4c6cf]"} />
                {isPublished ? "Listing akan langsung tampil di halaman pencarian." : "Listing disimpan sebagai draft. Bisa dipublikasikan nanti dari halaman Listing Saya."}
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button type="button" variant="outline" onClick={() => setStep((s) => Math.max(s - 1, 0))} disabled={step === 0}>
          ← Kembali
        </Button>
        {step < STEPS.length - 1 ? (
          <Button type="button" onClick={goNext}>Lanjut →</Button>
        ) : (
          <Button type="submit" variant="emerald" size="lg" loading={isSubmitting}>
            {isPublished ? "🚀 Publikasikan Listing" : "💾 Simpan Draft"}
          </Button>
        )}
      </div>
    </form>
  );
}

function ToggleRow({ label, desc, checked, onChange, highlight }: {
  label: string; desc: string; checked: boolean; onChange: () => void; highlight?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
      checked && highlight ? "bg-emerald-50 border-emerald-100" : "bg-[#f8f9fa] border-[#e1e3e4]"
    }`}>
      <div>
        <p className="text-sm font-bold text-[#191c1d]">{label}</p>
        <p className="text-xs text-[#476083] font-label mt-0.5">{desc}</p>
      </div>
      <button type="button" onClick={onChange}
        className={`relative w-12 h-6 rounded-full transition-colors shrink-0 ml-4 ${
          checked ? (highlight ? "bg-[#000802]" : "bg-emerald-500") : "bg-[#c4c6cf]"
        }`}>
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${checked ? "left-6" : "left-0.5"}`} />
      </button>
    </div>
  );
}
