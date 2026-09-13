import type { FabDecisionResumeContext, FabDecisionSubmitResult } from "../types.ts";
import { declaredTargetsFromDecision, requireAnswer } from "../helpers.ts";
import {
  resumeFabPlayCostTarget,
  resumeFabPlayDeclaration,
  resumeFabPlayPayment,
  resumeFabPlayX,
} from "../../play-card/index.ts";
import {
  resumeFabActivationDeclaration,
  resumeFabActivationEquipDestination,
  resumeFabActivationPayment,
  resumeFabActivationX,
} from "../../activate-ability/index.ts";
import {
  resumeFabEffectResolution,
  resumeFabOptionalEffect,
  resumeFabResolutionEffectPaymentAmount,
  resumeFabResolutionEffectPayment,
} from "../../layer-resolution/index.ts";
import {
  resumeFabTurnArsenal,
  resumeFabTurnHeave,
  resumeFabTurnPitchOrder,
} from "../../turn/index.ts";
import type { FabActivationProcedureResult } from "../../activate-ability/types.ts";
import type { FabPlayProcedureResult } from "../../play-card/types.ts";

export type ResumeCtx = FabDecisionResumeContext;

function playDecisionResult(result: FabPlayProcedureResult): FabDecisionSubmitResult {
  switch (result.kind) {
    case "advanced":
      return { accepted: true, state: result.state, outcome: { kind: "applied" } };
    case "reversed":
      return {
        accepted: true,
        state: result.state,
        outcome: { kind: "rules-action-reversed", action: "play-card", reason: result.reason },
      };
    case "failed":
      return { accepted: false, error: result.error, errorCode: result.errorCode };
  }
}

function activationDecisionResult(result: FabActivationProcedureResult): FabDecisionSubmitResult {
  switch (result.kind) {
    case "advanced":
      return { accepted: true, state: result.state, outcome: { kind: "applied" } };
    case "reversed":
      return {
        accepted: true,
        state: result.state,
        outcome: { kind: "rules-action-reversed", action: "activate", reason: result.reason },
      };
    case "failed":
      return { accepted: false, error: result.error, errorCode: result.errorCode };
  }
}

export function resumePlayModeOrTarget(ctx: ResumeCtx): FabDecisionSubmitResult {
  const { state, decision, answer, options } = ctx;
  const declarationAnswer =
    decision.continuation.kind === "play-target"
      ? decision.kind === "entity-target"
        ? declaredTargetsFromDecision(decision, requireAnswer(answer, "entity-target"))
        : (() => {
            throw new Error("FAB play target continuation requires an entity-target decision.");
          })()
      : answer;
  const result = resumeFabPlayDeclaration(
    state,
    decision.continuation as Extract<
      typeof decision.continuation,
      { kind: "play-mode" | "play-target" }
    >,
    declarationAnswer,
    options,
  );
  return playDecisionResult(result);
}

export function resumePlayX(ctx: ResumeCtx): FabDecisionSubmitResult {
  const { state, decision, answer, options } = ctx;
  return playDecisionResult(
    resumeFabPlayX(
      state,
      decision.continuation as Extract<typeof decision.continuation, { kind: "play-x" }>,
      requireAnswer(answer, "numeric"),
      options,
    ),
  );
}

export function resumePlayCostTarget(ctx: ResumeCtx): FabDecisionSubmitResult {
  const { state, decision, answer, options } = ctx;
  return playDecisionResult(
    resumeFabPlayCostTarget(
      state,
      decision.continuation as Extract<typeof decision.continuation, { kind: "play-cost-target" }>,
      requireAnswer(answer, "entity-target"),
      options,
    ),
  );
}

export function resumeActivationTarget(ctx: ResumeCtx): FabDecisionSubmitResult {
  const { state, decision, answer, options } = ctx;
  if (decision.kind !== "entity-target") {
    throw new Error(
      `FAB activation target continuation expected an entity-target decision, received ${decision.kind}.`,
    );
  }
  return activationDecisionResult(
    resumeFabActivationDeclaration(
      state,
      decision.continuation as Extract<typeof decision.continuation, { kind: "activation-target" }>,
      declaredTargetsFromDecision(decision, requireAnswer(answer, "entity-target")),
      options,
    ),
  );
}

