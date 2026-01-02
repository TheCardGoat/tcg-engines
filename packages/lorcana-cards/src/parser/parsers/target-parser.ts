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
  ALL_ITEMS_PATTERN,
  ALL_LOCATIONS_PATTERN,
  ALL_OPPOSING_CHARACTERS_PATTERN,
  ALL_OPPOSING_ITEMS_PATTERN,
  ALL_OPPOSING_LOCATIONS_PATTERN,
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
  REFERENCED_PATTERNS,
  THE_CHALLENGED_CHARACTER_PATTERN,
  THE_CHALLENGING_CHARACTER_PATTERN,
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
      selector: "chosen",
      count: 1,
      owner: "opponent",
      zones: ["play"],
      cardTypes: ["character"],
    };
  }

  if (CHOSEN_CHARACTER_OF_YOURS_PATTERN.test(text)) {
    return {
      selector: "chosen",
      count: 1,
      owner: "you",
      zones: ["play"],
      cardTypes: ["character"],
    };
  }

  if (CHOSEN_CHARACTER_PATTERN.test(text)) {
    return {
      selector: "chosen",
      count: 1,
      owner: "any",
      zones: ["play"],
      cardTypes: ["character"],
    };
  }

  if (
    ALL_OPPOSING_CHARACTERS_PATTERN.test(text) ||
    EACH_OPPOSING_CHARACTER_PATTERN.test(text)
  ) {
    return {
      selector: "all",
      count: "all",
      owner: "opponent",
      zones: ["play"],
      cardTypes: ["character"],
    };
  }

  if (YOUR_CHARACTERS_PATTERN.test(text)) {
    return {
      selector: "all",
      count: "all",
      owner: "you",
      zones: ["play"],
      cardTypes: ["character"],
    };
  }

  if (ALL_CHARACTERS_PATTERN.test(text)) {
    return {
      selector: "all",
      count: "all",
      owner: "any",
      zones: ["play"],
      cardTypes: ["character"],
    };
  }

  if (hasSelfReference(text)) {
    return "SELF";
  }

  // TODO: Challenge-related targets need CardReference { ref: "defender" } or { ref: "attacker" }
  // These don't fit into CharacterTarget type - need to handle at effect level
  // if (THE_CHALLENGED_CHARACTER_PATTERN.test(text)) {
  //   return { ref: "defender" } as any;
  // }
  // if (THE_CHALLENGING_CHARACTER_PATTERN.test(text)) {
  //   return { ref: "attacker" } as any;
  // }

  if (REFERENCED_PATTERNS.some((p) => p.test(text))) {
    return "REFERENCED" as any;
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
      selector: "chosen",
      count: 1,
      owner: "any",
      zones: ["play"],
      cardTypes: ["item"],
    };
  }

  if (ALL_OPPOSING_ITEMS_PATTERN.test(text)) {
    return {
      selector: "all",
      count: "all",
      owner: "opponent",
      zones: ["play"],
      cardTypes: ["item"],
    };
  }

  if (ALL_ITEMS_PATTERN.test(text)) {
    return {
      selector: "all",
      count: "all",
      owner: "any",
      zones: ["play"],
      cardTypes: ["item"],
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
      selector: "chosen",
      count: 1,
      owner: "any",
      zones: ["play"],
      cardTypes: ["location"],
    };
  }

  if (ALL_OPPOSING_LOCATIONS_PATTERN.test(text)) {
    return {
      selector: "all",
      count: "all",
      owner: "opponent",
      zones: ["play"],
      cardTypes: ["location"],
    };
  }

  if (ALL_LOCATIONS_PATTERN.test(text)) {
    return {
      selector: "all",
      count: "all",
      owner: "any",
      zones: ["play"],
      cardTypes: ["location"],
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
