/**
 * Generic Result type for error handling throughout the engine
 * Replaces boolean returns with rich error information
 */
export type Result<T, E = Error> = {
    success: true;
    data: T;
} | {
    success: false;
    error: E;
};
/**
 * Helper functions for working with Result types
 */
export declare const Result: {
    /**
     * Create a successful result
     */
    ok<T>(data: T): Result<T, never>;
    /**
     * Create a failed result
     */
    error<E>(error: E): Result<never, E>;
    /**
     * Transform a successful result value
     */
    map<T, U, E>(result: Result<T, E>, fn: (value: T) => U): Result<U, E>;
    /**
     * Chain result operations (flatMap)
     */
    chain<T, U, E>(result: Result<T, E>, fn: (value: T) => Result<U, E>): Result<U, E>;
    /**
     * Handle both success and failure cases
     */
    match<T, E, U>(result: Result<T, E>, handlers: {
        success: (data: T) => U;
        error: (error: E) => U;
    }): U;
    /**
     * Check if result is successful
     */
    isOk<T, E>(result: Result<T, E>): result is {
        success: true;
        data: T;
    };
    /**
     * Check if result is an error
     */
    isError<T, E>(result: Result<T, E>): result is {
        success: false;
        error: E;
    };
    /**
     * Get data from result or throw error
     */
    unwrap<T, E>(result: Result<T, E>): T;
    /**
     * Get data from result or return default value
     */
    unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T;
};
//# sourceMappingURL=result.d.ts.map