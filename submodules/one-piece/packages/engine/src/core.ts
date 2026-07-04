import { enablePatches, produceWithPatches } from "immer";
import { emitEvent, emitLog } from "./shared.ts";
import type {
  ApplyCommandResult,
  EngineCommand,
  MatchConfig,
  MatchState,
  ReplayResult,
} from "./types.ts";
import { validateState } from "./validation.ts";
import { applyQueuedCommandMutation } from "./engine/commands.ts";
import { createMatch } from "./engine/match.ts";
import { drainResolutionQueue } from "./engine/queue.ts";
import { createInvariantFailureResult } from "./engine/shared.ts";

enablePatches();

export { createMatch } from "./engine/match.ts";
export { getLegalCommands } from "./engine/legal.ts";

export function applyCommand(state: MatchState, command: EngineCommand): ApplyCommandResult {
  const previousEventCount = state.eventHistory.length;
  const previousLogCount = state.logHistory.length;
  const previousCapabilityCount = state.capabilityHistory.length;
  let accepted = false;
  let reason: string | null = null;

  const [nextState, patches, inversePatches] = produceWithPatches(state, (draft) => {
    draft.commandHistory.push(command);
    const result = applyQueuedCommandMutation(draft, command);
    accepted = result.accepted;
    reason = result.reason;

    if (accepted) {
      drainResolutionQueue(draft);
      emitEvent(draft, "commandAccepted", command.seat, {
        visibility: command.seat === "judge" ? "judge" : "public",
        data: {
          commandType: command.type,
        },
      });
    } else {
      emitEvent(draft, "commandRejected", command.seat, {
        visibility: command.seat === "judge" ? "judge" : "public",
        data: {
          commandType: command.type,
          reason: reason ?? "Command rejected.",
        },
      });
      emitLog(draft, command.seat, reason ?? "Command rejected.", {
        visibility: command.seat === "judge" ? "judge" : "public",
        judgeMessage: reason ?? "Command rejected.",
      });
    }
  });

  const validationErrors = validateState(nextState);
  if (validationErrors.length > 0) {
    return createInvariantFailureResult(
      state,
      command,
      `Engine invariant violation: ${validationErrors.join(" | ")}`,
    );
  }

  return {
    state: nextState,
    accepted,
    reason,
    events: nextState.eventHistory.slice(previousEventCount),
    logs: nextState.logHistory.slice(previousLogCount),
    patches,
    inversePatches,
    capabilityIssues: nextState.capabilityHistory.slice(previousCapabilityCount),
  };
}

export function replayMatch(config: MatchConfig, commands: EngineCommand[]): ReplayResult {
  let state = createMatch(config);
  const results: ApplyCommandResult[] = [];

  for (const command of commands) {
    const result = applyCommand(state, command);
    state = result.state;
    results.push(result);
  }

  return {
    state,
    results,
  };
}
