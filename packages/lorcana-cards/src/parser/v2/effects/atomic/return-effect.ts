/**
 * Return Effect Parser
 * Handles return effects like "return to hand", "return to deck", and "shuffle into deck"
 */

import type { CstNode } from "chevrotain";
import { logger } from "../../logging";
import type { Effect } from "../../types";
import type { EffectParser } from "./index";

/**
 * Parse return effect from text string (regex-based parsing)
 */
function parseFromText(text: string): Effect | null {
  logger.debug("Attempting to parse return effect from text", { text });

  // Patterns for return effects
  const returnToHandPattern = /return.*?to\s+(?:your\s+|their\s+)?hand/i;
  const returnToDeckPattern = /return.*?to\s+(?:your\s+|their\s+)?deck/i;
  const shuffleIntoDeckPattern = /shuffle.*?into\s+(?:your\s+|their\s+)?deck/i;
  const returnFromDiscardPattern =
    /return\s+(?:a\s+)?(\w+)\s+card\s+from\s+your\s+discard/i;
  const returnCostXPattern =
    /return\s+chosen\s+(?:character|item).*?costs?\s+(\d+)/i;

  // Check for "return from discard"
  if (returnFromDiscardPattern.test(text)) {
    const match = text.match(returnFromDiscardPattern);
    if (match) {
      const cardType = match[1].toLowerCase();

      logger.info("Parsed return from discard effect", { cardType });

      return {
        type: "return-from-discard",
        cardType,
        target: "controller",
      };
    }
  }

  // Check for "return cost X or less"
  if (returnCostXPattern.test(text) && returnToHandPattern.test(text)) {
    const match = text.match(returnCostXPattern);
    if (match) {
      const maxCost = Number.parseInt(match[1], 10);

      logger.info("Parsed return cost X or less effect", { maxCost });

      return {
        type: "return-to-hand",
        target: "chosen-character-or-item",
        filter: { cost: { lte: maxCost } },
      };
    }
  }

  // Check for "shuffle into deck"
  if (shuffleIntoDeckPattern.test(text)) {
    let target = "chosen-character";

    if (text.includes("card from any discard")) {
      target = "card-from-discard";
    } else if (text.includes("chosen character")) {
      target = "chosen-character";
    } else if (text.includes("this card")) {
      target = "self";
    }

    logger.info("Parsed shuffle into deck effect", { target });

    return {
      type: "shuffle-into-deck",
      target,
      intoDeck: "owner",
    };
  }

  // Check for "return to deck"
  if (returnToDeckPattern.test(text)) {
    let target = "chosen-character";

    if (text.includes("this card")) {
      target = "self";
    } else if (text.includes("that card")) {
      target = "referenced";
    }

    const toTop = text.includes("on top") || text.includes("to the top");

    logger.info("Parsed return to deck effect", { target, toTop });

    return {
      type: "return-to-deck",
      target,
      position: toTop ? "top" : "bottom",
    };
  }

  // Check for "return to hand"
  if (returnToHandPattern.test(text)) {
    let target = "chosen-character";

    if (text.includes("this card")) {
      target = "self";
    } else if (text.includes("that card")) {
      target = "referenced";
    } else if (text.includes("chosen character")) {
      target = "chosen-character";
    }

    logger.info("Parsed return to hand effect", { target });

    return {
      type: "return-to-hand",
      target,
    };
  }

  logger.debug("Return effect pattern did not match");
  return null;
}

/**
 * Return effect parser implementation
 */
export const returnEffectParser: EffectParser = {
  pattern: /return.*?to\s+(?:hand|deck)|shuffle.*?into\s+deck/i,
  description:
    "Parses return effects (e.g., 'return to hand', 'shuffle into deck')",

  parse: (input: CstNode | string): Effect | null => {
    if (typeof input === "string") {
      return parseFromText(input);
    }
    // CST parsing not implemented yet for return effects
    logger.warn("CST parsing not implemented for return effects");
    return null;
  },
};
