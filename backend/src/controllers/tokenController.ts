import { Response } from 'express';
import { getTokenBalances } from '@/services/tokenService';
import { StatusCodes } from 'http-status-codes';
import { handleServiceResponse } from '@/common/utils/httpHandlers';
import { ServiceResponse, ResponseStatus } from '@/common/models/serviceResponse';
import { AuthenticatedRequest } from '@/types/authenticatedRequest';

/**
 * Fetches token balances for the authenticated user.
 * 
 * @param req - Express request object with authenticated user
 * @param res - Express response object
 */
export const getUserTokenBalances = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userAddress = req.user.address;
    
    // Parse chain ID from query parameters (default to 1 for Ethereum mainnet)
    const chainId = req.query.chainId ? parseInt(req.query.chainId as string) : 1;

    const result = await getTokenBalances(userAddress, chainId);
    
    return handleServiceResponse(result, res);
  } catch (error) {
    console.error('Error in getUserTokenBalances controller:', error);
    const unexpectedErrorResponse = new ServiceResponse(
      ResponseStatus.Failed,
      'An error occurred while fetching token balances',
      null,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
    return handleServiceResponse(unexpectedErrorResponse, res);
  }
};
