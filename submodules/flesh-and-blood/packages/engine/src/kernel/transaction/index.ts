import type { FabMatchState } from "../../state.ts";
import type { FabPlayerLogFact } from "../../player-log.ts";
import type {
  CommittedEvent,
  FabCommittedEventBatch,
  FabProcessId,
  FabProposedEventGroup,
  ProposedEvent,
} from "../../rules/events.ts";
import type {
  FabEventTransactionOptions,
  FabEventTransactionResult,
  FabEventJournalTransactionResult,
} from "../process-runner/types.ts";
import { mutateInPlace } from "../../copy-on-write.ts";
import { reconcileContinuousEffectsToQuiescence } from "../continuous-reconcile.ts";
import { advanceFabRulesProcessToBoundary } from "../process-runner/boundary.ts";
import { advanceTriggerDeclarations } from "../trigger-declaration.ts";
import { reanchorFabBindingsThroughCommittedMoves } from "../../rules/binding-reanchor.ts";
import { executeTransactionWorkGroup } from "./work-group.ts";
import { transitionFabRulesProcessStage } from "../process-state.ts";
import type { FabRulesProcessStage } from "../../rules/process.ts";
import { publishFabKernelReceipt } from "../transaction-kernel.ts";

export {
  suspendForReplacementOrdering,
  suspendForReplacementConsequenceTarget,
} from "./replacement-prompts.ts";
export { commitAdministrativeEvent } from "./administrative.ts";
export {
  commitPersistedReplacementCost,
  commitPersistedReclashMove,
} from "./persisted-replacement-commit.ts";
export { collectAndPersistEventTriggers } from "./trigger-persistence.ts";
export { uniqueTriggerSources } from "./trigger-persistence.ts";

export function executeFabEventTransaction(
  state: FabMatchState,
  propose: (processId: FabProcessId) => readonly ProposedEvent[],
  options: FabEventTransactionOptions,
): FabEventTransactionResult {
  const deferredProcess =
    options.deferTriggerDeclaration && state.rulesProcess?.stage === "trigger-collection"
      ? state.rulesProcess
      : null;
  const resolvingProcess =
    state.rulesProcess?.stage === "layer-resolution" ? state.rulesProcess : null;
  const procedureProcess = state.rulesProcess?.stage === "procedure" ? state.rulesProcess : null;
  const existingProcess = deferredProcess ?? resolvingProcess ?? procedureProcess;
  const processNumber = existingProcess ? state.counters.process : state.counters.process + 1;
  const processId: FabProcessId = existingProcess?.processId ?? `process-${processNumber}`;
  const events = [...propose(processId)];
  for (const event of events) {
    if (event.processId !== processId) {
      throw new Error(
        `FAB proposed event ${event.name} belongs to ${event.processId}, expected ${processId}.`,
      );
    }
  }
  const boundaryState = mutateInPlace(state, (draft) => {
    if (!existingProcess) {
      draft.counters.process = processNumber;
      draft.rulesProcess = {
        processId,
        stage: "replacement-collection",
        pendingEvents: events,
        futureSubjectEvents: [],
        replacementCandidates: [],
        replacementChoiceResolved: false,
        replacementChoicePlayerIds: [],
        selectedOptionalReplacementIds: [],
        orderedReplacementIds: [],
        appliedReplacementIds: [],
        cancelledContinuousApplicationKeys: [],
        pendingTriggers: [],
        orderedTriggerIds: [],
        triggerPlayerOrder: [],
        orderedTriggerControllers: [],
        stateTriggersOnStack: [],
        resolvingLayerId: null,
        effectChoices: {},
        effectPartitions: {},
        effectOptions: {},
        effectTargets: {},
        iterationCount: 0,
        journalReplacementOrders: {},
        journalReplacementChoices: {},
        journalReplacementChoicePlayerIds: {},
        resolutionEventGroups: [],
        procedure: null,
      };
    } else {
      draft.rulesProcess?.pendingEvents.push(...events);
    }
  });

  return commitInitializedFabEventTransaction(boundaryState, options, !!deferredProcess);
}

