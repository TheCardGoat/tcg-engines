// Target Mapping System for Gundam Text Parser
// Maps text patterns to Gundam target definitions

import type { GundamEffectTarget, GundamTargetFilter } from "./types";

/**
 * Common Gundam target patterns mapped to target objects
 */
export const GUNDAM_TARGET_PATTERNS: Record<string, GundamEffectTarget> = {
  // Unit targets
  "target unit": {
    type: "unit",
    value: 1,
    filters: [{ filter: "type", value: "unit" }],
    zone: "battlefield",
  },
  "target enemy unit": {
    type: "unit",
    value: 1,
    filters: [
      { filter: "type", value: "unit" },
      { filter: "owner", value: "opponent" },
    ],
    zone: "battlefield",
  },
  "target friendly unit": {
    type: "unit",
    value: 1,
    filters: [
      { filter: "type", value: "unit" },
      { filter: "owner", value: "self" },
    ],
    zone: "battlefield",
  },
  "all enemy units": {
    type: "unit",
    value: "all",
    filters: [
      { filter: "type", value: "unit" },
      { filter: "owner", value: "opponent" },
    ],
    zone: "battlefield",
    isMultiple: true,
  },
  "all friendly units": {
    type: "unit",
    value: "all",
    filters: [
      { filter: "type", value: "unit" },
      { filter: "owner", value: "self" },
    ],
    zone: "battlefield",
    isMultiple: true,
  },
  "all units": {
    type: "unit",
    value: "all",
    filters: [{ filter: "type", value: "unit" }],
    zone: "battlefield",
    isMultiple: true,
  },

  // Player targets
  "target player": {
    type: "player",
    value: 1,
    filters: [],
  },
  "target opponent": {
    type: "player",
    value: "opponent",
    filters: [{ filter: "owner", value: "opponent" }],
  },
  you: {
    type: "player",
    value: "self",
    filters: [{ filter: "owner", value: "self" }],
  },
  "each player": {
    type: "player",
    value: "all",
    filters: [],
    isMultiple: true,
  },

  // Zone targets
  "your hand": {
    type: "zone",
    value: "hand",
    filters: [{ filter: "owner", value: "self" }],
    zone: "hand",
  },
  "your deck": {
    type: "zone",
    value: "deck",
    filters: [{ filter: "owner", value: "self" }],
    zone: "deck",
  },
  "your discard pile": {
    type: "zone",
    value: "discard",
    filters: [{ filter: "owner", value: "self" }],
    zone: "discard",
  },
  "your g zone": {
    type: "zone",
    value: "g_zone",
    filters: [{ filter: "owner", value: "self" }],
    zone: "g_zone",
  },
};

/**
 * Creates a custom unit target based on parsed components
 */
export function createCustomUnitTarget(
  owner?: "self" | "opponent",
  cost?: { value: number; operator: "eq" | "gt" | "gte" | "lt" | "lte" },
  power?: { value: number; operator: "eq" | "gt" | "gte" | "lt" | "lte" },
  keywords?: string[],
  color?: string,
  value: number | "all" = 1,
): GundamEffectTarget {
  const filters: GundamTargetFilter[] = [{ filter: "type", value: "unit" }];

  if (owner) {
    filters.push({ filter: "owner", value: owner });
  }

  if (cost) {
    filters.push({
      filter: "cost",
      value: cost.value,
      operator: cost.operator,
    });
  }

  if (power) {
    filters.push({
      filter: "power",
      value: power.value,
      operator: power.operator,
    });
  }

  if (keywords && keywords.length > 0) {
    filters.push({ filter: "keyword", value: keywords });
  }

  if (color) {
    filters.push({ filter: "color", value: color });
  }

  return {
    type: "unit",
    value,
    filters,
    zone: "battlefield",
    isMultiple: value === "all",
  };
}

/**
 * Creates a custom player target
 */
export function createCustomPlayerTarget(
  value: "self" | "opponent" | "all" = "self",
): GundamEffectTarget {
  return {
    type: "player",
    value,
    filters: value !== "all" ? [{ filter: "owner", value }] : [],
    isMultiple: value === "all",
  };
}

/**
 * Creates a custom zone target
 */
export function createCustomZoneTarget(
  zone: "battlefield" | "hand" | "deck" | "discard" | "g_zone",
  owner?: "self" | "opponent",
): GundamEffectTarget {
  const filters: GundamTargetFilter[] = [];

  if (owner) {
    filters.push({ filter: "owner", value: owner });
  }

  return {
    type: "zone",
    value: zone,
    filters,
    zone,
  };
}

