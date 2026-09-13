import type { FabEffect } from "@tcg/flesh-and-blood-types";
import type { ProposedEvent } from "../../events.ts";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import { baseEvent, objectTargets, unsupported } from "../shared.ts";
import { nextFabDestinationRef } from "../../snapshots.ts";

/**
 * CR 8.5.48 Transcend — emit the transcend observation event. The reducer
 * (reducers/mechanics.ts case "transcend") performs the back-face flip +
 * move-to-hand + stamps history.turn.transcended. Replaces the prior label-
 * driven play-procedure path + the transform-into:"transcend" sentinel.
 */
export function proposeTranscend(
  ctx: ProposalContext,
  effect: FabEffect & { type: "transcend" },
): FabEffectProposalResult {
  const { state, layer, processId, effectTargets, effectPath, targetPath } = ctx;
  const objects = objectTargets(state, layer, effect.target, targetPath, effectTargets, effectPath);
  if (!objects) return unsupported(effect, "transcend target is unresolved");
  const events: ProposedEvent[] = objects.flatMap((object) => [
    {
      ...baseEvent(layer, processId),
      name: "transcend" as const,
      affected: [object],
      bindings: {},
      data: { actorId: layer.controllerId, object },
    },
    {
      ...baseEvent(layer, processId),
      name: "move-zone" as const,
      affected: [object],
      data: {
        object,
        destinationRef: nextFabDestinationRef(state, object),
        from: object.zone,
        to: "hand" as const,
        reason: "resolve" as const,
      },
    },
  ]);
  return { supported: true, events };
}
