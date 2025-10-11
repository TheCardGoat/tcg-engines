/**
 * Shared utility functions for the Gundam Card Converter system
 */

import type {
  CardId,
  ConversionError,
  ConversionResult,
  ErrorCategory,
  FilePath,
  SetId,
  ValidationResult,
} from "./types";

// ============================================================================
// ERROR HANDLING UTILITIES
// ============================================================================

/**
 * Creates a standardized conversion error
 */
export const createConversionError = (
  cardId: string,
  category: ErrorCategory,
  message: string,
  options: {
    severity?: "error" | "warning" | "info";
    field?: string;
    suggestion?: string;
    originalValue?: unknown;
  } = {},
): ConversionError => ({
  cardId,
  severity: options.severity ?? "error",
  category,
  field: options.field,
  message,
  suggestion: options.suggestion,
  originalValue: options.originalValue,
});

/**
 * Combines multiple conversion results
 */
export const combineConversionResults = <T>(
  results: ConversionResult<T>[],
): ConversionResult<T> => ({
  success: results.flatMap((r) => r.success),
  errors: results.flatMap((r) => r.errors),
  warnings: results.flatMap((r) => r.warnings),
});

/**
 * Creates an empty conversion result
 */
export const createEmptyResult = <T>(): ConversionResult<T> => ({
  success: [],
  errors: [],
  warnings: [],
});

/**
 * Creates a successful conversion result
 */
export const createSuccessResult = <T>(
  items: T[],
  warnings: string[] = [],
): ConversionResult<T> => ({
  success: items,
  errors: [],
  warnings,
});

/**
 * Creates a failed conversion result
 */
export const createErrorResult = <T>(
  errors: ConversionError[],
  warnings: string[] = [],
): ConversionResult<T> => ({
  success: [],
  errors,
  warnings,
});

/**
 * Checks if a conversion result has errors
 */
export const hasErrors = <T>(result: ConversionResult<T>): boolean =>
  result.errors.some((e) => e.severity === "error");

/**
 * Checks if a conversion result has warnings
 */
export const hasWarnings = <T>(result: ConversionResult<T>): boolean =>
  result.warnings.length > 0 ||
  result.errors.some((e) => e.severity === "warning");

/**
 * Gets error count by severity
 */
export const getErrorCounts = <T>(result: ConversionResult<T>) => ({
  errors: result.errors.filter((e) => e.severity === "error").length,
  warnings:
    result.errors.filter((e) => e.severity === "warning").length +
    result.warnings.length,
  info: result.errors.filter((e) => e.severity === "info").length,
});

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Creates a successful validation result
 */
export const createValidResult = (): ValidationResult => ({
  isValid: true,
  errors: [],
  warnings: [],
});

/**
 * Creates a failed validation result
 */
export const createInvalidResult = (
  errors: ConversionError[],
  warnings: string[] = [],
): ValidationResult => ({
  isValid: false,
  errors,
  warnings,
});

/**
 * Combines multiple validation results
 */
export const combineValidationResults = (
  results: ValidationResult[],
): ValidationResult => ({
  isValid: results.every((r) => r.isValid),
  errors: results.flatMap((r) => r.errors),
  warnings: results.flatMap((r) => r.warnings),
});

// ============================================================================
// STRING UTILITIES
// ============================================================================

// Re-export naming utilities from core
// TODO: Implement @tcg/core/tooling module
// export {
//   generateVariableName,
//   toCamelCase,
//   toKebabCase,
//   toPascalCase,
//   toSnakeCase,
// } from "@tcg/core/tooling";

/**
 * Sanitizes a string for use as a filename
 */
export const sanitizeFilename = (str: string): string =>
  str
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase();

/**
 * Extracts card number from card ID
 */
export const extractCardNumber = (cardId: string): number => {
  const match = cardId.match(/(\d+)/);
  return match ? Number.parseInt(match[1], 10) : 1;
};

/**
 * Extracts set ID from card ID
 */
export const extractSetId = (cardId: string): string => {
  const match = cardId.match(/^([A-Z]+\d+)/);
  return match ? match[1] : "UNKNOWN";
};

