/**
 * Search Effect Parser
 * Handles search deck effects like "search your deck" and "look at top X cards"
 */

import type { CstNode } from "chevrotain";
import { logger } from "../../logging";
import type {
  LookAtCardsEffect,
  LookAtFollowUp,
  PlayerTarget,
  SearchDeckEffect,
} from "../../types";
import { parseCardType } from "../utils";
import type { EffectParser } from "./index";

/**
 * Parse search effect from text string (regex-based parsing)
 */
function parseFromText(
  text: string,
): SearchDeckEffect | LookAtCardsEffect | null {
  logger.debug("Attempting to parse search effect from text", { text });

  // Patterns for search effects
  const searchAndShufflePattern =
    /search\s+your\s+deck\s+for\s+(?:a\s+)?(\w+).*?shuffle/i;
  const searchDeckPutPattern =
    /search\s+your\s+deck\s+for\s+(?:a\s+)?(\w+).*?put/i;
  const searchDeckPattern = /search\s+your\s+deck\s+for\s+(?:a\s+)?(\w+)/i;

  // Patterns for look at effects
  const lookAtFullPattern =
    /look\s+at\s+the\s+top\s+(\d+)\s+cards?\s+of\s+your\s+deck.*?put\s+(\d+)/i;
  const lookAtTopPattern = /look\s+at\s+the\s+top\s+(\d+)\s+cards?\s+of/i;

  // Check for "search deck and shuffle"
  if (searchAndShufflePattern.test(text)) {
    const match = text.match(searchAndShufflePattern);
    if (match) {
      const cardTypeStr = match[1].toLowerCase();
      const cardType = parseCardType(cardTypeStr);

      logger.info("Parsed search deck and shuffle effect", { cardType });

      const effect: SearchDeckEffect = {
        type: "search-deck",
        putInto: "hand",
        shuffle: true,
      };
      if (cardType) {
        effect.cardType = cardType;
      }
      return effect;
    }
  }

  // Check for "search deck and put"
  if (searchDeckPutPattern.test(text)) {
    const match = text.match(searchDeckPutPattern);
    if (match) {
      const cardTypeStr = match[1].toLowerCase();
      const cardType = parseCardType(cardTypeStr);
      let putInto: "hand" | "top-of-deck" | "play" = "hand";

      if (text.includes("into play")) {
        putInto = "play";
      } else if (text.includes("on top")) {
        putInto = "top-of-deck";
      }

      logger.info("Parsed search deck and put effect", { cardType, putInto });

      const effect: SearchDeckEffect = {
        type: "search-deck",
        putInto,
        shuffle: false,
      };
      if (cardType) {
        effect.cardType = cardType;
      }
      return effect;
    }
  }

  // Check for basic "search deck"
  if (searchDeckPattern.test(text)) {
    const match = text.match(searchDeckPattern);
    if (match) {
      const cardTypeStr = match[1].toLowerCase();
      const cardType = parseCardType(cardTypeStr);

      logger.info("Parsed search deck effect", { cardType });

      const effect: SearchDeckEffect = {
        type: "search-deck",
        putInto: "hand",
        shuffle: false,
      };
      if (cardType) {
        effect.cardType = cardType;
      }
      return effect;
    }
  }

  // Check for "look at cards with follow-up"
  if (lookAtFullPattern.test(text)) {
    const match = text.match(lookAtFullPattern);
    if (match) {
      const amount = Number.parseInt(match[1], 10);
      const count = Number.parseInt(match[2], 10);

      let thenAction: LookAtFollowUp["action"] = "put-in-hand";

      if (text.includes("into your hand")) {
        thenAction = "put-in-hand";
      } else if (text.includes("on top") || text.includes("on the top")) {
        thenAction = "put-on-top";
      } else if (text.includes("on bottom") || text.includes("on the bottom")) {
        thenAction = "put-on-bottom";
      }

      logger.info("Parsed look at cards with action effect", {
        amount,
        count,
        thenAction,
      });

      const effect: LookAtCardsEffect = {
        type: "look-at-cards",
        amount,
        from: "top-of-deck",
        target: "CONTROLLER" as PlayerTarget,
        then: { action: thenAction, count },
      };
      return effect;
    }
  }

  // Check for basic "look at top X"
  if (lookAtTopPattern.test(text)) {
    const match = text.match(lookAtTopPattern);
    if (match) {
      const amount = Number.parseInt(match[1], 10);

      logger.info("Parsed look at top cards effect", { amount });

      const effect: LookAtCardsEffect = {
        type: "look-at-cards",
        amount,
        from: "top-of-deck",
        target: "CONTROLLER" as PlayerTarget,
      };
      return effect;
    }
  }

  logger.debug("Search effect pattern did not match");
  return null;
}

/**
 * Search effect parser implementation
 */
export const searchEffectParser: EffectParser = {
  pattern: /search\s+your\s+deck|look\s+at\s+the\s+top/i,
  description:
    "Parses search and look at effects (e.g., 'search your deck', 'look at the top 3 cards')",

  parse: (
    input: CstNode | string,
  ): SearchDeckEffect | LookAtCardsEffect | null => {
    if (typeof input === "string") {
      return parseFromText(input);
    }
    // CST parsing not implemented yet for search effects
    logger.warn("CST parsing not implemented for search effects");
    return null;
  },
};
