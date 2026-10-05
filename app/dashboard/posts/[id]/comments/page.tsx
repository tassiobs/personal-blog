'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAuthToken, getPostById, getComments, deleteComment } from '@/lib/api';
import { Post, Comment } from '@/types';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowLeft, Trash2, Loader2, MessageSquare } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface PageProps {
  params: { id: string };
}

export default function PostCommentsPage({ params }: PageProps) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (!getAuthToken()) { router.replace('/auth/signin'); return; }

    const load = async () => {
      try {
        const [p, c] = await Promise.all([
          getPostById(params.id),
          getComments(params.id),
        ]);
        setPost(p);
        setComments(c);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to load');
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params.id, router]);

  const handleDelete = async (commentId: number) => {
    setDeletingId(commentId);
    try {
      await deleteComment(params.id, commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      toast.success('Comment deleted');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 flex justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="text-slate-500">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Comments</h1>
          {post && <p className="text-xs text-slate-400 mt-0.5 truncate max-w-sm">{post.title}</p>}
        </div>
      </div>

      {comments.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-slate-200 rounded-xl">
          <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">No comments yet.</p>
        </div>
      ) : (
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          {comments.map((comment, index) => (
            <div
              key={comment.id}
              className={`flex items-start gap-4 px-5 py-4 ${index !== comments.length - 1 ? 'border-b border-slate-100' : ''} hover:bg-slate-50 transition-colors group`}
            >
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-sm font-medium text-slate-500 mt-0.5">
                {comment.name[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-sm font-medium text-slate-900">{comment.name}</span>
                  <span className="text-xs text-slate-400">{formatDate(comment.created_at)}</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{comment.body}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-400 hover:text-red-600 hover:bg-red-50 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleDelete(comment.id)}
                disabled={deletingId === comment.id}
              >
                {deletingId === comment.id
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <Trash2 className="w-4 h-4" />}
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
