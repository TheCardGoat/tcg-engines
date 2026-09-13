import type { FabCommandFor } from "../command-router.ts";
import type { FabCommandHandlerContext, FabCommandHandlerResult } from "../handler-context.ts";
import { FAB_DEFAULT_AUTOMATION_PREFERENCES } from "../../state.ts";
import { isDecisionAutomationAutoEnable } from "../trigger-order-automation-preference.ts";

/**
 * Per-seat automation-preference patch. Unlike trigger automation there is no
 * your-turn restriction: defenders need to retune their seat during the
 * opponent's combat, so any priority holder may act. The patch is additive —
 * mode, autoOrder toggle, and one per-card list add/remove per command — so
 * replayed or stale clients never clobber lists they have not loaded.
 */
export function handleSetAutomationPreferences(
  context: FabCommandHandlerContext,
  actorId: string,
  command: FabCommandFor<"set-automation-preferences">,
): FabCommandHandlerResult {
  const state = context.state;
  const patch = command.preferences;
  const enablingCurrentDecisionAutomation = isDecisionAutomationAutoEnable(state, actorId, patch);
  if (state.decision && !enablingCurrentDecisionAutomation) {
    return {
      accepted: false,
      error: "Complete the current rules decision before changing priority automation.",
      errorCode: "decision_pending",
    };
  }
  if (!enablingCurrentDecisionAutomation && state.priority?.holderPlayerId !== actorId) {
    return {
      accepted: false,
      error: "Priority automation can be changed only while you hold priority.",
      errorCode: "priority_automation_timing",
    };
  }

  const current = state.automationPreferences[actorId] ?? FAB_DEFAULT_AUTOMATION_PREFERENCES;
  const withListChanges = (ids: readonly string[], add?: string, remove?: string) => [
    ...ids.filter((id) => id !== remove),
    ...(add && !ids.includes(add) ? [add] : []),
  ];
  state.automationPreferences = {
    ...state.automationPreferences,
    [actorId]: {
      priorityMode: patch.priorityMode ?? current.priorityMode,
      autoOrderTriggers:
        patch.priorityMode === "auto-pass"
          ? true
          : patch.priorityMode === "always-hold"
            ? false
            : (patch.autoOrderTriggers ?? current.autoOrderTriggers),
      autoSelectSingletonTargets:
        patch.autoSelectSingletonTargets ?? current.autoSelectSingletonTargets,
      playAndSkipHoldCardIds: withListChanges(
        current.playAndSkipHoldCardIds,
        patch.addPlayAndSkipHoldCardId,
        patch.removePlayAndSkipHoldCardId,
      ),
      opponentTriggerYieldCardIds: withListChanges(
        current.opponentTriggerYieldCardIds,
        patch.addOpponentTriggerYieldCardId,
        patch.removeOpponentTriggerYieldCardId,
      ),
      instantYieldCardIds: withListChanges(
        current.instantYieldCardIds,
        patch.addInstantYieldCardId,
        patch.removeInstantYieldCardId,
      ),
    },
  };
  // A mode change retunes the whole seat; a stale one-shot hold from the
  // previous mode must not outlive it.
  if (patch.priorityMode !== undefined && patch.priorityMode !== current.priorityMode) {
    if (state.priorityHoldArmed[actorId]) {
      const { [actorId]: _cleared, ...remainingArms } = state.priorityHoldArmed;
      state.priorityHoldArmed = remainingArms;
    }
  }
  return { accepted: true, move: command.move, actorId, state, outcome: { kind: "applied" } };
}
