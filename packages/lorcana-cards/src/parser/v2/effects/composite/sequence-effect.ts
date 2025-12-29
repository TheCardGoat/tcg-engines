/**
 * Sequence Effect Parser
 * Handles sequential effects like "Do X, then Y, then Z"
 * Parses effects that occur in order using "then", "and then", or ". Then" separators
 */

import type { CstNode } from "chevrotain";
import { logger } from "../../logging";
import type { Effect } from "../../types";
import type { EffectParser } from "../atomic";
import { parseAtomicEffect } from "../atomic";

/**
 * Parse sequence effect from text string.
 * Splits the text on sequence separators and parses each step as an atomic effect.
 */
function parseFromText(text: string): Effect | null {
  logger.debug("Attempting to parse sequence effect from text", { text });

  // Common sequence separators in Lorcana
  const separators = [", then ", ". Then ", ", and then "];
  let steps: string[] = [];

  // Find which separator is used
  for (const separator of separators) {
    if (text.toLowerCase().includes(separator.toLowerCase())) {
      // Split while preserving case-insensitive matching
      const regex = new RegExp(separator, "gi");
      steps = text.split(regex).map((s) => s.trim());
      logger.debug("Found sequence separator", {
        separator,
        stepCount: steps.length,
      });
      break;
    }
  }

  // No sequence pattern found
  if (steps.length < 2) {
    logger.debug("No sequence pattern found - requires at least 2 steps");
    return null;
  }

  // Parse each step as an atomic effect
  const effects: Effect[] = [];
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    logger.debug("Parsing sequence step", { stepIndex: i, step });

    const effect = parseAtomicEffect(step);
    if (effect) {
      effects.push(effect);
      logger.debug("Successfully parsed sequence step", {
        stepIndex: i,
        effect,
      });
    } else {
      logger.warn("Failed to parse sequence step", { stepIndex: i, step });
      // Continue parsing other steps even if one fails
    }
  }

  // Need at least one successfully parsed effect
  if (effects.length === 0) {
    logger.warn("Sequence parsing produced no valid effects");
    return null;
  }

  logger.info("Parsed sequence effect", {
    totalSteps: steps.length,
    parsedEffects: effects.length,
  });

  return {
    type: "sequence",
    effects,
  };
}

/**
 * Parse sequence effect from CST node (grammar-based parsing).
 * For now, returns null as sequence effects are better handled via text parsing.
 */
function parseFromCst(ctx: CstNode): Effect | null {
  logger.debug("CST-based sequence parsing not yet implemented");
  return null;
}

/**
 * Sequence effect parser implementation
 */
export const sequenceEffectParser: EffectParser = {
  pattern: /(.+),\s*then\s+(.+)/i,
  description:
    "Parses sequence effects where multiple effects occur in order (e.g., 'draw 2 cards, then discard 1 card')",

  parse: (input: CstNode | string): Effect | null => {
    if (typeof input === "string") {
      return parseFromText(input);
    }
    return parseFromCst(input);
  },
};
