'use client'

import { createConfig, http } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { MetaMaskConnect } from '@/components/walletSelector/MetaMaskConnect'

// Create a wagmi config with only MetaMask
const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
  connectors: [
    injected({ target: 'metaMask' }), // Specifically target MetaMask
  ],
})

// Create a React Query client
const queryClient = new QueryClient()

export default function Home() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
          <MetaMaskConnect config={config} />
      </QueryClientProvider>
    </WagmiProvider>
  )
}