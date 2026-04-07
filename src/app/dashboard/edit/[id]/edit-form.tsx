"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Save, X, ImagePlus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { listingSchema, type ListingInput } from "@/lib/validations";
import { updateListing, uploadPropertyImages } from "@/lib/supabase/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import type { Property } from "@/types";

interface EditListingFormProps {
  property: Property;
}

export function EditListingForm({ property }: EditListingFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(
    property.images_urls ?? (property.main_image_url ? [property.main_image_url] : [])
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ListingInput>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: property.title,
      description: property.description ?? "",
      price: property.price,
      address: property.address,
      city: property.city,
      property_type: property.property_type ?? "house",
      listing_type: property.listing_type,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      land_size: property.land_size ?? undefined,
      building_size: property.building_size ?? undefined,
      latitude: property.latitude ?? undefined,
      longitude: property.longitude ?? undefined,
      is_published: property.is_published,
      is_featured: property.is_featured,
    },
  });

  function handleNewImages(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const combined = [...newImages, ...files].slice(0, 10 - existingImages.length);
    setNewImages(combined);
    setNewPreviews(combined.map((f) => URL.createObjectURL(f)));
  }

  function removeExisting(idx: number) {
    setExistingImages((prev) => prev.filter((_, i) => i !== idx));
  }

  function removeNew(idx: number) {
    setNewImages((prev) => prev.filter((_, i) => i !== idx));
    setNewPreviews((prev) => prev.filter((_, i) => i !== idx));
  }

  async function onSubmit(data: ListingInput) {
    setIsSaving(true);
    try {
      let finalImageUrls = [...existingImages];

      if (newImages.length > 0) {
        const formData = new FormData();
        newImages.forEach((f) => formData.append("images", f));
        const uploaded = await uploadPropertyImages(formData);
        finalImageUrls = [...finalImageUrls, ...uploaded];
      }

      await updateListing(property.id, data, finalImageUrls);
      toast("success", "Listing updated successfully!");
      router.push("/dashboard/listings");
      router.refresh();
    } catch (err: unknown) {
      toast("error", err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  }

  const isPublished = watch("is_published");
  const isFeatured = watch("is_featured");
  const listingType = watch("listing_type");
  const propertyType = watch("property_type");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      {/* Basic Info */}
      <section className="bg-white rounded-2xl border border-[#e1e3e4] p-6 space-y-5">
        <h2 className="text-base font-bold text-[#000802] pb-3 border-b border-[#f3f4f5]">
          Basic Information
        </h2>

        <Input
          {...register("title")}
          label="Property Title"
          placeholder="e.g. Modern Villa with Private Pool in Kemang"
          error={errors.title?.message}
        />

        {/* Listing Type */}
        <div>
          <label className="input-label">Listing Type</label>
          <div className="grid grid-cols-2 gap-3">
            {(["sale", "rent"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setValue("listing_type", type, { shouldDirty: true })}
                className={`py-3 rounded-xl border-2 font-bold text-sm capitalize transition-all ${
                  listingType === type
                    ? "border-[#000802] bg-[#000802] text-white"
                    : "border-[#c4c6cf] text-[#476083] hover:border-[#000802]"
                }`}
              >
                For {type === "sale" ? "Sale" : "Rent"}
              </button>
            ))}
          </div>
        </div>

        {/* Property Type */}
        <div>
          <label className="input-label">Property Type</label>
          <div className="grid grid-cols-3 gap-3">
            {(["house", "apartment", "land"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setValue("property_type", type, { shouldDirty: true })}
                className={`py-3 rounded-xl border-2 font-bold text-sm capitalize transition-all ${
                  propertyType === type
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-[#c4c6cf] text-[#476083] hover:border-emerald-400"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <Input
          {...register("price")}
          label={`Price (IDR)${listingType === "rent" ? " per month" : ""}`}
          type="number"
          placeholder="e.g. 5000000000"
          error={errors.price?.message}
        />

        <div>
          <label className="input-label">Description</label>
          <textarea
            {...register("description")}
            rows={5}
            placeholder="Describe the property, its features, nearby amenities..."
            className="w-full px-4 py-3 rounded-xl border border-[#c4c6cf] bg-white text-sm text-[#191c1d] placeholder:text-[#74777f] resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </section>

      {/* Location & Details */}
      <section className="bg-white rounded-2xl border border-[#e1e3e4] p-6 space-y-5">
        <h2 className="text-base font-bold text-[#000802] pb-3 border-b border-[#f3f4f5]">
          Location & Details
        </h2>

        <Input
          {...register("address")}
          label="Full Address"
          placeholder="Jl. Kemang Raya No. 47, Jakarta Selatan"
          error={errors.address?.message}
        />
        <Input
          {...register("city")}
          label="City"
          placeholder="Jakarta"
          error={errors.city?.message}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input {...register("latitude")} label="Latitude" type="number" step="any" placeholder="-6.2615" />
          <Input {...register("longitude")} label="Longitude" type="number" step="any" placeholder="106.8106" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input {...register("bedrooms")} label="Bedrooms" type="number" min="0" error={errors.bedrooms?.message} />
          <Input {...register("bathrooms")} label="Bathrooms" type="number" min="0" error={errors.bathrooms?.message} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input {...register("building_size")} label="Building Size (m²)" type="number" placeholder="200" />
          <Input {...register("land_size")} label="Land Size (m²)" type="number" placeholder="300" />
        </div>
      </section>

      {/* Photos */}
      <section className="bg-white rounded-2xl border border-[#e1e3e4] p-6 space-y-5">
        <h2 className="text-base font-bold text-[#000802] pb-3 border-b border-[#f3f4f5]">
          Photos
        </h2>

        {/* Existing images */}
        {existingImages.length > 0 && (
          <div>
            <p className="input-label mb-3">Current Photos</p>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {existingImages.map((url, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden group border border-[#e1e3e4]">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  {i === 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-emerald-500 text-white text-[8px] font-black text-center py-0.5">
                      MAIN
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removeExisting(i)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New image upload */}
        <div>
          <p className="input-label mb-3">Add More Photos</p>
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#c4c6cf] rounded-2xl cursor-pointer bg-[#f8f9fa] hover:bg-[#f3f4f5] hover:border-emerald-400 transition-all">
            <ImagePlus size={24} className="text-[#c4c6cf] mb-2" />
            <p className="text-xs font-semibold text-[#476083]">Click to upload more photos</p>
            <input type="file" accept="image/*" multiple onChange={handleNewImages} className="hidden" />
          </label>

          {newPreviews.length > 0 && (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-3">
              {newPreviews.map((src, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden group border border-emerald-200">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <div className="absolute top-0 left-0 right-0 bg-emerald-500 text-white text-[8px] font-black text-center py-0.5">
                    NEW
                  </div>
                  <button
                    type="button"
                    onClick={() => removeNew(i)}
                    className="absolute top-4 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Publishing */}
      <section className="bg-white rounded-2xl border border-[#e1e3e4] p-6 space-y-4">
        <h2 className="text-base font-bold text-[#000802] pb-3 border-b border-[#f3f4f5]">
          Publishing Settings
        </h2>

        {[
          {
            key: "is_published" as const,
            label: "Published",
            desc: "Make this listing visible to the public",
            value: isPublished,
          },
          {
            key: "is_featured" as const,
            label: "Featured",
            desc: "Show this listing on the homepage featured section",
            value: isFeatured,
          },
        ].map(({ key, label, desc, value }) => (
          <div key={key} className="flex items-center justify-between p-4 bg-[#f8f9fa] rounded-xl">
            <div>
              <p className="text-sm font-bold text-[#191c1d]">{label}</p>
              <p className="text-xs text-[#476083] font-label mt-0.5">{desc}</p>
            </div>
            <button
              type="button"
              onClick={() => setValue(key, !value, { shouldDirty: true })}
              className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
                value ? "bg-emerald-500" : "bg-[#c4c6cf]"
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${
                  value ? "left-6" : "left-0.5"
                }`}
              />
            </button>
          </div>
        ))}
      </section>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 sticky bottom-6 bg-white/90 backdrop-blur-md border border-[#e1e3e4] rounded-2xl p-4 shadow-card-hover">
        <Link href="/dashboard/listings" className="shrink-0">
          <Button type="button" variant="outline" size="sm">
            <ArrowLeft size={14} /> Cancel
          </Button>
        </Link>
        <div className="flex-1" />
        <p className="text-xs text-[#74777f] font-label hidden sm:block">
          {isDirty ? "Unsaved changes" : "No changes"}
        </p>
        <Button
          type="submit"
          variant="emerald"
          size="default"
          loading={isSaving}
          disabled={!isDirty && newImages.length === 0}
        >
          <Save size={15} />
          Save Changes
        </Button>
      </div>
    </form>
  );
}
