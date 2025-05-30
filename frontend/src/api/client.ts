import { getTokenBalances as fetchTokenBalances, TokenBalancesResponse } from './tokens';
import { store } from '@/app/providers/JotaiProvider';
import { authTokenAtom } from '@/app/hooks/atoms/authAtoms';

class ApiClient {
  /**
   * Get the current auth token from global state
   * @returns The current auth token or null if not authenticated
   */
  private getAuthToken(): string | null {
    return store.get(authTokenAtom);
  }

  /**
   * Verify if an auth token exists and throw an error if not
   * @throws Error if no authentication token is available
   */
  private verifyAuth(): string {
    const token = this.getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }
    return token;
  }

  /**
   * Fetches token balances for the authenticated user
   * @param chainId - Optional chain ID to fetch balances from (defaults to 1 for Ethereum mainnet)
   * @returns The parsed JSON response containing token balances
   * @throws An error if the request fails or user is not authenticated
   */
  async getTokenBalances(chainId?: number): Promise<TokenBalancesResponse> {
    const token = this.verifyAuth();
    return fetchTokenBalances(token, chainId);
  }
}

export const apiClient = new ApiClient();

export function useApiClient() {
  return apiClient;
}
