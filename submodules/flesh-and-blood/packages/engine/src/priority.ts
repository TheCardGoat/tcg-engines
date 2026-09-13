import type { FabCombatStep, FabMatchState } from "./state.ts";

export type FabPriorityWindowKind = "action" | "layer" | "combat";

/**
 * Marks the only window the `play-and-skip` mode may close: the follow-up
 * granted immediately after the holder's own play/activate/attack-declare.
 * `sourceInstanceId` names the card (or attack source object) whose play
 * opened the window, so per-card own-skip exceptions can match it.
 * Unstamped (undefined) windows — responses, rules-driven step windows, turn
 * windows — are never force-skipped.
 */
export interface FabOwnActionOrigin {
  readonly kind: "own-action";
  readonly sourceInstanceId: string;
}

export type FabPriorityWindowOrigin = FabOwnActionOrigin;

/** Persisted owner of a single CR 1.11 priority window. */
export interface FabPriorityWindow {
  readonly kind: FabPriorityWindowKind;
  readonly holderPlayerId: string;
  readonly combatStep: FabCombatStep | null;
  readonly consecutivePasses: number;
  /** See {@link FabPriorityWindowOrigin}; absent on every response window. */
  readonly origin?: FabPriorityWindowOrigin;
}

export function openFabPriority(
  state: FabMatchState,
  holderPlayerId: string,
  kind: FabPriorityWindowKind,
  combatStep: FabCombatStep | null = state.combat?.step ?? null,
  origin?: FabPriorityWindowOrigin,
): void {
  if (!state.players[holderPlayerId]) {
    throw new Error(`Cannot give FAB priority to unknown player ${holderPlayerId}.`);
  }
  state.priority = { kind, holderPlayerId, combatStep, consecutivePasses: 0, origin };
}

export function closeFabPriority(state: FabMatchState): void {
  state.priority = null;
}

export function passFabPriority(state: FabMatchState, nextPlayerId: string): number {
  const current = state.priority;
  if (!current) throw new Error("Cannot pass FAB priority when no priority window is open.");
  const consecutivePasses = current.consecutivePasses + 1;
  // The receiving seat's window is a response window: origin must never leak
  // across the hand-off or `play-and-skip` would skip the opponent's window.
  state.priority = {
    ...current,
    holderPlayerId: nextPlayerId,
    consecutivePasses,
    origin: undefined,
  };
  return consecutivePasses;
}

export function priorityPasses(state: Readonly<FabMatchState>): number {
  return state.priority?.consecutivePasses ?? 0;
}

export function resetFabPriorityPasses(state: FabMatchState): void {
  const current = state.priority;
  if (!current) {
    throw new Error("Cannot reset FAB priority passes when no priority window is open.");
  }
  state.priority = { ...current, consecutivePasses: 0 };
}

export function openFabPriorityForCurrentContext(
  state: FabMatchState,
  holderPlayerId: string,
  origin?: FabPriorityWindowOrigin,
): void {
  const combat = state.combat;
  if (
    combat?.open &&
    (combat.step === "close" || (combat.step === "defend" && combat.defenseDeclarationPending))
  ) {
    closeFabPriority(state);
    return;
  }
  if (state.rulesStack.length > 0) {
    openFabPriority(state, holderPlayerId, "layer", combat?.step ?? null, origin);
  } else if (combat?.open) {
    openFabPriority(state, holderPlayerId, "combat", combat.step, origin);
  } else {
    openFabPriority(state, holderPlayerId, "action", null, origin);
  }
}
