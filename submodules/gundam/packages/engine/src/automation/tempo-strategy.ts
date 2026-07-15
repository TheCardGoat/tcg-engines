/**
 * Tempo-aware strategy. Three policy overrides on top of the canonical
 * defaults:
 *
 *   - **`chooseFirstPlayer`**: hand first turn to the OPPONENT. Going
 *     second in Gundam gives the receiving player an EX Resource at
 *     setup and a full draw step on turn 1, which is a structural
 *     advantage the default "pick own seat" policy gives up. Bench:
 *     +10pp on `ef-starter` mirror, +4pp on `gd01-mixed` mirror.
 *
 *   - **`declareBlock`**: filter the legal-candidate list down to units
 *     that can actually intercept the current attack. Specifically:
 *       1. The unit must have the `<Blocker>` keyword (rule 13-1-4).
 *       2. The unit cannot be the attack target itself (rule 8-3-3).
 *       3. When the attacker has `<High-Maneuver>` (rule 13-1-6), emit
 *          no blockers at all — every candidate would be rejected.
 *
 *     The keyword check goes through `derived-state.hasKeyword`, the
 *     same helper `declareBlock.validate` uses, so blockers that gain
 *     `<Blocker>` from continuous effects, paired pilots, or runtime
 *     grants are still treated as legal. Reading only the printed
 *     `definition.keywordEffects` would silently drop them.
 *
 *     The enumerator is optimistic and emits any unit on the battlefield
 *     as a block candidate; the engine then rejects illegal ones with
 *     `MISSING_BLOCKER_KEYWORD` / `CANNOT_BLOCK_DIRECT` errors. Bench
 *     baseline showed 19/35 declareBlock attempts failing this way,
 *     which burns the planner's per-action attempt budget and forces
 *     pass-fallbacks. Filtering up front recovers those attempts.
 *
 *   - **Pending-choice short-circuit** (wrapping `selectCandidates`):
 *     when the engine has a `pendingChoice` open, drop every family the
 *     inner strategy emitted EXCEPT `resolveEffect`. The inner strategy
 *     still runs first so `defaultResolveEffect` ranks `chooseOne` /
 *     `optional` candidates by directive intent — we only filter the
 *     output, never bypass the ranking. Aggressive families submitted
 *     under a pending effect reject with `EFFECT_PENDING` and push the
 *     planner toward concede; holding back is strictly better.
 *
 * Designed to compose cleanly with the existing strategy library —
 * tests should run this against `greedyLegalStrategy` and
 * `valueRankedStrategy` to confirm the deltas hold.
 */

import { hasKeyword } from "../gundam/rules/derived-state.ts";
import type { GundamG } from "../gundam/types.ts";
import type { CardReadAPI } from "../types/move-types.ts";

import type { CandidateStrategy, CandidateStrategyContext } from "./types.ts";
import { composeStrategy, type FamilyPolicy } from "./shared-policies.ts";

interface PendingCombatLike {
  readonly attackerId: string;
  readonly target: string;
}

function getPendingCombat(ctx: CandidateStrategyContext): PendingCombatLike | null {
  const g = ctx.state.G as { turnMetadata?: { pendingCombat?: PendingCombatLike } };
  return g.turnMetadata?.pendingCombat ?? null;
}

/**
 * Effective-keyword check that aligns with `declareBlock.validate`. Uses
 * the engine's `derived-state.hasKeyword` so cards that gain `<Blocker>`
 * or `<High-Maneuver>` from continuous effects, paired pilots, or other
 * runtime grants are counted, not just printed-text grants.
 */
function hasEffectiveKeyword(
  cards: CardReadAPI,
  state: CandidateStrategyContext["state"],
  cardId: string,
  keyword: "Blocker" | "HighManeuver",
): boolean {
  return hasKeyword(cardId, keyword, state.G as unknown as GundamG, cards);
}

const goSecond: FamilyPolicy<"chooseFirstPlayer"> = (ctx) => {
  const ownId = ctx.parent.playerId as unknown as string;
  const opponent = ctx.candidates.find((c) => c.playerId !== ownId);
  if (opponent) return [opponent];
  return ctx.candidates;
};

const filterBlockers: FamilyPolicy<"declareBlock"> = (ctx) => {
  // Per-call O(1) lookups: read combat + attacker keyword once, then
  // filter blocker candidates without re-walking the view zones.
  const combat = getPendingCombat(ctx.parent);
  if (combat) {
    if (
      hasEffectiveKeyword(ctx.parent.cards, ctx.parent.state, combat.attackerId, "HighManeuver")
    ) {
      return [];
    }
  }
  return ctx.candidates.filter((c) => {
    if (!hasEffectiveKeyword(ctx.parent.cards, ctx.parent.state, c.blockerId, "Blocker")) {
      return false;
    }
    if (combat && c.blockerId === combat.target) return false;
    return true;
  });
};

const inner = composeStrategy("tempo", {
  chooseFirstPlayer: goSecond,
  declareBlock: filterBlockers,
});

/**
 * Tempo-aware strategy. See module doc for the policy breakdown and the
 * bench data behind each lever.
 */
export const tempoStrategy: CandidateStrategy = {
  name: "tempo",
  selectCandidates(parent) {
    // Run the inner strategy first so `defaultResolveEffect` ranks
    // resolveEffect candidates by directive intent (option-pick for
    // `chooseOne`, accept-for-beneficial for `optional`). Then, if a
    // pending choice is open, drop non-resolveEffect families from the
    // OUTPUT — bypassing the ranking would forfeit the choice quality.
    const ranked = inner.selectCandidates(parent);
    if (parent.pendingChoice) {
      return ranked.filter((c) => c.family === "resolveEffect");
    }
    return ranked;
  },
};
