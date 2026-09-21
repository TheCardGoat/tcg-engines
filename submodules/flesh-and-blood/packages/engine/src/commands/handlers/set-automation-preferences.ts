import type { FabCommandFor } from "../command-router.ts";
import type { FabCommandHandlerContext, FabCommandHandlerResult } from "../handler-context.ts";
import {
  FAB_DEFAULT_AUTOMATION_PREFERENCES,
  withoutFabScopedAutoPassForSeat,
  type FabAutomationPreferences,
} from "../../state.ts";

import { fabScopedAutoPassArmable } from "../../rules/automation-verdict.ts";
import { isDecisionAutomationAutoEnable } from "../trigger-order-automation-preference.ts";

/**
 * Per-seat automation-preference patch. Unlike trigger automation there is no
 * your-turn restriction: defenders need to retune their seat during the
 * opponent's combat, so any priority holder may act. The patch is additive —
 * mode, autoOrder toggle, and one per-card list add/remove per command — so
 * replayed or stale clients never clobber lists they have not loaded.
 *
 * The scoped auto-pass patch (arm/disarm) is the one exception to the
 * priority-holder gate: a seat whose windows are engine-drained under an
 * armed scope has no priority moment to disarm from, and a defender arms
 * from the defense declaration, which is not a priority window. Scope
 * patches must therefore be submitted alone and are accepted whenever no
 * rules decision is pending.
 */
export function handleSetAutomationPreferences(
  context: FabCommandHandlerContext,
  actorId: string,
  command: FabCommandFor<"set-automation-preferences">,
): FabCommandHandlerResult {
  const state = context.state;
  const patch = command.preferences;
  const isScopeOnlyPatch =
    (patch.armScopedAutoPass !== undefined || patch.disarmScopedAutoPass === true) &&
    patch.priorityMode === undefined &&
    patch.autoOrderTriggers === undefined &&
    patch.autoSelectSingletonTargets === undefined &&
    patch.addPlayAndSkipHoldCardId === undefined &&
    patch.removePlayAndSkipHoldCardId === undefined &&
    patch.addOpponentTriggerYieldCardId === undefined &&
    patch.removeOpponentTriggerYieldCardId === undefined &&
    patch.addInstantYieldCardId === undefined &&
    patch.removeInstantYieldCardId === undefined;
  const enablingCurrentDecisionAutomation = isDecisionAutomationAutoEnable(state, actorId, patch);
  if (state.decision && !enablingCurrentDecisionAutomation) {
    return {
      accepted: false,
      error: "Complete the current rules decision before changing priority automation.",
      errorCode: "decision_pending",
    };
  }
  if (
    !isScopeOnlyPatch &&
    !enablingCurrentDecisionAutomation &&
    state.priority?.holderPlayerId !== actorId
  ) {
    return {
      accepted: false,
      error: "Priority automation can be changed only while you hold priority.",
      errorCode: "priority_automation_timing",
    };
  }
  if (
    patch.armScopedAutoPass !== undefined &&
    !fabScopedAutoPassArmable(state, actorId, patch.armScopedAutoPass)
  ) {
    return {
      accepted: false,
      error: "Auto-pass can be scoped to an open combat chain or to the opponent's turn only.",
      errorCode: "scoped_auto_pass_timing",
    };
  }

  const current = state.automationPreferences[actorId] ?? FAB_DEFAULT_AUTOMATION_PREFERENCES;
  const withListChanges = (ids: readonly string[], add?: string, remove?: string) => [
    ...ids.filter((id) => id !== remove),
    ...(add && !ids.includes(add) ? [add] : []),
  ];
  const nextProfile: FabAutomationPreferences = {
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
    scopedAutoPass:
      patch.armScopedAutoPass ??
      (patch.disarmScopedAutoPass === true ? null : current.scopedAutoPass),
  };
  state.automationPreferences = { ...state.automationPreferences, [actorId]: nextProfile };
  // A mode change retunes the whole seat; a stale one-shot hold or a stale
  // scope from the previous mode must not outlive it.
  if (patch.priorityMode !== undefined && patch.priorityMode !== current.priorityMode) {
    if (state.priorityHoldArmed[actorId]) {
      const { [actorId]: _cleared, ...remainingArms } = state.priorityHoldArmed;
      state.priorityHoldArmed = remainingArms;
    }
    if (nextProfile.scopedAutoPass !== null) {
      state.automationPreferences = withoutFabScopedAutoPassForSeat(
        state.automationPreferences,
        actorId,
      );
    }
  }
  // Arming a scope retunes the seat's windows; an armed one-shot hold would
  // silently outrank it, so arming consumes the hold instead of confusing it.
  if (patch.armScopedAutoPass !== undefined && state.priorityHoldArmed[actorId]) {
    const { [actorId]: _clearedHold, ...remainingArms } = state.priorityHoldArmed;
    state.priorityHoldArmed = remainingArms;
  }
  return { accepted: true, move: command.move, actorId, state, outcome: { kind: "applied" } };
}
