'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { getPostLikes, likePost, getAuthToken } from '@/lib/api';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface LikeButtonProps {
  postId: string;
  initialCount?: number;
}

export function LikeButton({ postId, initialCount = 0 }: LikeButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch fresh count on mount
    getPostLikes(postId)
      .then((data) => setCount(data.likes))
      .catch(() => {});
  }, [postId]);

  const handleLike = async () => {
    if (!getAuthToken()) {
      toast.error('Sign in to like posts');
      return;
    }
    if (liked || loading) return;

    setLoading(true);
    try {
      await likePost(postId);
      setCount((prev) => prev + 1);
      setLiked(true);
    } catch (err: unknown) {
      const error = err as Error & { status?: number };
      if (error?.status === 409) {
        setLiked(true);
        toast.info('You already liked this post');
      } else {
        toast.error(error?.message || 'Could not like post');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-all text-sm font-medium',
        liked
          ? 'bg-red-50 border-red-200 text-red-500'
          : 'bg-white border-slate-200 text-slate-500 hover:border-red-200 hover:text-red-400 hover:bg-red-50',
        loading && 'opacity-60 cursor-not-allowed'
      )}
      aria-label="Like this post"
    >
      <Heart
        className={cn('w-4 h-4 transition-all', liked && 'fill-red-400 text-red-400')}
      />
      <span>{count}</span>
    </button>
  );
}
