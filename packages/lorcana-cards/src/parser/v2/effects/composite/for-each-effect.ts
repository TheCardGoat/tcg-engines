/**
 * For-Each Effect Parser
 * Handles for-each effects like "for each X, Y" or "for each X you control, Y"
 * Parses effects that scale based on counting something
 */

import type { CstNode } from "chevrotain";
import { logger } from "../../logging";
import type { ForEachEffect } from "../../types";
import type { EffectParser } from "../atomic";
import { parseAtomicEffect } from "../atomic";

type ForEachCounter =
  | { type: "characters"; controller: "you" | "opponent" | "any" }
  | { type: "damaged-characters"; controller: "you" | "opponent" | "any" }
  | { type: "items"; controller: "you" | "opponent" }
  | { type: "locations"; controller: "you" | "opponent" }
  | { type: "cards-in-hand"; controller: "you" | "opponent" }
  | { type: "cards-in-discard"; controller: "you" | "opponent" }
  | { type: "damage-on-self" }
  | { type: "damage-on-target" }
  | { type: "damage-removed" }
  | { type: "lore-lost" }
  | { type: "cards-under-self" }
  | { type: "characters-that-sang"; thisTurn: boolean };

/**
 * Parse counter from iterator text
 */
function parseCounter(text: string): ForEachCounter | null {
  const normalized = text.toLowerCase();

  // Check for "their" (opponent) - do this first before other controller checks
  let controller: "you" | "opponent" | "any" = "any"; // Default to "any" initially
  if (/\btheir\b/i.test(normalized)) {
    controller = "opponent";
  }

  // Check for special counters that don't have controller property
  // These must be checked BEFORE generic "character" check

  // "characters that sang this turn" - no controller property
  if (/\bcharacters?\s+(?:that\s+)?sang\b/i.test(normalized)) {
    const thisTurn = /\bthis\s+turn\b/i.test(normalized);
    return { type: "characters-that-sang", thisTurn };
  }

  // "cards under this/that/chosen/it" - no controller property
  if (/\bcards?\s+under\s+(?:this|that|chosen|it)/i.test(normalized)) {
    return { type: "cards-under-self" };
  }

  // "damage counter on this/it/self/chosen" - no controller property
  if (/\bdamage\s+counter\s+on\s+(?:this|that|it|self)/i.test(normalized)) {
    return { type: "damage-on-self" };
  }

  // "damage counter on chosen character" - should be damage-on-target
  if (/\bdamage\s+counter\s+on\s+(?:chosen)/i.test(normalized)) {
    return { type: "damage-on-target" };
  }

  // "damage on this/it/self" (without "character") - no controller property
  if (
    /\bdamage\s+on\s+(?:this|that|it|self)(?:\s+character)?\s*$/i.test(
      normalized,
    )
  ) {
    return { type: "damage-on-self" };
  }

  // "damage on chosen character" - should be damage-on-target
  if (/\bdamage\s+on\s+chosen\s+character/i.test(normalized)) {
    return { type: "damage-on-target" };
  }

  // "damage removed" - no controller property
  if (normalized.includes("damage") && normalized.includes("removed")) {
    return { type: "damage-removed" };
  }

  // "lore lost" - no controller property
  if (normalized.includes("lore") && normalized.includes("lost")) {
    return { type: "lore-lost" };
  }

  // Characters - check for "damaged character" first (more specific)
  if (/\bdamaged\s+characters?\b/i.test(normalized)) {
    // For damaged characters, default to "any" if no explicit controller
    if (controller === "any") {
      if (normalized.includes("opponent")) {
        controller = "opponent";
      } else if (
        normalized.includes("you control") ||
        normalized.includes("your")
      ) {
        controller = "you";
      }
      // else: keep default "any" for damaged characters
    }
    return { type: "damaged-characters", controller };
  }

  // Regular characters - default to "you" if no controller specified
  if (normalized.includes("character")) {
    // Determine controller (opponent from "their", or explicit keywords, default to "you")
    if (controller === "any") {
      // Change default from "any" to "you" for regular characters
      controller = "you";
      if (normalized.includes("opponent")) {
        controller = "opponent";
      } else if (
        normalized.includes("you control") ||
        normalized.includes("your")
      ) {
        controller = "you";
      }
    }
    return { type: "characters", controller };
  }

  // Items
  if (normalized.includes("item")) {
    if (controller === "any") {
      controller = normalized.includes("opponent") ? "opponent" : "you";
    }
    return { type: "items", controller };
  }

  // Locations
  if (normalized.includes("location")) {
    if (controller === "any") {
      controller = normalized.includes("opponent") ? "opponent" : "you";
    }
    return { type: "locations", controller };
  }

  // Cards in hand
  if (normalized.includes("card") && normalized.includes("hand")) {
    if (controller === "any") {
      controller = normalized.includes("opponent") ? "opponent" : "you";
    }
    return { type: "cards-in-hand", controller };
  }

  // Cards in discard
  if (normalized.includes("card") && normalized.includes("discard")) {
    if (controller === "any") {
      controller = normalized.includes("opponent") ? "opponent" : "you";
    }
    return { type: "cards-in-discard", controller };
  }

  // Damage - generic damage patterns (no controller property)
  if (/\bdamage\b/i.test(normalized)) {
    // Skip if we're in "damaged character" territory
    if (/\bdamaged\s+characters?\b/i.test(normalized)) {
      return null; // Let the character check above handle it
    }
    if (normalized.includes("this") || normalized.includes("self")) {
      return { type: "damage-on-self" };
    }
    return { type: "damage-on-target" };
  }

  return null;
}

