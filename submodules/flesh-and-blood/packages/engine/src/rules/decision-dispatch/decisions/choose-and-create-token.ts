import type { FabLayerResolutionResult } from "../result.ts";
import type { LayerDecisionCtx } from "./context.ts";
import { createFabEffectResolutionDecision } from "../../../kernel/decision-builders.ts";
import { publishFabDecision } from "../../../kernel/decision-state.ts";

function tokenLabel(option: string): string {
  return `${option.slice(0, 1).toUpperCase()}${option.slice(1)}`;
}

export function handleChooseAndCreateToken(
  ctx: LayerDecisionCtx<"choose-and-create-token">,
): FabLayerResolutionResult {
  const { state, process, decision } = ctx;
  publishFabDecision(
    state,
    createFabEffectResolutionDecision(state, {
      actorId: decision.actorId,
      label: `Choose ${decision.effect.options.map(tokenLabel).join(" or ")}.`,
      options: decision.effect.options.map((option) => ({
        id: option,
        label: tokenLabel(option),
      })),
      continuation: {
        kind: "effect-resolution",
        processId: process.processId,
        layerId: ctx.layer.layerId,
        effectPath: decision.path,
      },
    }),
  );
  return { accepted: true, state };
}
