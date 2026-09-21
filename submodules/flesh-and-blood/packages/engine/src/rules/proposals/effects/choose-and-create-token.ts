import type { FabEffect } from "@tcg/flesh-and-blood-types";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import { unsupported } from "../shared.ts";
import { proposeEffect } from "../propose-effect.ts";
import { nextRandom } from "../../../random.ts";

/**
 * "Choose and create a Might/Vigor/…" token — resolves the chosen option
 * (or random when printed) into a create-token proposal under the chooser
 * (or explicit controller).
 */
export function proposeChooseAndCreateToken(
  ctx: ProposalContext,
  effect: FabEffect & { type: "choose-and-create-token" },
): FabEffectProposalResult {
  const { state, layer } = ctx;
  if (effect.options.length === 0) {
    return unsupported(effect, "choose-and-create-token has no options");
  }

  const key = ctx.effectPath.join(".");
  let chosen = ctx.effectOptions[key];
  if (effect.random === true || chosen === undefined) {
    if (effect.random === true) {
      const roll = nextRandom(state.rngState);
      // Proposal is pure w.r.t. match state mutation — peek only; the create
      // path does not require consuming RNG here for the non-random default.
      chosen = effect.options[Math.floor(roll.value * effect.options.length)]!;
    } else {
      chosen = effect.options[0]!;
    }
  }
  if (!effect.options.includes(chosen)) {
    return unsupported(effect, "choose-and-create-token selection not in options");
  }

  return proposeEffect(
    {
      ...ctx,
      effectPath: [...ctx.effectPath, 0],
      targetPath: `${ctx.targetPath}:chosen-token`,
      layer: {
        ...layer,
        bindings: {
          ...layer.bindings,
          "chosen-token": chosen,
          chosenToken: chosen,
        },
      },
    },
    {
      type: "create-token",
      token: chosen,
      controller: effect.controller ?? effect.chooser,
      creator: effect.creator ?? "effect-controller",
      count: 1,
    },
  );
}
