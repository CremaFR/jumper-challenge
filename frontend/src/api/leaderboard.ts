import { config } from '@/config/env';
import { ApiError } from './errors';
import { ServiceResponse, LeaderboardEntry, LeaderboardResponse, UserRankResponse } from './types';

/**
 * Fetches the leaderboard entries from the backend.
 * 
 * @param limit - Maximum number of entries to fetch
 * @param offset - Number of entries to skip (for pagination)
 * @returns The leaderboard data with entries and total count
 * @throws An error if the request fails
 */
export async function getLeaderboard(
  limit = 10,
  offset = 0
): Promise<ServiceResponse<LeaderboardResponse>> {
  const response = await fetch(
    `${config.apiUrl}/api/leaderboard?limit=${limit}&offset=${offset}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new ApiError('Failed to get leaderboard', response.status);
  }

  const data = (await response.json()) as ServiceResponse<LeaderboardResponse>;
  return data;
}

/**
 * Fetches the current user's rank and data from the leaderboard.
 * 
 * @param token - JWT token for authorization
 * @returns The user's rank and data
 * @throws An error if the request fails
 */
export async function getUserRank(token: string): Promise<ServiceResponse<UserRankResponse>> {
  const response = await fetch(`${config.apiUrl}/api/leaderboard/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new ApiError('Failed to get user rank', response.status);
  }

  const data = (await response.json()) as ServiceResponse<UserRankResponse>;
  return data;
}
