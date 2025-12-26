/**
 * Blog Listing Page
 *
 * Fetches all published posts from SEOBeast and displays them.
 * Uses ISR (Incremental Static Regeneration) for optimal performance.
 */

import Link from 'next/link';
import { seobeast, type Post } from '@/lib/seobeast';
import { PostCard } from '@/components/PostCard';

export const revalidate = 60; // Revalidate every 60 seconds

export const metadata = {
  title: 'Blog',
  description: 'Read our latest articles and updates.',
};

export default async function BlogPage() {
  let posts: Post[] = [];
  let error: string | null = null;

  try {
    const response = await seobeast.getPosts({ limit: 20 });
    posts = response.posts;
  } catch (err) {
    console.error('[Blog] Failed to fetch posts:', err);
    error = 'Failed to load posts. Please try again later.';
  }

  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Read our latest articles and updates.
        </p>
      </header>

      {error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No posts yet. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid gap-8">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
        <Link
          href="/"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          &larr; Back to Home
        </Link>
      </footer>
    </main>
  );
}
