/**
 * Legacy to New Effect Mapper
 *
 * Provides conversion functions for migrating from legacy effect shapes
 * to the new Effect type structure.
 *
 * FIELD MAPPING:
 * - `type` → `category`
 * - `description` → `text`
 * - `action` → `actions: [action]`
 * - Remove `restrictions`, `costs`, `conditions`
 * - Add `targeting` where applicable
 *
 * TODO: Remove this module once all card definitions are migrated.
 */

import type {
  ActivatedEffect,
  ConstantEffect,
  Effect,
  EffectAction,
  EffectCategory,
  EffectTiming,
  TriggeredEffect,
} from "./effect-definition";
import type {
  BaseEffect,
  LegacyAction,
  LegacyActivatedEffect,
  LegacyConstantEffect,
  LegacyTriggeredEffect,
} from "./legacy-types";
import type { TargetingSpec } from "./targeting";

/**
 * Converts a legacy BaseEffect to the new Effect type.
 *
 * Note: This is a lossy conversion as legacy restrictions, costs, and conditions
 * are not represented in the new Effect type. These will need to be handled
 * differently (e.g., as part of the move validation system).
 */
export function legacyToNewEffect(legacy: BaseEffect): Effect {
  const category = mapTypeToCategory(legacy.type);

  // Convert timing
  const timing = legacy.timing
    ? mapLegacyTiming(legacy.timing, category)
    : getDefaultTiming(category);

  // Convert action to actions array
  const actions = convertActionToEffectAction(legacy.action);

  // Build targeting if applicable
  const targeting = extractTargeting(legacy.action);

  return {
    actions,
    category,
    id: legacy.id,
    targeting,
    text: legacy.description,
    timing,
  };
}

/**
 * Converts multiple legacy effects to new effects
 */
export function legacyToNewEffects(legacy: BaseEffect[]): Effect[] {
  return legacy.map(legacyToNewEffect);
}

/**
 * Maps legacy effect type to new category
 */
function mapTypeToCategory(type: BaseEffect["type"]): EffectCategory {
  switch (type) {
    case "ACTIVATED": {
      return "activated";
    }
    case "TRIGGERED": {
      return "triggered";
    }
    case "CONSTANT": {
      return "constant";
    }
    case "KEYWORD": {
      return "keyword";
    }
    case "COMMAND": {
      return "command";
    }
  }
}

/**
 * Maps legacy timing strings to new EffectTiming types
 *
 * Note: The new EffectTiming uses discriminated unions with a `type` field.
 * Some legacy timings don't have direct 1:1 mappings and need approximation.
 */
function mapLegacyTiming(timing: string, category: EffectCategory): EffectTiming {
  // Triggered timings
  if (category === "triggered") {
    switch (timing) {
      case "DEPLOY": {
        return { type: "DEPLOY" };
      }
      case "ATTACK": {
        return { type: "ATTACK" };
      }
      case "DESTROYED": {
        return { type: "DESTROYED" };
      }
      case "BURST": {
        return { timing: "after", type: "BURST" };
      }
      case "WHEN_PAIRED":
      case "WHEN_LINKED": {
        return { type: "DEPLOY" };
      } // Placeholder: maps to deploy timing
      case "START_OF_TURN": {
        return { type: "START_OF_TURN" };
      }
      case "END_OF_TURN": {
        return { type: "END_OF_TURN" };
      }
      default: {
        return { type: "DEPLOY" };
      } // Default for triggered effects
    }
  }

  // Activated timings
  if (category === "activated") {
    switch (timing) {
      case "MAIN": {
        return { type: "ACTIVATE_MAIN" };
      }
      case "ACTION": {
        return { type: "ACTIVATE_ACTION" };
      }
      default: {
        return { type: "ACTIVATE_MAIN" };
      }
    }
  }

  // Command timings
  if (category === "command") {
    switch (timing) {
      case "MAIN": {
        return { type: "MAIN" };
      }
      case "ACTION": {
        return { type: "ACTION" };
      }
      case "BURST": {
        return { timing: "after", type: "BURST" };
      }
      default: {
        return { type: "MAIN" };
      }
    }
  }

  // Default for constant and keyword
  return { type: "MAIN" };
}

/**
 * Gets default timing for a category if not specified
 *
 * Note: Constant and keyword effects use MAIN timing with the effect
 * being continuous rather than event-based.
 */
function getDefaultTiming(category: EffectCategory): EffectTiming {
  switch (category) {
    case "triggered": {
      return { type: "DEPLOY" };
    }
    case "activated": {
      return { type: "ACTIVATE_MAIN" };
    }
    case "constant": {
      return { type: "MAIN" };
    } // Continuous effects attached to main phase
    case "keyword": {
      return { type: "MAIN" };
    } // Keyword effects attached to main phase
    case "command": {
      return { type: "MAIN" };
    }
  }
}

/**
 * Converts legacy Action to EffectAction
 *
 * Note: This is a partial implementation. Many legacy actions need
 * proper conversion logic.
 */
