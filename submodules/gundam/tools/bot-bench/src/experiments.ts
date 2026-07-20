/**
 * Experimental candidate strategies for `/improve-bot` iterations.
 *
 * Each strategy isolates ONE hypothesis so its win-rate delta vs the
 * baseline is interpretable. Strategies live here (in bot-bench, not in
 * the engine) so the engine's strategy surface stays curated; only the
 * strategy that survives the full 10-iteration loop gets promoted to
 * `packages/engine/src/automation/`.
 *
 * Iterations 01–10 are retained as historical controls. Their original
 * conclusions predate the evaluation-integrity fixes for clockless timeout
 * moves, optional effects, and strategic concession; do not treat their old
 * comments as promotion evidence.
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
  combatAwareStrategy,
  composeStrategy,
  DEFAULT_FAMILY_PRIORITY,
  getEffectiveStats,
  rankByDamage,
  rankByStatTotal,
  type CandidateStrategy,
  type FamilyPolicy,
  type GundamG,
  type GundamBotCandidate,
  type GundamBotCandidateFamily,
} from "@tcg/gundam-engine";
import type {
  Card,
  CommandCard,
  Directive,
  EffectAction,
  KeywordEffect,
  KeywordEffectEntry,
  UnitCard,
} from "@tcg/gundam-types";

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

// ── Legacy pre-integrity production stack ────────────────────────────────────
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

/** Historical candidate, retained only for reproducible rejection comparisons. */
export const iterProduction = withPendingShortCircuit("iter-production", productionInner);

// ── Post-integrity hypotheses ────────────────────────────────────────────────
//
// These variants were added after BotLab stopped treating timeout drops and
// voluntary concessions as game wins. They test cross-family planning rather
// than repeating legality filters that now live in DEFAULT_POLICIES.

const prepareCombatPriority: Record<GundamBotCandidateFamily, number> = {
  ...DEFAULT_FAMILY_PRIORITY,
  assignPilot: 1,
  playCommandAsPilot: 2,
  activateAbility: 3,
  playCommand: 4,
  deployUnit: 5,
  deployBase: 6,
  enterBattle: 7,
};

/** Develop the board and attach Pilots before committing attackers. */
export const iter11PrepareCombat = composeStrategy(
  "iter-11-prepare-combat",
  {
    enterBattle: rankByDamage,
    deployUnit: rankByStatTotal,
  },
  { priority: prepareCombatPriority },
);

/** Preserve value ranking but send direct attacks before board attacks. */
const rankDirectPressure: FamilyPolicy<"enterBattle"> = (ctx) => {
  const ranked = rankByDamage(ctx);
  return [...ranked].sort((a, b) => Number(b.target === "direct") - Number(a.target === "direct"));
};

export const iter12DirectPressure = composeStrategy("iter-12-direct-pressure", {
  enterBattle: rankDirectPressure,
  deployUnit: rankByStatTotal,
});

/**
 * Strategic stack: develop before combat, keep a playable opening hand, and
 * switch from value trades to shield pressure once the opponent is in the
 * two-shield closing window.
 */
const rankClosingPressure: FamilyPolicy<"enterBattle"> = (ctx) => {
  const ranked = rankByDamage(ctx);
  const ownId = ctx.parent.playerId as unknown as string;
  const opponentId = ctx.parent.state.ctx.playerIds.find((id) => id !== ownId);
  const shieldCount = opponentId
    ? (ctx.parent.view.zones.zones[`shieldArea:${opponentId}`]?.count ?? Number.POSITIVE_INFINITY)
    : Number.POSITIVE_INFINITY;
  if (shieldCount > 2) return ranked;
  return [...ranked].sort((a, b) => Number(b.target === "direct") - Number(a.target === "direct"));
};

export const iter13Strategic = composeStrategy(
  "iter-13-strategic",
  {
    alterHand: mulliganLowCurve,
    enterBattle: rankClosingPressure,
    deployUnit: rankByStatTotal,
  },
  { priority: prepareCombatPriority },
);

