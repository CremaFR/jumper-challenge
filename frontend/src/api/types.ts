/**
 * Common response type from the backend services
 */
export interface ServiceResponse<T> {
  success: boolean;
  message: string;
  responseObject: T | null;
  statusCode: number;
}

/**
 * Auth response with token information
 */
export interface AuthResponseObject {
  token: string;
  user?: {
    address: string;
  };
}

/**
 * Nonce response object
 */
export interface NonceResponseObject {
  nonce: string;
}

/**
 * Leaderboard entry with user data
 */
export interface LeaderboardEntry {
  id: number;
  address: string;
  chainId: number;
  points: number;
  logins: number;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Leaderboard response with all entries and total count
 */
export interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  total: number;
}

/**
 * User rank response with user data and rank
 */
export interface UserRankResponse {
  user: LeaderboardEntry;
  rank: number;
}
