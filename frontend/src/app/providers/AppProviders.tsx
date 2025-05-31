'use client';
import React from 'react';
import { createConfig, http } from 'wagmi';
import { mainnet, sepolia, polygon } from 'wagmi/chains';
import { WagmiProvider } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { ConnectKitProvider } from 'connectkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { JotaiProvider } from './JotaiProvider';

// Create Wagmi config
const config = createConfig({
  chains: [mainnet, sepolia, polygon],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
  },
  connectors: [injected()],
});

// Create Query client
const queryClient = new QueryClient();

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
          <JotaiProvider>
            {children}
          </JotaiProvider>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
