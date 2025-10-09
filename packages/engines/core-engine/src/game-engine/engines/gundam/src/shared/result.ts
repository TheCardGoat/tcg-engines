/**
 * Result type for explicit error handling across the Gundam engine
 *
 * Provides a type-safe way to handle success and error cases without exceptions.
 * Forces callers to explicitly handle both success and failure paths.
 *
 * @example
 * function divide(a: number, b: number): Result<number, DivisionError> {
 *   if (b === 0) {
 *     return { success: false, error: { type: "divideByZero" } };
 *   }
 *   return { success: true, data: a / b };
 * }
 *
 * const result = divide(10, 2);
 * if (result.success) {
 *   console.log(result.data); // 5
 * } else {
 *   console.error(result.error);
 * }
 */
export type Result<T, E = Error> =
	| { success: true; data: T }
	| { success: false; error: E };
