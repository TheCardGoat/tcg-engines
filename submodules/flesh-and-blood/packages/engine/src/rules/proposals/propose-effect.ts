import type { FabEffect } from "@tcg/flesh-and-blood-types";
import type { FabEffectProposalResult, ProposalContext } from "./shared.ts";
import { proposeEffectDispatch } from "./dispatch.ts";

/**
 * Propose events for one effect node. "If you do" continuations live on
 * `if-you-do` / `optional` / prevention-apply, not a generic leaf `then`.
 */
export function proposeEffect(ctx: ProposalContext, effect: FabEffect): FabEffectProposalResult {
  return proposeEffectDispatch(ctx, effect);
}
