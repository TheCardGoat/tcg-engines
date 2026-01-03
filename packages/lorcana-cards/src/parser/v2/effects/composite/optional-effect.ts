/**
 * Optional Effect Parser
 * Handles optional effects like "You may X" or "You may do X"
 * Parses effects where the player can choose whether to execute the effect
 *
 * Also handles "You may X. If you do, Y" patterns by returning a sequence
 * where the first step is the optional effect.
 */

import type { CstNode } from "chevrotain";
import { logger } from "../../logging";
import type { Effect, OptionalEffect, SequenceEffect } from "../../types";
import type { EffectParser } from "../atomic";
import { parseAtomicEffect } from "../atomic";

/**
 * Parse optional effect from text string.
 * Identifies "You may" pattern and parses the optional effect.
 *
 * Handles two patterns:
 * 1. "You may X" - Returns optional effect
 * 2. "You may X. If you do, Y" - Returns sequence with optional first step
 */
function parseFromText(text: string): OptionalEffect | SequenceEffect | null {
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

  // Check for "if you do" follow-up (case-insensitive)
  const ifYouDoPattern = /^(.+?)\.\s*if\s+you\s+do,\s*(.+)$/is;
  const ifYouDoMatch = effectText.match(ifYouDoPattern);

  if (ifYouDoMatch) {
    // Parse as sequence with optional first step
    const firstStepText = ifYouDoMatch[1].trim();
    const secondStepText = ifYouDoMatch[2].trim();

    logger.debug("Found 'if you do' follow-up pattern", {
      firstStepText,
      secondStepText,
    });

    // Parse first step as optional effect
    const firstStepEffect = parseAtomicEffect(firstStepText);
    if (!firstStepEffect) {
      logger.warn("Failed to parse optional first step", { firstStepText });
      return null;
    }

    const optionalStep: OptionalEffect = {
      type: "optional",
      effect: firstStepEffect,
      chooser: "CONTROLLER",
    };

    // Parse second step
    const secondStep = parseAtomicEffect(secondStepText);
    if (!secondStep) {
      logger.warn("Failed to parse 'if you do' effect", { secondStepText });
      return null;
    }

    logger.info("Parsed optional effect with 'if you do' follow-up", {
      optionalStep,
      secondStep,
    });

    return {
      type: "sequence",
      steps: [optionalStep, secondStep],
    };
  }

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
    chooser: "CONTROLLER",
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

  parse: (input: CstNode | string): OptionalEffect | SequenceEffect | null => {
    if (typeof input === "string") {
      return parseFromText(input);
    }
    return parseFromCst(input);
  },
};
