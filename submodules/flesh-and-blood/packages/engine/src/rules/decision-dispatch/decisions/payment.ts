import type { FabLayerResolutionResult } from "../result.ts";
import type { LayerDecisionCtx } from "./context.ts";
import {
  createFabNumericDecision,
  createFabPaymentDecision,
} from "../../../kernel/decision-builders.ts";
import { publishFabDecision } from "../../../kernel/decision-state.ts";

export function handlePaymentAmount(
  ctx: LayerDecisionCtx<"payment-amount">,
): FabLayerResolutionResult {
  const { state, layer, process, decision } = ctx;
  publishFabDecision(
    state,
    createFabNumericDecision(state, {
      actorId: decision.actorId,
      label: `Choose how much to pay for ${layer.source.current.names.join(" // ") || layer.layerId}.`,
      min: 0,
      max: decision.max,
      requiresExplicitAnswer: true,
      continuation: {
        kind: "effect-payment-amount",
        processId: process.processId,
        layerId: layer.layerId,
        effectPath: decision.path,
      },
    }),
  );
  return { accepted: true, state };
}

export function handlePayment(ctx: LayerDecisionCtx<"payment">): FabLayerResolutionResult {
  const { state, layer, process, decision } = ctx;
  const optionalParentPath = decision.path.slice(0, -1).join(".");
  publishFabDecision(
    state,
    createFabPaymentDecision(state, {
      actorId: decision.actorId,
      label: `Pitch a card to pay for ${layer.source.current.names.join(" // ") || layer.layerId}.`,
      amount: decision.amount,
      oneAtATime: true,
      cancellable: process.effectChoices[optionalParentPath] === true,
      candidates: decision.candidates,
      continuation: {
        kind: "payment",
        processId: process.processId,
        cost: "asset",
        procedure: "effect",
        layerId: layer.layerId,
        effectPath: decision.path,
      },
    }),
  );
  return { accepted: true, state };
}

/** Guard: payment commits are intercepted by the owning layer procedure. */
export function handlePaymentCommit(
  ctx: LayerDecisionCtx<"payment-commit">,
): FabLayerResolutionResult {
  return ctx.failure(
    ctx.state,
    "Payment commit escaped its journal boundary.",
    "stale_rules_process",
  );
}
