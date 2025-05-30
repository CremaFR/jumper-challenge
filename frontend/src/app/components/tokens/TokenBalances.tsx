import { useAtom } from 'jotai';
import { authTokenAtom } from '@/app/hooks/atoms/authAtoms';
import styled, { keyframes } from 'styled-components';
import { useTokenBalances } from '@/app/hooks/useTokenBalances';
import { TokenData } from '@/api/tokens';
import { useChainId } from 'wagmi';
import { mainnet, sepolia, polygon } from 'wagmi/chains';
import React from 'react';

const CardContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.24);
  padding: 20px;
  width: 100%;
`;

const FlexContainer = styled.div<{
  $direction?: string;
  $justifyContent?: string;
  $alignItems?: string;
  $py?: number;
  $mb?: number;
}>`
  display: flex;
  flex-direction: ${(props) => props.$direction || 'row'};
  justify-content: ${(props) => props.$justifyContent || 'flex-start'};
  align-items: ${(props) => props.$alignItems || 'stretch'};
  padding-top: ${(props) => (props.$py ? `${props.$py * 4}px` : '0')};
  padding-bottom: ${(props) => (props.$py ? `${props.$py * 4}px` : '0')};
  margin-bottom: ${(props) => (props.$mb ? `${props.$mb * 4}px` : '0')};
`;

const Heading = styled.h2<{ $size?: string }>`
  font-size: ${(props) => (props.$size === 'md' ? '18px' : props.$size === 'sm' ? '14px' : '24px')};
  font-weight: 600;
  margin: 0;
`;

const Text = styled.p<{
  $color?: string;
  $mb?: number;
  $fontSize?: string;
  $fontWeight?: string;
}>`
  color: ${(props) => (props.$color === 'red.500' ? '#E53E3E' : props.$color === 'gray.500' ? '#718096' : 'inherit')};
  margin-bottom: ${(props) => (props.$mb ? `${props.$mb * 4}px` : '0')};
  font-size: ${(props) => (props.$fontSize === 'xs' ? '12px' : props.$fontSize === 'sm' ? '14px' : '16px')};
  font-weight: ${(props) => (props.$fontWeight === 'bold' ? '700' : '400')};
  margin-top: 0;
`;

const TruncatedText = styled(Text)<{ $maxWidth?: string }>`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: ${(props) => props.$maxWidth || '300px'};
`;

const StyledButton = styled.button<{ $size?: string; $isLoading?: boolean }>`
  background-color: #3182ce;
  color: white;
  border: none;
  border-radius: 4px;
  padding: ${(props) => (props.$size === 'sm' ? '6px 12px' : '8px 16px')};
  font-size: ${(props) => (props.$size === 'sm' ? '14px' : '16px')};
  cursor: pointer;
  opacity: ${(props) => (props.$isLoading ? 0.7 : 1)};

  &:hover {
    background-color: #2b6cb0;
  }
`;

const VerticalStack = styled.div<{ $spacing?: number }>`
  display: flex;
  flex-direction: column;
  gap: ${(props) => (props.$spacing ? `${props.$spacing * 4}px` : '0')};
  width: 100%;
`;

const Box = styled.div<{ $textAlign?: string }>`
  text-align: ${(props) => props.$textAlign || 'left'};
`;

const Badge = styled.span`
  background-color: #63b3ed;
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 8px;
`;

const TokenCard = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px;
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div<{ $size?: string }>`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3182ce;
  border-radius: 50%;
  width: ${(props) => (props.$size === 'xl' ? '50px' : '30px')};
  height: ${(props) => (props.$size === 'xl' ? '50px' : '30px')};
  animation: ${spin} 1s linear infinite;
`;

export const TokenBalances = () => {
  const [authToken] = useAtom(authTokenAtom);
  const chainId = useChainId();

  const {
    data: tokenBalances,
    isLoading: loading,
    error,
    refetchTokenBalances,
  } = useTokenBalances({
    chainId,
  });

  if (!authToken) {
    return (
      <CardContainer>
        <Text>Please sign in to view your token balances</Text>
      </CardContainer>
    );
  }

  const HeaderComponent = (
    <FlexContainer $justifyContent="space-between" $alignItems="center" $mb={4}>
      <Heading $size="md">My Token Balances</Heading>
      <FlexContainer>
        <StyledButton $size="sm" $isLoading={loading} onClick={() => refetchTokenBalances()}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </StyledButton>
      </FlexContainer>
    </FlexContainer>
  );

  if (loading) {
    return (
      <CardContainer>
        {HeaderComponent}
        <FlexContainer $justifyContent="center" $py={8}>
          <Spinner $size="xl" />
        </FlexContainer>
      </CardContainer>
    );
  }

  if (error) {
    return (
      <CardContainer>
        {HeaderComponent}
        <FlexContainer $direction="column" $alignItems="center" $py={6}>
          <Text $color="red.500" $mb={3}>
            {error instanceof Error ? error.message : String(error)}
          </Text>
        </FlexContainer>
      </CardContainer>
    );
  }

  if (!tokenBalances || tokenBalances.length === 0) {
    return (
      <CardContainer>
        {HeaderComponent}
        <FlexContainer $direction="column" $alignItems="center" $justifyContent="center" $py={6}>
          <Text $mb={2}>No tokens found for this address</Text>
          <Text $fontSize="sm" $color="gray.500">
            This could be because the address has no tokens or verify you are using the correct chain
          </Text>
        </FlexContainer>
      </CardContainer>
    );
  }

  // Success state - tokens found
  return (
    <CardContainer>
      {HeaderComponent}
      <VerticalStack $spacing={3}>
        {tokenBalances.map((token: TokenData, index: number) => (
          <TokenCard key={index}>
            <FlexContainer $justifyContent="space-between" $alignItems="center">
              <Box>
                <FlexContainer $alignItems="center" $mb={1}>
                  <Heading $size="sm">{token.name || 'Unknown Token'}</Heading>
                  <Badge>{token.symbol}</Badge>
                </FlexContainer>
                <TruncatedText $fontSize="xs" $color="gray.500" $maxWidth="300px">
                  {token.contractAddress}
                </TruncatedText>
              </Box>
              <Box $textAlign="right">
                <Text $fontWeight="bold">{token.formattedBalance}</Text>
              </Box>
            </FlexContainer>
          </TokenCard>
        ))}
      </VerticalStack>
    </CardContainer>
  );
};
