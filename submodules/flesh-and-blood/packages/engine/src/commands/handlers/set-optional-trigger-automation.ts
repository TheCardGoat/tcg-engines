import type { FabCommandFor } from "../command-router.ts";
import type { FabCommandHandlerContext, FabCommandHandlerResult } from "../handler-context.ts";
import { eligibleOptionalTriggerSources } from "../../rules/optional-trigger-automation.ts";
import { isActiveOptionalTriggerAutomationCommand } from "../optional-trigger-automation-decision.ts";
import { submitFabDecision } from "../../procedures/decisions/index.ts";

export function handleSetOptionalTriggerAutomation(
  context: FabCommandHandlerContext,
  actorId: string,
  command: FabCommandFor<"set-optional-trigger-automation">,
): FabCommandHandlerResult {
  const state = context.state;
  if (state.decision) {
    if (!isActiveOptionalTriggerAutomationCommand(state, actorId, command)) {
      return {
        accepted: false,
        error: "This trigger automation command does not match the active optional effect.",
        errorCode: "stale_decision",
      };
    }
    if (command.mode !== "auto-accept" && command.mode !== "auto-decline") {
      return {
        accepted: false,
        error: "An active optional effect can only be always used or always declined.",
        errorCode: "invalid_trigger_automation_mode",
      };
    }
    const ownerPreferences = { ...state.optionalTriggerAutomation[actorId] };
    ownerPreferences[command.instanceId] = command.mode;
    state.optionalTriggerAutomation = {
      ...state.optionalTriggerAutomation,
      [actorId]: ownerPreferences,
    };
    const decision = state.decision;
    const result = submitFabDecision(
      state,
      actorId,
      {
        decisionId: decision.decisionId,
        stateVersion: decision.stateVersion,
        answer: { kind: "boolean", value: command.mode === "auto-accept" },
      },
      context.transactionOptions(),
    );
    if (!result.accepted) return result;
    return {
      accepted: true,
      move: command.move,
      actorId,
      state: context.state,
      outcome: result.outcome,
    };
  }
  if (command.decision) {
    return {
      accepted: false,
      error: "The optional-effect decision is no longer current.",
      errorCode: "stale_decision",
    };
  }
  const eligible = eligibleOptionalTriggerSources(state, actorId).some(
    (source) => source.source.instanceId === command.instanceId,
  );
  if (!eligible) {
    return {
      accepted: false,
      error: "Only the owner may automate their own in-play optional triggers.",
      errorCode: "ineligible_trigger_automation_source",
    };
  }
  if (state.activePlayerId !== actorId || state.priority?.holderPlayerId !== actorId) {
    return {
      accepted: false,
      error: "Trigger automation can be changed only on your turn while you have priority.",
      errorCode: "trigger_automation_timing",
    };
  }

  const ownerPreferences = { ...state.optionalTriggerAutomation[actorId] };
  if (command.mode === "auto-accept" || command.mode === "auto-decline") {
    ownerPreferences[command.instanceId] = command.mode;
  } else delete ownerPreferences[command.instanceId];
  state.optionalTriggerAutomation = {
    ...state.optionalTriggerAutomation,
    [actorId]: ownerPreferences,
  };
  return { accepted: true, move: command.move, actorId, state, outcome: { kind: "applied" } };
}
