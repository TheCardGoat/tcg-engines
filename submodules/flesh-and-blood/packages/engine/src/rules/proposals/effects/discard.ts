import type { FabEffect } from "@tcg/flesh-and-blood-types";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import { unsupported } from "../shared.ts";
import { proposeCardMovementEffect } from "../card-movement-effects.ts";

export function proposeDiscard(
  ctx: ProposalContext,
  effect: Extract<FabEffect, { type: "banish" | "discard" }>,
): FabEffectProposalResult {
  return (
    proposeCardMovementEffect(ctx, effect) ??
    unsupported(effect, "effect leaf has not been migrated to event proposals")
  );
}
