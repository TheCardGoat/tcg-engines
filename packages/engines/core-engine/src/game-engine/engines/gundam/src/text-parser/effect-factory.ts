// Effect Factory for Gundam Text Parser
// Converts parsed effects into concrete effect objects

import type {
  DynamicAmount,
  GundamEffectTarget,
  GundamKeyword,
  ParsedEffect,
} from "./types";

// Define base effect types to match what the engine would use
// These will need to be replaced with actual engine types when they're available

/**
 * Base effect interface
 */
interface GundamEffect {
  type: string;
  target?: GundamEffectTarget;
  amount?: number | DynamicAmount;
  attribute?: string;
  restriction?: string;
  duration?: string;
  preventable?: boolean;
  unit?: string;
  zone?: string;
  fromZone?: string;
  gained?: boolean;
  keyword?: string;
  value?: number;
  searchType?: string;
  zoneToSearch?: string;
  searchFilter?: Record<string, any>;
  [key: string]: any; // For additional parameters
}

/**
 * Damage effect
 */
interface DamageEffect extends GundamEffect {
  type: "damage";
  amount: number | DynamicAmount;
  preventable?: boolean;
}

/**
 * Destroy effect
 */
interface DestroyEffect extends GundamEffect {
  type: "destroy";
  preventable?: boolean;
}

/**
 * Draw effect
 */
interface DrawEffect extends GundamEffect {
  type: "draw";
  amount: number | DynamicAmount;
}

/**
 * Deploy effect
 */
interface DeployEffect extends GundamEffect {
  type: "deploy";
  unit?: string;
  zone?: string;
  fromZone?: string;
}

/**
 * Power effect
 */
interface PowerEffect extends GundamEffect {
  type: "power";
  amount: number | DynamicAmount;
  duration?: string;
}

/**
 * Cost effect
 */
interface CostEffect extends GundamEffect {
  type: "cost";
  amount: number | DynamicAmount;
  duration?: string;
}

/**
 * Search effect
 */
interface SearchEffect extends GundamEffect {
  type: "search";
  amount?: number;
  searchType?: string;
  zoneToSearch?: string;
  searchFilter?: Record<string, any>;
}

/**
 * Keyword effect
 */
interface KeywordEffect extends GundamEffect {
  type: "keyword";
  keyword: GundamKeyword;
  value?: number;
  gained?: boolean;
  duration?: string;
}

/**
 * Creates a damage effect
 */
export function createDamageEffect(
  amount: number | DynamicAmount,
  target: GundamEffectTarget,
  preventable = true,
): DamageEffect {
  return {
    type: "damage",
    amount,
    target,
    preventable,
  };
}

/**
 * Creates a destroy effect
 */
export function createDestroyEffect(
  target: GundamEffectTarget,
  preventable = true,
): DestroyEffect {
  return {
    type: "destroy",
    target,
    preventable,
  };
}

/**
 * Creates a draw effect
 */
export function createDrawEffect(
  amount: number | DynamicAmount,
  target?: GundamEffectTarget,
): DrawEffect {
  return {
    type: "draw",
    amount,
    target,
  };
}

/**
 * Creates a deploy effect
 */
export function createDeployEffect(
  target: GundamEffectTarget,
  unit?: string,
  zone?: string,
  fromZone?: string,
): DeployEffect {
  return {
    type: "deploy",
    target,
    unit,
    zone,
    fromZone,
  };
}

/**
 * Creates a power effect
 */
export function createPowerEffect(
  amount: number | DynamicAmount,
  target: GundamEffectTarget,
  duration?: string,
): PowerEffect {
  return {
    type: "power",
    amount,
    target,
    duration,
  };
}

/**
 * Creates a cost effect
 */
export function createCostEffect(
  amount: number | DynamicAmount,
  target: GundamEffectTarget,
  duration?: string,
): CostEffect {
  return {
    type: "cost",
    amount,
    target,
    duration,
  };
}

/**
 * Creates a search effect
 */
export function createSearchEffect(
  target: GundamEffectTarget,
  amount?: number,
  searchType?: string,
  zoneToSearch?: string,
  searchFilter?: Record<string, any>,
): SearchEffect {
  return {
    type: "search",
    target,
    amount,
    searchType,
    zoneToSearch,
    searchFilter,
  };
}

/**
 * Creates a keyword effect
 */
export function createKeywordEffect(
  keyword: GundamKeyword,
  value?: number,
  target?: GundamEffectTarget,
  gained?: boolean,
  duration?: string,
): KeywordEffect {
  return {
    type: "keyword",
    keyword,
    ...(target ? { target } : {}),
    ...(value !== undefined ? { value } : {}),
    ...(gained !== undefined ? { gained } : {}),
    ...(duration ? { duration } : {}),
  };
}

/**
 * Factory function to create the appropriate effect from a parsed effect
 */
