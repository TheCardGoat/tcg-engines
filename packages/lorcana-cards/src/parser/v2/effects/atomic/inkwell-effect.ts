/**
 * Inkwell Effect Parser
 * Handles inkwell effects like "put into inkwell" or "add to inkwell"
 */

import type { CstNode } from "chevrotain";
import { logger } from "../../logging";
import type { Effect } from "../../types";
import type { EffectParser } from "./index";

/**
 * Parse inkwell effect from text string (regex-based parsing)
 */
function parseFromText(text: string): Effect | null {
  logger.debug("Attempting to parse inkwell effect from text", { text });

  // Patterns for inkwell effects
  const putIntoInkwellPattern =
    /(?:put|add)(?:.*?)into\s+(?:your\s+|their\s+)?inkwell/i;
  const youMayPutIntoInkwellPattern = /you\s+may\s+put.*?into\s+inkwell/i;

  // Check for inkwell patterns
  if (
    !(
      putIntoInkwellPattern.test(text) || youMayPutIntoInkwellPattern.test(text)
    )
  ) {
    logger.debug("Inkwell effect pattern did not match");
    return null;
  }

  // Determine source
  let source:
    | "top-of-deck"
    | "hand"
    | "chosen-card-in-play"
    | "chosen-character"
    | "this-card"
    | "referenced-card" = "hand";

  if (text.includes("top card of your deck")) {
    source = "top-of-deck";
  } else if (
    text.includes("card from your hand") ||
    text.includes("additional card")
  ) {
    source = "hand";
  } else if (text.includes("this card")) {
    source = "this-card";
  } else if (text.includes("that card")) {
    source = "referenced-card";
  } else if (text.includes("character")) {
    source = "chosen-character";
  }

  // Determine target player's inkwell
  let targetPlayer: "controller" | "opponent" = "controller";
  if (
    text.includes("their player's inkwell") ||
    text.includes("their inkwell")
  ) {
    targetPlayer = "opponent";
  }

  // Check for modifiers
  const exerted = text.includes("exerted");
  const facedown = text.includes("facedown") || text.includes("face down");

  const effect: Effect = {
    type: "put-into-inkwell",
    source,
    target: targetPlayer,
  };

  // Only add exerted/facedown when true
  if (exerted) {
    effect.exerted = true;
  }
  if (facedown) {
    effect.facedown = true;
  }

  logger.info("Parsed inkwell effect", effect);

  return effect;
}

/**
 * Inkwell effect parser implementation
 */
export const inkwellEffectParser: EffectParser = {
  pattern: /(?:put|add)(?:.*?)into\s+(?:your\s+|their\s+)?inkwell/i,
  description:
    "Parses inkwell effects (e.g., 'put into your inkwell', 'add to inkwell')",

  parse: (input: CstNode | string): Effect | null => {
    if (typeof input === "string") {
      return parseFromText(input);
    }
    // CST parsing not implemented yet for inkwell effects
    logger.warn("CST parsing not implemented for inkwell effects");
    return null;
  },
};
