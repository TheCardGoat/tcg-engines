import type { FabLayerResolutionResult } from "../result.ts";
import type { LayerDecisionCtx } from "./context.ts";
import { createFabEffectResolutionDecision } from "../../../kernel/decision-builders.ts";
import { publishFabDecision } from "../../../kernel/decision-state.ts";

export function handleNameCard(ctx: LayerDecisionCtx<"name-card">): FabLayerResolutionResult {
  const { state, layer, process, decision } = ctx;
  publishFabDecision(
    state,
    createFabEffectResolutionDecision(state, {
      actorId: layer.controllerId,
      label: "Name a card",
      options: decision.options.map((option) => ({ id: option.id, label: option.name })),
      presentation: {
        kind: "card-name",
        label: "Card name",
        placeholder: "Type a card name",
        confirmLabel: "Use this name",
        description: "Search the full catalog or choose a suggestion from information you can see.",
        resultLimit: 12,
        suggestionGroups: decision.suggestionGroups,
      },
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
