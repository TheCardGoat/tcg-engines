/**
 * Custom error classes for Content Management Service
 *
 * Using custom error classes instead of string comparison for type-safe error handling.
 */

/**
 * Thrown when a user is not authenticated but authentication is required
 */
export class UnauthorizedError extends Error {
  readonly name = "UnauthorizedError";
  readonly statusCode = 401;

  constructor(message = "Authentication required") {
    super(message);
    // Maintains proper stack trace for where error was thrown
    Error.captureStackTrace?.(this, UnauthorizedError);
  }
}

/**
 * Thrown when a user lacks the required permissions
 */
export class ForbiddenError extends Error {
  readonly name = "ForbiddenError";
  readonly statusCode = 403;

  constructor(message = "Access denied") {
    super(message);
    Error.captureStackTrace?.(this, ForbiddenError);
  }
}

/**
 * Type guard to check if an error is an UnauthorizedError
 */
export function isUnauthorizedError(
  error: unknown,
): error is UnauthorizedError {
  return error instanceof UnauthorizedError;
}

/**
 * Type guard to check if an error is a ForbiddenError
 */
export function isForbiddenError(error: unknown): error is ForbiddenError {
  return error instanceof ForbiddenError;
}
