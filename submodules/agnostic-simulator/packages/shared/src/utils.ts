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

/**
 * Converts a string to URL-safe kebab-case slug.
 * Replaces whitespace and special characters with hyphens, converts to lowercase.
 * Strips apostrophes and other non-alphanumeric chars (except hyphens).
 *
 * @param text - The text to slugify
 * @returns A URL-safe slug string
 *
 * @example
 * slugify("Mickey Mouse - Brave Little Tailor") // "mickey-mouse-brave-little-tailor"
 * slugify("A Pirate's Life") // "a-pirates-life"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_—-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}
