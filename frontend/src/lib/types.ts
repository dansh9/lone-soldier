export type RequestStatus =
  | "open"
  | "match_found"
  | "pending_acceptance"
  | "fulfilled"
  | "expired";

export type Urgency = "low" | "medium" | "high" | "critical";

export type MatchStatus =
  | "pending_review"
  | "coordinator_approved"
  | "soldier_notified"
  | "accepted"
  | "rejected"
  | "expired";

export type Platform =
  | "agora"
  | "telegram"
  | "facebook"
  | "whatsapp"
  | "yad2"
  | "manual";

export interface Soldier {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  idf_unit: string | null;
  idf_base: string | null;
  apartment_address: string;
  language: string;
  verified: boolean;
  contact_method: string;
  created_at: string;
}

export interface EquipmentRequest {
  id: string;
  soldier_id: string;
  category: string;
  item_name: string;
  description: string | null;
  urgency: Urgency;
  dimensions: string | null;
  photo_url: string | null;
  status: RequestStatus;
  created_at: string;
  fulfilled_at: string | null;
  // Added by coordinator endpoint
  age_hours?: number;
  age_level?: "fresh" | "aging" | "old" | "critical";
  matches?: Match[];
}

export interface ScannedPost {
  id: string;
  source_platform: Platform;
  external_id: string;
  raw_text: string;
  extracted_item: string | null;
  extracted_category: string | null;
  extracted_condition: string | null;
  location_text: string | null;
  contact_info: string | null;
  post_date: string | null;
  scraped_at: string;
  is_available: boolean;
}

export interface Match {
  id: string;
  request_id: string;
  post_id: string;
  score: number;
  distance_km: number | null;
  status: MatchStatus;
  coordinator_notes: string | null;
  notified_at: string | null;
  created_at: string;
  resolved_at: string | null;
  request?: EquipmentRequest;
  post?: ScannedPost;
}

export interface Analytics {
  requests_by_status: Record<string, number>;
  avg_time_to_match_hours: number | null;
  match_rate_percent: number;
  top_unmet_categories: { category: string; count: number }[];
  matches_by_status: Record<string, number>;
  total_requests: number;
  total_fulfilled: number;
}

export interface ApiResponse<T> {
  data: T;
  meta?: { limit: number; offset: number };
}