export function createEffectFromParsed(
  parsedEffect: ParsedEffect,
): GundamEffect {
  const { type, target, amount, parameters } = parsedEffect;

  switch (type) {
    case "damage": {
      // Provide default values instead of throwing an error
      return {
        type: "damage",
        target: target || { type: "unit", value: "opponent", filters: [] },
        amount: amount !== undefined ? amount : 1,
        preventable:
          parameters.preventable !== undefined ? parameters.preventable : true,
      };
    }

    case "destroy": {
      // Provide default value for target if missing
      return {
        type: "destroy",
        target: target || { type: "unit", value: "opponent", filters: [] },
        preventable:
          parameters.preventable !== undefined ? parameters.preventable : true,
      };
    }

    case "draw": {
      // Provide default value for amount if missing
      return {
        type: "draw",
        amount: amount !== undefined ? amount : 1,
        target: target,
      };
    }

    case "deploy": {
      // Provide default value for target if missing
      return {
        type: "deploy",
        target: target || { type: "unit", value: "self", filters: [] },
        unit: parameters.unit,
        zone: parameters.zone,
        fromZone: parameters.fromZone,
      };
    }

    case "power": {
      // Provide default values if missing
      return {
        type: "power",
        target: target || { type: "unit", value: "self", filters: [] },
        amount: amount !== undefined ? amount : 1,
        duration: parameters.duration,
      };
    }

    case "cost": {
      // Provide default values if missing
      return {
        type: "cost",
        target: target || { type: "unit", value: "self", filters: [] },
        amount: amount !== undefined ? amount : 1,
        duration: parameters.duration,
      };
    }

    case "search": {
      // Provide default value for target if missing
      return {
        type: "search",
        target: target || { type: "zone", value: "deck", filters: [] },
        amount: parameters.amount || 1,
        searchType: parameters.searchType,
        zoneToSearch: parameters.zoneToSearch,
        searchFilter: parameters.searchFilter,
      };
    }

    case "keyword": {
      if (!parameters.keyword) {
        // Use a default keyword if none specified
        parameters.keyword = "Repair";
      }

      return {
        type: "keyword",
        keyword: parameters.keyword,
        value: parameters.value,
        target: target,
        gained: parameters.gained,
        duration: parameters.duration,
      };
    }

    case "move-to-hand": {
      return {
        type: "move-to-hand",
        target: target || { type: "unit", value: "self", filters: [] },
        ...parameters,
      };
    }

    case "rest": {
      return {
        type: "rest",
        target: target || { type: "unit", value: "opponent", filters: [] },
        ...parameters,
      };
    }

    case "set-active": {
      return {
        type: "set-active",
        target: target || { type: "unit", value: "self", filters: [] },
        ...parameters,
      };
    }

    case "heal": {
      return {
        type: "heal",
        amount: amount || 1,
        target: target || { type: "unit", value: "self", filters: [] },
        ...parameters,
      };
    }

    case "attribute-boost":
    case "attribute-modification": {
      return {
        type: type,
        target: target || { type: "unit", value: "self", filters: [] },
        attribute: parameters.attribute || "AP",
        amount: amount || 1,
        duration: parameters.duration || "turn",
        ...parameters,
      };
    }

    case "targeting": {
      return {
        type: "targeting",
        amount: parameters.amount || "1",
        target: target,
        condition: parameters.condition,
        ...parameters,
      };
    }

    case "restriction": {
      return {
        type: "restriction",
        restriction: parameters.restriction || "cannot-attack",
        target: target || { type: "unit", value: "self", filters: [] },
        ...parameters,
      };
    }

    case "placeholder": {
      // This is a special case for effects that should be replaced later
      return {
        type: "placeholder",
        ...parameters,
      };
    }

    default: {
      // Generic fallback
      return {
        type,
        ...(target ? { target } : {}),
        ...(amount !== undefined ? { amount } : {}),
        ...parameters,
      };
    }
  }
}

/**
 * Batch creates multiple effects from ParsedEffect objects
 */
export function createEffectsFromParsed(
  parsedEffects: ParsedEffect[],
): GundamEffect[] {
  return parsedEffects.map(createEffectFromParsed);
}

/**
 * Creates a compound effect that combines multiple effects
 */
export function createCompoundEffect(
  effects: GundamEffect[],
  target?: GundamEffectTarget,
): GundamEffect {
  return {
    type: "compound",
    effects,
    target,
  } as GundamEffect;
}

/**
 * Creates a conditional effect
 */
export function createConditionalEffect(
  condition: Record<string, any>,
  trueEffect: GundamEffect,
  falseEffect?: GundamEffect,
): GundamEffect {
  return {
    type: "conditional",
    condition,
    trueEffect,
    falseEffect,
  } as GundamEffect;
}

/**
 * Creates a timing-based effect (e.g., "at end of turn")
 */
export function createTimingEffect(
  timing: string,
  effect: GundamEffect,
  target?: GundamEffectTarget,
): GundamEffect {
  return {
    type: "timing",
    timing,
    effect,
    target,
  } as GundamEffect;
}

/**
 * Creates a modal effect (e.g., "Choose one:")
 */
export function createModalEffect(
  options: GundamEffect[],
  target?: GundamEffectTarget,
): GundamEffect {
  return {
    type: "modal",
    options,
    target,
  } as GundamEffect;
}
