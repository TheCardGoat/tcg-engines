import type { FabCondition } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../../rules-view.ts";
import type { MutableObject } from "../mutable.ts";

/**
 * CR 8.3.1 / 8.3.2: a sword has hit this turn when the controller's sword-hit
 * ledger is non-zero. This is deliberately a dedicated typed condition rather
 * than a derived has-status marker or a broad weapon-hit event; the printed
 * clause distinguishes sword attacks from other weapon attacks.
 */
export function evaluateSwordHitThisTurn(
  _condition: FabCondition & { type: "sword-hit-this-turn" },
  context: FabEvalContext,
  _objects: ReadonlyMap<string, MutableObject>,
): boolean {
  return (context.facts?.playerSwordHitsThisTurn?.[context.controllerId] ?? 0) > 0;
}
