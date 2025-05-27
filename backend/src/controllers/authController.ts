import { Request, Response } from 'express';
import { generateNonce, verifySiwe, verifySession } from '@/services/authService';
import { handleServiceResponse } from '@/common/utils/httpHandlers';
import { ServiceResponse, ResponseStatus } from '@/common/models/serviceResponse';
import { StatusCodes } from 'http-status-codes';
import { SiweVerifyRequestBody } from '@/schemas/auth/authSchema';

/**
 * Controller for generating a nonce for SIWE authentication.
 *
 * @param req - The request object.
 * @param res - The response object to send back the nonce.
 */
export const nonceController = async (req: Request, res: Response) => {
  try {
    const serviceResponse = await generateNonce();
    return handleServiceResponse(serviceResponse, res);
  } catch (error) {
    console.error('Unexpected error in nonceController:', error);
    const unexpectedErrorResponse = new ServiceResponse<null>(
      ResponseStatus.Failed,
      'An unexpected error occurred',
      null,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
    return handleServiceResponse(unexpectedErrorResponse, res);
  }
};

/**
 * Controller for verifying a SIWE message and signature.
 *
 * @param req - The request object containing the SIWE message and signature.
 * @param res - The response object to send back the result.
 */
export const siweVerifyController = async (req: Request<{}, {}, SiweVerifyRequestBody>, res: Response) => {
  try {
    const { message, signature } = req.body;

    const serviceResponse = await verifySiwe(message, signature);

    return handleServiceResponse(serviceResponse, res);
  } catch (error) {
    console.error('Unexpected error in siweVerifyController:', error);
    const unexpectedErrorResponse = new ServiceResponse<null>(
      ResponseStatus.Failed,
      'An unexpected error occurred',
      null,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
    return handleServiceResponse(unexpectedErrorResponse, res);
  }
};

/**
 * Controller for verifying a session token.
 *
 * @param req - The request object.
 * @param res - The response object to send back the result.
 */
export const sessionController = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : '';

    const serviceResponse = await verifySession(token);

    return handleServiceResponse(serviceResponse, res);
  } catch (error) {
    console.error('Unexpected error in sessionController:', error);
    const unexpectedErrorResponse = new ServiceResponse<null>(
      ResponseStatus.Failed,
      'An unexpected error occurred',
      null,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
    return handleServiceResponse(unexpectedErrorResponse, res);
  }
};
