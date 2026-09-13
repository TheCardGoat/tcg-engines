import type { FabLayerResolutionResult } from "../result.ts";
import type { LayerDecisionCtx } from "./context.ts";
import { createFabEffectResolutionDecision } from "../../../kernel/decision-builders.ts";
import { availableChoiceOptionIndexes } from "../../proposals/shared.ts";
import { publishFabDecision } from "../../../kernel/decision-state.ts";

export function handleChoice(ctx: LayerDecisionCtx<"choice">): FabLayerResolutionResult {
  const { state, layer, process, decision } = ctx;

  // Only publish arms the controller can actually pay: an option whose
  // at-resolution pool is provably empty is not a legal choice. Original
  // option indexes stay stable so `option-N` answers keep addressing the
  // catalog-encoded option list.
  const availableIndexes = availableChoiceOptionIndexes(state, layer, decision.effect);
  publishFabDecision(
    state,
    createFabEffectResolutionDecision(state, {
      actorId: layer.controllerId,
      label: `Choose an effect for ${layer.source.current.names.join(" // ") || layer.layerId}.`,
      options: availableIndexes.flatMap((index) => {
        const option = decision.effect.options[index];
        // top-or-bottom synthetic choice: two move-card options differing only by position.
        if (
          option.type === "move-card" &&
          (option.to.position === "top" || option.to.position === "bottom")
        ) {
          return [
            {
              id: `option-${index}`,
              label: option.to.position === "top" ? "Top of deck" : "Bottom of deck",
            },
          ];
        }
        return [{ id: `option-${index}`, label: option.type }];
      }),
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