/**
 * Parses target text and returns the appropriate target
 */
export function parseTargetFromText(text: string): GundamEffectTarget | null {
  const normalizedText = text.toLowerCase().trim();

  // Check direct pattern matches first
  if (GUNDAM_TARGET_PATTERNS[normalizedText]) {
    return GUNDAM_TARGET_PATTERNS[normalizedText];
  }

  // Parse complex patterns

  // Handle cost-based targeting
  const costMatch = normalizedText.match(
    /(.+)\s+(?:with|that\s+(?:has|have))\s+(?:cost|energy cost)\s+(\d+)\s+or\s+(less|more|higher)/i,
  );
  if (costMatch) {
    const baseTarget = costMatch[1]?.trim();
    const costValue = Number.parseInt(costMatch[2] || "0", 10);
    const comparison = costMatch[3]?.toLowerCase();

    const operator =
      comparison === "less"
        ? "lte"
        : comparison === "more" || comparison === "higher"
          ? "gte"
          : "eq";

    if (baseTarget?.includes("enemy") || baseTarget?.includes("opponent")) {
      return createCustomUnitTarget("opponent", { value: costValue, operator });
    }
    if (baseTarget?.includes("friendly") || baseTarget?.includes("your")) {
      return createCustomUnitTarget("self", { value: costValue, operator });
    }
    return createCustomUnitTarget(undefined, { value: costValue, operator });
  }

  // Handle power-based targeting
  const powerMatch = normalizedText.match(
    /(.+)\s+(?:with|that\s+(?:has|have))\s+(?:power|attack)\s+(\d+)\s+or\s+(less|more|higher)/i,
  );
  if (powerMatch) {
    const baseTarget = powerMatch[1]?.trim();
    const powerValue = Number.parseInt(powerMatch[2] || "0", 10);
    const comparison = powerMatch[3]?.toLowerCase();

    const operator =
      comparison === "less"
        ? "lte"
        : comparison === "more" || comparison === "higher"
          ? "gte"
          : "eq";

    if (baseTarget?.includes("enemy") || baseTarget?.includes("opponent")) {
      return createCustomUnitTarget("opponent", undefined, {
        value: powerValue,
        operator,
      });
    }
    if (baseTarget?.includes("friendly") || baseTarget?.includes("your")) {
      return createCustomUnitTarget("self", undefined, {
        value: powerValue,
        operator,
      });
    }
    return createCustomUnitTarget(undefined, undefined, {
      value: powerValue,
      operator,
    });
  }

  // Handle keyword-based targeting
  const keywordMatch = normalizedText.match(
    /(.+)\s+(?:with|that\s+(?:has|have))\s+<([^>]+)>/i,
  );
  if (keywordMatch) {
    const baseTarget = keywordMatch[1]?.trim();
    const keyword = keywordMatch[2]?.trim();

    if (baseTarget?.includes("enemy") || baseTarget?.includes("opponent")) {
      return createCustomUnitTarget("opponent", undefined, undefined, [
        keyword,
      ]);
    }
    if (baseTarget?.includes("friendly") || baseTarget?.includes("your")) {
      return createCustomUnitTarget("self", undefined, undefined, [keyword]);
    }
    return createCustomUnitTarget(undefined, undefined, undefined, [keyword]);
  }

  // Handle color-based targeting
  const colorMatch = normalizedText.match(
    /(.+)\s+(red|blue|green|yellow|white|black)\s+unit/i,
  );
  if (colorMatch) {
    const baseTarget = colorMatch[1]?.trim();
    const color = colorMatch[2]?.toLowerCase();

    if (baseTarget?.includes("enemy") || baseTarget?.includes("opponent")) {
      return createCustomUnitTarget(
        "opponent",
        undefined,
        undefined,
        undefined,
        color,
      );
    }
    if (baseTarget?.includes("friendly") || baseTarget?.includes("your")) {
      return createCustomUnitTarget(
        "self",
        undefined,
        undefined,
        undefined,
        color,
      );
    }
    return createCustomUnitTarget(
      undefined,
      undefined,
      undefined,
      undefined,
      color,
    );
  }

  // Handle quantity-based targeting
  if (normalizedText.includes("all")) {
    if (
      normalizedText.includes("enemy") ||
      normalizedText.includes("opponent")
    ) {
      return createCustomUnitTarget(
        "opponent",
        undefined,
        undefined,
        undefined,
        undefined,
        "all",
      );
    }
    if (
      normalizedText.includes("friendly") ||
      normalizedText.includes("your")
    ) {
      return createCustomUnitTarget(
        "self",
        undefined,
        undefined,
        undefined,
        undefined,
        "all",
      );
    }
    if (normalizedText.includes("unit")) {
      return createCustomUnitTarget(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        "all",
      );
    }
  }

  // Handle basic unit targeting
  if (normalizedText.includes("unit")) {
    if (
      normalizedText.includes("enemy") ||
      normalizedText.includes("opponent")
    ) {
      return createCustomUnitTarget("opponent");
    }
    if (
      normalizedText.includes("friendly") ||
      normalizedText.includes("your")
    ) {
      return createCustomUnitTarget("self");
    }
    return createCustomUnitTarget();
  }

  // Handle player targeting
  if (normalizedText.includes("player")) {
    if (
      normalizedText.includes("opponent") ||
      normalizedText.includes("enemy")
    ) {
      return createCustomPlayerTarget("opponent");
    }
    if (normalizedText.includes("each") || normalizedText.includes("all")) {
      return createCustomPlayerTarget("all");
    }
    return createCustomPlayerTarget("self");
  }

  // Handle zone targeting
  if (normalizedText.includes("hand")) {
    const owner = normalizedText.includes("your")
      ? "self"
      : normalizedText.includes("opponent")
        ? "opponent"
        : undefined;
    return createCustomZoneTarget("hand", owner);
  }

  if (normalizedText.includes("deck")) {
    const owner = normalizedText.includes("your")
      ? "self"
      : normalizedText.includes("opponent")
        ? "opponent"
        : undefined;
    return createCustomZoneTarget("deck", owner);
  }

  if (normalizedText.includes("discard")) {
    const owner = normalizedText.includes("your")
      ? "self"
      : normalizedText.includes("opponent")
        ? "opponent"
        : undefined;
    return createCustomZoneTarget("discard", owner);
  }

  if (normalizedText.includes("g zone") || normalizedText.includes("g-zone")) {
    const owner = normalizedText.includes("your")
      ? "self"
      : normalizedText.includes("opponent")
        ? "opponent"
        : undefined;
    return createCustomZoneTarget("g_zone", owner);
  }

  // Return null if no pattern matches
  return null;
}

