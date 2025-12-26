/**
 * Post Card Component
 *
 * Displays a preview of a blog post in the listing page.
 */

import Link from 'next/link';
import type { Post } from '@/lib/seobeast';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="group border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
      {/* Featured Image */}
      {post.featuredImage && (
        <Link href={`/blog/${post.slug}`}>
          <div className="aspect-video overflow-hidden bg-gray-100 dark:bg-gray-900">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>
      )}

      <div className="p-6">
        {/* Categories */}
        {post.categories && post.categories.length > 0 && (
          <div className="flex gap-2 mb-3">
            {post.categories.slice(0, 2).map((category) => (
              <span
                key={category.id}
                className="text-xs font-medium text-blue-600 dark:text-blue-400"
              >
                {category.name}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h2 className="text-xl font-semibold mb-2">
          <Link
            href={`/blog/${post.slug}`}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {post.title}
          </Link>
        </h2>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {post.excerpt}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500">
          <div className="flex items-center gap-2">
            {post.author && (
              <>
                {post.author.avatar && (
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-6 h-6 rounded-full"
                  />
                )}
                <span>{post.author.name}</span>
              </>
            )}
          </div>

          {post.publishedAt && (
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
          )}
        </div>
      </div>
    </article>
  );
}
