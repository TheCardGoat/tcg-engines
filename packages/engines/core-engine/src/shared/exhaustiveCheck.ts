/**
 * Utility function to ensure exhaustive checking in switch statements and conditionals.
 * Throws an error in development mode if an unexpected value is encountered.
 *
 * @param value - The value that should be of type never (indicating all cases were handled)
 */
export function exhaustiveCheck(_: never): void {
  if (process.env.NODE_ENV !== "production") {
    throw new Error(`Unexpected value: ${_}`);
  }
  // In production, we can just log the error without throwing
  console.error(`Unexpected value: ${_}`);
}
