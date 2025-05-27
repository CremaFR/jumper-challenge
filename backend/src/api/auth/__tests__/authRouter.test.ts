import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { app } from '@/server';
import * as authService from '@/services/authService';

// Mock the SIWE module
vi.mock('siwe', () => {
  return {
    SiweMessage: vi.fn().mockImplementation((message) => {
      return {
        nonce: 'test-nonce-123',
        address: '0x0b20714db725d69912A92270d8495BAde2B4A54E',
        chainId: 1,
        domain: 'localhost',
        issuedAt: new Date().toISOString(),
        prepareMessage: vi.fn().mockReturnValue(message || 'Test SIWE message'),
        verify: vi.fn().mockResolvedValue({
          success: message !== 'invalid',
          data: {},
        }),
      };
    }),
  };
});

describe('Auth API endpoints', () => {
  beforeEach(() => {
    // Mock the generateNonce service method
    vi.spyOn(authService, 'generateNonce').mockResolvedValue({
      success: true,
      message: 'Nonce generated successfully',
      responseObject: { nonce: 'test-nonce-123' },
      statusCode: StatusCodes.OK,
    } as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('GET /api/auth/nonce', () => {
    it('should return a nonce', async () => {
      const response = await request(app).get('/api/auth/nonce');

      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body).toEqual({
        success: true,
        message: 'Nonce generated successfully',
        responseObject: {
          nonce: 'test-nonce-123',
        },
        statusCode: StatusCodes.OK,
      });
    });
  });

  describe('POST /api/auth/siwe', () => {
    it('should return 200 for a valid SIWE message and signature', async () => {
      // Mock the verifySiwe service method for this test
      vi.spyOn(authService, 'verifySiwe').mockResolvedValueOnce({
        success: true,
        message: 'Authentication successful',
        responseObject: { token: 'test-jwt-token' },
        statusCode: StatusCodes.OK,
      } as any);

      const response = await request(app).post('/api/auth/siwe').send({
        message: 'Valid SIWE message',
        signature:
          '0x37dd2a9f04b9f67fd98674a875482593043478970a5ef3a62ce312708c8d0a626e7e6d8d7f47e21b6adf7b077aae01c680f73afacab0107289c734c7ff9fded41c',
      });

      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body).toEqual({
        success: true,
        message: 'Authentication successful',
        responseObject: {
          token: 'test-jwt-token',
        },
        statusCode: StatusCodes.OK,
      });
    });

    it('should return 401 for an invalid SIWE message', async () => {
      const response = await request(app).post('/api/auth/siwe').send({
        message: 'invalid',
        signature:
          '0x37dd2a9f04b9f67fd98674a875482593043478970a5ef3a62ce312708c8d0a626e7e6d8d7f47e21b6adf7b077aae01c680f73afacab0107289c734c7ff9fded41c',
      });

      expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.body).toEqual({
        success: false,
        message: 'Invalid SIWE signature',
        responseObject: null,
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    });

    it('should return 400 for missing required fields', async () => {
      const response = await request(app).post('/api/auth/siwe').send({
        // Missing message
        signature:
          '0x37dd2a9f04b9f67fd98674a875482593043478970a5ef3a62ce312708c8d0a626e7e6d8d7f47e21b6adf7b077aae01c680f73afacab0107289c734c7ff9fded41c',
      });

      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Required');
    });
  });

  describe('GET /api/auth/session', () => {
    it('should return 200 for a valid session', async () => {
      // Mock the verifySession service method for this test
      vi.spyOn(authService, 'verifySession').mockResolvedValueOnce({
        success: true,
        message: 'Valid session',
        responseObject: {
          token: 'test-jwt-token',
          user: { address: '0x0b20714db725d69912A92270d8495BAde2B4A54E' },
        },
        statusCode: StatusCodes.OK,
      } as any);

      const response = await request(app).get('/api/auth/session').set('Authorization', 'Bearer test-jwt-token');

      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body).toEqual({
        success: true,
        message: 'Valid session',
        responseObject: {
          token: 'test-jwt-token',
          user: { address: '0x0b20714db725d69912A92270d8495BAde2B4A54E' },
        },
        statusCode: StatusCodes.OK,
      });
    });

    it('should return 401 for an invalid session token', async () => {
      const response = await request(app).get('/api/auth/session').set('Authorization', 'Bearer invalid-token');

      expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.body).toEqual({
        success: false,
        message: 'Invalid or expired session',
        responseObject: null,
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    });

    it('should return 401 when no token is provided', async () => {
      const response = await request(app).get('/api/auth/session');

      expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.body.success).toBe(false);
    });
  });
});
