import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@/api/errors';
import { apiClient } from '@/api/client';
import { useAtom } from 'jotai';
import { tokenBalancesAtom, tokenBalancesErrorAtom } from '@/app/hooks/atoms/tokenAtoms';
import { authTokenAtom } from '@/app/hooks/atoms/authAtoms';
import { useEffect } from 'react';

/**
 * Custom hook for fetching and managing token balances using React Query
 * @param options - Optional configuration for the query
 * @returns Query result with token balances data, loading state, error state, and refetch function
 */
export function useTokenBalances(options?: { chainId?: number }) {
  const [authToken, setAuthToken] = useAtom(authTokenAtom);
  const [, setTokenBalances] = useAtom(tokenBalancesAtom);
  const [, setTokenBalancesError] = useAtom(tokenBalancesErrorAtom);
  const queryClient = useQueryClient();

  const queryResult = useQuery({
    queryKey: ['tokenBalances', authToken, options?.chainId],
    queryFn: async () => {
      return apiClient.getTokenBalances(options?.chainId);
    },
    enabled: !!authToken,
    staleTime: 60 * 5 * 1000, // 5 minute stale time
  });

  useEffect(() => {
    if (queryResult.data) {
      setTokenBalances(queryResult.data.responseObject?.tokens || []);
      setTokenBalancesError(null);
    }

    if (queryResult.error) {
      console.error('Error fetching token balances:', queryResult.error);

      // Handle 401 unauthorized errors by clearing auth token
      if (queryResult.error instanceof ApiError && queryResult.error.status === 401) {
        setAuthToken(null);
        setTokenBalances(null);
        setTokenBalancesError('Your session has expired. Please sign in again.');
      } else {
        const errorMessage =
          queryResult.error instanceof Error ? queryResult.error.message : 'Failed to fetch token balances';
        setTokenBalancesError(errorMessage);
      }
    }
  }, [queryResult.data, queryResult.error, setAuthToken, setTokenBalances, setTokenBalancesError]);

  const refetchTokenBalances = async (chainId?: number) => {
    return queryClient.invalidateQueries({
      queryKey: ['tokenBalances', authToken, chainId ?? options?.chainId],
    });
  };

  return {
    ...queryResult,
    data: queryResult.data?.responseObject?.tokens || null,
    refetchTokenBalances,
  };
}
