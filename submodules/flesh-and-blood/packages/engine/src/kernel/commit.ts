import type { FabStateDraft } from "../copy-on-write.ts";
import type { FabMatchState } from "../state.ts";
import { reduceFabGameEvent } from "./event-reducer.ts";
import type { FabCommittedEventBatch, ProposedEvent } from "../rules/events.ts";
import type { FabPlayerLogFact } from "../player-log.ts";
import {
  commitProposedEventBatch,
  commitProposedEventBatchDraft,
  type FabCancelledProposedEvent,
  type FabCommitOptions,
  type FabCommitResult,
  type FabRulesSnapshot,
} from "./transaction-kernel.ts";

/**
 * Sole production entrypoint for committing FAB proposed events.
 *
 * The transaction kernel remains responsible for atomic drafts, replacement
 * application, event IDs, and bounded rule facts. This facade owns the
 * concrete FAB reducer binding so procedures, runtime orchestration, and
 * reconciliation never select or invoke a reducer themselves.
 */
export function commitFabKernelBatch(
  state: FabRulesSnapshot,
  events: readonly ProposedEvent[],
  options: FabCommitOptions = {},
): FabCommitResult {
  return commitProposedEventBatch(state, events, reduceFabGameEvent, options);
}

/** Same commit contract for an already-open outer transaction draft. */
export function commitFabKernelBatchDraft(
  draft: FabStateDraft,
  events: readonly ProposedEvent[],
  options: Omit<
    FabCommitOptions,
    "onCommittedEvents" | "onPlayerLogFacts" | "onCommittedReceipt"
  > = {},
): {
  readonly batch: FabCommittedEventBatch | null;
  readonly cancelledEvents: readonly FabCancelledProposedEvent[];
  readonly events: readonly import("../rules/events.ts").CommittedEvent[];
  readonly playerLogFacts: readonly FabPlayerLogFact[];
} {
  return commitProposedEventBatchDraft(draft, events, reduceFabGameEvent, options);
}

export type { FabCommitOptions, FabRulesSnapshot };
export type { FabMatchState };
