import type { FabCondition } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../../rules-view.ts";
import type { MutableObject } from "../mutable.ts";
import { compare } from "../compare.ts";

export function evaluateChainLinkCount(
  condition: FabCondition & { type: "chain-link-count" },
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): boolean {
  return compare(
    context.facts?.combat?.chainLinkNumber ?? 0,
    condition.comparison,
    context,
    objects,
  );
}
