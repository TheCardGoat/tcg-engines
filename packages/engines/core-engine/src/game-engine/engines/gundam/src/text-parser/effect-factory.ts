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
  target: GundamEffectTarget,
  value?: number,
  gained?: boolean,
  duration?: string,
): KeywordEffect {
  return {
    type: "keyword",
    keyword,
    target,
    value,
    gained,
    duration,
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
      if (!target || amount === undefined) {
        throw new Error("Damage effect requires amount and target");
      }
      return createDamageEffect(amount, target, parameters.preventable);
    }

    case "destroy": {
      if (!target) {
        throw new Error("Destroy effect requires target");
      }
      return createDestroyEffect(target, parameters.preventable);
    }

    case "draw": {
      if (amount === undefined) {
        throw new Error("Draw effect requires amount");
      }
      return createDrawEffect(amount, target);
    }

    case "deploy": {
      if (!target) {
        throw new Error("Deploy effect requires target");
      }
      return createDeployEffect(
        target,
        parameters.unitText,
        parameters.zoneText,
        parameters.fromZone,
      );
    }

    case "power": {
      if (!target || amount === undefined) {
        throw new Error("Power effect requires amount and target");
      }
      return createPowerEffect(amount, target, parameters.duration);
    }

    case "cost": {
      if (!target || amount === undefined) {
        throw new Error("Cost effect requires amount and target");
      }
      return createCostEffect(amount, target, parameters.duration);
    }

    case "search": {
      if (!target) {
        throw new Error("Search effect requires target");
      }
      return createSearchEffect(
        target,
        amount as number,
        parameters.searchType,
        parameters.zoneText,
        parameters.searchFilter,
      );
    }

    case "keyword": {
      if (!(target && parameters.keyword)) {
        throw new Error("Keyword effect requires target and keyword");
      }
      return createKeywordEffect(
        parameters.keyword,
        target,
        amount as number,
        parameters.gained,
        parameters.duration,
      );
    }

    default:
      throw new Error(`Unknown effect type: ${type}`);
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