// ── Selective-combat hypotheses ─────────────────────────────────────────────

interface CombatUnitValue {
  readonly ap: number;
  readonly remainingHp: number;
  readonly cost: number;
  readonly keywords: readonly string[];
  readonly value: number;
}

interface CombatOutcome {
  readonly attackerDestroyed: boolean;
  readonly defenderDestroyed: boolean;
}

function combatUnitValue(
  parent: Parameters<FamilyPolicy<"enterBattle">>[0]["parent"],
  cardId: string,
): CombatUnitValue {
  const g = parent.state.G as unknown as GundamG;
  const stats = getEffectiveStats(cardId, g, parent.cards);
  const remainingHp = Math.max(0, stats.hp - (g.damage[cardId] ?? 0));
  const keywordValue =
    Number(stats.keywords.includes("Blocker")) * 2 +
    Number(stats.keywords.includes("FirstStrike")) * 2 +
    Number(stats.keywords.includes("HighManeuver")) * 2 +
    Number(stats.keywords.includes("Repair"));
  return {
    ap: stats.ap,
    remainingHp,
    cost: stats.cost,
    keywords: stats.keywords,
    value: stats.cost * 2 + stats.ap + remainingHp + keywordValue,
  };
}

/** Resolve the simultaneous/First Strike portion of rules 8-5-3 and 13-1-5. */
function combatOutcome(attacker: CombatUnitValue, defender: CombatUnitValue): CombatOutcome {
  let attackerDestroyed = defender.ap >= attacker.remainingHp;
  let defenderDestroyed = attacker.ap >= defender.remainingHp;
  const attackerFirst = attacker.keywords.includes("FirstStrike");
  const defenderFirst = defender.keywords.includes("FirstStrike");
  if (attackerFirst && !defenderFirst && defenderDestroyed) attackerDestroyed = false;
  if (defenderFirst && !attackerFirst && attackerDestroyed) defenderDestroyed = false;
  return { attackerDestroyed, defenderDestroyed };
}

function directPressureScore(
  parent: Parameters<FamilyPolicy<"enterBattle">>[0]["parent"],
  attacker: CombatUnitValue,
): number {
  const ownId = parent.playerId as unknown as string;
  const opponentId = parent.state.ctx.playerIds.find((id) => id !== ownId);
  if (!opponentId) return 0;
  const shields = parent.view.zones.zones[`shieldArea:${opponentId}`]?.count ?? 0;
  const base = parent.view.zones.zones[`baseSection:${opponentId}`]?.cards[0];
  if (!base) {
    if (shields === 0) return 1_000;
    return 24 + (shields <= 2 ? 12 : 0) + (shields === 1 ? 20 : 0);
  }
  const g = parent.state.G as unknown as GundamG;
  const baseHp = base.definition?.type === "base" ? base.definition.hp : 0;
  const remainingBaseHp = Math.max(0, baseHp - (g.damage[base.instanceId] ?? 0));
  return 20 + Math.min(attacker.ap, remainingBaseHp) + (attacker.ap >= remainingBaseHp ? 30 : 0);
}

/**
 * Prefer effective-stat kills and favorable trades, while keeping direct
 * pressure available whenever a Unit attack would throw away more value than
 * it removes.
 */
export const rankEffectiveCombat: FamilyPolicy<"enterBattle"> = (ctx) => {
  return [...ctx.candidates]
    .map((candidate, index) => {
      const attacker = combatUnitValue(ctx.parent, candidate.attackerId);
      if (candidate.target === "direct") {
        return { candidate, index, score: directPressureScore(ctx.parent, attacker) };
      }
      const defender = combatUnitValue(ctx.parent, candidate.target);
      const outcome = combatOutcome(attacker, defender);
      let score = Math.min(attacker.ap, defender.remainingHp);
      if (outcome.defenderDestroyed) score += 20 + defender.value;
      if (outcome.attackerDestroyed) score -= 12 + attacker.value;
      if (outcome.defenderDestroyed && attacker.keywords.includes("Breach")) score += 10;
      if (!outcome.defenderDestroyed && outcome.attackerDestroyed) score -= 40;
      return { candidate, index, score };
    })
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ candidate }) => candidate);
};

