import { Request, Response } from 'express';
import { getLeaderboard, getUserRank } from '@/services/leaderboardService';
import { handleServiceResponse } from '@/common/utils/httpHandlers';
import { AuthenticatedRequest } from '@/types/authenticatedRequest';

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
export const getUserRankController = async (req: AuthenticatedRequest, res: Response) => {
  const result = await getUserRank(req.user.address);
  return handleServiceResponse(result, res);
};
