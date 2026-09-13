import type { FabMatchState } from "../../state.ts";
import type { FabRulesProcess } from "../../rules/process.ts";
import type { FabProcessId } from "../../rules/events.ts";
import type { FabRulesStackLayer } from "../../rules/layers.ts";
import type { FabLayerResolutionResult } from "../../rules/decision-dispatch/result.ts";
import type { FabEventTransactionOptions } from "../../kernel/process-runner/index.ts";
import { mutateInPlace } from "../../copy-on-write.ts";
import { startFabRulesProcess } from "../../kernel/process-state.ts";

export type AdvanceLayerResolution = (
  state: FabMatchState,
  layer: FabRulesStackLayer,
  options: FabEventTransactionOptions,
) => FabLayerResolutionResult;

export function resolutionProcess(
  processId: FabProcessId,
  layerId: string,
  procedure: FabRulesProcess["procedure"],
): FabRulesProcess {
  return {
    processId,
    stage: "layer-resolution",
    pendingEvents: [],
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
    resolvingLayerId: layerId,
    effectChoices: {},
    effectPartitions: {},
    effectOptions: {},
    effectTargets: {},
    effectPaymentAmounts: {},
    iterationCount: 0,
    journalReplacementOrders: {},
    journalReplacementChoices: {},
    journalReplacementChoicePlayerIds: {},
    resolutionEventGroups: [],
    procedure,
  };
}

export function failure(
  state: FabMatchState,
  error: string,
  errorCode: string,
): FabLayerResolutionResult {
  return { accepted: false, state, error, errorCode };
}

/** Start a layer-resolution process without advancing it. */
export function startLayerResolutionProcess(
  current: FabMatchState,
  layerId: string,
): FabMatchState {
  return mutateInPlace(current, (draft) => {
    draft.stateID += 1;
    draft.counters.process += 1;
    const processId: FabProcessId = `process-${draft.counters.process}`;
    const previousProcessId = draft.rulesProcess?.processId;
    startFabRulesProcess(
      draft,
      resolutionProcess(processId, layerId, draft.rulesProcess?.procedure ?? null),
      previousProcessId ? { replaceProcessId: previousProcessId } : undefined,
    );
  });
}
