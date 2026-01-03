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

  let optionsText = "";
  let isChooseOneFormat = false;

  // Check for "Choose one" pattern (with :, -, —, or space)
  const choicePattern = /choose\s+one[\s:−—-]+(.+)/i;
  const choiceMatch = trimmedText.match(choicePattern);

  if (choiceMatch) {
    isChooseOneFormat = true;
    optionsText = choiceMatch[1];
    logger.debug("Found 'Choose one' pattern", { optionsText });
  } else {
    // Check for "or" format without "Choose one"
    // Pattern: "X or Y" where X and Y are effects
    // Need to be careful not to match "3 or more" or "3 or less"
    const orPattern = /^(.+?)\s+or\s+(.+)$/i;
    const orMatch = trimmedText.match(orPattern);

    if (orMatch) {
      // Check if it's a valid "or" format (not "3 or more", "3 or less", etc.)
      const firstPart = orMatch[1].toLowerCase();
      const secondPart = orMatch[2].toLowerCase();

      // Exclude patterns like "3 or more", "3 or less", "3 or fewer"
      const excludedPatterns = [
        /\d+\s+or\s+more/,
        /\d+\s+or\s+less/,
        /\d+\s+or\s+fewer/,
        /more\s+or\s+less/,
      ];

      const isExcluded = excludedPatterns.some((pattern) =>
        pattern.test(trimmedText.toLowerCase()),
      );

      if (!isExcluded) {
        optionsText = trimmedText;
        logger.debug("Found 'or' format pattern", { optionsText });
      }
    }

    if (!optionsText) {
      logger.debug("Choice effect pattern did not match");
      return null;
    }
  }

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

  // Special handling for "or" format (without "Choose one")
  if (!isChooseOneFormat && normalizedText.toLowerCase().includes(" or ")) {
    // Split on " or " for simple "X or Y" format
    options = normalizedText
      .split(/\s+or\s+/i)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    logger.debug("Split choice options on 'or'", {
      optionCount: options.length,
    });
  }

  // 1. Bullet separator (•)
  if (options.length < 2 && normalizedText.includes("•")) {
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
