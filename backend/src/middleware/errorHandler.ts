import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { sendError } from '../utils/response';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof ApiError) {
    sendError(res, err.statusCode, err.message, err.errors);
    return;
  }

  if (err.name === 'ValidationError') {
    sendError(res, 400, 'Validation failed');
    return;
  }

  if (err.name === 'CastError') {
    sendError(res, 400, 'Invalid resource ID');
    return;
  }

  if ((err as { code?: number }).code === 11000) {
    sendError(res, 409, 'Duplicate field value entered');
    return;
  }

  console.error('Unhandled error:', err);
  sendError(res, 500, 'Internal server error');
};
