/**
 * Keyword Effect Parser
 * Handles keyword grants like "chosen character gains Evasive" or "gets Ward"
 */

import type { CstNode, IToken } from "chevrotain";
import { logger } from "../../logging";
import type { Effect } from "../../types";
import type { EffectParser } from "./index";

/**
 * Known Lorcana keywords
 */
const KEYWORDS = [
  "Evasive",
  "Challenger",
  "Rush",
  "Ward",
  "Bodyguard",
  "Resist",
  "Support",
  "Singer",
  "Reckless",
];

/**
 * Parse keyword effect from CST node (grammar-based parsing)
 */
function parseFromCst(ctx: {
  Identifier?: IToken[];
  [key: string]: unknown;
}): Effect | null {
  logger.debug("Attempting to parse keyword effect from CST", { ctx });

  if (!ctx.Identifier || ctx.Identifier.length === 0) {
    logger.debug("Keyword effect CST missing Identifier token");
    return null;
  }

  const keyword = ctx.Identifier[0].image;

  if (!KEYWORDS.includes(keyword)) {
    logger.debug("Identifier is not a known keyword", { keyword });
    return null;
  }

  logger.info("Parsed keyword effect from CST", { keyword });

  return {
    type: "keyword",
    keyword,
  };
}

/**
 * Parse keyword effect from text string (regex-based parsing)
 */
function parseFromText(text: string): Effect | null {
  logger.debug("Attempting to parse keyword effect from text", { text });

  const keywordsPattern = KEYWORDS.join("|");
  const pattern = new RegExp(`(gains?|gets?)\\s+(${keywordsPattern})`, "i");
  const match = text.match(pattern);

  if (!match) {
    logger.debug("Keyword effect pattern did not match");
    return null;
  }

  const keyword = match[2];

  logger.info("Parsed keyword effect from text", { keyword });

  return {
    type: "keyword",
    keyword,
  };
}

/**
 * Keyword effect parser implementation
 */
export const keywordEffectParser: EffectParser = {
  pattern:
    /(gains?|gets?)\s+(Evasive|Challenger|Rush|Ward|Bodyguard|Resist|Support|Singer|Reckless)/i,
  description: "Parses keyword grant effects (e.g., 'gains Evasive')",

  parse: (input: CstNode | string): Effect | null => {
    if (typeof input === "string") {
      return parseFromText(input);
    }
    return parseFromCst(input as { Identifier?: IToken[] });
  },
};