// ============================================================================
// HTML UTILITIES
// ============================================================================

/**
 * Decodes HTML entities in text
 */
export const decodeHtmlEntities = (text: string): string =>
  text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");

/**
 * Removes HTML tags from text
 */
export const stripHtmlTags = (text: string): string =>
  text.replace(/<[^>]*>/g, "");

/**
 * Normalizes effect text by removing HTML and cleaning whitespace
 */
export const normalizeEffectText = (text: string): string =>
  stripHtmlTags(decodeHtmlEntities(text)).replace(/\s+/g, " ").trim();

// ============================================================================
// ARRAY UTILITIES
// ============================================================================

/**
 * Groups array items by a key function
 */
export const groupBy = <T, K extends string | number | symbol>(
  array: T[],
  keyFn: (item: T) => K,
): Record<K, T[]> => {
  const result = {} as Record<K, T[]>;
  for (const item of array) {
    const key = keyFn(item);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(item);
  }
  return result;
};

/**
 * Counts occurrences of items in an array
 */
export const countBy = <T, K extends string | number | symbol>(
  array: T[],
  keyFn: (item: T) => K,
): Record<K, number> => {
  const result = {} as Record<K, number>;
  for (const item of array) {
    const key = keyFn(item);
    result[key] = (result[key] || 0) + 1;
  }
  return result;
};

/**
 * Removes duplicate items from an array
 */
export const unique = <T>(array: T[]): T[] => [...new Set(array)];

/**
 * Removes duplicate items from an array by a key function
 */
export const uniqueBy = <T, K>(array: T[], keyFn: (item: T) => K): T[] => {
  const seen = new Set<K>();
  return array.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

// ============================================================================
// TYPE UTILITIES
// ============================================================================

/**
 * Type guard for non-null values
 */
export const isNotNull = <T>(value: T | null | undefined): value is T =>
  value !== null && value !== undefined;

/**
 * Type guard for non-empty strings
 */
export const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

/**
 * Type guard for valid numbers
 */
export const isValidNumber = (value: unknown): value is number =>
  typeof value === "number" && !Number.isNaN(value) && Number.isFinite(value);

/**
 * Safely parses a number from a string
 */
export const safeParseInt = (value: string, defaultValue = 0): number => {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? defaultValue : parsed;
};

/**
 * Safely parses a float from a string
 */
export const safeParseFloat = (value: string, defaultValue = 0): number => {
  const parsed = Number.parseFloat(value);
  return Number.isNaN(parsed) ? defaultValue : parsed;
};

// ============================================================================
// BRANDED TYPE UTILITIES
// ============================================================================

/**
 * Creates a branded CardId
 */
export const createCardId = (id: string): CardId => id as CardId;

/**
 * Creates a branded SetId
 */
export const createSetId = (id: string): SetId => id as SetId;

/**
 * Creates a branded FilePath
 */
export const createFilePath = (path: string): FilePath => path as FilePath;

// ============================================================================
// LOGGING UTILITIES
// ============================================================================

/**
 * Formats a conversion error for logging
 */
export const formatConversionError = (error: ConversionError): string =>
  `[${error.severity.toUpperCase()}] ${error.cardId} (${error.category}${error.field ? `:${error.field}` : ""}): ${error.message}${error.suggestion ? ` | Suggestion: ${error.suggestion}` : ""}`;

/**
 * Formats conversion results for logging
 */
export const formatConversionSummary = <T>(
  result: ConversionResult<T>,
): string => {
  const counts = getErrorCounts(result);
  return `Conversion completed: ${result.success.length} successful, ${counts.errors} errors, ${counts.warnings} warnings`;
};

/**
 * Creates a progress indicator string
 */
export const formatProgress = (
  current: number,
  total: number,
  prefix = "",
): string => {
  const percentage = Math.round((current / total) * 100);
  const bar =
    "█".repeat(Math.floor(percentage / 5)) +
    "░".repeat(20 - Math.floor(percentage / 5));
  return `${prefix}[${bar}] ${current}/${total} (${percentage}%)`;
};
