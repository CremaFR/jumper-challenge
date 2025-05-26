import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ZodError, ZodSchema } from 'zod';

import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';

export const handleServiceResponse = (serviceResponse: ServiceResponse<any>, response: Response) => {
  return response.status(serviceResponse.statusCode).send(serviceResponse);
};

type RequestValidationSchemas = {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
};


/**
 * @dev updating this code to prevent body nesting when using zod schemas for OPENAPI documentation
 **/
export const validateRequest = (schemas: RequestValidationSchemas) => 
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) schemas.body.parse(req.body);
      if (schemas.query) schemas.query.parse(req.query);
      if (schemas.params) schemas.params.parse(req.params);
      next();
    } catch (err) {
      const errorMessage = `Invalid input: ${(err as ZodError).errors.map((e) => e.message).join(', ')}`;
      res.status(StatusCodes.BAD_REQUEST).send(
        new ServiceResponse<null>(ResponseStatus.Failed, errorMessage, null, StatusCodes.BAD_REQUEST)
      );
    }
  };
