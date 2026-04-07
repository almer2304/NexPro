"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";
import { loginSchema, type LoginInput } from "@/lib/validations";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginInput) {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      toast("error", error.message === "Invalid login credentials"
        ? "Email atau password salah"
        : error.message);
      return;
    }

    // FIX: Pakai window.location.href bukan router.push
    // router.push tidak sync session cookie dengan server components,
    // menyebabkan loading terus karena middleware redirect loop
    toast("success", "Login berhasil! Mengalihkan...");
    window.location.href = "/dashboard";
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <h1 className="text-3xl font-extrabold text-[#000802] mb-2">Selamat datang kembali</h1>
      <p className="text-[#476083] font-label mb-8">Masuk ke akun NexPro kamu</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
          placeholder="••••••••"
          autoComplete="current-password"
          icon={<Lock size={16} />}
          error={errors.password?.message}
        />

        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold font-label">
            Lupa password?
          </Link>
        </div>

        <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
          Masuk
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t border-[#e1e3e4] text-center">
        <p className="text-sm text-[#476083] font-label">
          Belum punya akun?{" "}
          <Link href="/signup" className="text-emerald-600 font-bold hover:text-emerald-700">
            Daftar gratis
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
