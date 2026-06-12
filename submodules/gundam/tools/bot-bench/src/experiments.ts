/**
 * Experimental candidate strategies for `/improve-bot` iterations.
 *
 * Each strategy isolates ONE hypothesis so its win-rate delta vs the
 * baseline is interpretable. Strategies live here (in bot-bench, not in
 * the engine) so the engine's strategy surface stays curated; only the
 * strategy that survives the full 10-iteration loop gets promoted to
 * `packages/engine/src/automation/`.
 *
 * Hypotheses (in iteration order):
 *
 *   01-filter-blockers     — Drop `declareBlock` candidates whose unit
 *                            doesn't have the `<Blocker>` keyword.
 *                            Baseline data: 19/35 declareBlock attempts
 *                            failed with MISSING_BLOCKER_KEYWORD (10)
 *                            or CANNOT_BLOCK_DIRECT (9).
 *
 *   02-pending-priority    — When `ctx.pendingChoice !== null`, ONLY
 *                            emit `resolveEffect` candidates. Stops the
 *                            strategy from wasting attempts on aggressive
 *                            families that the engine will reject with
 *                            EFFECT_PENDING.
 *
 *   03-skip-self-block     — Filter `declareBlock` candidates where the
 *                            blocker IS the attack target (rule 8-3-3).
 *
 *   04-skip-high-maneuver  — When the attacker has `<High-Maneuver>`,
 *                            emit no `declareBlock` candidates at all.
 *
 *   05-rank-lethal         — `enterBattle` ranker that prioritises kills
 *                            (attacker AP ≥ target remaining HP) over
 *                            pure damage.
 *
 *   06-go-second           — `chooseFirstPlayer` picks the OPPONENT.
 *                            Going second wins resource + draw step.
 *
 *   07-attack-priority     — Bump enterBattle to priority 1 (above
 *                            declareBlock). The default ordering favours
 *                            defence; in a low-skill matchup, closing
 *                            with attacks is dominant.
 *
 *   08-deploy-curve        — `deployUnit` ranker by cost ascending. Plays
 *                            curve-correct: 1-drops before 3-drops.
 *
 *   09-mulligan-low-curve  — `alterHand` redraws if hand has no unit at
 *                            cost ≤ 2.
 *
 *   10-stack-best          — Composition of every kept improvement.
 *                            Final candidate to promote to the engine.
 */

import {
  composeStrategy,
  DEFAULT_FAMILY_PRIORITY,
  type CandidateStrategy,
  type FamilyPolicy,
  type GundamBotCandidate,
  type GundamBotCandidateFamily,
} from "@tcg/gundam-engine";
import type { Card, KeywordEffect, KeywordEffectEntry, UnitCard } from "@tcg/gundam-types";

// ── Shared helpers ────────────────────────────────────────────────────────────

function hasKeyword(def: Card | null | undefined, keyword: KeywordEffect): boolean {
  if (!def) return false;
  const list = (def as { keywordEffects?: KeywordEffectEntry[] }).keywordEffects ?? [];
  return list.some((e) => e.keyword === keyword);
}

function isUnit(def: Card | null | undefined): def is UnitCard {
  return def?.type === "unit";
}

function findDefinition(
  ctx: Parameters<FamilyPolicy<"declareBlock">>[0]["parent"],
  cardId: string,
): Card | null {
  for (const zoneData of Object.values(ctx.view.zones.zones)) {
    for (const card of zoneData.cards) {
      if (card.instanceId === cardId) return card.definition;
    }
  }
  return null;
}

// ── Iteration 1: filter declareBlock by <Blocker> keyword ─────────────────────

const filterBlockers: FamilyPolicy<"declareBlock"> = (ctx) => {
  return ctx.candidates.filter((c) => {
    const def = findDefinition(ctx.parent, c.blockerId);
    return hasKeyword(def, "Blocker");
  });
};

export const iter01FilterBlockers = composeStrategy("iter-01-filter-blockers", {
  declareBlock: filterBlockers,
});

// ── Iteration 2: pending choice short-circuits the rest of the strategy ───────

/**
 * When `pendingChoice !== null`, the engine is waiting for a `resolveEffect`
 * submission. Any other family will fail with EFFECT_PENDING and burn the
 * strategy's attempt budget. The `composeStrategy` policy applies per-family;
 * to short-circuit ALL families at once we wrap the strategy itself.
 */
function withPendingShortCircuit(name: string, inner: CandidateStrategy): CandidateStrategy {
  return {
    name,
    selectCandidates(parent) {
      if (parent.pendingChoice) {
        return parent.candidates.filter((c) => c.family === "resolveEffect");
      }
      return inner.selectCandidates(parent);
    },
  };
}

