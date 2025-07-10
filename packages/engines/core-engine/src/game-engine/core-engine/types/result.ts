/**
 * Generic Result type for error handling throughout the engine
 * Replaces boolean returns with rich error information
 */
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Helper functions for working with Result types
 */
export const Result = {
  /**
   * Create a successful result
   */
  ok<T>(data: T): Result<T, never> {
    return { success: true, data };
  },

  /**
   * Create a failed result
   */
  error<E>(error: E): Result<never, E> {
    return { success: false, error };
  },

  /**
   * Transform a successful result value
   */
  map<T, U, E>(result: Result<T, E>, fn: (value: T) => U): Result<U, E> {
    if (result.success) {
      return { success: true, data: fn(result.data) };
    }
    // Type assertion needed due to TypeScript discriminated union narrowing issue
    return {
      success: false,
      error: (result as { success: false; error: E }).error,
    };
  },

  /**
   * Chain result operations (flatMap)
   */
  chain<T, U, E>(
    result: Result<T, E>,
    fn: (value: T) => Result<U, E>,
  ): Result<U, E> {
    if (result.success) {
      return fn(result.data);
    }
    // Type assertion needed due to TypeScript discriminated union narrowing issue
    return {
      success: false,
      error: (result as { success: false; error: E }).error,
    };
  },

  /**
   * Handle both success and failure cases
   */
  match<T, E, U>(
    result: Result<T, E>,
    handlers: {
      success: (data: T) => U;
      error: (error: E) => U;
    },
  ): U {
    if (result.success) {
      return handlers.success(result.data);
    }
    // Type assertion needed due to TypeScript discriminated union narrowing issue
    return handlers.error((result as { success: false; error: E }).error);
  },

  /**
   * Check if result is successful
   */
  isOk<T, E>(result: Result<T, E>): result is { success: true; data: T } {
    return result.success;
  },

  /**
   * Check if result is an error
   */
  isError<T, E>(result: Result<T, E>): result is { success: false; error: E } {
    return !result.success;
  },

  /**
   * Get data from result or throw error
   */
  unwrap<T, E>(result: Result<T, E>): T {
    if (result.success) {
      return result.data;
    }
    // Type assertion needed due to TypeScript discriminated union narrowing issue
    throw (result as { success: false; error: E }).error;
  },

  /**
   * Get data from result or return default value
   */
  unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T {
    if (result.success) {
      return result.data;
    }
    return defaultValue;
  },
};
