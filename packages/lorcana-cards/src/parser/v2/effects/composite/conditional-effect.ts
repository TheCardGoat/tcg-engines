/**
 * Conditional Effect Parser
 * Handles conditional effects like "if X, then Y" or "if X, Y"
 * Parses effects that only execute if a condition is met
 */

import type { CstNode } from "chevrotain";
import { logger } from "../../logging";
import type { Effect } from "../../types";
import {
  type Condition,
  parseConditionFromText,
} from "../../visitors/condition-visitor";
import type { EffectParser } from "../atomic";
import { parseAtomicEffect } from "../atomic";

/**
 * Parse conditional effect from text string.
 * Identifies "if X, then Y" or "if X, Y" patterns.
 */
function parseFromText(text: string): Effect | null {
  logger.debug("Attempting to parse conditional effect from text", { text });

  // Match "if X, then Y" or "if X, Y" patterns
  // The condition is between "if" and the comma
  // The effect is after the comma (with optional "then")
  const conditionalPattern = /if\s+([^,]+),\s*(?:then\s+)?(.+)/i;
  const match = text.match(conditionalPattern);

  if (!match) {
    logger.debug("Conditional effect pattern did not match");
    return null;
  }

  const conditionText = match[1].trim();
  const effectText = match[2].trim();

  logger.debug("Found conditional pattern", { conditionText, effectText });

  // Parse the condition using the condition visitor
  const parsedCondition = parseConditionFromText(`if ${conditionText}`);

  // Parse the effect part
  const effect = parseAtomicEffect(effectText);

  if (!effect) {
    logger.warn("Failed to parse conditional effect", { effectText });
    return null;
  }

  logger.info("Parsed conditional effect", {
    condition: parsedCondition || conditionText,
    effect,
  });

  const conditionalEffect: Effect = {
    type: "conditional",
    effect,
  };

  // Include parsed condition or raw text
  if (parsedCondition) {
    conditionalEffect.condition = parsedCondition;
  } else {
    conditionalEffect.conditionText = conditionText;
  }

  return conditionalEffect;
}

/**
 * Parse conditional effect from CST node (grammar-based parsing).
 * For now, returns null as conditional effects are better handled via text parsing.
 */
function parseFromCst(ctx: {
  conditionClause?: CstNode[];
  effectPhrase?: CstNode[];
  [key: string]: unknown;
}): Effect | null {
  logger.debug("Attempting to parse conditional effect from CST", { ctx });

  // TODO: Implement CST-based conditional parsing when grammar rules are connected
  if (ctx.conditionClause && ctx.effectPhrase) {
    logger.debug(
      "Conditional effect CST parsing not fully implemented yet, using placeholder",
    );
    // Placeholder for future implementation
    return {
      type: "conditional",
      conditionText: "placeholder",
      effect: { type: "placeholder" },
    };
  }

  logger.debug("Conditional effect CST missing required nodes");
  return null;
}

/**
 * Conditional effect parser implementation
 */
export const conditionalEffectParser: EffectParser = {
  pattern: /if\s+[^,]+,/i,
  description:
    "Parses conditional effects that only execute if a condition is met (e.g., 'if you have another character, gain 2 lore')",

  parse: (input: CstNode | string): Effect | null => {
    if (typeof input === "string") {
      return parseFromText(input);
    }
    return parseFromCst(
      input as { conditionClause?: CstNode[]; effectPhrase?: CstNode[] },
    );
  },
};
