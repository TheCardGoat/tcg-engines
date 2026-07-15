/**
 * Targeting UI Utilities
 *
 * Provides utilities for UI integration with the targeting DSL.
 * Converts DSL specifications to human-readable descriptions and
 * UI hints for target selection interfaces.
 *
 * @module targeting/targeting-ui
 */

import type { TargetingUIHint } from "@tcg/core";
import {
  expandCharacterTarget,
  expandItemTarget,
  expandLocationTarget,
  isCharacterEnum,
  isItemEnum,
  isLocationEnum,
} from "./enum-expansion";
import type {
  LorcanaCardTarget,
  LorcanaCharacterTarget,
  LorcanaFilter,
  LorcanaItemTarget,
  LorcanaLocationTarget,
} from "./lorcana-target-dsl";

// ============================================================================
// Description Generation
// ============================================================================

/**
 * Generate a human-readable description of a target specification
 *
 * @param target - Target DSL or enum
 * @returns Human-readable description
 *
 * @example
 * ```typescript
 * generateTargetDescription("CHOSEN_OPPOSING_CHARACTER")
 * // => "an opposing character"
 *
 * generateTargetDescription({
 *   selector: "all",
 *   owner: "opponent",
 *   cardType: "character",
 *   filters: [{ type: "damaged" }]
 * })
 * // => "all opposing damaged characters"
 * ```
 */
export function generateTargetDescription(
  target: LorcanaCharacterTarget | LorcanaItemTarget | LorcanaLocationTarget,
): string {
  // Expand enum to DSL if needed
  let dsl: LorcanaCardTarget;
  if (typeof target === "string") {
    if (isCharacterEnum(target as LorcanaCharacterTarget)) {
      dsl = expandCharacterTarget(target as LorcanaCharacterTarget);
    } else if (isItemEnum(target as LorcanaItemTarget)) {
      dsl = expandItemTarget(target as LorcanaItemTarget);
    } else if (isLocationEnum(target as LorcanaLocationTarget)) {
      dsl = expandLocationTarget(target as LorcanaLocationTarget);
    } else {
      return target; // Fallback to raw string
    }
  } else {
    dsl = target;
  }

  return generateDSLDescription(dsl);
}

/**
 * Generate description from a DSL object
 */
function generateDSLDescription(target: LorcanaCardTarget): string {
  const parts: string[] = [];

  // Handle self-reference
  if (target.selector === "self") {
    return `this ${target.cardType || "card"}`;
  }

  // Count/Selector
  if (target.selector === "all" || target.selector === "each") {
    parts.push("all");
  } else if (target.selector === "chosen") {
    const count = getCountValue(target.count);
    if (count === 1) {
      // Defer article choice until we know the next word
      parts.push("__ARTICLE__");
    } else if (typeof count === "number") {
      parts.push(String(count));
    } else if (count && typeof count === "object" && "upTo" in count) {
      parts.push(`up to ${count.upTo}`);
    }
  }

  // Ownership
  if (target.owner === "opponent") {
    parts.push("opposing");
  } else if (target.owner === "you") {
    parts.push("your");
  }

  // Filter-based adjectives (state filters come before card type)
  if (target.filters) {
    for (const filter of target.filters) {
      const adjective = getFilterAdjective(filter);
      if (adjective) {
        parts.push(adjective);
      }
    }
  }

  // Card type (pluralized if multiple)
  const cardType = target.cardType || "card";
  const isPlural =
    target.selector === "all" ||
    target.selector === "each" ||
    (typeof target.count === "number" && target.count > 1);
  parts.push(isPlural ? pluralize(cardType) : cardType);

  // Numeric filter suffixes
  if (target.filters) {
    for (const filter of target.filters) {
      const suffix = getFilterSuffix(filter);
      if (suffix) {
        parts.push(suffix);
      }
    }
  }

  // Replace article placeholder with correct article based on following word
  const result = parts.join(" ");
  return result.replace(/__ARTICLE__\s+(\w)/, (_, nextChar) => {
    const vowels = ["a", "e", "i", "o", "u"];
    return vowels.includes(nextChar.toLowerCase()) ? `an ${nextChar}` : `a ${nextChar}`;
  });
}

