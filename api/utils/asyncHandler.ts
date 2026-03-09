/**
 * Async Handler Wrapper
 * Wraps async endpoint handlers to catch errors and pass to error middleware
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { AppError, InternalError } from '@api/errors/AppError';
import { logger } from '@api/utils/logger';
import { ApiErrorResponse, ApiSuccess, HttpStatus } from '@api/types';

export type AsyncHandler = (
  req: VercelRequest,
  res: VercelResponse
) => Promise<void> | void;

export function asyncHandler(handler: AsyncHandler): AsyncHandler {
  return async (req: VercelRequest, res: VercelResponse): Promise<void> => {
    try {
      await handler(req, res);
    } catch (error: unknown) {
      const appError = error instanceof AppError ? error : new InternalError('Unknown error', error);

      logger.error(`API Error: ${appError.message}`, error instanceof Error ? error : undefined, {
        code: appError.code,
        statusCode: appError.statusCode,
      });

      const errorResponse: ApiErrorResponse = {
        error: {
          code: appError.code,
          message: appError.message,
          details: appError.details,
        },
      };

      res.status(appError.statusCode).json(errorResponse);
    }
  };
}

/**
 * Helper to send success responses with consistent typing
 */
export function sendSuccess<T>(
  res: VercelResponse,
  data: T,
  message: string,
  statusCode: HttpStatus = HttpStatus.OK
): void {
  const response: ApiSuccess<T> = { data, message };
  res.status(statusCode).json(response);
}
