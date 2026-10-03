'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken, getPostById, updatePost } from '@/lib/api';
import { Post } from '@/types';
import { PostEditor } from '@/components/PostEditor';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface EditPostPageProps {
  params: { id: string };
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!getAuthToken()) {
      router.replace('/auth/signin');
      return;
    }
    const fetchPost = async () => {
      try {
        const data = await getPostById(params.id);
        setPost(data);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to load post');
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const handleSave = async (data: {
    title: string;
    body: string;
    slug: string;
    cover_image_url?: string;
  }) => {
    setIsSaving(true);
    try {
      await updatePost(params.id, data);
      toast.success('Post updated successfully');
      router.push('/dashboard');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update post');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 flex justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="text-slate-500">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Edit Post</h1>
          <p className="text-xs text-slate-400 mt-0.5 capitalize">{post.status}</p>
        </div>
      </div>

      <PostEditor
        initialData={{
          title: post.title,
          body: post.body,
          slug: post.slug,
          cover_image_url: post.cover_image_url,
        }}
        onSave={handleSave}
        isSaving={isSaving}
        saveLabel="Save Changes"
      />
    </div>
  );
}
