import { snapshotObject } from "../../snapshots.ts";
import type { FabLayerResolutionResult } from "../result.ts";
import type { LayerDecisionCtx } from "./context.ts";
import { createFabPartitionDecision } from "../../../kernel/decision-builders.ts";
import { publishFabDecision } from "../../../kernel/decision-state.ts";
import { objectTargets } from "../../proposals/shared.ts";

/** Opens the single-destination ordering choice used by “put them back in any order”. */
export function handleReorderDeck(ctx: LayerDecisionCtx<"reorder-deck">): FabLayerResolutionResult {
  const { state, layer, process, decision } = ctx;
  const objects = objectTargets(
    state,
    layer,
    decision.effect.target,
    "reorder-deck",
    {},
    decision.path,
  );
  if (!objects || objects.length === 0) return ctx.advance(state, layer, ctx.options);
  const deckOwnerId = objects[0]!.ownerId;
  const possessive = deckOwnerId === layer.controllerId ? "your" : "their";
  const groupId = decision.effect.position;
  publishFabDecision(
    state,
    createFabPartitionDecision(state, {
      actorId: layer.controllerId,
      label:
        decision.effect.position === "top"
          ? `Put the revealed cards back on top of ${possessive} deck in any order.`
          : `Put the revealed cards back on the bottom of ${possessive} deck in any order.`,
      source: {
        instanceId: layer.source.instanceId,
        ...(layer.source.canonicalId ? { canonicalId: layer.source.canonicalId } : {}),
        ownerId: layer.source.ownerId,
      },
      entries: objects.map((object) => {
        const snapshot = snapshotObject(state, object.instanceId, object.ownerId, "deck");
        return {
          id: object.instanceId,
          label: snapshot.current.names.join(" // ") || object.instanceId,
          source: {
            instanceId: object.instanceId,
            ...(snapshot.canonicalId ? { canonicalId: snapshot.canonicalId } : {}),
            ownerId: object.ownerId,
          },
        };
      }),
      groups: [
        {
          id: groupId,
          ordered: true,
          orderDirection: "bottom-first",
          label: decision.effect.position === "top" ? "Top of deck" : "Bottom of deck",
        },
      ],
      continuation: {
        kind: "effect-resolution",
        processId: process.processId,
        layerId: layer.layerId,
        effectPath: decision.path,
      },
    }),
  );
  return { accepted: true, state };
}
