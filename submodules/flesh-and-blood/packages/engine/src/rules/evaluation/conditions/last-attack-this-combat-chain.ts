import type { FabCondition } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../../rules-view.ts";
import type { MutableObject } from "../mutable.ts";
import { refKey } from "../helpers.ts";
import { matchesFilter } from "../matches-filter.ts";

export function evaluateLastAttackThisCombatChain(
  condition: FabCondition & { type: "last-attack-this-combat-chain" },
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): boolean {
  const combat = context.facts?.combat;
  const source = context.source ? objects.get(refKey(context.source)) : undefined;
  const sourceIsCurrentAttack = Boolean(
    combat && source && refKey(source.input.ref) === refKey(combat.attack),
  );
  const previousRef = sourceIsCurrentAttack ? combat?.previousAttack : combat?.attack;
  const previous = previousRef ? objects.get(refKey(previousRef)) : undefined;
  if (!previous) return false;
  // Printed combo names ("Hundred Winds") must use the same derived identity as
  // matches-filter; catalog `base.names` is often a hyphen slug.
  if (
    condition.names?.length &&
    !condition.names.some((candidate) =>
      matchesFilter(previous, { name: candidate }, context, objects),
    )
  )
    return false;
  if (
    condition.nameIncludes?.length &&
    !condition.nameIncludes.some((part) =>
      matchesFilter(previous, { nameContains: part }, context, objects),
    )
  )
    return false;
  if (condition.color && previous.properties.color !== condition.color.toLowerCase()) return false;
  return !condition.filter || matchesFilter(previous, condition.filter, context, objects);
}
