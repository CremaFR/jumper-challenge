'use client'

import { useState } from 'react'
import styled from 'styled-components'
import { useAtom } from 'jotai'
import { useSignMessage, useAccount } from 'wagmi'
import { authTokenAtom } from '@/app/hooks/atoms/authAtoms'
import { verifySignature } from '@/api/auth' // Import the new function

const SignInButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #2563eb;
  color: white;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
  border: none;
  cursor: pointer;
  margin-top: 1rem;

  &:hover {
    background-color: #1d4ed8;
  }

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: #ef4444;
  margin-top: 0.5rem;
`;

const SuccessMessage = styled.p`
  color: #10b981;
  margin-top: 0.5rem;
`;

export function SignIn() {
  const { address, isConnected } = useAccount()
  const [authToken, setAuthToken] = useAtom(authTokenAtom)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  
  const { signMessageAsync } = useSignMessage()

  const handleSignIn = async () => {
    if (!isConnected || !address) {
      setError('Please connect your wallet first')
      return
    }

    setError('')
    setIsLoading(true)
    setIsSuccess(false)

    try {
      // Todo replace with your siwe
      const message = `Sign this message to authenticate to this explorer. Nonce: ${Date.now()}`
      
      let signature;
      try {
        signature = await signMessageAsync({ 
          message 
        })
        
      } catch (signingError) {
        console.error('Wallet signing error:', signingError);
        setError('Wallet signature request was rejected. Please try again.');
        setIsLoading(false);
        return;
      }

      if (!signature) {
        throw new Error('No signature received');
      }

      const data = await verifySignature(address, message, signature);
      
      setAuthToken(data.token)
      setIsSuccess(true)
    } catch (err) {
      console.error('Signature verification error:', err)
      setError(err?.message || 'Failed to verify signature. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <SignInButton 
        onClick={handleSignIn} 
        disabled={!isConnected || isLoading || !!authToken}
      >
        {isLoading ? 'Signing...' : authToken ? 'Signed In' : 'Sign In'}
      </SignInButton>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {isSuccess && <SuccessMessage>Successfully authenticated!</SuccessMessage>}
    </>
  )
}