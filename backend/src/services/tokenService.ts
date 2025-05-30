import { ServiceResponse, ResponseStatus } from '@/common/models/serviceResponse';
import { StatusCodes } from 'http-status-codes';
import { TokenBalance, TokenBalancesResponse, TokenMetadataResponse } from 'alchemy-sdk/dist/src/types/types';
import { getAlchemyApiUrl, getNetworkFromChainId } from '@/common/utils/alchemyUtils';

// Simple in-memory cache for token metadata
interface TokenMetadataCache {
  [key: string]: {
    metadata: TokenMetadataResponse;
    timestamp: number;
  };
}

// Cache with network-specific entries
// Format: { 'network:contractAddress': { metadata, timestamp } }
const tokenMetadataCache: TokenMetadataCache = {};

// Cache expiration time in milliseconds (default: 1 hour)
const CACHE_EXPIRATION_MS = 60 * 60 * 1000;

/**
 * Fetches token balances for a specific Ethereum address.
 *
 * @param address - The Ethereum address to fetch balances for
 * @param chainId - The chain ID (defaults to 1 for Ethereum mainnet)
 * @returns A ServiceResponse containing the token balances
 */
export const getTokenBalances = async (address: string, chainId: number = 1) => {
  try {
    // Determine which network to use based on chainId
    const network = getNetworkFromChainId(chainId);

    // Construct the Alchemy API URL
    const alchemyUrl = getAlchemyApiUrl(network);

    // Get token balances using Alchemy API
    const response = await fetch(alchemyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'alchemy_getTokenBalances',
        params: [address],
      }),
    });

    const data = await response.json();

    if (data.error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        'Failed to fetch token balances',
        { error: data.error },
        StatusCodes.BAD_REQUEST
      );
    }

    const balances = data.result as TokenBalancesResponse;
    const tokenMetadata = await getTokenMetadata(balances.tokenBalances, network);

    return new ServiceResponse(
      ResponseStatus.Success,
      'Token balances retrieved successfully',
      {
        address,
        chainId,
        tokens: tokenMetadata,
      },
      StatusCodes.OK
    );
  } catch (error) {
    console.error('Error fetching token balances:', error);
    return new ServiceResponse(
      ResponseStatus.Failed,
      'Failed to fetch token balances',
      null,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

/**
 * Get metadata for tokens
 * Small in memory cache to avoid excessive API calls - hit my rate limit haha
 * Ideally this would be a Redis cache or similar
 */
const getTokenMetadata = async (tokenBalances: TokenBalance[], network: string) => {
  // Filter out zero balances
  const nonZeroBalances = tokenBalances.filter(
    (token) => token.tokenBalance !== '0x0000000000000000000000000000000000000000000000000000000000000000'
  );

  // Get token metadata for each non-zero balance
  const tokenData = await Promise.all(
    nonZeroBalances.map(async (token) => {
      try {
        const metadata = await getTokenMetadataForContract(token.contractAddress, network);
        return {
          contractAddress: token.contractAddress,
          balance: token.tokenBalance,
          decimals: metadata.decimals,
          name: metadata.name,
          symbol: metadata.symbol,
          formattedBalance: formatTokenBalance(token.tokenBalance, metadata.decimals),
        };
      } catch (error) {
        // Return partial data if metadata fetch fails
        return {
          contractAddress: token.contractAddress,
          balance: token.tokenBalance,
          decimals: null,
          name: null,
          symbol: null,
          formattedBalance: null,
        };
      }
    })
  );

  return tokenData;
};

/**
 * Get metadata for a specific token contract
 */
const getTokenMetadataForContract = async (contractAddress: string, network: string) => {
  const cacheKey = `${network}:${contractAddress}`;
  const cachedEntry = tokenMetadataCache[cacheKey];
  const currentTime = Date.now();

  // Return cached metadata if not expired
  if (cachedEntry && currentTime - cachedEntry.timestamp < CACHE_EXPIRATION_MS) {
    return cachedEntry.metadata;
  }

  const alchemyUrl = getAlchemyApiUrl(network);

  const response = await fetch(alchemyUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'alchemy_getTokenMetadata',
      params: [contractAddress],
    }),
  });

  const data = await response.json();

  if (data.error) {
    throw new Error(`Failed to get token metadata: ${data.error.message}`);
  }

  tokenMetadataCache[cacheKey] = {
    metadata: data.result as TokenMetadataResponse,
    timestamp: currentTime,
  };

  return data.result as TokenMetadataResponse;
};

/**
 * Format a token balance based on its decimals
 * If decimals or balance is null, return raw balance with no decimal places
 */
const formatTokenBalance = (balance: string | null, decimals: number | null): string => {
  if (balance === null || decimals === null) return '0';

  const decimalBalance = BigInt(balance);
  
  // Format with proper decimal places - no shiftBy in BigInt :sadge: 
  return (Number(decimalBalance) / (10 ** decimals)).toString();
};
