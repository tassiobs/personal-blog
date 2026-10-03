export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { PostCard } from '@/components/PostCard';
import { getPublishedPosts, getPostLikes, getCategories } from '@/lib/api';
import { Post, Category } from '@/types';

async function getPosts(): Promise<Post[]> {
  try {
    return await getPublishedPosts();
  } catch {
    return [];
  }
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const [posts, categories] = await Promise.all([
    getPosts(),
    getCategories().catch(() => [] as Category[]),
  ]);

  const activeCategoryId = searchParams.category ? Number(searchParams.category) : null;
  const activeCategory = categories.find((c) => c.id === activeCategoryId) ?? null;

  const filteredPosts = activeCategoryId
    ? posts.filter((p) => p.category_id === activeCategoryId)
    : posts;

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

      {/* Category filter */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <Link
            href="/"
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              !activeCategoryId
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/?category=${cat.id}`}
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeCategoryId === cat.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}

      {/* Posts */}
      <section>
        {activeCategory && (
          <p className="text-sm text-slate-400 mb-6">
            Showing {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''} in <span className="font-medium text-slate-600">{activeCategory.name}</span>
          </p>
        )}
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
