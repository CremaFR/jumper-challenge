import { StatusCodes } from 'http-status-codes';
import request from 'supertest';

import { app } from '@/server';
import { AuthResponse } from '@/schemas/auth/authSchema';

describe('Auth API endpoints', () => {
  describe('POST /api/auth/verify', () => {
    it('should return 401 for an invalid signature', async () => {
      const response = await request(app)
        .post('/api/auth/verify')
        .send({
          address: '0x0b20714db725d69912A92270d8495BAde2B4A54E',
          message: 'Invalid message',
          signature: '0x37dd2a9f04b9f67fd98674a875482593043478970a5ef3a62ce312708c8d0a626e7e6d8d7f47e21b6adf7b077aae01c680f73afacab0107289c734c7ff9fded41c',
        });

      const result: AuthResponse = response.body;
console.log('%cbackend/src/api/auth/__tests__/authRouter.test.ts:19 result', 'color: #007acc;', result);
      expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
      expect(result).toEqual({
        success: false,
        message: 'Invalid signature',
        responseObject: null,
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    });

    it('should return 200 for a valid signature', async () => {
      const response = await request(app)
        .post('/api/auth/verify')
        .send({
          address: '0x0b20714db725d69912A92270d8495BAde2B4A54E',
          message: 'Sign this message to authenticate to this explorer. Nonce: 1748290067660',
          signature: '0x37dd2a9f04b9f67fd98674a875482593043478970a5ef3a62ce312708c8d0a626e7e6d8d7f47e21b6adf7b077aae01c680f73afacab0107289c734c7ff9fded41c',
        });

      const result: AuthResponse = response.body;

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(result).toEqual({
        success: true,
        message: 'Token generated successfully',
        responseObject: {
          token: expect.any(String),
        },
        statusCode: StatusCodes.OK,
      });
    });
    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/auth/verify')
        .send({
          address: '0xValidAddress',
          message: 'Valid message',
          // Missing signature
        });

      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual({
        success: false,
        message: 'Invalid input: Invalid Ethereum address, Required',
        responseObject: null,
        statusCode: StatusCodes.BAD_REQUEST,
      });
    });
    it('should return 400 for an invalid Ethereum address', async () => {
      const response = await request(app)
        .post('/api/auth/verify')
        .send({
          address: 'InvalidAddress',
          message: 'Sign this message',
          signature: '0x37dd2a9f04b9f67fd98674a875482593043478970a5ef3a62ce312708c8d0a626e7e6d8d7f47e21b6adf7b077aae01c680f73afacab0107289c734c7ff9fded41c',
        });

      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual({
        success: false,
        message: 'Invalid input: Invalid Ethereum address',
        responseObject: null,
        statusCode: StatusCodes.BAD_REQUEST,
      });
    });

    it('should return 400 for an invalid Ethereum signature', async () => {
      const response = await request(app)
        .post('/api/auth/verify')
        .send({
          address: '0x0b20714db725d69912A92270d8495BAde2B4A54E',
          message: 'Sign this message',
          signature: 'InvalidSignature',
        });

      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual({
        success: false,
        message: 'Invalid input: Invalid Ethereum signature',
        responseObject: null,
        statusCode: StatusCodes.BAD_REQUEST,
      });
    });
  });
});