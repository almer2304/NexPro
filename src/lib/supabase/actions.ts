"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { PropertyFilters } from "@/types";
import type { ListingInput, InquiryInput } from "@/lib/validations";

// ── Utility ───────────────────────────────────────────────────
function slugify(text: string): string {
  return (
    text.toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") +
    "-" + Math.random().toString(36).slice(2, 7)
  );
}

// Terjemahkan error Supabase ke pesan yang mudah dibaca
function humanizeError(error: { message?: string; code?: string; details?: string }): string {
  const msg = error?.message ?? "";
  const code = error?.code ?? "";

  if (msg.includes("violates row-level security") || code === "42501") {
    return "Akses ditolak (RLS). Pastikan role kamu 'agent' di Supabase → Table Editor → profiles";
  }
  if (msg.includes("duplicate key") || code === "23505") {
    return "Judul properti sudah ada. Coba gunakan judul yang berbeda.";
  }
  if (msg.includes("violates foreign key") || code === "23503") {
    return "Data referensi tidak valid. Coba login ulang.";
  }
  if (msg.includes("not-null constraint") || code === "23502") {
    return `Field wajib kosong: ${error?.details ?? "Cek semua field yang harus diisi"}`;
  }
  if (msg.includes("JWT") || msg.includes("token")) {
    return "Sesi expired. Silakan login ulang.";
  }
  if (msg.includes("Failed to fetch") || msg.includes("ECONNRESET")) {
    return "Koneksi ke server gagal. Cek .env.local apakah SUPABASE_URL dan ANON_KEY sudah benar.";
  }
  return msg || "Terjadi kesalahan. Cek console untuk detail.";
}

// ── Properties ────────────────────────────────────────────────

