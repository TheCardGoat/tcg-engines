/**
 * Discard Hand Effect Parser
 * Handles discard hand effects like "Each player discards their hand", "discard your hand"
 */

import type { DiscardEffect } from "@tcg/lorcana-types";
import type { CstNode } from "chevrotain";
import { logger } from "../../logging";
import type { EffectParser } from "./index";

/**
 * Parse discard hand effect from text string (regex-based parsing)
 */
function parseFromText(text: string): DiscardEffect | null {
  logger.debug("Attempting to parse discard hand effect from text", { text });

  // Pattern: "Each player discards their hand"
  if (/each\s+player\ss+discards?\s+(?:their\s+)?hand/i.test(text)) {
    logger.info("Parsed each player discards hand effect");

    return {
      type: "discard",
      amount: -1, // -1 indicates "all cards" for hand
      target: "EACH_PLAYER",
    };
  }

  // Pattern: "Each opponent discards their hand"
  if (/each\s+opponent\s+discards?\s+(?:their\s+)?hand/i.test(text)) {
    logger.info("Parsed each opponent discards hand effect");

    return {
      amount: -1,
      target: "EACH_OPPONENT",
      type: "discard",
    };
  }

  // Pattern: "discard your hand" (controller)
  if (/^(?:you\s+)?discard\s+(?:your\s+)?hand/i.test(text)) {
    logger.info("Parsed discard your hand effect");

    return {
      amount: -1,
      target: "CONTROLLER",
      type: "discard",
    };
  }

  logger.debug("Discard hand effect pattern did not match");
  return null;
}

/**
 * Discard hand effect parser implementation
 */
export const discardHandEffectParser: EffectParser = {
  description:
    "Parses discard hand effects (e.g., 'each player discards their hand', 'discard your hand')",
  parse: (input: CstNode | string): DiscardEffect | null => {
    if (typeof input === "string") {
      return parseFromText(input);
    }
    // CST parsing not implemented yet for discard hand effects
    logger.warn("CST parsing not implemented for discard hand effects");
    return null;
  },

  pattern:
    /(?:each\s+(?:player|opponent)\s+discards?(?:\s+their)?\s+hand|discard\s+(?:your\s+)?hand)/i,
};
