import type { FabCondition } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../../rules-view.ts";
import type { MutableObject } from "../mutable.ts";

function normalizeName(value: string): string {
  return value.toLocaleLowerCase().replace(/[^a-z0-9]+/g, "");
}

export function evaluateLastAttackThisTurn(
  condition: FabCondition & { type: "last-attack-this-turn" },
  context: FabEvalContext,
  _objects: ReadonlyMap<string, MutableObject>,
): boolean {
  const names = context.facts?.playerLastAttackNamesThisTurn[context.controllerId] ?? [];
  const last = names.at(-1);
  if (!last) return false;
  return condition.names.some((name) => normalizeName(name) === normalizeName(last));
}
