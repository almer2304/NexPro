import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "./profile-form";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Profile | Dashboard" };

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-extrabold text-[#000802]">My Profile</h1>
        <p className="text-sm text-[#476083] font-label mt-0.5">Manage your personal information</p>
      </div>
      <ProfileForm profile={profile} email={user.email ?? ""} />
    </div>
  );
}
