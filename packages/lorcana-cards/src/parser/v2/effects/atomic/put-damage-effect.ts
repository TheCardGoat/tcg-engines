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
type PutDamageEffect = {
  type: "put-damage";
  amount: number;
  target: CharacterTarget;
};

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
    them: { selector: "chosen", owner: "opponent", count: 1 },
  };

  const mapping = modifier
    ? modifierMap[modifier.toLowerCase()] ||
      modifierMap[modifier.toLowerCase() + " " + type.toLowerCase()]
    : modifierMap["chosen"];

  // If no mapping found, default to chosen
  const { selector, owner, count } = mapping || modifierMap.chosen;

  return {
    selector: selector as any,
    count,
    owner: owner as any,
    zones: ["play"],
    cardTypes: [cardType],
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
    logger.debug(
      "Put damage effect CST missing NumberToken or invalid context",
    );
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
    type: "put-damage",
    amount,
    target: "CHOSEN_CHARACTER",
  };
}

/**
 * Parse put damage effect from text string (regex-based parsing)
 */
function parseFromText(text: string): PutDamageEffect | null {
  logger.debug("Attempting to parse put damage effect from text", { text });

  // Pattern for both numeric amounts and {d} placeholders
  // Supports "put N damage counters on X" and "put N damage counter on X" (singular)
  const pattern =
    /put\s+(\d+|\{d\})\s+damage\s+counters?\s+(?:on|to)\s+(.+?)(?:\.|,|$)/i;
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
    type: "put-damage",
    amount,
    target,
  };
}

/**
 * Put damage effect parser implementation
 */
export const putDamageEffectParser: EffectParser = {
  pattern: /put\s+(\d+|\{d\})\s+damage\s+counters?/i,
  description:
    "Parses put damage effects (e.g., 'put 3 damage counters on chosen character', 'put {d} damage counters')",

  parse: (input: CstNode | string): PutDamageEffect | null => {
    if (typeof input === "string") {
      return parseFromText(input);
    }
    return parseFromCst(input as { NumberToken?: IToken[] } | null | undefined);
  },
};
