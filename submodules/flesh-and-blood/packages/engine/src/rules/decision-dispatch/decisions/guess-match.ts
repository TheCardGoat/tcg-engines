import type { FabLayerResolutionResult } from "../result.ts";
import type { LayerDecisionCtx } from "./context.ts";
import { createFabEffectResolutionDecision } from "../../../kernel/decision-builders.ts";
import { publishFabDecision } from "../../../kernel/decision-state.ts";
/**
 * Truth or Trickery asks whether the hidden card matches the already chosen
 * color. The attacker answers yes/no without replacing that color choice.
 */
export function handleGuessMatch(ctx: LayerDecisionCtx<"guess-match">): FabLayerResolutionResult {
  const { state, layer, process, decision } = ctx;
  publishFabDecision(
    state,
    createFabEffectResolutionDecision(state, {
      actorId: decision.actorId,
      label: "Is that card the chosen color?",
      options: [
        { id: "yes", label: "Yes" },
        { id: "no", label: "No" },
      ],
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
