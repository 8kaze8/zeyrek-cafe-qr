export type Language = 'tr' | 'en' | 'ar';

export interface Category {
  id: string;
  name_tr: string;
  name_en: string;
  name_ar: string;
  order: number;
  image_url?: string;
}

export interface Product {
  id: string;
  category_id: string;
  name_tr: string;
  name_en: string;
  name_ar: string;
  description_tr?: string;
  description_en?: string;
  description_ar?: string;
  price: number;
  image_url?: string;
  order: number;
}