"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Lock, CheckCircle2 } from "lucide-react";
import { updatePassword } from "@/lib/supabase/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import Link from "next/link";

const schema = z.object({
  password: z.string().min(8, "Minimum 8 characters"),
  confirm: z.string(),
}).refine((d) => d.password === d.confirm, {
  message: "Passwords don't match",
  path: ["confirm"],
});

export default function ResetPasswordPage() {
  const router = useRouter();
  const [done, setDone] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  async function onSubmit({ password }: { password: string; confirm: string }) {
    try {
      await updatePassword(password);
      setDone(true);
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch {
      toast("error", "Failed to reset password. The link may have expired.");
    }
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={28} className="text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-[#000802]">Password updated!</h2>
          <p className="text-sm text-[#476083] font-label mt-1">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl p-8 shadow-card-hover border border-[#e1e3e4]"
      >
        <Link href="/" className="block mb-8">
          <span className="text-xl font-black tracking-tight text-[#000802]">
            Nex<span className="text-emerald-500">Pro</span>
          </span>
        </Link>
        <h1 className="text-2xl font-extrabold text-[#000802] mb-2">Set new password</h1>
        <p className="text-[#476083] font-label text-sm mb-6">Choose a strong password for your account.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            {...register("password")}
            label="New Password"
            type="password"
            placeholder="Minimum 8 characters"
            icon={<Lock size={16} />}
            error={errors.password?.message}
          />
          <Input
            {...register("confirm")}
            label="Confirm Password"
            type="password"
            placeholder="Repeat your password"
            icon={<Lock size={16} />}
            error={errors.confirm?.message}
          />
          <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
            Update Password
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
