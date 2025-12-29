/**
 * Stat Modification Effect Parser
 * Handles stat modification effects like "chosen character gets +2 strength" or "-1 willpower"
 */

import type { CstNode, IToken } from "chevrotain";
import { logger } from "../../logging";
import type { Effect } from "../../types";
import type { EffectParser } from "./index";

/**
 * Parse stat modification effect from CST node (grammar-based parsing)
 */
function parseFromCst(ctx: {
  Number?: IToken[];
  [key: string]: unknown;
}): Effect | null {
  logger.debug("Attempting to parse stat modification effect from CST", {
    ctx,
  });

  if (!ctx.Number || ctx.Number.length === 0) {
    logger.debug("Stat mod effect CST missing Number token");
    return null;
  }

  const amount = Number.parseInt(ctx.Number[0].image, 10);

  if (Number.isNaN(amount)) {
    logger.warn("Failed to parse number from stat mod effect CST", {
      image: ctx.Number[0].image,
    });
    return null;
  }

  logger.info("Parsed stat modification effect from CST", { amount });

  return {
    type: "statModification",
    amount,
  };
}

/**
 * Parse stat modification effect from text string (regex-based parsing)
 */
function parseFromText(text: string): Effect | null {
  logger.debug("Attempting to parse stat modification effect from text", {
    text,
  });

  const pattern = /gets?\s+([+-])(\d+)\s+(strength|willpower|lore)/i;
  const match = text.match(pattern);

  if (!match) {
    logger.debug("Stat modification effect pattern did not match");
    return null;
  }

  const sign = match[1] === "-" ? -1 : 1;
  const value = Number.parseInt(match[2], 10);
  const stat = match[3].toLowerCase();

  if (Number.isNaN(value)) {
    logger.warn("Failed to extract number from stat mod effect text", {
      match: match[2],
    });
    return null;
  }

  const amount = sign * value;

  logger.info("Parsed stat modification effect from text", {
    amount,
    stat,
  });

  return {
    type: "statModification",
    amount,
    stat,
  };
}

/**
 * Stat modification effect parser implementation
 */
export const statModEffectParser: EffectParser = {
  pattern: /gets?\s+([+-])(\d+)\s+(strength|willpower|lore)/i,
  description: "Parses stat modification effects (e.g., 'gets +2 strength')",

  parse: (input: CstNode | string): Effect | null => {
    if (typeof input === "string") {
      return parseFromText(input);
    }
    return parseFromCst(input as { Number?: IToken[] });
  },
};
