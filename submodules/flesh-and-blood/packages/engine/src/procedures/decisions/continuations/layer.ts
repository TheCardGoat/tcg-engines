import type { FabDecisionResumeContext, FabDecisionSubmitResult } from "../types.ts";
import { declaredTargetsFromDecision, requireAnswer, replacePending } from "../helpers.ts";
import { transitionFabRulesProcessStage } from "../../../kernel/process-state.ts";

export type ResumeCtx = FabDecisionResumeContext;

export function resumeLayerMode(ctx: ResumeCtx): FabDecisionSubmitResult | "continue" {
  const { process, decision, answer } = ctx;
  const a = requireAnswer(answer, "option");
  const continuation = decision.continuation;
  if (continuation.kind !== "layer-mode") throw new Error("expected layer-mode");
  replacePending(process.pendingTriggers, continuation.pendingTriggerId, (pending) => ({
    ...pending,
    declaredModes: a.optionIds,
    modesDeclared: true,
  }));
  transitionFabRulesProcessStage(process, "layer-declaration");
  return "continue";
}

export function resumeTriggerAdditionalCost(ctx: ResumeCtx): FabDecisionSubmitResult | "continue" {
  const { process, decision, answer } = ctx;
  const a = requireAnswer(answer, "boolean");
  const continuation = decision.continuation;
  if (continuation.kind !== "trigger-additional-cost") {
    throw new Error("expected trigger-additional-cost");
  }
  const pending = process.pendingTriggers.find(
    (candidate) => candidate.pendingTriggerId === continuation.pendingTriggerId,
  );
  if (!pending) throw new Error(`Missing pending FAB trigger ${continuation.pendingTriggerId}.`);
  if (!a.value) {
    process.pendingTriggers = process.pendingTriggers.filter(
      (candidate) => candidate.pendingTriggerId !== continuation.pendingTriggerId,
    );
    transitionFabRulesProcessStage(process, "layer-declaration");
    return "continue";
  }
  replacePending(process.pendingTriggers, continuation.pendingTriggerId, (current) => ({
    ...current,
    additionalCostResolved: true,
  }));
  transitionFabRulesProcessStage(process, "layer-declaration");
  return "continue";
}

export function resumeLayerTarget(ctx: ResumeCtx): FabDecisionSubmitResult | "continue" {
  const { process, decision, answer } = ctx;
  const a = requireAnswer(answer, "entity-target");
  const continuation = decision.continuation;
  if (continuation.kind !== "layer-target") throw new Error("expected layer-target");
  replacePending(process.pendingTriggers, continuation.pendingTriggerId, (pending) => ({
    ...pending,
    declaredTargets: {
      ...pending.declaredTargets,
      [continuation.targetKey]: declaredTargetsFromDecision(
        decision as Extract<typeof decision, { readonly kind: "entity-target" }>,
        a,
      ),
    },
  }));
  transitionFabRulesProcessStage(process, "layer-declaration");
  return "continue";
}
