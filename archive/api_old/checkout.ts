/**
 * api/checkout.ts
 * Entry point for Stripe checkout endpoint
 */

import { loadConfig } from '@api/config';
import { handler } from '@api/controllers/CheckoutController';

// Load config on startup
loadConfig();

export default handler;
