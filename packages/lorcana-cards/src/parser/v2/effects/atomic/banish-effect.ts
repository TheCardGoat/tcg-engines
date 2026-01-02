/**
 * Banish Effect Parser
 * Handles banish/return effects like "banish chosen character" or "return this character to hand"
 */

import type { CstNode, IToken } from "chevrotain";
import { logger } from "../../logging";
import type {
  BanishEffect,
  CardTarget,
  CharacterTarget,
  ReturnToHandEffect,
} from "../../types";
import { parseTargetFromText } from "../../visitors/target-visitor";
import type { EffectParser } from "./index";

/**
 * Convert simple Target format to CharacterTargetQuery
 * Copied from exert-effect.ts for consistency
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
    selector: selector as CharacterTarget["selector"],
    count,
    owner: owner as CharacterTarget["owner"],
    zones: ["play"],
    cardTypes: [cardType],
  };
}

/**
 * Parse "all X" pattern directly (e.g., "all items", "all opposing characters")
 */
function parseAllPattern(text: string): CharacterTarget | null {
  const lowerText = text.toLowerCase().trim();

  // Pattern: "all [cardTypes]" or "all [modifier] [cardTypes]"
  const allPattern = /^all(?:\s+(opposing|opponent's|opponent))?\s+(.+)$/;
  const match = lowerText.match(allPattern);

  if (!match) {
    return null;
  }

  const modifier = match[1];
  const cardTypeStr = match[2];

  // Map card types
  const cardTypeMap: Record<string, string[]> = {
    items: ["item"],
    item: ["item"],
    characters: ["character"],
    character: ["character"],
    locations: ["location"],
    location: ["location"],
    "actions or songs": ["action", "song"],
  };

  const cardTypes = cardTypeMap[cardTypeStr];
  if (!cardTypes) {
    logger.debug("Unknown card type in 'all' pattern", { cardTypeStr });
    return null;
  }

  // Determine owner from modifier
  let owner: CharacterTarget["owner"] = "any";
  if (
    modifier === "opposing" ||
    modifier === "opponent" ||
    modifier === "opponent's"
  ) {
    owner = "opponent";
  }

  return {
    selector: "all",
    count: "all",
    owner,
    zones: ["play"],
    cardTypes,
  };
}

/**
 * Parse banish effect from CST node (grammar-based parsing)
 */
function parseFromCst(
  ctx:
    | {
        Banish?: IToken[];
        Return?: IToken[];
        [key: string]: unknown;
      }
    | null
    | undefined,
): BanishEffect | ReturnToHandEffect | null {
  logger.debug("Attempting to parse banish effect from CST", { ctx });

  if (!ctx) {
    logger.debug("Banish effect CST has invalid context");
    return null;
  }

  const isBanish = ctx.Banish !== undefined;
  const isReturn = ctx.Return !== undefined;

  if (!(isBanish || isReturn)) {
    logger.debug("Banish effect CST missing Banish or Return token");
    return null;
  }

  logger.info("Parsed banish effect from CST", { isBanish });

  if (isBanish) {
    return {
      type: "banish",
      target: "CHOSEN_CHARACTER" as CharacterTarget,
    };
  }
  return {
    type: "return-to-hand",
    target: "CHOSEN_CHARACTER" as CardTarget,
  };
}

/**
 * Parse banish effect from text string (regex-based parsing)
 */
function parseFromText(text: string): BanishEffect | ReturnToHandEffect | null {
  logger.debug("Attempting to parse banish effect from text", { text });

  // Match "banish [target]" or "return [target] to [destination]"
  const banishPattern = /^banish\s+(.+)$/i;
  const returnPattern = /^return\s+(.+?)\s+to\s+(?:hand|deck|bottom of deck)/i;

  let match = text.match(banishPattern);
  let isBanish = true;

  if (!match) {
    match = text.match(returnPattern);
    isBanish = false;
  }

  if (!match) {
    logger.debug("Banish effect pattern did not match");
    return null;
  }

  // Parse target from the matched text
  let target: CharacterTarget = "CHOSEN_CHARACTER";
  if (match[1]) {
    // First try to parse "all X" pattern
    const allPatternTarget = parseAllPattern(match[1]);
    if (allPatternTarget) {
      target = allPatternTarget;
      logger.debug("Parsed 'all' pattern target from banish effect text", {
        target,
      });
    } else {
      // Banish/return effects only support character and item types (except for "all" pattern which supports locations)
      // Check for unsupported types before parsing
      const targetType = match[1].toLowerCase();

      const parsedTarget = parseTargetFromText(match[1]);
      if (parsedTarget) {
        target = convertToCharacterTarget(parsedTarget);
        logger.debug("Parsed target from banish effect text", { target });
      } else {
        // If parseTargetFromText fails, check if the text looks like a valid target
        // For tests like "missing card type", we should return null
        if (isBanish) {
          // Check if match[1] contains a valid card type
          if (!/character|item|location/i.test(match[1])) {
            logger.debug("Banish effect missing valid card type");
            return null;
          }
        } else {
          // For return effects, also check for valid card type
          if (!/character|item/i.test(match[1])) {
            logger.debug("Return effect missing valid card type");
            return null;
          }
        }
      }
    }
  }

  logger.info("Parsed banish effect from text", { isBanish, target });

  if (isBanish) {
    return {
      type: "banish",
      target,
    };
  }
  return {
    type: "return-to-hand",
    target: target as CardTarget,
  };
}

/**
 * Banish effect parser implementation
 */
export const banishEffectParser: EffectParser = {
  pattern:
    /(banish|return)\s+(all|chosen|this|another|an?)\s+(character|item|location|items|characters|locations)/i,
  description:
    "Parses banish/return effects (e.g., 'banish chosen character', 'banish all items')",

  parse: (
    input: CstNode | string,
  ): BanishEffect | ReturnToHandEffect | null => {
    if (typeof input === "string") {
      return parseFromText(input);
    }
    return parseFromCst(
      input as { Banish?: IToken[]; Return?: IToken[] } | null | undefined,
    );
  },
};
