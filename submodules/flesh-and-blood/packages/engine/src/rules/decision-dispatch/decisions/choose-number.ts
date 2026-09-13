import type { FabLayerResolutionResult } from "../result.ts";
import type { LayerDecisionCtx } from "./context.ts";
import { createFabEffectResolutionDecision } from "../../../kernel/decision-builders.ts";
import { publishFabDecision } from "../../../kernel/decision-state.ts";

export function handleChooseNumber(
  ctx: LayerDecisionCtx<"choose-number">,
): FabLayerResolutionResult {
  const { state, layer, process, decision } = ctx;
  const min = decision.effect.min ?? 1;
  const max = decision.effect.max ?? min;
  const secret = decision.effect.secret === true;
  const numbers = Array.from({ length: max - min + 1 }, (_, index) => min + index);
  publishFabDecision(
    state,
    createFabEffectResolutionDecision(state, {
      actorId: decision.actorId,
      label: secret
        ? `Secretly choose a number between ${min} and ${max}.`
        : `Choose a number between ${min} and ${max}.`,
      options: numbers.map((value) => ({ id: String(value), label: String(value) })),
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
