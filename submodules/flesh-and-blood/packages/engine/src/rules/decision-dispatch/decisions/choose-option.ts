import type { FabLayerResolutionResult } from "../result.ts";
import type { LayerDecisionCtx } from "./context.ts";
import { createFabEffectResolutionDecision } from "../../../kernel/decision-builders.ts";
import { publishFabDecision } from "../../../kernel/decision-state.ts";

export function handleChooseOption(
  ctx: LayerDecisionCtx<"choose-option">,
): FabLayerResolutionResult {
  const { state, layer, process, decision } = ctx;
  publishFabDecision(
    state,
    createFabEffectResolutionDecision(state, {
      actorId: decision.actorId,
      label: `Choose ${decision.effect.options.join(" or ")}.`,
      options: decision.effect.options.map((option) => ({ id: option, label: option })),
      continuation: {
        kind: "effect-resolution",
        processId: process.processId,
        layerId: layer.layerId,
        effectPath: decision.path,
      },
    }),
  );
  return { accepted: true, state };
}