interface SelectiveBlockOptions {
  /** Strategic value assigned to losing one Shield at the current count. */
  readonly shieldLossValue: (shieldCount: number) => number;
  /** Minimum modeled improvement required to rest a blocker. */
  readonly minimumImprovement: number;
}

function directLossValue(
  parent: Parameters<FamilyPolicy<"declareBlock">>[0]["parent"],
  attacker: CombatUnitValue,
  shieldLossValue: (shieldCount: number) => number,
): number {
  const ownId = parent.playerId as unknown as string;
  const shields = parent.view.zones.zones[`shieldArea:${ownId}`]?.count ?? 0;
  const base = parent.view.zones.zones[`baseSection:${ownId}`]?.cards[0];
  if (!base) return shields === 0 ? 1_000 : shieldLossValue(shields);
  const g = parent.state.G as unknown as GundamG;
  const baseHp = base.definition?.type === "base" ? base.definition.hp : 0;
  const remainingBaseHp = Math.max(0, baseHp - (g.damage[base.instanceId] ?? 0));
  return Math.min(attacker.ap, remainingBaseHp) + (attacker.ap >= remainingBaseHp ? 24 : 0);
}

function makeSelectiveBlock(options: SelectiveBlockOptions): FamilyPolicy<"declareBlock"> {
  return (ctx) => {
    const g = ctx.parent.state.G as unknown as GundamG;
    const combat = g.turnMetadata.pendingCombat;
    if (!combat) return [];
    const attacker = combatUnitValue(ctx.parent, combat.attackerId);
    if (attacker.keywords.includes("HighManeuver")) return [];

    let unblockedDefenderLoss = 0;
    let unblockedAttackerLoss = 0;
    if (combat.target === "direct") {
      unblockedDefenderLoss = directLossValue(ctx.parent, attacker, options.shieldLossValue);
    } else {
      const originalTarget = combatUnitValue(ctx.parent, combat.target);
      const unblocked = combatOutcome(attacker, originalTarget);
      if (unblocked.defenderDestroyed) unblockedDefenderLoss = originalTarget.value;
      if (unblocked.attackerDestroyed) unblockedAttackerLoss = attacker.value;
    }
    const unblockedNetLoss = unblockedDefenderLoss - unblockedAttackerLoss;

    return ctx.candidates
      .filter((candidate) => candidate.blockerId !== combat.target)
      .filter((candidate) =>
        getEffectiveStats(candidate.blockerId, g, ctx.parent.cards).keywords.includes("Blocker"),
      )
      .map((candidate, index) => {
        const blocker = combatUnitValue(ctx.parent, candidate.blockerId);
        const blocked = combatOutcome(attacker, blocker);
        const blockedNetLoss =
          (blocked.defenderDestroyed ? blocker.value : 0) -
          (blocked.attackerDestroyed ? attacker.value : 0);
        return {
          candidate,
          index,
          improvement: unblockedNetLoss - blockedNetLoss,
          // When outcomes tie, preserve the lower-value blocker for future
          // turns and prefer the one that survives the current combat.
          survivor: Number(!blocked.defenderDestroyed),
          blockerValue: blocker.value,
        };
      })
      .filter(({ improvement }) => improvement > options.minimumImprovement)
      .sort(
        (a, b) =>
          b.improvement - a.improvement ||
          b.survivor - a.survivor ||
          a.blockerValue - b.blockerValue ||
          a.index - b.index,
      )
      .map(({ candidate }) => candidate);
  };
}

const conservativeBlock = makeSelectiveBlock({
  shieldLossValue: (shields) => (shields <= 1 ? 24 : shields === 2 ? 10 : 4),
  minimumImprovement: 0,
});

const lastShieldBlock = makeSelectiveBlock({
  shieldLossValue: (shields) => (shields <= 1 ? 50 : shields === 2 ? 16 : 5),
  minimumImprovement: -1,
});

