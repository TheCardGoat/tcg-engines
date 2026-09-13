import type { FabCondition } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../../rules-view.ts";
import { refKey, toCatalogZone, type MutableObject } from "../helpers.ts";

export function evaluateMovedThisTurn(
  condition: FabCondition & { type: "moved-this-turn" },
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): boolean {
  const subjectRef = context.subject ?? context.source;
  const subject = subjectRef ? objects.get(refKey(subjectRef)) : undefined;
  if (!subject) return false;
  const turn = context.facts?.turnNumber;
  const moved = subject.input.history.moves.some((move) => {
    if (turn !== undefined && move.turnNumber !== turn) return false;
    if (
      condition.from &&
      (move.from === null || toCatalogZone(move.from.zone) !== condition.from)
    ) {
      return false;
    }
    if (condition.to && toCatalogZone(move.to.zone) !== condition.to) return false;
    return true;
  });
  if (moved) return true;
  if (condition.to === "combat-chain" && subjectRef) {
    return context.facts?.lastClosedDefendingInstanceIds.includes(subjectRef.instanceId) === true;
  }
  return false;
}
