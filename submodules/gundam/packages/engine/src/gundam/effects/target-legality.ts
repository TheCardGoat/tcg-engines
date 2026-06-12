/**
 * Target-legality shared primitives.
 *
 * Three call sites evaluate "which IDs can the player legally pick for
 * this effect's target filter":
 *
 *   1. `play-command.ts:validateEffectTargets` — multi-filter check at
 *      play time; iterates every action in the effect, including the
 *      branches of conditional / chooseOne directives.
 *   2. `play-card-shared.ts:validateDeployTriggerTargets` — multi-filter
 *      check at play time for a card's own deploy triggers; only the
 *      top-level effect directives, with optional-directive handling.
 *   3. `pending-effects.ts:evaluateLegalTargets` — single-prompt check at
 *      resolve time; returns the candidate set for the next halting
 *      target-selection directive (priority head).
 *
 * The three differ on iteration shape (multi-filter vs single-prompt)
 * and condition handling, so a single canonical helper would either
 * have a complex options bag or distort one of the call sites. The
 * stable shared piece is the small set of structural primitives — count
 * bounds, candidate gathering, filter extraction. Extracting *those*
 * gives us one source of truth without forcing the three semantically
 * distinct flows through the same shape.
 *
 * If the three flows ever converge (e.g. all moves move to single-prompt
 * resolution with no play-time pre-commit), the higher-level helpers
 * can be added here and the call sites collapsed.
 */

import type { EffectAction, TargetFilter } from "@tcg/gundam-types";
import type { buildTargetResolutionContext } from "../rules/derived-state.ts";

/**
 * Decode a TargetFilter's `count` into inclusive {min, max} integers.
 *
 *   - `undefined` / `"all"` → unbounded (`[0, +∞]`). Filters with these
 *      counts apply to every match; no min/max pick check is needed.
 *   - `number n` → exact (`[n, n]`).
 *   - `{ min, max }` → inclusive range.
 */
export function getFilterCountBounds(filter: TargetFilter): { min: number; max: number } {
  const c = filter.count;
  if (c === undefined) return { min: 0, max: Number.POSITIVE_INFINITY };
  if (c === "all") return { min: 0, max: Number.POSITIVE_INFINITY };
  if (typeof c === "number") return { min: c, max: c };
  return { min: c.min, max: c.max };
}

/**
 * Collect every card the target DSL might evaluate against. Mirrors
 * `executor.gatherAllCards` — kept in one place so play-time and
 * resolve-time evaluations never disagree about which zone is in scope.
 *
 * The DSL itself filters by zone via the filter's `zone` field; this
 * helper just supplies the candidate universe.
 */
export function gatherAllCardsForTargeting(
  tgtCtx: ReturnType<typeof buildTargetResolutionContext>,
): ReturnType<ReturnType<typeof buildTargetResolutionContext>["getCardsInZone"]> {
  const zones = [
    "battleArea",
    "baseSection",
    "hand",
    "trash",
    "shieldArea",
    "resourceArea",
  ] as const;
  const playerIds = [tgtCtx.sourcePlayerId as string, tgtCtx.opponentPlayerId as string];
  type CardLike = ReturnType<typeof tgtCtx.getCardsInZone>[number];
  const cards: CardLike[] = [];
  for (const playerId of playerIds) {
    for (const zone of zones) {
      cards.push(...tgtCtx.getCardsInZone(playerId as typeof tgtCtx.sourcePlayerId, zone));
    }
  }
  return cards;
}

/**
 * Return every required-choice TargetFilter carried by an EffectAction.
 *
 * Rule 10-1-8-1-1 keys off "target that cannot be chosen", so we evaluate
 * legality against every filter the player is *required* to pick from at
 * play time. "May"-style filters are intentionally excluded — the action
 * is legal to play even when the optional pool is empty:
 *   - `lookAtTopDeck.tutorFilter` (player *may* reveal a match)
 *   - `chooseAttackTarget.attackTarget` — granted unit *may* choose this
 *     target later, at attack time; not a play-time requirement
 *
 * `chooseAttackTarget.unit` IS gated: the card text "Choose 1 friendly
 * (Clan) Unit" is a hard play-time choice, distinct from the unit's later
 * "may choose ... as its attack target".
 *
 * `forceAttackTarget.attackTarget` is also gated: the chosen Unit is the
 * play-time target that enemy Units must attack later.
 */
export function extractActionFilters(action: EffectAction): TargetFilter[] {
  const filters: TargetFilter[] = [];
  const a = action as { target?: unknown; unit?: unknown };
  if (a.target !== undefined) filters.push(a.target as TargetFilter);
  if (action.action === "chooseAttackTarget" && a.unit !== undefined) {
    filters.push(a.unit as TargetFilter);
  }
  if (action.action === "copyKeywordEffects") {
    filters.push(action.source);
  }
  if (action.action === "createDelayedTrigger" && action.eventSourceFilter !== undefined) {
    filters.push(action.eventSourceFilter);
  }
  if (action.action === "forceAttackTarget") {
    filters.push(action.attackTarget);
  }
  return filters;
}
