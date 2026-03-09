/**
 * StripeWebhookController
 * HTTP handler for Stripe webhook events
 * Must handle raw body for signature verification
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { StripeWebhookService } from '@api/services/StripeWebhookService';
import { getConfig } from '@api/config';
import { logger } from '@api/utils/logger';
import { HttpStatus } from '@api/types';

const service = new StripeWebhookService();

/**
 * Helper to read raw body buffer (for Stripe signature verification)
 */
async function readRawBody(req: VercelRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    req.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });

    req.on('end', () => {
      resolve(Buffer.concat(chunks));
    });

    req.on('error', (error: Error) => {
      reject(error);
    });
  });
}

/**
 * POST /api/stripe-webhook
 * Handle Stripe webhook events (checkout.session.completed, etc)
 */
export async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.status(HttpStatus.BAD_REQUEST).json({
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'Only POST method is allowed',
      },
    });
    return;
  }

  try {
    const config = getConfig();
    const stripe = new Stripe(config.STRIPE_SECRET_KEY);

    // Read raw body for signature verification
    const buf = await readRawBody(req);
    const sig = req.headers['stripe-signature'] as string;

    if (!sig) {
      logger.warn('Stripe webhook missing signature header');
      res.status(HttpStatus.BAD_REQUEST).send('Missing stripe-signature header');
      return;
    }

    // Verify Stripe signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(buf, sig, config.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
      logger.error('Stripe signature verification failed', error instanceof Error ? error : undefined);
      res.status(HttpStatus.BAD_REQUEST).send(`Webhook verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return;
    }

    logger.info('Stripe event received', { type: event.type, eventId: event.id });

    // Process checkout.session.completed events
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      await service.handleCheckoutSessionCompleted(session);
    }

    // Always return 200 to acknowledge receipt
    res.status(HttpStatus.OK).json({ received: true });
  } catch (error) {
    logger.error('Webhook handler error', error instanceof Error ? error : undefined);
    res.status(HttpStatus.INTERNAL_ERROR).send('Webhook processing failed');
  }
}

export default handler;
