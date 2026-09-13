import type { FabEffect } from "@tcg/flesh-and-blood-types";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import { unsupported } from "../shared.ts";
import { proposeCardMovementEffect } from "../card-movement-effects.ts";

export function proposeOpt(
  ctx: ProposalContext,
  effect: FabEffect & { type: "opt" },
): FabEffectProposalResult {
  return (
    proposeCardMovementEffect(ctx, effect) ??
    unsupported(effect, "effect leaf has not been migrated to event proposals")
  );
}
