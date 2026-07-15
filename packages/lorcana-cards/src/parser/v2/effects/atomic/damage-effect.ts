/**
 * Damage Effect Parser
 * Handles damage effects like "deal 2 damage to chosen character"
 */

import type { CstNode, IToken } from "chevrotain";
import { logger } from "../../logging";
import type { CharacterTarget, DealDamageEffect } from "../../types";
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
 * Parse damage effect from CST node (grammar-based parsing)
 */
function parseFromCst(
  ctx:
    | {
        NumberToken?: IToken[];
        targetClause?: CstNode[];
        [key: string]: unknown;
      }
    | null
    | undefined,
): DealDamageEffect | null {
  logger.debug("Attempting to parse damage effect from CST", { ctx });

  if (!(ctx && ctx.NumberToken) || ctx.NumberToken.length === 0) {
    logger.debug("Damage effect CST missing NumberToken or invalid context");
    return null;
  }

  const amount = Number.parseInt(ctx.NumberToken[0].image, 10);

  if (Number.isNaN(amount)) {
    logger.warn("Failed to parse number from damage effect CST", {
      image: ctx.NumberToken[0].image,
    });
    return null;
  }

  // Parse target if present (will be added in grammar integration)
  const target: CharacterTarget = "CHOSEN_CHARACTER";
  if (ctx.targetClause) {
    logger.debug("Target clause found in damage effect CST");
    // Target parsing will be integrated when grammar rules are connected
  }

  logger.info("Parsed damage effect from CST", { amount, target });

  return {
    amount,
    target,
    type: "deal-damage",
  };
}

/**
 * Parse damage effect from text string (regex-based parsing)
 */
function parseFromText(text: string): DealDamageEffect | null {
  logger.debug("Attempting to parse damage effect from text", { text });

  // Pattern for both numeric amounts and {d} placeholders
  const pattern = /deal\s+(\d+|\{d\})\s+damage(?:\s+to\s+(.+?))?(?:\.|,|$)/i;
  const match = text.match(pattern);

  if (!match) {
    logger.debug("Damage effect pattern did not match");
    return null;
  }

  const amountValue = match[1];
  const amount = amountValue === "{d}" ? -1 : Number.parseInt(amountValue, 10);

  if (Number.isNaN(amount)) {
    logger.warn("Failed to extract number from damage effect text", {
      match: amountValue,
    });
    return null;
  }

  // Parse target if present, default to CHOSEN_CHARACTER
  let target: CharacterTarget = "CHOSEN_CHARACTER";
  if (match[2]) {
    const parsedTarget = parseTargetFromText(match[2]);
    if (parsedTarget) {
      target = convertToCharacterTarget(parsedTarget);
      logger.debug("Parsed target from damage effect text", { target });
    }
  }

  logger.info("Parsed damage effect from text", { amount, target });

  return {
    amount,
    target,
    type: "deal-damage",
  };
}

/**
 * Damage effect parser implementation
 */
export const damageEffectParser: EffectParser = {
  description:
    "Parses damage effects (e.g., 'deal 2 damage to chosen character', 'deal {d} damage')",
  parse: (input: CstNode | string): DealDamageEffect | null => {
    if (typeof input === "string") {
      return parseFromText(input);
    }
    return parseFromCst(
      input as { NumberToken?: IToken[]; targetClause?: CstNode[] } | null | undefined,
    );
  },

  pattern: /deal\s+(\d+|\{d\})\s+damage/i,
};
