import type { FabCondition } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../../rules-view.ts";
import type { MutableObject } from "../mutable.ts";

export function evaluateLastActionThisTurn(
  condition: FabCondition & { type: "last-action-this-turn" },
  context: FabEvalContext,
  _objects: ReadonlyMap<string, MutableObject>,
): boolean {
  const plays = context.facts?.playerActionCardPlaysThisTurn[context.controllerId] ?? [];
  const latest = plays.at(-1);
  const currentInstanceIds = new Set(
    [context.source?.instanceId, context.facts?.combat?.attack?.instanceId].filter(
      (instanceId): instanceId is string => typeof instanceId === "string",
    ),
  );
  const last =
    condition.excludeSource && latest && currentInstanceIds.has(latest.instanceId)
      ? plays.at(-2)
      : latest;
  const supertypes =
    last?.supertypes ??
    context.facts?.playerLastActionCardPlayedSupertypes[context.controllerId] ??
    [];
  const wanted = condition.filter.typeBox?.supertypes ?? [];
  if (wanted.length === 0) return supertypes.length > 0;
  return wanted.some((supertype) => supertypes.includes(supertype));
}
