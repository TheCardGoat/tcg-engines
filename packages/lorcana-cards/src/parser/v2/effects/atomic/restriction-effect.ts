/**
 * Restriction Effect Parser
 * Handles restriction effects like "can't be challenged", "cannot challenge", "enters play exerted"
 */

import type { CstNode } from "chevrotain";
import { logger } from "../../logging";
import type { RestrictionEffect } from "../../types";
import type { EffectParser } from "./index";

/**
 * Parse restriction effect from text string (regex-based parsing)
 */
function parseFromText(text: string): RestrictionEffect | null {
  logger.debug("Attempting to parse restriction effect from text", { text });

  // Pattern: "can't be challenged" or "cannot be challenged"
  if (/[Cc]an'?t be challenged|cannot be challenged/.test(text)) {
    logger.info("Parsed 'can't be challenged' restriction");
    return {
      type: "restriction",
      restriction: "cant-be-challenged",
      target: "SELF",
    };
  }

  // Pattern: "can't challenge" or "cannot challenge"
  if (/[Cc]an'?t challenge|cannot challenge/.test(text)) {
    logger.info("Parsed 'can't challenge' restriction");
    return {
      type: "restriction",
      restriction: "cant-challenge",
      target: "SELF",
    };
  }

  // Pattern: "can't quest" or "cannot quest"
  if (/[Cc]an'?t quest|cannot quest/.test(text)) {
    logger.info("Parsed 'can't quest' restriction");

    // Check for duration modifiers
    let duration: "this-turn" | "next-turn" | "their-next-turn" | undefined;
    if (/this turn/i.test(text)) {
      duration = "this-turn";
    } else if (/their next turn/i.test(text)) {
      duration = "their-next-turn";
    } else if (/next turn/i.test(text)) {
      duration = "next-turn";
    }

    const effect: RestrictionEffect = {
      type: "restriction",
      restriction: "cant-quest",
      target: "SELF",
    };

    if (duration) {
      (effect as { duration: typeof duration }).duration = duration;
    }

    return effect;
  }

  // Pattern: "can't ready" or "cannot ready"
  if (/[Cc]an'?t ready|cannot ready/.test(text)) {
    logger.info("Parsed 'can't ready' restriction");

    // Check for duration modifiers
    let duration: "this-turn" | "next-turn" | "their-next-turn" | undefined;
    if (/this turn/i.test(text)) {
      duration = "this-turn";
    } else if (
      /their next turn/i.test(text) ||
      /at the start of their next turn/i.test(text)
    ) {
      duration = "their-next-turn";
    } else if (/next turn/i.test(text)) {
      duration = "next-turn";
    }

    const effect: RestrictionEffect = {
      type: "restriction",
      restriction: "cant-ready",
      target: "SELF",
    };

    if (duration) {
      (effect as { duration: typeof duration }).duration = duration;
    }

    return effect;
  }

  // Pattern: "enters play exerted"
  if (/[Ee]nters? play exerted/.test(text)) {
    logger.info("Parsed 'enters play exerted' restriction");
    return {
      type: "restriction",
      restriction: "enters-play-exerted",
      target: "SELF",
    };
  }

  // Pattern: "can challenge ready characters" (grant ability)
  if (/[Cc]an challenge ready characters/.test(text)) {
    logger.info("Parsed 'can challenge ready characters' grant ability");
    return {
      type: "grant-ability",
      ability: "can-challenge-ready",
      target: "SELF",
    } as RestrictionEffect;
  }

  logger.debug("Restriction effect pattern did not match");
  return null;
}

/**
 * Parse restriction effect from CST node (grammar-based parsing)
 * For now, delegates to text parsing
 */
function parseFromCst(_ctx: CstNode): RestrictionEffect | null {
  logger.debug("CST-based restriction parsing delegates to text parsing");
  return null;
}

/**
 * Restriction effect parser implementation
 */
export const restrictionEffectParser: EffectParser = {
  pattern:
    /(?:[Cc]an'?t be challenged|[Cc]an'?t challenge|[Cc]an'?t quest|[Cc]an'?t ready|cannot challenge|cannot quest|cannot ready|[Ee]nters? play exerted|[Cc]an challenge ready characters)/,
  description:
    "Parses restriction effects (e.g., 'can't be challenged', 'cannot challenge', 'can't quest', 'can't ready', 'enters play exerted')",

  parse: (input: CstNode | string): RestrictionEffect | null => {
    if (typeof input === "string") {
      return parseFromText(input);
    }
    return parseFromCst(input);
  },
};
