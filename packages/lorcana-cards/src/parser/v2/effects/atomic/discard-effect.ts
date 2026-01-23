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
function parseFromCst(
  ctx:
    | {
        NumberToken?: IToken[];
        [key: string]: unknown;
      }
    | null
    | undefined,
): DiscardEffect | null {
  logger.debug("Attempting to parse discard effect from CST", { ctx });

  if (!(ctx && ctx.NumberToken) || ctx.NumberToken.length === 0) {
    logger.debug("Discard effect CST missing NumberToken or invalid context");
    return null;
  }

  const amount = Number.parseInt(ctx.NumberToken[0].image, 10);

  if (Number.isNaN(amount)) {
    logger.warn("Failed to parse number from discard effect CST", {
      image: ctx.NumberToken[0].image,
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

  // Try "choose and discard a card" pattern first (handles both "choose" and "chooses")
  // Also handles "discard" vs "discards" based on subject agreement
  const chooseAndDiscardPattern = /chooses? and discards? a card/i;
  const chooseMatch = text.match(chooseAndDiscardPattern);
  if (chooseMatch) {
    // Extract target (EACH_PLAYER, EACH_OPPONENT, or default to CONTROLLER)
    let target: "CONTROLLER" | "EACH_PLAYER" | "EACH_OPPONENT" = "CONTROLLER";
    if (text.toLowerCase().includes("each player")) {
      target = "EACH_PLAYER";
    } else if (text.toLowerCase().includes("each opponent")) {
      target = "EACH_OPPONENT";
    }

    logger.info(
      "Parsed discard effect from text (choose and discard pattern)",
      {
        amount: 1,
        target,
      },
    );
    return {
      type: "discard",
      amount: 1,
      target,
      chosen: true,
    };
  }

  // Try "discard X cards" pattern
  const discardPattern = /discard\s+(\d+)\s+cards?/i;
  const match = text.match(discardPattern);

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
    chosen: false, // Default to false, only "choose and discard" sets to true
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
    return parseFromCst(input as { NumberToken?: IToken[] } | null | undefined);
  },
};
