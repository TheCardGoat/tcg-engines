import type { FabCondition } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../../rules-view.ts";
import type { MutableObject } from "../mutable.ts";

/**
 * The Quicksilver Dagger gate reads the controller's typed weapon-instance
 * ledger and excludes the ability source itself. It is intentionally a
 * dedicated condition: a generic weapon-hit or derived status cannot express
 * the printed "another weapon gained go again" boundary.
 */
export function evaluateAnotherWeaponGainedGoAgainThisTurn(
  _condition: FabCondition & { type: "another-weapon-gained-go-again-this-turn" },
  context: FabEvalContext,
  _objects: ReadonlyMap<string, MutableObject>,
): boolean {
  const sourceInstanceId = (context.subject ?? context.source)?.instanceId;
  const gainedWeaponInstanceIds =
    context.facts?.playerWeaponInstancesGainedGoAgainThisTurn[context.controllerId] ?? [];
  return gainedWeaponInstanceIds.some((instanceId) => instanceId !== sourceInstanceId);
}
