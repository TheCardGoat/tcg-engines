import type { FabRulesSnapshot } from "../kernel/transaction-kernel.ts";
import type { FabCommand } from "../moves.ts";
import type { FabCommandFor } from "./command-router.ts";
import { isActiveOptionalTriggerAutomationCommand } from "./optional-trigger-automation-decision.ts";
import { isForcedEntityTargetDecision } from "../rules/decision-automation.ts";

type AutomationPreferencePatch = FabCommandFor<"set-automation-preferences">["preferences"];

const AUTOMATION_PREFERENCE_PATCH_KEYS = [
  "priorityMode",
  "autoOrderTriggers",
  "autoSelectSingletonTargets",
  "addPlayAndSkipHoldCardId",
  "removePlayAndSkipHoldCardId",
  "addOpponentTriggerYieldCardId",
  "removeOpponentTriggerYieldCardId",
  "addInstantYieldCardId",
  "removeInstantYieldCardId",
] as const satisfies readonly (keyof AutomationPreferencePatch)[];

function preferencePatchOnly(
  preferences: AutomationPreferencePatch,
  key: "autoOrderTriggers" | "autoSelectSingletonTargets",
  value: true,
): boolean {
  if (preferences[key] !== value) return false;
  return AUTOMATION_PREFERENCE_PATCH_KEYS.every(
    (candidate) => candidate === key || preferences[candidate] === undefined,
  );
}

export function isTriggerOrderDecisionActor(state: FabRulesSnapshot, actorId: string): boolean {
  const decision = state.decision;
  return (
    decision?.actorId === actorId &&
    (decision.continuation.kind === "trigger-order" ||
      decision.continuation.kind === "trigger-first-player")
  );
}

export function isForcedTargetDecisionActor(state: FabRulesSnapshot, actorId: string): boolean {
  const decision = state.decision;
  return Boolean(
    decision && decision.actorId === actorId && isForcedEntityTargetDecision(decision),
  );
}

/** Only this narrow preference change may interrupt an active rules decision. */
export function isTriggerOrderAutoEnable(
  state: FabRulesSnapshot,
  actorId: string,
  preferences: AutomationPreferencePatch,
): boolean {
  return (
    isTriggerOrderDecisionActor(state, actorId) &&
    preferencePatchOnly(preferences, "autoOrderTriggers", true)
  );
}

/** Enable singleton-target auto-select from the forced entity-target prompt. */
export function isForcedTargetAutoEnable(
  state: FabRulesSnapshot,
  actorId: string,
  preferences: AutomationPreferencePatch,
): boolean {
  return (
    isForcedTargetDecisionActor(state, actorId) &&
    preferencePatchOnly(preferences, "autoSelectSingletonTargets", true)
  );
}

export function isDecisionAutomationAutoEnable(
  state: FabRulesSnapshot,
  actorId: string,
  preferences: AutomationPreferencePatch,
): boolean {
  return (
    isTriggerOrderAutoEnable(state, actorId, preferences) ||
    isForcedTargetAutoEnable(state, actorId, preferences)
  );
}

export function isDecisionCompatibleCommand(
  state: FabRulesSnapshot,
  actorId: string,
  command: FabCommand,
): boolean {
  return (
    command.move === "answer-decision" ||
    command.move === "concede" ||
    (command.move === "set-optional-trigger-automation" &&
      isActiveOptionalTriggerAutomationCommand(state, actorId, command)) ||
    (command.move === "set-automation-preferences" &&
      isDecisionAutomationAutoEnable(state, actorId, command.preferences))
  );
}
