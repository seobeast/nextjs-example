/**
 * SEOBeast Webhook Handler
 *
 * This endpoint receives webhooks from SEOBeast when content changes.
 * It verifies the signature and triggers Next.js revalidation.
 */

import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import {
  verifyWebhookSignature,
  parseWebhookPayload,
  isContentUpdateEvent,
  isContentRemovalEvent,
  type WebhookPayload,
} from '@/lib/webhook';

const WEBHOOK_SECRET = process.env.SEOBEAST_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  // Check if webhook secret is configured
  if (!WEBHOOK_SECRET) {
    console.error('[Webhook] SEOBEAST_WEBHOOK_SECRET is not configured');
    return NextResponse.json(
      { error: 'Webhook not configured' },
      { status: 500 }
    );
  }

  // Get signature from header
  const signature = request.headers.get('X-Webhook-Signature');
  if (!signature) {
    return NextResponse.json(
      { error: 'Missing signature' },
      { status: 401 }
    );
  }

  // Read and verify payload
  const body = await request.text();

  if (!verifyWebhookSignature(body, signature, WEBHOOK_SECRET)) {
    console.warn('[Webhook] Invalid signature received');
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 401 }
    );
  }

  // Parse payload
  const payload = parseWebhookPayload(body);
  if (!payload) {
    return NextResponse.json(
      { error: 'Invalid payload' },
      { status: 400 }
    );
  }

  console.log(`[Webhook] Received event: ${payload.event} for post: ${payload.data.slug}`);

  // Handle the webhook event
  await handleWebhookEvent(payload);

  return NextResponse.json({ success: true });
}

/**
 * Handle different webhook events
 */
async function handleWebhookEvent(payload: WebhookPayload) {
  const { event, data } = payload;

  if (isContentUpdateEvent(event)) {
    // Revalidate the specific post page
    revalidatePath(`/blog/${data.slug}`);

    // Revalidate the blog listing
    revalidatePath('/blog');

    console.log(`[Webhook] Revalidated paths for: ${data.slug}`);
  }

  if (isContentRemovalEvent(event)) {
    // Revalidate to remove the post from listings
    revalidatePath('/blog');

    console.log(`[Webhook] Revalidated blog listing after removal: ${data.slug}`);
  }

  // You can add custom logic here, such as:
  // - Sending notifications
  // - Updating a local database
  // - Triggering a full rebuild
  // - Logging to an analytics service
}

// Optionally handle GET for webhook verification (some services require this)
export async function GET() {
  return NextResponse.json({
    message: 'SEOBeast webhook endpoint',
    status: 'active',
  });
}
