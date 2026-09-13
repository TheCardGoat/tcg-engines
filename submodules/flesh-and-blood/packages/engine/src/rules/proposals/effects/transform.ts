import type { FabEffect } from "@tcg/flesh-and-blood-types";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import { unsupported } from "../shared.ts";
import { proposeMechanicEffect } from "../mechanic-effects.ts";

export function proposeTransform(
  ctx: ProposalContext,
  effect: FabEffect & { type: "transform" },
): FabEffectProposalResult {
  return (
    proposeMechanicEffect(ctx, effect) ??
    unsupported(effect, "effect leaf has not been migrated to event proposals")
  );
}