const boardPreservingBlock = makeSelectiveBlock({
  shieldLossValue: () => 0,
  minimumImprovement: 0,
});

const aggressiveShieldBlock = makeSelectiveBlock({
  shieldLossValue: (shields) => (shields <= 1 ? 100 : shields === 2 ? 35 : 12),
  minimumImprovement: -2,
});

/** Effective-stat attack targeting only. */
export const iter14EffectiveCombat = composeStrategy(
  "iter-14-effective-combat",
  { alterHand: mulliganLowCurve, enterBattle: rankEffectiveCombat, deployUnit: rankByStatTotal },
  { priority: prepareCombatPriority },
);

/** Selective Blocker decisions only, retaining the promoted attack policy. */
export const iter15SelectiveBlock = composeStrategy(
  "iter-15-selective-block",
  {
    alterHand: mulliganLowCurve,
    enterBattle: rankClosingPressure,
    declareBlock: conservativeBlock,
    deployUnit: rankByStatTotal,
  },
  { priority: prepareCombatPriority },
);

/** Combine favorable effective-stat combat with conservative blocking. */
export const iter16CombatAware = composeStrategy(
  "iter-16-combat-aware",
  {
    alterHand: mulliganLowCurve,
    enterBattle: rankEffectiveCombat,
    declareBlock: conservativeBlock,
    deployUnit: rankByStatTotal,
  },
  { priority: prepareCombatPriority },
);

/** Combined policy with a stronger final-Shield and lethal-defense bias. */
export const iter17LastShieldDefense = composeStrategy(
  "iter-17-last-shield-defense",
  {
    alterHand: mulliganLowCurve,
    enterBattle: rankEffectiveCombat,
    declareBlock: lastShieldBlock,
    deployUnit: rankByStatTotal,
  },
  { priority: prepareCombatPriority },
);

/** Combined policy that sacrifices only for board value or immediate defeat. */
export const iter18BoardPreservingBlock = composeStrategy(
  "iter-18-board-preserving-block",
  {
    alterHand: mulliganLowCurve,
    enterBattle: rankEffectiveCombat,
    declareBlock: boardPreservingBlock,
    deployUnit: rankByStatTotal,
  },
  { priority: prepareCombatPriority },
);

/** Combined policy that spends Blockers aggressively to protect Shields. */
export const iter19AggressiveShieldBlock = composeStrategy(
  "iter-19-aggressive-shield-block",
  {
    alterHand: mulliganLowCurve,
    enterBattle: rankEffectiveCombat,
    declareBlock: aggressiveShieldBlock,
    deployUnit: rankByStatTotal,
  },
  { priority: prepareCombatPriority },
);

// ── Next-heuristic hypothesis 1: threat-aware attack targets ────────────────

/**
 * Reorder only attack candidates after the canonical policy has applied its
 * legality, combat, Command, and development policies. This keeps the screen
 * interpretable: the candidate changes target selection, not the rest of the
 * turn planner.
 */
function withAttackOrdering(name: string, rank: FamilyPolicy<"enterBattle">): CandidateStrategy {
  return {
    name,
    selectCandidates(parent) {
      const canonical = combatAwareStrategy.selectCandidates(parent);
      const attacks = canonical.filter(
        (candidate): candidate is Extract<GundamBotCandidate, { family: "enterBattle" }> =>
          candidate.family === "enterBattle",
      );
      const orderedAttacks = rank({ parent, candidates: attacks });
      let nextAttack = 0;
      return canonical.map((candidate) =>
        candidate.family === "enterBattle" ? orderedAttacks[nextAttack++]! : candidate,
      );
    },
  };
}

/**
 * A rested enemy Unit will ready on its owner's next Start Phase. Where a
 * favorable kill competes with non-lethal direct pressure, price its AP as
 * future damage instead of treating its printed board value as sufficient.
 */
