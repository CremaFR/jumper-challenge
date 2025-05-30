import styled from 'styled-components';
import { useChainId, useSwitchChain } from 'wagmi';
import { mainnet, sepolia, polygon } from 'wagmi/chains';

const SelectContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const StyledSelect = styled.select`
  appearance: none;
  background-color: #edf2f7;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  color: #4a5568;
  cursor: pointer;
  font-size: 14px;
  padding: 6px 24px 6px 12px;
  transition: all 0.2s;

  &:hover {
    background-color: #e2e8f0;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.5);
  }
`;

const Arrow = styled.span`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #718096;
`;

// Network map with chainId to name mapping
const NETWORKS = [
  { id: mainnet.id, name: 'Ethereum', chain: mainnet },
  { id: sepolia.id, name: 'Sepolia', chain: sepolia },
  { id: polygon.id, name: 'Polygon', chain: polygon },
];

export const NetworkSelector = () => {
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const handleNetworkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newChainId = Number(e.target.value);
    if (newChainId !== chainId) {
      const network = NETWORKS.find((n) => n.id === newChainId);
      if (network) {
        switchChain({ chainId: newChainId });
      }
    }
  };

  return (
    <SelectContainer>
      <StyledSelect value={chainId} onChange={handleNetworkChange}>
        {NETWORKS.map((network) => (
          <option key={network.id} value={network.id}>
            {network.name}
          </option>
        ))}
      </StyledSelect>
      <Arrow>▼</Arrow>
    </SelectContainer>
  );
};
