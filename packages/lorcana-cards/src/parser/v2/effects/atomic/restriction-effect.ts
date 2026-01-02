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
    /(?:[Cc]an'?t be challenged|[Cc]an'?t challenge|cannot challenge|[Ee]nters? play exerted|[Cc]an challenge ready characters)/,
  description:
    "Parses restriction effects (e.g., 'can't be challenged', 'cannot challenge', 'enters play exerted')",

  parse: (input: CstNode | string): RestrictionEffect | null => {
    if (typeof input === "string") {
      return parseFromText(input);
    }
    return parseFromCst(input);
  },
};
