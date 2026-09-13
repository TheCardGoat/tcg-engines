import type { FabMatchState } from "../state.ts";
import { currentFabState, prepareFabStateWithResult } from "../copy-on-write.ts";
import type {
  FabCommittedEventBatch,
  FabProposedEventGroup,
  ProposedEvent,
} from "../rules/events.ts";
import type { FabPlayCardProcedure, FabRulesProcess } from "../rules/process.ts";
import type { FabPlayerLogFact } from "../player-log.ts";
import {
  commitFabKernelBatchDraft,
  type FabCommitOptions,
  type FabRulesSnapshot,
} from "./commit.ts";
import { publishFabKernelReceipt } from "./transaction-kernel.ts";

export type FabEventJournalResult =
  | {
      readonly committed: true;
      readonly state: FabMatchState;
      readonly batches: readonly FabCommittedEventBatch[];
      readonly playerLogFacts: readonly FabPlayerLogFact[];
    }
  | {
      readonly committed: false;
      readonly state: FabMatchState;
      readonly failedEventGroupId: string;
    };

export function appendFabEventGroup(
  process: FabRulesProcess,
  events: readonly ProposedEvent[],
  required = true,
): FabProposedEventGroup {
  if (!process.procedure)
    throw new Error(`FAB process ${process.processId} has no procedure journal.`);
  for (const event of events) {
    if (event.processId !== process.processId) {
      throw new Error(
        `FAB journal event ${event.name} belongs to ${event.processId}, expected ${process.processId}.`,
      );
    }
  }
  const group: FabProposedEventGroup = {
    eventGroupId: `${process.processId}:group-${process.procedure.eventGroups.length + 1}`,
    required,
    events: [...events],
  };
  process.procedure.eventGroups.push(group);
  return group;
}

/**
 * Reduces every atomic group on an isolated snapshot. The caller publishes
 * the returned state only after the full enclosing procedure succeeds.
 */
export function reduceFabEventJournal(
  state: FabRulesSnapshot,
  groups: readonly FabProposedEventGroup[],
  options: FabCommitOptions = {},
): FabEventJournalResult {
  const prepared = prepareFabStateWithResult(currentFabState(state), (draft) => {
    const batches: FabCommittedEventBatch[] = [];
    const playerLogFacts: FabPlayerLogFact[] = [];
    for (const group of groups) {
      const committed = commitFabKernelBatchDraft(draft, group.events, options);
      if (group.required && !committed.batch) {
        return {
          committed: false as const,
          failedEventGroupId: group.eventGroupId,
          batches,
        };
      }
      if (committed.batch) batches.push(committed.batch);
      playerLogFacts.push(...committed.playerLogFacts);
    }
    return { committed: true as const, batches, playerLogFacts };
  });
  if (!prepared.result.committed) {
    return {
      committed: false,
      state: state as FabMatchState,
      failedEventGroupId: prepared.result.failedEventGroupId,
    };
  }
  publishFabKernelReceipt(
    options,
    prepared.result.batches.flatMap((batch) => batch.events),
    prepared.result.playerLogFacts,
  );
  return {
    committed: true,
    state: prepared.state,
    batches: prepared.result.batches,
    playerLogFacts: prepared.result.playerLogFacts,
  };
}

export function createPlayProcedure(
  input: Omit<
    FabPlayCardProcedure,
    "eventGroups" | "chosenX" | "effectCostTargetIds" | "costBindings"
  > &
    Partial<Pick<FabPlayCardProcedure, "chosenX" | "effectCostTargetIds" | "costBindings">>,
): FabPlayCardProcedure {
  return {
    ...input,
    chosenX: input.chosenX ?? null,
    effectCostTargetIds: [...(input.effectCostTargetIds ?? [])],
    costBindings: input.costBindings ?? {},
    eventGroups: [],
  };
}
