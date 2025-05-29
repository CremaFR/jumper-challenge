import { Request, Response, NextFunction } from 'express';
import { verifySession } from '@/services/authService';
import { StatusCodes } from 'http-status-codes';

/**
 * Middleware to check if the user is authenticated.
 * Extracts the JWT token from the Authorization header and verifies it.
 * If valid, adds the user to the request object.
 */
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: 'Failed',
        message: 'Authentication required',
        data: null
      });
    }

    const token = authHeader.split(' ')[1];
    
    const result = await verifySession(token);
    if (!result.success) {
      return res.status(result.statusCode).json({
        status: result.success,
        message: result.message,
        data: null
      });
    }

    // Add the user data to the request
    if (result.responseObject?.user) {
      req.user = result.responseObject.user;
    }
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'Failed',
      message: 'Internal server error during authentication',
      data: null
    });
  }
};