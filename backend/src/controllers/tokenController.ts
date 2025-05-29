import { Request, Response } from 'express';
import { getTokenBalances } from '@/services/tokenService';
import { StatusCodes } from 'http-status-codes';

/**
 * Fetches token balances for the authenticated user.
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const getUserTokenBalances = async (req: Request, res: Response) => {
  try {
    // Get the user's address from the auth middleware TODO
    const userAddress = req.user?.address;
    
    const chainId = req.query.chainId ? parseInt(req.query.chainId as string) : 1;
    if (!userAddress) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: 'Failed',
        message: 'User address not found',
        data: null
      });
    }

    // Call the service to get the token balances
    const result = await getTokenBalances(userAddress, chainId);
    
    // Return the response
    return res.status(result.statusCode).json({
      status: result.success ? 'Success' : 'Failed',
      message: result.message,
      data: result.responseObject
    });
  } catch (error) {
    console.error('Error in getUserTokenBalances controller:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'Failed',
      message: 'An error occurred while fetching token balances',
      data: null
    });
  }
};
