/**
 * Compile-time exhaustiveness assertion. Use as the `default` branch of a
 * switch over a discriminated union, or after a chain of `if` narrowings,
 * to force a type error if a future variant is left unhandled. The thrown
 * error keeps runtime behaviour explicit if a caller ever does feed an
 * out-of-band value (e.g. via an `as` cast).
 */
export function assertNever(value: never, context?: string): never {
  throw new Error(
    context !== undefined
      ? `Non-exhaustive switch (${context}): ${JSON.stringify(value)}`
      : `Non-exhaustive switch: ${JSON.stringify(value)}`,
  );
}
