export interface Product {
  id: number;
  slug: string;
  name: string;
  category: string;
  thickness: string;
  size: string;
  finish: string;
  tag?: string;
  description: string;
  specs: Record<string, string>;
  images: string[];
  brochureUrl?: string;
  inStock: boolean;
  rating: number;
  reviewCount: number;
}

export interface Project {
  id: number;
  slug: string;
  title: string;
  location: string;
  year: number;
  category: string;
  client: string;
  description: string;
  images: string[];
  productsUsed: string[];
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorAvatar?: string;
  category: string;
  tags: string[];
  coverImage: string;
  publishedAt: string;
  readTime: number;
  seoTitle?: string;
  seoDescription?: string;
}

export interface Testimonial {
  id: number;
  name: string;
  company: string;
  role: string;
  message: string;
  rating: number;
  avatar?: string;
}

export interface Dealer {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  address: string;
  lat?: number;
  lng?: number;
  status: "pending" | "approved" | "rejected";
}

export interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone?: string;
  product?: string;
  message: string;
  status: "new" | "read" | "replied";
  createdAt: string;
}

export interface GalleryItem {
  id: number;
  type: "image" | "video";
  url: string;
  thumbnail?: string;
  title: string;
  category: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
