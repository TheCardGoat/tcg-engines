/**
 * Main Effect Parser Registry
 * Unifies atomic and composite effect parsers into a single interface.
 * Composite effects are tried first, then atomic effects.
 */

import type { CstNode } from "chevrotain";
import { logger } from "../logging";
import type { Effect } from "../types";
import { atomicEffectParsers, parseAtomicEffect } from "./atomic";
import { compositeEffectParsers, parseCompositeEffect } from "./composite";

/**
 * Parse an effect by trying composite parsers first, then atomic parsers.
 * Composite effects (sequences, choices, conditionals) are more complex and
 * should be matched before falling back to atomic effects.
 *
 * @param input - CST node from grammar or text string to parse
 * @returns Parsed effect object or null if no parser matches
 */
export function parseEffect(input: CstNode | string): Effect | null {
  const inputType = typeof input === "string" ? "text" : "CST";
  logger.debug("Attempting to parse effect", { inputType });

  // Try composite parsers first (more specific patterns)
  const compositeResult = parseCompositeEffect(input);
  if (compositeResult !== null) {
    logger.info("Successfully parsed composite effect", {
      effectType: compositeResult.type,
    });
    return compositeResult;
  }

  // Check if the input matches any composite parser's pattern
  // If it does, we should NOT fall back to atomic parsing
  if (typeof input === "string") {
    for (const parser of compositeEffectParsers) {
      const pattern = parser.pattern;
      if (pattern instanceof RegExp && pattern.test(input)) {
        logger.info(
          "Input matches composite parser pattern but failed to parse - blocking atomic parse",
          {
            pattern: parser.description || pattern.toString(),
            input,
          },
        );
        // Don't fall back to atomic parsing if a composite pattern matched
        return null;
      }
    }
  }

  // Fall back to atomic parsers
  const atomicResult = parseAtomicEffect(input);
  if (atomicResult !== null) {
    logger.info("Successfully parsed atomic effect", {
      effectType: atomicResult.type,
    });
    return atomicResult;
  }

  // No parser matched
  logger.warn("No parser matched the input", { input });
  return null;
}

export { atomicEffectParsers, parseAtomicEffect } from "./atomic";
export * from "./atomic/banish-effect";
export * from "./atomic/damage-effect";
export * from "./atomic/discard-effect";
// Re-export individual effect parsers for testing
export * from "./atomic/draw-effect";
export * from "./atomic/exert-effect";
export * from "./atomic/keyword-effect";
export * from "./atomic/lore-effect";
export * from "./atomic/stat-mod-effect";
// Re-export individual parsers and registries for testing
export { compositeEffectParsers, parseCompositeEffect } from "./composite";
export * from "./composite/choice-effect";
export * from "./composite/conditional-effect";
export * from "./composite/for-each-effect";
export * from "./composite/optional-effect";
export * from "./composite/repeat-effect";
export * from "./composite/sequence-effect";
