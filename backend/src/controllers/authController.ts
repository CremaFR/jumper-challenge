import { Request, Response } from 'express';
import { z } from 'zod';
import { verify } from '@/services/authService';
import { handleServiceResponse } from '@/common/utils/httpHandlers';
import { ServiceResponse, ResponseStatus } from '@/common/models/serviceResponse';
import { StatusCodes } from 'http-status-codes';
import { VerifyRequestBody } from '@/schemas/auth/authSchema';


/**
 * Controller for handling the verification of a user's signature.
 *
 * @param req - The request object containing the user's address, message, and signature.
 * @param res - The response object to send back the result.
 */
export const verifyController = async (req: Request<{}, {}, VerifyRequestBody>, res: Response) => {
  try {
    const { address, message, signature } = req.body;

    const serviceResponse = await verify(address, message, signature);

    return handleServiceResponse(serviceResponse, res);
  } catch (error) {
    console.error('Unexpected error in verifyController:', error);
    const unexpectedErrorResponse = new ServiceResponse<null>(
      ResponseStatus.Failed,
      'An unexpected error occurred',
      null,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
    return handleServiceResponse(unexpectedErrorResponse, res);
  }
};
