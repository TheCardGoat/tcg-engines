import type {
  AbilityDuration,
  DynamicValue,
  Effect,
} from "~/game-engine/engines/lorcana/src/abilities/ability-types";
import type { AbilityTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/targets";
import type { LorcanaZone } from "~/game-engine/engines/lorcana/src/lorcana-engine-types";

export function getEffect({
  attribute,
  duration,
  value,
}: {
  attribute: "strength";
  value: number;
  duration?: AbilityDuration;
}): Effect {
  return {
    type: "get",
    parameters: { attribute, value },
    duration: duration,
  };
}

export function banishEffect({
  targets,
  thenEffect,
}: {
  targets?: AbilityTarget[];
  thenEffect?: Effect;
} = {}): Effect {
  return {
    type: "banish",
    targets,
    thenEffect,
  };
}

export function drawCardEffect({
  targets,
  amount = 1,
}: {
  targets?: AbilityTarget[];
  amount?: number | DynamicValue;
} = {}): Effect {
  return {
    type: "draw",
    parameters: {
      amount,
    },
    targets,
  };
}

export function gainLoreEffect({
  targets,
  amount = 1,
}: {
  targets?: AbilityTarget[];
  amount?: number | DynamicValue;
} = {}): Effect {
  return {
    type: "gainLore",
    parameters: {
      amount,
    },
    targets,
  };
}

export function returnCardEffect({
  to,
  from,
  targets,
}: {
  to: LorcanaZone;
  from?: LorcanaZone;
  targets?: AbilityTarget[];
}): Effect {
  return {
    type: "moveCard",
    targets,
    parameters: { to, from },
  };
}
