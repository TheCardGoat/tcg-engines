import type { FabMatchState } from "../state.ts";
import type { FabDecision } from "../rules/process.ts";

/** Publish a durable FAB decision through the kernel-owned state boundary. */
export function publishFabDecision<State extends FabMatchState>(
  state: State,
  decision: FabDecision,
): FabDecision {
  const activeProcessId = state.rulesProcess?.processId;
  if (!activeProcessId || decision.continuation.processId !== activeProcessId) {
    throw new Error(
      `Cannot publish FAB decision ${decision.decisionId} for process ${decision.continuation.processId}; active process is ${activeProcessId ?? "none"}.`,
    );
  }
  if (state.decision && state.decision !== decision) {
    throw new Error(
      `Cannot replace outstanding FAB decision ${state.decision.decisionId} with ${decision.decisionId}.`,
    );
  }
  state.decision = decision;
  return decision;
}

/** Clear a resolved or cancelled durable decision through the kernel boundary. */
export function clearFabDecision<State extends FabMatchState>(state: State): void {
  state.decision = null;
}
