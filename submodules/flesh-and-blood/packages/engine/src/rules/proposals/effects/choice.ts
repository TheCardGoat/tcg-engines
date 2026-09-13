import type { FabEffect } from "@tcg/flesh-and-blood-types";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import { availableChoiceOptionIndexes, unsupported } from "../shared.ts";
import { proposeEffect } from "../propose-effect.ts";

export function proposeChoice(
  ctx: ProposalContext,
  effect: FabEffect & { type: "choice" },
): FabEffectProposalResult {
  const selected = ctx.effectOptions[ctx.effectPath.join(".")];
  const match = selected?.match(/^option-(\d+)$/);
  const index = match ? Number(match[1]) : -1;
  const option = effect.options[index];
  if (option) {
    return proposeEffect(
      {
        ...ctx,
        effectPath: [...ctx.effectPath, index],
        targetPath: `${ctx.targetPath}:option-${index}`,
      },
      option,
    );
  }
  // Every arm's at-resolution pool was provably empty: the decision finder
  // suppressed the choice — resolve it as a no-op instead of demanding one.
  if (availableChoiceOptionIndexes(ctx.state, ctx.layer, effect).length === 0) {
    return { supported: true, events: [] };
  }
  return unsupported(effect, "effect choice is unresolved");
}
