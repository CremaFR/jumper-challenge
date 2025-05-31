import { prisma } from '@/common/utils/prismaClient';
import { ServiceResponse, ResponseStatus } from '@/common/models/serviceResponse';
import { StatusCodes } from 'http-status-codes';

/**
 * Updates or creates a leaderboard entry for a user.
 * 
 * @param address - The user's wallet address
 * @param chainId - The chain ID of the connected network
 * @returns A ServiceResponse with the updated leaderboard entry
 */
export const updateLeaderboardEntry = async (address: string, chainId: number) => {
  try {
    // Find existing entry or create a new one
    const entry = await prisma.leaderboardEntry.upsert({
      where: { address },
      update: { 
        logins: { increment: 1 },
        points: { increment: 10 }, // Add 10 points per login
        lastLogin: new Date(),
      },
      create: {
        address,
        chainId,
        points: 10, // Initial points for first login
      },
    });

    return new ServiceResponse(
      ResponseStatus.Success, 
      'Leaderboard updated successfully', 
      entry, 
      StatusCodes.OK
    );
  } catch (error) {
    console.error('Leaderboard update error:', error);
    return new ServiceResponse(
      ResponseStatus.Failed, 
      'Failed to update leaderboard', 
      null, 
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

/**
 * Gets the top entries from the leaderboard.
 * 
 * @param limit - Maximum number of entries to return
 * @param offset - Number of entries to skip for pagination
 * @returns A ServiceResponse with the leaderboard entries
 */
export const getLeaderboard = async (limit = 10, offset = 0) => {
  try {
    const entries = await prisma.leaderboardEntry.findMany({
      orderBy: { points: 'desc' },
      take: limit,
      skip: offset,
    });

    const total = await prisma.leaderboardEntry.count();

    return new ServiceResponse(
      ResponseStatus.Success, 
      'Leaderboard retrieved successfully', 
      { entries, total }, 
      StatusCodes.OK
    );
  } catch (error) {
    console.error('Leaderboard retrieval error:', error);
    return new ServiceResponse(
      ResponseStatus.Failed, 
      'Failed to retrieve leaderboard', 
      null, 
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

/**
 * Gets a user's position on the leaderboard.
 * 
 * @param address - The user's wallet address
 * @returns A ServiceResponse with the user's leaderboard rank and details
 */
export const getUserRank = async (address: string) => {
  try {
    const user = await prisma.leaderboardEntry.findUnique({
      where: { address },
    });

    if (!user) {
      return new ServiceResponse(
        ResponseStatus.Failed, 
        'User not found on leaderboard', 
        null, 
        StatusCodes.NOT_FOUND
      );
    }

    // Count how many users have more points
    const higherRankedCount = await prisma.leaderboardEntry.count({
      where: { points: { gt: user.points } },
    });

    // Rank is 1-based (higherRankedCount + 1)
    const rank = higherRankedCount + 1;

    return new ServiceResponse(
      ResponseStatus.Success, 
      'User rank retrieved successfully', 
      { user, rank }, 
      StatusCodes.OK
    );
  } catch (error) {
    console.error('User rank retrieval error:', error);
    return new ServiceResponse(
      ResponseStatus.Failed, 
      'Failed to retrieve user rank', 
      null, 
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
