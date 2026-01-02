/**
 * Stat Modification Effect Parser
 * Handles stat modification effects like "chosen character gets +2 strength" or "-1 willpower"
 */

import type { CstNode, IToken } from "chevrotain";
import { logger } from "../../logging";
import type { CharacterTarget, ModifyStatEffect } from "../../types";
import type { EffectParser } from "./index";

/**
 * Parse stat modification effect from CST node (grammar-based parsing)
 */
function parseFromCst(ctx: {
  NumberToken?: IToken[];
  Identifier?: IToken[];
  [key: string]: unknown;
}): ModifyStatEffect | null {
  logger.debug("Attempting to parse stat modification effect from CST", {
    ctx,
  });

  if (!ctx.NumberToken || ctx.NumberToken.length === 0) {
    logger.debug("Stat mod effect CST missing NumberToken");
    return null;
  }

  const modifier = Number.parseInt(ctx.NumberToken[0].image, 10);

  if (Number.isNaN(modifier)) {
    logger.warn("Failed to parse number from stat mod effect CST", {
      image: ctx.NumberToken[0].image,
    });
    return null;
  }

  // Default stat if not specified
  const stat: "strength" | "willpower" | "lore" = "strength";

  logger.info("Parsed stat modification effect from CST", { modifier, stat });

  return {
    type: "modify-stat",
    stat,
    modifier,
    target: "CHOSEN_CHARACTER" as CharacterTarget,
  };
}

/**
 * Parse stat modification effect from text string (regex-based parsing)
 */
function parseFromText(text: string): ModifyStatEffect | null {
  logger.debug("Attempting to parse stat modification effect from text", {
    text,
  });

  const pattern = /get(?:s)?\s+([+-])(\d+)\s+(strength|willpower|lore)/i;
  const match = text.match(pattern);

  if (!match) {
    logger.debug("Stat modification effect pattern did not match");
    return null;
  }

  const sign = match[1] === "-" ? -1 : 1;
  const value = Number.parseInt(match[2], 10);
  const statStr = match[3].toLowerCase();

  if (Number.isNaN(value)) {
    logger.warn("Failed to extract number from stat mod effect text", {
      match: match[2],
    });
    return null;
  }

  const modifier = sign * value;
  const stat = statStr as "strength" | "willpower" | "lore";

  // Try to determine target from text
  let target: CharacterTarget = "CHOSEN_CHARACTER";
  if (text.includes("this character") || text.includes("this card")) {
    target = "SELF";
  } else if (text.includes("your characters")) {
    target = "YOUR_CHARACTERS";
  }

  logger.info("Parsed stat modification effect from text", {
    modifier,
    stat,
    target,
  });

  return {
    type: "modify-stat",
    stat,
    modifier,
    target,
  };
}

/**
 * Stat modification effect parser implementation
 */
export const statModEffectParser: EffectParser = {
  pattern: /gets?\s+([+-])(\d+)\s+(strength|willpower|lore)/i,
  description: "Parses stat modification effects (e.g., 'gets +2 strength')",

  parse: (input: CstNode | string): ModifyStatEffect | null => {
    if (typeof input === "string") {
      return parseFromText(input);
    }
    return parseFromCst(
      input as { NumberToken?: IToken[]; Identifier?: IToken[] },
    );
  },
};
