export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import Link from 'next/link';
import { getCategories, getPublishedPosts } from '@/lib/api';
import { Category } from '@/types';

export const metadata: Metadata = {
  title: 'Topics — Tassio Batista',
  description: 'Browse writing by topic.',
};

export default async function TopicsPage() {
  const [categories, posts] = await Promise.all([
    getCategories().catch(() => [] as Category[]),
    getPublishedPosts().catch(() => []),
  ]);

  // Count posts per category
  const countByCategory = posts.reduce<Record<number, number>>((acc, post) => {
    if (post.category_id) {
      acc[post.category_id] = (acc[post.category_id] || 0) + 1;
    }
    return acc;
  }, {});

  const uncategorized = posts.filter((p) => !p.category_id).length;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Topics</h1>
      <p className="text-slate-500 mb-10">Browse all writing by topic.</p>

      {categories.length === 0 && uncategorized === 0 ? (
        <p className="text-slate-400">No topics yet.</p>
      ) : (
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/?category=${category.id}`}
                className="flex items-center justify-between px-4 py-3 rounded-lg border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all group"
              >
                <span className="text-sm font-medium text-slate-800 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </span>
                <span className="text-xs text-slate-400">
                  {countByCategory[category.id] ?? 0} post{(countByCategory[category.id] ?? 0) !== 1 ? 's' : ''}
                </span>
              </Link>
            </li>
          ))}
          {uncategorized > 0 && (
            <li>
              <Link
                href="/"
                className="flex items-center justify-between px-4 py-3 rounded-lg border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all group"
              >
                <span className="text-sm font-medium text-slate-500 group-hover:text-slate-700 transition-colors">
                  Uncategorized
                </span>
                <span className="text-xs text-slate-400">{uncategorized} post{uncategorized !== 1 ? 's' : ''}</span>
              </Link>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