const rankThreatAwareCombat: FamilyPolicy<"enterBattle"> = (ctx) => {
  return [...ctx.candidates]
    .map((candidate, index) => {
      const attacker = combatUnitValue(ctx.parent, candidate.attackerId);
      if (candidate.target === "direct") {
        return { candidate, index, score: directPressureScore(ctx.parent, attacker) };
      }
      const defender = combatUnitValue(ctx.parent, candidate.target);
      const outcome = combatOutcome(attacker, defender);
      let score = Math.min(attacker.ap, defender.remainingHp);
      if (outcome.defenderDestroyed) {
        score += 20 + defender.value;
        // Three points per AP is intentionally bounded: it values stopping a
        // credible next-turn attacker without eclipsing Base/shield lethals.
        score += defender.ap * 3;
      }
      if (outcome.attackerDestroyed) score -= 12 + attacker.value;
      if (outcome.defenderDestroyed && attacker.keywords.includes("Breach")) score += 10;
      if (!outcome.defenderDestroyed && outcome.attackerDestroyed) score -= 40;
      return { candidate, index, score };
    })
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ candidate }) => candidate);
};

/** Isolated target-selection candidate; no block, curve, or Command changes. */
export const iter25ThreatAwareTarget = withAttackOrdering(
  "iter-25-threat-aware-target",
  rankThreatAwareCombat,
);

// ── Next-heuristic hypothesis 4: multi-attacker Blocker ordering ────────────

function opponentHasActiveBlocker(
  parent: Parameters<FamilyPolicy<"enterBattle">>[0]["parent"],
): boolean {
  const ownId = parent.playerId as unknown as string;
  const opponentId = parent.state.ctx.playerIds.find((id) => id !== ownId);
  if (!opponentId) return false;
  const g = parent.state.G as unknown as GundamG;
  return (parent.view.zones.zones[`battleArea:${opponentId}`]?.cards ?? []).some((card) =>
    Boolean(
      card.definition &&
      card.definition.type === "unit" &&
      !g.exhausted[card.instanceId] &&
      getEffectiveStats(card.instanceId, g, parent.cards).keywords.includes("Blocker"),
    ),
  );
}

/**
 * When an active enemy <Blocker> can still redirect one direct attack, lead
 * with the least valuable non-<High-Maneuver> attacker. This spends the
 * opponent's one legal block before committing the more valuable direct
 * attackers. Favorable Unit kills retain their canonical priority.
 */
const rankBlockerBaitCombat: FamilyPolicy<"enterBattle"> = (ctx) => {
  const canonical = rankEffectiveCombat(ctx);
  if (!opponentHasActiveBlocker(ctx.parent)) return canonical;
  return [...canonical].sort((a, b) => {
    if (a.target !== "direct" || b.target !== "direct") return 0;
    const aUnit = combatUnitValue(ctx.parent, a.attackerId);
    const bUnit = combatUnitValue(ctx.parent, b.attackerId);
    const aCanBeBlocked = !aUnit.keywords.includes("HighManeuver");
    const bCanBeBlocked = !bUnit.keywords.includes("HighManeuver");
    if (aCanBeBlocked !== bCanBeBlocked) return Number(bCanBeBlocked) - Number(aCanBeBlocked);
    return aUnit.value - bUnit.value;
  });
};

/** Isolated multi-attacker ordering candidate; only changes direct-attack order. */
export const iter26BlockerBaitOrder = withAttackOrdering(
  "iter-26-blocker-bait-order",
  rankBlockerBaitCombat,
);

// ── Command-utility hypotheses ──────────────────────────────────────────────

type StrategyParent = Parameters<FamilyPolicy<"playCommand">>[0]["parent"];

function visibleCardValue(parent: StrategyParent, cardId: string): number {
  const def = findDefinition(parent, cardId);
  if (!def) return 0;
  if (def.type === "unit") {
    const unit = combatUnitValue(parent, cardId);
    return Math.max(1, unit.value);
  }
  if (def.type === "base") return Math.max(2, def.cost * 2 + def.hp);
  return Math.max(1, (def.cost ?? 0) * 2 + 2);
}

