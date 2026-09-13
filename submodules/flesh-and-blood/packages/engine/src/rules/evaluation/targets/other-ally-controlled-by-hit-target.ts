import type { FabEvalContext } from "../../rules-view.ts";
import { arenaObjectZone, refKey, type MutableObject } from "../helpers.ts";

/**
 * Target relation for printed "another ally controlled by the same hero."
 *
 * The triggering hit binds both the hit target's controlling hero and (when
 * the target is an object) its exact ref. The relation therefore works for a
 * hero hit and an Ally hit without guessing an opponent or consulting global
 * turn history, and fails closed outside a hit-trigger context.
 */
export function matchesOtherAllyControlledByHitTarget(
  relation: { readonly kind: "other-ally-controlled-by-hit-target" },
  object: MutableObject,
  context: FabEvalContext,
): boolean {
  void relation;
  const hitTargetController = context.bindings.strings["hit-target-controller"];
  if (!hitTargetController || hitTargetController === context.controllerId) return false;
  if ((object.controllerId ?? object.input.zone.playerId) !== hitTargetController) return false;
  if (!object.properties.subtypes.includes("Ally")) return false;
  if (!arenaObjectZone(object.input.zone.zone)) return false;
  const hitTargetRefs = context.bindings.objects["hit-target"] ?? [];
  return !hitTargetRefs.some((candidate) => refKey(candidate) === refKey(object.input.ref));
}
