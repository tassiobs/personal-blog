'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { generateSlug, validateSlug } from '@/lib/utils';
import { uploadImage, getCategories } from '@/lib/api';
import { Category, PostLanguage } from '@/types';
import { toast } from 'sonner';
import { Upload, Eye, Edit3, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface PostEditorData {
  title: string;
  body: string;
  slug: string;
  cover_image_url?: string;
  category_id?: number | null;
  language?: PostLanguage | null;
}

interface PostEditorProps {
  initialData?: Partial<PostEditorData>;
  onSave: (data: PostEditorData) => Promise<void>;
  saveLabel?: string;
  isSaving?: boolean;
}

export function PostEditor({ initialData, onSave, saveLabel = 'Save Post', isSaving = false }: PostEditorProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [body, setBody] = useState(initialData?.body || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [coverImageUrl, setCoverImageUrl] = useState(initialData?.cover_image_url || '');
  const [categoryId, setCategoryId] = useState<number | null>(initialData?.category_id ?? null);
  const [language, setLanguage] = useState<PostLanguage | null>(initialData?.language ?? null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(!!initialData?.slug);
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [isUploading, setIsUploading] = useState(false);
  const [slugError, setSlugError] = useState('');

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    if (!slugManuallyEdited && title) {
      setSlug(generateSlug(title));
    }
  }, [title, slugManuallyEdited]);

  const handleSlugChange = (value: string) => {
    setSlugManuallyEdited(true);
    setSlug(value);
    if (value && !validateSlug(value)) {
      setSlugError('Slug must be lowercase letters, numbers, and hyphens only.');
    } else {
      setSlugError('');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { url } = await uploadImage(file);
      setCoverImageUrl(url);
      toast.success('Image uploaded successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Image upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) { toast.error('Title is required'); return; }
    if (!body.trim()) { toast.error('Body is required'); return; }
    if (!slug.trim()) { toast.error('Slug is required'); return; }
    if (!validateSlug(slug)) { toast.error('Invalid slug format'); return; }

    await onSave({
      title: title.trim(),
      body: body.trim(),
      slug: slug.trim(),
      cover_image_url: coverImageUrl || undefined,
      category_id: categoryId,
      language,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div className="space-y-1.5">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title"
          className="text-lg font-medium"
          required
        />
      </div>

      {/* Slug */}
      <div className="space-y-1.5">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          value={slug}
          onChange={(e) => handleSlugChange(e.target.value)}
          placeholder="post-url-slug"
          className="font-mono text-sm"
        />
        {slugError && <p className="text-xs text-red-500">{slugError}</p>}
        {slug && !slugError && (
          <p className="text-xs text-slate-400">URL: /posts/{slug}</p>
        )}
      </div>

      {/* Category */}
      <div className="space-y-1.5">
        <Label htmlFor="category">Category</Label>
        <select
          id="category"
          value={categoryId ?? ''}
          onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : null)}
          className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          <option value="">No category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Language */}
      <div className="space-y-1.5">
        <Label htmlFor="language">Language</Label>
        <select
          id="language"
          value={language ?? ''}
          onChange={(e) => setLanguage((e.target.value as PostLanguage) || null)}
          className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          <option value="">Not specified</option>
          <option value="en">English (EN)</option>
          <option value="pt-BR">Portuguese — PT-BR</option>
        </select>
      </div>

      {/* Cover Image */}
      <div className="space-y-1.5">
        <Label>Cover Image</Label>
        <div className="flex items-center gap-3">
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleImageUpload}
              disabled={isUploading}
            />
            <span className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-slate-200 rounded-md bg-white hover:bg-slate-50 transition-colors cursor-pointer">
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {isUploading ? 'Uploading...' : 'Upload Image'}
            </span>
          </label>
          {coverImageUrl && (
            <Button type="button" variant="ghost" size="sm" onClick={() => setCoverImageUrl('')} className="text-red-500 hover:text-red-600 hover:bg-red-50">
              Remove
            </Button>
          )}
        </div>
        {coverImageUrl && (
          <div className="mt-2 relative w-full max-w-md aspect-video rounded-lg overflow-hidden border border-slate-200">
            <Image src={coverImageUrl} alt="Cover preview" fill className="object-cover" />
          </div>
        )}
        {!coverImageUrl && (
          <div>
            <Label htmlFor="cover_url" className="text-xs text-slate-400 mt-1 block">Or paste URL</Label>
            <Input
              id="cover_url"
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              placeholder="https://..."
              className="mt-1 text-sm"
            />
          </div>
        )}
      </div>

      {/* Body Editor */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label>Content</Label>
          <div className="flex items-center gap-1 border border-slate-200 rounded-md p-0.5">
            <button
              type="button"
              onClick={() => setActiveTab('write')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded transition-colors ${activeTab === 'write' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <Edit3 className="w-3 h-3" /> Write
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded transition-colors ${activeTab === 'preview' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <Eye className="w-3 h-3" /> Preview
            </button>
          </div>
        </div>

        {activeTab === 'write' ? (
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your post in Markdown..."
            className="min-h-[500px] font-mono text-sm resize-y"
          />
        ) : (
          <div className="min-h-[500px] w-full rounded-md border border-slate-200 bg-white p-4 overflow-auto">
            {body ? <MarkdownRenderer content={body} /> : <p className="text-slate-400 text-sm italic">Nothing to preview yet.</p>}
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isSaving || isUploading}>
          {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : saveLabel}
        </Button>
      </div>
    </form>
  );
}
