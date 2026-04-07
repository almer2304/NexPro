"use client";
import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageSquare, CheckCircle2, LogIn, Loader2, Phone } from "lucide-react";
import { inquirySchema, type InquiryInput } from "@/lib/validations";
import { submitInquiry } from "@/lib/supabase/actions";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

interface Props {
  propertyId: string;
  propertyTitle: string;
  agentPhone?: string | null;
  isLoggedIn: boolean;
}

export function InquirySection({ propertyId, propertyTitle, agentPhone, isLoggedIn }: Props) {
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<InquiryInput>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      message: `Halo, saya tertarik dengan "${propertyTitle}". Bisa berikan informasi lebih lanjut?`,
    },
  });

  const waLink = agentPhone
    ? `https://wa.me/${agentPhone.replace(/\D/g, "")}?text=${encodeURIComponent(`Halo, saya tertarik dengan "${propertyTitle}". Bisa info lebih lanjut?`)}`
    : null;

  async function onSubmit(data: InquiryInput) {
    try {
      await submitInquiry(propertyId, data);
      setSubmitted(true);
      toast("success", "Pesan terkirim! Agen akan menghubungi kamu segera.");
    } catch (err: unknown) {
      toast("error", err instanceof Error ? err.message : "Gagal mengirim pesan");
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="text-center p-4 rounded-xl bg-[#f8f9fa] border border-[#e1e3e4]">
        <MessageSquare size={22} className="text-[#c4c6cf] mx-auto mb-2" />
        <p className="text-sm font-bold text-[#191c1d] mb-1">Ingin bertanya?</p>
        <p className="text-xs text-[#476083] font-label mb-3">Login untuk mengirim pesan ke agen.</p>
        <Link href={`/login?redirectTo=/properties/${propertyId}`}>
          <Button size="sm" className="w-full"><LogIn size={14} /> Login untuk Menghubungi</Button>
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="text-center p-5 rounded-xl bg-emerald-50 border border-emerald-100">
        <CheckCircle2 size={28} className="text-emerald-500 mx-auto mb-2" />
        <p className="text-sm font-bold text-emerald-800">Pesan Terkirim!</p>
        <p className="text-xs text-emerald-600 font-label mt-1">Agen akan menghubungi kamu dalam 24 jam.</p>
        {waLink && (
          <a href={waLink} target="_blank" rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-2 text-xs font-bold text-green-700 bg-green-50 hover:bg-green-100 border border-green-100 rounded-xl py-2.5 transition-colors">
            <Phone size={13} /> Lanjut via WhatsApp
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <textarea {...register("message")} rows={3}
            className="w-full px-3 py-2.5 rounded-xl border border-[#c4c6cf] bg-white text-sm text-[#191c1d] placeholder:text-[#74777f] resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-label leading-relaxed" />
          {errors.message && <p className="mt-1 text-xs text-red-500 font-label">{errors.message.message}</p>}
        </div>
        <Button type="submit" className="w-full" loading={isSubmitting}>
          <MessageSquare size={15} /> Kirim Pesan ke Agen
        </Button>
      </form>
    </div>
  );
}
