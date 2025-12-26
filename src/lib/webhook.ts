/**
 * SEOBeast Webhook Utilities
 * Handle incoming webhooks from SEOBeast with signature verification
 */

import { createHmac, timingSafeEqual } from 'crypto';

// =============================================================================
// Types
// =============================================================================

export type WebhookEvent =
  | 'post.created'
  | 'post.updated'
  | 'post.deleted'
  | 'post.published'
  | 'post.unpublished';

export interface WebhookPayload {
  event: WebhookEvent;
  timestamp: string;
  data: {
    postId: string;
    slug: string;
    status: string;
    websiteSlug: string;
    title?: string;
  };
}

// =============================================================================
// Signature Verification
// =============================================================================

/**
 * Generate HMAC SHA256 signature for a payload
 */
function generateSignature(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('hex');
}

/**
 * Verify webhook signature from SEOBeast
 *
 * @param payload - The raw request body as a string
 * @param signature - The signature from X-Webhook-Signature header
 * @param secret - Your webhook secret from SEOBeast dashboard
 * @returns true if signature is valid
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  if (!payload || !signature || !secret) {
    return false;
  }

  try {
    const expectedSignature = generateSignature(payload, secret);
    return timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch {
    return false;
  }
}

/**
 * Parse and validate a webhook payload
 *
 * @param body - The raw request body
 * @returns Parsed WebhookPayload or null if invalid
 */
export function parseWebhookPayload(body: string): WebhookPayload | null {
  try {
    const payload = JSON.parse(body) as WebhookPayload;

    // Basic validation
    if (!payload.event || !payload.timestamp || !payload.data) {
      return null;
    }

    if (!payload.data.postId || !payload.data.slug || !payload.data.websiteSlug) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

// =============================================================================
// Event Helpers
// =============================================================================

/**
 * Check if the event requires content refresh
 */
export function isContentUpdateEvent(event: WebhookEvent): boolean {
  return ['post.created', 'post.updated', 'post.published'].includes(event);
}

/**
 * Check if the event requires content removal
 */
export function isContentRemovalEvent(event: WebhookEvent): boolean {
  return ['post.deleted', 'post.unpublished'].includes(event);
}