/**
 * Get count value from TargetCount
 */
function getCountValue(
  count: LorcanaCardTarget["count"],
): number | { upTo: number } | "all" | undefined {
  if (count === undefined) {
    return 1;
  }
  if (count === "all") {
    return "all";
  }
  if (typeof count === "number") {
    return count;
  }
  if ("exactly" in count) {
    return count.exactly;
  }
  if ("upTo" in count) {
    return { upTo: count.upTo };
  }
  if ("atLeast" in count) {
    return count.atLeast;
  }
  if ("between" in count) {
    return count.between[0];
  }
  return 1;
}

/**
 * Exhaustive check helper - fails at compile time if a case is not handled
 */
function assertNever(x: never): never {
  throw new Error(`Unhandled filter type: ${JSON.stringify(x)}`);
}

/**
 * Get adjective form of a filter (for placement before card type)
 */
function getFilterAdjective(filter: LorcanaFilter): string | undefined {
  switch (filter.type) {
    case "damaged": {
      return "damaged";
    }
    case "undamaged": {
      return "undamaged";
    }
    case "exerted": {
      return "exerted";
    }
    case "ready": {
      return "ready";
    }
    case "dry": {
      return "fresh";
    }
    case "inkable": {
      return filter.value ? "inkable" : "non-inkable";
    }
    // Filters that don't produce adjectives (handled in getFilterSuffix)
    case "has-keyword":
    case "has-classification":
    case "cost":
    case "strength":
    case "willpower":
    case "lore-value":
    case "name":
    case "at-location":
    case "move-cost":
    case "and":
    case "or":
    case "card-type":
    case "not": {
      return undefined;
    }
    default: {
      // Exhaustive check - will fail to compile if a new filter type is added
      return assertNever(filter);
    }
  }
}

/**
 * Get suffix form of a filter (for placement after card type)
 */
function getFilterSuffix(filter: LorcanaFilter): string | undefined {
  switch (filter.type) {
    case "has-keyword": {
      return `with ${filter.keyword}`;
    }
    case "has-classification": {
      return `with ${filter.classification} classification`;
    }
    case "cost": {
      return `with cost ${getComparisonSymbol(filter.comparison)} ${filter.value}`;
    }
    case "strength": {
      return `with strength ${getComparisonSymbol(filter.comparison)} ${filter.value}`;
    }
    case "willpower": {
      return `with willpower ${getComparisonSymbol(filter.comparison)} ${filter.value}`;
    }
    case "lore-value": {
      return `with lore ${getComparisonSymbol(filter.comparison)} ${filter.value}`;
    }
    case "at-location": {
      return filter.location ? `at ${filter.location}` : "at a location";
    }
    case "move-cost": {
      return `with move cost ${getComparisonSymbol(filter.comparison)} ${filter.value}`;
    }
    case "name": {
      if ("equals" in filter) {
        return `named ${filter.equals}`;
      }
      if ("contains" in filter) {
        return `with "${filter.contains}" in name`;
      }
      return undefined;
    }
    // State filters handled in getFilterAdjective
    case "damaged":
    case "undamaged":
    case "exerted":
    case "ready":
    case "dry":
    case "inkable": {
      return undefined;
    }
    // Composite filters - recursively process
    case "and":
    case "or":
    case "card-type":
    case "not": {
      return undefined;
    }
    default: {
      // Exhaustive check - will fail to compile if a new filter type is added
      return assertNever(filter);
    }
  }
}

/**
 * Get comparison symbol for display
 */
function getComparisonSymbol(comparison: "eq" | "ne" | "gt" | "gte" | "lt" | "lte"): string {
  switch (comparison) {
    case "eq": {
      return "=";
    }
    case "ne": {
      return "!=";
    }
    case "gt": {
      return ">";
    }
    case "gte": {
      return ">=";
    }
    case "lt": {
      return "<";
    }
    case "lte": {
      return "<=";
    }
  }
}

/**
 * Pluralize a card type name
 */
