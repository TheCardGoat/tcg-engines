/**
 * Target Visitor
 * Transforms CST nodes for target clauses into typed target objects.
 */

import type { CstNode, IToken } from "chevrotain";
import { logger } from "../logging";

/**
 * Target object representing what/who is targeted by an effect.
 */
export interface Target {
  modifier?:
    | "your"
    | "opponent"
    | "each"
    | "all"
    | "another"
    | "other"
    | "chosen"
    | "this";
  type:
    | "character"
    | "item"
    | "location"
    | "card"
    | "cards"
    | "player"
    | string;
}

/**
 * Parse target clause from CST node.
 * Extracts target modifier and target type from the CST context.
 */
export function parseTargetFromCst(ctx: {
  targetModifier?: CstNode[];
  targetType?: CstNode[];
  [key: string]: unknown;
}): Target | null {
  logger.debug("Parsing target from CST", { ctx });

  if (!ctx.targetType) {
    logger.debug("No target type found in CST");
    return null;
  }

  // Parse target modifier (optional)
  let modifier: Target["modifier"] | undefined;
  if (ctx.targetModifier && Array.isArray(ctx.targetModifier)) {
    const modifierCtx = ctx.targetModifier[0] as {
      Your?: IToken[];
      Opponent?: IToken[];
      Each?: IToken[];
      All?: IToken[];
      Another?: IToken[];
      Other?: IToken[];
      Chosen?: IToken[];
      This?: IToken[];
    };

    if (modifierCtx.Your) {
      modifier = "your";
    } else if (modifierCtx.Opponent) {
      modifier = "opponent";
    } else if (modifierCtx.Each) {
      modifier = "each";
    } else if (modifierCtx.All) {
      modifier = "all";
    } else if (modifierCtx.Another) {
      modifier = "another";
    } else if (modifierCtx.Other) {
      modifier = "other";
    } else if (modifierCtx.Chosen) {
      modifier = "chosen";
    } else if (modifierCtx.This) {
      modifier = "this";
    }
  }

  // Parse target type (required)
  const typeCtx = ctx.targetType[0] as {
    Character?: IToken[];
    Item?: IToken[];
    Location?: IToken[];
    Card?: IToken[];
    Cards?: IToken[];
    Identifier?: IToken[];
  };

  let type: Target["type"] = "character"; // default

  if (typeCtx.Character) {
    type = "character";
  } else if (typeCtx.Item) {
    type = "item";
  } else if (typeCtx.Location) {
    type = "location";
  } else if (typeCtx.Cards) {
    type = "cards";
  } else if (typeCtx.Card) {
    type = "card";
  } else if (typeCtx.Identifier) {
    // For "player" or other custom types
    type = typeCtx.Identifier[0].image.toLowerCase();
  }

  const target: Target = { type };
  if (modifier) {
    target.modifier = modifier;
  }

  logger.info("Parsed target from CST", { target });

  return target;
}

/**
 * Parse target from text string (regex-based fallback).
 * Used when grammar-based parsing is not available.
 */
export function parseTargetFromText(text: string): Target | null {
  logger.debug("Parsing target from text", { text });

  // Common target patterns - order matters, more specific patterns first
  const patterns = [
    // Compound modifiers (must come before simple modifiers)
    {
      regex:
        /(?:^|\s)(chosen\s+opposing(?:'s)?)\s+(character|item|location|card)s?/i,
      modifier: "chosen opposing",
    },
    {
      regex: /(?:^|\s)(chosen\s+your)\s+(character|item|location|card)s?/i,
      modifier: "chosen your",
    },
    {
      regex:
        /(?:^|\s)(opponent(?:'s)?\s+chosen)\s+(character|item|location|card)s?/i,
      modifier: "chosen opposing",
    },
    // Simple modifiers
    {
      regex: /(?:^|\s)(your)\s+(character|item|location|card)s?/i,
      modifier: "your",
    },
    {
      regex: /(?:^|\s)(opponent(?:'s)?)\s+(character|item|location|card)s?/i,
      modifier: "opponent",
    },
    {
      regex: /(?:^|\s)(opposing)\s+(character|item|location|card)s?/i,
      modifier: "opposing",
    },
    {
      regex: /(?:^|\s)(each)\s+(character|item|location|card)s?/i,
      modifier: "each",
    },
    {
      regex: /(?:^|\s)(all)\s+(character|item|location|card)s?/i,
      modifier: "all",
    },
    {
      regex: /(?:^|\s)(another)\s+(character|item|location|card)s?/i,
      modifier: "another",
    },
    {
      regex: /(?:^|\s)(other)\s+(character|item|location|card)s?/i,
      modifier: "other",
    },
    {
      regex: /(?:^|\s)(chosen)\s+(character|item|location|card)s?/i,
      modifier: "chosen",
    },
    {
      regex: /(?:^|\s)(this)\s+(character|item|location|card)/i,
      modifier: "this",
    },
    // Fallback: just card type without modifier
    { regex: /(?:^|\s)(character|item|location|card)s?/i, modifier: undefined },
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern.regex);
    if (match) {
      const type = (match[2] || match[1]).toLowerCase() as Target["type"];
      const target: Target = { type };

      if (pattern.modifier) {
        target.modifier = pattern.modifier as Target["modifier"];
      }

      logger.info("Parsed target from text", { target });
      return target;
    }
  }

  logger.debug("No target pattern matched in text");
  return null;
}
