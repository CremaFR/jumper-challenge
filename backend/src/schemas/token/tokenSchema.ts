import { z } from 'zod';

export const tokenBalanceQuerySchema = z.object({
  chainId: z
    .string()
    .optional()
    .refine(
      (val) => !val || !isNaN(parseInt(val)),
      { message: 'chainId must be a valid number' }
    )
    .transform((val) => (val ? parseInt(val) : 1))
});

export type TokenBalanceQueryType = z.infer<typeof tokenBalanceQuerySchema>;


// Response schema for token data
export const tokenDataSchema = z.object({
  contractAddress: z.string(),
  balance: z.string(),
  decimals: z.number().nullable(),
  name: z.string().nullable(),
  symbol: z.string().nullable(),
  formattedBalance: z.string().nullable(),
});

export type TokenDataType = z.infer<typeof tokenDataSchema>;
