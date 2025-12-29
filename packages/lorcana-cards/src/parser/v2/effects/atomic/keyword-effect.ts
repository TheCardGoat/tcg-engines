/**
 * Keyword Effect Parser
 * Handles keyword grants like "chosen character gains Evasive" or "gets Ward"
 */

import type { CstNode, IToken } from "chevrotain";
import { logger } from "../../logging";
import type { CharacterTarget, GainKeywordEffect } from "../../types";
import type { EffectParser } from "./index";

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
  return KEYWORDS.includes(keyword as GrantableKeyword);
}

/**
 * Parse keyword effect from CST node (grammar-based parsing)
 */
function parseFromCst(ctx: {
  Identifier?: IToken[];
  [key: string]: unknown;
}): GainKeywordEffect | null {
  logger.debug("Attempting to parse keyword effect from CST", { ctx });

  if (!ctx.Identifier || ctx.Identifier.length === 0) {
    logger.debug("Keyword effect CST missing Identifier token");
    return null;
  }

  const keyword = ctx.Identifier[0].image;

  if (!isGrantableKeyword(keyword)) {
    logger.debug("Identifier is not a known keyword", { keyword });
    return null;
  }

  logger.info("Parsed keyword effect from CST", { keyword });

  return {
    type: "gain-keyword",
    keyword,
    target: "CHOSEN_CHARACTER" as CharacterTarget,
  };
}

/**
 * Parse keyword effect from text string (regex-based parsing)
 */
function parseFromText(text: string): GainKeywordEffect | null {
  logger.debug("Attempting to parse keyword effect from text", { text });

  const keywordsPattern = KEYWORDS.join("|");
  const pattern = new RegExp(`(gains?|gets?)\\s+(${keywordsPattern})`, "i");
  const match = text.match(pattern);

  if (!match) {
    logger.debug("Keyword effect pattern did not match");
    return null;
  }

  const keyword = match[2];

  if (!isGrantableKeyword(keyword)) {
    logger.debug("Matched keyword is not grantable", { keyword });
    return null;
  }

  // Try to determine target from text
  let target: CharacterTarget = "CHOSEN_CHARACTER";
  if (
    text.includes("this character") ||
    text.includes("this card") ||
    text.match(/^\s*(gains?|gets?)/i)
  ) {
    target = "SELF";
  } else if (text.includes("your characters")) {
    target = "ALL_YOUR_CHARACTERS";
  }

  logger.info("Parsed keyword effect from text", { keyword, target });

  return {
    type: "gain-keyword",
    keyword,
    target,
  };
}

/**
 * Keyword effect parser implementation
 */
export const keywordEffectParser: EffectParser = {
  pattern:
    /(gains?|gets?)\s+(Evasive|Challenger|Rush|Ward|Bodyguard|Resist|Support|Reckless|Alert)/i,
  description: "Parses keyword grant effects (e.g., 'gains Evasive')",

  parse: (input: CstNode | string): GainKeywordEffect | null => {
    if (typeof input === "string") {
      return parseFromText(input);
    }
    return parseFromCst(input as { Identifier?: IToken[] });
  },
};
