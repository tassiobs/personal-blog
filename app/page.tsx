export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { PostCard } from '@/components/PostCard';
import { getPublishedPosts, getPostLikes, getCategories } from '@/lib/api';
import { Post, Category, PostLanguage } from '@/types';

const LANGUAGES: { value: PostLanguage; label: string }[] = [
  { value: 'en', label: 'EN' },
  { value: 'pt-BR', label: 'PT' },
];

export default async function HomePage({
  searchParams,
}: {
  searchParams: { category?: string; language?: string };
}) {
  const activeLanguage = (searchParams.language as PostLanguage) || null;
  const activeCategoryId = searchParams.category ? Number(searchParams.category) : null;

  const [posts, categories] = await Promise.all([
    getPublishedPosts(activeLanguage ?? undefined).catch(() => [] as Post[]),
    getCategories().catch(() => [] as Category[]),
  ]);

  const filteredPosts = (activeCategoryId
    ? posts.filter((p) => p.category_id === activeCategoryId)
    : posts
  ).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const likeCounts = await Promise.all(
    filteredPosts.map(async (post) => {
      try {
        const data = await getPostLikes(post.id);
        return data.likes;
      } catch {
        return 0;
      }
    })
  );

  const buildHref = (params: { category?: number | null; language?: PostLanguage | null }) => {
    const p = new URLSearchParams();
    const cat = 'category' in params ? params.category : activeCategoryId;
    const lang = 'language' in params ? params.language : activeLanguage;
    if (cat) p.set('category', String(cat));
    if (lang) p.set('language', lang);
    const str = p.toString();
    return str ? `/?${str}` : '/';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      {/* Hero */}
      <section className="mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-4">
          Tassio Batista
        </h1>
        <p className="text-lg text-slate-500 max-w-xl">
          Writing about AI, product management, and software.
        </p>
      </section>

      <hr className="border-slate-100 mb-10" />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        {/* Category filter */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Link
              href={buildHref({ category: null })}
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                !activeCategoryId ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={buildHref({ category: cat.id })}
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  activeCategoryId === cat.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        {/* Divider */}
        {categories.length > 0 && <span className="text-slate-200 text-sm">|</span>}

        {/* Language filter */}
        <div className="flex gap-2">
          <Link
            href={buildHref({ language: null })}
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              !activeLanguage ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All languages
          </Link>
          {LANGUAGES.map((lang) => (
            <Link
              key={lang.value}
              href={buildHref({ language: lang.value })}
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeLanguage === lang.value
                  ? lang.value === 'pt-BR' ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {lang.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Posts */}
      <section>
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400 text-base">No posts yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post, index) => (
              <PostCard key={post.id} post={post} likeCount={likeCounts[index] ?? 0} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
