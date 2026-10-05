import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getPostBySlug, getPostLikes, getComments } from '@/lib/api';
import { formatDate, estimateReadingTime } from '@/lib/utils';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { LanguageBadge } from '@/components/LanguageBadge';
import { LikeButton } from './LikeButton';
import { Comments } from './Comments';

interface PostPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PostPageProps) {
  try {
    const post = await getPostBySlug(params.slug);
    const description = post.body.slice(0, 160).replace(/[#*`]/g, '');
    const url = `https://www.tassiobatista.com/posts/${post.slug}`;

    return {
      title: `${post.title} — Tassio Batista`,
      description,
      openGraph: {
        title: post.title,
        description,
        url,
        type: 'article',
        ...(post.cover_image_url && { images: [{ url: post.cover_image_url, width: 1200, height: 630 }] }),
      },
      twitter: {
        card: post.cover_image_url ? 'summary_large_image' : 'summary',
        title: post.title,
        description,
        ...(post.cover_image_url && { images: [post.cover_image_url] }),
      },
    };
  } catch {
    return { title: 'Post Not Found — Tassio Batista' };
  }
}

export default async function PostPage({ params }: PostPageProps) {
  let post;
  let likes = 0;

  try {
    post = await getPostBySlug(params.slug);
  } catch {
    notFound();
  }

  const [likesData, comments] = await Promise.all([
    getPostLikes(post.id).catch(() => ({ likes: 0 })),
    getComments(post.id).catch(() => []),
  ]);
  likes = likesData.likes;

  const readingTime = estimateReadingTime(post.body);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      {/* Cover Image */}
      {post.cover_image_url && (
        <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-10">
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 672px"
          />
        </div>
      )}

      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4 text-sm text-slate-400 flex-wrap">
          <LanguageBadge language={post.language} />
          {post.category && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
              {post.category.name}
            </span>
          )}
          <span>{formatDate(post.created_at)}</span>
          <span>{readingTime} min read</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight mb-4">
          {post.title}
        </h1>

        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            By <span className="font-medium text-slate-700">Tassio Batista</span>
          </p>
          <LikeButton postId={post.id} initialCount={likes} />
        </div>
      </header>

      {/* Divider */}
      <hr className="border-slate-100 mb-10" />

      {/* Body */}
      <article>
        <MarkdownRenderer content={post.body} />
      </article>

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-slate-100 flex items-center justify-between">
        <p className="text-sm text-slate-400">
          Written by <span className="font-medium text-slate-600">Tassio Batista</span>
        </p>
        <LikeButton postId={post.id} initialCount={likes} />
      </footer>

      {/* Comments */}
      <Comments postId={post.id} initialComments={comments} />
    </div>
  );
}
