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
 * Convert simple Target format to CharacterTargetQuery
 * The parseTargetFromText returns {type, modifier} but tests expect
 * the full CharacterTargetQuery format with selector, count, owner, zones, cardTypes
 */
function convertToCharacterTarget(simpleTarget: {
  type: string;
  modifier?: string;
}): CharacterTarget {
  const { type, modifier } = simpleTarget;

  // Map card type to proper name
  const cardTypeMap: Record<string, string> = {
    character: "character",
    item: "item",
    location: "location",
    card: "card",
  };

  const cardType = cardTypeMap[type.toLowerCase()] || type;

  // Map modifier to selector and owner
  const modifierMap: Record<
    string,
    { selector: string; owner: string; count: number }
  > = {
    chosen: { selector: "chosen", owner: "any", count: 1 },
    "chosen opposing": { selector: "chosen", owner: "opponent", count: 1 },
    this: { selector: "self", owner: "any", count: 1 },
    your: { selector: "all", owner: "you", count: "all" },
    opponent: { selector: "all", owner: "opponent", count: "all" },
    "opponent's": { selector: "all", owner: "opponent", count: "all" },
    opposing: { selector: "all", owner: "opponent", count: "all" },
    another: { selector: "chosen", owner: "any", count: 1 },
    an: { selector: "chosen", owner: "any", count: 1 },
    each: { selector: "all", owner: "any", count: "all" },
    all: { selector: "all", owner: "any", count: "all" },
    other: { selector: "all", owner: "any", count: "all" },
  };

  const mapping = modifier
    ? modifierMap[modifier.toLowerCase()] ||
      modifierMap[modifier.toLowerCase() + " " + type.toLowerCase()]
    : modifierMap["chosen"];

  // If no mapping found, default to chosen
  const { selector, owner, count } = mapping || modifierMap.chosen;

  return {
    selector: selector as CharacterTarget["selector"],
    count,
    owner: owner as CharacterTarget["owner"],
    zones: ["play"],
    cardTypes: [cardType],
  };
}

/**
 * Parse exert effect from CST node (grammar-based parsing)
 */
function parseFromCst(
  ctx:
    | {
        Exert?: IToken[];
        Ready?: IToken[];
        targetClause?: CstNode[];
        [key: string]: unknown;
      }
    | null
    | undefined,
): ExertEffect | ReadyEffect | null {
  logger.debug("Attempting to parse exert effect from CST", { ctx });

  if (!ctx) {
    logger.debug("Exert effect CST has invalid context");
    return null;
  }

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

  // More flexible patterns that don't require trailing separators
  // This handles cases where sequence parser has already removed ". " etc.
  const exertPattern = /^exert\s+(.+)$/i;
  const readyPattern = /^ready\s+(.+)$/i;

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
      target = convertToCharacterTarget(parsedTarget);
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
      input as
        | {
            Exert?: IToken[];
            Ready?: IToken[];
            targetClause?: CstNode[];
          }
        | null
        | undefined,
    );
  },
};
