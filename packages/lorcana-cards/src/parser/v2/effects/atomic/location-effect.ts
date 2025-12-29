/**
 * Location Effect Parser
 * Handles location movement effects like "move to location"
 */

import type { CstNode } from "chevrotain";
import { logger } from "../../logging";
import type { Effect } from "../../types";
import type { EffectParser } from "./index";

/**
 * Parse location effect from text string (regex-based parsing)
 */
function parseFromText(text: string): Effect | null {
  logger.debug("Attempting to parse location effect from text", { text });

  // Pattern: "move (chosen character|...) to a location"
  const moveToLocationPattern =
    /move\s+(?:chosen\s+)?(?:character|card).*?to\s+a\s+location/i;

  if (!moveToLocationPattern.test(text)) {
    logger.debug("Location effect pattern did not match");
    return null;
  }

  // Determine character target
  let character = "chosen-character";

  if (text.includes("chosen character of yours")) {
    character = "chosen-character-of-yours";
  } else if (text.includes("this character")) {
    character = "self";
  } else if (text.includes("chosen character")) {
    character = "chosen-character";
  }

  // Check if movement is free
  const isFree = text.includes("for free");

  logger.info("Parsed move to location effect", { character, isFree });

  return {
    type: "move-to-location",
    character,
    cost: isFree ? "free" : "normal",
  };
}

/**
 * Location effect parser implementation
 */
export const locationEffectParser: EffectParser = {
  pattern: /move.*?to\s+a\s+location/i,
  description:
    "Parses location movement effects (e.g., 'move chosen character to a location')",

  parse: (input: CstNode | string): Effect | null => {
    if (typeof input === "string") {
      return parseFromText(input);
    }
    // CST parsing not implemented yet for location effects
    logger.warn("CST parsing not implemented for location effects");
    return null;
  },
};
