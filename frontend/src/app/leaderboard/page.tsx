'use client';
import { Header } from '@/app/components/common/Header';
import { ConnectKitButton } from 'connectkit';
import { SignIn } from '@/app/components/auth/SignInButton';
import { Leaderboard } from '@/app/components/leaderboard/Leaderboard';
import styled from 'styled-components';
import { AppProviders } from '@/app/providers/AppProviders';

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

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
`;

export default function LeaderboardPage() {
  return (
    <AppProviders>
      <Header>
        <ConnectKitButton />
        <SignIn />
      </Header>
      <Container>
        <Title>Top Wallets</Title>
        <Leaderboard />
      </Container>
    </AppProviders>
  );
}
