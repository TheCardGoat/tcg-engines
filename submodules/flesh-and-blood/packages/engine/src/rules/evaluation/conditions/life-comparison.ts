import type { FabCondition } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../../rules-view.ts";
import type { MutableObject } from "../mutable.ts";
import { comparePrimitive } from "../helpers.ts";
import { isDefined } from "../helpers.ts";

export function evaluateLifeComparison(
  condition: FabCondition & { type: "life-comparison" },
  context: FabEvalContext,
  _objects: ReadonlyMap<string, MutableObject>,
): boolean {
  const facts = context.facts;
  if (!facts) return false;
  const comparedPlayerId =
    condition.player === "iteration-subject"
      ? context.bindings?.strings?.["iteration-subject"]
      : context.controllerId;
  if (!comparedPlayerId) return false;
  const ownLife = facts.playerLife[comparedPlayerId];
  if (ownLife === undefined) return false;
  if (condition.vs === "fixed") {
    return comparePrimitive(ownLife, condition.op, condition.value ?? 0);
  }
  const playerIds =
    condition.vs === "controller"
      ? [context.controllerId]
      : condition.vs === "attacking-hero"
        ? [facts.combat?.attackingPlayerId].filter(isDefined)
        : Object.keys(facts.playerLife).filter((playerId) => playerId !== comparedPlayerId);
  const equalityCountsAsStrict =
    (condition.op === "lt" || condition.op === "gt") &&
    context.rules?.some((rule) => rule.action === "life-comparison" && rule.mode === "require");
  return (
    playerIds.length > 0 &&
    playerIds.every((playerId) => {
      const otherLife = facts.playerLife[playerId]!;
      return (
        comparePrimitive(ownLife, condition.op, otherLife) ||
        (equalityCountsAsStrict === true && ownLife === otherLife)
      );
    })
  );
}
