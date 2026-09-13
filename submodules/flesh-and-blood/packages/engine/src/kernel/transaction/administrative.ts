import type { FabMatchState } from "../../state.ts";
import type { FabCommittedEventBatch, ProposedEvent } from "../../rules/events.ts";
import type { FabEventTransactionOptions } from "../process-runner/types.ts";
import { commitFabKernelBatch } from "../commit.ts";
import { appendFabFutureSubjectEvents } from "../../rules/process.ts";

export function commitAdministrativeEvent(
  state: FabMatchState,
  event: ProposedEvent,
  options: FabEventTransactionOptions,
): FabCommittedEventBatch | null {
  const process = state.rulesProcess;
  if (!process || process.processId !== event.processId) {
    throw new Error(`FAB administrative event ${event.name} has no matching persisted process.`);
  }
  const committed = commitFabKernelBatch(state, [event], {
    ...options,
  });
  if (!committed.batch) return null;
  Object.assign(state, committed.state);
  state.rulesProcess = process;
  appendFabFutureSubjectEvents(process, committed.batch.events);
  return committed.batch;
}
