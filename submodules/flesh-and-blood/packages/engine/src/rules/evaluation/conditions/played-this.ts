import type { FabCardFilter, FabCondition } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../../rules-view.ts";
import type { MutableObject } from "../mutable.ts";
import { FabRulesEvaluationError } from "../errors.ts";
import { compare } from "../compare.ts";
import { mutableObjectFromMoveLki } from "../helpers.ts";
import { matchesFilter } from "../matches-filter.ts";
import { refKey } from "../mutable.ts";
import { toCatalogZone } from "../helpers.ts";
import { engineZoneToCatalog } from "../../zones.ts";

export function evaluatePlayedThis(
  condition: FabCondition & { type: "played-this" },
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): boolean {
  const facts = context.facts;
  if (!facts) throw new FabRulesEvaluationError("played-this without facts");
  if (condition.onlySource) {
    const subjectRef = context.subject ?? context.source;
    const subject = subjectRef ? objects.get(refKey(subjectRef)) : undefined;
    if (!subject) return false;
    const zones = condition.filter.playedFromZones;
    if (!zones) {
      throw new FabRulesEvaluationError("played-this onlySource requires playedFromZones");
    }
    // Play-quote fallback (card still seated) + the authoritative stamped
    // played-from declaration fact.
    if (subject.input.zone?.zone && zones.includes(engineZoneToCatalog(subject.input.zone.zone)))
      return true;
    return (
      subject.input.declarationFacts?.some(
        (fact) => fact.kind === "played-from" && zones.includes(fact.zone as never),
      ) === true
    );
  }
  if (
    condition.per === "chain-link" &&
    Object.keys(condition.filter).length === 1 &&
    condition.filter.typeBox?.types?.length === 1 &&
    condition.filter.typeBox.types[0] === "Instant"
  ) {
    const count = facts.playerPlayedInstantThisChainLink?.[context.controllerId] ? 1 : 0;
    return compare(count, condition.comparison ?? { op: "gte", value: 1 }, context, objects);
  }
  // playedFromZones is matched against the move's origin zone directly: the
  // synthetic LKI object built below carries no move history, so delegating
  // this key to matchesFilter would always fail.
  const originZones = condition.filter.playedFromZones;
  const lkiFilter: FabCardFilter = { ...condition.filter };
  delete lkiFilter.playedFromZones;
  const lkiFilterActive = Object.keys(lkiFilter).length > 0;
  const count = [...objects.values()].reduce((total, object) => {
    return (
      total +
      object.input.history.moves.filter((move) => {
        if (move.to.zone !== "stack") return false;
        if (condition.per === "turn" && move.turnNumber !== facts.turnNumber) return false;
        if (
          condition.per === "chain-link" &&
          move.chainLinkNumber !== facts.combat?.chainLinkNumber
        )
          return false;
        if (
          originZones &&
          !(move.from !== null && originZones.includes(toCatalogZone(move.from.zone)))
        )
          return false;
        return move.lki
          ? lkiFilterActive
            ? matchesFilter(
                mutableObjectFromMoveLki(move.lki, context),
                lkiFilter,
                context,
                objects,
              )
            : true
          : false;
      }).length
    );
  }, 0);
  return compare(count, condition.comparison ?? { op: "gte", value: 1 }, context, objects);
}
