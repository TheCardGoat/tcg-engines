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
  | { type: "cards-under-self" }
  | { type: "characters-that-sang"; thisTurn: boolean };

/**
 * Parse counter from iterator text
 */
function parseCounter(text: string): ForEachCounter | null {
  const normalized = text.toLowerCase();

  // Characters
  if (normalized.includes("character")) {
    const controller = normalized.includes("opponent")
      ? "opponent"
      : normalized.includes("you control") || normalized.includes("your")
        ? "you"
        : "any";
    if (normalized.includes("damaged")) {
      return { type: "damaged-characters", controller };
    }
    return { type: "characters", controller };
  }

  // Items
  if (normalized.includes("item")) {
    const controller = normalized.includes("opponent") ? "opponent" : "you";
    return { type: "items", controller };
  }

  // Locations
  if (normalized.includes("location")) {
    const controller = normalized.includes("opponent") ? "opponent" : "you";
    return { type: "locations", controller };
  }

  // Cards in hand
  if (normalized.includes("card") && normalized.includes("hand")) {
    const controller = normalized.includes("opponent") ? "opponent" : "you";
    return { type: "cards-in-hand", controller };
  }

  // Cards in discard
  if (normalized.includes("card") && normalized.includes("discard")) {
    const controller = normalized.includes("opponent") ? "opponent" : "you";
    return { type: "cards-in-discard", controller };
  }

  // Damage
  if (normalized.includes("damage")) {
    if (normalized.includes("this") || normalized.includes("self")) {
      return { type: "damage-on-self" };
    }
    return { type: "damage-on-target" };
  }

  // Cards under
  if (normalized.includes("card") && normalized.includes("under")) {
    return { type: "cards-under-self" };
  }

  return null;
}

/**
 * Parse for-each effect from text string.
 * Identifies "for each" pattern and parses both the iterator and the effect.
 */
function parseFromText(text: string): ForEachEffect | null {
  logger.debug("Attempting to parse for-each effect from text", { text });

  // Match "for each X, Y" pattern
  const forEachPattern = /for\s+each\s+([^,]+),\s*(.+)/i;
  const match = text.match(forEachPattern);

  if (!match) {
    logger.debug("For-each effect pattern did not match");
    return null;
  }

  const iteratorText = match[1].trim();
  const effectText = match[2].trim();

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
    counter,
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