/**
 * Validates that a target is properly formed
 */
export function validateTarget(target: GundamEffectTarget): boolean {
  if (!(target && target.type)) {
    return false;
  }

  // Validate based on target type
  switch (target.type) {
    case "unit":
      return !!(target.value && target.filters && target.filters.length > 0);
    case "player":
      return !!target.value;
    case "zone":
      return !!(target.value && target.zone);
    case "pile":
      return !!(target.value && target.zone);
    default:
      return false;
  }
}

/**
 * Combines multiple targets (for complex targeting scenarios)
 */
export function combineTargets(
  targets: GundamEffectTarget[],
  operator: "and" | "or" = "and",
): GundamEffectTarget | null {
  if (targets.length === 0) return null;
  if (targets.length === 1) {
    const target = targets[0];
    return target || null;
  }

  // For complex combination logic, return the first valid target for now
  // This can be expanded based on specific requirements
  for (const target of targets) {
    if (target && validateTarget(target)) {
      return target;
    }
  }

  return null;
}

/**
 * Checks if a target affects multiple objects
 */
export function isMultiTarget(target: GundamEffectTarget): boolean {
  return (
    target.isMultiple === true ||
    target.value === "all" ||
    (typeof target.value === "string" && target.value.includes("all"))
  );
}

/**
 * Gets the zone associated with a target
 */
export function getTargetZone(target: GundamEffectTarget): string | null {
  return target.zone || null;
}

/**
 * Checks if a target has specific filters
 */
export function hasFilter(
  target: GundamEffectTarget,
  filterType: string,
): boolean {
  return target.filters.some((filter) => filter.filter === filterType);
}

/**
 * Gets filter value for a specific filter type
 */
export function getFilterValue(
  target: GundamEffectTarget,
  filterType: string,
): any {
  const filter = target.filters.find((f) => f.filter === filterType);
  return filter?.value;
}
