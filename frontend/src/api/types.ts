/**
 * Common response type from the backend services
 */
export interface ServiceResponse<T> {
  success: boolean;
  message: string;
  responseObject: T | null;
  statusCode: number;
}

/**
 * Auth response with token information
 */
export interface AuthResponseObject {
  token: string;
  user?: {
    address: string;
  };
}

/**
 * Nonce response object
 */
export interface NonceResponseObject {
  nonce: string;
}
