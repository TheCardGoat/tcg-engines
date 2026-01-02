/**
 * Choice Effect Parser
 * Handles choice effects like "Choose one: X; or Y" or "Choose one - X; or Y"
 * Parses effects where the player selects from multiple options
 */

import type { CstNode } from "chevrotain";
import { logger } from "../../logging";
import type { ChoiceEffect, Effect } from "../../types";
import type { EffectParser } from "../atomic";
import { parseAtomicEffect } from "../atomic";

/**
 * Parse choice effect from text string.
 * Identifies "Choose one" pattern and splits options on various separators.
 * Supports:
 * - Semicolon with "or": "Choose one: X; or Y"
 * - Period separator: "Choose one: X. Y."
 * - Bullet separator: "Choose one: • X • Y"
 * - "or" format: "X or Y" (without explicit "Choose one")
 */
function parseFromText(text: string): ChoiceEffect | null {
  logger.debug("Attempting to parse choice effect from text", { text });

  // Trim whitespace from input
  const trimmedText = text.trim();

  // Check for "Choose one" pattern (with :, -, —, or space)
  // The choice effect parser only handles explicit "Choose one" patterns
  const choicePattern = /choose\s+one[\s:−—-]+(.+)/i;
  const choiceMatch = trimmedText.match(choicePattern);

  if (!choiceMatch) {
    logger.debug("Choice effect pattern did not match");
    return null;
  }

  const optionsText = choiceMatch[1];
  logger.debug("Found choice pattern", { optionsText });

  // Try different separators in order
  let options: string[] = [];

  // Normalize extra whitespace in options text
  // "Choose one  :   deal 3 damage  ;   or   gain 2 lore" becomes "deal 3 damage; or gain 2 lore"
  const normalizedText = optionsText
    .replace(/\s+/g, " ") // Multiple spaces to single space
    .replace(/\s*;\s*/g, "; ") // Normalize semicolons
    .replace(/\s*;\s*or\s*/gi, "; or ") // Normalize semicolon-or
    .replace(/\s*\.\s*/g, ". ") // Normalize periods
    .trim();

  // 1. Bullet separator (•)
  if (normalizedText.includes("•")) {
    options = normalizedText
      .split("•")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    logger.debug("Split choice options on bullets", {
      optionCount: options.length,
    });
  }

  // 2. Semicolon with "or" separator (case-insensitive, handles multiple "or" links)
  if (options.length < 2) {
    // Check for pattern like: "X; or Y; or Z" or "X; or Y"
    const semicolonOrPattern = /;\s*or\s+/gi;
    if (semicolonOrPattern.test(normalizedText)) {
      // Split on "; or" (case-insensitive)
      options = normalizedText
        .split(semicolonOrPattern)
        .map((s) => s.replace(/^;\s*/, "").trim()) // Remove leading semicolon if any
        .filter((s) => s.length > 0);
      logger.debug("Split choice options on semicolon-or", {
        optionCount: options.length,
      });
    }
  }

  // 3. Semicolon separator (without "or")
  if (options.length < 2) {
    // Check for pattern like: "X; Y; Z" (semicolon without "or")
    if (
      normalizedText.includes(";") &&
      !normalizedText.toLowerCase().includes(" or ")
    ) {
      options = normalizedText
        .split(";")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      logger.debug("Split choice options on semicolons", {
        optionCount: options.length,
      });
    }
  }

  // 4. Period separator (only if not in "or" format)
  if (options.length < 2) {
    // Split on period, but only if followed by another effect-like phrase
    // This avoids splitting on "X. Y or Z" where Y is part of an option
    const periodParts = normalizedText
      .split(".")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    if (
      periodParts.length >= 2 &&
      !normalizedText.toLowerCase().includes(" or ")
    ) {
      options = periodParts;
      logger.debug("Split choice options on periods", {
        optionCount: options.length,
      });
    }
  }

  // Must have at least 2 options
  if (options.length < 2) {
    logger.warn("Choice effect requires at least 2 options", {
      optionsFound: options.length,
    });
    return null;
  }

  // Parse each option as an atomic effect
  const effects: Effect[] = [];
  const labels: string[] = [];

  for (let i = 0; i < options.length; i++) {
    const option = options[i];
    logger.debug("Parsing choice option", { optionIndex: i, option });

    const effect = parseAtomicEffect(option);
    if (effect) {
      effects.push(effect);
      labels.push(option);
      logger.debug("Successfully parsed choice option", {
        optionIndex: i,
        effect,
      });
    } else {
      logger.warn("Failed to parse choice option", { optionIndex: i, option });
      // Continue parsing other options
    }
  }

  // Need at least 2 successfully parsed options
  if (effects.length < 2) {
    logger.warn("Choice effect requires at least 2 valid options", {
      parsedOptions: effects.length,
    });
    return null;
  }

  logger.info("Parsed choice effect", {
    totalOptions: options.length,
    parsedOptions: effects.length,
  });

  return {
    type: "choice",
    options: effects,
    optionLabels: labels,
  };
}

/**
 * Parse choice effect from CST node (grammar-based parsing).
 * For now, returns null as choice effects are better handled via text parsing.
 */
function parseFromCst(_ctx: CstNode): ChoiceEffect | null {
  logger.debug("CST-based choice parsing not yet implemented");
  return null;
}

/**
 * Choice effect parser implementation
 */
export const choiceEffectParser: EffectParser = {
  pattern: /choose\s+one[\s:−-]+/i,
  description:
    "Parses choice effects where player selects one option (e.g., 'Choose one: Deal 3 damage; or gain 2 lore')",

  parse: (input: CstNode | string): ChoiceEffect | null => {
    if (typeof input === "string") {
      return parseFromText(input);
    }
    return parseFromCst(input);
  },
};
