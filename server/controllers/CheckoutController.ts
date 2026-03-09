/**
 * CheckoutController
 * HTTP handler for Stripe checkout creation
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { CheckoutService } from '@api/services/CheckoutService';
import { CheckoutRequestSchema, validateRequest } from '@api/utils/validation';
import { asyncHandler, sendSuccess } from '@api/utils/asyncHandler';
import { ValidationError } from '@api/errors/AppError';
import { HttpStatus } from '@api/types';
import { logger } from '@api/utils/logger';

const service = new CheckoutService();

/**
 * POST /api/checkout
 * Create a Stripe checkout session
 */
export const handler = asyncHandler(async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'POST') {
    res.status(HttpStatus.BAD_REQUEST).json({
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'Only POST method is allowed',
      },
    });
    return;
  }

  // Validate request body
  let payload;
  try {
    payload = validateRequest(CheckoutRequestSchema, req.body);
  } catch (error) {
    throw new ValidationError(
      error instanceof Error ? error.message : 'Invalid request body'
    );
  }

  // Get origin for redirect URLs
  const origin = req.headers.origin || 'https://kyndodesign.com';

  logger.info('Checkout request', {
    itemCount: payload.items.length,
    origin,
  });

  // Service handles Stripe session creation
  const result = await service.createCheckoutSession(payload, origin);

  sendSuccess(res, result, 'Checkout session created', HttpStatus.OK);
});

export default handler;
