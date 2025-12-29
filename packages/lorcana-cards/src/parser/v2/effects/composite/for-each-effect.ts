/**
 * For-Each Effect Parser
 * Handles for-each effects like "for each X, Y" or "for each X you control, Y"
 * Parses effects that scale based on counting something
 */

import type { CstNode } from "chevrotain";
import { logger } from "../../logging";
import type { Effect } from "../../types";
import type { EffectParser } from "../atomic";
import { parseAtomicEffect } from "../atomic";

/**
 * Parse for-each effect from text string.
 * Identifies "for each" pattern and parses both the iterator and the effect.
 */
function parseFromText(text: string): Effect | null {
  logger.debug("Attempting to parse for-each effect from text", { text });

  // Match "for each X, Y" pattern
  const forEachPattern = /for\s+each\s+([^,]+),\s*(.+)/i;
  const match = text.match(forEachPattern);

  if (!match) {
    logger.debug("For-each effect pattern did not match");
    return null;
  }

  const iteratorText = match[1].trim();
  const effectText = match[2].trim();

  logger.debug("Found for-each pattern", { iteratorText, effectText });

  // Parse the effect part
  const effect = parseAtomicEffect(effectText);

  if (!effect) {
    logger.warn("Failed to parse for-each effect", { effectText });
    return null;
  }

  logger.info("Parsed for-each effect", { iterator: iteratorText, effect });

  return {
    type: "forEach",
    iterator: iteratorText,
    effect,
  };
}

/**
 * Parse for-each effect from CST node (grammar-based parsing).
 * For now, returns null as for-each effects are better handled via text parsing.
 */
function parseFromCst(ctx: CstNode): Effect | null {
  logger.debug("CST-based for-each parsing not yet implemented");
  return null;
}

/**
 * For-each effect parser implementation
 */
export const forEachEffectParser: EffectParser = {
  pattern: /for\s+each\s+/i,
  description:
    "Parses for-each effects that scale with a count (e.g., 'for each character you control, gain 1 lore')",

  parse: (input: CstNode | string): Effect | null => {
    if (typeof input === "string") {
      return parseFromText(input);
    }
    return parseFromCst(input);
  },
};
