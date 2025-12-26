# SEOBeast + Next.js Blog Example

A minimal example showing how to use [SEOBeast](https://seobeast.io) as a headless CMS for your Next.js blog.

## Features

- Fetch blog posts from SEOBeast's public API
- Server-side rendering with ISR (Incremental Static Regeneration)
- Webhook integration for real-time content updates
- SEO-optimized with dynamic metadata
- TypeScript support
- Tailwind CSS styling

## Quick Start

### 1. Clone and install

```bash
git clone https://github.com/seobeast/nextjs-example.git
cd nextjs-example

# Install dependencies (pick one)
npm install
# or
pnpm install
# or
yarn install
```

### 2. Configure environment variables

Copy the example env file and update with your SEOBeast credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
SEOBEAST_API_URL=https://api.seobeast.io
SEOBEAST_WEBSITE_SLUG=your-website-slug
SEOBEAST_WEBHOOK_SECRET=your-webhook-secret
```

### 3. Run the development server

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Visit [http://localhost:3000/blog](http://localhost:3000/blog) to see your posts.

## Setting Up Webhooks

Webhooks enable real-time content updates. When you publish or update a post in SEOBeast, your Next.js site will automatically revalidate.

### 1. Configure webhook in SEOBeast

1. Go to your SEOBeast dashboard
2. Navigate to **Settings > Webhooks**
3. Add your webhook URL: `https://your-domain.com/api/webhook`
4. Copy the generated secret to your `.env.local`

### 2. Webhook events

The following events trigger revalidation:

| Event | Description |
|-------|-------------|
| `post.published` | A post was published |
| `post.updated` | A published post was updated |
| `post.unpublished` | A post was unpublished |
| `post.deleted` | A post was deleted |

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── webhook/
│   │       └── route.ts      # Webhook handler
│   ├── blog/
│   │   ├── [slug]/
│   │   │   └── page.tsx      # Single post page
│   │   └── page.tsx          # Blog listing
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── PostCard.tsx          # Post preview component
└── lib/
    ├── seobeast.ts           # API client
    └── webhook.ts            # Webhook utilities
```

## API Client Usage

The SEOBeast client is pre-configured and ready to use:

```typescript
import { seobeast } from '@/lib/seobeast';

// Get all posts
const { posts } = await seobeast.getPosts();

// Get a single post
const post = await seobeast.getPostBySlug('my-post-slug');

// Get categories
const categories = await seobeast.getCategories();

// Get tags
const tags = await seobeast.getTags();
```

## Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/seobeast/nextjs-example)

1. Click the button above or import the repo in Vercel
2. Add your environment variables in the Vercel dashboard
3. Deploy!

### Other platforms

This is a standard Next.js app and can be deployed to any platform that supports Next.js:

- Netlify
- AWS Amplify
- Railway
- Self-hosted with `npm run build && npm start`

## Customization

### Styling

This example uses Tailwind CSS. Modify `src/app/globals.css` and component classes to match your brand.

### Adding features

- **Comments**: Add a comments section using Disqus, Giscus, or your own backend
- **Search**: Implement client-side search or use Algolia
- **Newsletter**: Add a subscription form with ConvertKit, Mailchimp, etc.
- **Analytics**: Add Vercel Analytics, Plausible, or Google Analytics

## Learn More

- [SEOBeast Documentation](https://docs.seobeast.io)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)

## License

MIT
