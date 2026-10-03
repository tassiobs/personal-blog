import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/types';
import { formatDate } from '@/lib/utils';
import { LanguageBadge } from './LanguageBadge';
import { Heart } from 'lucide-react';

interface PostCardProps {
  post: Post;
  likeCount?: number;
}

export function PostCard({ post, likeCount = 0 }: PostCardProps) {

  return (
    <Link href={`/posts/${post.slug}`} className="group block">
      <article className="flex flex-col h-full rounded-xl overflow-hidden border border-slate-100 bg-white hover:border-slate-300 hover:shadow-md transition-all duration-200">
        {/* Cover Image */}
        <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
          {post.cover_image_url ? (
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-slate-100 to-slate-200" />
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-5">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <LanguageBadge language={post.language} />
            {post.category && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                {post.category.name}
              </span>
            )}
            <span className="text-xs text-slate-400">{formatDate(post.created_at)}</span>
          </div>

          <h2 className="text-base font-semibold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2 mb-auto">
            {post.title}
          </h2>

          <div className="flex items-center gap-1 mt-4 text-slate-400">
            <Heart className="w-4 h-4" />
            <span className="text-xs">{likeCount}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
