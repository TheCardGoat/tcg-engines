import type { FabMatchState } from "../../state.ts";
import { advanceFabRulesProcessToBoundary } from "../../kernel/process-runner/index.ts";
import { advanceTriggerDeclarations } from "../../kernel/trigger-declaration.ts";
import type {
  FabDecisionResumeOptions,
  FabDecisionSubmission,
  FabDecisionSubmitResult,
} from "./types.ts";
import { failure, validateAnswer } from "./helpers.ts";
import { resumeFabDecisionContinuation } from "./continuation-registry.ts";
import { mutateFabStateSavepointWithResult } from "../../copy-on-write.ts";
import { finishFabRulesProcess } from "../../kernel/process-state.ts";
import { clearFabDecision } from "../../kernel/decision-state.ts";
import { cancelFabResolutionEffectPayment } from "../layer-resolution/index.ts";

/** Validates and resumes exactly the serialized process that created a decision. */
export function submitFabDecision(
  current: FabMatchState,
  actorId: string,
  submission: FabDecisionSubmission,
  options: FabDecisionResumeOptions,
): FabDecisionSubmitResult {
  const decision = current.decision;
  if (!decision || decision.decisionId !== submission.decisionId) {
    return failure("The FAB decision is no longer current.", "stale_decision");
  }
  if (
    decision.stateVersion !== submission.stateVersion ||
    current.stateID !== submission.stateVersion
  ) {
    return failure("The FAB decision was submitted against a stale state version.", "stale_state");
  }
  if (decision.actorId !== actorId) {
    return failure("Only the acting player may answer this FAB decision.", "wrong_actor");
  }
  if (
    submission.answer.kind === "cancel" &&
    (decision.kind !== "payment" || !decision.cancellable)
  ) {
    return failure("This FAB decision cannot be cancelled.", "decision_not_cancellable");
  }
  const validationError = validateAnswer(decision, submission.answer);
  if (validationError) return failure(validationError, "invalid_decision_answer");

  const resumedDecision = decision;
  const transaction = mutateFabStateSavepointWithResult(current, (state) => {
    state.stateID += 1;
    clearFabDecision(state);
    const process = state.rulesProcess;
    if (!process || resumedDecision.continuation.processId !== process.processId) {
      return failure("The FAB rules process for this decision no longer exists.", "stale_process");
    }
    if (submission.answer.kind === "cancel") {
      if (
        resumedDecision.continuation.kind === "payment" &&
        resumedDecision.continuation.procedure === "effect"
      ) {
        const cancelled = cancelFabResolutionEffectPayment(
          state,
          resumedDecision.continuation,
          options,
        );
        if (cancelled !== state) {
          throw new Error("FAB decision cancellation escaped its owning state draft.");
        }
      } else {
        finishFabRulesProcess(state, process.processId);
      }
      return { accepted: true as const, outcome: { kind: "applied" as const } };
    }

    const result = resumeFabDecisionContinuation({
      state,
      process,
      decision: resumedDecision,
      answer: submission.answer,
      options,
    });
    if (result === "continue") {
      advanceTriggerDeclarations(state, options);
      advanceFabRulesProcessToBoundary(state, options);
      return { accepted: true as const, outcome: { kind: "applied" as const } };
    }
    if (!result || typeof result !== "object" || !("accepted" in result)) {
      return failure(
        "FAB decision continuation did not produce a result.",
        "unsupported_decision_continuation",
      );
    }
    if (result.accepted && result.state !== state) {
      throw new Error("FAB decision continuation escaped its owning state draft.");
    }
    return result.accepted ? { accepted: true as const, outcome: result.outcome } : result;
  });
  return { ...transaction.result, state: transaction.state };
}
