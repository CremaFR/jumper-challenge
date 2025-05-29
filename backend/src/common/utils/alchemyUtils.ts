import { env } from './envConfig';
import { Network } from 'alchemy-sdk';

/**
 * Get network name from chain ID
 * 
 * @param chainId - The chain ID to convert to an Alchemy network
 * @returns The corresponding Alchemy network
 */
export const getNetworkFromChainId = (chainId: number): Network => {
  switch (chainId) {
    case 1:
      return Network.ETH_MAINNET;
    case 11155111:
      return Network.ETH_SEPOLIA;
    case 137:
      return Network.MATIC_MAINNET;
    default:
      return Network.ETH_MAINNET;
  }
};

/**
 * Constructs the Alchemy API URL for the specified network
 * 
 * @param network - The Alchemy network to use
 * @returns The full Alchemy API URL with API key
 */
export const getAlchemyApiUrl = (network: Network | string): string => {
  return `https://${network}.g.alchemy.com/v2/${env.ALCHEMY_API_KEY}`;
};
