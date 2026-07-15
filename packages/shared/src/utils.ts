/**
 * Utility types for handling null/undefined checks
 */

/**
 * Ensures a value is non-null (useful for TypeScript strict null checks)
 * @param value The value to check
 * @throws Error if value is null or undefined
 */
export function assertNonNull<T>(
  value: T | null | undefined,
  message = "Value cannot be null or undefined",
): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(message);
  }
}

/**
 * Returns a default value if the input is null/undefined
 * @param value The value to check
 * @param defaultVal The default value to return if value is null/undefined
 */
export function withDefault<T>(value: T | null | undefined, defaultVal: T): T {
  return value === null || value === undefined ? defaultVal : value;
}

/**
 * Type guard to check if a value is not null or undefined
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Type utility that removes null from a type
 */
export type NonNull<T> = T extends null ? never : T;

/**
 * Type utility that removes undefined from a type
 */
export type NonUndefined<T> = T extends undefined ? never : T;

/**
 * Type utility that ensures a type is not null or undefined
 */
export type NonNullable<T> = T extends null | undefined ? never : T;
