/**
 * Composite Effect Parser Registry
 * Provides a plugin-style architecture for parsing composite effects.
 * Each composite effect type is registered explicitly and tried in order.
 */

import type { CstNode } from "chevrotain";
import type { Effect } from "../../types";
import type { EffectParser } from "../atomic";
import { choiceEffectParser } from "./choice-effect";
import { conditionalEffectParser } from "./conditional-effect";
import { forEachEffectParser } from "./for-each-effect";
import { optionalEffectParser } from "./optional-effect";
import { repeatEffectParser } from "./repeat-effect";
import { sequenceEffectParser } from "./sequence-effect";

/**
 * Registry of composite effect parsers.
 * Order matters - more specific parsers should come first.
 * Composite parsers are tried before atomic parsers in the main parser flow.
 */
export const compositeEffectParsers: EffectParser[] = [
  // Choice effects (very specific "choose one" pattern)
  choiceEffectParser,

  // For-each effects (specific "for each" pattern)
  forEachEffectParser,

  // Conditional effects (specific "if X, then Y" pattern)
  conditionalEffectParser,

  // Optional effects (specific "you may" pattern)
  optionalEffectParser,

  // Repeat effects (specific "X times" pattern)
  repeatEffectParser,

  // Sequence effects (more generic "then" pattern - should be last)
  sequenceEffectParser,
];

/**
 * Parse a composite effect by trying each registered parser in order.
 * Returns the first successful parse result, or null if no parser matches.
 */
export function parseCompositeEffect(input: CstNode | string): Effect | null {
  for (const parser of compositeEffectParsers) {
    const result = parser.parse(input);
    if (result !== null) {
      return result;
    }
  }
  return null;
}

export { choiceEffectParser } from "./choice-effect";
export { conditionalEffectParser } from "./conditional-effect";
export { forEachEffectParser } from "./for-each-effect";
export { optionalEffectParser } from "./optional-effect";
export { repeatEffectParser } from "./repeat-effect";
// Re-export individual parsers for testing
export { sequenceEffectParser } from "./sequence-effect";
