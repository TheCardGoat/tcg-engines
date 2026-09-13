import type { FabCombatStep } from "./combat.ts";
import type { FabMatchState } from "../state.ts";
import type { FabDecision } from "../rules/process.ts";

/** Public priority window for {@link FabWaitState} `priority`. */
export type FabWaitWindow = "action" | "stack" | "combat";

/**
 * Player-visible wait: what the match is waiting on right now.
 *
 * Shared by hosts, the test harness, and bots so none of them re-derive
 * “pass until Defend” from stack length + combat.step folklore.
 *
 * Internal procedure stages are not represented. After a command returns the
 * runtime must sit on one of these variants.
 */
export type FabWaitState =
  | {
      readonly kind: "game-over";
      readonly winnerId: string | null;
      readonly endReason: string | null;
    }
  | { readonly kind: "decision"; readonly decision: FabDecision }
  | { readonly kind: "defense-declaration"; readonly defenderId: string }
  | {
      readonly kind: "priority";
      readonly playerId: string;
      readonly window: FabWaitWindow;
      readonly combatStep?: FabCombatStep;
    }
  | {
      readonly kind: "resolving";
      readonly combatStep?: FabCombatStep;
    };

/** Pure query over authoritative match state. Never mutates. */
export function readFabWaitState(state: FabMatchState): FabWaitState {
  if (state.gameEnded) {
    return { kind: "game-over", winnerId: state.winnerId, endReason: state.endReason };
  }
  if (state.decision) {
    return { kind: "decision", decision: state.decision };
  }
  const combat = state.combat;
  if (
    combat?.open &&
    combat.step === "defend" &&
    combat.defenseDeclarationPending &&
    combat.activeLink
  ) {
    return {
      kind: "defense-declaration",
      defenderId: combat.activeLink.defendingPlayerId,
    };
  }
  const priorityHolderId = state.priority?.holderPlayerId ?? null;
  if (priorityHolderId) {
    const window: FabWaitWindow =
      state.rulesStack.length > 0 ? "stack" : combat?.open ? "combat" : "action";
    return {
      kind: "priority",
      playerId: priorityHolderId,
      window,
      ...(combat?.open ? { combatStep: combat.step } : {}),
    };
  }
  if (combat?.open) {
    return {
      kind: "resolving",
      ...(combat.step ? { combatStep: combat.step } : {}),
    };
  }
  return { kind: "resolving" };
}
