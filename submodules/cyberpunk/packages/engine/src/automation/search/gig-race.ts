import type { FilteredCardView, FilteredMatchView } from "../../view/filter.ts";
import { canAttackRivalThisTurn, hasCardRule, isReadyBlocker } from "../util/attack-readiness.ts";

/** CR 1.11.1: use the actual empty-Fixer starts, never turn number or seat order. */
export function isLateGigRace(view: FilteredMatchView): boolean {
  return view.overtimeActive || view.turnBeganWithEmptyFixer;
}

function field(view: FilteredMatchView, playerId: string): FilteredCardView[] {
  const cards = view.players[playerId]?.zones.field;
  return Array.isArray(cards) ? cards : [];
}

/**
 * Public-board estimate, not a guaranteed outcome. Each ready BLOCKER can deny
 * one direct attack even if it loses the fight. Reserve those blocks for the
 * largest steals; unblockable attacks bypass them. Future attackers ready and
 * lose Lag, but we do not assume a hidden Program will enable a conditional Unit.
 * The engine search resolves actual combat, triggers, and card restrictions.
 */
function potentialSteals(
  view: FilteredMatchView,
  attackerId: string,
  defenderId: string,
  nextTurn: boolean,
): number {
  const programPlayed =
    !nextTurn && view.playedCardTypesThisTurn[attackerId]?.includes("program") === true;
  const pending =
    !nextTurn && view.activePlayerId === attackerId && view.attackState?.kind === "direct"
      ? view.attackState
      : null;
  let unblockable = 0;
  const blockable: number[] = [];
  for (const card of field(view, attackerId)) {
    const inAttack = pending?.attackerId === card.instanceId;
    const ready = nextTurn ? { ...card, spent: false, hasLag: false } : card;
    if (!inAttack && !canAttackRivalThisTurn(ready, programPlayed)) continue;
    const power = Math.max(0, card.effectivePower);
    const amount =
      power === 0
        ? 0
        : Math.max(
            0,
            1 + Math.floor(power / 10) - (hasCardRule(card, "stealsOneFewerGig") ? 1 : 0),
          );
    if (hasCardRule(card, "cantBeBlocked") || (inAttack && pending?.step === "steal"))
      unblockable += amount;
    else blockable.push(amount);
  }
  const blockers = field(view, defenderId).filter(isReadyBlocker).length;
  blockable.sort((a, b) => b - a);
  return Math.min(
    view.players[defenderId]?.gigCount ?? 0,
    unblockable + blockable.slice(blockers).reduce((sum, amount) => sum + amount, 0),
  );
}

function majorityValue(gigs: number): number {
  // The standard pool has twelve dice. CR 1.10–1.11 require seven, not Street Cred.
  return gigs >= 7 ? 100_000 : gigs < 6 ? -100_000 : 0;
}

/**
 * Value the next win check from the current actor's side, then change sign for
 * the receiving player. Keep forecasts below an engine-confirmed terminal win.
 * On the first empty-Fixer turn a lead must survive the rival's whole turn.
 * On the second it only needs to survive the remaining reactions: passing at
 * seven wins before the rival readies (CR 1.11.2). Overtime steals win at once.
 */
export function evaluateLateGigRace(
  view: FilteredMatchView,
  playerId: string,
  endingTurn = false,
): number {
  if (!isLateGigRace(view)) return 0;
  const actorId = view.activePlayerId;
  const rivalId = Object.keys(view.players).find((id) => id !== actorId);
  if (!rivalId) return 0;
  const gigs = view.players[actorId]?.gigCount ?? 0;
  let score: number;
  if (!view.overtimeActive && !view.previousTurnBeganWithEmptyFixer) {
    const incoming = potentialSteals(view, rivalId, actorId, true);
    const protectedGigs = Math.max(0, gigs - incoming);
    // Equal buffers prefer removing a threat over leaving more opposing material.
    score = majorityValue(protectedGigs) + (protectedGigs - 6) * 8_000;
  } else {
    const remaining = endingTurn ? 0 : potentialSteals(view, actorId, rivalId, false);
    const reachableGigs = gigs + remaining;
    score = (gigs - 6) * 4_000 + remaining * 2_000;
    if (gigs >= 7) score += 200_000;
    else if (reachableGigs >= 7) score += 30_000;
    else if (reachableGigs < 6) score -= 100_000;
    else if (potentialSteals(view, rivalId, actorId, true) > 0) score -= 40_000;
  }
  return actorId === playerId ? score : -score;
}
