/**
 * Keyword Ability Parser
 *
 * Parses keyword abilities from text into type-safe KeywordAbility objects.
 * Handles:
 * - Simple keywords: Rush, Ward, Evasive, Bodyguard, Support, Reckless, Vanish, Alert
 * - Parameterized keywords: Challenger +N, Resist +N (with optional conditions)
 * - Value keywords: Singer N, Sing Together N, Boost N
 * - Shift keywords: Shift N, Puppy Shift N, Universal Shift N
 */

import type {
  Condition,
  KeywordAbility,
  ParameterizedKeywordAbility,
  ShiftKeywordAbility,
  SimpleKeywordAbility,
  SimpleKeywordType,
  ValueKeywordAbility,
} from "@tcg/lorcana";
import {
  BOOST_PATTERN,
  SHIFT_PATTERN,
  SIMPLE_KEYWORD_PATTERN,
  SING_TOGETHER_PATTERN,
  SINGER_PATTERN,
} from "../patterns/keywords";
import type { ParseResult } from "../types";

/**
 * Parse a keyword ability from text
 *
 * @param text - Normalized ability text
 * @returns Parse result with keyword ability
 */
export function parseKeywordAbility(text: string): ParseResult {
  // Try simple keywords first
  const simpleMatch = text.match(SIMPLE_KEYWORD_PATTERN);
  if (simpleMatch) {
    return parseSimpleKeyword(text, simpleMatch[1] as SimpleKeywordType);
  }

  // Try Challenger +N (with optional condition)
  const challengerMatch = text.match(/^Challenger \+(\{d\}|\d+)(.*)?$/);
  if (challengerMatch) {
    return parseParameterizedKeyword(
      text,
      "Challenger",
      challengerMatch[1],
      challengerMatch[2]?.trim(),
    );
  }

  // Try Resist +N (with optional condition)
  const resistMatch = text.match(/^Resist \+(\{d\}|\d+)(.*)?$/);
  if (resistMatch) {
    return parseParameterizedKeyword(
      text,
      "Resist",
      resistMatch[1],
      resistMatch[2]?.trim(),
    );
  }

  // Try Singer N
  const singerMatch = text.match(SINGER_PATTERN);
  if (singerMatch) {
    return parseValueKeyword(text, "Singer", singerMatch[1]);
  }

  // Try Sing Together N
  const singTogetherMatch = text.match(SING_TOGETHER_PATTERN);
  if (singTogetherMatch) {
    return parseValueKeyword(text, "SingTogether", singTogetherMatch[1]);
  }

  // Try Boost N
  const boostMatch = text.match(BOOST_PATTERN);
  if (boostMatch) {
    return parseValueKeyword(text, "Boost", boostMatch[1]);
  }

  // Try Shift variants
  const shiftMatch = text.match(SHIFT_PATTERN);
  if (shiftMatch) {
    return parseShiftKeyword(text, shiftMatch[1], shiftMatch[2]);
  }

  // No keyword pattern matched
  return {
    success: false,
    error: `Unknown keyword ability: "${text}"`,
  };
}

/**
 * Parse a simple keyword (no parameters)
 */
function parseSimpleKeyword(
  text: string,
  keyword: SimpleKeywordType,
): ParseResult {
  const ability: SimpleKeywordAbility = {
    type: "keyword",
    keyword,
  };

  return {
    success: true,
    ability: {
      ability,
      text,
    },
  };
}

/**
 * Parse a parameterized keyword (Challenger, Resist)
 */
function parseParameterizedKeyword(
  text: string,
  keyword: "Challenger" | "Resist",
  valueText: string,
  conditionText?: string,
): ParseResult {
  const value = parseNumericValue(valueText);

  // Parse optional condition
  let condition: Condition | undefined;
  if (conditionText) {
    condition = parseKeywordCondition(conditionText);
  }

  const ability: ParameterizedKeywordAbility = condition
    ? {
        type: "keyword",
        keyword,
        value,
        condition,
      }
    : {
        type: "keyword",
        keyword,
        value,
      };

  return {
    success: true,
    ability: {
      ability,
      text,
    },
    warnings:
      conditionText && !condition
        ? [`Could not parse condition: "${conditionText}"`]
        : undefined,
  };
}

/**
 * Parse a value-based keyword (Singer, SingTogether, Boost)
 */
function parseValueKeyword(
  text: string,
  keyword: "Singer" | "SingTogether" | "Boost",
  valueText: string,
): ParseResult {
  const value = parseNumericValue(valueText);

  const ability: ValueKeywordAbility = {
    type: "keyword",
    keyword,
    value,
  };

  return {
    success: true,
    ability: {
      ability,
      text,
    },
  };
}

/**
 * Parse a Shift keyword
 */
function parseShiftKeyword(
  text: string,
  shiftType: string,
  costText: string,
): ParseResult {
  const inkCost = parseNumericValue(costText);

  const ability: ShiftKeywordAbility = {
    type: "keyword",
    keyword: "Shift",
    cost: { ink: inkCost },
  };

  return {
    success: true,
    ability: {
      ability,
      text,
    },
  };
}

/**
 * Parse a numeric value from text
 * Converts {d} placeholders to 0
 */
function parseNumericValue(text: string): number {
  if (text === "{d}") {
    return 0; // Placeholder for resolved values
  }
  return Number.parseInt(text, 10);
}

/**
 * Parse condition text for parameterized keywords
 *
 * Currently handles:
 * - "while challenging"
 * - "while questing"
 * - Other conditions return undefined with warning
 */
function parseKeywordCondition(text: string): Condition | undefined {
  const normalized = text.toLowerCase();

  if (normalized.includes("while challenging")) {
    return { type: "in-challenge" };
  }

  if (normalized.includes("while questing")) {
    // "while questing" doesn't have a direct condition type - return undefined
    // The engine handles this contextually during resolution
    return undefined;
  }

  // Unknown condition
  return undefined;
}
