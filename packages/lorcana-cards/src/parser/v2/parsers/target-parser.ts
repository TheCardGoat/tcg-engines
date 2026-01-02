/**
 * Target parser stub for v2 tests.
 */

import { parseAtomicEffect } from "../effects/atomic";

/**
 * Parse target from effect text.
 * This is a simplified stub that extracts target information.
 */
export function parseTarget(text: string) {
  const effect = parseAtomicEffect(text);
  if (effect && "target" in effect) {
    return (effect as { target: unknown }).target;
  }
  return null;
}

/**
 * Parse target with optional modifier.
 */
export function parseTargetWithModifier(text: string) {
  return parseTarget(text);
}
