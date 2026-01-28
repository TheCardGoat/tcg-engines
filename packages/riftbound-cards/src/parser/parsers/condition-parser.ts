/**
 * Condition Parser
 *
 * Parses conditions from ability text.
 * Conditions modify when abilities are active or trigger.
 */

import type { Condition } from "@tcg/riftbound-types";

// ============================================================================
// Types
// ============================================================================

export interface ConditionParseResult {
  readonly condition: Condition;
  /** The remaining text after the condition is extracted */
  readonly remainingText: string;
  /** Start index of the condition in original text */
  readonly startIndex: number;
}

// ============================================================================
// Patterns
// ============================================================================

/**
 * Pattern for "While I'm [Mighty]" condition
 */
const WHILE_MIGHTY_PATTERN = /^While I'm \[Mighty\],?\s*/i;

/**
 * Pattern for "While I'm buffed" condition
 */
const WHILE_BUFFED_PATTERN = /^While I'm buffed,?\s*/i;

/**
 * Pattern for "While I'm at a battlefield" condition
 */
const WHILE_AT_BATTLEFIELD_PATTERN = /^While I'm at a battlefield,?\s*/i;

/**
 * Pattern for "If I was [Mighty]" condition (past tense, for Deathknell)
 */
const IF_MIGHTY_PATTERN = /^If I was \[Mighty\],?\s*/i;

/**
 * Pattern for "If I died alone" or "if I'm alone" condition
 */
