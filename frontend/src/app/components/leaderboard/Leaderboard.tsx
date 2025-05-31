import React, { useState } from 'react';
import styled from 'styled-components';
import { useLeaderboard, useUserRank } from '@/app/hooks/useLeaderboard';
import { useAtomValue } from 'jotai';
import { authTokenAtom } from '@/app/hooks/atoms/authAtoms';
import { truncateAddress } from '@/app/utils/address';

const LeaderboardContainer = styled.div`
  width: 100%;
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
`;

const UserRankCard = styled.div`
  background-color: #e6f7ff;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-left: 4px solid #1890ff;
`;

const RankNumber = styled.div<{ rank: number }>`
  font-size: 20px;
  font-weight: bold;
  color: ${props => {
    if (props.rank === 1) return '#ffd700'; // Gold
    if (props.rank === 2) return '#c0c0c0'; // Silver
    if (props.rank === 3) return '#cd7f32'; // Bronze
    return '#333';
  }};
`;

const Address = styled.div`
  font-size: 16px;
  font-weight: 500;
`;

const Points = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #1890ff;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background-color: #f0f0f0;
  th {
    padding: 12px;
    text-align: left;
    font-weight: 600;
    color: #333;
  }
`;

const TableBody = styled.tbody`
  tr:nth-child(even) {
    background-color: #f9f9f9;
  }
  
  tr:hover {
    background-color: #f0f8ff;
  }
  
  td {
    padding: 12px;
    border-bottom: 1px solid #eee;
  }
`;

const RankCell = styled.td<{ rank: number }>`
  font-weight: bold;
  color: ${props => {
    if (props.rank === 1) return '#ffd700'; // Gold
    if (props.rank === 2) return '#c0c0c0'; // Silver
    if (props.rank === 3) return '#cd7f32'; // Bronze
    return '#333';
  }};
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 10px;
`;

const PaginationButton = styled.button<{ active?: boolean }>`
  padding: 8px 12px;
  border: 1px solid #ddd;
  background-color: ${props => props.active ? '#1890ff' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.active ? '#1890ff' : '#f0f0f0'};
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #888;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #ff4d4f;
`;

const ITEMS_PER_PAGE = 10;

export const Leaderboard: React.FC = () => {
  const [page, setPage] = useState(0);
  const token = useAtomValue(authTokenAtom);
  
  const { data: leaderboardData, isLoading, error } = useLeaderboard(ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const { data: userRankData } = useUserRank();
  
  if (isLoading) {
    return <LoadingMessage>Loading leaderboard data...</LoadingMessage>;
  }
  
  if (error || !leaderboardData) {
    return <ErrorMessage>Error loading leaderboard data</ErrorMessage>;
  }
  
  const { entries, total } = leaderboardData;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <LeaderboardContainer>
      <Title>Leaderboard</Title>
      
      {userRankData && (
        <UserRankCard>
          <RankNumber rank={userRankData.rank}>#{userRankData.rank}</RankNumber>
          <Address>{truncateAddress(userRankData.user.address)}</Address>
          <Points>{userRankData.user.points} points</Points>
        </UserRankCard>
      )}
      
      <Table>
        <TableHeader>
          <tr>
            <th>Rank</th>
            <th>Address</th>
            <th>Points</th>
            <th>Logins</th>
          </tr>
        </TableHeader>
        <TableBody>
          {entries.map((entry, index) => {
            const rank = page * ITEMS_PER_PAGE + index + 1;
            return (
              <tr key={entry.id}>
                <RankCell rank={rank}>#{rank}</RankCell>
                <td>{truncateAddress(entry.address)}</td>
                <td>{entry.points}</td>
                <td>{entry.logins}</td>
              </tr>
            );
          })}
        </TableBody>
      </Table>
      
      {totalPages > 1 && (
        <Pagination>
          <PaginationButton 
            onClick={() => setPage(p => Math.max(0, p - 1))} 
            disabled={page === 0}
          >
            Previous
          </PaginationButton>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = page < 2 ? i : page - 2 + i;
            if (pageNum >= totalPages) return null;
            
            return (
              <PaginationButton 
                key={pageNum} 
                active={pageNum === page}
                onClick={() => setPage(pageNum)}
              >
                {pageNum + 1}
              </PaginationButton>
            );
          })}
          
          <PaginationButton 
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} 
            disabled={page >= totalPages - 1}
          >
            Next
          </PaginationButton>
        </Pagination>
      )}
    </LeaderboardContainer>
  );
};
