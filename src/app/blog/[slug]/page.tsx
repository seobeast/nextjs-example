/**
 * Single Blog Post Page
 *
 * Fetches a specific post by slug from SEOBeast.
 * Uses dynamic metadata for SEO optimization.
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { seobeast, type Post } from '@/lib/seobeast';

export const revalidate = 60; // Revalidate every 60 seconds

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Generate static paths for all published posts
 * This enables SSG for known posts at build time
 */
export async function generateStaticParams() {
  try {
    const response = await seobeast.getPosts({ limit: 100 });
    return response.posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('[Blog] Failed to generate static params:', error);
    return [];
  }
}

/**
 * Generate dynamic metadata for SEO
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = await seobeast.getPostBySlug(slug);

    return {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      openGraph: {
        title: post.metaTitle || post.title,
        description: post.metaDescription || post.excerpt,
        type: 'article',
        publishedTime: post.publishedAt,
        modifiedTime: post.updatedAt,
        images: post.featuredImage ? [post.featuredImage] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.metaTitle || post.title,
        description: post.metaDescription || post.excerpt,
        images: post.featuredImage ? [post.featuredImage] : [],
      },
    };
  } catch {
    return {
      title: 'Post Not Found',
    };
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  let post: Post;

  try {
    post = await seobeast.getPostBySlug(slug);
  } catch (error) {
    console.error(`[Blog] Failed to fetch post: ${slug}`, error);
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-12 max-w-3xl">
      <article>
        {/* Header */}
        <header className="mb-8">
          <Link
            href="/blog"
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm mb-4 inline-block"
          >
            &larr; Back to Blog
          </Link>

          <h1 className="text-4xl font-bold mb-4 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            {post.author && (
              <span>By {post.author.name}</span>
            )}
            {post.publishedAt && (
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            )}
          </div>

          {/* Categories & Tags */}
          {(post.categories?.length || post.tags?.length) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.categories?.map((category) => (
                <span
                  key={category.id}
                  className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs"
                >
                  {category.name}
                </span>
              ))}
              {post.tags?.map((tag) => (
                <span
                  key={tag.id}
                  className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-auto"
            />
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      {/* Footer */}
      <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
        <Link
          href="/blog"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          &larr; View all posts
        </Link>
      </footer>
    </main>
  );
}
