/**
 * Restriction Effect Parser
 * Handles restriction effects like "can't be challenged", "cannot challenge", "enters play exerted"
 */

import type { CstNode } from "chevrotain";
import { logger } from "../../logging";
import type { EffectParser } from "./index";

// RestrictionEffect is not exported from types, define locally
interface RestrictionEffect {
  type: "restriction";
  restriction: string;
  target?: string;
  duration?: "this-turn" | "next-turn" | "their-next-turn";
}

// GrantAbilityEffect for effects that grant abilities to characters
interface GrantAbilityEffect {
  type: "grant-ability";
  ability: string;
  target: string;
}

/**
 * Parse restriction effect from text string (regex-based parsing)
 * Note: Returns RestrictionEffect | GrantAbilityEffect union since this parser
 * handles both restriction effects and ability-granting effects
 */
function parseFromText(text: string): RestrictionEffect | GrantAbilityEffect | null {
  logger.debug("Attempting to parse restriction effect from text", { text });

  // Pattern: "can't be challenged" or "cannot be challenged"
  if (/[Cc]an'?t be challenged|cannot be challenged/.test(text)) {
    logger.info("Parsed 'can't be challenged' restriction");
    return {
      restriction: "cant-be-challenged",
      target: "SELF",
      type: "restriction",
    };
  }

  // Pattern: "can't challenge" or "cannot challenge"
  if (/[Cc]an'?t challenge|cannot challenge/.test(text)) {
    logger.info("Parsed 'can't challenge' restriction");
    return {
      restriction: "cant-challenge",
      target: "SELF",
      type: "restriction",
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
      restriction: "cant-quest",
      target: "SELF",
      type: "restriction",
    };

    if (duration) {
      effect.duration = duration;
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
    } else if (/their next turn/i.test(text) || /at the start of their next turn/i.test(text)) {
      duration = "their-next-turn";
    } else if (/next turn/i.test(text)) {
      duration = "next-turn";
    }

    const effect: RestrictionEffect = {
      restriction: "cant-ready",
      target: "SELF",
      type: "restriction",
    };

    if (duration) {
      effect.duration = duration;
    }

    return effect;
  }

  // Pattern: "enters play exerted"
  if (/[Ee]nters? play exerted/.test(text)) {
    logger.info("Parsed 'enters play exerted' restriction");
    return {
      restriction: "enters-play-exerted",
      target: "SELF",
      type: "restriction",
    };
  }

  // Pattern: "can't challenge ready characters" (grant ability)
  if (/[Cc]an challenge ready characters/.test(text)) {
    logger.info("Parsed 'can challenge ready characters' grant ability");
    const grantEffect: GrantAbilityEffect = {
      ability: "can-challenge-ready",
      target: "SELF",
      type: "grant-ability",
    };
    return grantEffect;
  }

  // Pattern: "can't {E} to sing songs" or "cannot exert to sing"
  if (/[Cc]an'?t\s*\{E\}\s+to\s+sing\s+songs|[Cc]annot\s+(?:exert|{E})\s+to\s+sing/i.test(text)) {
    logger.info("Parsed 'can't sing' restriction");
    return {
      restriction: "cant-sing",
      target: "SELF",
      type: "restriction",
    };
  }

  // Pattern: "can't sing" (general singing restriction)
  // Must not be followed by "songs" as that's handled by a different pattern
  if (/(?:[Cc]an'?t\s+sing|cannot\s+sing)(?!\s+songs)/i.test(text)) {
    logger.info("Parsed 'can't sing' restriction");
    return {
      restriction: "cant-sing",
      target: "SELF",
      type: "restriction",
    };
  }

  // Pattern: "opponents can't be healed" or "opposing characters can't be healed"
  if (/[Oo]pponents? can'?t be healed|[Oo]pposing characters can'?t be healed/i.test(text)) {
    logger.info("Parsed 'can't be healed' restriction");
    return {
      restriction: "cant-be-healed",
      target: "OPPONENT",
      type: "restriction",
    };
  }

  // Pattern: "can't be healed"
  if (/[Cc]an'?t be healed/i.test(text)) {
    logger.info("Parsed 'can't be healed' restriction");
    const effect: RestrictionEffect = {
      restriction: "cant-be-healed",
      type: "restriction",
    };

    // Determine target
    if (/opposing characters/i.test(text)) {
      effect.target = "OPPOSING_CHARACTER";
    } else if (/chosen character/i.test(text)) {
      effect.target = "CHOSEN_CHARACTER";
    } else {
      effect.target = "SELF";
    }

    return effect;
  }

  // Pattern: "can't ready during their next turn"
  if (/[Cc]an'?t ready during their next turn/i.test(text)) {
    logger.info("Parsed 'can't ready during next turn' restriction");
    return {
      duration: "their-next-turn",
      restriction: "cant-ready",
      target: "SELF",
      type: "restriction",
    };
  }

  logger.debug("Restriction effect pattern did not match");
  return null;
}

/**
 * Parse restriction effect from CST node (grammar-based parsing)
 * For now, delegates to text parsing
 */
function parseFromCst(_ctx: CstNode): RestrictionEffect | GrantAbilityEffect | null {
  logger.debug("CST-based restriction parsing delegates to text parsing");
  return null;
}

/**
 * Restriction effect parser implementation
 * Note: Returns RestrictionEffect | GrantAbilityEffect union since this parser
 * handles both restriction effects and ability-granting effects
 */
export const restrictionEffectParser: EffectParser = {
  description:
    "Parses restriction effects and ability-granting effects (e.g., 'can't be challenged', 'cannot challenge', 'can challenge ready characters', 'can't sing', 'can't be healed')",
  parse: (input: CstNode | string) => {
    if (typeof input === "string") {
      return parseFromText(input) as any;
    }
    return parseFromCst(input) as any;
  },

  pattern:
    /(?:[Cc]an'?t be challenged|[Cc]an'?t challenge|[Cc]an'?t quest|[Cc]an'?t ready|[Cc]an'?t\s*\{E\}\s+to\s+sing|[Cc]an'?t\s+sing|[Cc]an'?t be healed|cannot challenge|cannot quest|cannot ready|cannot\s+sing|[Ee]nters? play exerted|[Cc]an challenge ready characters)/,
} as any; // Type mismatch due to local RestrictionEffect type definition
