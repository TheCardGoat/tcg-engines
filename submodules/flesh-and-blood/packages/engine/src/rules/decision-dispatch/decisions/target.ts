import type { FabLayerResolutionResult } from "../result.ts";
import type { LayerDecisionCtx } from "./context.ts";
import { createFabEntityTargetDecision } from "../../../kernel/decision-builders.ts";
import { publishFabDecision } from "../../../kernel/decision-state.ts";
import { resolveLayerAmount } from "../../proposals/shared.ts";
import { fabLayerTargets } from "../../layers.ts";
import {
  distinctPrintedNameCount,
  targetRequiresDifferentNames,
} from "../../../kernel/different-names.ts";

/**
 * Legal-target scans must use the same controller perspective as
 * `objectTargets` at resolution: layer.controllerId.
 *
 * `decision.actorId` is only who answers the choice (e.g. the opponent
 * picks which card to discard from their hand). Player-relative terms
 * like `player: "opponent"` stay relative to the effect controller.
 * For-each "they" effects bind `iteration-subject` and use
 * `player: "iteration-subject"` so seat resolution does not need to
 * rebind the scan controller to the chooser.
 */
export function handleTarget(ctx: LayerDecisionCtx<"target">): FabLayerResolutionResult {
  const { state, layer, process, options, decision } = ctx;

  if (decision.target.selector === "any-hero") {
    const candidates =
      decision.candidates ??
      options.legalTargets(
        state,
        {
          controllerId: layer.controllerId,
          source: layer.source,
          abilityId: layer.kind === "triggered" ? layer.abilityId : layer.layerId,
          bindings: layer.bindings,
          declaredTargets: fabLayerTargets(layer),
        },
        decision.target,
      );
    publishFabDecision(
      state,
      createFabEntityTargetDecision(state, {
        actorId: decision.actorId,
        label: `Choose a hero for ${layer.source.current.names.join(" // ") || layer.layerId}.`,
        requestedCount: 1,
        upTo: false,
        candidates,
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

  const count = decision.target.count;
  if (count !== undefined && typeof count !== "number" && count.type === "all") {
    // `all`: auto-select every legal target.
    const candidates =
      decision.candidates ??
      options.legalTargets(
        state,
        {
          controllerId: layer.controllerId,
          source: layer.source,
          abilityId: layer.kind === "triggered" ? layer.abilityId : layer.layerId,
          bindings: layer.bindings,
          declaredTargets: fabLayerTargets(layer),
        },
        decision.target,
      );
    process.effectTargets[decision.path.join(".")] = candidates.map(
      (candidate) => candidate.target,
    );
    return ctx.advance(state, layer, options);
  }
  if (count !== undefined && typeof count !== "number" && count.type === "any-number") {
    // `any-number`: player chooses 0..N of the legal set.
    const candidates =
      decision.candidates ??
      options.legalTargets(
        state,
        {
          controllerId: layer.controllerId,
          source: layer.source,
          abilityId: layer.kind === "triggered" ? layer.abilityId : layer.layerId,
          bindings: layer.bindings,
          declaredTargets: fabLayerTargets(layer),
        },
        decision.target,
      );
    if (candidates.length === 0) {
      process.effectTargets[decision.path.join(".")] = [];
      return ctx.advance(state, layer, options);
    }
    publishFabDecision(
      state,
      createFabEntityTargetDecision(state, {
        actorId: decision.actorId,
        label: `Choose any number of cards for ${layer.source.current.names.join(" // ") || layer.layerId}.`,
        requestedCount: candidates.length,
        upTo: true,
        candidates,
        continuation: {
          kind: "effect-resolution",
          processId: process.processId,
          layerId: layer.layerId,
          effectPath: decision.path,
        },
        differentNames: targetRequiresDifferentNames(decision.target),
      }),
    );
    return { accepted: true, state };
  }
  const resolvedCount = count === undefined ? null : resolveLayerAmount(state, layer, count);
  if (resolvedCount === null || !Number.isInteger(resolvedCount) || resolvedCount < 0) {
    return ctx.failure(
      state,
      "This at-resolution target count could not be resolved.",
      "unsupported_effect_target",
    );
  }
  const candidates =
    decision.candidates ??
    options.legalTargets(
      state,
      {
        controllerId: layer.controllerId,
        source: layer.source,
        abilityId: layer.kind === "triggered" ? layer.abilityId : layer.layerId,
        bindings: layer.bindings,
        declaredTargets: fabLayerTargets(layer),
      },
      decision.target,
    );
  const isUpTo =
    decision.target.upTo === true ||
    (typeof count === "object" && count !== undefined && count.type === "up-to");
  if (isUpTo && candidates.length === 0) {
    process.effectTargets[decision.path.join(".")] = [];
    return ctx.advance(state, layer, options);
  }
  if (
    !isUpTo &&
    resolvedCount > 0 &&
    targetRequiresDifferentNames(decision.target) &&
    distinctPrintedNameCount(candidates) < resolvedCount
  ) {
    process.effectTargets[decision.path.join(".")] = [];
    return ctx.advance(state, layer, options);
  }
  publishFabDecision(
    state,
    createFabEntityTargetDecision(state, {
      actorId: decision.actorId,
      label: `Choose ${resolvedCount === 1 ? "a card" : `${resolvedCount} cards`} for ${layer.source.current.names.join(" // ") || layer.layerId}.`,
      requestedCount: resolvedCount,
      upTo: isUpTo,
      candidates,
      continuation: {
        kind: "effect-resolution",
        processId: process.processId,
        layerId: layer.layerId,
        effectPath: decision.path,
      },
      differentNames: targetRequiresDifferentNames(decision.target),
    }),
  );
  return { accepted: true, state };
}
