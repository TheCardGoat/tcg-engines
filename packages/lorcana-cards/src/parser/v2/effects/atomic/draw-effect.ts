/**
 * Draw Effect Parser
 * Handles draw card effects like "draw 2 cards" or "draw 1 card"
 */

import type { CstNode, IToken } from "chevrotain";
import { logger } from "../../logging";
import type { Effect } from "../../types";
import type { EffectParser } from "./index";

/**
 * Parse draw effect from CST node (grammar-based parsing)
 */
function parseFromCst(ctx: {
  Number?: IToken[];
  [key: string]: unknown;
}): Effect | null {
  logger.debug("Attempting to parse draw effect from CST", { ctx });

  if (!ctx.Number || ctx.Number.length === 0) {
    logger.debug("Draw effect CST missing Number token");
    return null;
  }

  const amount = Number.parseInt(ctx.Number[0].image, 10);

  if (Number.isNaN(amount)) {
    logger.warn("Failed to parse number from draw effect CST", {
      image: ctx.Number[0].image,
    });
    return null;
  }

  logger.info("Parsed draw effect from CST", { amount });

  return {
    type: "draw",
    amount,
  };
}

/**
 * Parse draw effect from text string (regex-based parsing)
 */
function parseFromText(text: string): Effect | null {
  logger.debug("Attempting to parse draw effect from text", { text });

  const pattern = /draw\s+(\d+)\s+cards?/i;
  const match = text.match(pattern);

  if (!match) {
    logger.debug("Draw effect pattern did not match");
    return null;
  }

  const amount = Number.parseInt(match[1], 10);

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
  };
}

/**
 * Draw effect parser implementation
 */
export const drawEffectParser: EffectParser = {
  pattern: /draw\s+(\d+)\s+cards?/i,
  description: "Parses draw card effects (e.g., 'draw 2 cards')",

  parse: (input: CstNode | string): Effect | null => {
    if (typeof input === "string") {
      return parseFromText(input);
    }
    return parseFromCst(input as { Number?: IToken[] });
  },
};
