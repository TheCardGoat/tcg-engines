import type { FabMoveName } from "../../moves.ts";
import {
  FAB_DEFAULT_AUTOMATION_PREFERENCES,
  type FabOptionalTriggerAutomationMode,
} from "../../state.ts";
import { isForcedEntityTargetDecision } from "../decision-automation.ts";
import type { FabRulesSnapshot } from "../../kernel/transaction-kernel.ts";
import { eligibleOptionalTriggerSources } from "../optional-trigger-automation.ts";
import { optionalTriggerAutomationDecisionContext } from "../../commands/optional-trigger-automation-decision.ts";
import {
  FAB_ARM_PRIORITY_HOLD_LABEL,
  FAB_AUTOMATION_PREFERENCE_LABELS,
  FAB_PRIORITY_MODES,
  FAB_PRIORITY_MODE_ACTION_LABEL,
  shortId,
  type FabLegalCommand,
} from "./shared.ts";

/** Instantiates optional-trigger automation commands (active decision or catalog). */
export function instantiateSetOptionalTriggerAutomationLegalCommands(context: {
  readonly state: FabRulesSnapshot;
  readonly actorId: string;
  readonly push: (command: FabLegalCommand) => void;
}): void {
  const { state, actorId, push } = context;
  const move: FabMoveName = "set-optional-trigger-automation";
  const activeDecision = optionalTriggerAutomationDecisionContext(state, actorId);
  if (activeDecision) {
    const name = activeDecision.decision.source?.canonicalId ?? activeDecision.sourceInstanceId;
    for (const mode of ["auto-accept", "auto-decline"] as const) {
      push({
        move,
        payload: {
          instanceId: activeDecision.sourceInstanceId,
          mode,
          decision: {
            decisionId: activeDecision.decision.decisionId,
            stateVersion: activeDecision.decision.stateVersion,
          },
        },
        sourceInstanceId: activeDecision.sourceInstanceId,
        automation: "player-only",
        label:
          mode === "auto-accept"
            ? `Always use optional effects from ${name}`
            : `Always decline optional effects from ${name}`,
      });
    }
    return;
  }
  const byInstance = new Map(
    eligibleOptionalTriggerSources(state, actorId).map((source) => [
      source.source.instanceId,
      source.source.current.names.join(" // ") || shortId(source.source.instanceId),
    ]),
  );
  for (const [instanceId, name] of byInstance) {
    const storedMode = state.optionalTriggerAutomation[actorId]?.[instanceId];
    const currentMode: FabOptionalTriggerAutomationMode = storedMode ?? "ask";
    for (const mode of ["ask", "auto-accept", "auto-decline"] as const) {
      if (mode === currentMode) continue;
      push({
        move,
        payload: { instanceId, mode },
        sourceInstanceId: instanceId,
        automation: "player-only",
        label:
          mode === "auto-accept"
            ? `Always use optional effects from ${name}`
            : mode === "auto-decline"
              ? `Always decline optional effects from ${name}`
              : `Ask about optional effects from ${name}`,
      });
    }
  }
}

