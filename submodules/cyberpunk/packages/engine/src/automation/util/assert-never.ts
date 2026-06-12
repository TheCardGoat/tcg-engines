/**
 * Exhaustive-check helper. When narrowing a discriminated union with `switch`,
 * pass the unhandled value to this function in the default branch. If a new
 * variant is added to the union, this call site stops type-checking — TypeScript
 * reports the new variant as not assignable to `never`, which is exactly the
 * signal the AI harness wants when the engine grows.
 *
 * The runtime throw exists for the (impossible-by-types) case where bad data
 * sneaks through at runtime, so callers can rely on the function never
 * returning normally.
 */
export function assertNever(x: never, label: string): never {
  throw new Error(`Unhandled ${label}: ${JSON.stringify(x)}`);
}
