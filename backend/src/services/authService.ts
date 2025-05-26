import { verifySignature } from '@/common/utils/signature';
import jwt from 'jsonwebtoken';
import { env } from '@/common/utils/envConfig';
import { ServiceResponse, ResponseStatus } from '@/common/models/serviceResponse';
import { StatusCodes } from 'http-status-codes';

/**
 * Verifies the user's signature and generates a JWT token.
 * 
 * @param address - The user's address.
 * @param message - The message signed by the user.
 * @param signature - The signature to verify.
 * @returns A ServiceResponse containing the JWT token or an error message.
 */
export const verify = async (address: string, message: string, signature: string) => {
  const isValid = verifySignature(address, message, signature);

  if (!isValid) {
    return new ServiceResponse<null>(
      ResponseStatus.Failed,
      'Invalid signature',
      null,
      StatusCodes.UNAUTHORIZED
    );
  }

  const token = jwt.sign({ address }, env.JWT_SECRET, { expiresIn: '1h' });

  return new ServiceResponse(
    ResponseStatus.Success,
    'Token generated successfully',
    { token },
    StatusCodes.OK
  );
};