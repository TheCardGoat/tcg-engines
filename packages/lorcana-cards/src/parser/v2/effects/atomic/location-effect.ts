/**
 * Location Effect Parser
 * Handles location movement effects like "move to location"
 */

import type { CstNode } from "chevrotain";
import { logger } from "../../logging";
import type { CharacterTarget, MoveToLocationEffect } from "../../types";
import type { EffectParser } from "./index";

/**
 * Parse location effect from text string (regex-based parsing)
 */
function parseFromText(text: string): MoveToLocationEffect | null {
  logger.debug("Attempting to parse location effect from text", { text });

  // Pattern: "move (chosen character|...) to a location"
  const moveToLocationPattern =
    /move\s+(?:chosen\s+)?(?:character|card).*?to\s+a\s+location/i;

  if (!moveToLocationPattern.test(text)) {
    logger.debug("Location effect pattern did not match");
    return null;
  }

  // Determine character target
  let character: CharacterTarget = "CHOSEN_CHARACTER";

  if (text.includes("chosen character of yours")) {
    character = "CHOSEN_CHARACTER_OF_YOURS";
  } else if (text.includes("this character")) {
    character = "SELF";
  } else if (text.includes("chosen character")) {
    character = "CHOSEN_CHARACTER";
  }

  // Check if movement is free
  const isFree = text.includes("for free");

  logger.info("Parsed move to location effect", { character, isFree });

  const effect: MoveToLocationEffect = {
    type: "move-to-location",
    character,
  };
  if (isFree) {
    effect.cost = "free";
  }
  return effect;
}

/**
 * Location effect parser implementation
 */
export const locationEffectParser: EffectParser = {
  pattern: /move.*?to\s+a\s+location/i,
  description:
    "Parses location movement effects (e.g., 'move chosen character to a location')",

  parse: (input: CstNode | string): MoveToLocationEffect | null => {
    if (typeof input === "string") {
      return parseFromText(input);
    }
    // CST parsing not implemented yet for location effects
    logger.warn("CST parsing not implemented for location effects");
    return null;
  },
};
