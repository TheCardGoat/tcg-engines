import type { FabCondition } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../../rules-view.ts";
import type { MutableObject } from "../mutable.ts";

export function evaluateTurnPlayer(
  condition: FabCondition & { type: "turn-player" },
  context: FabEvalContext,
  _objects: ReadonlyMap<string, MutableObject>,
): boolean {
  return condition.who === "self"
    ? context.facts?.activePlayerId === context.controllerId
    : context.facts?.activePlayerId !== context.controllerId;
}
