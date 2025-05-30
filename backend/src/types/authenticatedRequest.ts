import { Request } from 'express';
import { UserJwtPayload } from './express';

/**
 * Represents an authenticated request with a guaranteed user object.
 * Use this type for routes that are protected by the requireAuth middleware.
 */
export interface AuthenticatedRequest extends Request {
  user: UserJwtPayload;
}
