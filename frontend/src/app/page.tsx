'use client';
import { ConnectKitButton } from 'connectkit';
import { SignIn } from '@/app/components/auth/SignInButton';
import { TokenBalances } from '@/app/components/tokens/TokenBalances';
import { Header } from '@/app/components/common/Header';
import styled from 'styled-components';
import Link from 'next/link';
import { AppProviders } from './providers/AppProviders';

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

const LeaderboardCard = styled.div`
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  width: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin-top: 2rem;
`;

const LeaderboardLink = styled(Link)`
  display: inline-block;
  background-color: #1890ff;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  margin-top: 10px;
  
  &:hover {
    background-color: #096dd9;
  }
`;

export default function Home() {
  return (
    <AppProviders>
      <Header>
        <ConnectKitButton />
        <SignIn />
      </Header>
      <Container>
        <TokenBalances />
      </Container>
    </AppProviders>
  );
}
