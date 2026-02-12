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
    card: "card",
    character: "character",
    item: "item",
    location: "location",
  };

  const cardType = cardTypeMap[type.toLowerCase()] || type;

  // Map modifier to selector and owner
  const modifierMap: Record<
    string,
    { selector: string; owner: string; count: number | "all" }
  > = {
    all: { count: "all" as any, owner: "any", selector: "all" },
    an: { count: 1, owner: "any", selector: "chosen" },
    another: { count: 1, owner: "any", selector: "chosen" },
    chosen: { count: 1, owner: "any", selector: "chosen" },
    "chosen opposing": { count: 1, owner: "opponent", selector: "chosen" },
    each: { count: "all" as any, owner: "any", selector: "all" },
    opponent: { count: "all" as any, owner: "opponent", selector: "all" },
    "opponent's": { count: "all" as any, owner: "opponent", selector: "all" },
    opposing: { count: "all" as any, owner: "opponent", selector: "all" },
    other: { count: "all" as any, owner: "any", selector: "all" },
    this: { count: 1, owner: "any", selector: "self" },
    your: { count: "all" as any, owner: "you", selector: "all" },
  };

  const mapping = modifier
    ? modifierMap[modifier.toLowerCase()] ||
      modifierMap[modifier.toLowerCase() + " " + type.toLowerCase()]
    : modifierMap["chosen"];

  // If no mapping found, default to chosen
  const { selector, owner, count } = mapping || modifierMap.chosen;

  return {
    cardTypes: [cardType],
    count,
    owner: owner as any,
    selector: selector as any,
    zones: ["play"],
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
      target,
      type: "exert",
    };
  }
  return {
    target,
    type: "ready",
  };
}

/**
 * Parse exert effect from text string (regex-based parsing)
 */
function parseFromText(text: string): ExertEffect | ReadyEffect | null {
  logger.debug("Attempting to parse exert effect from text", { text });

  // Check for "exert all your characters" pattern first
  if (/exert\s+all\s+(?:your\s+)?characters/i.test(text)) {
    logger.info("Parsed exert all characters effect");
    return {
      target: "YOUR_CHARACTERS",
      type: "exert",
    };
  }

  // Check for "exert each character" pattern
  if (/exert\s+each\s+character/i.test(text)) {
    logger.info("Parsed exert each character effect");
    return {
      target: "ALL_CHARACTERS",
      type: "exert",
    };
  }

  // Check for "ready all your characters" pattern
  if (/ready\s+all\s+(?:your\s+)?characters/i.test(text)) {
    logger.info("Parsed ready all characters effect");
    return {
      target: "YOUR_CHARACTERS",
      type: "ready",
    };
  }

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
      target,
      type: "exert",
    };
  }
  return {
    target,
    type: "ready",
  };
}

/**
 * Exert effect parser implementation
 */
export const exertEffectParser: EffectParser = {
  description:
    "Parses exert/ready effects (e.g., 'exert chosen character', 'exert all your characters', 'ready all your characters')",
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

  pattern:
    /(exert|ready)\s+(?:all\s+)?(?:your\s+)?(?:characters|chosen|this|another|an?)\s+character/i,
};
