/**
 * Inkwell Effect Parser
 * Handles inkwell effects like "put into inkwell" or "add to inkwell"
 */

import type { CstNode } from "chevrotain";
import { logger } from "../../logging";
import type { PutIntoInkwellEffect } from "../../types";
import type { EffectParser } from "./index";

/**
 * Parse inkwell effect from text string (regex-based parsing)
 */
function parseFromText(text: string): PutIntoInkwellEffect | null {
  logger.debug("Attempting to parse inkwell effect from text", { text });

  // Patterns for inkwell effects
  // Matches: "put/add [something] into [your/their/their player's] inkwell"
  const putIntoInkwellPattern =
    /(?:put|add)(?:.*?)into\s+(?:your\s+|their\s+|their\s+player's\s+)?inkwell/i;
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
  type ValidSource =
    | "top-of-deck"
    | "hand"
    | "chosen-card-in-play"
    | "chosen-character"
    | "this-card"
    | "discard";

  let source: ValidSource = "hand";

  if (text.includes("top card of your deck")) {
    source = "top-of-deck";
  } else if (
    text.includes("card from your hand") ||
    text.includes("additional card")
  ) {
    source = "hand";
  } else if (text.includes("this card")) {
    source = "this-card";
  } else if (text.includes("from your discard")) {
    source = "discard";
  } else if (text.includes("character")) {
    source = "chosen-character";
  }

  // Check for modifiers
  const exerted = text.includes("exerted");
  const facedown = text.includes("facedown") || text.includes("face down");

  // Determine target (who's inkwell is the target?)
  let target: "CONTROLLER" | "OPPONENT" = "CONTROLLER";
  if (
    text.toLowerCase().includes("their") ||
    text.toLowerCase().includes("opponent") ||
    text.toLowerCase().includes("opponent's") ||
    text.toLowerCase().includes("their player's")
  ) {
    target = "OPPONENT";
  }

  const effect: PutIntoInkwellEffect = {
    source,
    target,
    type: "put-into-inkwell",
  };

  if (exerted) {
    effect.exerted = true;
  }

  if (facedown) {
    (effect as any).facedown = true;
  }

  logger.info("Parsed inkwell effect", { effect });

  return effect;
}

/**
 * Inkwell effect parser implementation
 */
export const inkwellEffectParser: EffectParser = {
  description:
    "Parses inkwell effects (e.g., 'put into your inkwell', 'add to inkwell', 'put into their player's inkwell')",
  parse: (input: CstNode | string): PutIntoInkwellEffect | null => {
    if (typeof input === "string") {
      return parseFromText(input);
    }
    // CST parsing not implemented yet for inkwell effects
    logger.warn("CST parsing not implemented for inkwell effects");
    return null;
  },

  pattern:
    /(?:put|add)(?:.*?)into\s+(?:your\s+|their\s+|their\s+player's\s+)?inkwell/i,
};
