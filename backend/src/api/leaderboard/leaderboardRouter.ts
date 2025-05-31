import express, { Router } from 'express';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { getLeaderboardController, getUserRankController } from '@/controllers/leaderboardController';
import { 
  leaderboardResponseSchema, 
  userRankResponseSchema
} from '@/schemas/leaderboard/leaderboardSchema';
import { requireAuth } from '@/common/middleware/authMiddleware';

export const leaderboardRegistry = new OpenAPIRegistry();

export const leaderboardRouter: Router = (() => {
  const router = express.Router();

  leaderboardRegistry.registerPath({
    method: 'get',
    path: '/api/leaderboard',
    tags: ['Leaderboard'],
    parameters: [
      {
        name: 'limit',
        in: 'query',
        description: 'Maximum number of entries to return',
        schema: {
          type: 'integer',
          default: 10,
        },
        required: false,
      },
      {
        name: 'offset',
        in: 'query',
        description: 'Number of entries to skip for pagination',
        schema: {
          type: 'integer',
          default: 0,
        },
        required: false,
      },
    ],
    responses: {
      ...createApiResponse(leaderboardResponseSchema, 'Success'),
      ...createApiResponse(z.null(), 'Internal Server Error', 500),
    },
  });

  router.get('/api/leaderboard', getLeaderboardController);

  // GET /api/leaderboard/me - Get current user's rank
  leaderboardRegistry.registerPath({
    method: 'get',
    path: '/api/leaderboard/me',
    tags: ['Leaderboard'],
    security: [{ bearerAuth: [] }],
    responses: {
      ...createApiResponse(userRankResponseSchema, 'Success'),
      ...createApiResponse(z.null(), 'Unauthorized - No valid session found', 401),
      ...createApiResponse(z.null(), 'Not Found - User not on leaderboard', 404),
      ...createApiResponse(z.null(), 'Internal Server Error', 500),
    },
  });

  router.get('/api/leaderboard/me', requireAuth, getUserRankController);

  return router;
})();
