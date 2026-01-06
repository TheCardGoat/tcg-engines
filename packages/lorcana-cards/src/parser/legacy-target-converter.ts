/**
 * Legacy Target Converter
 *
 * Converts legacy @lorcanito/lorcana-engine target/filter objects
 * to new @tcg/lorcana-types target format.
 */

import type {
  CharacterFilter,
  CharacterTarget,
  CharacterTargetEnum,
  CharacterTargetQuery,
  ItemTarget,
  LocationTarget,
  PlayerTarget,
} from "@tcg/lorcana-types";
import type {
  ChallengerFilter,
  CharacteristicsFilter,
  DamageFilter,
  InkColorFilter,
  OwnerFilter,
  TypeFilter,
  ZoneFilter,
} from "./legacy-ability-types";

/**
 * Legacy target structure from @lorcanito/lorcana-engine
 */
export interface LegacyTarget {
  type: "card" | "player";
  value: number | "all";
  filters?: LegacyFilter[];
}

export type LegacyFilter =
  | ZoneFilter
  | OwnerFilter
  | TypeFilter
  | CharacteristicsFilter
  | InkColorFilter
  | DamageFilter
  | ChallengerFilter;

/**
 * Convert legacy target to character target
 *
 * @param legacyTarget - Legacy target object or simple string
 * @returns New format character target
 */
export function convertLegacyToCharacterTarget(
  legacyTarget: LegacyTarget | "self" | "opponent",
): CharacterTarget {
  // Handle simple string targets
  if (legacyTarget === "self") {
    return "SELF";
  }
  if (legacyTarget === "opponent") {
    return "CHOSEN_OPPOSING_CHARACTER";
  }

  // Handle player targets
  if (legacyTarget.type === "player") {
    return (legacyTarget as { value: string }).value === "self"
      ? "SELF"
      : "CHOSEN_OPPOSING_CHARACTER";
  }

  // Complex target with filters
  return convertLegacyCardTarget(legacyTarget);
}

/**
 * Convert legacy card target to character target
 */
export function convertLegacyCardTarget(
  legacyTarget: LegacyTarget,
): CharacterTarget {
  // Extract filters
  const filters = legacyTarget.filters ?? [];

  // Check for common patterns that can be simplified to enums
  const enumTarget = tryConvertToEnum(legacyTarget);
  if (enumTarget) {
    return enumTarget;
  }

  // Build query-based target
  return convertToQueryTarget(legacyTarget);
}

/**
 * Try to convert legacy target to a simple enum
 */
function tryConvertToEnum(
  legacyTarget: LegacyTarget,
): CharacterTargetEnum | null {
  const filters = legacyTarget.filters ?? [];

  // Get owner filter
  const ownerFilter = filters.find((f) => f.filter === "owner") as
    | OwnerFilter
    | undefined;
  const owner = ownerFilter?.value; // "self" | "opponent"

  // Get type filter
  const typeFilter = filters.find((f) => f.filter === "type") as
    | TypeFilter
    | undefined;
  const type = typeFilter?.value; // "character" | "action" | "item"

  // Get zone filter
  const zoneFilter = filters.find((f) => f.filter === "zone") as
    | ZoneFilter
    | undefined;
  const zone = zoneFilter?.value; // "play" | "hand" | "deck" | "discard" | "inkwell"

  // Check for "all" value
  if (legacyTarget.value === "all") {
    if (owner === "self" && type === "character" && zone === "play") {
      return "YOUR_CHARACTERS";
    }
    if (owner === "opponent" && type === "character" && zone === "play") {
      return "ALL_OPPOSING_CHARACTERS";
    }
    if (!owner && type === "character" && zone === "play") {
      return "ALL_CHARACTERS";
    }
  }

  // Check for single chosen target
  if (legacyTarget.value === 1) {
    if (owner === "self" && type === "character" && zone === "play") {
      return "CHOSEN_CHARACTER_OF_YOURS";
    }
    if (owner === "opponent" && type === "character" && zone === "play") {
      return "CHOSEN_OPPOSING_CHARACTER";
    }
    if (!owner && type === "character" && zone === "play") {
      return "CHOSEN_CHARACTER";
    }
  }

  // Can't simplify to enum
  return null;
}

/**
 * Convert to query-based target
 */
function convertToQueryTarget(
  legacyTarget: LegacyTarget,
): CharacterTargetQuery {
  const filters = legacyTarget.filters ?? [];

  // Get owner filter
  const ownerFilter = filters.find((f) => f.filter === "owner") as
    | OwnerFilter
    | undefined;
  const owner = ownerFilter?.value; // "self" | "opponent"

  // Map owner to new format
  const ownerMap: Record<string, "you" | "opponent"> = {
    self: "you",
    opponent: "opponent",
  };

  // Convert filters
  const convertedFilters = convertFilters(filters);

  // Handle count based on discriminated union
  if (legacyTarget.value === "all") {
    return {
      selector: "all",
      count: "all",
      ...(owner && { owner: ownerMap[owner] }),
      ...(convertedFilters.length > 0 && { filter: convertedFilters }),
    };
  }

  const exactCount =
    typeof legacyTarget.value === "number" ? legacyTarget.value : 1;

  return {
    selector: "chosen",
    count: exactCount,
    ...(owner && { owner: ownerMap[owner] }),
    ...(convertedFilters.length > 0 && { filter: convertedFilters }),
  };
}

/**
 * Convert legacy filters to new format
 */
