/** Exhaustive-check helper for closed discriminated unions. */
export function assertNever(value: never, label = "value"): never {
  throw new Error(`Unhandled ${label}: ${JSON.stringify(value)}`);
}
