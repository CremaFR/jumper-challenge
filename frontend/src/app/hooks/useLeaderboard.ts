import { useQuery } from '@tanstack/react-query';
import { getLeaderboard, getUserRank } from '@/api/leaderboard';
import { useAtomValue } from 'jotai';
import { authTokenAtom } from './atoms/authAtoms';

/**
 * Hook to fetch the leaderboard data
 *
 * @param limit - Maximum number of entries to fetch
 * @param offset - Number of entries to skip (for pagination)
 * @returns Leaderboard data and loading/error states
 */
export function useLeaderboard(limit = 10, offset = 0) {
  return useQuery({
    queryKey: ['leaderboard', limit, offset],
    queryFn: () => getLeaderboard(limit, offset),
    select: (data) => data.responseObject,
    staleTime: 60 * 60 * 1000, // 1 minute
  });
}

/**
 * Hook to fetch the current user's rank on the leaderboard
 *
 * @returns User rank data and loading/error states
 */
export function useUserRank() {
  const token = useAtomValue(authTokenAtom);

  return useQuery({
    queryKey: ['userRank', token],
    queryFn: () => (token ? getUserRank(token) : Promise.reject('No token')),
    select: (data) => data.responseObject,
    enabled: !!token,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}
