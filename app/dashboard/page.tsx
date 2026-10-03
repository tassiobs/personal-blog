'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAuthToken, getAllPosts, deletePost, publishPost } from '@/lib/api';
import { Post } from '@/types';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2, Send, Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!getAuthToken()) {
      router.replace('/auth/signin');
      return;
    }
    fetchPosts();
  }, [router]);

  const fetchPosts = async () => {
    try {
      const data = await getAllPosts();
      const filtered = data.filter((p) => p.source === 'blog');
      setPosts(filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (post: Post) => {
    if (post.status === 'published') return;
    setActionLoading(`publish-${post.id}`);
    try {
      await publishPost(post.id);
      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, status: 'published' } : p))
      );
      toast.success(`"${post.title}" published`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to publish');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (post: Post) => {
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    setActionLoading(`delete-${post.id}`);
    try {
      await deletePost(post.id);
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
      toast.success('Post deleted');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 flex justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">{posts.length} post{posts.length !== 1 ? 's' : ''} total</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/categories">
            <Button variant="outline" size="sm">Categories</Button>
          </Link>
          <Link href="/dashboard/posts/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </Link>
        </div>
      </div>

      {/* Posts List */}
      {posts.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-slate-200 rounded-xl">
          <p className="text-slate-400 mb-4">No posts yet.</p>
          <Link href="/dashboard/posts/new">
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Create your first post
            </Button>
          </Link>
        </div>
      ) : (
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          {posts.map((post, index) => (
            <div
              key={post.id}
              className={`flex items-center gap-4 px-5 py-4 ${
                index !== posts.length - 1 ? 'border-b border-slate-100' : ''
              } hover:bg-slate-50 transition-colors`}
            >
              {/* Status badge */}
              <Badge variant={post.status === 'published' ? 'success' : 'warning'} className="shrink-0">
                {post.status === 'published' ? 'Published' : 'Draft'}
              </Badge>

              {/* Title & date */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 truncate text-sm">{post.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {formatDate(post.created_at)}
                  {post.category && <span className="ml-2 text-slate-500">· {post.category.name}</span>}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <Link href={`/dashboard/posts/${post.id}/edit`}>
                  <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900">
                    <Edit2 className="w-4 h-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                </Link>

                {post.status === 'draft' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                    onClick={() => handlePublish(post)}
                    disabled={actionLoading === `publish-${post.id}`}
                  >
                    {actionLoading === `publish-${post.id}` ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span className="sr-only">Publish</span>
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-600 hover:bg-red-50"
                  onClick={() => handleDelete(post)}
                  disabled={actionLoading === `delete-${post.id}`}
                >
                  {actionLoading === `delete-${post.id}` ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
