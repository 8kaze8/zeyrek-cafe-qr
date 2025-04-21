export type Language = "tr" | "en" | "ar";

export interface Category {
  id: string;
  name_tr: string;
  name_en: string;
  name_ar: string;
  order: number;
  image_url?: string;
}

export type Product = {
  id: string;
  name_tr: string;
  name_en: string | null;
  name_ar: string | null;
  description_tr: string | null;
  description_en: string | null;
  description_ar: string | null;
  category_id: string;
  price: number;
  order: number;
  image_url: string | null;
  is_active: boolean;
  created_at?: any;
  updated_at?: any;
};
