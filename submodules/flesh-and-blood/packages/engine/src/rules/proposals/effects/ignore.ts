import type { FabEffect } from "@tcg/flesh-and-blood-types";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import { unsupported } from "../shared.ts";

/**
 * CR 8.5.33 Ignore — applied as a replacement modification (the matched event
 * is considered to never have happened), never resolved as a discrete effect
 * in its own right. Mirrors {@link proposeCancelEvent}.
 */
export function proposeIgnore(
  ctx: ProposalContext,
  effect: FabEffect & { type: "ignore" },
): FabEffectProposalResult {
  void ctx;
  return unsupported(effect, "ignore is a replacement-only leaf");
}
