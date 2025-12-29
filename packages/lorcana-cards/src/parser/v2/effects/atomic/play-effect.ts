/**
 * Play Effect Parser
 * Handles play card effects like "play a card" or "play for free"
 */

import type { CstNode } from "chevrotain";
import { logger } from "../../logging";
import type { Effect } from "../../types";
import type { EffectParser } from "./index";

/**
 * Parse play effect from text string (regex-based parsing)
 */
function parseFromText(text: string): Effect | null {
  logger.debug("Attempting to parse play effect from text", { text });

  // Pattern: "play (a )?(character|action|item|card|...) (for free)?"
  const playPattern =
    /play\s+(?:a\s+)?(\w+(?:\s+\w+)?)\s*(?:card)?(?:\s+for\s+free)?/i;
  const playFromDiscardPattern = /play\s+.*?from\s+(?:your\s+)?discard/i;
  const playCostXPattern = /play\s+(?:a\s+)?.*?\s+(?:that\s+)?costs?\s+(\d+)/i;

  // Check for "play from discard"
  if (playFromDiscardPattern.test(text)) {
    const isFree = text.includes("for free");
    const cardTypeMatch = text.match(
      /play\s+(?:a\s+)?(\w+)\s+(?:card\s+)?from/i,
    );
    const cardType = cardTypeMatch ? cardTypeMatch[1].toLowerCase() : undefined;

    logger.info("Parsed play from discard effect", { cardType, isFree });

    return {
      type: "play-card",
      from: "discard",
      cardType,
      cost: isFree ? "free" : "normal",
    };
  }

  // Check for "play cost X or less for free"
  if (playCostXPattern.test(text) && text.includes("for free")) {
    const match = text.match(playCostXPattern);
    if (match) {
      const maxCost = Number.parseInt(match[1], 10);

      logger.info("Parsed play cost X or less for free effect", { maxCost });

      return {
        type: "play-card",
        cost: "free",
        filter: { cost: { lte: maxCost } },
      };
    }
  }

  // General play pattern
  const match = text.match(playPattern);
  if (!match) {
    logger.debug("Play effect pattern did not match");
    return null;
  }

  const cardType = match[1].toLowerCase();
  const isFree = text.includes("for free");

  logger.info("Parsed play effect from text", { cardType, isFree });

  return {
    type: "play-card",
    cardType,
    cost: isFree ? "free" : "normal",
  };
}

/**
 * Play effect parser implementation
 */
export const playEffectParser: EffectParser = {
  pattern:
    /play\s+(?:a\s+)?(?:character|action|item|card)|play\s+.*?from\s+discard/i,
  description:
    "Parses play card effects (e.g., 'play a character for free', 'play from discard')",

  parse: (input: CstNode | string): Effect | null => {
    if (typeof input === "string") {
      return parseFromText(input);
    }
    // CST parsing not implemented yet for play effects
    logger.warn("CST parsing not implemented for play effects");
    return null;
  },
};