const baseStrategy = composeStrategy("iter-02-base");
export const iter02PendingPriority = withPendingShortCircuit(
  "iter-02-pending-priority",
  baseStrategy,
);

// ── Iteration 3: filter self-block ────────────────────────────────────────────

interface PendingCombatLike {
  readonly attackerId: string;
  readonly target: string;
}

function getPendingCombat(
  parent: Parameters<FamilyPolicy<"declareBlock">>[0]["parent"],
): PendingCombatLike | null {
  const g = parent.state.G as { turnMetadata?: { pendingCombat?: PendingCombatLike } };
  return g.turnMetadata?.pendingCombat ?? null;
}

const skipSelfBlock: FamilyPolicy<"declareBlock"> = (ctx) => {
  const combat = getPendingCombat(ctx.parent);
  if (!combat) return ctx.candidates;
  return ctx.candidates.filter((c) => c.blockerId !== combat.target);
};

export const iter03SkipSelfBlock = composeStrategy("iter-03-skip-self-block", {
  declareBlock: skipSelfBlock,
});

// ── Iteration 4: skip block when attacker has <High-Maneuver> ─────────────────

const skipHighManeuver: FamilyPolicy<"declareBlock"> = (ctx) => {
  const combat = getPendingCombat(ctx.parent);
  if (!combat) return ctx.candidates;
  const attackerDef = findDefinition(ctx.parent, combat.attackerId);
  if (hasKeyword(attackerDef, "HighManeuver")) return [];
  return ctx.candidates;
};

export const iter04SkipHighManeuver = composeStrategy("iter-04-skip-high-maneuver", {
  declareBlock: skipHighManeuver,
});

// ── Iteration 5: lethal-aware enterBattle ranker ──────────────────────────────

function indexDefs(
  parent: Parameters<FamilyPolicy<"enterBattle">>[0]["parent"],
): Map<string, Card> {
  const m = new Map<string, Card>();
  for (const zoneData of Object.values(parent.view.zones.zones)) {
    for (const card of zoneData.cards) {
      if (card.definition) m.set(card.instanceId, card.definition);
    }
  }
  return m;
}

function lethalScore(
  candidate: Extract<GundamBotCandidate, { family: "enterBattle" }>,
  defs: Map<string, Card>,
  damageMap: Record<string, number>,
): number {
  const attackerDef = defs.get(candidate.attackerId);
  if (!isUnit(attackerDef)) return 0;
  const ap = attackerDef.ap;

  const targetDef = defs.get(candidate.target);
  if (!isUnit(targetDef)) return ap; // direct attack — score by raw AP
  const remaining = Math.max(targetDef.hp - (damageMap[candidate.target] ?? 0), 1);
  let score = Math.min(ap, remaining);
  if (ap >= remaining) score += 100; // huge bonus for guaranteed kill
  if (hasKeyword(attackerDef, "FirstStrike")) score += 5; // edge in mutual trades
  if (hasKeyword(targetDef, "Repair")) score += 2; // burn down healers
  return score;
}

const rankLethal: FamilyPolicy<"enterBattle"> = (ctx) => {
  const defs = indexDefs(ctx.parent);
  const damageMap = (ctx.parent.state.G as { damage?: Record<string, number> }).damage ?? {};
  return [...ctx.candidates]
    .map((c, i) => ({ c, i, score: lethalScore(c, defs, damageMap) }))
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .map((e) => e.c);
};

export const iter05RankLethal = composeStrategy("iter-05-rank-lethal", {
  enterBattle: rankLethal,
});

// ── Iteration 6: choose to go second ──────────────────────────────────────────

const goSecond: FamilyPolicy<"chooseFirstPlayer"> = (ctx) => {
  const ownId = ctx.parent.playerId as unknown as string;
  const opponent = ctx.candidates.find((c) => c.playerId !== ownId);
  if (opponent) return [opponent];
  return ctx.candidates;
};

export const iter06GoSecond = composeStrategy("iter-06-go-second", {
  chooseFirstPlayer: goSecond,
});

// ── Iteration 7: rebalance family priority (attack > block) ───────────────────

const attackPriority: Record<GundamBotCandidateFamily, number> = {
  ...DEFAULT_FAMILY_PRIORITY,
  enterBattle: 1,
  declareBlock: 2,
};

export const iter07AttackPriority = composeStrategy(
  "iter-07-attack-priority",
  {},
  { priority: attackPriority },
);

// ── Iteration 8: deploy by cost ascending ─────────────────────────────────────

function deployCost(
  candidate: Extract<GundamBotCandidate, { family: "deployUnit" }>,
  defs: Map<string, Card>,
): number {
  const def = defs.get(candidate.cardId);
  if (!def) return 99;
  return def.cost ?? 99;
}

