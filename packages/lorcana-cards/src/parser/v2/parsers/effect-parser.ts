/**
 * Effect parser stub for v2 tests.
 * Re-exports effect parsers from the new v2 structure.
 */

import { parseAtomicEffect } from "../effects/atomic";
import { parseCompositeEffect } from "../effects/composite";

/**
 * Parse effect text using both atomic and composite effect parsers.
 * Tries composite first (sequences, choices, etc.), then falls back to atomic.
 */
export function parseEffect(text: string) {
  // Try composite effects first
  const composite = parseCompositeEffect(text);
  if (composite) {
    return composite;
  }

  // Fall back to atomic effects
  return parseAtomicEffect(text);
}

export { parseAtomicEffect, parseCompositeEffect };
