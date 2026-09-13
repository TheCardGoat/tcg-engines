import type { FabMatchState } from "../../state.ts";
import type { FabDecision, FabDecisionAnswer, FabRulesProcess } from "../../rules/process.ts";
import type { FabEventTransactionOptions } from "../../kernel/process-runner/index.ts";
import type { FabCommandOutcome } from "../../moves.ts";

export interface FabDecisionSubmission {
  readonly decisionId: FabDecision["decisionId"];
  readonly stateVersion: number;
  readonly answer: FabDecisionAnswer;
}

export type FabDecisionSubmitResult =
  | {
      readonly accepted: true;
      readonly state: FabMatchState;
      readonly outcome: FabCommandOutcome;
    }
  | {
      readonly accepted: false;
      readonly error: string;
      readonly errorCode: string;
      /** Present once command execution opened a continuation savepoint. */
      readonly state?: FabMatchState;
    };

/** The registry owns continuation routing; callers provide only transaction services. */
export type FabDecisionResumeOptions = FabEventTransactionOptions;

/** Serialized decision state passed to every declarative continuation handler. */
export interface FabDecisionResumeContext {
  readonly state: FabMatchState;
  readonly process: FabRulesProcess;
  readonly decision: FabDecision;
  readonly answer: FabDecisionAnswer;
  readonly options: FabDecisionResumeOptions;
}
