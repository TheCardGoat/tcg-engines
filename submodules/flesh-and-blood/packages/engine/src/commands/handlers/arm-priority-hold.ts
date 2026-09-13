import type { FabCommandFor } from "../command-router.ts";
import type { FabCommandHandlerContext, FabCommandHandlerResult } from "../handler-context.ts";

/**
 * One-shot "play and hold" arm (combo turns). The arming seat holds its own
 * follow-up windows until it commits any pass — manual or automatic — so it
 * can chain its own plays exactly like the verbal "I play this and hold".
 *
 * Gates mirror `set-priority-automation` (no pending decision; any priority
 * holder may arm, including defenders retuning for the opponent's combat).
 * Arming is idempotent; only a pass commit or a mode change clears the arm.
 */
export function handleArmPriorityHold(
  context: FabCommandHandlerContext,
  actorId: string,
  _command: FabCommandFor<"arm-priority-hold">,
): FabCommandHandlerResult {
  const state = context.state;
  if (state.decision) {
    return {
      accepted: false,
      error: "Complete the current rules decision before arming a priority hold.",
      errorCode: "decision_pending",
    };
  }
  if (state.priority?.holderPlayerId !== actorId) {
    return {
      accepted: false,
      error: "A priority hold can be armed only while you hold priority.",
      errorCode: "priority_hold_timing",
    };
  }

  state.priorityHoldArmed = { ...state.priorityHoldArmed, [actorId]: true };
  return {
    accepted: true,
    move: "arm-priority-hold",
    actorId,
    state,
    outcome: { kind: "applied" },
  };
}
