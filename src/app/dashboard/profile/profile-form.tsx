"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Camera, Save, Lock, User, Phone, Mail, Shield } from "lucide-react";
import { updateProfile, uploadAvatar, updatePassword } from "@/lib/supabase/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import type { Profile } from "@/types";

const profileSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  phone_number: z.string().optional(),
});

const passwordSchema = z.object({
  new_password: z.string().min(8, "Minimum 8 characters"),
  confirm_password: z.string(),
}).refine((d) => d.new_password === d.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

interface ProfileFormProps {
  profile: Profile | null;
  email: string;
}

export function ProfileForm({ profile, email }: ProfileFormProps) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile?.avatar_url ?? null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting, isDirty } } = useForm<{ full_name: string; phone_number: string }>({
    resolver: zodResolver(profileSchema),
    defaultValues: { full_name: profile?.full_name ?? "", phone_number: profile?.phone_number ?? "" },
  });

  const { register: regPwd, handleSubmit: handlePwd, reset: resetPwd, formState: { errors: pwdErrors, isSubmitting: isPwdSubmitting } } = useForm<{ current_password: string; new_password: string; confirm_password: string }>({
    resolver: zodResolver(passwordSchema),
  });

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    setUploadingAvatar(true);
    try {
      const fd = new FormData();
      fd.append("avatar", file);
      await uploadAvatar(fd);
      toast("success", "Profile photo updated!");
      router.refresh();
    } catch {
      toast("error", "Failed to upload photo");
      setAvatarPreview(profile?.avatar_url ?? null);
    } finally {
      setUploadingAvatar(false);
    }
  }

  async function onSave(data: { full_name: string; phone_number?: string }) {
    try {
      await updateProfile(data);
      toast("success", "Profile updated successfully!");
      router.refresh();
    } catch {
      toast("error", "Failed to update profile");
    }
  }

  async function onChangePassword(data: { new_password: string; confirm_password: string }) {
    try {
      await updatePassword(data.new_password);
      toast("success", "Password changed successfully!");
      resetPwd();
      setChangingPassword(false);
    } catch {
      toast("error", "Failed to change password. Please log in again and retry.");
    }
  }

  const initials = profile?.full_name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() ?? "U";

  return (
    <div className="space-y-6">
      {/* Avatar Section */}
      <div className="bg-white rounded-2xl border border-[#e1e3e4] p-6">
        <h2 className="text-base font-bold text-[#000802] mb-5 pb-3 border-b border-[#f3f4f5]">
          Profile Photo
        </h2>
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-emerald-100 flex items-center justify-center border-4 border-white shadow-md">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-black text-emerald-700">{initials}</span>
              )}
            </div>
            {uploadingAvatar && (
              <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          <div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploadingAvatar}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-[#c4c6cf] text-sm font-semibold text-[#476083] hover:border-emerald-400 hover:text-emerald-600 transition-all"
            >
              <Camera size={16} />
              {uploadingAvatar ? "Uploading..." : "Change Photo"}
            </button>
            <p className="text-xs text-[#74777f] font-label mt-1.5">JPG, PNG or WEBP · Max 5MB</p>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <form onSubmit={handleSubmit(onSave)} className="bg-white rounded-2xl border border-[#e1e3e4] p-6 space-y-5">
        <h2 className="text-base font-bold text-[#000802] pb-3 border-b border-[#f3f4f5]">
          Personal Information
        </h2>

        {/* Email (read-only) */}
        <div>
          <label className="input-label">Email Address</label>
          <div className="flex items-center gap-3 h-11 px-4 rounded-xl border border-[#e1e3e4] bg-[#f8f9fa]">
            <Mail size={15} className="text-[#74777f] shrink-0" />
            <span className="text-sm text-[#74777f] font-label">{email}</span>
            <span className="ml-auto text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-label">Verified</span>
          </div>
        </div>

        <Input
          {...register("full_name")}
          label="Full Name"
          placeholder="Budi Santoso"
          icon={<User size={15} />}
          error={errors.full_name?.message}
        />
        <Input
          {...register("phone_number")}
          label="Phone / WhatsApp Number"
          type="tel"
          placeholder="+62 812-3456-7890"
          icon={<Phone size={15} />}
        />

        {/* Role badge */}
        <div className="flex items-center gap-3 p-4 bg-[#f8f9fa] rounded-xl">
          <Shield size={16} className="text-emerald-500 shrink-0" />
          <div>
            <p className="text-sm font-bold text-[#191c1d]">Account Role</p>
            <p className="text-xs text-[#476083] font-label capitalize">{profile?.role ?? "customer"} — Contact support to change roles.</p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="emerald" loading={isSubmitting} disabled={!isDirty}>
            <Save size={15} /> Save Changes
          </Button>
        </div>
      </form>

      {/* Change Password */}
      <div className="bg-white rounded-2xl border border-[#e1e3e4] p-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#f3f4f5] mb-5">
          <h2 className="text-base font-bold text-[#000802]">Password & Security</h2>
          <button
            type="button"
            onClick={() => setChangingPassword((v) => !v)}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 font-label"
          >
            {changingPassword ? "Cancel" : "Change Password"}
          </button>
        </div>

        {changingPassword ? (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            onSubmit={handlePwd(onChangePassword)}
            className="space-y-4"
          >
            <Input
              {...regPwd("new_password")}
              label="New Password"
              type="password"
              placeholder="Minimum 8 characters"
              icon={<Lock size={15} />}
              error={pwdErrors.new_password?.message}
            />
            <Input
              {...regPwd("confirm_password")}
              label="Confirm New Password"
              type="password"
              placeholder="Repeat password"
              icon={<Lock size={15} />}
              error={pwdErrors.confirm_password?.message}
            />
            <Button type="submit" variant="default" loading={isPwdSubmitting} size="sm">
              Update Password
            </Button>
          </motion.form>
        ) : (
          <p className="text-sm text-[#476083] font-label">
            ••••••••••••&nbsp; Last changed: never
          </p>
        )}
      </div>
    </div>
  );
}
