/**
 * Value-aware strategy variant.
 *
 * Inherits the canonical defaults from {@link composeStrategy} —
 * including the typed `resolveEffect` decision tree, setup choices, and
 * pass-family ordering — and replaces the family rankers for the two
 * decisions where simple heuristics meaningfully outperform enumerator
 * order:
 *
 *   - **`enterBattle`**: rank attacks by expected damage to the target.
 *     Direct attacks (target = a player id) score by attacker AP alone;
 *     attacks on units score by `attacker.ap` clamped to the target's
 *     remaining HP, with a small bonus when the attacker can outright
 *     kill the target. Ties broken by attacker AP, then by enumerator
 *     order so the strategy stays deterministic.
 *
 *   - **`deployUnit`**: rank deploys by `ap + hp` of the unit being
 *     played, descending. Doesn't model curve / synergy / upcoming
 *     turns — the goal here is to demonstrate that any value function
 *     hooked into the policy slot raises the floor over enumerator
 *     order.
 *
 * Designed to be A/B-able against `greedyLegalStrategy` via the
 * `playMatch` self-play harness. Smarter target selection (preferring
 * lethal kills, lethal blockers, etc.) is a natural follow-up override
 * and lives in this same file or another `composeStrategy` variant.
 */

import type { Card, UnitCard } from "@tcg/gundam-types";

import type { FilteredCardView, FilteredMatchView } from "../types/projection.ts";
import type { GundamBotCandidate } from "./candidate-types.ts";
import { composeStrategy, type FamilyPolicy, type FamilyPolicyContext } from "./shared-policies.ts";

/**
 * Look up a card's `Card` definition by instance ID inside a player's
 * filtered view. Walks every zone the viewer can see; returns `null`
 * when the card is hidden (face-down, in opponent's hand, etc.) or
 * unknown to this viewer.
 *
 * O(n) over visible cards. For the typical mid-match board (~30 visible
 * instances per side) this is negligible. Callers that rank lots of
 * candidates can build a `Map<instanceId, Card>` once per ranker call.
 */
function findDefinition(view: FilteredMatchView, instanceId: string): Card | null {
  for (const zoneData of Object.values(view.zones.zones)) {
    for (const card of zoneData.cards) {
      if (card.instanceId === instanceId) return card.definition;
    }
  }
  return null;
}

/** Build a one-shot lookup map for fast batch ranking. */
function indexDefinitions(view: FilteredMatchView): Map<string, FilteredCardView> {
  const out = new Map<string, FilteredCardView>();
  for (const zoneData of Object.values(view.zones.zones)) {
    for (const card of zoneData.cards) {
      out.set(card.instanceId, card);
    }
  }
  return out;
}

function isUnit(definition: Card | null): definition is UnitCard {
  return definition?.type === "unit";
}

/**
 * Damage estimate for an `enterBattle` candidate. The target is either
 * a unit (instance id) or the literal player id ("direct attack").
 *
 * Score breakdown:
 *   - Unknown attacker (no definition visible) → 0.
 *   - Direct attack against a player → `attacker.ap`.
 *   - Attack against an unknown / non-unit target → `attacker.ap`
 *     (treat as worst-case face hit so the attack still scores).
 *   - Attack against a known unit:
 *       * `damage = min(attacker.ap, max(target.hp - currentDamage, 1))`
 *       * `+5` bonus when `attacker.ap >= remaining target HP` (kill).
 *       * `-2` penalty when the target's AP would kill the attacker
 *         in retaliation (proxy for "trading up" preference).
 *
 * The numbers are rough; the goal is "rank correlation > random", not
 * a perfect evaluator. Tune via self-play later.
 */
function scoreAttack(
  candidate: Extract<GundamBotCandidate, { family: "enterBattle" }>,
  view: FilteredMatchView,
  defs: Map<string, FilteredCardView>,
): number {
  const attackerCard = defs.get(candidate.attackerId);
  if (!attackerCard || !isUnit(attackerCard.definition)) return 0;
  const attackerAp = attackerCard.definition.ap;

  const targetCard = defs.get(candidate.target);

  // Direct attack: target is a player id (no card view for it).
  if (!targetCard) return attackerAp;

  if (!isUnit(targetCard.definition)) return attackerAp;

  const targetHp = targetCard.definition.hp;
  const damageDealt = view.G as { damage?: Record<string, number> };
  const currentDamage = damageDealt.damage?.[candidate.target] ?? 0;
  const remainingHp = Math.max(targetHp - currentDamage, 1);

  let score = Math.min(attackerAp, remainingHp);
  if (attackerAp >= remainingHp) score += 5;

  const targetAp = targetCard.definition.ap;
  const attackerHp = attackerCard.definition.hp;
  const attackerCurrentDamage = damageDealt.damage?.[candidate.attackerId] ?? 0;
  if (targetAp >= Math.max(attackerHp - attackerCurrentDamage, 1)) score -= 2;

  return score;
}

const rankByDamage: FamilyPolicy<"enterBattle"> = (ctx) => {
  const defs = indexDefinitions(ctx.parent.view);
  const scored = ctx.candidates.map((candidate, index) => ({
    candidate,
    index,
    score: scoreAttack(candidate, ctx.parent.view, defs),
  }));
  scored.sort((a, b) => {
    if (a.score !== b.score) return b.score - a.score;
    return a.index - b.index;
  });
  return scored.map((entry) => entry.candidate);
};

/**
 * Score a `deployUnit` candidate by `ap + hp` of the unit definition.
 * Cards we can't see definitions for (shouldn't happen for our own
 * hand, but defensive) score 0 and rank last.
 */
function scoreDeploy(
  candidate: Extract<GundamBotCandidate, { family: "deployUnit" }>,
  view: FilteredMatchView,
): number {
  const def = findDefinition(view, candidate.cardId);
  if (!isUnit(def)) return 0;
  return def.ap + def.hp;
}

const rankByStatTotal: FamilyPolicy<"deployUnit"> = (ctx) => {
  const scored = ctx.candidates.map((candidate, index) => ({
    candidate,
    index,
    score: scoreDeploy(candidate, ctx.parent.view),
  }));
  scored.sort((a, b) => {
    if (a.score !== b.score) return b.score - a.score;
    return a.index - b.index;
  });
  return scored.map((entry) => entry.candidate);
};

/**
 * Heuristic-ranking strategy: greedy-legal's family ordering, plus
 * value-based ranking inside `enterBattle` and `deployUnit`. Use the
 * `playMatch` self-play harness to A/B against `greedyLegalStrategy`
 * and confirm the value heuristics actually raise win-rate.
 */
export const valueRankedStrategy = composeStrategy("value-ranked", {
  enterBattle: rankByDamage,
  deployUnit: rankByStatTotal,
});

// Re-export the rankers for tests and for downstream strategies that
// want to compose from these building blocks (e.g. a strategy that
// inherits `rankByDamage` but overrides `deployUnit` differently).
export { rankByDamage, rankByStatTotal };
// Local type re-export for the `playMatch` family-policy A/B tests.
export type { FamilyPolicyContext };