export async function getProperties(filters: PropertyFilters = {}, limit = 12, offset = 0) {
  const supabase = await createClient();

  let query = supabase
    .from("properties")
    .select("*, profiles(id, full_name, avatar_url, phone_number)", { count: "exact" })
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (filters.city) query = query.ilike("city", `%${filters.city}%`);
  if (filters.property_type) query = query.eq("property_type", filters.property_type);
  if (filters.listing_type) query = query.eq("listing_type", filters.listing_type);
  if (filters.min_price) query = query.gte("price", filters.min_price);
  if (filters.max_price) query = query.lte("price", filters.max_price);
  if (filters.min_bedrooms) query = query.gte("bedrooms", filters.min_bedrooms);
  if (filters.min_bathrooms) query = query.gte("bathrooms", filters.min_bathrooms);
  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,address.ilike.%${filters.search}%,city.ilike.%${filters.search}%`);
  }

  const { data, error, count } = await query;
  if (error) {
    console.error("[getProperties] Error:", error);
    return { properties: [], count: 0 };
  }
  return { properties: data ?? [], count: count ?? 0 };
}

export async function getPropertyBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*, profiles(id, full_name, avatar_url, phone_number)")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  if (error) {
    console.error("[getPropertyBySlug] Error:", error);
    return null;
  }
  return data;
}

export async function getFeaturedProperties(limit = 6) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("properties")
    .select("*, profiles(id, full_name, avatar_url)")
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getAgentProperties() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("agent_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getAgentProperties] Error:", error);
    return [];
  }
  return data ?? [];
}

export async function createListing(input: ListingInput, imageUrls: string[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Kamu harus login untuk membuat listing.");

  // Cek role agent
  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single();

  if (profile?.role !== "agent") {
    throw new Error(`Akun kamu bertipe '${profile?.role ?? "unknown"}', bukan 'agent'. Ganti role di Supabase → Table Editor → profiles, kolom role, set ke 'agent'.`);
  }

  const slug = slugify(input.title);

  console.log("[createListing] Attempting insert:", {
    agent_id: user.id,
    title: input.title,
    slug,
    is_published: input.is_published,
  });

  const { data, error } = await supabase
    .from("properties")
    .insert({
      ...input,
      slug,
      agent_id: user.id,
      main_image_url: imageUrls[0] ?? null,
      images_urls: imageUrls,
    })
    .select()
    .single();

  if (error) {
    console.error("[createListing] Supabase error:", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
    throw new Error(humanizeError(error));
  }

  console.log("[createListing] Success:", data?.id);
  revalidatePath("/dashboard/listings");
  revalidatePath("/search");
  return data;
}

export async function updateListing(id: string, input: Partial<ListingInput>, imageUrls?: string[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Kamu harus login.");

  const updateData: Record<string, unknown> = { ...input };
  if (imageUrls) {
    updateData.main_image_url = imageUrls[0] ?? null;
    updateData.images_urls = imageUrls;
  }

  console.log("[updateListing] Updating:", id, Object.keys(updateData));

  const { error } = await supabase
    .from("properties")
    .update(updateData)
    .eq("id", id)
    .eq("agent_id", user.id); // Eksplisit filter by owner

  if (error) {
    console.error("[updateListing] Error:", error);
    throw new Error(humanizeError(error));
  }

  revalidatePath("/dashboard/listings");
  revalidatePath(`/properties/${id}`);
}

export async function deleteListing(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Kamu harus login.");

  const { error } = await supabase
    .from("properties")
    .delete()
    .eq("id", id)
    .eq("agent_id", user.id);

  if (error) {
    console.error("[deleteListing] Error:", error);
    throw new Error(humanizeError(error));
  }
  revalidatePath("/dashboard/listings");
}

export async function uploadPropertyImages(formData: FormData): Promise<string[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Kamu harus login untuk upload gambar.");

  const files = formData.getAll("images") as File[];
  const uploadedUrls: string[] = [];

  for (const file of files) {
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    console.log("[uploadPropertyImages] Uploading:", path, file.size, "bytes");

    const { error } = await supabase.storage
      .from("property-images")
      .upload(path, file, { cacheControl: "3600", upsert: false });

    if (error) {
      console.error("[uploadPropertyImages] Error:", error);
      throw new Error(`Gagal upload foto: ${error.message}. Cek Storage Policy di Supabase.`);
    }

    const { data: { publicUrl } } = supabase.storage
      .from("property-images").getPublicUrl(path);

    uploadedUrls.push(publicUrl);
    console.log("[uploadPropertyImages] Uploaded:", publicUrl);
  }

  return uploadedUrls;
}

// ── Favorites ─────────────────────────────────────────────────

export async function toggleFavorite(propertyId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Login dulu untuk menyimpan properti.");

  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("property_id", propertyId)
    .single();

  if (existing) {
    const { error } = await supabase.from("favorites").delete().eq("id", existing.id);
    if (error) throw new Error(humanizeError(error));
    revalidatePath("/saved");
    return { action: "removed" };
  } else {
    const { error } = await supabase.from("favorites")
      .insert({ user_id: user.id, property_id: propertyId });
    if (error) throw new Error(humanizeError(error));
    revalidatePath("/saved");
    return { action: "added" };
  }
}

export async function getUserFavorites() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("favorites")
    .select("*, properties(*, profiles(id, full_name, avatar_url))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getUserFavoriteIds() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("favorites").select("property_id").eq("user_id", user.id);
  return (data ?? []).map((f) => f.property_id);
}

// ── Inquiries ─────────────────────────────────────────────────

export async function submitInquiry(propertyId: string, input: InquiryInput) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Login dulu untuk mengirim pesan.");

  const { error } = await supabase.from("inquiries").insert({
    property_id: propertyId,
    buyer_id: user.id,
    message: input.message,
  });

  if (error) {
    console.error("[submitInquiry] Error:", error);
    throw new Error(humanizeError(error));
  }
  revalidatePath(`/properties/${propertyId}`);
}

export async function getAgentInquiries() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: agentProps } = await supabase
    .from("properties").select("id").eq("agent_id", user.id);

  if (!agentProps || agentProps.length === 0) return [];

  const propertyIds = agentProps.map((p) => p.id);

  const { data, error } = await supabase
    .from("inquiries")
    .select("*, properties(id, title, slug, main_image_url), profiles(id, full_name, avatar_url, phone_number)")
    .in("property_id", propertyIds)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getAgentInquiries] Error:", error);
    return [];
  }
  return data ?? [];
}

export async function updateInquiryStatus(id: string, status: "pending" | "contacted" | "closed") {
  const supabase = await createClient();
  const { error } = await supabase.from("inquiries").update({ status }).eq("id", id);
  if (error) throw new Error(humanizeError(error));
  revalidatePath("/dashboard/inquiries");
}

// ── Notifications ─────────────────────────────────────────────

export async function getNotifications() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(30);
  return data ?? [];
}

export async function markNotificationRead(id: string) {
  const supabase = await createClient();
  await supabase.from("notifications").update({ is_read: true }).eq("id", id);
  revalidatePath("/dashboard");
}

export async function markAllNotificationsRead() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("notifications").update({ is_read: true }).eq("user_id", user.id);
  revalidatePath("/dashboard");
}

// ── Profile ───────────────────────────────────────────────────

export async function updateProfile(data: { full_name?: string; phone_number?: string; avatar_url?: string }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Kamu harus login.");

  const { error } = await supabase
    .from("profiles")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) throw new Error(humanizeError(error));
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/profile");
}

export async function uploadAvatar(formData: FormData): Promise<string> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Kamu harus login.");

  const file = formData.get("avatar") as File;
  if (!file) throw new Error("Tidak ada file yang dipilih.");

  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `avatars/${user.id}.${ext}`;

  const { error } = await supabase.storage
    .from("property-images")
    .upload(path, file, { cacheControl: "3600", upsert: true });

  if (error) throw new Error(`Gagal upload foto: ${humanizeError(error)}`);

  const { data: { publicUrl } } = supabase.storage
    .from("property-images").getPublicUrl(path);

  await updateProfile({ avatar_url: publicUrl });
  return publicUrl;
}

// ── Analytics ─────────────────────────────────────────────────

export async function recordPropertyView(propertyId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  await supabase.from("property_views").insert({
    property_id: propertyId,
    viewer_id: user?.id ?? null,
  });
}

export async function getAgentAnalytics() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: props } = await supabase
    .from("properties")
    .select("id, title, slug, main_image_url, price, is_published")
    .eq("agent_id", user.id);

  if (!props) return [];

  const results = await Promise.all(
    props.map(async (p) => {
      const { count: views } = await supabase
        .from("property_views").select("*", { count: "exact", head: true }).eq("property_id", p.id);
      const { count: inquiries } = await supabase
        .from("inquiries").select("*", { count: "exact", head: true }).eq("property_id", p.id);
      return { ...p, view_count: views ?? 0, inquiry_count: inquiries ?? 0 };
    })
  );
  return results;
}

// ── Compare ───────────────────────────────────────────────────

export async function getPropertiesByIds(ids: string[]) {
  if (ids.length === 0) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("properties")
    .select("*, profiles(id, full_name, avatar_url)")
    .in("id", ids)
    .eq("is_published", true);
  return data ?? [];
}

// ── Auth ──────────────────────────────────────────────────────

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  return profile;
}

export async function sendPasswordResetEmail(email: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
  });
  if (error) throw new Error(humanizeError(error));
}

export async function updatePassword(newPassword: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw new Error(humanizeError(error));
}

// ── Chat ──────────────────────────────────────────────────────

export async function getOrCreateChatRoom(propertyId: string, agentId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Login dulu untuk memulai chat.");

  // Check if room exists
  const { data: existing } = await supabase
    .from("chat_rooms")
    .select("*")
    .eq("property_id", propertyId)
    .eq("buyer_id", user.id)
    .eq("agent_id", agentId)
    .single();

  if (existing) return existing;

  // Create new room
  const { data: newRoom, error } = await supabase
    .from("chat_rooms")
    .insert({ property_id: propertyId, buyer_id: user.id, agent_id: agentId })
    .select()
    .single();

  if (error) throw new Error(humanizeError(error));
  return newRoom;
}

export async function getChatRooms() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // Step 1: Get rooms (no FK alias joins to avoid constraint name issues)
  const { data: rooms, error } = await supabase
    .from("chat_rooms")
    .select("id, property_id, buyer_id, agent_id, updated_at")
    .or(`buyer_id.eq.${user.id},agent_id.eq.${user.id}`)
    .order("updated_at", { ascending: false });

  if (error || !rooms || rooms.length === 0) return [];

  // Step 2: Get all unique profile IDs
  const profileIds = [...new Set([
    ...rooms.map(r => r.buyer_id),
    ...rooms.map(r => r.agent_id),
  ])];

  // Step 3: Get all property IDs
  const propertyIds = rooms.map(r => r.property_id).filter(Boolean) as string[];

  // Step 4: Fetch profiles and properties in parallel
  const [profilesRes, propertiesRes] = await Promise.all([
    supabase.from("profiles").select("id, full_name, avatar_url, phone_number").in("id", profileIds),
    propertyIds.length > 0
      ? supabase.from("properties").select("id, title, slug, main_image_url").in("id", propertyIds)
      : Promise.resolve({ data: [] }),
  ]);

  const profileMap: Record<string, any> = {};
  profilesRes.data?.forEach(p => { profileMap[p.id] = p; });

  const propMap: Record<string, any> = {};
  (propertiesRes.data ?? []).forEach((p: any) => { propMap[p.id] = p; });

  // Step 5: Get last message per room
  const { data: lastMsgs } = await supabase
    .from("chat_messages")
    .select("room_id, content, sender_id, created_at")
    .in("room_id", rooms.map(r => r.id))
    .order("created_at", { ascending: false });

  const lastMsgMap: Record<string, string> = {};
  lastMsgs?.forEach(m => {
    if (!lastMsgMap[m.room_id]) lastMsgMap[m.room_id] = m.content;
  });

  // Step 6: Assemble
  return rooms.map(room => ({
    ...room,
    buyer: profileMap[room.buyer_id] ?? null,
    agent: profileMap[room.agent_id] ?? null,
    properties: room.property_id ? propMap[room.property_id] ?? null : null,
    lastMessage: lastMsgMap[room.id] ?? null,
  }));
}

export async function getChatMessages(roomId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("chat_messages")
    .select("*, sender:profiles!chat_messages_sender_id_fkey(id, full_name, avatar_url)")
    .eq("room_id", roomId)
    .order("created_at", { ascending: true });

  // Mark messages as read
  await supabase
    .from("chat_messages")
    .update({ is_read: true })
    .eq("room_id", roomId)
    .neq("sender_id", user.id);

  return data ?? [];
}

export async function sendChatMessage(roomId: string, content: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Login dulu untuk mengirim pesan.");

  const { data, error } = await supabase
    .from("chat_messages")
    .insert({ room_id: roomId, sender_id: user.id, content })
    .select("*, sender:profiles!chat_messages_sender_id_fkey(id, full_name, avatar_url)")
    .single();

  if (error) throw new Error(humanizeError(error));
  return data;
}

export async function getUnreadChatCount() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  // Get rooms where user is participant
  const { data: rooms } = await supabase
    .from("chat_rooms")
    .select("id")
    .or(`buyer_id.eq.${user.id},agent_id.eq.${user.id}`);

  if (!rooms || rooms.length === 0) return 0;

  const roomIds = rooms.map(r => r.id);
  const { count } = await supabase
    .from("chat_messages")
    .select("*", { count: "exact", head: true })
    .in("room_id", roomIds)
    .eq("is_read", false)
    .neq("sender_id", user.id);

  return count ?? 0;
}
