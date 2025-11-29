/**
 * Target Parser
 *
 * Parses target phrases from ability text into Target types.
 * Extracts who/what an effect applies to.
 *
 * Returns enum shortcuts for common patterns. Complex patterns
 * can be parsed into full DSL objects when needed.
 */

import type { PlayerTarget } from "../../cards/abilities/types/target-types";
import type {
  CharacterTargetEnum,
  ItemTargetEnum,
  LocationTargetEnum,
} from "../../targeting";
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
 * @returns Character target enum or undefined if not found
 */
export function parseCharacterTarget(
  text: string,
): CharacterTargetEnum | undefined {
  // Check for specific patterns first (most specific to least specific)
  if (CHOSEN_OPPOSING_CHARACTER_PATTERN.test(text)) {
    return "CHOSEN_OPPOSING_CHARACTER";
  }

  if (CHOSEN_CHARACTER_OF_YOURS_PATTERN.test(text)) {
    return "CHOSEN_CHARACTER_OF_YOURS";
  }

  if (CHOSEN_CHARACTER_PATTERN.test(text)) {
    return "CHOSEN_CHARACTER";
  }

  if (
    ALL_OPPOSING_CHARACTERS_PATTERN.test(text) ||
    EACH_OPPOSING_CHARACTER_PATTERN.test(text)
  ) {
    return "ALL_OPPOSING_CHARACTERS";
  }

  if (YOUR_CHARACTERS_PATTERN.test(text)) {
    return "YOUR_CHARACTERS";
  }

  if (ALL_CHARACTERS_PATTERN.test(text)) {
    return "ALL_CHARACTERS";
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
 * @returns Item target enum or undefined if not found
 */
export function parseItemTarget(text: string): ItemTargetEnum | undefined {
  if (CHOSEN_ITEM_PATTERN.test(text)) {
    return "CHOSEN_ITEM";
  }

  // TODO: Add more item patterns as needed

  return undefined;
}

/**
 * Parse location target from text
 *
 * @param text - Text containing target phrase
 * @returns Location target enum or undefined if not found
 */
export function parseLocationTarget(
  text: string,
): LocationTargetEnum | undefined {
  if (CHOSEN_LOCATION_PATTERN.test(text)) {
    return "CHOSEN_LOCATION";
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
