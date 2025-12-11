/**
 * Enum Expansion - Converts enum shortcuts to full DSL objects
 *
 * This module provides the mapping from string enum shortcuts to
 * their full DSL representations. This enables enums as syntactic
 * sugar while the DSL is the canonical form.
 *
 * @module targeting/enum-expansion
 */

import type {
  CharacterTarget,
  CharacterTargetEnum,
  ItemTarget,
  ItemTargetEnum,
  LocationTarget,
  LocationTargetEnum,
  LorcanaCardTarget,
  LorcanaCharacterTarget,
  LorcanaItemTarget,
  LorcanaLocationTarget,
} from "./lorcana-target-dsl";

// ============================================================================
// Character Target Expansions
// ============================================================================

/**
 * Mapping from character enum shortcuts to full DSL
 */
const CHARACTER_ENUM_EXPANSIONS: Record<CharacterTargetEnum, CharacterTarget> =
  {
    // Self-referential
    SELF: {
      selector: "self",
      cardType: "character",
      context: { self: true },
    },
    THIS_CHARACTER: {
      selector: "self",
      cardType: "character",
      context: { self: true },
    },

    // Chosen (single target, player choice)
    CHOSEN_CHARACTER: {
      selector: "chosen",
      count: 1,
      owner: "any",
      cardType: "character",
      zones: ["play"],
    },
    CHOSEN_OPPOSING_CHARACTER: {
      selector: "chosen",
      count: 1,
      owner: "opponent",
      cardType: "character",
      zones: ["play"],
    },
    CHOSEN_CHARACTER_OF_YOURS: {
      selector: "chosen",
      count: 1,
      owner: "you",
      cardType: "character",
      zones: ["play"],
    },
    ANOTHER_CHOSEN_CHARACTER: {
      selector: "chosen",
      count: 1,
      owner: "any",
      cardType: "character",
      zones: ["play"],
      excludeSelf: true,
    },
    ANOTHER_CHOSEN_CHARACTER_OF_YOURS: {
      selector: "chosen",
      count: 1,
      owner: "you",
      cardType: "character",
      zones: ["play"],
      excludeSelf: true,
    },

    // All/Each (multiple targets, automatic)
    ALL_CHARACTERS: {
      selector: "all",
      count: "all",
      owner: "any",
      cardType: "character",
      zones: ["play"],
    },
    ALL_OPPOSING_CHARACTERS: {
      selector: "all",
      count: "all",
      owner: "opponent",
      cardType: "character",
      zones: ["play"],
    },
    YOUR_CHARACTERS: {
      selector: "all",
      count: "all",
      owner: "you",
      cardType: "character",
      zones: ["play"],
    },
    YOUR_OTHER_CHARACTERS: {
      selector: "all",
      count: "all",
      owner: "you",
      cardType: "character",
      zones: ["play"],
      excludeSelf: true,
    },
    EACH_CHARACTER: {
      selector: "each",
      count: "all",
      owner: "any",
      cardType: "character",
      zones: ["play"],
    },
    EACH_OPPOSING_CHARACTER: {
      selector: "each",
      count: "all",
      owner: "opponent",
      cardType: "character",
      zones: ["play"],
    },

    // Damaged variants
    CHOSEN_DAMAGED_CHARACTER: {
      selector: "chosen",
      count: 1,
      owner: "any",
      cardType: "character",
      zones: ["play"],
      filters: [{ type: "damaged" }],
    },
    CHOSEN_OPPOSING_DAMAGED_CHARACTER: {
      selector: "chosen",
      count: 1,
      owner: "opponent",
      cardType: "character",
      zones: ["play"],
      filters: [{ type: "damaged" }],
    },
    ALL_OPPOSING_DAMAGED_CHARACTERS: {
      selector: "all",
      count: "all",
      owner: "opponent",
      cardType: "character",
      zones: ["play"],
      filters: [{ type: "damaged" }],
    },
  };

// ============================================================================
// Item Target Expansions
// ============================================================================

/**
 * Mapping from item enum shortcuts to full DSL
 */
const ITEM_ENUM_EXPANSIONS: Record<ItemTargetEnum, ItemTarget> = {
  CHOSEN_ITEM: {
    selector: "chosen",
    count: 1,
    owner: "any",
    cardType: "item",
    zones: ["play"],
  },
  CHOSEN_OPPOSING_ITEM: {
    selector: "chosen",
    count: 1,
    owner: "opponent",
    cardType: "item",
    zones: ["play"],
  },
  YOUR_ITEMS: {
    selector: "all",
    count: "all",
    owner: "you",
    cardType: "item",
    zones: ["play"],
  },
  ALL_ITEMS: {
    selector: "all",
    count: "all",
    owner: "any",
    cardType: "item",
    zones: ["play"],
  },
  ALL_OPPOSING_ITEMS: {
    selector: "all",
    count: "all",
    owner: "opponent",
    cardType: "item",
    zones: ["play"],
  },
  THIS_ITEM: {
    selector: "self",
    cardType: "item",
    context: { self: true },
  },
};

