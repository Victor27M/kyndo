/**
 * api/stripe-webhook.ts
 * Entry point for Stripe webhook events
 * 
 * Vercel config: disable body parsing to read raw Buffer for signature verification
 */

import { loadConfig } from '@api/config';
import { handler } from '@api/controllers/StripeWebhookController';

// Disable automatic body parsing for Vercel (need raw buffer for Stripe signature)
export const config = {
  api: {
    bodyParser: false,
  },
};

// Load config on startup
loadConfig();

export default handler;