/** Resume the exact persisted event proposal after one controller orders their replacements. */

export function commitInitializedFabEventTransaction(
  boundaryState: FabMatchState,
  options: FabEventTransactionOptions,
  deferredProcess: boolean,
): FabEventTransactionResult {
  const boundaryProcess = boundaryState.rulesProcess;
  if (!boundaryProcess)
    throw new Error("FAB rules process was not initialized before event commit.");
  const events = [...boundaryProcess.pendingEvents];

  const work = executeTransactionWorkGroup(
    boundaryState,
    {
      events,
      continuation: (processId, controllerId, replacementKind) => ({
        kind: "replacement-order",
        processId,
        controllerId,
        replacementKind,
      }),
    },
    options,
  );
  if (work.kind === "replacement-ordering") return { state: work.state, batch: null };
  if (work.kind === "required-cancelled") {
    throw new Error("FAB direct transaction work cannot be required-cancelled.");
  }
  const committed =
    work.kind === "committed"
      ? { state: work.state, batch: work.batch }
      : { state: work.state, batch: null };
  if (!committed.batch) {
    if (!deferredProcess) {
      const process = committed.state.rulesProcess;
      if (process?.procedure && process.procedure.stage !== "complete") {
        transitionFabRulesProcessStage(process, "procedure");
        options.advanceProcedure?.(committed.state);
      } else if (process) {
        transitionFabRulesProcessStage(process, "trigger-collection");
        const reconciliation = reconcileContinuousEffectsToQuiescence(
          committed.state,
          process.processId,
          options,
        );
        if (reconciliation.suspended) return committed;
        const postScanStage: FabRulesProcessStage =
          process.pendingTriggers.length > 0 ? "layer-declaration" : "state-trigger-scan";
        transitionFabRulesProcessStage(process, postScanStage);
        if (postScanStage === "layer-declaration")
          advanceTriggerDeclarations(committed.state, options);
        advanceFabRulesProcessToBoundary(committed.state, options);
      }
    }
    return committed;
  }

  const process = committed.state.rulesProcess;
  if (!process)
    throw new Error(
      `FAB rules process ${boundaryProcess.processId} disappeared during event commit.`,
    );
  if (committed.state.gameEnded) {
    committed.state.rulesProcess = null;
    committed.state.decision = null;
    return committed;
  }
  transitionFabRulesProcessStage(process, "trigger-collection");
  const reconciliation = reconcileContinuousEffectsToQuiescence(
    committed.state,
    process.processId,
    options,
  );
  if (reconciliation.suspended) return committed;
  if (deferredProcess || options.deferTriggerDeclaration) {
    transitionFabRulesProcessStage(process, "trigger-collection");
    return committed;
  }
  transitionFabRulesProcessStage(
    process,
    process.pendingTriggers.length > 0 ? "layer-declaration" : "settled",
  );
  if (process.stage === "settled") {
    if (process.procedure && process.procedure.stage !== "complete") {
      transitionFabRulesProcessStage(process, "state-trigger-scan");
    } else {
      committed.state.rulesProcess = null;
    }
  } else advanceTriggerDeclarations(committed.state, options);
  advanceFabRulesProcessToBoundary(committed.state, options);
  return committed;
}

