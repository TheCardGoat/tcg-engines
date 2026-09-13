import type { FabCondition } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../../rules-view.ts";
import type { MutableObject } from "../mutable.ts";

type PerformedThisTurnCondition = Extract<FabCondition, { type: "performed-this-turn" }>;

function selectedPlayerIds(
  condition: PerformedThisTurnCondition,
  context: FabEvalContext,
): readonly string[] {
  const playerIds = Object.keys(context.facts?.playerPerformedThisTurn ?? {});
  switch (condition.player) {
    case "controller":
    case "self":
      return [context.controllerId];
    case "opponent":
    case "another-hero":
    case "each-other-hero":
      return playerIds.filter((playerId) => playerId !== context.controllerId);
    case "iteration-subject": {
      const playerId = context.bindings?.strings?.["iteration-subject"];
      return playerId ? [playerId] : [];
    }
    case "any":
    case "each":
      return playerIds;
  }
}

export function evaluatePerformedThisTurn(
  condition: PerformedThisTurnCondition,
  context: FabEvalContext,
  _objects: ReadonlyMap<string, MutableObject>,
): boolean {
  const selected = selectedPlayerIds(condition, context);
  if (selected.length === 0) return false;
  const values = selected.map(
    (playerId) => context.facts?.playerPerformedThisTurn[playerId]?.[condition.event] === true,
  );
  return condition.player === "each" || condition.player === "each-other-hero"
    ? values.every(Boolean)
    : values.some(Boolean);
}