const IF_ALONE_PATTERN = /^If I (?:died|was|'m) alone,?\s*/i;

/**
 * Pattern for "if I'm [Mighty]" condition (present tense, for triggers)
 */
const IF_IM_MIGHTY_PATTERN = /^if I'm \[Mighty\],?\s*/i;

/**
 * Pattern for "if I'm alone" condition (present tense, for triggers)
 */
const IF_IM_ALONE_PATTERN = /^if I'm alone,?\s*/i;

/**
 * Pattern for "If you've discarded a card this turn" condition
 */
const IF_DISCARDED_THIS_TURN_PATTERN =
  /^If you've discarded a card this turn,?\s*/i;

/**
 * Pattern for "[Legion]" condition (in activated abilities)
 */
const LEGION_CONDITION_PATTERN = /^\[Legion\]\s*—?\s*/i;

// ============================================================================
// Parser Functions
// ============================================================================

/**
 * Parse a condition from the start of text
 * Returns the condition and remaining text
 */
export function parseConditionFromText(
  text: string,
): ConditionParseResult | undefined {
  // Try "While I'm [Mighty]"
  const whileMightyMatch = WHILE_MIGHTY_PATTERN.exec(text);
  if (whileMightyMatch) {
    return {
      condition: { type: "while-mighty" },
      remainingText: text.slice(whileMightyMatch[0].length),
      startIndex: 0,
    };
  }

  // Try "While I'm buffed"
  const whileBuffedMatch = WHILE_BUFFED_PATTERN.exec(text);
  if (whileBuffedMatch) {
    return {
      condition: { type: "while-buffed" },
      remainingText: text.slice(whileBuffedMatch[0].length),
      startIndex: 0,
    };
  }

  // Try "While I'm at a battlefield"
  const whileAtBattlefieldMatch = WHILE_AT_BATTLEFIELD_PATTERN.exec(text);
  if (whileAtBattlefieldMatch) {
    return {
      condition: { type: "while-at-battlefield" },
      remainingText: text.slice(whileAtBattlefieldMatch[0].length),
      startIndex: 0,
    };
  }

  // Try "If I was [Mighty]" (past tense)
  const ifMightyMatch = IF_MIGHTY_PATTERN.exec(text);
  if (ifMightyMatch) {
    return {
      condition: { type: "while-mighty" },
      remainingText: text.slice(ifMightyMatch[0].length),
      startIndex: 0,
    };
  }

  // Try "If I died alone" or "if I was alone"
  const ifAloneMatch = IF_ALONE_PATTERN.exec(text);
  if (ifAloneMatch) {
    return {
      condition: { type: "while-alone" },
      remainingText: text.slice(ifAloneMatch[0].length),
      startIndex: 0,
    };
  }

  // Try "if I'm [Mighty]" (present tense, lowercase)
  const ifImMightyMatch = IF_IM_MIGHTY_PATTERN.exec(text);
  if (ifImMightyMatch) {
    return {
      condition: { type: "while-mighty" },
      remainingText: text.slice(ifImMightyMatch[0].length),
      startIndex: 0,
    };
  }

  // Try "if I'm alone" (present tense, lowercase)
  const ifImAloneMatch = IF_IM_ALONE_PATTERN.exec(text);
  if (ifImAloneMatch) {
    return {
      condition: { type: "while-alone" },
      remainingText: text.slice(ifImAloneMatch[0].length),
      startIndex: 0,
    };
  }

  // Try "If you've discarded a card this turn"
  const ifDiscardedMatch = IF_DISCARDED_THIS_TURN_PATTERN.exec(text);
  if (ifDiscardedMatch) {
    return {
      condition: { type: "this-turn", event: "discarded" },
      remainingText: text.slice(ifDiscardedMatch[0].length),
      startIndex: 0,
    };
  }

  // Try "[Legion]" condition
  const legionMatch = LEGION_CONDITION_PATTERN.exec(text);
  if (legionMatch) {
    return {
      condition: { type: "legion" },
      remainingText: text.slice(legionMatch[0].length),
      startIndex: 0,
    };
  }

  return undefined;
}

/**
 * Parse a condition from anywhere in the text (after a comma)
 * Used for triggered abilities like "When I attack, if I'm [Mighty], ..."
 */
export function parseInlineCondition(text: string): {
  condition?: Condition;
  effectText: string;
} {
  // Look for ", if I'm [Mighty]," pattern
  const mightyInlineMatch = text.match(/,\s*if I'm \[Mighty\],?\s*/i);
  if (mightyInlineMatch && mightyInlineMatch.index !== undefined) {
    const beforeCondition = text.slice(0, mightyInlineMatch.index);
    const afterCondition = text.slice(
      mightyInlineMatch.index + mightyInlineMatch[0].length,
    );
    return {
      condition: { type: "while-mighty" },
      effectText: beforeCondition + ", " + afterCondition,
    };
  }

  // Look for ", if I'm alone," pattern
  const aloneInlineMatch = text.match(/,\s*if I'm alone,?\s*/i);
  if (aloneInlineMatch && aloneInlineMatch.index !== undefined) {
    const beforeCondition = text.slice(0, aloneInlineMatch.index);
    const afterCondition = text.slice(
      aloneInlineMatch.index + aloneInlineMatch[0].length,
    );
    return {
      condition: { type: "while-alone" },
      effectText: beforeCondition + ", " + afterCondition,
    };
  }

  return { effectText: text };
}

/**
 * Check if text starts with a condition
 */
export function startsWithCondition(text: string): boolean {
  return (
    WHILE_MIGHTY_PATTERN.test(text) ||
    WHILE_BUFFED_PATTERN.test(text) ||
    WHILE_AT_BATTLEFIELD_PATTERN.test(text) ||
    IF_MIGHTY_PATTERN.test(text) ||
    IF_ALONE_PATTERN.test(text) ||
    IF_IM_MIGHTY_PATTERN.test(text) ||
    IF_IM_ALONE_PATTERN.test(text) ||
    IF_DISCARDED_THIS_TURN_PATTERN.test(text) ||
    LEGION_CONDITION_PATTERN.test(text)
  );
}

/**
 * Check if text contains an inline condition
 */
export function hasInlineCondition(text: string): boolean {
  return /,\s*if I'm \[Mighty\]/i.test(text) || /,\s*if I'm alone/i.test(text);
}
