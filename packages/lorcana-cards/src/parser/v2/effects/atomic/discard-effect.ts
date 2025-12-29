/**
 * Discard Effect Parser
 * Handles discard card effects like "discard 2 cards" or "discard 1 card"
 */

import type { CstNode, IToken } from "chevrotain";
import { logger } from "../../logging";
import type { DiscardEffect } from "../../types";
import type { EffectParser } from "./index";

/**
 * Parse discard effect from CST node (grammar-based parsing)
 */
function parseFromCst(ctx: {
  Number?: IToken[];
  [key: string]: unknown;
}): DiscardEffect | null {
  logger.debug("Attempting to parse discard effect from CST", { ctx });

  if (!ctx.Number || ctx.Number.length === 0) {
    logger.debug("Discard effect CST missing Number token");
    return null;
  }

  const amount = Number.parseInt(ctx.Number[0].image, 10);

  if (Number.isNaN(amount)) {
    logger.warn("Failed to parse number from discard effect CST", {
      image: ctx.Number[0].image,
    });
    return null;
  }

  logger.info("Parsed discard effect from CST", { amount });

  return {
    type: "discard",
    amount,
    target: "CONTROLLER",
    chosen: true,
  };
}

/**
 * Parse discard effect from text string (regex-based parsing)
 */
function parseFromText(text: string): DiscardEffect | null {
  logger.debug("Attempting to parse discard effect from text", { text });

  const pattern = /discard\s+(\d+)\s+cards?/i;
  const match = text.match(pattern);

  if (!match) {
    logger.debug("Discard effect pattern did not match");
    return null;
  }

  const amount = Number.parseInt(match[1], 10);

  if (Number.isNaN(amount)) {
    logger.warn("Failed to extract number from discard effect text", {
      match: match[1],
    });
    return null;
  }

  logger.info("Parsed discard effect from text", { amount });

  return {
    type: "discard",
    amount,
    target: "CONTROLLER",
    chosen: true,
  };
}

/**
 * Discard effect parser implementation
 */
export const discardEffectParser: EffectParser = {
  pattern: /discard\s+(\d+)\s+cards?/i,
  description: "Parses discard card effects (e.g., 'discard 1 card')",

  parse: (input: CstNode | string): DiscardEffect | null => {
    if (typeof input === "string") {
      return parseFromText(input);
    }
    return parseFromCst(input as { Number?: IToken[] });
  },
};
