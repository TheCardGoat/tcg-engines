import type { FabMatchState } from "../../state.ts";
import type { ProposedEvent } from "../../rules/events.ts";
import type { FabRulesProcedure, FabRulesProcess } from "../../rules/process.ts";
import { executeFabEventTransaction } from "../../kernel/transaction/index.ts";
import { type FabEventTransactionOptions } from "../../kernel/process-runner/index.ts";
import type { FabEndTurnResult } from "./types.ts";

export function commitStep(
  state: FabMatchState,
  options: FabEventTransactionOptions,
  events: readonly ProposedEvent[],
): void {
  const result = executeFabEventTransaction(state, () => events, options);
  Object.assign(state, result.state);
}

export function process(
  processId: `process-${number}`,
  procedure: FabRulesProcedure,
): FabRulesProcess {
  return {
    processId,
    stage: "procedure",
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
    procedure,
  };
}

export function failure(state: FabMatchState, error: string, errorCode: string): FabEndTurnResult {
  return { accepted: false, state, error, errorCode };
}
