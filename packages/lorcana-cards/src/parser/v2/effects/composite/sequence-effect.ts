/**
 * Sequence Effect Parser
 * Handles sequential effects like "Do X, then Y, then Z"
 * Parses effects that occur in order using "then", "and then", or ". Then" separators
 */

import type { CstNode } from "chevrotain";
import { logger } from "../../logging";
import type { Effect, SequenceEffect } from "../../types";
import type { EffectParser } from "../atomic";
import { parseAtomicEffect } from "../atomic";

/**
 * Sequence separators used in Lorcana ability text.
 * These patterns separate sequential effects like "Do X, then Y".
 *
 * Case sensitivity notes:
 * - ". Then " uses capital T because it follows sentence-ending punctuation
 * - ", then " and ", and then " use lowercase as they're mid-sentence
 * - All patterns are matched case-insensitively during parsing
 */
const SEQUENCE_SEPARATORS = [", then ", ". Then ", ", and then "] as const;

/**
 * Parse sequence effect from text string.
 * Splits the text on sequence separators and parses each step as an atomic effect.
 */
function parseFromText(text: string): SequenceEffect | null {
  logger.debug("Attempting to parse sequence effect from text", { text });

  let stepTexts: string[] = [];

  // Find which separator is used
  for (const separator of SEQUENCE_SEPARATORS) {
    if (text.toLowerCase().includes(separator.toLowerCase())) {
      // Split while preserving case-insensitive matching
      const regex = new RegExp(separator, "gi");
      stepTexts = text.split(regex).map((s) => s.trim());
      logger.debug("Found sequence separator", {
        separator,
        stepCount: stepTexts.length,
      });
      break;
    }
  }

  // No sequence pattern found
  if (stepTexts.length < 2) {
    logger.debug("No sequence pattern found - requires at least 2 steps");
    return null;
  }

  // Parse each step as an atomic effect
  const steps: Effect[] = [];
  for (let i = 0; i < stepTexts.length; i++) {
    const stepText = stepTexts[i];
    logger.debug("Parsing sequence step", { stepIndex: i, stepText });

    const effect = parseAtomicEffect(stepText);
    if (effect) {
      steps.push(effect);
      logger.debug("Successfully parsed sequence step", {
        stepIndex: i,
        effect,
      });
    } else {
      logger.warn("Failed to parse sequence step", { stepIndex: i, stepText });
      // Continue parsing other steps even if one fails
    }
  }

  // Need at least one successfully parsed effect
  if (steps.length === 0) {
    logger.warn("Sequence parsing produced no valid effects");
    return null;
  }

  logger.info("Parsed sequence effect", {
    totalSteps: stepTexts.length,
    parsedSteps: steps.length,
  });

  return {
    type: "sequence",
    steps,
  };
}

/**
 * Parse sequence effect from CST node (grammar-based parsing).
 * For now, returns null as sequence effects are better handled via text parsing.
 */
function parseFromCst(_ctx: CstNode): SequenceEffect | null {
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

  parse: (input: CstNode | string): SequenceEffect | null => {
    if (typeof input === "string") {
      return parseFromText(input);
    }
    return parseFromCst(input);
  },
};
