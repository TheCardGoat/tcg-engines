import type { FabCondition } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../../rules-view.ts";
import type { MutableObject } from "../mutable.ts";
import { resolveTarget } from "../resolve-target.ts";

export function evaluateHasKeyword(
  condition: FabCondition & { type: "has-keyword" },
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): boolean {
  return resolveTarget(condition.target ?? { selector: "self" }, context, objects).some((object) =>
    object.properties.keywords.some((keyword) => keyword.name === condition.keyword),
  );
}
