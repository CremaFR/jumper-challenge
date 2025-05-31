import { verifySignature } from '@/common/utils/signature';
import jwt from 'jsonwebtoken';
import { env } from '@/common/utils/envConfig';
import { ServiceResponse, ResponseStatus } from '@/common/models/serviceResponse';
import { StatusCodes } from 'http-status-codes';
import { SiweMessage } from 'siwe';
import crypto from 'crypto';
import { UserJwtPayload } from '@/types/express';
import { updateLeaderboardEntry } from '@/services/leaderboardService';

// Todo : add a DB? 🤔
const nonceStore = new Map<string, { nonce: string; createdAt: number }>();

// Nonce expiration time (10 minutes)
const NONCE_EXPIRATION = 10 * 60 * 1000;

/**
 * Generates a new nonce for SIWE authentication.
 *
 * @returns A ServiceResponse containing the generated nonce.
 */
export const generateNonce = async () => {
  const nonce = crypto.randomBytes(32).toString('hex');

  const nonceData = { nonce, createdAt: Date.now() };

  nonceStore.set(nonce, nonceData);

  // Clean up expired nonces - should be a CRON or whatever but works fine here for simplicity
  cleanupExpiredNonces();

  return new ServiceResponse(ResponseStatus.Success, 'Nonce generated successfully', { nonce }, StatusCodes.OK);
};

/**
 * Verifies a SIWE message and generates a JWT token.
 *
 * @param message - The SIWE message string.
 * @param signature - The signature to verify.
 * @returns A ServiceResponse containing the JWT token or an error message.
 */
export const verifySiwe = async (message: string, signature: string) => {
  try {
    const siweMessage = new SiweMessage(message);

    // Verify the SIWE message
    const { success, data: validateData } = await siweMessage.verify({
      signature,
    });

    if (!success) {
      return new ServiceResponse<null>(ResponseStatus.Failed, 'Invalid SIWE signature', null, StatusCodes.UNAUTHORIZED);
    }

    cleanupExpiredNonces();

    // Check if we have the nonce stored and it's not expired
    const nonceData = nonceStore.get(siweMessage.nonce);
    const now = Date.now();

    if (!nonceData || now - nonceData.createdAt > NONCE_EXPIRATION) {
      return new ServiceResponse<null>(
        ResponseStatus.Failed,
        'Invalid or expired nonce',
        null,
        StatusCodes.UNAUTHORIZED
      );
    }

    // Nonce is valid, so we can remove it from the store to prevent reuse
    nonceStore.delete(siweMessage.nonce);

    // Generate JWT token
    const token = jwt.sign(
      {
        address: siweMessage.address,
        chainId: siweMessage.chainId,
        issuedAt: siweMessage.issuedAt,
        domain: siweMessage.domain,
      },
      env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Update the leaderboard when user authenticates
    await updateLeaderboardEntry(siweMessage.address, siweMessage.chainId);

    return new ServiceResponse(ResponseStatus.Success, 'Authentication successful', { token }, StatusCodes.OK);
  } catch (error) {
    console.error('SIWE verification error:', error);
    return new ServiceResponse<null>(ResponseStatus.Failed, 'Invalid SIWE signature', null, StatusCodes.UNAUTHORIZED);
  }
};

/**
 * Verifies a session token and checks if it's still valid.
 *
 * @param token - The JWT token to verify.
 * @returns A ServiceResponse containing the session data or an error message.
 */
export const verifySession = (token: string) => {
  try {
    if (!token) {
      return new ServiceResponse<null>(ResponseStatus.Failed, 'No token provided', null, StatusCodes.UNAUTHORIZED);
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, env.JWT_SECRET) as UserJwtPayload;

    return new ServiceResponse(ResponseStatus.Success, 'Valid session', { token, user: decoded }, StatusCodes.OK);
  } catch (error) {
    return new ServiceResponse<null>(
      ResponseStatus.Failed,
      'Invalid or expired session',
      null,
      StatusCodes.UNAUTHORIZED
    );
  }
};

/**
 * Utility function to clean up expired nonces from the store.
 */
const cleanupExpiredNonces = () => {
  const now = Date.now();

  for (const [nonce, data] of nonceStore.entries()) {
    if (now - data.createdAt > NONCE_EXPIRATION) {
      nonceStore.delete(nonce);
    }
  }
};
