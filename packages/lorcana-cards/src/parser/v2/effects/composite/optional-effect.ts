/**
 * Optional Effect Parser
 * Handles optional effects like "You may X" or "You may do X"
 * Parses effects where the player can choose whether to execute the effect
 */

import type { CstNode } from "chevrotain";
import { logger } from "../../logging";
import type { OptionalEffect } from "../../types";
import type { EffectParser } from "../atomic";
import { parseAtomicEffect } from "../atomic";

/**
 * Parse optional effect from text string.
 * Identifies "You may" pattern and parses the optional effect.
 */
function parseFromText(text: string): OptionalEffect | null {
  logger.debug("Attempting to parse optional effect from text", { text });

  // Match "You may" pattern
  const optionalPattern = /you\s+may\s+(.+)/i;
  const match = text.match(optionalPattern);

  if (!match) {
    logger.debug("Optional effect pattern did not match");
    return null;
  }

  const effectText = match[1].trim();
  logger.debug("Found optional pattern", { effectText });

  // Parse the optional effect as an atomic effect
  const effect = parseAtomicEffect(effectText);

  if (!effect) {
    logger.warn("Failed to parse optional effect", { effectText });
    return null;
  }

  logger.info("Parsed optional effect", { effect });

  return {
    type: "optional",
    effect,
  };
}

/**
 * Parse optional effect from CST node (grammar-based parsing).
 * For now, returns null as optional effects are better handled via text parsing.
 */
function parseFromCst(_ctx: CstNode): OptionalEffect | null {
  logger.debug("CST-based optional parsing not yet implemented");
  return null;
}

/**
 * Optional effect parser implementation
 */
export const optionalEffectParser: EffectParser = {
  pattern: /you\s+may\s+/i,
  description:
    "Parses optional effects where player can choose to execute (e.g., 'You may draw 2 cards')",

  parse: (input: CstNode | string): OptionalEffect | null => {
    if (typeof input === "string") {
      return parseFromText(input);
    }
    return parseFromCst(input);
  },
};
