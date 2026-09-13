import type { FabEffect } from "@tcg/flesh-and-blood-types";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import { unsupported } from "../shared.ts";

export function proposeCancelEvent(
  ctx: ProposalContext,
  effect: FabEffect & { type: "cancel-event" },
): FabEffectProposalResult {
  void ctx;
  return unsupported(effect, "effect leaf has not been migrated to event proposals");
}
