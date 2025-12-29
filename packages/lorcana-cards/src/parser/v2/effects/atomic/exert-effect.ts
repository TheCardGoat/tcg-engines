/**
 * Exert Effect Parser
 * Handles exert/ready effects like "exert chosen character" or "ready this character"
 */

import type { CstNode, IToken } from "chevrotain";
import { logger } from "../../logging";
import type { CharacterTarget, ExertEffect, ReadyEffect } from "../../types";
import { parseTargetFromText } from "../../visitors/target-visitor";
import type { EffectParser } from "./index";

/**
 * Parse exert effect from CST node (grammar-based parsing)
 */
function parseFromCst(ctx: {
  Exert?: IToken[];
  Ready?: IToken[];
  targetClause?: CstNode[];
  [key: string]: unknown;
}): ExertEffect | ReadyEffect | null {
  logger.debug("Attempting to parse exert effect from CST", { ctx });

  const isExert = ctx.Exert !== undefined;
  const isReady = ctx.Ready !== undefined;

  if (!(isExert || isReady)) {
    logger.debug("Exert effect CST missing Exert or Ready token");
    return null;
  }

  // Parse target if present, default to CHOSEN_CHARACTER
  const target: CharacterTarget = "CHOSEN_CHARACTER";
  if (ctx.targetClause) {
    logger.debug("Target clause found in exert effect CST");
    // Target parsing will be integrated when grammar rules are connected
  }

  logger.info("Parsed exert effect from CST", { isExert, target });

  if (isExert) {
    return {
      type: "exert",
      target,
    };
  }
  return {
    type: "ready",
    target,
  };
}

/**
 * Parse exert effect from text string (regex-based parsing)
 */
function parseFromText(text: string): ExertEffect | ReadyEffect | null {
  logger.debug("Attempting to parse exert effect from text", { text });

  const exertPattern = /exert\s+(.+?)(?:\.|,|$)/i;
  const readyPattern = /ready\s+(.+?)(?:\.|,|$)/i;

  let match = text.match(exertPattern);
  let isExert = true;

  if (!match) {
    match = text.match(readyPattern);
    isExert = false;
  }

  if (!match) {
    logger.debug("Exert effect pattern did not match");
    return null;
  }

  // Parse target if present, default to CHOSEN_CHARACTER
  let target: CharacterTarget = "CHOSEN_CHARACTER";
  if (match[1]) {
    const parsedTarget = parseTargetFromText(match[1]);
    if (parsedTarget) {
      target = parsedTarget as CharacterTarget;
      logger.debug("Parsed target from exert effect text", { target });
    }
  }

  logger.info("Parsed exert effect from text", { isExert, target });

  if (isExert) {
    return {
      type: "exert",
      target,
    };
  }
  return {
    type: "ready",
    target,
  };
}

/**
 * Exert effect parser implementation
 */
export const exertEffectParser: EffectParser = {
  pattern: /(exert|ready)\s+(chosen|this|another|an?)\s+character/i,
  description: "Parses exert/ready effects (e.g., 'exert chosen character')",

  parse: (input: CstNode | string): ExertEffect | ReadyEffect | null => {
    if (typeof input === "string") {
      return parseFromText(input);
    }
    return parseFromCst(
      input as {
        Exert?: IToken[];
        Ready?: IToken[];
        targetClause?: CstNode[];
      },
    );
  },
};
