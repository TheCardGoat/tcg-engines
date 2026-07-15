/**
 * Remove Damage Effect Parser
 * Handles remove damage effects like "Remove up to 3 damage from chosen character"
 */

import type { CstNode, IToken } from "chevrotain";
import { logger } from "../../logging";
import type { CharacterTarget, RemoveDamageEffect } from "../../types";
import { parseTargetFromText } from "../../visitors/target-visitor";
import type { EffectParser } from "./index";

/**
 * Convert simple Target format to CharacterTargetQuery
 * Copied from damage-effect.ts for consistency
 */
function convertToCharacterTarget(simpleTarget: {
  type: string;
  modifier?: string;
}): CharacterTarget {
  const { type, modifier } = simpleTarget;

  // Map card type to proper name
  const cardTypeMap: Record<string, string> = {
    card: "card",
    character: "character",
    item: "item",
    location: "location",
  };

  const cardType = cardTypeMap[type.toLowerCase()] || type;

  // Map modifier to selector and owner
  const modifierMap: Record<string, { selector: string; owner: string; count: number | "all" }> = {
    all: { count: "all", owner: "any", selector: "all" },
    an: { count: 1, owner: "any", selector: "chosen" },
    another: { count: 1, owner: "any", selector: "chosen" },
    chosen: { count: 1, owner: "any", selector: "chosen" },
    "chosen opposing": { count: 1, owner: "opponent", selector: "chosen" },
    each: { count: "all", owner: "any", selector: "all" },
    opponent: { count: "all", owner: "opponent", selector: "all" },
    "opponent's": { count: "all", owner: "opponent", selector: "all" },
    opposing: { count: "all", owner: "opponent", selector: "all" },
    other: { count: "all", owner: "any", selector: "all" },
    them: { count: 1, owner: "opponent", selector: "chosen" },
    this: { count: 1, owner: "any", selector: "self" },
    your: { count: "all", owner: "you", selector: "all" },
  };

  const mapping = modifier
    ? modifierMap[modifier.toLowerCase()] ||
      modifierMap[modifier.toLowerCase() + " " + type.toLowerCase()]
    : modifierMap["chosen"];

  // If no mapping found, default to chosen
  const { selector, owner, count } = mapping || modifierMap.chosen;

  return {
    cardTypes: [cardType],
    count,
    owner: owner as any,
    selector: selector as any,
    zones: ["play"],
  };
}

/**
 * Parse remove damage effect from CST node (grammar-based parsing)
 */
function parseFromCst(
  ctx:
    | {
        NumberToken?: IToken[];
        [key: string]: unknown;
      }
    | null
    | undefined,
): RemoveDamageEffect | null {
  logger.debug("Attempting to parse remove damage effect from CST", { ctx });

  if (!(ctx && ctx.NumberToken) || ctx.NumberToken.length === 0) {
    logger.debug("Remove damage effect CST missing NumberToken or invalid context");
    return null;
  }

  const amount = Number.parseInt(ctx.NumberToken[0].image, 10);

  if (Number.isNaN(amount)) {
    logger.warn("Failed to parse number from remove damage effect CST", {
      image: ctx.NumberToken[0].image,
    });
    return null;
  }

  logger.info("Parsed remove damage effect from CST", { amount });

  return {
    amount,
    target: "CHOSEN_CHARACTER",
    type: "remove-damage",
  };
}

/**
 * Parse remove damage effect from text string (regex-based parsing)
 */
function parseFromText(text: string): RemoveDamageEffect | null {
  logger.debug("Attempting to parse remove damage effect from text", { text });

  // Try "remove up to N damage from X" pattern (with {d} placeholder support)
  const removeUpToPattern = /remove\s+up\s+to\s+(\d+|\{d\})\s+damage\s+from\s+(.+)/i;
  const upToMatch = text.match(removeUpToPattern);

  if (upToMatch) {
    const amountValue = upToMatch[1];
    const amount = amountValue === "{d}" ? -1 : Number.parseInt(amountValue, 10);

    if (Number.isNaN(amount)) {
      logger.warn("Failed to extract number from remove damage effect text", {
        match: amountValue,
      });
      return null;
    }

    const targetText = upToMatch[2].trim();
    const simpleTarget = parseTargetFromText(targetText);
    const target = simpleTarget ? convertToCharacterTarget(simpleTarget) : "CHOSEN_CHARACTER";

    logger.info("Parsed remove damage effect from text (up to pattern)", {
      amount,
      target,
    });

    const effect: RemoveDamageEffect = {
      amount,
      target,
      type: "remove-damage",
      upTo: true,
    };

    return effect;
  }

  // Try "remove N damage from X" pattern (with {d} placeholder support)
  const removePattern = /remove\s+(\d+|\{d\})\s+damage\s+from\s+(.+)/i;
  const match = text.match(removePattern);

  if (!match) {
    logger.debug("Remove damage effect pattern did not match");
    return null;
  }

  const amountValue = match[1];
  const amount = amountValue === "{d}" ? -1 : Number.parseInt(amountValue, 10);

  if (Number.isNaN(amount)) {
    logger.warn("Failed to extract number from remove damage effect text", {
      match: amountValue,
    });
    return null;
  }

  const targetText = match[2].trim();
  const simpleTarget = parseTargetFromText(targetText);
  const target = simpleTarget ? convertToCharacterTarget(simpleTarget) : "CHOSEN_CHARACTER";

  logger.info("Parsed remove damage effect from text", { amount, target });

  return {
    amount,
    target,
    type: "remove-damage",
  };
}

/**
 * Remove damage effect parser implementation
 */
export const removeDamageEffectParser: EffectParser = {
  description:
    "Parses remove damage effects (e.g., 'remove 3 damage from chosen character', 'remove {d} damage')",
  parse: (input: CstNode | string): RemoveDamageEffect | null => {
    if (typeof input === "string") {
      return parseFromText(input);
    }
    return parseFromCst(input as { NumberToken?: IToken[] } | null | undefined);
  },

  pattern: /remove\s+(\d+|\{d\})\s+damage\s+from/i,
};