function convertActionToEffectAction(action: LegacyAction): EffectAction[] {
  // Handle sequence actions
  if (action.type === "SEQUENCE") {
    return action.actions.flatMap(convertActionToEffectAction);
  }

  // Handle conditional actions - for now just return the true action
  if (action.type === "CONDITIONAL") {
    return convertActionToEffectAction(action.trueAction);
  }

  // Map individual action types
  switch (action.type) {
    case "DRAW": {
      return [
        {
          count: action.value,
          player: "self",
          type: "DRAW",
        },
      ];
    }

    case "REST": {
      const targeting = action.target ? convertTargetQueryToTargeting(action.target) : undefined;
      // REST action requires a target, provide default if none specified
      const finalTargeting = targeting ?? {
        chooser: "controller",
        count: 1,
        timing: "on_resolution",
        validTargets: [],
      };
      return [
        {
          target: finalTargeting,
          type: "REST",
        },
      ];
    }

    case "STAND": {
      const targeting = action.target ? convertTargetQueryToTargeting(action.target) : undefined;
      // ACTIVATE action requires a target, provide default if none specified
      const finalTargeting = targeting ?? {
        chooser: "controller",
        count: 1,
        timing: "on_resolution",
        validTargets: [],
      };
      return [
        {
          target: finalTargeting,
          type: "ACTIVATE",
        },
      ];
    }

    case "DEPLOY": {
      // Deploy becomes a MOVE_CARD action
      return [
        {
          from: "hand",
          target: {
            count: 1,
            validTargets: [],
            chooser: "controller",
            timing: "on_resolution",
          },
          to: "battleArea",
          type: "MOVE_CARD",
        },
      ];
    }

    case "ADD_TO_HAND": {
      return [
        {
          from: "battleArea",
          target: {
            count: 1,
            validTargets: [],
            chooser: "controller",
            timing: "on_resolution",
          },
          to: "hand",
          type: "MOVE_CARD",
        },
      ];
    }

    case "DISCARD": {
      return [
        {
          count: action.value,
          player: "opponent",
          type: "DISCARD",
        },
      ];
    }

    case "SEARCH": {
      return [
        {
          count: action.count,
          destination: action.destination as any,
          filter: {},
          reveal: true,
          shuffleAfter: true,
          type: "SEARCH",
        },
      ];
    }

    case "HEAL": {
      // Heal is not directly in EffectAction - would be handled as DAMAGE with negative amount
      return [];
    }

    case "DAMAGE": {
      return [
        {
          amount: action.value,
          damageType: "effect",
          target: "unit",
          type: "DAMAGE",
        },
      ];
    }

    case "MODIFY_STATS": {
      return [
        {
          apModifier: action.attribute === "AP" ? action.value : undefined,
          duration:
            action.duration === "PERMANENT"
              ? "permanent"
              : action.duration === "END_OF_COMBAT"
                ? "end_of_combat"
                : "this_turn",
          hpModifier: action.attribute === "HP" ? action.value : undefined,
          target: {
            count: 1,
            validTargets: [],
            chooser: "controller",
            timing: "on_resolution",
          },
          type: "MODIFY_STATS",
        },
      ];
    }

    case "GAIN_KEYWORDS": {
      // Keywords would need to be mapped to KeywordEffect type
      return [];
    }

    case "CUSTOM": {
      // Custom actions cannot be converted
      return [];
    }

    default: {
      return [];
    }
  }
}

/**
 * Extracts targeting from a legacy action
 */
function extractTargeting(action: LegacyAction): TargetingSpec | undefined {
  // Sequence actions need to handle each sub-action
  if (action.type === "SEQUENCE") {
    const targets = action.actions.map(extractTargeting).filter(Boolean);
    return targets[0] as TargetingSpec | undefined;
  }

  // Conditional actions use the true action's targeting
  if (action.type === "CONDITIONAL") {
    return extractTargeting(action.trueAction);
  }

  // Actions with explicit target
  if ("target" in action && action.target) {
    return convertTargetQueryToTargeting(action.target);
  }

  return undefined;
}

/**
 * Converts TargetQuery to TargetingSpec
 *
 * Note: This is a simplified conversion. Full implementation would need
 * to properly map all TargetQuery shapes to TargetingSpec.
 */
function convertTargetQueryToTargeting(target: any): TargetingSpec | undefined {
  // TargetQuery is from gundam-target-dsl and has a different structure
  // This is a placeholder for proper conversion
  if (typeof target === "object" && target !== null) {
    return {
      chooser: "controller",
      count: 1,
      timing: "on_resolution",
      validTargets: [],
    };
  }

  // Array of targets
  if (Array.isArray(target)) {
    return {
      chooser: "controller",
      count: target.length,
      timing: "on_resolution",
      validTargets: [],
    };
  }

  return undefined;
}

/**
 * Narrows new Effect type based on category
 */
export function asActivatedEffect(effect: Effect): ActivatedEffect | null {
  return effect.category === "activated" ? (effect as ActivatedEffect) : null;
}

export function asTriggeredEffect(effect: Effect): TriggeredEffect | null {
  return effect.category === "triggered" ? (effect as TriggeredEffect) : null;
}

export function asConstantEffect(effect: Effect): ConstantEffect | null {
  return effect.category === "constant" ? (effect as ConstantEffect) : null;
}
