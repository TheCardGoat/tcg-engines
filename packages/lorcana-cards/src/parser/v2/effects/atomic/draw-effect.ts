/**
 * Draw Effect Parser
 * Handles draw card effects like "draw 2 cards", "Each player draws a card", "Each opponent draws 2 cards"
 */

import type { CstNode, IToken } from "chevrotain";
import { logger } from "../../logging";
import type { DrawEffect } from "../../types";
import type { EffectParser } from "./index";
import { D_PLACEHOLDER } from "./stat-mod-effect";

/**
 * Parse draw effect from CST node (grammar-based parsing)
 */
function parseFromCst(
  ctx:
    | {
        NumberToken?: IToken[];
        [key: string]: unknown;
      }
    | null
    | undefined,
): DrawEffect | null {
  logger.debug("Attempting to parse draw effect from CST", { ctx });

  if (!(ctx && ctx.NumberToken) || ctx.NumberToken.length === 0) {
    logger.debug("Draw effect CST missing NumberToken or invalid context");
    return null;
  }

  const amount = Number.parseInt(ctx.NumberToken[0].image, 10);

  if (Number.isNaN(amount)) {
    logger.warn("Failed to parse number from draw effect CST", {
      image: ctx.NumberToken[0].image,
    });
    return null;
  }

  logger.info("Parsed draw effect from CST", { amount });

  return {
    type: "draw",
    amount,
    target: "CONTROLLER",
  };
}

/**
 * Parse draw effect from text string (regex-based parsing)
 */
function parseFromText(text: string): DrawEffect | null {
  logger.debug("Attempting to parse draw effect from text", { text });

  // Determine target from text
  let target: DrawEffect["target"] = "CONTROLLER";

  if (/each player|all players/i.test(text)) {
    target = "EACH_PLAYER";
  } else if (/each opponent|all opponents/i.test(text)) {
    target = "EACH_OPPONENT";
  } else if (/chosen player/i.test(text)) {
    target = "CHOSEN_PLAYER";
  } else if (/opponent draws/i.test(text)) {
    target = "OPPONENT";
  }

  // Try "draw N cards" pattern first (including {d} placeholder)
  let pattern = /draws?\s+(\d+|\{d\})\s+cards?/i;
  let match = text.match(pattern);

  // Try "draw a card" or "draw 1 card" pattern
  if (!match) {
    pattern = /draws?\s+(?:a|one|1)\s+card/i;
    match = text.match(pattern);
  }

  if (!match) {
    logger.debug("Draw effect pattern did not match");
    return null;
  }

  // "draw a card" = 1 card, {d} = D_PLACEHOLDER sentinel
  let amount: number;
  if (match[1]) {
    amount = match[1] === "{d}" ? D_PLACEHOLDER : Number.parseInt(match[1], 10);
  } else {
    amount = 1;
  }

  if (Number.isNaN(amount)) {
    logger.warn("Failed to extract number from draw effect text", {
      match: match[1],
    });
    return null;
  }

  logger.info("Parsed draw effect from text", { amount, target });

  return {
    type: "draw",
    amount,
    target,
  };
}

/**
 * Draw effect parser implementation
 */
export const drawEffectParser: EffectParser = {
  pattern:
    /(?:(?:each|all) (?:player|opponent) |chosen player )?[Dd]raw(?:s)? (?:\d+|\{d\}) cards?|(?:a|one|1) card/i,
  description:
    "Parses draw card effects (e.g., 'draw 2 cards', 'Each player draws a card', 'Each opponent draws 2 cards', 'draw {d} cards')",

  parse: (input: CstNode | string): DrawEffect | null => {
    if (typeof input === "string") {
      return parseFromText(input);
    }
    return parseFromCst(input as { NumberToken?: IToken[] } | null | undefined);
  },
};
