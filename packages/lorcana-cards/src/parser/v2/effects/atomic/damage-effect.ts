/**
 * Damage Effect Parser
 * Handles damage effects like "deal 2 damage to chosen character"
 */

import type { CstNode, IToken } from "chevrotain";
import { logger } from "../../logging";
import type { Effect } from "../../types";
import {
  parseTargetFromText,
  type Target,
} from "../../visitors/target-visitor";
import type { EffectParser } from "./index";

/**
 * Parse damage effect from CST node (grammar-based parsing)
 */
function parseFromCst(ctx: {
  Number?: IToken[];
  targetClause?: CstNode[];
  [key: string]: unknown;
}): Effect | null {
  logger.debug("Attempting to parse damage effect from CST", { ctx });

  if (!ctx.Number || ctx.Number.length === 0) {
    logger.debug("Damage effect CST missing Number token");
    return null;
  }

  const amount = Number.parseInt(ctx.Number[0].image, 10);

  if (Number.isNaN(amount)) {
    logger.warn("Failed to parse number from damage effect CST", {
      image: ctx.Number[0].image,
    });
    return null;
  }

  // Parse target if present (will be added in grammar integration)
  let target: Target | undefined;
  if (ctx.targetClause) {
    logger.debug("Target clause found in damage effect CST");
    // Target parsing will be integrated when grammar rules are connected
  }

  logger.info("Parsed damage effect from CST", { amount, target });

  const effect: Effect = {
    type: "damage",
    amount,
  };

  if (target) {
    effect.target = target;
  }

  return effect;
}

/**
 * Parse damage effect from text string (regex-based parsing)
 */
function parseFromText(text: string): Effect | null {
  logger.debug("Attempting to parse damage effect from text", { text });

  const pattern = /deal\s+(\d+)\s+damage(?:\s+to\s+(.+?))?(?:\.|,|$)/i;
  const match = text.match(pattern);

  if (!match) {
    logger.debug("Damage effect pattern did not match");
    return null;
  }

  const amount = Number.parseInt(match[1], 10);

  if (Number.isNaN(amount)) {
    logger.warn("Failed to extract number from damage effect text", {
      match: match[1],
    });
    return null;
  }

  // Parse target if present
  let target: Target | undefined;
  if (match[2]) {
    const parsedTarget = parseTargetFromText(match[2]);
    if (parsedTarget) {
      target = parsedTarget;
      logger.debug("Parsed target from damage effect text", { target });
    }
  }

  logger.info("Parsed damage effect from text", { amount, target });

  const effect: Effect = {
    type: "damage",
    amount,
  };

  if (target) {
    effect.target = target;
  }

  return effect;
}

/**
 * Damage effect parser implementation
 */
export const damageEffectParser: EffectParser = {
  pattern: /deal\s+(\d+)\s+damage/i,
  description:
    "Parses damage effects (e.g., 'deal 2 damage to chosen character')",

  parse: (input: CstNode | string): Effect | null => {
    if (typeof input === "string") {
      return parseFromText(input);
    }
    return parseFromCst(
      input as { Number?: IToken[]; targetClause?: CstNode[] },
    );
  },
};
