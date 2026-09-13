import type {
  GrandArchiveCommandFailure,
  GrandArchiveCommandSuccess,
} from "../kernel/command-results.ts";
import type { GrandArchiveCommittedEvent, GrandArchiveProposedEvent } from "../kernel/events.ts";
import type { GrandArchiveTransactionKernel } from "../kernel/kernel.ts";
import type { GrandArchiveMatchProgram } from "../kernel/match-program.ts";
import type { GrandArchiveMatchState } from "../game/model.ts";

/** Capabilities available to command handlers; match ownership remains in the runtime. */
export interface GrandArchiveCommandHandlerContext {
  readonly getProgram: () => GrandArchiveMatchProgram;
  readonly getState: () => GrandArchiveMatchState;
  readonly replaceState: (state: GrandArchiveMatchState) => void;
  readonly getKernel: () => GrandArchiveTransactionKernel;
  readonly commit: (events: readonly GrandArchiveProposedEvent[]) => GrandArchiveCommandSuccess;
  readonly stabilize: (
    committed: readonly GrandArchiveCommittedEvent[],
    initialTriggerEvents?: readonly GrandArchiveCommittedEvent[],
  ) => GrandArchiveCommandSuccess;
  readonly failure: (
    code: GrandArchiveCommandFailure["code"],
    message: string,
  ) => GrandArchiveCommandFailure;
}
