import { z } from 'zod';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

export const leaderboardRegistry = new OpenAPIRegistry();

// Schema for a single leaderboard entry
export const leaderboardEntrySchema = z.object({
  id: z.number(),
  address: z.string(),
  chainId: z.number(),
  points: z.number(),
  logins: z.number(),
  lastLogin: z.string().datetime(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Schema for the GET /api/leaderboard response
export const leaderboardResponseSchema = z.object({
  entries: z.array(leaderboardEntrySchema),
  total: z.number(),
});

// Schema for the GET /api/leaderboard/me response
export const userRankResponseSchema = z.object({
  user: leaderboardEntrySchema,
  rank: z.number(),
});
