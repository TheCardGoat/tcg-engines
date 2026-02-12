/**
 * Put Damage Effect Parser
 * Handles put damage counters effects like "Put 3 damage counters on chosen character"
 */

import type { CstNode, IToken } from "chevrotain";
import { logger } from "../../logging";
import type { CharacterTarget } from "../../types";
import { parseTargetFromText } from "../../visitors/target-visitor";
import type { EffectParser } from "./index";

// PutDamageEffect is not exported from types, use DealDamageEffect as alias
interface PutDamageEffect {
  type: "put-damage";
  amount: number;
  target: CharacterTarget;
}

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
 * Parse put damage effect from CST node (grammar-based parsing)
 */
function parseFromCst(
  ctx:
    | {
        NumberToken?: IToken[];
        [key: string]: unknown;
      }
    | null
    | undefined,
): PutDamageEffect | null {
  logger.debug("Attempting to parse put damage effect from CST", { ctx });

  if (!(ctx && ctx.NumberToken) || ctx.NumberToken.length === 0) {
    logger.debug("Put damage effect CST missing NumberToken or invalid context");
    return null;
  }

  const amount = Number.parseInt(ctx.NumberToken[0].image, 10);

  if (Number.isNaN(amount)) {
    logger.warn("Failed to parse number from put damage effect CST", {
      image: ctx.NumberToken[0].image,
    });
    return null;
  }

  logger.info("Parsed put damage effect from CST", { amount });

  return {
    amount,
    target: "CHOSEN_CHARACTER",
    type: "put-damage",
  };
}

/**
 * Parse put damage effect from text string (regex-based parsing)
 */
function parseFromText(text: string): PutDamageEffect | null {
  logger.debug("Attempting to parse put damage effect from text", { text });

  // Pattern for both numeric amounts and {d} placeholders
  // Supports "put N damage counters on X" and "put N damage counter on X" (singular)
  const pattern = /put\s+(\d+|\{d\})\s+damage\s+counters?\s+(?:on|to)\s+(.+?)(?:\.|,|$)/i;
  const match = text.match(pattern);

  if (!match) {
    logger.debug("Put damage effect pattern did not match");
    return null;
  }

  const amountValue = match[1];
  const amount = amountValue === "{d}" ? -1 : Number.parseInt(amountValue, 10);

  if (Number.isNaN(amount)) {
    logger.warn("Failed to extract number from put damage effect text", {
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
      logger.debug("Parsed target from put damage effect text", { target });
    }
  }

  logger.info("Parsed put damage effect from text", { amount, target });

  return {
    amount,
    target,
    type: "put-damage",
  };
}

/**
 * Put damage effect parser implementation
 */
export const putDamageEffectParser: EffectParser = {
  description:
    "Parses put damage effects (e.g., 'put 3 damage counters on chosen character', 'put {d} damage counters')",
  parse: (input: CstNode | string): PutDamageEffect | null => {
    if (typeof input === "string") {
      return parseFromText(input);
    }
    return parseFromCst(input as { NumberToken?: IToken[] } | null | undefined);
  },

  pattern: /put\s+(\d+|\{d\})\s+damage\s+counters?/i,
};
