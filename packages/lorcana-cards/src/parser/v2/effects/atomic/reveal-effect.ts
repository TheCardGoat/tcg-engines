/**
 * Reveal Effect Parser
 * Handles reveal effects like "reveal your hand" or "reveal the top card"
 */

import type { CstNode } from "chevrotain";
import { logger } from "../../logging";
import type { Effect, PlayerTarget, RevealHandEffect, RevealTopCardEffect } from "../../types";
import type { EffectParser } from "./index";

/**
 * Parse reveal effect from text string (regex-based parsing)
 */
function parseFromText(text: string): RevealHandEffect | RevealTopCardEffect | Effect | null {
  logger.debug("Attempting to parse reveal effect from text", { text });

  // Pattern: "reveal (your )?(hand|top card|X cards)"
  const revealHandPattern = /reveal\s+(?:your\s+)?hand/i;
  const revealTopCardPattern = /reveal\s+the\s+top\s+card/i;

  // Check for "reveal hand"
  if (revealHandPattern.test(text)) {
    const target: PlayerTarget = text.includes("opponent") ? "OPPONENT" : "CONTROLLER";

    logger.info("Parsed reveal hand effect", { target });

    const effect: RevealHandEffect = {
      target,
      type: "reveal-hand",
    };
    return effect;
  }

  // Check for "reveal top card"
  if (revealTopCardPattern.test(text)) {
    const target: PlayerTarget = text.includes("opponent") ? "OPPONENT" : "CONTROLLER";

    logger.info("Parsed reveal top card effect", { target });

    const effect: RevealTopCardEffect = {
      target,
      type: "reveal-top-card",
    };
    return effect;
  }

  // Pattern: "look at opponent's hand"
  if (/look at\s+(?:your\s+)?(?:opponent'?s?|opposing)\s+hand/i.test(text)) {
    logger.info("Parsed look at opponent hand effect");

    // Use reveal-hand type with opponent target
    const effect: RevealHandEffect = {
      target: "OPPONENT",
      type: "reveal-hand",
    };
    return effect;
  }

  // Pattern: "look at the top X cards of your deck"
  const lookAtTopPattern =
    /look at\s+(?:the\s+)?top\s+(\d+|\{d\})\s+cards?\s+(?:of\s+)?(?:your\s+)?(?:deck|library)/i;
  const lookAtMatch = text.match(lookAtTopPattern);

  if (lookAtMatch) {
    const amountValue = lookAtMatch[1];
    const amount = amountValue === "{d}" ? -1 : Number.parseInt(amountValue, 10);

    if (Number.isNaN(amount)) {
      logger.warn("Failed to extract number from look at effect text", {
        match: amountValue,
      });
      return null;
    }

    logger.info("Parsed look at top cards effect", { amount });

    // Use reveal-top-card type with count
    const effect: RevealTopCardEffect = {
      type: "reveal-top-card",
      target: "CONTROLLER",
      // @ts-expect-error - adding count property not in core type yet
      count: amount,
    };
    return effect;
  }

  logger.debug("Reveal effect pattern did not match");
  return null;
}

/**
 * Reveal effect parser implementation
 */
export const revealEffectParser: EffectParser = {
  description:
    "Parses reveal and look-at effects (e.g., 'reveal your hand', 'look at opponent's hand', 'look at the top 3 cards of your deck')",
  parse: (input: CstNode | string): RevealHandEffect | RevealTopCardEffect | Effect | null => {
    if (typeof input === "string") {
      return parseFromText(input);
    }
    // CST parsing not implemented yet for reveal effects
    logger.warn("CST parsing not implemented for reveal effects");
    return null;
  },

  pattern: /(?:reveal|look at)\s+(?:your\s+)?(?:hand|top|the|cards?|opponent'?s?)/i,
};
