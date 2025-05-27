import { z } from 'zod';
import { isAddress } from 'ethers';

// Custom validation for Ethereum addresses
const ethAddressSchema = z.string().refine((address) => isAddress(address), {
  message: 'Invalid Ethereum address',
});

// Custom validation for Ethereum signatures - 130 hex characters for 65 bytes
const ethSignatureSchema = z.string().regex(/^0x([A-Fa-f0-9]{130})$/, {
  message: 'Invalid Ethereum signature',
});

// SIWE Schemas
export const nonceResponseSchema = z.object({
  nonce: z.string(),
});

export type NonceResponse = z.infer<typeof nonceResponseSchema>;

export const siweVerifyRequestSchema = z.object({
  message: z.string().min(1, { message: 'SIWE message is required' }),
  signature: ethSignatureSchema,
});

export type SiweVerifyRequestBody = z.infer<typeof siweVerifyRequestSchema>;

// Session check schema
export const sessionRequestSchema = z.object({
  address: ethAddressSchema.optional(),
});

export type SessionRequestBody = z.infer<typeof sessionRequestSchema>;

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
