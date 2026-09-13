import type { FabCondition } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../../rules-view.ts";
import type { MutableObject } from "../mutable.ts";
import { FabRulesEvaluationError } from "../errors.ts";
import { compare } from "../compare.ts";
import { arenaObjectZone, mutableObjectFromMoveLki } from "../helpers.ts";
import { matchesFilter } from "../matches-filter.ts";

export function evaluateLeftArenaCount(
  condition: FabCondition & { type: "left-arena-count" },
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): boolean {
  const turnNumber = context.facts?.turnNumber;
  if (condition.per === "turn" && turnNumber === undefined) {
    throw new FabRulesEvaluationError("left-arena-count without turn facts");
  }
  const count = [...objects.values()].reduce(
    (total, object) =>
      total +
      object.input.history.moves.filter((move) => {
        const lkiObject = move.lki ? mutableObjectFromMoveLki(move.lki, context) : null;
        if (!lkiObject || !arenaObjectZone(lkiObject.input.zone.zone)) return false;
        if (condition.per === "turn" && move.turnNumber !== turnNumber) return false;
        if (!condition.filter) return true;
        return matchesFilter(lkiObject, condition.filter, context, objects);
      }).length,
    0,
  );
  return compare(count, condition.comparison, context, objects);
}
