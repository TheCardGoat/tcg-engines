// Target Mapping System for Action Text Parser
// Maps text patterns to existing target definitions

import {
  anotherChosenCharacter,
  anotherChosenCharOfYours,
  chosenCharacter,
  chosenCharacterItemOrLocation,
  chosenCharacterOfYours,
  chosenCharacterOrLocation,
  chosenDamagedCharacter,
  chosenItem,
  chosenItemOfYours,
  chosenOpposingCharacter,
  chosenOpposingDamagedCharacter,
  opposingCharacters,
  otherCharacters,
  yourDamagedCharacters,
  yourOtherCharacters,
} from "@lorcanito/lorcana-engine/abilities/target";
import { opponent, self } from "@lorcanito/lorcana-engine/abilities/targets";
import type {
  CardEffectTarget,
  PlayerEffectTarget,
} from "@lorcanito/lorcana-engine/effects/effectTargets";

// Define TargetFilter locally since it's not exported from the module
interface TargetFilter {
  filter: string;
  value: string | string[] | number;
}

/**
 * Maps common text patterns to existing target definitions
 */
export const TARGET_PATTERN_MAP: Record<
  string,
  CardEffectTarget | PlayerEffectTarget
> = {
  // Character targets
  "chosen character": chosenCharacter,
  "chosen character of yours": chosenCharacterOfYours,
  "chosen opposing character": chosenOpposingCharacter,
  "chosen damaged character": chosenDamagedCharacter,
  "chosen opposing damaged character": chosenOpposingDamagedCharacter,
  "another chosen character": anotherChosenCharacter,
  "another chosen character of yours": anotherChosenCharOfYours,

  // Multiple character targets
  "opposing characters": opposingCharacters,
  "your other characters": yourOtherCharacters,
  "your damaged characters": yourDamagedCharacters,
  "other characters": otherCharacters,

  // Item targets
  "chosen item": chosenItem,
  "chosen item of yours": chosenItemOfYours,

  // Mixed targets
  "chosen character, item, or location": chosenCharacterItemOrLocation,
  "chosen character or location": chosenCharacterOrLocation,

  // Player targets
  you: self,
  "each opponent": opponent,
  opponent: opponent,
};

/**
 * Creates a custom CardEffectTarget based on parsed components
 */
export function createCustomCardTarget(
  type: string | string[],
  zone = "play",
  owner?: "self" | "opponent",
  status?: string,
  value: number | "all" = 1,
  excludeSelf?: boolean,
): CardEffectTarget {
  const filters: TargetFilter[] = [
    { filter: "type", value: type },
    { filter: "zone", value: zone },
  ];

  if (owner) {
    filters.push({ filter: "owner", value: owner });
  }

  if (status) {
    filters.push({ filter: "status", value: status });
  }

  // Cast filters to the expected type to satisfy the type checker
  return {
    type: "card",
    value,
    filters: filters as any, // Type assertion needed due to filter type mismatch
    ...(excludeSelf && { excludeSelf: true }),
  };
}

/**
 * Creates a custom PlayerEffectTarget
 */
export function createCustomPlayerTarget(
  value: "self" | "opponent" | "all" = "self",
): PlayerEffectTarget {
  return {
    type: "player",
    value,
  };
}

/**
 * Parses text patterns and returns appropriate targets
 */
export function parseTargetFromText(
  text: string,
): CardEffectTarget | PlayerEffectTarget | null {
  const normalizedText = text.toLowerCase().trim();

  // Check direct pattern matches first
  if (TARGET_PATTERN_MAP[normalizedText]) {
    return TARGET_PATTERN_MAP[normalizedText];
  }

  // Parse complex patterns

  // Handle "your X" patterns
  if (normalizedText.startsWith("your ")) {
    const remainder = normalizedText.substring(5);

    if (remainder === "characters") {
      return createCustomCardTarget(
        "character",
        "play",
        "self",
        undefined,
        "all",
      );
    }
    if (remainder === "items") {
      return createCustomCardTarget("item", "play", "self", undefined, "all");
    }
    if (remainder === "locations") {
      return createCustomCardTarget(
        "location",
        "play",
        "self",
        undefined,
        "all",
      );
    }
    if (remainder === "hand") {
      return createCustomCardTarget(
        ["character", "item", "location", "action"],
        "hand",
        "self",
        undefined,
        "all",
      );
    }
    if (remainder === "discard") {
      return createCustomCardTarget(
        ["character", "item", "location", "action"],
        "discard",
        "self",
        undefined,
        "all",
      );
    }
    if (remainder === "deck") {
      return createCustomCardTarget(
        ["character", "item", "location", "action"],
        "deck",
        "self",
        undefined,
        "all",
      );
    }
  }

  // Handle "opponent's X" or "their X" patterns
  if (
    normalizedText.includes("opponent") ||
    normalizedText.startsWith("their ")
  ) {
    if (normalizedText.includes("character")) {
      return createCustomCardTarget(
        "character",
        "play",
        "opponent",
        undefined,
        "all",
      );
    }
    if (normalizedText.includes("item")) {
      return createCustomCardTarget(
        "item",
        "play",
        "opponent",
        undefined,
        "all",
      );
    }
    if (normalizedText.includes("location")) {
      return createCustomCardTarget(
        "location",
        "play",
        "opponent",
        undefined,
        "all",
      );
    }
    if (normalizedText.includes("hand")) {
      return createCustomCardTarget(
        ["character", "item", "location", "action"],
        "hand",
        "opponent",
        undefined,
        "all",
      );
    }
  }

  // Handle zone-specific patterns
  if (normalizedText.includes("from your hand")) {
    return createCustomCardTarget(
      ["character", "item", "location", "action"],
      "hand",
      "self",
    );
  }
  if (normalizedText.includes("from your discard")) {
    return createCustomCardTarget(
      ["character", "item", "location", "action"],
      "discard",
      "self",
    );
  }
  if (normalizedText.includes("from your deck")) {
    return createCustomCardTarget(
      ["character", "item", "location", "action"],
      "deck",
      "self",
    );
  }

  // Handle status-based patterns
  if (normalizedText.includes("damaged")) {
    if (normalizedText.includes("character")) {
      const owner = normalizedText.includes("your")
        ? "self"
        : normalizedText.includes("opponent")
          ? "opponent"
          : undefined;
      return createCustomCardTarget("character", "play", owner, "damaged");
    }
  }

  if (normalizedText.includes("ready")) {
    if (normalizedText.includes("character")) {
      const owner = normalizedText.includes("your")
        ? "self"
        : normalizedText.includes("opponent")
          ? "opponent"
          : undefined;
      return createCustomCardTarget("character", "play", owner, "ready");
    }
    if (normalizedText.includes("item")) {
      const owner = normalizedText.includes("your")
        ? "self"
        : normalizedText.includes("opponent")
          ? "opponent"
          : undefined;
      return createCustomCardTarget("item", "play", owner, "ready");
    }
  }

  if (normalizedText.includes("exerted")) {
    if (normalizedText.includes("character")) {
      const owner = normalizedText.includes("your")
        ? "self"
        : normalizedText.includes("opponent")
          ? "opponent"
          : undefined;
      return createCustomCardTarget("character", "play", owner, "exerted");
    }
  }

  // Handle "each X" patterns
  if (normalizedText.startsWith("each ")) {
    const remainder = normalizedText.substring(5);

    if (remainder === "opponent") {
      return createCustomPlayerTarget("opponent");
    }
    if (remainder === "player") {
      return createCustomPlayerTarget("all");
    }
    if (remainder.includes("character")) {
      const owner = remainder.includes("your")
        ? "self"
        : remainder.includes("opponent")
          ? "opponent"
          : undefined;
      return createCustomCardTarget(
        "character",
        "play",
        owner,
        undefined,
        "all",
      );
    }
  }

  // Return null if no pattern matches
  return null;
}

