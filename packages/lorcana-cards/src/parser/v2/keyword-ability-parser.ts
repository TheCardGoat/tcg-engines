/**
 * Keyword Ability Parser for v2
 *
 * Parses standalone keyword abilities from text.
 * Handles:
 * - Simple keywords: Rush, Ward, Evasive, Bodyguard, Support, Reckless, Vanish, Alert
 * - Parameterized keywords: Challenger +N, Resist +N
 * - Value keywords: Singer N, Sing Together N, Boost N
 * - Shift keywords: Shift N, Puppy Shift N, Universal Shift N
 */

import { logger } from "./logging";
import {
  BOOST_PATTERN,
  CHALLENGER_PATTERN,
  RESIST_PATTERN,
  SHIFT_PATTERN,
  SIMPLE_KEYWORD_PATTERN,
  SING_TOGETHER_PATTERN,
  SINGER_PATTERN,
} from "./patterns/keywords";

type SimpleKeywordType =
  | "Rush"
  | "Ward"
  | "Evasive"
  | "Bodyguard"
  | "Support"
  | "Reckless"
  | "Vanish"
  | "Alert";

interface SimpleKeywordAbility {
  type: "keyword";
  keyword: SimpleKeywordType;
}

interface ParameterizedKeywordAbility {
  type: "keyword";
  keyword: "Challenger" | "Resist";
  value: number;
  condition?: string;
}

interface ValueKeywordAbility {
  type: "keyword";
  keyword: "Singer" | "SingTogether" | "Boost";
  value: number;
}

interface ShiftKeywordAbility {
  type: "keyword";
  keyword: "Shift";
  cost: { ink: number };
}

type KeywordAbility =
  | SimpleKeywordAbility
  | ParameterizedKeywordAbility
  | ValueKeywordAbility
  | ShiftKeywordAbility;

/**
 * Parse a keyword ability from text.
 * Returns the keyword ability object if matched, null otherwise.
 */
export function parseKeywordAbility(text: string): KeywordAbility | null {
  logger.debug("Attempting to parse keyword ability", { text });

  // Try simple keywords first
  const simpleMatch = text.match(SIMPLE_KEYWORD_PATTERN);
  if (simpleMatch) {
    logger.info("Parsed simple keyword", { keyword: simpleMatch[1] });
    return {
      type: "keyword",
      keyword: simpleMatch[1] as SimpleKeywordType,
    };
  }

  // Try Challenger +N
  const challengerMatch = text.match(/^Challenger \+(\d+|\{d\})(.*)?$/);
  if (challengerMatch) {
    let value: number;
    if (challengerMatch[1] === "{d}") {
      value = 0;
    } else {
      value = Number.parseInt(challengerMatch[1], 10);
      if (Number.isNaN(value)) {
        value = 0;
      }
    }
    const condition = challengerMatch[2]?.trim();
    logger.info("Parsed Challenger keyword", { value, condition });
    return {
      type: "keyword",
      keyword: "Challenger",
      value,
      condition: condition || undefined,
    };
  }

  // Try Resist +N
  const resistMatch = text.match(/^Resist \+(\d+|\{d\})(.*)?$/);
  if (resistMatch) {
    let value: number;
    if (resistMatch[1] === "{d}") {
      value = 0;
    } else {
      value = Number.parseInt(resistMatch[1], 10);
      if (Number.isNaN(value)) {
        value = 0;
      }
    }
    const condition = resistMatch[2]?.trim();
    logger.info("Parsed Resist keyword", { value, condition });
    return {
      type: "keyword",
      keyword: "Resist",
      value,
      condition: condition || undefined,
    };
  }

  // Try Singer N
  const singerMatch = text.match(SINGER_PATTERN);
  if (singerMatch) {
    let value: number;
    if (singerMatch[1] === "{d}") {
      value = 0;
    } else {
      value = Number.parseInt(singerMatch[1], 10);
      if (Number.isNaN(value)) {
        value = 0;
      }
    }
    logger.info("Parsed Singer keyword", { value });
    return {
      type: "keyword",
      keyword: "Singer",
      value,
    };
  }

  // Try Sing Together N
  const singTogetherMatch = text.match(SING_TOGETHER_PATTERN);
  if (singTogetherMatch) {
    let value: number;
    if (singTogetherMatch[1] === "{d}") {
      value = 0;
    } else {
      value = Number.parseInt(singTogetherMatch[1], 10);
      if (Number.isNaN(value)) {
        value = 0;
      }
    }
    logger.info("Parsed Sing Together keyword", { value });
    return {
      type: "keyword",
      keyword: "SingTogether",
      value,
    };
  }

  // Try Boost N
  const boostMatch = text.match(BOOST_PATTERN);
  if (boostMatch) {
    let value: number;
    if (boostMatch[1] === "{d}") {
      value = 0;
    } else {
      value = Number.parseInt(boostMatch[1], 10);
      if (Number.isNaN(value)) {
        value = 0;
      }
    }
    logger.info("Parsed Boost keyword", { value });
    return {
      type: "keyword",
      keyword: "Boost",
      value,
    };
  }

  // Try Shift variants
  const shiftMatch = text.match(SHIFT_PATTERN);
  if (shiftMatch) {
    const keywordType = shiftMatch[1];
    let value = Number.parseInt(shiftMatch[2], 10);
    if (Number.isNaN(value) || shiftMatch[2] === "{d}") {
      value = 0;
    }
    logger.info("Parsed Shift keyword", { keywordType, value });
    // Normalize all Shift variants to just "Shift" with cost property
    return {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: value },
    };
  }

  logger.debug("No keyword pattern matched", { text });
  return null;
}
