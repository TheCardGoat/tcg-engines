import type { FabCondition } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../../rules-view.ts";
import type { MutableObject } from "../mutable.ts";
import { compare } from "../compare.ts";
import { assertNever } from "../assert-never.ts";
import { playerIdsForWho } from "../helpers.ts";
import { refKey } from "../helpers.ts";

/**
 * Counts attacks, not physical occupants of the combat-chain zone. Closed
 * links use resolution-time LKI; the active link uses the live evaluated
 * attack so reactions and continuous effects are visible immediately.
 */
export function evaluateCombatChainAttackCount(
  condition: FabCondition & { type: "combat-chain-attack-count" },
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): boolean {
  const combat = context.facts?.combat;
  if (!combat) return compare(0, condition.comparison, context, objects);
  const playerIds = new Set(playerIdsForWho(condition.player, context));
  let count = combat.resolvedAttacks.filter(
    (attack) =>
      playerIds.has(attack.controllerId) &&
      attackPowerMatches(condition.power, attack.power, attack.basePower),
  ).length;

  const active =
    objects.get(refKey(combat.attack)) ??
    [...objects.values()].find(
      (candidate) => candidate.input.ref.instanceId === combat.attack.instanceId,
    );
  if (
    active &&
    playerIds.has(combat.attackingPlayerId) &&
    attackPowerMatches(
      condition.power,
      active.properties.numeric.power ?? 0,
      active.baseNumeric.power ?? 0,
    )
  ) {
    count += 1;
  }

  return compare(count, condition.comparison, context, objects);
}

function attackPowerMatches(
  power: (FabCondition & { type: "combat-chain-attack-count" })["power"],
  current: number,
  base: number,
): boolean {
  switch (power) {
    case "greater-than-base":
      return current > base;
    default:
      return assertNever(power, "combat-chain-attack-count.power");
  }
}
