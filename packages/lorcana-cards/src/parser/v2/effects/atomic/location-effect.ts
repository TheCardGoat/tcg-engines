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

  // Pattern: "move (one of your characters|a character of yours|chosen character|...) to a/this location"
  // Note: "a character" alone (without "of yours") should not parse - requires "chosen"
  const moveToLocationPattern =
    /move\s+(?:one\s+of\s+your\s+|a\s+character\s+of yours\s+|your\s+|chosen\s+)?(?:characters?|card).*?to\s+(?:a|this)\s+location(?:\s+for free)?/i;

  if (!moveToLocationPattern.test(text)) {
    logger.debug("Location effect pattern did not match");
    return null;
  }

  // Determine character target
  let character: CharacterTarget = "CHOSEN_CHARACTER";

  if (text.includes("one of your characters") || text.includes("a character of yours")) {
    character = "CHOSEN_CHARACTER_OF_YOURS";
  } else if (text.includes("chosen character of yours")) {
    character = "CHOSEN_CHARACTER_OF_YOURS";
  } else if (text.includes("this character")) {
    character = "SELF";
  } else if (text.includes("chosen character")) {
    character = "CHOSEN_CHARACTER";
  } else if (text.includes("your character") || text.includes("your characters")) {
    character = "CHOSEN_CHARACTER_OF_YOURS";
  }

  // Check if movement is free
  const isFree = text.includes("for free");

  logger.info("Parsed move to location effect", { character, isFree });

  const effect: MoveToLocationEffect = {
    character,
    cost: isFree ? "free" : "normal",
    type: "move-to-location",
  };
  return effect;
}

/**
 * Location effect parser implementation
 */
export const locationEffectParser: EffectParser = {
  description:
    "Parses location movement effects (e.g., 'move chosen character to a location', 'move a character of yours to a location')",
  parse: (input: CstNode | string): MoveToLocationEffect | null => {
    if (typeof input === "string") {
      return parseFromText(input);
    }
    // CST parsing not implemented yet for location effects
    logger.warn("CST parsing not implemented for location effects");
    return null;
  },

  pattern:
    /move\s+(?:one\s+of\s+your\s+|a\s+character\s+of yours\s+|your\s+|chosen\s+)?(?:characters?|card).*?to\s+(?:a|this)\s+location/i,
};
