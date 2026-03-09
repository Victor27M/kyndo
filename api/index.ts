/**
 * api/index.ts
 * Unified API entry point - routes all endpoints through single serverless function
 * 
 * This consolidates multiple endpoints into one function to stay within Vercel's
 * 12-function limit on the Hobby plan.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { loadConfig } from '@api/config';
import { handler as checkoutHandler } from '@api/controllers/CheckoutController';
import { handler as waitlistHandler } from '@api/controllers/WaitlistController';
import { handler as customRequestHandler } from '@api/controllers/CustomRequestController';
import { handler as stripeWebhookHandler } from '@api/controllers/StripeWebhookController';

// Load config on startup
loadConfig();

// Disable body parsing for webhook endpoint (needs raw buffer for Stripe signature)
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Main API router
 * Routes requests to appropriate controller based on URL path
 */
export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  // Extract route from URL
  const url = new URL(req.url || '/', `http://${req.headers.host}`);
  const pathname = url.pathname;

  // Route to appropriate handler
  if (pathname === '/api/checkout' || pathname === '/api/checkout/') {
    return checkoutHandler(req, res);
  }

  if (pathname === '/api/waitlist' || pathname === '/api/waitlist/') {
    return waitlistHandler(req, res);
  }

  if (pathname === '/api/custom-request' || pathname === '/api/custom-request/') {
    return customRequestHandler(req, res);
  }

  if (pathname === '/api/stripe-webhook' || pathname === '/api/stripe-webhook/') {
    return stripeWebhookHandler(req, res);
  }

  // Route not found
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: 'API endpoint not found',
    },
  });
}
