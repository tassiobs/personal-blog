export type PostSource = 'vocabranch' | 'blog';
export type PostLanguage = 'en' | 'pt-BR';

export interface Category {
  id: number;
  name: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  body: string;
  cover_image_url?: string;
  status: 'draft' | 'published';
  source: PostSource | null;
  language: PostLanguage | null;
  category_id: number | null;
  category: Category | null;
  author_id: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  error?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface LikesResponse {
  post_id: string;
  likes: number;
}

export interface Comment {
  id: number;
  post_id: number;
  name: string;
  body: string;
  created_at: string;
}
