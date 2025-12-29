/**
 * Reveal Effect Parser
 * Handles reveal effects like "reveal your hand" or "reveal the top card"
 */

import type { CstNode } from "chevrotain";
import { logger } from "../../logging";
import type { Effect } from "../../types";
import type { EffectParser } from "./index";

/**
 * Parse reveal effect from text string (regex-based parsing)
 */
function parseFromText(text: string): Effect | null {
  logger.debug("Attempting to parse reveal effect from text", { text });

  // Pattern: "reveal (your )?(hand|top card|X cards)"
  const revealHandPattern = /reveal\s+(?:your\s+)?hand/i;
  const revealTopCardPattern = /reveal\s+the\s+top\s+card/i;
  const revealCardsPattern = /reveal\s+(?:the\s+top\s+)?(\d+)\s+cards?/i;
  const revealAndPutPattern =
    /reveal\s+.*?\s+and\s+put\s+(?:it|them)\s+into\s+(?:your\s+)?hand/i;

  // Check for "reveal hand"
  if (revealHandPattern.test(text)) {
    const target = text.includes("opponent") ? "opponent" : "controller";

    logger.info("Parsed reveal hand effect", { target });

    return {
      type: "reveal-hand",
      target,
    };
  }

  // Check for "reveal and put in hand"
  if (revealAndPutPattern.test(text)) {
    logger.info("Parsed reveal and put in hand effect");

    return {
      type: "reveal-and-put-in-hand",
      from: "look-at",
    };
  }

  // Check for "reveal top card"
  if (revealTopCardPattern.test(text)) {
    logger.info("Parsed reveal top card effect");

    return {
      type: "reveal-top-card",
      amount: 1,
    };
  }

  // Check for "reveal X cards"
  const match = text.match(revealCardsPattern);
  if (match) {
    const amount = Number.parseInt(match[1], 10);

    logger.info("Parsed reveal cards effect", { amount });

    return {
      type: "reveal-cards",
      amount,
      from: "top-of-deck",
    };
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

  parse: (input: CstNode | string): Effect | null => {
    if (typeof input === "string") {
      return parseFromText(input);
    }
    // CST parsing not implemented yet for reveal effects
    logger.warn("CST parsing not implemented for reveal effects");
    return null;
  },
};
