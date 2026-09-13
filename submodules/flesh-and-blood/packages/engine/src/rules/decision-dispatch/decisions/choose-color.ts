import type { FabLayerResolutionResult } from "../result.ts";
import type { LayerDecisionCtx } from "./context.ts";
import { createFabEffectResolutionDecision } from "../../../kernel/decision-builders.ts";
import { publishFabDecision } from "../../../kernel/decision-state.ts";
import { FAB_PITCH_COLORS } from "../../proposals/effects/choose-color.ts";

export function handleChooseColor(ctx: LayerDecisionCtx<"choose-color">): FabLayerResolutionResult {
  const { state, layer, process, decision } = ctx;
  publishFabDecision(
    state,
    createFabEffectResolutionDecision(state, {
      actorId: layer.controllerId,
      label: "Choose a color.",
      options: FAB_PITCH_COLORS.map((color) => ({
        id: color,
        label: `${color.slice(0, 1).toUpperCase()}${color.slice(1)}`,
      })),
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
