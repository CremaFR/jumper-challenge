import styled from 'styled-components';
import React from 'react';
import { NetworkSelector } from './NetworkSelector';
import Link from 'next/link';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0rem;
  width: 100%;
  background-color: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
`;

const NetworkContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 1em;
`;

const Navigation = styled.nav`
  display: flex;
  align-items: center;
  margin-left: 2em;
`;

const NavLink = styled(Link)`
  color: #333;
  text-decoration: none;
  margin-right: 1.5em;
  font-weight: 500;
  font-size: 16px;
  
  &:hover {
    color: #1890ff;
    text-decoration: none;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-right: 1em;
`;

interface HeaderProps {
  children: React.ReactNode;
}

export function Header({ children }: HeaderProps) {
  return (
    <HeaderContainer>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <NetworkContainer>
          <NetworkSelector />
        </NetworkContainer>
        <Navigation>
          <NavLink href="/">Home</NavLink>
          <NavLink href="/leaderboard">Leaderboard</NavLink>
        </Navigation>
      </div>
      <ButtonsContainer>{children}</ButtonsContainer>
    </HeaderContainer>
  );
}

export { ButtonsContainer };
