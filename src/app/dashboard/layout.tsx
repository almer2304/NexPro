import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardSidebar } from "./sidebar";
import { DashboardContent } from "./dashboard-content";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles").select("*").eq("id", user.id).single();

  return (
    <div className="flex min-h-screen bg-[#f8f9fa] dark:bg-slate-950">
      <DashboardSidebar profile={profile} />
      {/* DashboardContent handles the dynamic margin based on sidebar state */}
      <DashboardContent>{children}</DashboardContent>
    </div>
  );
}
