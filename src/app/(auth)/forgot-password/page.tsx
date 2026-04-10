"use client";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, CheckCircle2, ArrowLeft } from "lucide-react";
import { sendPasswordResetEmail } from "@/lib/supabase/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

const schema = z.object({ email: z.string().email("Please enter a valid email") });

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<{ email: string }>({
    resolver: zodResolver(schema),
  });

  async function onSubmit({ email }: { email: string }) {
    try {
      await sendPasswordResetEmail(email);
      setSent(true);
    } catch {
      toast("error", "Failed to send reset email. Please check the address and try again.");
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 size={28} className="text-emerald-600" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#000802] mb-2">Check your email</h1>
            <p className="text-[#476083] font-label text-sm mb-6">
              We sent a password reset link. Check your inbox and follow the link to reset your password.
            </p>
            <Link href="/login">
              <Button variant="outline" className="w-full">
                <ArrowLeft size={15} /> Back to Login
              </Button>
            </Link>
          </motion.div>
        ) : (
          <motion.div key="form">
            <h1 className="text-3xl font-extrabold text-[#000802] mb-2">Forgot password?</h1>
            <p className="text-[#476083] font-label mb-8">
              Enter your email and we&apos;ll send you a reset link.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input
                {...register("email")}
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                icon={<Mail size={16} />}
                error={errors.email?.message}
              />
              <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
                Send Reset Link
              </Button>
            </form>
            <div className="mt-6 text-center">
              <Link href="/login" className="text-sm text-[#476083] hover:text-emerald-600 font-label flex items-center justify-center gap-1 transition-colors">
                <ArrowLeft size={14} /> Back to login
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
