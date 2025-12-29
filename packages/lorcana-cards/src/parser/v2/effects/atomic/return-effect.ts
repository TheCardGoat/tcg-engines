/**
 * Return Effect Parser
 * Handles return effects like "return to hand", "return from discard", and "shuffle into deck"
 */

import type { CstNode } from "chevrotain";
import { logger } from "../../logging";
import type {
  CardTarget,
  CardType,
  CharacterTarget,
  Effect,
  PutOnBottomEffect,
  ReturnFromDiscardEffect,
  ReturnToHandEffect,
  ShuffleIntoDeckEffect,
} from "../../types";
import type { EffectParser } from "./index";

/**
 * Parse return effect from text string (regex-based parsing)
 */
function parseFromText(text: string): Effect | null {
  logger.debug("Attempting to parse return effect from text", { text });

  // Patterns for return effects
  const returnToHandPattern = /return.*?to\s+(?:your\s+|their\s+)?hand/i;
  const shuffleIntoDeckPattern = /shuffle.*?into\s+(?:your\s+|their\s+)?deck/i;
  const returnFromDiscardPattern =
    /return\s+(?:an?\s+)?(\w+)\s+card\s+from\s+your\s+discard/i;
  const putOnBottomPattern = /put.*?(?:on\s+)?(?:the\s+)?bottom(?:\s+of)?/i;

  // Check for "return from discard"
  if (returnFromDiscardPattern.test(text)) {
    const match = text.match(returnFromDiscardPattern);
    if (match) {
      const cardTypeStr = match[1].toLowerCase();
      // Map to valid CardType or undefined
      const cardType: CardType | undefined =
        cardTypeStr === "character" ||
        cardTypeStr === "action" ||
        cardTypeStr === "item" ||
        cardTypeStr === "location"
          ? (cardTypeStr as CardType)
          : undefined;

      logger.info("Parsed return from discard effect", { cardType });

      const effect: ReturnFromDiscardEffect = {
        type: "return-from-discard",
        target: "CONTROLLER",
      };
      if (cardType) {
        effect.cardType = cardType;
      }
      return effect;
    }
  }

  // Check for "shuffle into deck"
  if (shuffleIntoDeckPattern.test(text)) {
    let target: CharacterTarget = "CHOSEN_CHARACTER";

    if (text.includes("this card") || text.includes("this character")) {
      target = "SELF";
    }

    logger.info("Parsed shuffle into deck effect", { target });

    const effect: ShuffleIntoDeckEffect = {
      type: "shuffle-into-deck",
      target,
      intoDeck: "owner",
    };
    return effect;
  }

  // Check for "put on bottom"
  if (putOnBottomPattern.test(text)) {
    let target: CharacterTarget = "CHOSEN_CHARACTER";

    if (text.includes("this card") || text.includes("this character")) {
      target = "SELF";
    }

    logger.info("Parsed put on bottom effect", { target });

    const effect: PutOnBottomEffect = {
      type: "put-on-bottom",
      target,
    };
    return effect;
  }

  // Check for "return to hand"
  if (returnToHandPattern.test(text)) {
    let target: CardTarget = "CHOSEN_CHARACTER";

    if (text.includes("this card") || text.includes("this character")) {
      target = "SELF";
    }

    logger.info("Parsed return to hand effect", { target });

    const effect: ReturnToHandEffect = {
      type: "return-to-hand",
      target,
    };
    return effect;
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
