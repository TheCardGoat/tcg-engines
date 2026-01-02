/**
 * Draw Effect Parser
 * Handles draw card effects like "draw 2 cards" or "draw 1 card"
 */

import type { CstNode, IToken } from "chevrotain";
import { logger } from "../../logging";
import type { DrawEffect } from "../../types";
import type { EffectParser } from "./index";

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

  // Try "draw N cards" pattern first
  let pattern = /draw\s+(\d+)\s+cards?/i;
  let match = text.match(pattern);

  // Try "draw a card" or "draw 1 card" pattern
  if (!match) {
    pattern = /draw\s+(?:a|one|1)\s+card/i;
    match = text.match(pattern);
  }

  if (!match) {
    logger.debug("Draw effect pattern did not match");
    return null;
  }

  // "draw a card" = 1 card
  const amount = match[1] ? Number.parseInt(match[1], 10) : 1;

  if (Number.isNaN(amount)) {
    logger.warn("Failed to extract number from draw effect text", {
      match: match[1],
    });
    return null;
  }

  logger.info("Parsed draw effect from text", { amount });

  return {
    type: "draw",
    amount,
    target: "CONTROLLER",
  };
}

/**
 * Draw effect parser implementation
 */
export const drawEffectParser: EffectParser = {
  pattern: /draw\s+(?:(\d+)\s+cards?|(?:a|one|1)\s+card)/i,
  description: "Parses draw card effects (e.g., 'draw 2 cards', 'draw a card')",

  parse: (input: CstNode | string): DrawEffect | null => {
    if (typeof input === "string") {
      return parseFromText(input);
    }
    return parseFromCst(input as { NumberToken?: IToken[] } | null | undefined);
  },
};
