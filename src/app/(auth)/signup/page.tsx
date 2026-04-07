"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, Building2, Phone } from "lucide-react";
import { signupSchema, type SignupInput } from "@/lib/validations";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

export default function SignupPage() {
  const searchParams = useSearchParams();
  const defaultRole = (searchParams.get("role") as "agent" | "customer") || "customer";

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { role: defaultRole },
  });

  const role = watch("role");

  async function onSubmit(data: SignupInput) {
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.full_name,
          role: data.role,
          phone_number: data.phone_number ?? null,
        },
      },
    });
    if (error) {
      toast("error", error.message);
      return;
    }
    // Update phone_number di profiles jika ada
    if (data.phone_number) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("profiles").update({
          phone_number: data.phone_number,
        }).eq("id", user.id);
      }
    }
    toast("success", "Akun berhasil dibuat!");
    window.location.href = "/dashboard";
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <h1 className="text-3xl font-extrabold text-[#000802] mb-2">Buat akun baru</h1>
      <p className="text-[#476083] font-label mb-6">Bergabung dengan ribuan pengguna NexPro</p>

      {/* Role Selector */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {(["customer", "agent"] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setValue("role", r)}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${
              role === r
                ? "border-emerald-500 bg-emerald-50"
                : "border-[#e1e3e4] bg-white hover:border-[#c4c6cf]"
            }`}
          >
            {r === "customer"
              ? <User size={20} className={role === r ? "text-emerald-600" : "text-[#74777f]"} />
              : <Building2 size={20} className={role === r ? "text-emerald-600" : "text-[#74777f]"} />
            }
            <p className={`text-sm font-bold mt-2 ${role === r ? "text-emerald-700" : "text-[#191c1d]"}`}>
              {r === "customer" ? "Pembeli / Penyewa" : "Agen Properti"}
            </p>
            <p className="text-xs text-[#74777f] font-label mt-0.5">
              {r === "customer" ? "Cari properti impian" : "Pasang & kelola listing"}
            </p>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...register("full_name")}
          label="Nama Lengkap"
          placeholder="Budi Santoso"
          autoComplete="name"
          icon={<User size={16} />}
          error={errors.full_name?.message}
        />
        <Input
          {...register("email")}
          label="Alamat Email"
          type="email"
          placeholder="kamu@example.com"
          autoComplete="email"
          icon={<Mail size={16} />}
          error={errors.email?.message}
        />
        <Input
          {...register("password")}
          label="Password"
          type="password"
          placeholder="Min. 8 karakter"
          autoComplete="new-password"
          icon={<Lock size={16} />}
          error={errors.password?.message}
        />

        {/* Phone number - only for agents */}
        <AnimatePresence>
          {role === "agent" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <Input
                {...register("phone_number")}
                label="Nomor WhatsApp / HP"
                type="tel"
                placeholder="+62 812-3456-7890"
                autoComplete="tel"
                icon={<Phone size={16} />}
                error={errors.phone_number?.message}
              />
              <p className="text-xs text-[#74777f] font-label mt-1.5">
                📱 Nomor ini akan ditampilkan kepada calon pembeli untuk dihubungi via WhatsApp
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
          Buat Akun
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t border-[#e1e3e4] text-center">
        <p className="text-sm text-[#476083] font-label">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-emerald-600 font-bold hover:text-emerald-700">
            Masuk
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
