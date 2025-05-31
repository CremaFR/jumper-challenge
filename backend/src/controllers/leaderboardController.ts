import { Request, Response } from 'express';
import { getLeaderboard, getUserRank } from '@/services/leaderboardService';
import { handleServiceResponse } from '@/common/utils/httpHandlers';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';

/**
 * Get the leaderboard entries.
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const getLeaderboardController = async (req: Request, res: Response) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
  const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : 0;

  const result = await getLeaderboard(limit, offset);
  return handleServiceResponse(result, res);
};

/**
 * Get the current user's rank on the leaderboard.
 * 
 * @param req - Request object with user data
 * @param res - Express response object
 */
export const getUserRankController = async (req: Request, res: Response) => {
  if (!req.user || !req.user.address) {
    const unauthorizedResponse = new ServiceResponse(
      ResponseStatus.Failed,
      'User not authenticated',
      null,
      401
    );
    return handleServiceResponse(unauthorizedResponse, res);
  }

  const result = await getUserRank(req.user.address);
  return handleServiceResponse(result, res);
};
