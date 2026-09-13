import type { FabMatchState } from "../../state.ts";
import type { FabCommittedEventBatch } from "../../rules/events.ts";
import type { FabCommitOptions } from "../transaction-kernel.ts";
import type { FabTriggerSource } from "../../rules/trigger-matcher.ts";
import type { FabTriggerMatchContext } from "../../rules/trigger-matcher.ts";
import type { FabTriggerDeclarationOptions } from "../trigger-declaration.ts";

export interface FabEventTransactionResult {
  readonly state: FabMatchState;
  readonly batch: FabCommittedEventBatch | null;
}

export type FabEventJournalTransactionResult =
  | {
      readonly committed: true;
      readonly state: FabMatchState;
      readonly batches: readonly FabCommittedEventBatch[];
    }
  | {
      readonly committed: false;
      readonly state: FabMatchState;
      readonly failedEventGroupId: string;
    }
  | {
      readonly committed: false;
      readonly state: FabMatchState;
      readonly suspendedForReplacementOrder: true;
    }
  | {
      readonly committed: false;
      readonly state: FabMatchState;
      readonly suspendedForContinuousOrder: true;
    };

/** Event+state trigger matching (CR 6.6.5b generation-time state checks). */
export interface FabTriggerPort {
  readonly triggerContext: FabTriggerMatchContext;
}

/** Continue or resume the persisted CR procedure that owns this transaction. */
export interface FabProcedurePort {
  /** Continue a persisted parent procedure after its trigger layers and state checks clear. */
  readonly advanceProcedure?: (state: FabMatchState) => void;
  /** Resume a persisted same-face printed-ability step after its journal settles. */
  readonly resumeAbilityStep?: (
    state: FabMatchState,
    continuation: NonNullable<
      NonNullable<FabMatchState["rulesProcess"]>["abilityStepContinuation"]
    >,
    committedEvents: readonly import("../../rules/events.ts").CommittedEvent[],
  ) => FabMatchState;
  /** Resume an enclosing effect only after its payment journal has settled. */
  readonly resumeEffectPayment?: (
    state: FabMatchState,
    continuation: NonNullable<
      NonNullable<FabMatchState["rulesProcess"]>["effectPaymentContinuation"]
    >,
    committedEvents: readonly import("../../rules/events.ts").CommittedEvent[],
  ) => FabMatchState;
}

/**
 * The transaction service contract, composed of named ports so no caller
 * hands or receives an unnameable kitchen sink: {@link FabTriggerPort},
 * the declaration ports it inherits through FabTriggerDeclarationOptions
 * ({@link FabAmountPort}, {@link FabRandomPort}, {@link FabTargetingPort},
 * {@link FabKernelEventSink}), and {@link FabProcedurePort}. The commit
 * half (replacement selection + iteration bound) comes from FabCommitOptions.
 */
export interface FabEventTransactionOptions
  extends
    Omit<FabCommitOptions, "replacements">,
    FabTriggerDeclarationOptions,
    FabTriggerPort,
    FabProcedurePort {
  readonly additionalTriggerSources?: readonly FabTriggerSource[];
  /** Collect triggers across an enclosing play/activation procedure before declaring layers. */
  readonly deferTriggerDeclaration?: boolean;
}
