import { config } from '@/config/env';

/**
 * Sends a signature verification request to the backend.
 * 
 * @param address - The user's Ethereum address
 * @param message - The original message that was signed
 * @param signature - The signature provided by the user's wallet
 * @returns The parsed JSON response from the backend if successful
 * @throws An error if the request fails or returns a non-OK status
 */
export async function verifySignature(address: string, message: string, signature: string) {
  const response = await fetch(`${config.apiUrl}/api/auth/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      address,
      message,
      signature,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to verify signature');
  }

  const data = await response.json();
  return data;
}