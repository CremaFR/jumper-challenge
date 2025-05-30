/**
 * Custom API error class that includes HTTP status code.
 * Extends the native Error class to add status code information.
 */
export class ApiError extends Error {
  status: number;

  /**
   * Creates a new ApiError instance
   *
   * @param message - The error message
   * @param status - The HTTP status code associated with the error
   */
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;

    // Maintains proper stack trace for where our error was thrown (only in V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}
