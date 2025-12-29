/**
 * Reveal Effect Parser
 * Handles reveal effects like "reveal your hand" or "reveal the top card"
 */

import type { CstNode } from "chevrotain";
import { logger } from "../../logging";
import type {
  Effect,
  PlayerTarget,
  RevealHandEffect,
  RevealTopCardEffect,
} from "../../types";
import type { EffectParser } from "./index";

/**
 * Parse reveal effect from text string (regex-based parsing)
 */
function parseFromText(
  text: string,
): RevealHandEffect | RevealTopCardEffect | Effect | null {
  logger.debug("Attempting to parse reveal effect from text", { text });

  // Pattern: "reveal (your )?(hand|top card|X cards)"
  const revealHandPattern = /reveal\s+(?:your\s+)?hand/i;
  const revealTopCardPattern = /reveal\s+the\s+top\s+card/i;

  // Check for "reveal hand"
  if (revealHandPattern.test(text)) {
    const target: PlayerTarget = text.includes("opponent")
      ? "OPPONENT"
      : "CONTROLLER";

    logger.info("Parsed reveal hand effect", { target });

    const effect: RevealHandEffect = {
      type: "reveal-hand",
      target,
    };
    return effect;
  }

  // Check for "reveal top card"
  if (revealTopCardPattern.test(text)) {
    const target: PlayerTarget = text.includes("opponent")
      ? "OPPONENT"
      : "CONTROLLER";

    logger.info("Parsed reveal top card effect", { target });

    const effect: RevealTopCardEffect = {
      type: "reveal-top-card",
      target,
    };
    return effect;
  }

  logger.debug("Reveal effect pattern did not match");
  return null;
}

/**
 * Reveal effect parser implementation
 */
export const revealEffectParser: EffectParser = {
  pattern: /reveal\s+(?:your\s+)?(?:hand|top|the|cards?)/i,
  description:
    "Parses reveal effects (e.g., 'reveal your hand', 'reveal the top card')",

  parse: (
    input: CstNode | string,
  ): RevealHandEffect | RevealTopCardEffect | Effect | null => {
    if (typeof input === "string") {
      return parseFromText(input);
    }
    // CST parsing not implemented yet for reveal effects
    logger.warn("CST parsing not implemented for reveal effects");
    return null;
  },
};
