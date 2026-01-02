/**
 * Lore Effect Parser
 * Handles lore gain/loss effects like "gain 2 lore" or "lose 1 lore"
 */

import type { CstNode, IToken } from "chevrotain";
import { logger } from "../../logging";
import type { Effect, GainLoreEffect, LoseLoreEffect } from "../../types";
import type { EffectParser } from "./index";

/**
 * Parse lore effect from CST node (grammar-based parsing)
 */
function parseFromCst(
  ctx:
    | {
        NumberToken?: IToken[];
        Gain?: IToken[];
        Lose?: IToken[];
        [key: string]: unknown;
      }
    | null
    | undefined,
): GainLoreEffect | LoseLoreEffect | null {
  logger.debug("Attempting to parse lore effect from CST", { ctx });

  if (!(ctx && ctx.NumberToken) || ctx.NumberToken.length === 0) {
    logger.debug("Lore effect CST missing NumberToken or invalid context");
    return null;
  }

  const amount = Number.parseInt(ctx.NumberToken[0].image, 10);

  if (Number.isNaN(amount)) {
    logger.warn("Failed to parse number from lore effect CST", {
      image: ctx.NumberToken[0].image,
    });
    return null;
  }

  const isGain = ctx.Gain !== undefined;
  const isLose = ctx.Lose !== undefined;

  if (!(isGain || isLose)) {
    logger.debug("Lore effect CST missing Gain or Lose token");
    return null;
  }

  logger.info("Parsed lore effect from CST", { amount, isGain });

  if (isGain) {
    return {
      type: "gain-lore",
      amount,
    };
  }
  return {
    type: "lose-lore",
    amount,
    target: "OPPONENT",
  };
}

/**
 * Parse lore effect from text string (regex-based parsing)
 */
function parseFromText(text: string): GainLoreEffect | LoseLoreEffect | null {
  logger.debug("Attempting to parse lore effect from text", { text });

  const gainPattern = /gain\s+(\d+)\s+lore/i;
  const losePattern = /lose\s+(\d+)\s+lore/i;

  let match = text.match(gainPattern);
  let isGain = true;

  if (!match) {
    match = text.match(losePattern);
    isGain = false;
  }

  if (!match) {
    logger.debug("Lore effect pattern did not match");
    return null;
  }

  const amount = Number.parseInt(match[1], 10);

  if (Number.isNaN(amount)) {
    logger.warn("Failed to extract number from lore effect text", {
      match: match[1],
    });
    return null;
  }

  logger.info("Parsed lore effect from text", { amount, isGain });

  if (isGain) {
    return {
      type: "gain-lore",
      amount,
    };
  }
  return {
    type: "lose-lore",
    amount,
    target: "OPPONENT",
  };
}

/**
 * Lore effect parser implementation
 */
export const loreEffectParser: EffectParser = {
  pattern: /(gain|lose)\s+(\d+)\s+lore/i,
  description: "Parses lore gain/loss effects (e.g., 'gain 2 lore')",

  parse: (input: CstNode | string): Effect | null => {
    if (typeof input === "string") {
      return parseFromText(input);
    }
    return parseFromCst(
      input as
        | { NumberToken?: IToken[]; Gain?: IToken[]; Lose?: IToken[] }
        | null
        | undefined,
    );
  },
};
