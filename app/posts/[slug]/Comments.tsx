'use client';

import { useState } from 'react';
import { Comment } from '@/types';
import { createComment } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface CommentsProps {
  postId: string;
  initialComments: Comment[];
}

export function Comments({ postId, initialComments }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [name, setName] = useState('');
  const [body, setBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !body.trim()) return;

    setIsSubmitting(true);
    try {
      const comment = await createComment(postId, { name: name.trim(), body: body.trim() });
      setComments((prev) => [...prev, comment]);
      setName('');
      setBody('');
      toast.success('Comment posted');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mt-16 pt-10 border-t border-slate-100">
      <h2 className="text-lg font-semibold text-slate-900 mb-8">
        {comments.length > 0 ? `${comments.length} Comment${comments.length !== 1 ? 's' : ''}` : 'Comments'}
      </h2>

      {/* Comment list */}
      {comments.length === 0 ? (
        <p className="text-sm text-slate-400 mb-10">Be the first to comment.</p>
      ) : (
        <ul className="space-y-8 mb-12">
          {comments.map((comment) => (
            <li key={comment.id} className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-sm font-medium text-slate-500">
                {comment.name[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-sm font-medium text-slate-900">{comment.name}</span>
                  <span className="text-xs text-slate-400">{formatDate(comment.created_at)}</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{comment.body}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Comment form */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-slate-50 rounded-xl p-6">
        <h3 className="text-sm font-medium text-slate-700">Leave a comment</h3>
        <div className="space-y-1.5">
          <Label htmlFor="comment-name">Name</Label>
          <Input
            id="comment-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="comment-body">Comment</Label>
          <Textarea
            id="comment-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your comment..."
            className="min-h-[100px] resize-none"
            required
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting || !name.trim() || !body.trim()}>
            {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Posting...</> : 'Post Comment'}
          </Button>
        </div>
      </form>
    </section>
  );
}
