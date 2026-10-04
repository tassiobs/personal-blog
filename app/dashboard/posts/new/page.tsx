'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken, createPost } from '@/lib/api';
import { PostEditor, PostEditorData } from '@/components/PostEditor';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewPostPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!getAuthToken()) {
      router.replace('/auth/signin');
    }
  }, [router]);

  const handleSave = async (data: PostEditorData) => {
    setIsSaving(true);
    try {
      await createPost(data);
      toast.success('Post saved as draft');
      router.push('/dashboard');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save post');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="text-slate-500">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back
          </Button>
        </Link>
        <h1 className="text-xl font-semibold text-slate-900">New Post</h1>
      </div>

      <PostEditor
        onSave={handleSave}
        isSaving={isSaving}
        saveLabel="Save as Draft"
      />
    </div>
  );
}
