/**
 * Play Effect Parser
 * Handles play card effects like "play a card" or "play for free"
 */

import type { CstNode } from "chevrotain";
import { logger } from "../../logging";
import type { CardType, PlayCardEffect } from "../../types";
import { parseCardType } from "../utils";
import type { EffectParser } from "./index";

/**
 * Parse play effect from text string (regex-based parsing)
 */
function parseFromText(text: string): PlayCardEffect | null {
  logger.debug("Attempting to parse play effect from text", { text });

  // Pattern: "play [a|an|the]? (character|action|item|card|...) (for free)?"
  // Articles (a, an, the) are optional and skipped when capturing the card type
  const playPattern =
    /play\s+(?:(?:a|an|the)\s+)?(\w+)(?:\s+(\w+))?\s*(?:card)?(?:\s+for\s+free)?/i;
  const playFromDiscardPattern = /play\s+.*?from\s+(?:your\s+)?discard/i;
  const playCostXPattern = /play\s+(?:a\s+)?.*?\s+(?:that\s+)?costs?\s+(\d+)/i;

  // Check for "play from discard"
  if (playFromDiscardPattern.test(text)) {
    const isFree = text.includes("for free");
    const cardTypeMatch = text.match(
      /play\s+(?:a\s+)?(\w+)\s+(?:card\s+)?from/i,
    );
    const cardTypeStr = cardTypeMatch
      ? cardTypeMatch[1].toLowerCase()
      : undefined;
    const cardType = cardTypeStr ? parseCardType(cardTypeStr) : undefined;

    logger.info("Parsed play from discard effect", { cardType, isFree });

    const effect: PlayCardEffect = {
      from: "discard",
      type: "play-card",
    };
    if (cardType) {
      effect.cardType = cardType;
    }
    if (isFree) {
      effect.cost = "free";
    }
    return effect;
  }

  // Check for "play cost X or less for free"
  if (playCostXPattern.test(text) && text.includes("for free")) {
    const match = text.match(playCostXPattern);
    if (match) {
      const maxCost = Number.parseInt(match[1], 10);

      logger.info("Parsed play cost X or less for free effect", { maxCost });

      const effect: PlayCardEffect = {
        cost: "free",
        costRestriction: { comparison: "less-or-equal", value: maxCost },
        from: "hand",
        type: "play-card",
      };
      return effect;
    }
  }

  // General play pattern
  const match = text.match(playPattern);
  if (!match) {
    logger.debug("Play effect pattern did not match");
    return null;
  }

  // Match[1] is the first word after the article (e.g., "action" from "play an action")
  // Match[2] is an optional second word (e.g., "born" from "play a floodborn")
  const cardTypeStr = match[1].toLowerCase();
  const cardType = parseCardType(cardTypeStr);
  const isFree = text.includes("for free");

  logger.info("Parsed play effect from text", { cardType, isFree });

  const effect: PlayCardEffect = {
    from: "hand",
    type: "play-card",
  };
  if (cardType) {
    effect.cardType = cardType;
  }
  if (isFree) {
    effect.cost = "free";
  }
  return effect;
}

/**
 * Play effect parser implementation
 */
export const playEffectParser: EffectParser = {
  description:
    "Parses play card effects (e.g., 'play a character for free', 'play from discard')",
  parse: (input: CstNode | string): PlayCardEffect | null => {
    if (typeof input === "string") {
      return parseFromText(input);
    }
    // CST parsing not implemented yet for play effects
    logger.warn("CST parsing not implemented for play effects");
    return null;
  },

  pattern:
    /play\s+(?:a\s+)?(?:character|action|item|card)|play\s+.*?from\s+discard/i,
};