/**
 * Generates target filters based on text analysis
 */
export function generateTargetFilters(text: string): TargetFilter[] {
  const normalizedText = text.toLowerCase().trim();
  const filters: TargetFilter[] = [];

  // Type filters
  if (normalizedText.includes("character")) {
    filters.push({ filter: "type", value: "character" });
  } else if (normalizedText.includes("item")) {
    filters.push({ filter: "type", value: "item" });
  } else if (normalizedText.includes("location")) {
    filters.push({ filter: "type", value: "location" });
  } else if (normalizedText.includes("action")) {
    filters.push({ filter: "type", value: "action" });
  }

  // Zone filters
  if (
    normalizedText.includes("in play") ||
    normalizedText.includes("on the field")
  ) {
    filters.push({ filter: "zone", value: "play" });
  } else if (
    normalizedText.includes("in hand") ||
    normalizedText.includes("from your hand")
  ) {
    filters.push({ filter: "zone", value: "hand" });
  } else if (
    normalizedText.includes("in discard") ||
    normalizedText.includes("from discard")
  ) {
    filters.push({ filter: "zone", value: "discard" });
  } else if (
    normalizedText.includes("in deck") ||
    normalizedText.includes("from deck")
  ) {
    filters.push({ filter: "zone", value: "deck" });
  } else if (normalizedText.includes("inkwell")) {
    filters.push({ filter: "zone", value: "inkwell" });
  }

  // Owner filters
  if (
    normalizedText.includes("your") ||
    normalizedText.includes("you control")
  ) {
    filters.push({ filter: "owner", value: "self" });
  } else if (
    normalizedText.includes("opponent") ||
    normalizedText.includes("opposing")
  ) {
    filters.push({ filter: "owner", value: "opponent" });
  }

  // Status filters
  if (normalizedText.includes("damaged")) {
    filters.push({ filter: "status", value: "damaged" });
  } else if (normalizedText.includes("ready")) {
    filters.push({ filter: "status", value: "ready" });
  } else if (normalizedText.includes("exerted")) {
    filters.push({ filter: "status", value: "exerted" });
  }

  // Ability filters
  if (normalizedText.includes("evasive")) {
    filters.push({ filter: "ability", value: "evasive" });
  } else if (normalizedText.includes("ward")) {
    filters.push({ filter: "ability", value: "ward" });
  } else if (normalizedText.includes("bodyguard")) {
    filters.push({ filter: "ability", value: "bodyguard" });
  }

  return filters;
}

/**
 * Validates that a target is properly formed
 */
export function validateTarget(
  target: CardEffectTarget | PlayerEffectTarget,
): boolean {
  if (!(target && target.type)) {
    return false;
  }

  if (target.type === "card") {
    const cardTarget = target as CardEffectTarget;
    return !!(
      cardTarget.value &&
      cardTarget.filters &&
      cardTarget.filters.length > 0
    );
  }

  if (target.type === "player") {
    const playerTarget = target as PlayerEffectTarget;
    return !!playerTarget.value;
  }

  return false;
}

/**
 * Combines multiple target patterns into complex targeting
 */
export function combineTargets(
  targets: (CardEffectTarget | PlayerEffectTarget)[],
  operator: "and" | "or" = "and",
): CardEffectTarget | PlayerEffectTarget | null {
  if (targets.length === 0) return null;
  if (targets.length === 1) {
    const target = targets[0];
    return target || null; // Ensure we return null instead of undefined
  }

  // For now, return the first non-null target as combining logic is complex
  // This can be expanded based on specific requirements
  for (const target of targets) {
    if (target) return target;
  }
  return null;
}
