/**
 * Keyword Effect Parser
 * Handles keyword grants like "chosen character gains Evasive" or "Your characters gain Ward"
 */

import type { CstNode, IToken } from "chevrotain";
import { logger } from "../../logging";
import type { CharacterTarget, GainKeywordEffect } from "../../types";
import type { EffectParser } from "./index";
import { D_PLACEHOLDER } from "./stat-mod-effect";

/**
 * Known Lorcana keywords that can be granted
 */
const KEYWORDS = [
  "Evasive",
  "Challenger",
  "Rush",
  "Ward",
  "Bodyguard",
  "Resist",
  "Support",
  "Reckless",
  "Alert",
] as const;

type GrantableKeyword = (typeof KEYWORDS)[number];

function isGrantableKeyword(keyword: string): keyword is GrantableKeyword {
  return KEYWORDS.some((k) => k.toLowerCase() === keyword.toLowerCase());
}

/**
 * Parse a keyword value from text (e.g., "Challenger +3", "Resist +{d}")
 * Returns the keyword name and optional value
 */
function parseKeywordWithValue(text: string): {
  keyword: string;
  value?: number;
} | null {
  // Check for parameterized keywords: "Challenger +X" or "Resist +X"
  const challengerMatch = text.match(
    /Challenger\s*\+(\d+|\{d\})(?:\s+(.+))?$/i,
  );
  if (challengerMatch) {
    const value = parseNumericValue(challengerMatch[1]);
    const condition = challengerMatch[2]?.trim();
    return {
      keyword: "Challenger",
      value,
      ...(condition && { condition }),
    };
  }

  const resistMatch = text.match(/Resist\s*\+(\d+|\{d\})(?:\s+(.+))?$/i);
  if (resistMatch) {
    const value = parseNumericValue(resistMatch[1]);
    const condition = resistMatch[2]?.trim();
    return {
      keyword: "Resist",
      value,
      ...(condition && { condition }),
    };
  }

  // Check for simple keywords
  for (const keyword of KEYWORDS) {
    if (text.toLowerCase() === keyword.toLowerCase()) {
      return { keyword };
    }
  }

  return null;
}

/**
 * Helper function to parse numeric values or {d} placeholders
 * Converts {d} to D_PLACEHOLDER as a sentinel value
 */
function parseNumericValue(value: string): number {
  if (value === "{d}") {
    return D_PLACEHOLDER; // Sentinel value for {d}
  }

  // Remove optional + prefix
  const cleaned = value.replace(/^\+/, "");
  const parsed = Number.parseInt(cleaned, 10);

  if (Number.isNaN(parsed)) {
    return 0; // Fallback for unparseable values
  }

  return parsed;
}

/**
 * Parse keyword effect from CST node (grammar-based parsing)
 */
function parseFromCst(
  ctx:
    | {
        Identifier?: IToken[];
        [key: string]: unknown;
      }
    | null
    | undefined,
): GainKeywordEffect | null {
  logger.debug("Attempting to parse keyword effect from CST", { ctx });

  if (!(ctx && ctx.Identifier) || ctx.Identifier.length === 0) {
    logger.debug(
      "Keyword effect CST missing Identifier token or invalid context",
    );
    return null;
  }

  const keyword = ctx.Identifier[0].image;

  if (!isGrantableKeyword(keyword)) {
    logger.debug("Identifier is not a known keyword", { keyword });
    return null;
  }

  logger.info("Parsed keyword effect from CST", { keyword });

  return {
    keyword,
    target: "CHOSEN_CHARACTER" as CharacterTarget,
    type: "gain-keyword",
  };
}

/**
 * Parse keyword effect from text string (regex-based parsing)
 */
function parseFromText(text: string): GainKeywordEffect | null {
  logger.debug("Attempting to parse keyword effect from text", { text });

  // Check for duration "this turn" clause
  const hasDuration = /this turn/i.test(text);
  const duration: "this-turn" | undefined = hasDuration
    ? "this-turn"
    : undefined;

  // Updated pattern to support both singular and plural forms
  // Pattern: "Your characters gain Ward", "chosen character gains Evasive"
  const keywordsPattern = KEYWORDS.join("|");
  const pattern = new RegExp(
    `(gain|gains|gets?)\\s+((?:${keywordsPattern})(?:\\s*[+-]\\d+|\\s*\\+\\{d\\}|\\s*\\+\\d+\\s+[^.]*)?)`,
    "i",
  );
  const match = text.match(pattern);

  if (!match) {
    logger.debug("Keyword effect pattern did not match");
    return null;
  }

  const keywordText = match[2];
  const parsedKeyword = parseKeywordWithValue(keywordText);

  if (!(parsedKeyword && isGrantableKeyword(parsedKeyword.keyword))) {
    logger.debug("Matched keyword is not grantable", { keyword: keywordText });
    return null;
  }

  // Extract just the keyword name from keywordText (without any parameters like "+3")
  // Preserve original case from input
  const originalKeyword = keywordText
    .trim()
    .replace(/\s*[+-]\d+.*$/, "") // Remove trailing "+3" or "-2" etc
    .replace(/\s*\+\{d\}.*$/, "") // Remove trailing "+{d}"
    .trim();

  const keyword = originalKeyword;

  // Try to determine target from text
  // Order matters: check more specific patterns first
  let target: CharacterTarget = "CHOSEN_CHARACTER";
  const lowerText = text.toLowerCase();

  if (
    lowerText.includes("this character") ||
    lowerText.includes("this card") ||
    lowerText.match(/^\s*(gains?|gets?)/i)
  ) {
    target = "SELF";
  } else if (/your\s+(?:\w+\s+)?characters/.test(lowerText)) {
    // "Your characters", "Your Hero characters", "Your inkborn characters"
    target = "YOUR_CHARACTERS";
  } else if (lowerText.includes("your items")) {
    target = "YOUR_ITEMS" as CharacterTarget;
  } else if (lowerText.includes("while here")) {
    // "Characters gain Ward while here" (location effect)
    target = "CHARACTERS_HERE" as CharacterTarget;
  } else if (lowerText.includes("chosen character")) {
    // Use detailed target format for "chosen character"
    target = {
      cardTypes: ["character"],
      count: 1,
      owner: "any",
      selector: "chosen",
      zones: ["play"],
    };
  }

  logger.info("Parsed keyword effect from text", {
    duration,
    keyword,
    target,
    value: parsedKeyword.value,
  });

  const effect: GainKeywordEffect = {
    keyword: keyword as GainKeywordEffect["keyword"],
    target,
    type: "gain-keyword",
  };

  if (parsedKeyword.value !== undefined) {
    effect.value = parsedKeyword.value;
  }

  if (duration) {
    effect.duration = duration;
  }

  return effect;
}

/**
 * Keyword effect parser implementation
 */
export const keywordEffectParser: EffectParser = {
  description:
    "Parses keyword grant effects (e.g., 'gains Evasive', 'Your characters gain Ward')",
  parse: (input: CstNode | string): GainKeywordEffect | null => {
    if (typeof input === "string") {
      return parseFromText(input);
    }
    return parseFromCst(input as { Identifier?: IToken[] } | null | undefined);
  },

  pattern:
    /(gain|gains|gets?)\s+(Evasive|Challenger|Rush|Ward|Bodyguard|Resist|Support|Reckless|Alert)(?:\s*[+-]\d+|\s*\+\{d\})?/i,
};