/** Instantiates the per-seat automation-preference patch commands. */
export function instantiateSetAutomationPreferencesLegalCommands(context: {
  readonly state: FabRulesSnapshot;
  readonly actorId: string;
  readonly push: (command: FabLegalCommand) => void;
}): void {
  const { state, actorId, push } = context;
  const move: FabMoveName = "set-automation-preferences";
  const profile = state.automationPreferences[actorId] ?? FAB_DEFAULT_AUTOMATION_PREFERENCES;
  const decision = state.decision;
  if (decision) {
    const continuation = decision.continuation;
    if (
      decision.actorId === actorId &&
      profile.autoOrderTriggers !== true &&
      (continuation.kind === "trigger-order" || continuation.kind === "trigger-first-player")
    ) {
      push({
        move,
        payload: { autoOrderTriggers: true },
        automation: "player-only",
        label: FAB_AUTOMATION_PREFERENCE_LABELS.autoOrderTriggersOn,
      });
    }
    if (
      decision.actorId === actorId &&
      profile.autoSelectSingletonTargets !== true &&
      isForcedEntityTargetDecision(decision)
    ) {
      push({
        move,
        payload: { autoSelectSingletonTargets: true },
        automation: "player-only",
        label: FAB_AUTOMATION_PREFERENCE_LABELS.autoSelectSingletonTargetsOn,
      });
    }
    return;
  }
  // One entry per target mode (excluding the seat's current mode) so the
  // 3-state control can submit an explicit target instead of a toggle.
  for (const mode of FAB_PRIORITY_MODES) {
    if (mode === profile.priorityMode) continue;
    push({
      move,
      payload: { priorityMode: mode },
      automation: "player-only",
      label: FAB_PRIORITY_MODE_ACTION_LABEL[mode],
    });
  }
  // The trigger-order auto-answer toggle, on and off.
  push({
    move,
    payload: { autoOrderTriggers: !profile.autoOrderTriggers },
    automation: "player-only",
    label: profile.autoOrderTriggers
      ? FAB_AUTOMATION_PREFERENCE_LABELS.autoOrderTriggersOff
      : FAB_AUTOMATION_PREFERENCE_LABELS.autoOrderTriggersOn,
  });
  // Forced entity-target auto-select, on and off.
  push({
    move,
    payload: { autoSelectSingletonTargets: !profile.autoSelectSingletonTargets },
    automation: "player-only",
    label: profile.autoSelectSingletonTargets
      ? FAB_AUTOMATION_PREFERENCE_LABELS.autoSelectSingletonTargetsOff
      : FAB_AUTOMATION_PREFERENCE_LABELS.autoSelectSingletonTargetsOn,
  });
  // Saved opponent yields are individually removable from any legal
  // priority window, even when that card is not currently on top.
  for (const canonicalId of profile.opponentTriggerYieldCardIds) {
    push({
      move,
      payload: { removeOpponentTriggerYieldCardId: canonicalId },
      automation: "player-only",
      label: FAB_AUTOMATION_PREFERENCE_LABELS.opponentYieldRemove,
    });
  }
  // Contextual per-card toggles, emitted exactly where discovery
  // matters: the just-played card's own follow-up window, and the
  // opponent's triggered layer currently on top of the stack.
  const origin = state.priority?.origin;
  if (origin?.kind === "own-action") {
    const playedCanonicalId = state.objects[origin.sourceInstanceId]?.canonicalId;
    if (playedCanonicalId != null) {
      const excepted = profile.playAndSkipHoldCardIds.includes(playedCanonicalId);
      push({
        move,
        payload: excepted
          ? { removePlayAndSkipHoldCardId: playedCanonicalId }
          : { addPlayAndSkipHoldCardId: playedCanonicalId },
        automation: "player-only",
        label: excepted
          ? FAB_AUTOMATION_PREFERENCE_LABELS.playAndSkipHoldRemove
          : FAB_AUTOMATION_PREFERENCE_LABELS.playAndSkipHoldAdd,
      });
    }
  }
  const topLayer = state.rulesStack.at(-1);
  if (
    topLayer?.kind === "triggered" &&
    topLayer.controllerId !== actorId &&
    topLayer.source.canonicalId != null
  ) {
    const yielded = profile.opponentTriggerYieldCardIds.includes(topLayer.source.canonicalId);
    if (!yielded) {
      push({
        move,
        payload: { addOpponentTriggerYieldCardId: topLayer.source.canonicalId },
        automation: "player-only",
        sourceInstanceId: topLayer.source.instanceId,
        label: FAB_AUTOMATION_PREFERENCE_LABELS.opponentYieldAdd,
      });
    }
  }
}

/** Instantiates the one-shot "play and hold" arm command. */
export function instantiateArmPriorityHoldLegalCommands(context: {
  readonly push: (command: FabLegalCommand) => void;
}): void {
  const { push } = context;
  const move: FabMoveName = "arm-priority-hold";
  push({
    move,
    payload: {},
    automation: "player-only",
    label: FAB_ARM_PRIORITY_HOLD_LABEL,
  });
}
