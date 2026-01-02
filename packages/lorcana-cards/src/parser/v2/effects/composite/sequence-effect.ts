/**
 * Sequence Effect Parser
 * Handles sequential effects like "Do X, then Y, then Z"
 * Parses effects that occur in order using "then", "and then", ". Then", ". " (period), or " and " separators
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
 * All separator literals are stored in lowercase and matched case-insensitively
 * during parsing (e.g., handles both ", then " and ", Then ").
 *
 * Priority order:
 * 1. ", then" / ". then" / ", and then" - explicit sequence markers
 * 2. ". " - period-separated sentences (only if not part of "or" format)
 *
 * Note: " and " is NOT a sequence separator - it's used within atomic effects
 * like "draw 2 cards and discard 1 card" which should be parsed as a single effect.
 */
const SEQUENCE_SEPARATORS = [
  ", then ",
  ". then ",
  ", and then ",
  ". Then, ", // Capital T with comma
  ". ",
] as const;

/**
 * Parse sequence effect from text string.
 * Splits the text on sequence separators and parses each step as an atomic effect.
 */
function parseFromText(text: string): SequenceEffect | null {
  logger.debug("Attempting to parse sequence effect from text", { text });

  let stepTexts: string[] = [];
  let separatorUsed: string | undefined;

  // First, try the standard separators
  for (const separator of SEQUENCE_SEPARATORS) {
    if (text.toLowerCase().includes(separator.toLowerCase())) {
      // Escape special regex characters in the separator
      // This is needed because "." in the separator would match any character
      const escapedSeparator = separator.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      // Split while preserving case-insensitive matching
      const regex = new RegExp(escapedSeparator, "gi");
      stepTexts = text.split(regex).map((s) => s.trim());
      separatorUsed = separator;
      logger.debug("Found sequence separator", {
        separator,
        stepCount: stepTexts.length,
      });
      break;
    }
  }

  // If no standard separator found, check for " and " as a special case
  // Only split on "and" if both parts are valid independent effects
  if (stepTexts.length < 2 && /\s+and\s+/i.test(text)) {
    const parts = text.split(/\s+and\s+/i).map((s) => s.trim());
    if (parts.length === 2) {
      // Check if both parts can be parsed as independent effects
      const part1Effect = parseAtomicEffect(parts[0]);
      const part2Effect = parseAtomicEffect(parts[1]);

      // Only treat as sequence if both parts parse successfully
      // AND the text doesn't match patterns that should stay together
      const shouldStayTogether =
        /choose\s+and\s+(?:discard|draw|gain)/i.test(text) ||
        /draw\s+.+\s+and\s+discard/i.test(text) ||
        /gain\s+.+\s+and\s+lose/i.test(text);

      if (part1Effect && part2Effect && !shouldStayTogether) {
        stepTexts = parts;
        separatorUsed = " and ";
        logger.debug("Found 'and' separator - both parts are valid effects", {
          parts,
        });
      }
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
      // If any step fails to parse, the entire sequence is invalid
      logger.warn("Failed to parse sequence step - sequence invalid", {
        stepIndex: i,
        stepText,
      });
      return null;
    }
  }

  // All steps must parse successfully
  if (steps.length !== stepTexts.length) {
    logger.warn("Sequence parsing produced incomplete effects");
    return null;
  }

  logger.info("Parsed sequence effect", {
    totalSteps: stepTexts.length,
    parsedSteps: steps.length,
    separator: separatorUsed,
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
