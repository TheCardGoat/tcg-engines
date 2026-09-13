import type { FabCondition } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../../rules-view.ts";
import type { MutableObject } from "../mutable.ts";
import { FabRulesEvaluationError } from "../errors.ts";
import { compare } from "../compare.ts";
import {
  historyMoveMatchesPlayer,
  mutableObjectFromMoveLki,
  toCatalogZone,
  zoneObjectMatchesPlayer,
} from "../helpers.ts";
import { catalogZoneMatchesTargetZones } from "../../zones.ts";
import { matchesFilter } from "../matches-filter.ts";

export function evaluateZoneCount(
  condition: FabCondition & { type: "zone-count" },
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): boolean {
  if (condition.per) {
    const facts = context.facts;
    if (!facts) throw new FabRulesEvaluationError("zone-count history without facts");
    const count = [...objects.values()].reduce(
      (total, object) =>
        total +
        object.input.history.moves.filter((move) => {
          if (toCatalogZone(move.to.zone) !== condition.zone) return false;
          if (!historyMoveMatchesPlayer(move.to.playerId, condition.player, context)) return false;
          if (condition.per === "turn" && move.turnNumber !== facts.turnNumber) return false;
          if (
            condition.per === "chain-link" &&
            move.chainLinkNumber !== facts.combat?.chainLinkNumber
          )
            return false;
          if (!condition.filter) return true;
          return move.lki
            ? matchesFilter(
                mutableObjectFromMoveLki(move.lki, context),
                condition.filter,
                context,
                objects,
              )
            : false;
        }).length,
      0,
    );
    return compare(count, condition.comparison, context, objects);
  }
  const count = [...objects.values()].filter((object) => {
    // Same permanent umbrella as count cards-in-zone / object targets, plus
    // defending equipment still seated on the combat chain.
    const catalog = toCatalogZone(object.input.zone.zone);
    const inZone =
      catalogZoneMatchesTargetZones(catalog, [condition.zone]) ||
      (condition.zone === "permanent" &&
        object.input.zone.zone === "combatChain" &&
        object.properties.types.includes("Equipment"));
    if (!inZone) return false;
    if (!zoneObjectMatchesPlayer(object, condition.player, context)) return false;
    return !condition.filter || matchesFilter(object, condition.filter, context, objects);
  }).length;
  return compare(count, condition.comparison, context, objects);
}
