import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EditListingForm } from "./edit-form";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Edit Listing | Dashboard" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditListingPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: property, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .eq("agent_id", user.id)   // Ensure ownership via RLS + explicit check
    .single();

  if (error || !property) notFound();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-extrabold text-[#000802]">Edit Listing</h1>
        <p className="text-sm text-[#476083] font-label mt-1 truncate max-w-lg">
          {property.title}
        </p>
      </div>
      <EditListingForm property={property} />
    </div>
  );
}
