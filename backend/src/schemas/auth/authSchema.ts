import { z } from 'zod';

import { isAddress } from 'ethers';

// Custom validation for Ethereum addresses
const ethAddressSchema = z.string().refine((address) => isAddress(address), {
  message: 'Invalid Ethereum address',
});

// Custom validation for Ethereum signatures
const ethSignatureSchema = z.string().regex(/^0x([A-Fa-f0-9]{130})$/, {
  message: 'Invalid Ethereum signature',
});

// Define the request schema
export const verifyRequestSchema = z.object({
  address: ethAddressSchema,
  message: z.string().min(1, { message: 'Message is required' }),
  signature: ethSignatureSchema,
});

export type VerifyRequestBody = z.infer<typeof verifyRequestSchema>;


export const authResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  responseObject: z
    .object({
      token: z.string(),
    })
    .nullable(), // responseObject can be null for error cases
  statusCode: z.number(),
});

export type AuthResponse = z.infer<typeof authResponseSchema>;