export const dynamic = 'force-dynamic';

import { PostCard } from '@/components/PostCard';
import { getPublishedPosts, getPostLikes } from '@/lib/api';
import { Post } from '@/types';

async function getPosts(): Promise<Post[]> {
  try {
    const posts = await getPublishedPosts();
    return posts;
  } catch {
    return [];
  }
}

const TOPIC_TAGS = ['AI', 'Product', 'Software'];

export default async function HomePage() {
  const posts = await getPosts();

  // Fetch like counts for all posts in parallel
  const likeCounts = await Promise.all(
    posts.map(async (post) => {
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
        <p className="text-lg text-slate-500 mb-8 max-w-xl">
          Writing about AI, product management, and software.
        </p>
        <div className="flex flex-wrap gap-2">
          {TOPIC_TAGS.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* Divider */}
      <hr className="border-slate-100 mb-12" />

      {/* Posts Grid */}
      <section>
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400 text-base">No posts yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <PostCard
                key={post.id}
                post={post}
                likeCount={likeCounts[index] ?? 0}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