// ============================================================================
// Location Target Expansions
// ============================================================================

/**
 * Mapping from location enum shortcuts to full DSL
 */
const LOCATION_ENUM_EXPANSIONS: Record<LocationTargetEnum, LocationTarget> = {
  CHOSEN_LOCATION: {
    selector: "chosen",
    count: 1,
    owner: "any",
    cardType: "location",
    zones: ["play"],
  },
  CHOSEN_OPPOSING_LOCATION: {
    selector: "chosen",
    count: 1,
    owner: "opponent",
    cardType: "location",
    zones: ["play"],
  },
  YOUR_LOCATIONS: {
    selector: "all",
    count: "all",
    owner: "you",
    cardType: "location",
    zones: ["play"],
  },
  ALL_OPPOSING_LOCATIONS: {
    selector: "all",
    count: "all",
    owner: "opponent",
    cardType: "location",
    zones: ["play"],
  },
  THIS_LOCATION: {
    selector: "self",
    cardType: "location",
    context: { self: true },
  },
};

// ============================================================================
// Expansion Functions
// ============================================================================

/**
 * Check if a character target is an enum (vs DSL object)
 */
export function isCharacterEnum(
  target: LorcanaCharacterTarget,
): target is CharacterTargetEnum {
  return typeof target === "string" && target in CHARACTER_ENUM_EXPANSIONS;
}

/**
 * Expand a character target enum to full DSL
 *
 * @param target - Character target (enum or DSL)
 * @returns Full DSL representation
 */
export function expandCharacterTarget(
  target: LorcanaCharacterTarget,
): CharacterTarget {
  if (isCharacterEnum(target)) {
    const expansion = CHARACTER_ENUM_EXPANSIONS[target];
    if (!expansion) {
      throw new Error(`Unknown character target enum: ${target}`);
    }
    return expansion;
  }
  return target;
}

/**
 * Check if an item target is an enum
 */
export function isItemEnum(
  target: LorcanaItemTarget,
): target is ItemTargetEnum {
  return typeof target === "string" && target in ITEM_ENUM_EXPANSIONS;
}

/**
 * Expand an item target enum to full DSL
 */
export function expandItemTarget(target: LorcanaItemTarget): ItemTarget {
  if (isItemEnum(target)) {
    const expansion = ITEM_ENUM_EXPANSIONS[target];
    if (!expansion) {
      throw new Error(`Unknown item target enum: ${target}`);
    }
    return expansion;
  }
  return target;
}

/**
 * Check if a location target is an enum
 */
export function isLocationEnum(
  target: LorcanaLocationTarget,
): target is LocationTargetEnum {
  return typeof target === "string" && target in LOCATION_ENUM_EXPANSIONS;
}

/**
 * Expand a location target enum to full DSL
 */
export function expandLocationTarget(
  target: LorcanaLocationTarget,
): LocationTarget {
  if (isLocationEnum(target)) {
    const expansion = LOCATION_ENUM_EXPANSIONS[target];
    if (!expansion) {
      throw new Error(`Unknown location target enum: ${target}`);
    }
    return expansion;
  }
  return target;
}

/**
 * Expand any Lorcana target to full DSL
 *
 * Attempts to determine the type and expand accordingly
 */
export function expandTarget(
  target: LorcanaCharacterTarget | LorcanaItemTarget | LorcanaLocationTarget,
): LorcanaCardTarget {
  if (typeof target === "string") {
    // Try character enum first (most common)
    if (target in CHARACTER_ENUM_EXPANSIONS) {
      return CHARACTER_ENUM_EXPANSIONS[target as CharacterTargetEnum];
    }
    // Try item enum
    if (target in ITEM_ENUM_EXPANSIONS) {
      return ITEM_ENUM_EXPANSIONS[target as ItemTargetEnum];
    }
    // Try location enum
    if (target in LOCATION_ENUM_EXPANSIONS) {
      return LOCATION_ENUM_EXPANSIONS[target as LocationTargetEnum];
    }
    throw new Error(`Unknown target enum: ${target}`);
  }
  return target;
}

// ============================================================================
// All Enum Values (for validation)
// ============================================================================

/**
 * Set of all valid character target enum values
 */
export const CHARACTER_TARGET_ENUMS = new Set<string>(
  Object.keys(CHARACTER_ENUM_EXPANSIONS),
);

/**
 * Set of all valid item target enum values
 */
export const ITEM_TARGET_ENUMS = new Set<string>(
  Object.keys(ITEM_ENUM_EXPANSIONS),
);

/**
 * Set of all valid location target enum values
 */
export const LOCATION_TARGET_ENUMS = new Set<string>(
  Object.keys(LOCATION_ENUM_EXPANSIONS),
);

/**
 * Set of all valid target enum values
 */
export const ALL_TARGET_ENUMS = new Set<string>([
  ...CHARACTER_TARGET_ENUMS,
  ...ITEM_TARGET_ENUMS,
  ...LOCATION_TARGET_ENUMS,
]);
