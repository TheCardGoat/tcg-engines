import type { FabCondition } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../../rules-view.ts";
import type { MutableObject } from "../mutable.ts";
import { compare } from "../compare.ts";
import { resolveTarget } from "../resolve-target.ts";

export function evaluateHasCounter(
  condition: FabCondition & { type: "has-counter" },
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): boolean {
  const count = resolveTarget(condition.target ?? { selector: "self" }, context, objects).reduce(
    (total, object) =>
      total +
      object.input.counters
        .filter((counter) => counter.kind !== "damage")
        .filter((counter) =>
          condition.counter.kind === "named"
            ? counter.kind === "named" && counter.name === condition.counter.name
            : counter.kind === "numeric" &&
              counter.property === condition.counter.property &&
              counter.value === condition.counter.value,
        )
        .reduce((sum, counter) => sum + counter.count, 0),
    0,
  );
  return condition.comparison ? compare(count, condition.comparison, context, objects) : count > 0;
}
