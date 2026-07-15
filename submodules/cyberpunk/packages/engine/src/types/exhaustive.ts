/**
 * Compile-time exhaustiveness check for discriminated unions.
 *
 * Use as the `default` case in a switch over a discriminated union, or at
 * the bottom of an if-else chain. If a new union member is added without a
 * matching branch, the call site fails type-checking because the value is
 * no longer narrowed to `never`.
 *
 * Example:
 *   switch (effect.effect) {
 *     case "draw": ...
 *     case "spend": ...
 *     default: assertNever(effect);
 *   }
 *
 * The function also throws at runtime, so unhandled values surface in
 * tests instead of silently no-oping.
 */
export function assertNever(value: never): never {
  throw new Error(`Unhandled discriminated-union member: ${JSON.stringify(value)}`);
}
