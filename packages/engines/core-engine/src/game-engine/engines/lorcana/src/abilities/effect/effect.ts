import type {
  AbilityDuration,
  Effect,
} from "~/game-engine/engines/lorcana/src/abilities/ability-types";

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
    type: "modifyStat",
    parameters: { attribute, value },
    duration: duration,
  };
}
