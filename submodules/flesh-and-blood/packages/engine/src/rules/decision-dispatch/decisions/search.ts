import type { FabLayerResolutionResult } from "../result.ts";
import type { LayerDecisionCtx } from "./context.ts";
import { createFabEntityTargetDecision } from "../../../kernel/decision-builders.ts";
import { publishFabDecision } from "../../../kernel/decision-state.ts";
import { playersForFabPlayer, resolveSearchCount } from "../../proposals/shared.ts";
import { fabLayerTargets } from "../../layers.ts";

export function handleSearch(ctx: LayerDecisionCtx<"search">): FabLayerResolutionResult {
  const { state, layer, process, options, decision } = ctx;

  const effect = decision.effect;
  const resolved = resolveSearchCount(state, layer, effect);
  if (resolved === null || effect.to.position === "top-or-bottom" || effect.to.asAttacking) {
    return ctx.failure(
      state,
      "This search decision shape is not migrated.",
      "unsupported_search_decision",
    );
  }
  const count = Math.max(0, resolved.count);
  const searchZones =
    effect.zones.length > 0
      ? effect.zones
      : (["deck", "hand", "graveyard", "arsenal", "banished"] as const);
  const searchPlayerIds = playersForFabPlayer(
    state,
    layer.controllerId,
    effect.player ?? "controller",
    layer.bindings,
  );
  const searchActorId = searchPlayerIds?.[0] ?? layer.controllerId;
  const candidates = options.legalTargets(
    state,
    {
      controllerId: layer.controllerId,
      source: layer.source,
      abilityId: layer.kind === "triggered" ? layer.abilityId : layer.layerId,
      bindings: layer.bindings,
      declaredTargets: fabLayerTargets(layer),
    },
    {
      selector: "object",
      declared: "at-resolution",
      player: effect.player ?? "controller",
      zones: [...searchZones],
      filter: effect.fromBinding
        ? { ...effect.filter, inObjectBinding: effect.fromBinding }
        : effect.filter,
      count,
    },
  );
  publishFabDecision(
    state,
    createFabEntityTargetDecision(state, {
      actorId: searchActorId,
      label: `Search for ${count === 1 ? "a card" : `up to ${count} cards`}.`,
      requestedCount: count,
      upTo: resolved.upTo,
      candidates: candidates.map((candidate) => {
        if (candidate.target.kind !== "object") return candidate;
        const object = state.objects[candidate.target.ref.instanceId];
        if (!object || object.incarnation !== candidate.target.ref.incarnation) return candidate;
        return {
          ...candidate,
          source: {
            instanceId: candidate.target.ref.instanceId,
            ...(object.canonicalId ? { canonicalId: object.canonicalId } : {}),
            ownerId: object.ownerId,
          },
        };
      }),
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
