import type { PlayerTargetDSL } from "./target-dsl";
import type {
  CardTarget,
  CharacterTarget,
  CharacterTargetEnum,
  ItemTarget,
  ItemTargetEnum,
  LocationTarget,
  LocationTargetEnum,
  PlayerTarget,
} from "../abilities/target-types";
import type { LorcanaCardTarget, LorcanaTargetDSL } from "./lorcana-target-dsl";
import {
  ALL_TARGET_ENUMS,
  CHARACTER_ENUM_EXPANSIONS,
  CHARACTER_TARGET_ENUMS,
  ITEM_ENUM_EXPANSIONS,
  ITEM_TARGET_ENUMS,
  LOCATION_ENUM_EXPANSIONS,
  LOCATION_TARGET_ENUMS,
  PLAYER_TARGET_EXPANSIONS,
} from "./enum-expansions";
import {
  cloneCardTarget,
  isLorcanaPlayerFilterRecord,
  isPlayerTargetRecord,
  isRecord,
  normalizeCardTargetRecord,
} from "./shared";
import type { AbilityDefinition, ActionAbilityDefinition } from "../cards";

function normalizeStringTarget(target: string): LorcanaTargetDSL | undefined {
  const characterTarget = CHARACTER_ENUM_EXPANSIONS[target as CharacterTargetEnum];
  if (characterTarget) {
    return cloneCardTarget(characterTarget);
  }

  const itemTarget = ITEM_ENUM_EXPANSIONS[target as ItemTargetEnum];
  if (itemTarget) {
    return cloneCardTarget(itemTarget);
  }

  const locationTarget = LOCATION_ENUM_EXPANSIONS[target as LocationTargetEnum];
  if (locationTarget) {
    return cloneCardTarget(locationTarget);
  }

  const playerTarget = PLAYER_TARGET_EXPANSIONS[target];
  if (playerTarget) {
    return { ...playerTarget };
  }

  return undefined;
}

export function normalizeLorcanaTarget(
  target: CharacterTarget | ItemTarget | LocationTarget | CardTarget | PlayerTarget | unknown,
): LorcanaTargetDSL | undefined {
  if (!target) {
    return undefined;
  }

  if (typeof target === "string") {
    return normalizeStringTarget(target);
  }

  if (!isRecord(target)) {
    return undefined;
  }

  if (isPlayerTargetRecord(target)) {
    const filters = [
      ...(isLorcanaPlayerFilterRecord(target.filter) ? [target.filter] : []),
      ...(Array.isArray(target.filters) ? target.filters.filter(isLorcanaPlayerFilterRecord) : []),
    ];
    return {
      selector: target.selector as PlayerTargetDSL["selector"],
      count: typeof target.count === "number" ? target.count : undefined,
      filters: filters.length > 0 ? filters : undefined,
    };
  }

  return normalizeCardTargetRecord(target);
}

export function normalizeLorcanaTargetOrThrow(
  target: CharacterTarget | ItemTarget | LocationTarget | CardTarget | PlayerTarget | unknown,
): LorcanaTargetDSL {
  const normalized = normalizeLorcanaTarget(target);
  if (!normalized) {
    throw new Error(`Unsupported Lorcana target descriptor: ${String(target)}`);
  }
  return normalized;
}

export function normalizeLorcanaTargets(
  targets: readonly (
    | CharacterTarget
    | ItemTarget
    | LocationTarget
    | CardTarget
    | PlayerTarget
    | unknown
  )[],
): LorcanaTargetDSL[] {
  return targets
    .map((target) => normalizeLorcanaTarget(target))
    .filter((target): target is LorcanaTargetDSL => Boolean(target));
}

export function isCharacterEnum(target: string): target is CharacterTargetEnum {
  return target in CHARACTER_ENUM_EXPANSIONS;
}

export function isItemEnum(target: string): target is ItemTargetEnum {
  return target in ITEM_ENUM_EXPANSIONS;
}

export function isLocationEnum(target: string): target is LocationTargetEnum {
  return target in LOCATION_ENUM_EXPANSIONS;
}

export function expandCharacterTarget(target: CharacterTarget | unknown): LorcanaCardTarget {
  const normalized = normalizeLorcanaTargetOrThrow(target);
  if ("cardTypes" in normalized || "filter" in normalized || "owner" in normalized) {
    return normalized as LorcanaCardTarget;
  }

  throw new Error(`Character target does not resolve to a card target: ${String(target)}`);
}

export function expandItemTarget(target: ItemTarget | unknown): LorcanaCardTarget {
  return expandCharacterTarget(target);
}

export function expandLocationTarget(target: LocationTarget | unknown): LorcanaCardTarget {
  return expandCharacterTarget(target);
}

export function expandTarget(
  target: CardTarget | CharacterTarget | ItemTarget | LocationTarget,
): LorcanaCardTarget {
  return expandCharacterTarget(target);
}

export function normalizeLorcanaAbilityTargets(ability: AbilityDefinition): AbilityDefinition {
  if (ability.type === "action") {
    const actionAbility = ability as ActionAbilityDefinition;

    // This is not covering effects like sequence, conditional, etc...
    if ("target" in actionAbility.effect && !!actionAbility.effect.target) {
      const target = actionAbility.effect.target;

      if (!target || typeof target !== "string") {
        return actionAbility;
      }

      const normalized = normalizeStringTarget(target);

      if (!normalized) {
        return actionAbility;
      }

      const effectWithTarget = actionAbility.effect as typeof actionAbility.effect & {
        target: LorcanaTargetDSL;
      };

      return {
        ...actionAbility,
        effect: {
          ...effectWithTarget,
          target: normalized,
        } as ActionAbilityDefinition["effect"],
      } as ActionAbilityDefinition;
    }
  }

  return ability;
}

export function normalizeLorcanaAbilitiesTargets(
  abilities: AbilityDefinition[],
): AbilityDefinition[] {
  return abilities.map((ability) => normalizeLorcanaAbilityTargets(ability));
}

export { ALL_TARGET_ENUMS, CHARACTER_TARGET_ENUMS, ITEM_TARGET_ENUMS, LOCATION_TARGET_ENUMS };