/** Atomically publishes a reversible procedure journal, then reaches the trigger checkpoint. */
export function executeFabEventJournalTransaction(
  state: FabMatchState,
  groups: readonly FabProposedEventGroup[],
  options: FabEventTransactionOptions,
): FabEventJournalTransactionResult {
  const original = state;
  let working = state;
  const batches: FabCommittedEventBatch[] = [];
  // Earlier groups in a reversible journal may commit internally, then a later
  // group suspends and the caller rolls back to `original`. Receipts from those
  // discarded groups must not leak; publish only after the whole journal settles.
  const unpublishedReceipts: {
    readonly events: readonly CommittedEvent[];
    readonly playerLogFacts: readonly FabPlayerLogFact[];
  }[] = [];
  const journalOptions: FabEventTransactionOptions = {
    ...options,
    onCommittedEvents: () => {},
    onPlayerLogFacts: () => {},
    onCommittedReceipt: (receipt) => unpublishedReceipts.push(receipt),
  };
  const publishJournalReceipts = (): void => {
    const ordered = unpublishedReceipts
      .map((receipt, index) => ({
        receipt,
        index,
        firstEventSequence:
          receipt.events.length > 0
            ? Number(receipt.events[0]!.eventId.replace("event-", ""))
            : Number.POSITIVE_INFINITY,
      }))
      .sort(
        (left, right) =>
          left.firstEventSequence - right.firstEventSequence || left.index - right.index,
      );
    publishFabKernelReceipt(
      options,
      ordered.flatMap(({ receipt }) => receipt.events),
      ordered.flatMap(({ receipt }) => receipt.playerLogFacts),
    );
  };

  for (const [groupIndex, group] of groups.entries()) {
    const process = working.rulesProcess;
    if (!process) throw new Error("FAB procedure journal has no persisted rules process.");
    const result = executeTransactionWorkGroup(
      working,
      {
        events: group.events,
        eventGroupId: group.eventGroupId,
        required: group.required,
        rollbackState: original,
        continuation: (processId, controllerId, replacementKind) => ({
          kind: "journal-replacement-order",
          processId,
          eventGroupId: group.eventGroupId,
          controllerId,
          replacementKind,
          ...(process.sequencePrefixContinuation?.eventGroupId === group.eventGroupId
            ? { sequencePrefix: process.sequencePrefixContinuation }
            : {}),
        }),
      },
      journalOptions,
    );
    if (result.kind === "replacement-ordering") {
      return { committed: false, state: result.state, suspendedForReplacementOrder: true };
    }
    if (result.kind === "required-cancelled") {
      return { committed: false, state: result.state, failedEventGroupId: result.eventGroupId };
    }
    working = result.state;
    if (result.kind === "no-commit") continue;
    batches.push(...result.batches);
    const committedGroupEvents = result.batches.flatMap((batch) => batch.events);
    const liveProcess = working.rulesProcess;
    if (liveProcess && committedGroupEvents.length > 0) {
      liveProcess.pendingTriggers = liveProcess.pendingTriggers.map((pending) => ({
        ...pending,
        bindings: reanchorFabBindingsThroughCommittedMoves(
          working,
          pending.bindings,
          committedGroupEvents,
        ),
      }));
    }
    const reconciliation = reconcileContinuousEffectsToQuiescence(
      working,
      process.processId,
      journalOptions,
      true,
      groupIndex + 1,
    );
    batches.push(...reconciliation.batches.map((entry) => entry.batch));
    if (reconciliation.suspended) {
      return working.decision?.continuation.kind === "continuous-replacement-order"
        ? { committed: false, state: working, suspendedForReplacementOrder: true }
        : { committed: false, state: working, suspendedForContinuousOrder: true };
    }
  }

  const process = working.rulesProcess;
  if (!process) throw new Error("FAB procedure journal process disappeared before publication.");
  process.pendingEvents = [];
  if (process.procedure && process.resolutionEventGroups.length === 0) {
    process.procedure.stage = "complete";
  }
  if (options.deferTriggerDeclaration) {
    transitionFabRulesProcessStage(process, "trigger-collection");
    publishJournalReceipts();
    return { committed: true, state: working, batches };
  }
  transitionFabRulesProcessStage(
    process,
    process.pendingTriggers.length > 0 ? "layer-declaration" : "state-trigger-scan",
  );
  if (process.stage === "layer-declaration") advanceTriggerDeclarations(working, journalOptions);
  advanceFabRulesProcessToBoundary(working, journalOptions);
  publishJournalReceipts();
  return { committed: true, state: working, batches };
}
