import type { FabMoveName } from "../moves.ts";
import type { FabCommandOutcome } from "../moves.ts";
import type { FabEventTransactionOptions } from "../kernel/process-runner/index.ts";
import type { FabRulesSnapshot } from "../kernel/transaction-kernel.ts";
import type { FabMatchState } from "../state.ts";

export type FabCommandHandlerResult =
  | {
      readonly accepted: true;
      readonly move: FabMoveName;
      readonly actorId: string;
      readonly state: FabRulesSnapshot;
      readonly outcome: FabCommandOutcome;
    }
  | { readonly accepted: false; readonly error: string; readonly errorCode?: string };

/**
 * Minimal capabilities command handlers need from match ownership.
 *
 * `state` IS the live command candidate: the single mutable document for the
 * current command. Handlers and the procedures they start mutate it in place
 * through the copy-on-write helpers; they never swap in an independently
 * finalized state, so there is no publish-back call. A failed command rolls
 * back because the runtime discards the unpublished candidate.
 *
 * Handlers may advance FAB procedures, but they do not own the runtime object,
 * command receipts, public revision finalization, snapshots, or projections.
 */
export interface FabCommandHandlerContext {
  readonly state: FabMatchState;
  readonly transactionOptions: () => FabEventTransactionOptions;
}
