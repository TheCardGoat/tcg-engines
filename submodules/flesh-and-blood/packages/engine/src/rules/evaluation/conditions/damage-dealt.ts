import type { FabCondition } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../../rules-view.ts";
import type { MutableObject } from "../mutable.ts";
import { compare } from "../compare.ts";
import { playerIdsForFacts } from "../helpers.ts";

export function evaluateDamageHistory(
  condition: Extract<FabCondition, { type: "damage-dealt" | "damage-taken" }>,
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): boolean {
  const facts = context.facts;
  if (!facts) return false;
  const playerIds = playerIdsForFacts(condition.player, context);
  const value = playerIds.reduce((total, playerId) => {
    const scope =
      condition.type === "damage-dealt"
        ? facts.playerDamageDealt[playerId]?.[condition.per === "turn" ? "turn" : "chainLink"]
        : facts.playerDamageTaken[playerId];
    if (!scope) return total;
    return (
      total +
      (condition.damageType
        ? scope[condition.damageType]
        : scope.arcane + scope.physical + scope.generic)
    );
  }, 0);
  return compare(value, condition.comparison, context, objects);
}
