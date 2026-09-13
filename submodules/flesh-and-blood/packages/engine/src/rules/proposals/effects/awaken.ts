import type { FabEffect } from "@tcg/flesh-and-blood-types";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import { baseEvent, objectTargets, unsupported } from "../shared.ts";
import { snapshotPlayerId } from "../../snapshots.ts";

/**
 * CR 8.5.43 Awaken — flip a figment (or other dual-faced permanent) to its
 * permanent face and mark it awakened. Used by Prism Awakener of Sol and
 * printed awaken effects.
 */
export function proposeAwaken(
  ctx: ProposalContext,
  effect: FabEffect & { type: "awaken" },
): FabEffectProposalResult {
  const { state, layer, processId, effectTargets, effectPath, targetPath } = ctx;
  const objects = objectTargets(state, layer, effect.target, targetPath, effectTargets, effectPath);
  if (!objects) return unsupported(effect, "awaken target is unresolved");
  if (objects.length === 0) return { supported: true, events: [] };
  return {
    supported: true,
    events: objects.map((object) => ({
      ...baseEvent(layer, processId),
      name: "awaken" as const,
      affected: [object],
      data: {
        object,
        playerId: snapshotPlayerId(object),
      },
    })),
  };
}
