import type { FabCondition } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../../rules-view.ts";
import type { MutableObject } from "../mutable.ts";
import { compare } from "../compare.ts";

/**
 * Prefer the canonical `die-result` number binding (staged from roll / roll-request).
 * Fall back to `roll-result` when only the DSL alias was bound.
 *
 * Missing binding → false (closed): decision walks and compile-time probes must
 * not throw when a later roll has not yet staged its result.
 */
export function evaluateDieResult(
  condition: FabCondition & { type: "die-result" },
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): boolean {
  const value = context.bindings.numbers["die-result"] ?? context.bindings.numbers["roll-result"];
  if (value === undefined) return false;
  return compare(value, condition.comparison, context, objects);
}
