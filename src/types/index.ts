export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type PropertyType = "house" | "apartment" | "land";
export type ListingType = "sale" | "rent";
export type RentPeriod = "day" | "week" | "month";
export type PropertyStatus = "available" | "sold" | "rented";
export type InquiryStatus = "pending" | "contacted" | "closed";
export type UserRole = "agent" | "customer";
export type NotificationType = "inquiry" | "favorite" | "system";

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  phone_number: string | null;
  role: UserRole;
  updated_at: string;
  created_at: string;
}

export interface Property {
  id: string;
  agent_id: string;
  title: string;
  slug: string;
  description: string | null;
  price: number;
  address: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  property_type: PropertyType | null;
  listing_type: ListingType;
  rent_period: RentPeriod | null;
  property_status: PropertyStatus;
  bedrooms: number;
  bathrooms: number;
  land_size: number | null;
  building_size: number | null;
  main_image_url: string | null;
  images_urls: string[];
  is_published: boolean;
  is_featured: boolean;
  updated_at: string;
  created_at: string;
  profiles?: Profile;
}

export interface Favorite {
  id: string;
  user_id: string;
  property_id: string;
  created_at: string;
  properties?: Property;
}

export interface Inquiry {
  id: string;
  property_id: string;
  buyer_id: string;
  message: string;
  status: InquiryStatus;
  created_at: string;
  properties?: Property;
  profiles?: Profile;
}

export interface PropertyView {
  id: string;
  property_id: string;
  viewer_id: string | null;
  ip_hash: string | null;
  viewed_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

export interface PropertyFilters {
  city?: string;
  property_type?: PropertyType;
  listing_type?: ListingType;
  min_price?: number;
  max_price?: number;
  min_bedrooms?: number;
  min_bathrooms?: number;
  search?: string;
}

export interface PropertyWithStats extends Property {
  view_count?: number;
  inquiry_count?: number;
}

export interface KPRParams {
  price: number;
  downPaymentPct: number;
  tenorYears: number;
  interestRatePct: number;
}

export interface KPRResult {
  downPayment: number;
  loanAmount: number;
  monthlyInstallment: number;
  totalPayment: number;
  totalInterest: number;
}

export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Omit<Profile, "updated_at" | "created_at">; Update: Partial<Profile> };
      properties: { Row: Property; Insert: Omit<Property, "id" | "updated_at" | "created_at">; Update: Partial<Property> };
      favorites: { Row: Favorite; Insert: Omit<Favorite, "id" | "created_at">; Update: Partial<Favorite> };
      inquiries: { Row: Inquiry; Insert: Omit<Inquiry, "id" | "created_at">; Update: Partial<Inquiry> };
      property_views: { Row: PropertyView; Insert: Omit<PropertyView, "id" | "viewed_at">; Update: Partial<PropertyView> };
      notifications: { Row: Notification; Insert: Omit<Notification, "id" | "created_at">; Update: Partial<Notification> };
    };
  };
}
