import { Request, Response, NextFunction } from 'express';
import { verifySession } from '@/services/authService';
import { StatusCodes } from 'http-status-codes';
import { handleServiceResponse } from '@/common/utils/httpHandlers';
import { ServiceResponse, ResponseStatus } from '@/common/models/serviceResponse';

/**
 * Middleware to check if the user is authenticated.
 * Extracts the JWT token from the Authorization header and verifies it.
 * If valid, adds the user to the request object.
 */
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const unauthorizedResponse = new ServiceResponse(
        ResponseStatus.Failed,
        'Authentication required',
        null,
        StatusCodes.UNAUTHORIZED
      );
      return handleServiceResponse(unauthorizedResponse, res);
    }

    const token = authHeader.split(' ')[1];
    
    const result = await verifySession(token);
    if (!result.success) {
      return handleServiceResponse(result, res);
    }

    // Add the user data to the request
    if (result.responseObject?.user) {
      req.user = result.responseObject.user;
      next();
    } else {
      const invalidUserResponse = new ServiceResponse(
        ResponseStatus.Failed,
        'Invalid user data in token',
        null,
        StatusCodes.UNAUTHORIZED
      );
      return handleServiceResponse(invalidUserResponse, res);
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    const unexpectedErrorResponse = new ServiceResponse(
      ResponseStatus.Failed,
      'Internal server error during authentication',
      null,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
    return handleServiceResponse(unexpectedErrorResponse, res);
  }
};