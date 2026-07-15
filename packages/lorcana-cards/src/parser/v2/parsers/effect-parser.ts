/**
 * Effect parser stub for v2 tests.
 * Re-exports effect parsers from the new v2 structure.
 */

import { parseAtomicEffect } from "../effects/atomic";
import { compositeEffectParsers, parseCompositeEffect } from "../effects/composite";
import { logger } from "../logging";
import type { Effect } from "../types";

/**
 * Parse effect text using both atomic and composite effect parsers.
 * Tries composite first (sequences, choices, etc.), then falls back to atomic.
 */
export function parseEffect(text: string): Effect | undefined {
  // Try composite effects first
  const composite = parseCompositeEffect(text);
  if (composite) {
    return composite;
  }

  // Check if the input matches any composite parser's pattern
  // If it does, we should NOT fall back to atomic parsing
  for (const parser of compositeEffectParsers) {
    const { pattern } = parser;
    if (pattern instanceof RegExp && pattern.test(text)) {
      logger.debug(
        "Input matches composite parser pattern but failed to parse - blocking atomic parse",
        {
          input: text,
          pattern: parser.description || pattern.toString(),
        },
      );
      // Don't fall back to atomic parsing if a composite pattern matched
      return undefined;
    }
  }

  // Fall back to atomic effects
  const atomic = parseAtomicEffect(text);
  if (atomic) {
    return atomic;
  }

  // Return undefined instead of null for failed parses
  return undefined;
}

export { parseAtomicEffect, parseCompositeEffect };
