import type { FabMatchState } from "../state.ts";
import type { FabRulesProcess, FabRulesProcessStage } from "../rules/process.ts";

/**
 * The declared FAB rules-process stage machine. Every stage transition in the
 * engine must flow through {@link transitionFabRulesProcessStage}; this table
 * is the executable definition of which hand-offs are legal.
 *
 * The machine is interleaved, not linear: a `layer-resolution` process passes
 * through `event-commit` and `trigger-collection` while a triggered layer
 * declares and resolves, then returns to `layer-resolution`. Stage-local state
 * (replacement-prompt bookkeeping) is reset at the single post-commit site in
 * `transaction/work-group.ts`, not by the stage itself.
 */
const FAB_PROCESS_STAGE_EDGES: Readonly<
  Record<FabRulesProcessStage, readonly FabRulesProcessStage[]>
> = {
  // A procedure legitimately re-enters its own stage across successive
  // journal proposals; its internal sub-stages are a separate machine.
  procedure: ["procedure", "event-commit", "trigger-collection", "layer-resolution"],
  "replacement-collection": ["event-commit"],
  "replacement-ordering": [
    "event-commit",
    "procedure",
    "replacement-ordering",
    "trigger-collection",
  ],
  "continuous-ordering": ["trigger-collection", "replacement-ordering", "continuous-ordering"],
  // Journals collect their triggers during the work-group commit itself, so
  // the post-journal boundary moves straight out of event-commit.
  "event-commit": [
    "replacement-ordering",
    "trigger-collection",
    "layer-declaration",
    "state-trigger-scan",
    "layer-resolution",
    "procedure",
    "event-commit",
    "continuous-ordering",
  ],
  "trigger-collection": [
    "layer-declaration",
    "state-trigger-scan",
    "settled",
    "continuous-ordering",
    "trigger-collection",
    // A deferred process may re-enter commit or hand back into layer work;
    // a suspended reconciliation re-opens replacement ordering mid-collection.
    "layer-resolution",
    "replacement-ordering",
    "event-commit",
  ],
  "state-trigger-scan": [
    "procedure",
    "layer-declaration",
    "trigger-collection",
    "state-trigger-scan",
  ],
  "simultaneous-player-selection": ["layer-declaration", "trigger-ordering"],
  "trigger-ordering": ["layer-declaration"],
  "layer-declaration": [
    "simultaneous-player-selection",
    "trigger-ordering",
    "state-trigger-scan",
    "layer-declaration",
  ],
  "layer-resolution": ["event-commit", "trigger-collection", "layer-resolution"],
  settled: ["state-trigger-scan"],
};

/** Move a persisted rules process to its next stage, asserting the hand-off is legal. */
export function transitionFabRulesProcessStage(
  process: FabRulesProcess,
  nextStage: FabRulesProcessStage,
): void {
  if (!FAB_PROCESS_STAGE_EDGES[process.stage].includes(nextStage)) {
    throw new Error(
      `FAB rules process ${process.processId} cannot move from stage ${process.stage} to ${nextStage}.`,
    );
  }
  // The single auditable write behind the readonly field.
  (process as { stage: FabRulesProcessStage }).stage = nextStage;
}

/** Publish the durable process that owns the next FAB rules transaction. */
export function startFabRulesProcess<State extends FabMatchState>(
  state: State,
  process: FabRulesProcess,
  options: { readonly replaceProcessId?: string } = {},
): FabRulesProcess {
  const active = state.rulesProcess;
  if (active && active !== process) {
    if (active.processId === process.processId) {
      throw new Error(`FAB rules process ${process.processId} is already active as another graph.`);
    }
    if (options.replaceProcessId !== active.processId) {
      throw new Error(
        `Cannot replace active FAB rules process ${active.processId} with ${process.processId}.`,
      );
    }
  }
  state.rulesProcess = process;
  return process;
}

/** Clear the durable process only after its terminal boundary is reached. */
export function finishFabRulesProcess<State extends FabMatchState>(
  state: State,
  processId?: string,
): void {
  if (processId && state.rulesProcess?.processId !== processId) {
    throw new Error(`FAB rules process ${processId} is no longer active.`);
  }
  if (state.decision) {
    throw new Error(
      `Cannot finish FAB rules process ${state.rulesProcess?.processId ?? processId ?? "unknown"} while decision ${state.decision.decisionId} is outstanding.`,
    );
  }
  state.rulesProcess = null;
}
