import type { FabEffect } from "@tcg/flesh-and-blood-types";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import { unsupported } from "../shared.ts";
import { proposeCardMovementEffect } from "../card-movement-effects.ts";
import { arsenalHasRoom } from "../../arsenal-capacity.ts";

export function proposeMoveCard(
  ctx: ProposalContext,
  effect: FabEffect & { type: "move-card" },
): FabEffectProposalResult {
  // CR 8.5.23 Reload-style hand→arsenal: no-op when arsenal has no free zone
  // (capacity 1 base; New Horizon additional-arsenal-zone raises capacity).
  if (
    effect.to.zone === "arsenal" &&
    effect.target.selector === "object" &&
    "player" in effect.target &&
    (effect.target.player === "controller" || effect.target.player === undefined)
  ) {
    if (!arsenalHasRoom(ctx.state, ctx.layer.controllerId)) {
      return { supported: true, events: [] };
    }
  }
  return (
    proposeCardMovementEffect(ctx, effect) ??
    unsupported(effect, "effect leaf has not been migrated to event proposals")
  );
}
