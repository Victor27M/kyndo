/**
 * WaitlistController
 * HTTP request/response handling for waitlist endpoints
 * No business logic - delegates to service layer
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { WaitlistService } from '@api/services/WaitlistService';
import { WaitlistRequestSchema, validateRequest } from '@api/utils/validation';
import { asyncHandler, sendSuccess } from '@api/utils/asyncHandler';
import { ValidationError } from '@api/errors/AppError';
import { HttpStatus } from '@api/types';

const service = new WaitlistService();

/**
 * POST /api/waitlist
 * Subscribe email to waitlist
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
    payload = validateRequest(WaitlistRequestSchema, req.body);
  } catch (error) {
    throw new ValidationError(
      error instanceof Error ? error.message : 'Invalid request body'
    );
  }

  // Service handles business logic
  const result = await service.subscribeToWaitlist(payload);

  sendSuccess(res, result, 'Successfully added to waitlist', HttpStatus.CREATED);
});

export default handler;
