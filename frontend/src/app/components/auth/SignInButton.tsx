'use client'

import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useAtom } from 'jotai'
import { useSignMessage, useAccount, useChainId } from 'wagmi'
import { authTokenAtom } from '@/app/hooks/atoms/authAtoms'
import { getNonce, createSiweMessage, verifySiweSignature, verifySession } from '@/api/auth'

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
  const chainId = useChainId()
  const [authToken, setAuthToken] = useAtom(authTokenAtom)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  
  const { signMessageAsync } = useSignMessage()

  // Check for existing session on component mount
  useEffect(() => {
    const checkSession = async () => {
      if (authToken) {
        try {
          await verifySession(authToken)
          setIsSuccess(true)
        } catch (err) {
          // If session validation fails, clear the token
          console.error('Session validation error:', err)
          setAuthToken(null)
        }
      }
    }
    
    checkSession()
  }, [authToken, setAuthToken])

  const handleSignIn = async () => {
    if (!isConnected || !address) {
      setError('Please connect your wallet first')
      return
    }

    setError('')
    setIsLoading(true)
    setIsSuccess(false)

    try {
      // Step 1: Get a nonce from the server
      const nonce = await getNonce()
      
      // Step 2: Create a SIWE message with the nonce
      const message = createSiweMessage(
        address,
        chainId,
        nonce
      )
      
      // Step 3: Ask the user to sign the message
      let signature
      try {
        signature = await signMessageAsync({ 
          message 
        })
      } catch (signingError) {
        console.error('Wallet signing error:', signingError)
        setError('Wallet signature request was rejected. Please try again.')
        setIsLoading(false)
        return
      }

      if (!signature) {
        throw new Error('No signature received')
      }

      // Step 4: Verify the signature with the backend
      const data = await verifySiweSignature(message, signature)
      
      // Step 5: Store the JWT token
      setAuthToken(data.responseObject.token)
      setIsSuccess(true)
    } catch (err) {
      console.error('SIWE authentication error:', err)
      setError(err instanceof Error ? err.message : 'Failed to authenticate. Please try again.')
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
        {isLoading ? 'Signing...' : authToken ? 'Signed In' : 'Sign In with Ethereum'}
      </SignInButton>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {isSuccess && <SuccessMessage>Successfully authenticated with Ethereum!</SuccessMessage>}
    </>
  )
}