function scoreTargetedAction(
  parent: StrategyParent,
  action: EffectAction,
  targetId: string,
): number {
  const g = parent.state.G as unknown as GundamG;
  const def = findDefinition(parent, targetId);
  switch (action.action) {
    case "dealDamage":
    case "dealDamageThenDrawIfDestroyed": {
      if (!def || def.type !== "unit") return 0;
      const remainingHp = Math.max(
        0,
        getEffectiveStats(targetId, g, parent.cards).hp - (g.damage[targetId] ?? 0),
      );
      const realized = Math.min(action.amount, remainingHp);
      const lethal = action.amount >= remainingHp && remainingHp > 0;
      return (
        realized * 3 +
        (lethal ? 20 + visibleCardValue(parent, targetId) : 0) +
        (action.action === "dealDamageThenDrawIfDestroyed" && lethal ? action.drawCount * 4 : 0)
      );
    }
    case "recoverHP":
      return Math.min(action.amount, g.damage[targetId] ?? 0) * 3;
    case "destroy":
    case "exile":
    case "returnToHand":
    case "returnToDeck":
    case "placeInTrash":
      return visibleCardValue(parent, targetId) + 12;
    case "rest":
      return g.exhausted[targetId] ? 0 : Math.max(3, visibleCardValue(parent, targetId) / 2);
    case "setActive":
      return g.exhausted[targetId] ? Math.max(3, visibleCardValue(parent, targetId) / 2) : 0;
    case "statModifier": {
      if (action.stat === "cost") return Math.abs(action.amount) * 2;
      const magnitude = Math.abs(action.amount);
      if (!def || def.type !== "unit") return magnitude * 2;
      const stats = getEffectiveStats(targetId, g, parent.cards);
      const remainingHp = Math.max(0, stats.hp - (g.damage[targetId] ?? 0));
      const lethalSwing = action.stat === "hp" && action.amount < 0 && magnitude >= remainingHp;
      return magnitude * 3 + (lethalSwing ? 20 + visibleCardValue(parent, targetId) : 0);
    }
    case "grantKeyword": {
      if (!def || def.type !== "unit") return 0;
      const alreadyGranted = getEffectiveStats(targetId, g, parent.cards).keywords.includes(
        action.keyword,
      );
      if (alreadyGranted) return 0;
      if (action.keyword === "FirstStrike" || action.keyword === "Blocker") return 6;
      if (action.keyword === "HighManeuver" || action.keyword === "Breach") return 5;
      return 3;
    }
    default:
      return 0;
  }
}

function scoreAction(
  parent: StrategyParent,
  action: EffectAction,
  targets: readonly string[],
): number {
  if ("target" in action && targets.length > 0) {
    return targets.reduce(
      (sum, targetId) => sum + scoreTargetedAction(parent, action, targetId),
      0,
    );
  }
  switch (action.action) {
    case "draw":
      return action.count * 4;
    case "drawThenDiscard":
      return Math.max(0, action.drawCount * 4 - action.discardCount * 2);
    case "drawAll":
      return action.count * 4;
    case "addShieldToHand":
      return action.count * 5;
    case "placeResource":
      return 7;
    case "deployToken":
    case "deploySelf":
      return 8;
    default:
      return 1;
  }
}

function scoreDirectives(
  parent: StrategyParent,
  directives: readonly Directive[],
  targets: readonly string[],
): number {
  let score = 0;
  for (const directive of directives) {
    if ("action" in directive) {
      const value = scoreAction(parent, directive.action, targets);
      score += directive.optional ? Math.max(0, value) : value;
    } else if ("options" in directive) {
      score += Math.max(
        0,
        ...directive.options.map((option) => scoreDirectives(parent, option.directives, targets)),
      );
    } else {
      score += Math.max(
        scoreDirectives(parent, directive.thenDirectives, targets),
        directive.elseDirectives ? scoreDirectives(parent, directive.elseDirectives, targets) : 0,
      );
    }
  }
  return score;
}

