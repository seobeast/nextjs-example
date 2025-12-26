/**
 * SEOBeast API Client
 * Fetch blog content from your SEOBeast instance
 */

// =============================================================================
// Types
// =============================================================================

export interface Post {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt?: string;
  status: 'draft' | 'published' | 'scheduled';
  featuredImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  author?: {
    name: string;
    avatar?: string;
  };
  categories?: Category[];
  tags?: Tag[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface PostsResponse {
  posts: Post[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// =============================================================================
// Configuration
// =============================================================================

const SEOBEAST_API_URL = process.env.SEOBEAST_API_URL || 'http://localhost:8080';
const SEOBEAST_WEBSITE_SLUG = process.env.SEOBEAST_WEBSITE_SLUG || '';

if (!SEOBEAST_WEBSITE_SLUG) {
  console.warn(
    '[SEOBeast] SEOBEAST_WEBSITE_SLUG is not set. API calls will fail.'
  );
}

// =============================================================================
// API Client
// =============================================================================

class SEOBeastClient {
  private baseUrl: string;
  private websiteSlug: string;

  constructor(baseUrl: string, websiteSlug: string) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.websiteSlug = websiteSlug;
  }

  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'SEOBeast-NextJS-Client/1.0',
        ...options?.headers,
      },
      // Cache for 60 seconds by default, can be overridden
      next: { revalidate: 60, ...options?.next },
    });

    if (!response.ok) {
      throw new Error(`SEOBeast API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get all published posts
   */
  async getPosts(options?: {
    page?: number;
    limit?: number;
    category?: string;
    tag?: string;
  }): Promise<PostsResponse> {
    const params = new URLSearchParams();
    if (options?.page) params.set('page', String(options.page));
    if (options?.limit) params.set('limit', String(options.limit));
    if (options?.category) params.set('category', options.category);
    if (options?.tag) params.set('tag', options.tag);

    const query = params.toString() ? `?${params.toString()}` : '';
    return this.fetch<PostsResponse>(
      `/public/v1/${this.websiteSlug}/posts${query}`
    );
  }

  /**
   * Get a single post by slug
   */
  async getPostBySlug(slug: string): Promise<Post> {
    return this.fetch<Post>(
      `/public/v1/${this.websiteSlug}/posts/${slug}`
    );
  }

  /**
   * Get all categories
   */
  async getCategories(): Promise<Category[]> {
    return this.fetch<Category[]>(
      `/public/v1/${this.websiteSlug}/categories`
    );
  }

  /**
   * Get all tags
   */
  async getTags(): Promise<Tag[]> {
    return this.fetch<Tag[]>(
      `/public/v1/${this.websiteSlug}/tags`
    );
  }

  /**
   * Get RSS feed URL
   */
  getFeedUrl(): string {
    return `${this.baseUrl}/public/v1/${this.websiteSlug}/feed`;
  }
}

// =============================================================================
// Export singleton instance
// =============================================================================

export const seobeast = new SEOBeastClient(SEOBEAST_API_URL, SEOBEAST_WEBSITE_SLUG);

// Also export class for custom instances
export { SEOBeastClient };
