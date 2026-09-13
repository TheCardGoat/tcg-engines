import type { FabCondition } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../../rules-view.ts";
import type { MutableObject } from "../mutable.ts";
import { resolveTarget } from "../resolve-target.ts";

export function evaluateIsMarked(
  condition: FabCondition & { type: "is-marked" },
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): boolean {
  if (condition.target.selector === "controller") {
    return context.facts?.playerMarked[context.controllerId] === true;
  }
  if (condition.target.selector === "opponent") {
    const opponentId = Object.keys(context.facts?.heroRefs ?? {}).find(
      (playerId) => playerId !== context.controllerId,
    );
    return opponentId !== undefined && context.facts?.playerMarked[opponentId] === true;
  }
  if (condition.target.selector === "defending-hero") {
    const defendingPlayerId = context.facts?.combat?.defendingPlayerId;
    return (
      defendingPlayerId !== undefined && context.facts?.playerMarked[defendingPlayerId] === true
    );
  }
  return resolveTarget(condition.target, context, objects).some((object) => {
    if (object.controllerId !== null && context.facts?.playerMarked[object.controllerId] === true) {
      return true;
    }
    for (const [playerId, ref] of Object.entries(context.facts?.heroRefs ?? {})) {
      if (ref.instanceId === object.input.ref.instanceId) {
        return context.facts?.playerMarked[playerId] === true;
      }
    }
    return false;
  });
}