function pluralize(word: string): string {
  if (word.endsWith("y")) {
    return `${word.slice(0, -1)}ies`;
  }
  if (word.endsWith("s") || word.endsWith("x") || word.endsWith("ch")) {
    return `${word}es`;
  }
  return `${word}s`;
}

// ============================================================================
// UI Hint Generation
// ============================================================================

/**
 * Generate UI hints for target selection
 *
 * @param target - Target DSL or enum
 * @returns UI hints for rendering selection interface
 */
export function getTargetUIHints(
  target: LorcanaCharacterTarget | LorcanaItemTarget | LorcanaLocationTarget,
): LorcanaTargetUIHint {
  // Expand enum to DSL if needed
  let dsl: LorcanaCardTarget;
  if (typeof target === "string") {
    if (isCharacterEnum(target as LorcanaCharacterTarget)) {
      dsl = expandCharacterTarget(target as LorcanaCharacterTarget);
    } else if (isItemEnum(target as LorcanaItemTarget)) {
      dsl = expandItemTarget(target as LorcanaItemTarget);
    } else if (isLocationEnum(target as LorcanaLocationTarget)) {
      dsl = expandLocationTarget(target as LorcanaLocationTarget);
    } else {
      // Fallback for unknown enum
      return {
        cardType: undefined,
        highlightZones: ["play"],
        maxSelections: 1,
        minSelections: 1,
        optional: false,
        ownerFilter: "any",
        prompt: "Choose a target",
        selectionType: "single",
      };
    }
  } else {
    dsl = target;
  }

  return generateUIHintsFromDSL(dsl);
}

/**
 * Extended UI hints with Lorcana-specific info
 */
export interface LorcanaTargetUIHint extends TargetingUIHint {
  /** Card type to filter by */
  cardType: string | undefined;
  /** Owner filter for highlighting */
  ownerFilter: "you" | "opponent" | "any";
}

/**
 * Generate UI hints from DSL object
 */
function generateUIHintsFromDSL(target: LorcanaCardTarget): LorcanaTargetUIHint {
  const description = generateDSLDescription(target);

  // Determine selection type
  let selectionType: LorcanaTargetUIHint["selectionType"];
  if (target.selector === "self") {
    selectionType = "none";
  } else if (target.selector === "all" || target.selector === "each") {
    selectionType = "automatic";
  } else if (target.selector === "random" || target.selector === "any") {
    selectionType = "automatic";
  } else {
    // "chosen" - check count for single vs multiple
    const { count } = target;
    if (count === "all") {
      selectionType = "multiple";
    } else if (typeof count === "number") {
      selectionType = count > 1 ? "multiple" : "single";
    } else if (count && "upTo" in count) {
      selectionType = count.upTo > 1 ? "multiple" : "single";
    } else if (count && "between" in count) {
      selectionType = count.between[1] > 1 ? "multiple" : "single";
    } else {
      selectionType = "single";
    }
  }

  // Calculate min/max
  let minSelections = 1;
  let maxSelections: number | "unlimited" = 1;

  if (target.count === undefined) {
    minSelections = 1;
    maxSelections = 1;
  } else if (target.count === "all") {
    minSelections = 0;
    maxSelections = "unlimited";
  } else if (typeof target.count === "number") {
    minSelections = target.count;
    maxSelections = target.count;
  } else if ("exactly" in target.count) {
    minSelections = target.count.exactly;
    maxSelections = target.count.exactly;
  } else if ("upTo" in target.count) {
    minSelections = 0;
    maxSelections = target.count.upTo;
  } else if ("atLeast" in target.count) {
    minSelections = target.count.atLeast;
    maxSelections = "unlimited";
  } else if ("between" in target.count) {
    minSelections = target.count.between[0];
    maxSelections = target.count.between[1];
  }

  return {
    cardType: target.cardType,
    highlightZones: target.zones || ["play"],
    maxSelections,
    minSelections,
    optional: minSelections === 0,
    ownerFilter: target.owner || "any",
    prompt: `Choose ${description}`,
    selectionType,
  };
}
