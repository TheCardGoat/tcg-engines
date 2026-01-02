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

  // First, check for "or" format without explicit "Choose one"
  // This must come before the "Choose one" check to avoid matching "Choose one: X. Y or Z"
  const orPattern = /^([^.!?]+)\s+or\s+([^.!?]+)$/i;
  const orMatch = text.match(orPattern);
  if (orMatch) {
    const option1 = orMatch[1].trim();
    const option2 = orMatch[2].trim();

    const effect1 = parseAtomicEffect(option1);
    const effect2 = parseAtomicEffect(option2);

    if (effect1 && effect2) {
      logger.info("Parsed 'or' format choice effect", { option1, option2 });
      return {
        type: "choice",
        options: [effect1, effect2],
        optionLabels: [option1, option2],
      };
    }
    logger.debug("'or' format choice effect did not parse both options");
    return null;
  }

  // Match "Choose one" pattern (with : or -)
  const choicePattern = /choose\s+one[\s:−-]+(.+)/i;
  const match = text.match(choicePattern);

  if (!match) {
    logger.debug("Choice effect pattern did not match");
    return null;
  }

  const optionsText = match[1];
  logger.debug("Found choice pattern", { optionsText });

  // Try different separators in order
  let options: string[] = [];

  // 1. Bullet separator (•)
  if (optionsText.includes("•")) {
    options = optionsText
      .split("•")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    logger.debug("Split choice options on bullets", {
      optionCount: options.length,
    });
  }

  // 2. Semicolon with "or" separator
  if (options.length < 2) {
    const semicolonOrPattern = /;\s*or\s*/i;
    if (semicolonOrPattern.test(optionsText)) {
      options = optionsText.split(semicolonOrPattern).map((s) => s.trim());
      logger.debug("Split choice options on semicolon-or", {
        optionCount: options.length,
      });
    }
  }

  // 3. Period separator (only if not in "or" format)
  if (options.length < 2) {
    // Split on period, but only if followed by another effect-like phrase
    // This avoids splitting on "X. Y or Z" where Y is part of an option
    const periodParts = optionsText
      .split(".")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    if (
      periodParts.length >= 2 &&
      !optionsText.toLowerCase().includes(" or ")
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
