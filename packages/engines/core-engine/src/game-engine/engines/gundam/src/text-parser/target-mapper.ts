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
  if (!text || typeof text !== "string") {
    return null;
  }

  const normalizedText = text.toLowerCase().trim();

  // Check direct pattern matches first
  if (GUNDAM_TARGET_PATTERNS[normalizedText]) {
    return GUNDAM_TARGET_PATTERNS[normalizedText];
  }

  // Self-targeting patterns
  if (
    normalizedText === "this unit" ||
    normalizedText === "itself" ||
    normalizedText === "this card"
  ) {
    return {
      type: "unit",
      value: "self",
      filters: [{ filter: "type", value: "unit" }],
      zone: "battlefield",
    };
  }

  // Parse unit counts + ownership
  const quantityMatch = normalizedText.match(
    /^(up to )?(\d+|a|an|all)\s+(enemy|friendly|your|opponent'?s?)?(.+?)$/i,
  );
  if (quantityMatch) {
    const upTo = !!quantityMatch[1];
    const quantity = quantityMatch[2]?.toLowerCase();
    const ownership = quantityMatch[3]?.toLowerCase();
    const targetType = quantityMatch[4]?.trim();

    // Determine the quantity value
    let value: number | "all";
    if (quantity === "all") {
      value = "all";
    } else if (quantity === "a" || quantity === "an") {
      value = 1;
    } else {
      value = Number.parseInt(quantity, 10) || 1;
    }

    // Determine ownership
    let owner: "self" | "opponent" | undefined;
    if (ownership?.includes("enemy") || ownership?.includes("opponent")) {
      owner = "opponent";
    } else if (ownership?.includes("friendly") || ownership?.includes("your")) {
      owner = "self";
    }

    // Create the target based on type
    if (targetType?.includes("unit")) {
      return createCustomUnitTarget(
        owner,
        undefined,
        undefined,
        undefined,
        undefined,
        value,
      );
    }
    if (targetType?.includes("player")) {
      return createCustomPlayerTarget(owner);
    }
    if (targetType?.includes("card")) {
      return createCustomZoneTarget("hand", owner);
    }
  }

  // Fallback: try to extract target patterns from within the text
  // This handles cases like "During your turn, all your Units" where the target is embedded
  const embeddedTargetPatterns = [
    /\ball\s+(your|friendly)\s+units?\b/i,
    /\ball\s+(enemy|opponent'?s?)\s+units?\b/i,
    /\ball\s+units?\b/i,
    /\btarget\s+(enemy|friendly|your|opponent'?s?)\s+units?\b/i,
    /\btarget\s+units?\b/i,
    /\b(your|friendly)\s+units?\b/i,
    /\b(enemy|opponent'?s?)\s+units?\b/i,
    /\bunits?\b/i,
  ];

  for (const pattern of embeddedTargetPatterns) {
    const match = normalizedText.match(pattern);
    if (match && match[0] !== normalizedText) {
      // Recursively parse the matched target text, but only if it's different from input
      const targetResult = parseTargetFromText(match[0]);
      if (targetResult) {
        return targetResult;
      }
    }
  }

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

  // Handle level-based targeting
  const levelMatch = normalizedText.match(
    /(.+)\s+(?:that is|that are)\s+(?:lv\.?|level)\s*(\d+)\s+or\s+(lower|higher)/i,
  );
  if (levelMatch) {
    const baseTarget = levelMatch[1]?.trim();
    const levelValue = Number.parseInt(levelMatch[2] || "0", 10);
    const comparison = levelMatch[3]?.toLowerCase();

    const operator = comparison === "lower" ? "lte" : "gte";

    // Create a custom filter for level
    const levelFilter: GundamTargetFilter = {
      filter: "level",
      value: levelValue,
      operator,
    };

    const filters: GundamTargetFilter[] = [
      { filter: "type", value: "unit" },
      levelFilter,
    ];

    if (baseTarget?.includes("enemy") || baseTarget?.includes("opponent")) {
      filters.push({ filter: "owner", value: "opponent" });
    } else if (
      baseTarget?.includes("friendly") ||
      baseTarget?.includes("your")
    ) {
      filters.push({ filter: "owner", value: "self" });
    }

    return {
      type: "unit",
      value: 1,
      filters,
      zone: "battlefield",
    };
  }

  // Handle keyword-based targeting
  const keywordMatch = normalizedText.match(
    /(.+)\s+(?:with|that\s+(?:has|have))\s+(?:keyword|ability)\s+([a-zA-Z]+)/i,
  );
  if (keywordMatch) {
    const baseTarget = keywordMatch[1]?.trim();
    const keyword = keywordMatch[2]?.trim();

    const keywords = [keyword];

    if (baseTarget?.includes("enemy") || baseTarget?.includes("opponent")) {
      return createCustomUnitTarget("opponent", undefined, undefined, keywords);
    }
    if (baseTarget?.includes("friendly") || baseTarget?.includes("your")) {
      return createCustomUnitTarget("self", undefined, undefined, keywords);
    }
    return createCustomUnitTarget(undefined, undefined, undefined, keywords);
  }

  // Fallback to a simple unit target
  if (normalizedText.includes("enemy") || normalizedText.includes("opponent")) {
    return createCustomUnitTarget("opponent");
  }
  if (
    normalizedText.includes("friendly") ||
    normalizedText.includes("your") ||
    normalizedText.includes("allied")
  ) {
    return createCustomUnitTarget("self");
  }
  if (normalizedText.includes("unit") || normalizedText.includes("card")) {
    return createCustomUnitTarget();
  }

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
