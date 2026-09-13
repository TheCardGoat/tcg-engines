import { snapshotObject } from "../../snapshots.ts";
import type { FabLayerResolutionResult } from "../result.ts";
import type { LayerDecisionCtx } from "./context.ts";
import { createFabPartitionDecision } from "../../../kernel/decision-builders.ts";
import { publishFabDecision } from "../../../kernel/decision-state.ts";
import { resolveLayerAmount } from "../../proposals/shared.ts";

export function handleOpt(ctx: LayerDecisionCtx<"opt">): FabLayerResolutionResult {
  const { state, layer, process, decision } = ctx;

  // CR 8.5.22 / 5.1.3a: resolve Opt N from the play-time X binding (0 when
  // the card was played without paying a cost that includes X).
  const resolved = resolveLayerAmount(state, layer, decision.effect.count) ?? 0;
  const count = Number.isFinite(resolved) ? Math.max(0, Math.floor(resolved)) : 0;
  if (count === 0) {
    return ctx.advance(state, layer, ctx.options);
  }
  const entries = state.containers.zonesByPlayerId[layer.controllerId]!.deck.slice(-count)
    .reverse()
    .map((instanceId) => {
      const snapshot = snapshotObject(state, instanceId, layer.controllerId, "deck");
      return {
        id: instanceId,
        label: snapshot.current.names.join(" // ") || instanceId,
        source: {
          instanceId,
          ...(snapshot.canonicalId ? { canonicalId: snapshot.canonicalId } : {}),
          ownerId: layer.controllerId,
        },
      };
    });
  publishFabDecision(
    state,
    createFabPartitionDecision(state, {
      actorId: layer.controllerId,
      label: `Opt ${count}.`,
      source: {
        instanceId: layer.source.instanceId,
        ...(layer.source.canonicalId ? { canonicalId: layer.source.canonicalId } : {}),
        ownerId: layer.source.ownerId,
      },
      entries,
      groups: [
        {
          id: "top",
          label: "Keep on top",
          ordered: true,
          orderDirection: "bottom-first",
        },
        {
          id: "bottom",
          label: "Put on bottom",
          ordered: true,
          orderDirection: "bottom-first",
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
