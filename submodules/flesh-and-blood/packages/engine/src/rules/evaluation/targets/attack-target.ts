import type { FabEvalContext } from "../../rules-view.ts";
import type { MutableObject } from "../mutable.ts";
import { heroObjectsForPlayer, isDefined, refKey } from "../helpers.ts";

export function resolveAttackTarget(
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): readonly MutableObject[] {
  const combat = context.facts?.combat;
  if (combat) {
    if (combat.attackTarget) return [objects.get(refKey(combat.attackTarget))].filter(isDefined);
    return heroObjectsForPlayer(combat.defendingPlayerId, context, objects);
  }
  // Combat has closed — fall back to trigger bindings (e.g. "When this attacks
  // a hero, they discard a card" resolves after combat ends).
  const defendingPlayerId = context.bindings?.strings?.["defending-hero"];
  if (typeof defendingPlayerId === "string") {
    return heroObjectsForPlayer(defendingPlayerId, context, objects);
  }
  return [];
}
