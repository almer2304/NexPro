import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Masukkan alamat email yang valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

export const signupSchema = z.object({
  full_name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Masukkan alamat email yang valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  phone_number: z.string().optional(),
  role: z.enum(["agent", "customer"]).default("customer"),
});

export const listingSchema = z.object({
  title: z.string().min(5, "Judul minimal 5 karakter"),
  description: z.string().min(20, "Deskripsi minimal 20 karakter").optional(),
  price: z.coerce.number().positive("Harga harus angka positif"),
  address: z.string().min(5, "Alamat wajib diisi"),
  city: z.string().min(2, "Kota wajib diisi"),
  property_type: z.enum(["house", "apartment", "land"]),
  listing_type: z.enum(["sale", "rent"]),
  rent_period: z.enum(["day", "week", "month"]).optional(),
  bedrooms: z.coerce.number().int().min(0).default(0),
  bathrooms: z.coerce.number().int().min(0).default(0),
  land_size: z.coerce.number().positive().optional(),
  building_size: z.coerce.number().positive().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  is_published: z.boolean().default(false),
  is_featured: z.boolean().default(false),
});

export const inquirySchema = z.object({
  message: z.string().min(10, "Pesan minimal 10 karakter").max(500, "Pesan terlalu panjang"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ListingInput = z.infer<typeof listingSchema>;
export type InquiryInput = z.infer<typeof inquirySchema>;
