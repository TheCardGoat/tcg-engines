import { produceWithPatches } from "immer";
import { emitEvent, emitLog, recordCapabilityIssue } from "../shared.ts";
import type { ApplyCommandResult, EngineCommand, MatchState } from "../types.ts";

export function hasPendingNonJudgePrompt(state: MatchState): boolean {
  return state.promptQueue.some((prompt) => prompt.status === "pending" && prompt.seat !== "judge");
}

export function createInvariantFailureResult(
  state: MatchState,
  command: EngineCommand,
  reason: string,
): ApplyCommandResult {
  const previousEventCount = state.eventHistory.length;
  const previousLogCount = state.logHistory.length;
  const previousCapabilityCount = state.capabilityHistory.length;
  const [nextState, patches, inversePatches] = produceWithPatches(state, (draft) => {
    draft.commandHistory.push(command);
    recordCapabilityIssue(draft, {
      kind: "invariantViolation",
      code: "validation:state",
      actor: command.seat,
      sourceCardId: null,
      sourceInstanceId: null,
      eventId: null,
      details: reason,
    });
    emitEvent(draft, "commandRejected", command.seat, {
      visibility: command.seat === "judge" ? "judge" : "public",
      data: {
        commandType: command.type,
        reason,
      },
    });
    emitLog(draft, command.seat, reason, {
      visibility: command.seat === "judge" ? "judge" : "public",
      judgeMessage: reason,
    });
  });

  return {
    state: nextState,
    accepted: false,
    reason,
    events: nextState.eventHistory.slice(previousEventCount),
    logs: nextState.logHistory.slice(previousLogCount),
    patches,
    inversePatches,
    capabilityIssues: nextState.capabilityHistory.slice(previousCapabilityCount),
  };
}
