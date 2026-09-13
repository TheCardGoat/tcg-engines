import type { FabDecisionResumeContext, FabDecisionSubmitResult } from "../types.ts";
import { requireAnswer, clockwisePlayers } from "../helpers.ts";
import { transitionFabRulesProcessStage } from "../../../kernel/process-state.ts";

export type ResumeCtx = FabDecisionResumeContext;

export function resumeTriggerFirstPlayer(ctx: ResumeCtx): FabDecisionSubmitResult | "continue" {
  const { state, process, answer } = ctx;
  const a = requireAnswer(answer, "option");
  const firstPlayerId = a.optionIds[0]!;
  const groupId = process.pendingTriggers[0]?.simultaneousGroupId;
  const controllers = new Set(
    process.pendingTriggers
      .filter((pending) => pending.simultaneousGroupId === groupId)
      .map((pending) => pending.controllerId),
  );
  process.triggerPlayerOrder = clockwisePlayers(state, firstPlayerId).filter((id) =>
    controllers.has(id),
  );
  transitionFabRulesProcessStage(process, "layer-declaration");
  return "continue";
}

export function resumeTriggerOrder(ctx: ResumeCtx): FabDecisionSubmitResult | "continue" {
  const { process, decision, answer } = ctx;
  const a = requireAnswer(answer, "ordering");
  process.orderedTriggerIds.push(...a.orderedIds);
  const continuation = decision.continuation;
  if (continuation.kind !== "trigger-order") throw new Error("expected trigger-order");
  process.orderedTriggerControllers.push(continuation.controllerId);
  transitionFabRulesProcessStage(process, "layer-declaration");
  return "continue";
}
