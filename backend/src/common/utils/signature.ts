import { ethers } from 'ethers';

/**
 * Verifies that a message was signed by the given address
 * 
 * @param address The Ethereum address that supposedly signed the message
 * @param message The original message that was signed
 * @param signature The signature to verify
 * @returns boolean indicating if the signature is valid
 */
export const verifySignature = (address: string, message: string, signature: string): boolean => {
  const signerAddress = ethers.verifyMessage(message, signature);
  return signerAddress.toLowerCase() === address.toLowerCase();
};