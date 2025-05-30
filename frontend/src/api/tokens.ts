import { config } from '@/config/env';
import { ApiError } from './errors';
import { ServiceResponse } from './types';

/**
 * Interface for token data returned from the API
 */
export interface TokenData {
  contractAddress: string;
  balance: string;
  decimals: number;
  name: string;
  symbol: string;
  formattedBalance: string;
}

/**
 * Interface for token balances data
 */
export interface TokenBalancesData {
  address: string;
  chainId: number;
  tokens: TokenData[];
}

/**
 * Interface for token balances response
 */
export type TokenBalancesResponse = ServiceResponse<TokenBalancesData>;

/**
 * Fetches token balances for the authenticated user.
 *
 * @param token - The JWT token for authentication
 * @param chainId - Optional chain ID to fetch balances from (defaults to 1 for Ethereum mainnet)
 * @returns The parsed JSON response containing token balances
 * @throws An error if the request fails
 */
export async function getTokenBalances(token: string, chainId?: number): Promise<TokenBalancesResponse> {
  const queryParams = chainId ? `?chainId=${chainId}` : '';

  const response = await fetch(`${config.apiUrl}/api/tokens/balances${queryParams}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const errorMessage = errorData?.message || 'Failed to fetch token balances';
    throw new ApiError(errorMessage, response.status);
  }

  const data = await response.json();
  return data;
}
