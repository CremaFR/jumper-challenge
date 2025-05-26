'use client'

import { createConfig, http } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { ConnectKitProvider, ConnectKitButton } from 'connectkit'
import { SignIn } from '@/app/components/auth/SignInButton'
import styled from 'styled-components'

const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
  connectors: [
    injected(),
  ]
})

const queryClient = new QueryClient()

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10rem;
  gap: 1rem;
`;

export default function Home() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
          <Container>
            <ConnectKitButton />
            <SignIn />
          </Container>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}