const deployCurve: FamilyPolicy<"deployUnit"> = (ctx) => {
  const defs = indexDefs(ctx.parent);
  return [...ctx.candidates]
    .map((c, i) => ({ c, i, cost: deployCost(c, defs) }))
    .sort((a, b) => a.cost - b.cost || a.i - b.i)
    .map((e) => e.c);
};

export const iter08DeployCurve = composeStrategy("iter-08-deploy-curve", {
  deployUnit: deployCurve,
});

// ── Iteration 9: mulligan if no low-curve unit ────────────────────────────────

const mulliganLowCurve: FamilyPolicy<"alterHand"> = (ctx) => {
  // Look at the player's hand for any unit with cost ≤ 2.
  const ownId = ctx.parent.playerId as unknown as string;
  const handZone = ctx.parent.view.zones.zones[`hand:${ownId}`];
  if (!handZone) return ctx.candidates;
  const hasEarly = handZone.cards.some((c) => {
    const def = c.definition;
    if (!def) return false;
    return def.type === "unit" && (def.cost ?? 99) <= 2;
  });
  const keep = ctx.candidates.find((c) => c.wantsRedraw === false);
  const redraw = ctx.candidates.find((c) => c.wantsRedraw === true);
  if (hasEarly && keep) return [keep];
  if (!hasEarly && redraw) return [redraw];
  return ctx.candidates;
};

export const iter09MulliganLowCurve = composeStrategy("iter-09-mulligan-low-curve", {
  alterHand: mulliganLowCurve,
});

// ── Iteration 10: stack every kept improvement ────────────────────────────────
// Composed once we know which iterations survived the bench.
// Initial definition is identical to greedy-legal; rebuilt below per
// iteration outcome by re-exporting from `experiments.ts` after each
// keep decision.

// Initial wide stack — includes every iteration, used to compare against
// individual levers during the iteration loop.
const stackedInner = composeStrategy("iter-10-stack-best-inner", {
  declareBlock: (ctx) => {
    const combat = getPendingCombat(ctx.parent);
    if (combat) {
      const attackerDef = findDefinition(ctx.parent, combat.attackerId);
      if (hasKeyword(attackerDef, "HighManeuver")) return [];
    }
    return ctx.candidates.filter((c) => {
      const def = findDefinition(ctx.parent, c.blockerId);
      if (!hasKeyword(def, "Blocker")) return false;
      if (combat && c.blockerId === combat.target) return false;
      return true;
    });
  },
  enterBattle: rankLethal,
  chooseFirstPlayer: goSecond,
  deployUnit: deployCurve,
  alterHand: mulliganLowCurve,
});

export const iter10StackBest = withPendingShortCircuit("iter-10-stack-best", stackedInner);

// ── Production stack ──────────────────────────────────────────────────────────
//
// After running the full 10-iteration bench loop on `ef-starter` and
// `gd01-mixed`, three levers survived as net-positive across both decks:
//
//   - `chooseFirstPlayer` → pick opponent (iter-06):  +10pp on ef, +4pp on gd01
//   - `declareBlock`     → filter to valid Blocker keyword units, skip
//                          self-block, skip when attacker has HighManeuver
//                          (iter-01/03/04): zero regression, defensive
//   - `pending-priority` → short-circuit non-resolveEffect when an effect
//                          is pending (iter-02): zero regression, defensive
//
// `iter-08-deploy-curve`, `iter-09-mulligan-low-curve`, and
// `iter-05-rank-lethal` regressed on `gd01-mixed` (longer games) — they
// over-fit to the early-concede pattern on `ef-starter` and don't carry
// to richer matchups. Excluded from the production stack.
//
// `iter-07-attack-priority` showed no measurable effect either way; the
// existing `enterBattle` priority of 2 was already early enough that
// bumping it to 1 didn't change submission order in practice.

const productionInner = composeStrategy("iter-production-inner", {
  chooseFirstPlayer: goSecond,
  declareBlock: (ctx) => {
    const combat = getPendingCombat(ctx.parent);
    if (combat) {
      const attackerDef = findDefinition(ctx.parent, combat.attackerId);
      if (hasKeyword(attackerDef, "HighManeuver")) return [];
    }
    return ctx.candidates.filter((c) => {
      const def = findDefinition(ctx.parent, c.blockerId);
      if (!hasKeyword(def, "Blocker")) return false;
      if (combat && c.blockerId === combat.target) return false;
      return true;
    });
  },
});

/** Final candidate for promotion to `packages/engine/src/automation/`. */
export const iterProduction = withPendingShortCircuit("iter-production", productionInner);