export function resumeActivationEquipDestination(ctx: ResumeCtx): FabDecisionSubmitResult {
  const { state, decision, answer, options } = ctx;
  return activationDecisionResult(
    resumeFabActivationEquipDestination(
      state,
      decision.continuation as Extract<
        typeof decision.continuation,
        { kind: "activation-equip-destination" }
      >,
      requireAnswer(answer, "option"),
      options,
    ),
  );
}

export function resumeActivationX(ctx: ResumeCtx): FabDecisionSubmitResult {
  const { state, decision, answer, options } = ctx;
  return activationDecisionResult(
    resumeFabActivationX(
      state,
      decision.continuation as Extract<typeof decision.continuation, { kind: "activation-x" }>,
      requireAnswer(answer, "numeric"),
      options,
    ),
  );
}

export function resumeOptionalEffect(ctx: ResumeCtx): FabDecisionSubmitResult {
  const { state, decision, answer, options } = ctx;
  return {
    accepted: true,
    outcome: { kind: "applied" },
    state: resumeFabOptionalEffect(
      state,
      decision.continuation as Extract<typeof decision.continuation, { kind: "optional-effect" }>,
      requireAnswer(answer, "boolean"),
      options,
    ),
  };
}

export function resumeEffectPaymentAmount(ctx: ResumeCtx): FabDecisionSubmitResult {
  const { state, decision, answer, options } = ctx;
  return {
    accepted: true,
    outcome: { kind: "applied" },
    state: resumeFabResolutionEffectPaymentAmount(
      state,
      decision.continuation as Extract<
        typeof decision.continuation,
        { kind: "effect-payment-amount" }
      >,
      requireAnswer(answer, "numeric"),
      options,
    ),
  };
}

export function resumePayment(ctx: ResumeCtx): FabDecisionSubmitResult {
  const { state, decision, answer, options } = ctx;
  if (decision.continuation.kind === "payment" && decision.continuation.procedure === "activate") {
    return activationDecisionResult(
      resumeFabActivationPayment(
        state,
        decision.continuation,
        requireAnswer(answer, "payment"),
        options,
      ),
    );
  }
  if (decision.continuation.kind === "payment" && decision.continuation.procedure === "play") {
    return playDecisionResult(
      resumeFabPlayPayment(state, decision.continuation, requireAnswer(answer, "payment"), options),
    );
  }
  return {
    accepted: true,
    outcome: { kind: "applied" },
    state: resumeFabResolutionEffectPayment(
      state,
      decision.continuation as Extract<
        typeof decision.continuation,
        { kind: "payment"; procedure: "effect" }
      >,
      requireAnswer(answer, "payment"),
      options,
    ),
  };
}

export function resumeEffectResolution(ctx: ResumeCtx): FabDecisionSubmitResult {
  const { state, decision, answer, options } = ctx;
  return {
    accepted: true,
    outcome: { kind: "applied" },
    state: resumeFabEffectResolution(
      state,
      decision.continuation as Extract<typeof decision.continuation, { kind: "effect-resolution" }>,
      decision.kind === "entity-target"
        ? declaredTargetsFromDecision(decision, requireAnswer(answer, "entity-target"))
        : decision.kind === "group-choice"
          ? requireAnswer(answer, "group-choice")
          : answer,
      options,
    ),
  };
}

export function resumeTurnPitchOrder(ctx: ResumeCtx): FabDecisionSubmitResult {
  const { state, decision, answer, options } = ctx;
  return {
    accepted: true,
    outcome: { kind: "applied" },
    state: resumeFabTurnPitchOrder(
      state,
      decision.continuation as Extract<typeof decision.continuation, { kind: "turn-pitch-order" }>,
      requireAnswer(answer, "ordering"),
      options,
    ),
  };
}

export function resumeTurnHeave(ctx: ResumeCtx): FabDecisionSubmitResult {
  const { state, decision, answer, options } = ctx;
  return {
    accepted: true,
    outcome: { kind: "applied" },
    state: resumeFabTurnHeave(
      state,
      decision.continuation as Extract<typeof decision.continuation, { kind: "turn-heave" }>,
      requireAnswer(answer, "entity-target"),
      options,
    ),
  };
}

export function resumeTurnArsenal(ctx: ResumeCtx): FabDecisionSubmitResult {
  const { state, decision, answer, options } = ctx;
  return {
    accepted: true,
    outcome: { kind: "applied" },
    state: resumeFabTurnArsenal(
      state,
      decision.continuation as Extract<typeof decision.continuation, { kind: "turn-arsenal" }>,
      requireAnswer(answer, "entity-target"),
      options,
    ),
  };
}
