import type { FabCondition } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../../rules-view.ts";
import type { MutableObject } from "../mutable.ts";
import { compare } from "../compare.ts";

/**
 * Per-SOURCE realized damage ("If this deals more than N damage" — Surge, CR
 * 8.4.8). Reads the resolving source object's own damage total from the
 * rules-view fact layer. Distinct from `damage-dealt`, which is player-total
 * scoped and cannot answer "did *this* deal N damage".
 */
export function evaluateSourceDamageDealt(
  condition: Extract<FabCondition, { type: "source-damage-dealt" }>,
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): boolean {
  const facts = context.facts;
  if (!facts) return false;
  const sourceId = context.source?.instanceId;
  if (sourceId === undefined) return false;
  let table: Readonly<Record<string, number>>;
  if (condition.toHero) {
    table =
      condition.per === "turn"
        ? (facts.sourceDamageDealtToHeroThisTurn ?? {})
        : (facts.sourceDamageDealtToHeroThisChainLink ?? {});
  } else {
    table =
      condition.per === "turn"
        ? (facts.sourceDamageDealtThisTurn ?? {})
        : (facts.sourceDamageDealtThisChainLink ?? {});
  }
  return compare(table[sourceId] ?? 0, condition.comparison, context, objects);
}
