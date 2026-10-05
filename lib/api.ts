import { Post, User, AuthResponse, LikesResponse, Category, PostLanguage, Comment } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://vocabranch-blog-production.up.railway.app';

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

export function setAuthToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  authenticated = false
): Promise<T> {
  const headers: Record<string, string> = {
    ...(options.body && !(options.body instanceof FormData)
      ? { 'Content-Type': 'application/json' }
      : {}),
    ...(options.headers as Record<string, string>),
  };

  if (authenticated) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    cache: 'no-store',
  });

  if (!res.ok) {
    let errorMessage = `Request failed with status ${res.status}`;
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {}
    const err = new Error(errorMessage) as Error & { status: number };
    err.status = res.status;
    throw err;
  }

  if (res.status === 204) return undefined as T;

  return res.json();
}

// Auth
export async function signIn(email: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/signin', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function signOut(): Promise<void> {
  await request<void>('/auth/signout', { method: 'POST' }, true);
  setAuthToken(null);
}

// Posts - Public
export async function getPublishedPosts(): Promise<Post[]> {
  return request<Post[]>('/posts?source=blog');
}

export async function getPostBySlug(slug: string): Promise<Post> {
  return request<Post>(`/posts/by-slug/${slug}`);
}

export async function getPostById(id: string): Promise<Post> {
  return request<Post>(`/posts/${id}`);
}

export async function getPostLikes(id: string): Promise<LikesResponse> {
  return request<LikesResponse>(`/posts/${id}/likes`);
}

// Posts - Protected
export async function getAllPosts(): Promise<Post[]> {
  return request<Post[]>('/posts/all', {}, true);
}

export async function createPost(data: {
  title: string;
  body: string;
  slug?: string;
  cover_image_url?: string | null;
  category_id?: number | null;
  language?: PostLanguage | null;
}): Promise<Post> {
  return request<Post>('/posts', {
    method: 'POST',
    body: JSON.stringify({ ...data, source: 'blog' }),
  }, true);
}

export async function updatePost(
  id: string,
  data: {
    title?: string;
    body?: string;
    slug?: string;
    cover_image_url?: string | null;
    category_id?: number | null;
    language?: PostLanguage | null;
  }
): Promise<Post> {
  return request<Post>(`/posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ ...data, source: 'blog' }),
  }, true);
}

export async function publishPost(id: string): Promise<Post> {
  return request<Post>(`/posts/${id}/publish`, { method: 'POST' }, true);
}

export async function unpublishPost(id: string): Promise<Post> {
  return request<Post>(`/posts/${id}/unpublish`, { method: 'POST' }, true);
}

export async function deletePost(id: string): Promise<void> {
  return request<void>(`/posts/${id}`, { method: 'DELETE' }, true);
}

export async function likePost(id: string): Promise<void> {
  return request<void>(`/posts/${id}/like`, { method: 'POST' }, true);
}

// Users
export async function getUserProfile(id: string): Promise<User> {
  return request<User>(`/users/${id}`, {}, true);
}

export async function updateUserProfile(
  id: string,
  data: { name?: string; email?: string; password?: string }
): Promise<User> {
  return request<User>(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }, true);
}

// Comments
export async function getComments(postId: string): Promise<Comment[]> {
  return request<Comment[]>(`/posts/${postId}/comments`);
}

export async function createComment(postId: string, data: { name: string; body: string }): Promise<Comment> {
  return request<Comment>(`/posts/${postId}/comments`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deleteComment(postId: string, commentId: number): Promise<void> {
  return request<void>(`/posts/${postId}/comments/${commentId}`, { method: 'DELETE' }, true);
}

// Categories
export async function getCategories(): Promise<Category[]> {
  return request<Category[]>('/categories');
}

export async function createCategory(name: string): Promise<Category> {
  return request<Category>('/categories', {
    method: 'POST',
    body: JSON.stringify({ name }),
  }, true);
}

export async function updateCategory(id: number, name: string): Promise<Category> {
  return request<Category>(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ name }),
  }, true);
}

export async function deleteCategory(id: number): Promise<void> {
  return request<void>(`/categories/${id}`, { method: 'DELETE' }, true);
}

// Uploads
export async function uploadImage(file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const token = getAuthToken();
  const res = await fetch(`${API_URL}/uploads/image`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  if (!res.ok) {
    let errorMessage = `Upload failed with status ${res.status}`;
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }

  return res.json();
}
