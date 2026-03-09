/**
 * CustomRequestController
 * HTTP handler for custom request submissions
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { CustomRequestService } from '@api/services/CustomRequestService';
import { CustomRequestSchema, validateRequest } from '@api/utils/validation';
import { asyncHandler, sendSuccess } from '@api/utils/asyncHandler';
import { ValidationError } from '@api/errors/AppError';
import { HttpStatus } from '@api/types';

const service = new CustomRequestService();

/**
 * POST /api/custom-request
 * Submit a custom order request
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
    payload = validateRequest(CustomRequestSchema, req.body);
  } catch (error) {
    throw new ValidationError(
      error instanceof Error ? error.message : 'Invalid request body'
    );
  }

  // Service handles business logic
  const result = await service.submitCustomRequest(payload);

  sendSuccess(res, result, 'Custom request submitted successfully', HttpStatus.CREATED);
});

export default handler;
