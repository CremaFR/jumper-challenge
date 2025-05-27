import { config } from "@/config/env";
import { SiweMessage } from "siwe";

/**
 * Fetches a nonce from the backend for SIWE authentication.
 *
 * @returns The nonce to be used in SIWE message creation
 * @throws An error if the request fails
 */
export async function getNonce() {
  const response = await fetch(`${config.apiUrl}/api/auth/nonce`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get nonce");
  }

  const data = await response.json();
  return data.responseObject.nonce;
}

/**
 * Creates a SIWE message for the user to sign.
 *
 * @param address - The user's Ethereum address
 * @param chainId - The chain ID of the connected network
 * @param nonce - The nonce from the server
 * @returns A formatted SIWE message
 */
export function createSiweMessage(
  address: string,
  chainId: number,
  nonce: string
) {
  const domain = window.location.host;
  const origin = window.location.origin;

  const message = new SiweMessage({
    domain,
    address,
    statement: "Sign in with Ethereum to the app.",
    uri: origin,
    version: "1",
    chainId,
    nonce,
  });

  return message.prepareMessage();
}

/**
 * Verifies a SIWE message and signature with the backend.
 *
 * @param message - The SIWE message string
 * @param signature - The signature from the user's wallet
 * @returns The parsed JSON response from the backend if successful
 * @throws An error if the request fails
 */
export async function verifySiweSignature(message: string, signature: string) {
  const response = await fetch(`${config.apiUrl}/api/auth/siwe`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      signature,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to verify SIWE signature");
  }

  const data = await response.json();
  return data;
}

/**
 * Verifies if the user has a valid session.
 *
 * @param token - The JWT token
 * @returns The parsed JSON response from the backend if successful
 * @throws An error if the request fails
 */
export async function verifySession(token: string) {
  const response = await fetch(`${config.apiUrl}/api/auth/session`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to verify session");
  }

  const data = await response.json();
  return data;
}

/**
 * Legacy function: Sends a signature verification request to the backend.
 *
 * @param address - The user's Ethereum address
 * @param message - The original message that was signed
 * @param signature - The signature provided by the user's wallet
 * @returns The parsed JSON response from the backend if successful
 * @throws An error if the request fails or returns a non-OK status
 */
export async function verifySignature(
  address: string,
  message: string,
  signature: string
) {
  const response = await fetch(`${config.apiUrl}/api/auth/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      address,
      message,
      signature,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to verify signature");
  }

  const data = await response.json();
  return data;
}
