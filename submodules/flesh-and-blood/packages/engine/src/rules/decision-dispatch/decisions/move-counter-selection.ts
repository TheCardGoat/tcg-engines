import { createFabOptionDecision } from "../../../kernel/decision-builders.ts";
import { publishFabDecision } from "../../../kernel/decision-state.ts";
import type { FabLayerResolutionResult } from "../result.ts";
import type { LayerDecisionCtx } from "./context.ts";

export function handleMoveCounterSelection(
  ctx: LayerDecisionCtx<"move-counter-selection">,
): FabLayerResolutionResult {
  const { state, layer, process, decision } = ctx;
  publishFabDecision(
    state,
    createFabOptionDecision(state, {
      actorId: layer.controllerId,
      label: "Choose any number of counters to move.",
      min: 0,
      max: decision.entries.length,
      options: decision.entries,
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
