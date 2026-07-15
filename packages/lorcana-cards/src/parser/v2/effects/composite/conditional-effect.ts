/**
 * Conditional Effect Parser
 * Handles conditional effects like "if X, then Y" or "if X, Y"
 * Parses effects that only execute if a condition is met
 */

import type { CstNode } from "chevrotain";
import { logger } from "../../logging";
import type { Condition, ConditionalEffect, Effect } from "../../types";
import { parseConditionFromText, toCondition } from "../../visitors/condition-visitor";
import type { EffectParser } from "../atomic";
import { parseAtomicEffect } from "../atomic";

/**
 * Parse conditional effect from text string.
 * Identifies "if X, then Y" or "if X, Y" patterns.
 * Also handles "instead" patterns: "Base effect. If X, Y instead"
 */
function parseFromText(text: string): ConditionalEffect | null {
  logger.debug("Attempting to parse conditional effect from text", { text });

  // Exclude "if you do" patterns - those are part of optional effects
  if (/if\s+you\s+do/i.test(text)) {
    logger.debug("Skipping 'if you do' pattern (handled by optional effects)");
    return null;
  }

  // First, check for "instead" pattern: "Base effect. If X, Y instead"
  // This pattern means: do Y if X is true, otherwise do the base effect
  const insteadPattern = /^(.+)\.\s+if\s+([^,]+),\s+(.+)\s+instead$/i;
  const insteadMatch = text.match(insteadPattern);

  if (insteadMatch) {
    const baseEffectText = insteadMatch[1].trim();
    const conditionText = insteadMatch[2].trim();
    const thenEffectText = insteadMatch[3].trim();

    logger.debug("Found 'instead' pattern", {
      baseEffectText,
      conditionText,
      thenEffectText,
    });

    // Parse base effect as 'else' branch
    const elseEffect = parseAtomicEffect(baseEffectText);
    if (!elseEffect) {
      logger.warn("Failed to parse base (else) effect", { baseEffectText });
      return null;
    }

    // Parse conditional effect as 'then' branch
    const thenEffect = parseAtomicEffect(thenEffectText);
    if (!thenEffect) {
      logger.warn("Failed to parse conditional (then) effect", {
        thenEffectText,
      });
      return null;
    }

    // Parse the condition using the condition visitor
    const parsedCondition = parseConditionFromText(`if ${conditionText}`);

    // Convert VisitorCondition to full Condition type
    const condition: Condition = toCondition(parsedCondition) || {
      comparison: "greater-or-equal",
      controller: "you",
      count: 0,
      type: "has-character-count",
    };

    logger.info("Parsed conditional effect with 'else' branch", {
      condition,
      else: elseEffect,
      then: thenEffect,
    });

    return {
      condition,
      else: elseEffect,
      then: thenEffect,
      type: "conditional",
    };
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

  // Convert VisitorCondition to full Condition type
  const condition: Condition = toCondition(parsedCondition) || {
    comparison: "greater-or-equal",
    controller: "you",
    count: 0,
    type: "has-character-count",
  };

  logger.info("Parsed conditional effect", {
    condition,
    then: thenEffect,
  });

  return {
    condition,
    then: thenEffect,
    type: "conditional",
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
  description:
    "Parses conditional effects that only execute if a condition is met (e.g., 'if you have another character, gain 2 lore') and 'instead' clauses (e.g., 'Gain 1 lore. If X, gain 2 lore instead')",
  parse: (input: CstNode | string): ConditionalEffect | null => {
    if (typeof input === "string") {
      return parseFromText(input);
    }
    return parseFromCst(input as { conditionClause?: CstNode[]; effectPhrase?: CstNode[] });
  },

  pattern: /(?:.+\.\s+)?if\s+[^,]+,/i,
};
