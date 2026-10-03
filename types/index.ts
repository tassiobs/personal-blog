export interface Post {
  id: string;
  title: string;
  slug: string;
  body: string;
  cover_image_url?: string;
  status: 'draft' | 'published';
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
