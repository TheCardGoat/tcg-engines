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
import { parseTargetFromText } from "../../visitors/target-visitor";
import { parseCardType } from "../utils";
import type { EffectParser } from "./index";

/**
 * Convert simple Target format to CharacterTargetQuery
 * Copied from banish-effect.ts for consistency
 */
function convertToCharacterTarget(simpleTarget: {
  type: string;
  modifier?: string;
}): CharacterTarget {
  const { type, modifier } = simpleTarget;

  // Map card type to proper name
  const cardTypeMap: Record<string, string> = {
    character: "character",
    item: "item",
    location: "location",
    card: "card",
  };

  const cardType = cardTypeMap[type.toLowerCase()] || type;

  // Map modifier to selector and owner
  const modifierMap: Record<
    string,
    { selector: string; owner: string; count: number | "all" }
  > = {
    chosen: { selector: "chosen", owner: "any", count: 1 },
    "chosen opposing": { selector: "chosen", owner: "opponent", count: 1 },
    this: { selector: "self", owner: "any", count: 1 },
    your: { selector: "all", owner: "you", count: "all" },
    opponent: { selector: "all", owner: "opponent", count: "all" },
    "opponent's": { selector: "all", owner: "opponent", count: "all" },
    opposing: { selector: "all", owner: "opponent", count: "all" },
    another: { selector: "chosen", owner: "any", count: 1 },
    an: { selector: "chosen", owner: "any", count: 1 },
    each: { selector: "all", owner: "any", count: "all" },
    all: { selector: "all", owner: "any", count: "all" },
    other: { selector: "all", owner: "any", count: "all" },
  };

  const mapping = modifier
    ? modifierMap[modifier.toLowerCase()] ||
      modifierMap[modifier.toLowerCase() + " " + type.toLowerCase()]
    : modifierMap["chosen"];

  // If no mapping found, default to chosen
  const { selector, owner, count } = mapping || modifierMap.chosen;

  return {
    selector: selector as "chosen" | "all" | "self",
    count,
    owner: owner as "you" | "opponent" | "any",
    zones: ["play"],
    cardTypes: [cardType],
  } as CharacterTarget;
}

/**
 * Parse return effect from text string (regex-based parsing)
 */
function parseFromText(text: string): Effect | null {
  logger.debug("Attempting to parse return effect from text", { text });

  // Patterns for return effects
  const returnToHandPattern =
    /return\s+(.+?)\s+to\s+(?:(?:your|their|player's)(?:\s+player's)?\s+)?hand|return\s+to\s+(?:your\s+|their\s+)?hand/i;
  const shuffleIntoDeckPattern =
    /shuffle\s+(.+?)\s+into\s+(?:your\s+|their\s+)?deck|shuffle\s+into\s+(?:your\s+|their\s+)?deck/i;
  const returnFromDiscardPattern =
    /return\s+(?:an?\s+)?(\w+)\s+card\s+from\s+your\s+discard/i;
  const putOnBottomPattern = /put\s+(.+?)\s+(?:on\s+)?(?:the\s+)?bottom/i;

  // Check for "return from discard"
  if (returnFromDiscardPattern.test(text)) {
    const match = text.match(returnFromDiscardPattern);
    if (match) {
      const cardTypeStr = match[1].toLowerCase();
      const cardType = parseCardType(cardTypeStr);

      logger.info("Parsed return from discard effect", { cardType });

      const effect: ReturnFromDiscardEffect = {
        type: "return-from-discard",
        target: "CONTROLLER",
      };
      // Only assign valid card types for ReturnFromDiscardEffect (excludes floodborn)
      if (cardType && cardType !== "floodborn") {
        effect.cardType = cardType as CardType;
      }
      return effect;
    }
  }

  // Check for "shuffle into deck"
  if (shuffleIntoDeckPattern.test(text)) {
    // Try to match with target first
    const match = text.match(
      /shuffle\s+(.+?)\s+into\s+(?:your\s+|their\s+)?deck/i,
    );
    let target: CharacterTarget = "CHOSEN_CHARACTER";

    if (match && match[1]) {
      const targetType = match[1].toLowerCase();
      if (/this card|this character/i.test(targetType)) {
        target = "SELF";
      } else {
        const parsedTarget = parseTargetFromText(match[1]);
        if (parsedTarget) {
          target = convertToCharacterTarget(parsedTarget);
        }
      }
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
    const match = text.match(putOnBottomPattern);
    let target: CharacterTarget = "CHOSEN_CHARACTER";

    if (match && match[1]) {
      const targetType = match[1].toLowerCase();
      if (/this card|this character/i.test(targetType)) {
        target = "SELF";
      } else {
        const parsedTarget = parseTargetFromText(match[1]);
        if (parsedTarget) {
          target = convertToCharacterTarget(parsedTarget);
        }
      }
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
    // Try to match with target first
    const match = text.match(
      /return\s+(.+?)\s+to\s+(?:(?:your|their|player's)(?:\s+player's)?\s+)?hand/i,
    );
    let target: CharacterTarget = "CHOSEN_CHARACTER";

    if (match && match[1]) {
      const targetType = match[1].toLowerCase();
      if (/this card|this character/i.test(targetType)) {
        target = "SELF";
      } else {
        const parsedTarget = parseTargetFromText(match[1]);
        if (parsedTarget) {
          target = convertToCharacterTarget(parsedTarget);
        }
      }
    }

    logger.info("Parsed return to hand effect", { target });

    const effect: ReturnToHandEffect = {
      type: "return-to-hand",
      target: target as CardTarget,
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
