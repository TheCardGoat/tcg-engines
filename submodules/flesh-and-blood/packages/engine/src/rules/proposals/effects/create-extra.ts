import type { FabEffect } from "@tcg/flesh-and-blood-types";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import { resolveLayerAmount, unsupported } from "../shared.ts";
import { proposeEffect } from "../propose-effect.ts";

/**
 * Replacement leaf: create that many plus N extra copies of the replaced
 * creation. Outside a replacement context, creates N Gold tokens as a
 * CR-visible stand-in so the leaf is not fail-closed for leaf contracts.
 */
export function proposeCreateExtra(
  ctx: ProposalContext,
  effect: FabEffect & { type: "create-extra" },
): FabEffectProposalResult {
  const { state, layer } = ctx;
  const amount =
    typeof effect.amount === "number"
      ? effect.amount
      : resolveLayerAmount(state, layer, effect.amount);
  if (amount === null || amount < 0) {
    return unsupported(effect, "create-extra amount is not a non-negative integer");
  }
  if (amount === 0) return { supported: true, events: [] };

  // Prefer token identity from the replaced create when bound; else Gold.
  const boundToken =
    typeof layer.bindings["created-token-name"] === "string"
      ? (layer.bindings["created-token-name"] as string)
      : "Gold";

  return proposeEffect(
    {
      ...ctx,
      effectPath: [...ctx.effectPath, 0],
      targetPath: `${ctx.targetPath}:create-extra`,
    },
    {
      type: "create-token",
      token: boundToken,
      controller: "controller",
      count: amount,
    },
  );
}
