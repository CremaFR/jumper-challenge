import express, { Router } from 'express';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { validateRequest } from '@/common/utils/httpHandlers';
import { nonceController, siweVerifyController, sessionController } from '@/controllers/authController';
import { authResponseSchema, nonceResponseSchema, siweVerifyRequestSchema } from '@/schemas/auth/authSchema';

export const authRegistry = new OpenAPIRegistry();

export const authRouter: Router = (() => {
  const router = express.Router();

  // SIWE Nonce endpoint
  authRegistry.registerPath({
    method: 'get',
    path: '/api/auth/nonce',
    tags: ['Auth'],
    responses: {
      ...createApiResponse(nonceResponseSchema, 'Success'),
      ...createApiResponse(z.null(), 'Internal Server Error', 500)
    },
  });

  router.get('/api/auth/nonce', nonceController);

  // SIWE Verify endpoint
  authRegistry.registerPath({
    method: 'post',
    path: '/api/auth/siwe',
    tags: ['Auth'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: siweVerifyRequestSchema,
          },
        },
      },
    },
    responses: {
      ...createApiResponse(authResponseSchema, 'Success'),
      ...createApiResponse(z.null(), 'Bad Request - Invalid input or signature', 400),
      ...createApiResponse(z.null(), 'Unauthorized', 401),
      ...createApiResponse(z.null(), 'Internal Server Error - Authentication failed', 500)
    },
  });

  router.post('/api/auth/siwe', validateRequest({ body: siweVerifyRequestSchema }), siweVerifyController);

  // Session verification endpoint
  authRegistry.registerPath({
    method: 'get',
    path: '/api/auth/session',
    tags: ['Auth'],
    responses: {
      ...createApiResponse(authResponseSchema, 'Success'),
      ...createApiResponse(z.null(), 'Unauthorized - No valid session found', 401),
      ...createApiResponse(z.null(), 'Internal Server Error - Session verification failed', 500)
    },
  });

  router.get('/api/auth/session', sessionController);

  return router;
})();
