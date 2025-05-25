'use client'

import { useState } from 'react'
import { createConfig } from 'wagmi'
import styled from 'styled-components'

// We need to receive the config as a prop since it's defined in the parent
type MetaMaskConnectProps = {
  config: ReturnType<typeof createConfig>
}

// Styled components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const ErrorMessage = styled.p`
  color: #ef4444;
`;

const ConnectButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #f97316;
  color: white;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #ea580c;
  }
`;

const AccountContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const AccountInfo = styled.p`
  text-align: center;
`;

const DisconnectButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #dc2626;
  color: white;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #b91c1c;
  }
`;

export function MetaMaskConnect({ config }: MetaMaskConnectProps) {
  const [connected, setConnected] = useState(false)
  const [account, setAccount] = useState('')
  const [error, setError] = useState('')

  const connectMetaMask = async () => {
    try {
      setError('')
      
      // Check if MetaMask is installed
      if (!window.ethereum || !window.ethereum.isMetaMask) {
        setError('MetaMask is not installed. Please install MetaMask to continue.')
        return
      }
      
      // Use the injected connector which is now targeting MetaMask
      const connector = config.connectors[0] 
      
      // Connect to MetaMask
      const result = await connector.connect()
      
      // Update state with account info
      setConnected(true)
      setAccount(result.accounts[0])
    } catch (err) {
      console.error('MetaMask connection error:', err)
      setError('Failed to connect to MetaMask. Please try again.')
    }
  }

  const disconnectMetaMask = async () => {
    try {
      const connector = config.connectors[0]
      await connector.disconnect()
      setConnected(false)
      setAccount('')
    } catch (err) {
      console.error('MetaMask disconnect error:', err)
    }
  }

  return (
    <Container>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {!connected ? (
        <ConnectButton onClick={connectMetaMask}>
          <span>Connect MetaMask</span>
        </ConnectButton>
      ) : (
        <AccountContainer>
          <AccountInfo>
            Connected: {account.slice(0, 6)}...{account.slice(-4)}
          </AccountInfo>
          <DisconnectButton onClick={disconnectMetaMask}>
            Disconnect
          </DisconnectButton>
        </AccountContainer>
      )}
    </Container>
  )
}