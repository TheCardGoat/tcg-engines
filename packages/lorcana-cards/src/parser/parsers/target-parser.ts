/**
 * Target Parser
 *
 * Parses target phrases from ability text into Target types.
 * Extracts who/what an effect applies to.
 *
 * Returns DSL objects (Query types) for consistent targeting.
 */

import type {
  CharacterTarget,
  ItemTarget,
  LocationTarget,
  PlayerTarget,
} from "@tcg/lorcana";
import {
  ALL_CHARACTERS_PATTERN,
  ALL_OPPOSING_CHARACTERS_PATTERN,
  CHOSEN_CHARACTER_OF_YOURS_PATTERN,
  CHOSEN_CHARACTER_PATTERN,
  CHOSEN_ITEM_PATTERN,
  CHOSEN_LOCATION_PATTERN,
  CHOSEN_OPPOSING_CHARACTER_PATTERN,
  CHOSEN_PLAYER_PATTERN,
  EACH_OPPONENT_PATTERN,
  EACH_OPPOSING_CHARACTER_PATTERN,
  EACH_PLAYER_PATTERN,
  hasSelfReference,
  OPPONENT_PATTERN,
  YOU_PATTERN,
  YOUR_CHARACTERS_PATTERN,
} from "../patterns/targets";

/**
 * Parse character target from text
 *
 * @param text - Text containing target phrase
 * @returns Character target DSL object or undefined if not found
 */
export function parseCharacterTarget(
  text: string,
): CharacterTarget | undefined {
  // Check for specific patterns first (most specific to least specific)
  if (CHOSEN_OPPOSING_CHARACTER_PATTERN.test(text)) {
    return {
      type: "query",
      cardType: "character",
      count: 1,
      controller: "opponent",
      zone: ["play"],
    };
  }

  if (CHOSEN_CHARACTER_OF_YOURS_PATTERN.test(text)) {
    return {
      type: "query",
      cardType: "character",
      count: 1,
      controller: "you",
      zone: ["play"],
    };
  }

  if (CHOSEN_CHARACTER_PATTERN.test(text)) {
    return {
      type: "query",
      cardType: "character",
      count: 1,
      controller: "any",
      zone: ["play"],
    };
  }

  if (
    ALL_OPPOSING_CHARACTERS_PATTERN.test(text) ||
    EACH_OPPOSING_CHARACTER_PATTERN.test(text)
  ) {
    return {
      type: "query",
      cardType: "character",
      count: "all",
      controller: "opponent",
      zone: ["play"],
    };
  }

  if (YOUR_CHARACTERS_PATTERN.test(text)) {
    return {
      type: "query",
      cardType: "character",
      count: "all",
      controller: "you",
      zone: ["play"],
    };
  }

  if (ALL_CHARACTERS_PATTERN.test(text)) {
    return {
      type: "query",
      cardType: "character",
      count: "all",
      controller: "any",
      zone: ["play"],
    };
  }

  if (hasSelfReference(text)) {
    return "SELF";
  }

  return undefined;
}

/**
 * Parse item target from text
 *
 * @param text - Text containing target phrase
 * @returns Item target DSL object or undefined if not found
 */
export function parseItemTarget(text: string): ItemTarget | undefined {
  if (CHOSEN_ITEM_PATTERN.test(text)) {
    return {
      type: "query",
      cardType: "item",
      count: 1,
      controller: "any",
      zone: ["play"],
    };
  }

  // TODO: Add more item patterns as needed

  return undefined;
}

/**
 * Parse location target from text
 *
 * @param text - Text containing target phrase
 * @returns Location target DSL object or undefined if not found
 */
export function parseLocationTarget(text: string): LocationTarget | undefined {
  if (CHOSEN_LOCATION_PATTERN.test(text)) {
    return {
      type: "query",
      cardType: "location",
      count: 1,
      controller: "any",
      zone: ["play"],
    };
  }

  // TODO: Add more location patterns as needed

  return undefined;
}

/**
 * Parse player target from text
 * Now supports "Chosen player" pattern
 *
 * @param text - Text containing target phrase
 * @returns Player target or undefined if not found
 */
export function parsePlayerTarget(text: string): PlayerTarget | undefined {
  // Check "Chosen player" first before more general patterns
  if (CHOSEN_PLAYER_PATTERN.test(text)) {
    return "CHOSEN_PLAYER";
  }

  // Check "Each player" before "Each opponent" since it's more specific
  if (EACH_PLAYER_PATTERN.test(text)) {
    return "EACH_PLAYER";
  }

  if (EACH_OPPONENT_PATTERN.test(text)) {
    return "EACH_OPPONENT";
  }

  if (OPPONENT_PATTERN.test(text)) {
    return "OPPONENT";
  }

  if (YOU_PATTERN.test(text)) {
    return "CONTROLLER";
  }

  return undefined;
}
