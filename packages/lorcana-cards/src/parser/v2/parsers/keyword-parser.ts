/**
 * Keyword ability parser stub for v2 tests.
 */

import { parseAtomicEffect } from "../effects/atomic";

/**
 * Parse keyword ability using the keyword effect parser.
 */
export function parseKeywordAbility(text: string) {
  const effect = parseAtomicEffect(text);
  if (effect?.type === "keyword") {
    return effect;
  }
  return null;
}
