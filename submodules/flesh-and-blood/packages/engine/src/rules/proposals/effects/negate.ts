import type { FabEffect } from "@tcg/flesh-and-blood-types";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import { baseEvent, objectTargets, unsupported } from "../shared.ts";
import { nextFabDestinationRef, snapshotPlayerId } from "../../snapshots.ts";

export function proposeNegate(
  ctx: ProposalContext,
  effect: Extract<FabEffect, { type: "destroy" | "negate" }>,
): FabEffectProposalResult {
  const objects = objectTargets(
    ctx.state,
    ctx.layer,
    effect.target,
    ctx.targetPath,
    ctx.effectTargets,
    ctx.effectPath,
  );
  if (!objects) return unsupported(effect, "negate target is unresolved");
  const events = objects.flatMap((object, index) => {
    const recipient = object.ownerId ?? object.controllerId ?? snapshotPlayerId(object);
    const bindings = {
      ...ctx.layer.bindings,
      ...(effect.outputBinding ? { [effect.outputBinding]: object } : {}),
      it: object,
      ...(recipient ? { "target-controller": recipient } : {}),
    };
    if (effect.type === "negate" && effect.triggeredKeyword) {
      const keywordId = `keyword:${effect.triggeredKeyword}`;
      return ctx.state.rulesStack.flatMap((layer) =>
        layer.kind === "triggered" &&
        layer.abilityId === keywordId &&
        layer.source.instanceId === object.instanceId
          ? [
              {
                ...baseEvent(ctx.layer, ctx.processId),
                name: "remove-rules-layer" as const,
                affected: [object],
                bindings,
                data: { layerId: layer.layerId, reason: "ceased" as const },
              },
            ]
          : [],
      );
    }
    const targetLayer = ctx.state.rulesStack.find(
      (layer) => layer.kind === "card" && layer.instanceId === object.instanceId,
    );
    if (!targetLayer) return [];
    return [
      {
        ...baseEvent(ctx.layer, ctx.processId),
        name: "move-zone" as const,
        affected: [object],
        bindings,
        data: {
          object,
          destinationRef: nextFabDestinationRef(ctx.state, object, index),
          from: "stack" as const,
          to: "graveyard" as const,
          reason: "resolve" as const,
        },
      },
      {
        ...baseEvent(ctx.layer, ctx.processId),
        name: "remove-rules-layer" as const,
        affected: [object],
        bindings,
        data: { layerId: targetLayer.layerId, reason: "ceased" as const },
      },
    ];
  });
  return { supported: true, events, eventGroups: events.map((event) => [event]) };
}