/**
 * Parse for-each effect from text string.
 * Identifies "for each" pattern and parses both the iterator and the effect.
 * Supports two patterns:
 * - "For each X, Y" (prefix pattern)
 * - "Y for each X" (suffix pattern)
 */
function parseFromText(text: string): ForEachEffect | null {
  logger.debug("Attempting to parse for-each effect from text", { text });

  // Try prefix pattern first: "for each X, Y"
  let forEachPattern = /^for\s+each\s+([^,]+),\s*(.+)/i;
  let match = text.match(forEachPattern);

  let iteratorText: string;
  let effectText: string;

  if (match) {
    // Prefix pattern: "For each X, Y"
    iteratorText = match[1].trim();
    effectText = match[2].trim();
  } else {
    // Try suffix pattern: "Y for each X"
    // Important: Exclude multi-sentence patterns (those containing ". " before "for each")
    // These should be parsed as sequences instead
    forEachPattern = /^(.+)\s+for\s+each\s+([^,.]+)$/i;
    match = text.match(forEachPattern);

    if (!match) {
      logger.debug("For-each effect pattern did not match");
      return null;
    }

    // Suffix pattern: "Y for each X"
    effectText = match[1].trim();
    iteratorText = match[2].trim();

    // Check if this is a multi-sentence pattern (contains period before "for each")
    // If so, let it be handled by the sequence parser instead
    if (effectText.includes(". ")) {
      logger.debug(
        "Multi-sentence pattern detected - delegating to sequence parser",
      );
      return null;
    }
  }

  logger.debug("Found for-each pattern", { iteratorText, effectText });

  // Parse the counter
  const counter = parseCounter(iteratorText);
  if (!counter) {
    logger.warn("Failed to parse for-each counter", { iteratorText });
    return null;
  }

  // Parse the effect part
  const effect = parseAtomicEffect(effectText);

  if (!effect) {
    logger.warn("Failed to parse for-each effect", { effectText });
    return null;
  }

  logger.info("Parsed for-each effect", { counter, effect });

  return {
    type: "for-each",
    counter: counter as any, // Type mismatch between local and imported ForEachCounter
    effect,
  };
}

/**
 * Parse for-each effect from CST node (grammar-based parsing).
 * For now, returns null as for-each effects are better handled via text parsing.
 */
function parseFromCst(_ctx: CstNode): ForEachEffect | null {
  logger.debug("CST-based for-each parsing not yet implemented");
  return null;
}

/**
 * For-each effect parser implementation
 */
export const forEachEffectParser: EffectParser = {
  pattern: /for\s+each\s+/i,
  description:
    "Parses for-each effects that scale with a count (e.g., 'for each character you control, gain 1 lore')",

  parse: (input: CstNode | string): ForEachEffect | null => {
    if (typeof input === "string") {
      return parseFromText(input);
    }
    return parseFromCst(input);
  },
};