/** Immediate, target-aware value estimate used only by command experiments. */
export function commandUtility(
  parent: StrategyParent,
  candidate: Extract<GundamBotCandidate, { family: "playCommand" }>,
): number {
  const command = findDefinition(parent, candidate.cardId);
  if (command?.type !== "command") return 0;
  const effects = (command as CommandCard).effects ?? [];
  return effects
    .filter((effect) => effect.type === "command")
    .reduce(
      (sum, effect) => sum + scoreDirectives(parent, effect.directives, candidate.targets ?? []),
      0,
    );
}

const rankImpactfulCommands: FamilyPolicy<"playCommand"> = (ctx) =>
  ctx.candidates
    .map((candidate, index) => ({ candidate, index, score: commandUtility(ctx.parent, candidate) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ candidate }) => candidate);

/** Reject immediate no-ops and choose the highest-impact legal Command target. */
export const iter20CommandImpact = composeStrategy(
  "iter-20-command-impact",
  {
    alterHand: mulliganLowCurve,
    enterBattle: rankEffectiveCombat,
    declareBlock: conservativeBlock,
    deployUnit: rankByStatTotal,
    playCommand: rankImpactfulCommands,
  },
  { priority: prepareCombatPriority },
);

const developBeforeCommandPriority: Record<GundamBotCandidateFamily, number> = {
  ...prepareCombatPriority,
  deployUnit: 4,
  deployBase: 5,
  playCommand: 6,
  enterBattle: 7,
};

/** Spend Main-phase resources on persistent board development before Commands. */
export const iter21DevelopBeforeCommand = composeStrategy(
  "iter-21-develop-before-command",
  {
    alterHand: mulliganLowCurve,
    enterBattle: rankEffectiveCombat,
    declareBlock: conservativeBlock,
    deployUnit: rankByStatTotal,
    playCommand: rankImpactfulCommands,
  },
  { priority: developBeforeCommandPriority },
);

/**
 * Keep tactically decisive Commands ahead of development, but defer modest
 * effects while a persistent Unit or Base can still be deployed.
 */
export const iter22SelectiveCommand: CandidateStrategy = {
  name: "iter-22-selective-command",
  selectCandidates(parent) {
    const ordered = [...iter20CommandImpact.selectCandidates(parent)];
    const commands = ordered.filter((candidate) => candidate.family === "playCommand");
    const hasDevelopment = ordered.some(
      (candidate) => candidate.family === "deployUnit" || candidate.family === "deployBase",
    );
    if (!hasDevelopment || commands.length === 0) return ordered;

    const bestCommand = commands[0]!;
    // Seven points includes board-creating Commands (for example token
    // deployment) while still deferring chip damage and idle stat setup.
    if (commandUtility(parent, bestCommand) >= 7) return ordered;

    const deferred = new Set<GundamBotCandidate>(commands);
    const withoutCommands = ordered.filter((candidate) => !deferred.has(candidate));
    const lastDevelopment = withoutCommands.findLastIndex(
      (candidate) => candidate.family === "deployUnit" || candidate.family === "deployBase",
    );
    withoutCommands.splice(lastDevelopment + 1, 0, ...commands);
    return withoutCommands;
  },
};

function commandPilotUtility(
  parent: StrategyParent,
  candidate: Extract<GundamBotCandidate, { family: "playCommandAsPilot" }>,
): number {
  const card = findDefinition(parent, candidate.cardId);
  if (card?.type !== "command") return 0;
  const persistentStats = (card.apBonus ?? 0) * 4 + (card.hpBonus ?? 0) * 3;
  const host = combatUnitValue(parent, candidate.unitId);
  return persistentStats + Math.min(4, host.value / 5);
}

