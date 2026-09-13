import { fleshAndBloodStructuredCardsByCanonicalId } from "@tcg/flesh-and-blood-cards";
import type { FabCondition } from "@tcg/flesh-and-blood-types";
import { describe, expect, it } from "vite-plus/test";
import {
  FAB_AUTHORABLE_STATUS_MARKERS,
  FAB_LEGACY_DERIVED_STATUS_MARKERS,
  FAB_STATUS_MARKERS,
} from "@tcg/flesh-and-blood-types";
import { CONDITION_HANDLED_STATUS_MARKERS } from "./evaluation/conditions/has-status.ts";
import { FILTER_HANDLED_STATUS_MARKERS } from "./evaluation/matches-filter.ts";

const REGEX_FAMILY_MARKER = /^defending-on-chain-link-\d+-or-higher$/;

function conditionStatusMarkers(condition: FabCondition | undefined): readonly string[] {
  if (!condition) return [];
  switch (condition.type) {
    case "has-status":
      return [condition.status];
    case "and":
    case "or":
      return condition.conditions.flatMap(conditionStatusMarkers);
    case "not":
      return conditionStatusMarkers(condition.condition);
    default:
      return [];
  }
}

describe("FabStatusMarker closed-union guard", () => {
  it("every Activate-only condition uses implemented has-status predicates", () => {
    const handled = new Set<string>(CONDITION_HANDLED_STATUS_MARKERS);
    const unhandled: Array<{ card: string; abilityId: string; status: string }> = [];

    for (const card of fleshAndBloodStructuredCardsByCanonicalId.values()) {
      for (const ability of card.base.abilities ?? []) {
        if (
          ability.kind !== "activated" ||
          !/activate (?:this|the)?\s*(?:ability )?only/i.test(ability.text)
        ) {
          continue;
        }
        for (const status of conditionStatusMarkers(ability.condition)) {
          if (handled.has(status) || REGEX_FAMILY_MARKER.test(status)) continue;
          unhandled.push({ card: card.slug, abilityId: ability.id, status });
        }
      }
    }

    expect(unhandled).toEqual([]);
  });
});

// Debt ledger. Markers the catalog declares (FAB_STATUS_MARKERS) MINUS those
// EITHER evaluator handles via an explicit table case (CONDITION_HANDLED ∪
// FILTER_HANDLED). Condition-form members of this set fall through to the
// fail-loud throw in evaluateHasStatus when evaluated; filter-form members may
// still match via the generic `marker.value === hasStatus` fallback in
// matchesFilter, so this is a conservative over-list (it errs toward flagging
// rather than missing). It must SHRINK deliberately (a handler/table case is
// added → update the snapshot) and must never GROW silently (a new catalog
// marker with no explicit handling adds one → the snapshot diff fails until
// acknowledged). The two deferred-behind-new-state markers
// (yellow-card-put-into-soul-this-turn, transformed-evo-is-hero) are in the
// condition table so they do not appear here; they are tracked in its comment.
describe("has-status unhandled-set debt ledger", () => {
  it("snapshots the markers declared-but-not-yet-handled by either evaluator", () => {
    const handled = new Set<string>([
      ...CONDITION_HANDLED_STATUS_MARKERS,
      ...FILTER_HANDLED_STATUS_MARKERS,
    ]);
    const unhandled = FAB_STATUS_MARKERS.filter((marker) => !handled.has(marker)).sort();
    expect(unhandled).toMatchSnapshot();
  });

  it("snapshots grandfathered N-or-more / this-way status slugs (new ones must be compare-amount or bindings)", () => {
    expect([...FAB_LEGACY_DERIVED_STATUS_MARKERS].sort()).toMatchSnapshot();
  });

  it("every remaining authorable marker has a condition handler", () => {
    const handled = new Set<string>(CONDITION_HANDLED_STATUS_MARKERS);
    expect(FAB_AUTHORABLE_STATUS_MARKERS.filter((marker) => !handled.has(marker))).toEqual([]);
  });
});
