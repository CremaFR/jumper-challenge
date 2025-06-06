import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface UserJwtPayload extends JwtPayload {
  address: string;
  chainId: number;
  issuedAt: string;
  domain: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserJwtPayload;
    }
  }
}