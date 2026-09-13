import type { FabEvalContext } from "../../rules-view.ts";
import type { MutableObject } from "../mutable.ts";
import { isDefined, refKey } from "../helpers.ts";

/**
 * Resolve the active attack only when it is represented by this effect's
 * source. The rules view projects an attack-proxy through its attack-source
 * properties (CR 1.4.3a, 1.4.3d), so `facts.combat.attack` is the source ref
 * while the persisted proxy keeps a separate identity. Effects that apply to
 * "the attack" must still land on that current attack (Errata #9 / CR 8.3.5b),
 * not a later proxy of the same source.
 */
export function resolveAttackFromSource(
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): readonly MutableObject[] {
  const source = context.source;
  const attack = context.facts?.combat?.attack;
  if (!source || !attack || refKey(source) !== refKey(attack)) return [];
  return [objects.get(refKey(attack))].filter(isDefined);
}