export function convertFilters(filters: LegacyFilter[]): CharacterFilter[] {
  const convertedFilters: CharacterFilter[] = [];

  for (const filter of filters) {
    const converted = convertFilter(filter);
    if (converted) {
      convertedFilters.push(converted);
    }
  }

  return convertedFilters;
}

/**
 * Convert single legacy filter
 */
function convertFilter(filter: LegacyFilter): CharacterFilter | null {
  switch (filter.filter) {
    case "zone":
      return convertZoneFilter(filter);

    case "owner":
      // Owner is handled at the target level, not as a filter
      return null;

    case "type":
      return convertTypeFilter(filter);

    case "characteristics":
      return convertCharacteristicsFilter(filter);

    case "inkColor":
      return convertInkColorFilter(filter);

    case "damage":
      return convertDamageFilter(filter);

    case "challenger":
      return convertChallengerFilter(filter);

    default:
      console.warn(
        `Unknown legacy filter type: ${(filter as { filter: string }).filter}`,
      );
      return null;
  }
}

/**
 * Convert zone filter
 */
function convertZoneFilter(filter: ZoneFilter): CharacterFilter | null {
  // New format doesn't use zone filter for "play" - it's implied
  // For other zones, we'll need to handle differently
  if (filter.value === "play") {
    return null; // Zone is implied for character targets
  }

  return {
    type: "zone",
    zone: filter.value,
  };
}

/**
 * Convert type filter
 */
function convertTypeFilter(filter: TypeFilter): CharacterFilter | null {
  // Type filter is implied by the target type (CharacterTarget)
  // So we don't need to convert it for characters
  return null;
}

/**
 * Convert characteristics filter
 */
function convertCharacteristicsFilter(
  filter: CharacteristicsFilter,
): CharacterFilter {
  // Characteristics map to classifications
  const value = Array.isArray(filter.value) ? filter.value[0] : filter.value;

  // Capitalize first letter
  const classification = value.charAt(0).toUpperCase() + value.slice(1);

  return {
    type: "has-classification",
    classification,
  };
}

/**
 * Convert ink color filter
 */
function convertInkColorFilter(filter: InkColorFilter): CharacterFilter {
  // Ink color filter - may need special handling
  // For now, we'll convert to a generic attribute filter
  const value = Array.isArray(filter.value) ? filter.value[0] : filter.value;

  return {
    type: "attribute",
    attribute: "inkColor" as any, // This may need to be added to the type system
    comparison: "equals",
    value,
  };
}

/**
 * Convert damage filter
 */
function convertDamageFilter(filter: DamageFilter): CharacterFilter {
  if (filter.value === "damaged") {
    return { type: "damaged" };
  }
  if (filter.value === "undamaged") {
    return { type: "undamaged" };
  }

  // Default to damaged if unknown value
  return { type: "damaged" };
}

/**
 * Convert challenger filter
 */
function convertChallengerFilter(filter: ChallengerFilter): CharacterFilter {
  // Challenger filter - may need special handling
  return {
    type: "challenge-role" as any,
    role: filter.value ? "attacker" : "defender",
  };
}

/**
 * Convert legacy target to player target
 */
export function convertLegacyToPlayerTarget(
  legacyTarget: LegacyTarget | "self" | "opponent",
): PlayerTarget {
  if (legacyTarget === "self") {
    return "CONTROLLER";
  }
  if (legacyTarget === "opponent") {
    return "OPPONENT";
  }

  if (legacyTarget.type === "player") {
    return (legacyTarget as { value: string }).value === "self"
      ? "CONTROLLER"
      : "OPPONENT";
  }

  // Check owner filter for card targets
  const ownerFilter = legacyTarget.filters?.find((f) => f.filter === "owner") as
    | OwnerFilter
    | undefined;
  if (ownerFilter) {
    return ownerFilter.value === "self" ? "CONTROLLER" : "OPPONENT";
  }

  return "CONTROLLER";
}

/**
 * Convert legacy target to location target
 */
export function convertLegacyToLocationTarget(
  legacyTarget: LegacyTarget | "self" | "opponent",
): LocationTarget {
  // Similar logic to character target, but for locations
  // This is a simplified version - may need expansion
  if (legacyTarget === "self") {
    return "THIS_LOCATION";
  }

  if (typeof legacyTarget === "string") {
    // Should be "opponent" which doesn't make sense for location
    return "CHOSEN_LOCATION";
  }

  const enumTarget = tryConvertToLocationEnum(legacyTarget);
  if (enumTarget) {
    return enumTarget;
  }

  // TODO: Implement query-based location targets
  return "CHOSEN_LOCATION";
}

function tryConvertToLocationEnum(
  _legacyTarget: LegacyTarget,
): LocationTarget | null {
  // TODO: Implement location enum conversion
  return null;
}

/**
 * Convert legacy target to item target
 */
export function convertLegacyToItemTarget(
  legacyTarget: LegacyTarget | "self" | "opponent",
): ItemTarget {
  // Similar logic to character target, but for items
  if (legacyTarget === "self") {
    return "THIS_ITEM";
  }

  if (typeof legacyTarget === "string") {
    // Should be "opponent" which doesn't make sense for item
    return "CHOSEN_ITEM";
  }

  const enumTarget = tryConvertToItemEnum(legacyTarget);
  if (enumTarget) {
    return enumTarget;
  }

  // TODO: Implement query-based item targets
  return "CHOSEN_ITEM";
}

function tryConvertToItemEnum(_legacyTarget: LegacyTarget): ItemTarget | null {
  // TODO: Implement item enum conversion
  return null;
}
