/**
 * Banish Effect Parser
 * Handles banish/return effects like "banish chosen character" or "return this character to hand"
 */

import type { CstNode, IToken } from "chevrotain";
import { logger } from "../../logging";
import type {
  BanishEffect,
  CardTarget,
  CharacterTarget,
  ReturnToHandEffect,
} from "../../types";
import type { EffectParser } from "./index";

/**
 * Parse banish effect from CST node (grammar-based parsing)
 */
function parseFromCst(ctx: {
  Banish?: IToken[];
  Return?: IToken[];
  [key: string]: unknown;
}): BanishEffect | ReturnToHandEffect | null {
  logger.debug("Attempting to parse banish effect from CST", { ctx });

  const isBanish = ctx.Banish !== undefined;
  const isReturn = ctx.Return !== undefined;

  if (!(isBanish || isReturn)) {
    logger.debug("Banish effect CST missing Banish or Return token");
    return null;
  }

  logger.info("Parsed banish effect from CST", { isBanish });

  if (isBanish) {
    return {
      type: "banish",
      target: "CHOSEN_CHARACTER" as CharacterTarget,
    };
  }
  return {
    type: "return-to-hand",
    target: "CHOSEN_CHARACTER" as CardTarget,
  };
}

/**
 * Parse banish effect from text string (regex-based parsing)
 */
function parseFromText(text: string): BanishEffect | ReturnToHandEffect | null {
  logger.debug("Attempting to parse banish effect from text", { text });

  const banishPattern =
    /banish\s+(chosen|this|another|an?)\s+(character|item)/i;
  const returnPattern =
    /return\s+(this|chosen|another|an?)\s+(character|item)\s+to/i;

  let match = text.match(banishPattern);
  let isBanish = true;

  if (!match) {
    match = text.match(returnPattern);
    isBanish = false;
  }

  if (!match) {
    logger.debug("Banish effect pattern did not match");
    return null;
  }

  logger.info("Parsed banish effect from text", { isBanish });

  if (isBanish) {
    return {
      type: "banish",
      target: "CHOSEN_CHARACTER" as CharacterTarget,
    };
  }
  return {
    type: "return-to-hand",
    target: "CHOSEN_CHARACTER" as CardTarget,
  };
}

/**
 * Banish effect parser implementation
 */
export const banishEffectParser: EffectParser = {
  pattern: /(banish|return)\s+(chosen|this|another|an?)\s+(character|item)/i,
  description: "Parses banish/return effects (e.g., 'banish chosen character')",

  parse: (
    input: CstNode | string,
  ): BanishEffect | ReturnToHandEffect | null => {
    if (typeof input === "string") {
      return parseFromText(input);
    }
    return parseFromCst(input as { Banish?: IToken[]; Return?: IToken[] });
  },
};
