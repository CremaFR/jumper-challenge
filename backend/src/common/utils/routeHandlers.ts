import { Response, RequestHandler, NextFunction } from 'express';
import { AuthenticatedRequest } from '@/types/authenticatedRequest';
import { requireAuth } from '@/common/middleware/authMiddleware';

/**
 * A type helper function to create route handlers that are guaranteed to have an authenticated user.
 * This function should be used for routes that are protected by the requireAuth middleware.
 * 
 * @param handler The request handler function that expects an authenticated request
 * @returns A properly typed RequestHandler for Express
 */
function createAuthenticatedHandler<ResBody, ReqBody, ReqQuery>(
  handler: (req: AuthenticatedRequest, res: Response<ResBody>, next: NextFunction) => ResBody
): RequestHandler<any, ResBody, ReqBody, ReqQuery> {
  return (req, res, next) => {
    return handler(req as AuthenticatedRequest, res, next);
  };
}

/**
 * Creates a route handler that automatically applies the requireAuth middleware before
 * executing the provided handler function. This helps avoid mistakes where the requireAuth
 * middleware might be forgotten.
 * 
 * @param handler The request handler function that expects an authenticated request
 * @returns An array containing the requireAuth middleware and the authenticated handler
 */
export function createProtectedRoute<ResBody, ReqBody, ReqQuery>(
  handler: (req: AuthenticatedRequest, res: Response<ResBody>, next: NextFunction) => ResBody
): [typeof requireAuth, RequestHandler<any, ResBody, ReqBody, ReqQuery>] {
  return [requireAuth, createAuthenticatedHandler(handler)];
}
