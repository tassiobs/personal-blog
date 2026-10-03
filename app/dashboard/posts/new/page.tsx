'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken, createPost, publishPost } from '@/lib/api';
import { PostEditor } from '@/components/PostEditor';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewPostPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [publish, setPublish] = useState(false);

  useEffect(() => {
    if (!getAuthToken()) {
      router.replace('/auth/signin');
    }
  }, [router]);

  const handleSave = async (data: {
    title: string;
    body: string;
    slug: string;
    cover_image_url?: string;
  }) => {
    setIsSaving(true);
    try {
      const post = await createPost(data);
      if (publish) {
        await publishPost(post.id);
        toast.success('Post created and published!');
      } else {
        toast.success('Post saved as draft');
      }
      router.push('/dashboard');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save post');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-slate-500">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back
            </Button>
          </Link>
          <h1 className="text-xl font-semibold text-slate-900">New Post</h1>
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={publish}
              onChange={(e) => setPublish(e.target.checked)}
              className="rounded border-slate-300"
            />
            Publish immediately
          </label>
        </div>
      </div>

      <PostEditor
        onSave={handleSave}
        isSaving={isSaving}
        saveLabel={publish ? 'Save & Publish' : 'Save as Draft'}
      />
    </div>
  );
}
