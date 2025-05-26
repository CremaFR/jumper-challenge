import express, { Router } from 'express';
import { z } from 'zod';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { StatusCodes } from 'http-status-codes';

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { validateRequest } from '@/common/utils/httpHandlers';
import { verifyController } from '@/controllers/authController';
import { authResponseSchema, verifyRequestSchema } from '@/schemas/auth/authSchema';

export const authRegistry = new OpenAPIRegistry();

export const authRouter: Router = (() => {
  const router = express.Router();

  authRegistry.registerPath({
    method: 'post',
    path: '/api/auth/verify',
    tags: ['Auth'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: verifyRequestSchema,
          },
        },
      },
    },
    responses: createApiResponse(authResponseSchema, 'Success'),
  });

  router.post('/api/auth/verify', validateRequest({ body: verifyRequestSchema }), verifyController);

  return router;
})();
