/**
 * Helper functions for working with Result types
 */
export const Result = {
    /**
     * Create a successful result
     */
    ok(data) {
        return { success: true, data };
    },
    /**
     * Create a failed result
     */
    error(error) {
        return { success: false, error };
    },
    /**
     * Transform a successful result value
     */
    map(result, fn) {
        if (result.success) {
            return { success: true, data: fn(result.data) };
        }
        // Type assertion needed due to TypeScript discriminated union narrowing issue
        return {
            success: false,
            error: result.error,
        };
    },
    /**
     * Chain result operations (flatMap)
     */
    chain(result, fn) {
        if (result.success) {
            return fn(result.data);
        }
        // Type assertion needed due to TypeScript discriminated union narrowing issue
        return {
            success: false,
            error: result.error,
        };
    },
    /**
     * Handle both success and failure cases
     */
    match(result, handlers) {
        if (result.success) {
            return handlers.success(result.data);
        }
        // Type assertion needed due to TypeScript discriminated union narrowing issue
        return handlers.error(result.error);
    },
    /**
     * Check if result is successful
     */
    isOk(result) {
        return result.success;
    },
    /**
     * Check if result is an error
     */
    isError(result) {
        return !result.success;
    },
    /**
     * Get data from result or throw error
     */
    unwrap(result) {
        if (result.success) {
            return result.data;
        }
        // Type assertion needed due to TypeScript discriminated union narrowing issue
        throw result.error;
    },
    /**
     * Get data from result or return default value
     */
    unwrapOr(result, defaultValue) {
        if (result.success) {
            return result.data;
        }
        return defaultValue;
    },
};
//# sourceMappingURL=result.js.map