/** Compare a dual-mode card's immediate Command value with its persistent Pilot value. */
export const iter23CommandVsPilot: CandidateStrategy = {
  name: "iter-23-command-vs-pilot",
  selectCandidates(parent) {
    const ordered = [...iter20CommandImpact.selectCandidates(parent)];
    const commands = ordered.filter((candidate) => candidate.family === "playCommand");
    const pilots = ordered
      .filter((candidate) => candidate.family === "playCommandAsPilot")
      .map((candidate, index) => ({
        candidate,
        index,
        score: commandPilotUtility(parent, candidate),
      }))
      .sort((a, b) => b.score - a.score || a.index - b.index);
    if (pilots.length === 0) return ordered;

    const pilotSet = new Set<GundamBotCandidate>(pilots.map(({ candidate }) => candidate));
    let ranked = ordered.filter((candidate) => !pilotSet.has(candidate));
    const firstPilotIndex = ordered.findIndex(
      (candidate) => candidate.family === "playCommandAsPilot",
    );
    ranked.splice(firstPilotIndex, 0, ...pilots.map(({ candidate }) => candidate));
    if (commands.length === 0) return ranked;

    const bestCommand = commands[0]!;
    const bestPilot = pilots[0]!;
    if (commandUtility(parent, bestCommand) <= bestPilot.score + 4) return ranked;

    ranked = ranked.filter((candidate) => candidate !== bestCommand);
    const firstDualModeIndex = ranked.findIndex(
      (candidate) => candidate.family === "playCommandAsPilot",
    );
    ranked.splice(firstDualModeIndex, 0, bestCommand);
    return ranked;
  },
};

const TEMPO_COMMAND_ACTIONS = new Set<EffectAction["action"]>([
  "deploy",
  "deployFromTrash",
  "deploySelf",
  "deployToken",
  "destroy",
  "exile",
  "placeInTrash",
  "returnToDeck",
  "returnToHand",
]);

function directivesCreateTempo(directives: readonly Directive[]): boolean {
  return directives.some((directive) => {
    if ("action" in directive) return TEMPO_COMMAND_ACTIONS.has(directive.action.action);
    if ("options" in directive) {
      return directive.options.some((option) => directivesCreateTempo(option.directives));
    }
    return (
      directivesCreateTempo(directive.thenDirectives) ||
      (directive.elseDirectives ? directivesCreateTempo(directive.elseDirectives) : false)
    );
  });
}

function commandCreatesTempo(parent: StrategyParent, cardId: string): boolean {
  const card = findDefinition(parent, cardId);
  return (
    card?.type === "command" &&
    ((card as CommandCard).effects ?? [])
      .filter((effect) => effect.type === "command")
      .some((effect) => directivesCreateTempo(effect.directives))
  );
}

/** Defer attrition/setup Commands, while preserving removal and board-creating tempo Commands. */
export const iter24TempoAwareCommand: CandidateStrategy = {
  name: "iter-24-tempo-aware-command",
  selectCandidates(parent) {
    const ordered = [...iter20CommandImpact.selectCandidates(parent)];
    const commands = ordered.filter((candidate) => candidate.family === "playCommand");
    const hasDevelopment = ordered.some(
      (candidate) => candidate.family === "deployUnit" || candidate.family === "deployBase",
    );
    if (!hasDevelopment || commands.length === 0) return ordered;

    const immediate: typeof commands = [];
    const deferred: typeof commands = [];
    for (const command of commands) {
      if (commandCreatesTempo(parent, command.cardId) || commandUtility(parent, command) >= 20)
        immediate.push(command);
      else deferred.push(command);
    }
    if (deferred.length === 0) return ordered;

    const commandSet = new Set<GundamBotCandidate>(commands);
    const ranked = ordered.filter((candidate) => !commandSet.has(candidate));
    const firstDevelopment = ranked.findIndex(
      (candidate) => candidate.family === "deployUnit" || candidate.family === "deployBase",
    );
    ranked.splice(firstDevelopment, 0, ...immediate);
    const lastDevelopment = ranked.findLastIndex(
      (candidate) => candidate.family === "deployUnit" || candidate.family === "deployBase",
    );
    ranked.splice(lastDevelopment + 1, 0, ...deferred);
    return ranked;
  },
};

export {
  aggressiveShieldBlock,
  boardPreservingBlock,
  combatOutcome,
  combatUnitValue,
  conservativeBlock,
  lastShieldBlock,
  rankImpactfulCommands,
};
