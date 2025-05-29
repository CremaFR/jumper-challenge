import express, { Router } from 'express';
import { tokenBalanceQuerySchema, tokenDataSchema } from '@/schemas/token/tokenSchema';
import { getUserTokenBalances } from '@/controllers/tokenController';
import { requireAuth } from '@/common/middleware/authMiddleware';
import { validateRequest } from '@/common/utils/httpHandlers';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';

export const tokenRegistry = new OpenAPIRegistry();
export const tokenRouter: Router = (() => {
const router = express.Router();

tokenRegistry.registerPath({
  method: 'get',
  path: '/api/tokens/balances',
  summary: 'Get token balances for the authenticated user',
  tags: ['Tokens'],
  security: [{ bearerAuth: [] }],
  parameters: [
    {
      name: 'chainId',
      in: 'query',
      required: false,
      schema: { type: 'string' },
      description: 'Chain ID to query (defaults to 1 if not provided)'
    }
  ],
  responses: {
    ...createApiResponse(
      z.object({
        address: z.string().describe("The user's Ethereum address"),
        chainId: z.number().describe('The chain ID used for the query'),
        tokens: z.array(tokenDataSchema).describe('Array of token balances'),
      }),
      'Successfully retrieved token balances',
      200
    ),
    ...createApiResponse(z.null(), 'Unauthorized or invalid token', 401),
    ...createApiResponse(z.null(), 'Server error', 500),
  },
});

router.get('/balances', requireAuth, validateRequest({ query: tokenBalanceQuerySchema }), getUserTokenBalances);
  return router;

})();
