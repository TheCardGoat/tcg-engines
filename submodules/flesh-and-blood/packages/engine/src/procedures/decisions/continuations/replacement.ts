import type { FabDecisionResumeContext, FabDecisionSubmitResult } from "../types.ts";
import { requireAnswer } from "../helpers.ts";
import {
  resumeFabContinuousOrdering,
  resumeFabContinuousReplacementOrdering,
  resumeFabJournalReplacementOrdering,
  resumeFabReplacementPlayerChoice,
  resumeFabReplacementCostTarget,
  resumeFabReplacementCostPayment,
  resumeFabReplacementConsequenceTarget,
  resumeFabReplacementOrdering,
  resumeFabReplacementFirstPlayer,
} from "../../../kernel/process-runner/index.ts";

export type ResumeCtx = FabDecisionResumeContext;

export function resumeReplacementKinds(ctx: ResumeCtx): FabDecisionSubmitResult {
  const { state, decision, answer, options } = ctx;
  if (decision.continuation.kind === "replacement-player") {
    if (answer.kind !== "option") {
      return {
        accepted: false,
        error: "Optional replacement selection requires an option answer.",
        errorCode: "invalid_decision_answer",
      };
    }
    return {
      accepted: true,
      outcome: { kind: "applied" },
      state: resumeFabReplacementPlayerChoice(state, decision.continuation, answer, options),
    };
  }
  if (decision.continuation.kind === "replacement-first-player") {
    if (answer.kind !== "option") {
      return {
        accepted: false,
        error: "Replacement starting-player selection requires an option answer.",
        errorCode: "invalid_decision_answer",
      };
    }
    return {
      accepted: true,
      outcome: { kind: "applied" },
      state: resumeFabReplacementFirstPlayer(state, decision.continuation, answer, options),
    };
  }
  if (answer.kind !== "ordering") {
    return {
      accepted: false,
      error: "Replacement ordering requires an ordering answer.",
      errorCode: "invalid_decision_answer",
    };
  }
  const continuation = decision.continuation;
  if (continuation.kind === "replacement-order") {
    return {
      accepted: true,
      outcome: { kind: "applied" },
      state: resumeFabReplacementOrdering(state, continuation, answer, options),
    };
  }
  if (continuation.kind === "journal-replacement-order") {
    return {
      accepted: true,
      outcome: { kind: "applied" },
      state: resumeFabJournalReplacementOrdering(state, continuation, answer, options),
    };
  }
  if (continuation.kind === "continuous-replacement-order") {
    return {
      accepted: true,
      outcome: { kind: "applied" },
      state: resumeFabContinuousReplacementOrdering(state, continuation, answer, options),
    };
  }
  throw new Error("Unreachable FAB replacement continuation.");
}

export function resumeReplacementCostTarget(ctx: ResumeCtx): FabDecisionSubmitResult {
  const { state, decision, answer, options } = ctx;
  if (answer.kind !== "entity-target")
    return {
      accepted: false,
      error: "Replacement cost target requires an entity target answer.",
      errorCode: "invalid_decision_answer",
    };
  return {
    accepted: true,
    outcome: { kind: "applied" },
    state: resumeFabReplacementCostTarget(
      state,
      decision.continuation as Extract<
        typeof decision.continuation,
        { kind: "replacement-cost-target" }
      >,
      answer,
      options,
    ),
  };
}

export function resumeReplacementCostPayment(ctx: ResumeCtx): FabDecisionSubmitResult {
  const { state, decision, answer, options } = ctx;
  if (answer.kind !== "payment")
    return {
      accepted: false,
      error: "Replacement cost payment requires a payment answer.",
      errorCode: "invalid_decision_answer",
    };
  return {
    accepted: true,
    outcome: { kind: "applied" },
    state: resumeFabReplacementCostPayment(
      state,
      decision.continuation as Extract<
        typeof decision.continuation,
        { kind: "replacement-cost-payment" }
      >,
      answer,
      options,
    ),
  };
}

export function resumeReplacementConsequenceTarget(ctx: ResumeCtx): FabDecisionSubmitResult {
  const { state, decision, answer, options } = ctx;
  if (answer.kind !== "entity-target")
    return {
      accepted: false,
      error: "Re-clash revealed-card selection requires an entity target answer.",
      errorCode: "invalid_decision_answer",
    };
  return {
    accepted: true,
    outcome: { kind: "applied" },
    state: resumeFabReplacementConsequenceTarget(
      state,
      decision.continuation as Extract<
        typeof decision.continuation,
        { kind: "replacement-consequence-target" }
      >,
      answer,
      options,
    ),
  };
}

export function resumeContinuousOrder(ctx: ResumeCtx): FabDecisionSubmitResult {
  const { state, decision, answer, options } = ctx;
  return {
    accepted: true,
    outcome: { kind: "applied" },
    state: resumeFabContinuousOrdering(
      state,
      decision.continuation as Extract<typeof decision.continuation, { kind: "continuous-order" }>,
      requireAnswer(answer, "ordering"),
      options,
    ),
  };
}
