/**
 * Conditional Effect Parser
 * Handles conditional effects like "if X, then Y" or "if X, Y"
 * Parses effects that only execute if a condition is met
 */

import type { CstNode } from "chevrotain";
import { logger } from "../../logging";
import type { Condition, ConditionalEffect, Effect } from "../../types";
import { parseConditionFromText } from "../../visitors/condition-visitor";
import type { EffectParser } from "../atomic";
import { parseAtomicEffect } from "../atomic";

/**
 * Parse conditional effect from text string.
 * Identifies "if X, then Y" or "if X, Y" patterns.
 */
function parseFromText(text: string): ConditionalEffect | null {
  logger.debug("Attempting to parse conditional effect from text", { text });

  // Exclude "if you do" patterns - those are part of optional effects
  if (/if\s+you\s+do/i.test(text)) {
    logger.debug("Skipping 'if you do' pattern (handled by optional effects)");
    return null;
  }

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
  const thenEffect = parseAtomicEffect(effectText);

  if (!thenEffect) {
    logger.warn("Failed to parse conditional effect", { effectText });
    return null;
  }

  // We need a condition - if parsing failed, create a placeholder
  const condition: Condition = (parsedCondition as unknown as Condition) || {
    type: "has-character-count",
    controller: "you",
    comparison: "at-least",
    count: 0,
  };

  logger.info("Parsed conditional effect", {
    condition,
    then: thenEffect,
  });

  return {
    type: "conditional",
    condition,
    then: thenEffect,
  };
}

/**
 * Parse conditional effect from CST node (grammar-based parsing).
 * For now, returns null as conditional effects are better handled via text parsing.
 */
function parseFromCst(_ctx: {
  conditionClause?: CstNode[];
  effectPhrase?: CstNode[];
  [key: string]: unknown;
}): ConditionalEffect | null {
  logger.debug("CST-based conditional parsing not yet implemented");
  return null;
}

/**
 * Conditional effect parser implementation
 */
export const conditionalEffectParser: EffectParser = {
  pattern: /if\s+[^,]+,/i,
  description:
    "Parses conditional effects that only execute if a condition is met (e.g., 'if you have another character, gain 2 lore')",

  parse: (input: CstNode | string): ConditionalEffect | null => {
    if (typeof input === "string") {
      return parseFromText(input);
    }
    return parseFromCst(
      input as { conditionClause?: CstNode[]; effectPhrase?: CstNode[] },
    );
  },
};
