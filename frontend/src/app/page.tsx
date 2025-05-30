'use client';
import { createConfig, http } from 'wagmi';
import { mainnet, sepolia, polygon } from 'wagmi/chains';
import { WagmiProvider } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { ConnectKitProvider, ConnectKitButton } from 'connectkit';
import { SignIn } from '@/app/components/auth/SignInButton';
import { TokenBalances } from '@/app/components/tokens/TokenBalances';
import { Header } from '@/app/components/common/Header';
import styled from 'styled-components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { JotaiProvider } from './providers/JotaiProvider';

const config = createConfig({
  chains: [mainnet, sepolia, polygon],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
  },
  connectors: [injected()],
});

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 6rem;
  gap: 2rem;
  width: 100%;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 1rem;
`;

export const queryClient = new QueryClient();

export default function Home() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
          <JotaiProvider>
            <Header>
              <ConnectKitButton />
              <SignIn />
            </Header>
            <Container>
              <TokenBalances />
            </Container>
          </JotaiProvider>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
