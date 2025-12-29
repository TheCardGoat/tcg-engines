/**
 * Choice Effect Parser
 * Handles choice effects like "Choose one: X; or Y" or "Choose one - X; or Y"
 * Parses effects where the player selects from multiple options
 */

import type { CstNode } from "chevrotain";
import { logger } from "../../logging";
import type { Effect } from "../../types";
import type { EffectParser } from "../atomic";
import { parseAtomicEffect } from "../atomic";

/**
 * Parse choice effect from text string.
 * Identifies "Choose one" pattern and splits options on "; or" separator.
 */
function parseFromText(text: string): Effect | null {
  logger.debug("Attempting to parse choice effect from text", { text });

  // Match "Choose one" pattern (with : or -)
  const choicePattern = /choose\s+one[\s:−-]+(.+)/i;
  const match = text.match(choicePattern);

  if (!match) {
    logger.debug("Choice effect pattern did not match");
    return null;
  }

  const optionsText = match[1];
  logger.debug("Found choice pattern", { optionsText });

  // Split options on "; or" or similar separators
  const separators = ["; or ", ";or ", "; Or ", "; OR "];
  let options: string[] = [];

  for (const separator of separators) {
    if (optionsText.toLowerCase().includes(separator.toLowerCase())) {
      const regex = new RegExp(separator, "gi");
      options = optionsText.split(regex).map((s) => s.trim());
      logger.debug("Split choice options", {
        separator,
        optionCount: options.length,
      });
      break;
    }
  }

  // Try splitting on just semicolon if no "or" separator found
  if (options.length < 2 && optionsText.includes(";")) {
    options = optionsText.split(";").map((s) => s.trim());
    logger.debug("Split choice options on semicolon", {
      optionCount: options.length,
    });
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
  for (let i = 0; i < options.length; i++) {
    const option = options[i];
    logger.debug("Parsing choice option", { optionIndex: i, option });

    const effect = parseAtomicEffect(option);
    if (effect) {
      effects.push(effect);
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
  };
}

/**
 * Parse choice effect from CST node (grammar-based parsing).
 * For now, returns null as choice effects are better handled via text parsing.
 */
function parseFromCst(ctx: CstNode): Effect | null {
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

  parse: (input: CstNode | string): Effect | null => {
    if (typeof input === "string") {
      return parseFromText(input);
    }
    return parseFromCst(input);
  },
};
