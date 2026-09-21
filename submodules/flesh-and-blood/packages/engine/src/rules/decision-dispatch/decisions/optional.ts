import type { FabEffect, FabPlayer } from "@tcg/flesh-and-blood-types";
import type { FabLayerResolutionResult } from "../result.ts";
import type { LayerDecisionCtx } from "./context.ts";
import { createFabOptionalDecision } from "../../../kernel/decision-builders.ts";
import { publishFabDecision } from "../../../kernel/decision-state.ts";
import { fabLayerTargets } from "../../layers.ts";
import { collectDeclaredTargets } from "../../../kernel/trigger-declaration.ts";
import { heroTargets, playersForFabPlayer, resolveLayerAmount } from "../../proposals/shared.ts";
import { activationPaymentCandidates } from "../../../procedures/activate-ability/helpers.ts";

/** Resolve who answers an optional ("each other hero may…"). */
export function optionalChooserActorId(
  layer: import("../../layers.ts").FabRulesStackLayer,
  state: import("../../../state.ts").FabMatchState,
  chooser: FabPlayer | undefined,
): string {
  if (!chooser || chooser === "controller" || chooser === "self") return layer.controllerId;
  if (typeof chooser === "object") {
    const bound = layer.bindings[chooser.binding];
    if (typeof bound === "string" && state.playerIds.some((playerId) => playerId === bound))
      return bound;
    return layer.controllerId;
  }
  if (chooser === "iteration-subject") {
    const subject = layer.bindings["iteration-subject"];
    if (typeof subject === "string" && state.playerIds.some((playerId) => playerId === subject))
      return subject;
  }
  if (chooser === "opponent" || chooser === "another-hero" || chooser === "each-other-hero") {
    return state.playerIds.find((id) => id !== layer.controllerId) ?? layer.controllerId;
  }
  // Unless-escape / combat-facing optionals answered by the attacking seat.
  if (chooser === "attacking-hero") {
    return (
      state.combat?.activeLink?.attackingPlayerId ??
      state.playerIds.find((id) => id !== layer.controllerId) ??
      layer.controllerId
    );
  }
  if (chooser === "winner" || chooser === "loser") {
    const bound = layer.bindings[chooser];
    if (typeof bound === "string" && state.playerIds.some((playerId) => playerId === bound)) {
      return bound;
    }
  }
  // Unless-escape payers named relative to the materialized effect target
  // ("they discard unless they pay…") answer from that seat.
  if (chooser === "target-controller") {
    const resolved = playersForFabPlayer(state, layer.controllerId, chooser, layer.bindings);
    if (resolved?.length === 1) return resolved[0]!;
  }
  return layer.controllerId;
}

/** A bound source only exists when its preceding effect actually succeeded. */
function hasMissingBoundPlaySource(
  effect: FabEffect,
  bindings: Readonly<Record<string, unknown>>,
): boolean {
  const available = new Set(Object.keys(bindings));

  const walk = (candidate: FabEffect, prior: Set<string>): boolean => {
    if (
      candidate.type === "play-card" &&
      candidate.source.selector === "binding" &&
      !prior.has(candidate.source.binding)
    ) {
      return true;
    }

    if (candidate.type === "sequence") {
      const sequential = new Set(prior);
      for (const step of candidate.steps) {
        if (walk(step, sequential)) return true;
        if (step.outputBinding) sequential.add(step.outputBinding);
      }
      return false;
    }

    if (candidate.type === "conditional") {
      return (
        walk(candidate.then, new Set(prior)) ||
        (candidate.else ? walk(candidate.else, new Set(prior)) : false)
      );
    }

    if (candidate.type === "optional") {
      const nested = new Set(prior);
      if (walk(candidate.effect, nested)) return true;
      if (candidate.effect.outputBinding) nested.add(candidate.effect.outputBinding);
      return candidate.then ? walk(candidate.then, nested) : false;
    }

    return false;
  };

  return walk(effect, available);
}

/**
 * An optional self-destruction has a single, player-visible consequence. Name
 * both branches so the prompt does not make the permission look mandatory.
 * Other optional effects keep the generic labels because their nested effect
 * can contain several instructions or a later target choice.
 */
function optionalDecisionLabels(
  effect: FabEffect,
): { readonly acceptLabel: "Destroy this"; readonly declineLabel: "Don't destroy" } | undefined {
  return effect.type === "destroy" && effect.target.selector === "self"
    ? { acceptLabel: "Destroy this", declineLabel: "Don't destroy" }
    : undefined;
}

/** Each required hero occurrence must be feasible before offering the enclosing may. */
function optionalPrincipalOccurrences(
  state: LayerDecisionCtx<"optional">["state"],
  layer: LayerDecisionCtx<"optional">["layer"],
  effect: FabEffect,
  targetPath: string,
): readonly { effect: FabEffect; layer: LayerDecisionCtx<"optional">["layer"] }[] {
  if (effect.type !== "for-each") return [{ effect, layer }];
  const subjects = heroTargets(state, layer, effect.target, targetPath);
  if (subjects === null) return [{ effect, layer }];
  return subjects.flatMap((playerId, index) =>
    optionalPrincipalOccurrences(
      state,
      { ...layer, bindings: { ...layer.bindings, "iteration-subject": playerId } },
      effect.effect,
      `${targetPath}:for-each-${index}`,
    ),
  );
}

export function handleOptional(ctx: LayerDecisionCtx<"optional">): FabLayerResolutionResult {
  const { state, layer, process, options, decision } = ctx;
  const chooserId = optionalChooserActorId(layer, state, decision.effect.chooser);

  const principal = decision.effect.effect;
  if (
    principal.type === "pay" &&
    principal.cost.class === "asset" &&
    principal.cost.type === "resources"
  ) {
    const payerIds = playersForFabPlayer(
      state,
      layer.controllerId,
      principal.payer,
      layer.bindings,
    );
    const amount =
      typeof principal.cost.amount === "number"
        ? principal.cost.amount
        : resolveLayerAmount(state, layer, principal.cost.amount);
    const payerId = payerIds?.length === 1 ? payerIds[0]! : null;
    const pitchable = payerId
      ? activationPaymentCandidates(state, payerId, [], "resources").reduce(
          (total, candidate) => total + candidate.value,
          0,
        )
      : 0;
    // Up-to {r} is payable at 0..min(available, cap). Do not auto-decline
    // when the player has fewer than the printed maximum (Cutting Retort).
    const isUpTo =
      typeof principal.cost.amount !== "number" && principal.cost.amount.type === "up-to";
    const available =
      payerId === null ? 0 : (state.players[payerId]?.resourcePoints ?? 0) + pitchable;
    // Up-to {r} is payable at 1..min(available, cap). With 0 resources there
    // is no positive payment, so skip the may (same as an unpayable exact
    // cost). Do not auto-decline when available is below the printed maximum
    // but still positive (Cutting Retort: 2{r} of up-to 3).
    if (payerId === null || amount === null || (isUpTo ? available < 1 : available < amount)) {
      process.effectChoices[decision.path.join(".")] = false;
      return ctx.advance(state, layer, options);
    }
  }

  // An optional permission to play a card produced by a preceding step (for
  // example Rattle Bones) has no acceptance path when that step's target was
  // gone and consequently produced no binding. Do not persist a dead prompt.
  if (hasMissingBoundPlaySource(decision.effect.effect, layer.bindings)) {
    process.effectChoices[decision.path.join(".")] = false;
    return ctx.advance(state, layer, options);
  }

  const declaredOptionalTargets = collectDeclaredTargets(
    decision.effect.effect,
    `${decision.targetPath}:effect`,
    undefined,
    decision.targetPath,
  ).filter((requirement) => requirement.optionalEffectPath === decision.targetPath);
  if (declaredOptionalTargets.length > 0) {
    const answers = fabLayerTargets(layer);
    const unanswered = declaredOptionalTargets.find(({ key }) => !(key in answers));
    if (unanswered) {
      return ctx.failure(
        state,
        `The optional target ${unanswered.key} was not declared before resolution.`,
        "unsupported_effect_target",
      );
    }
    // CR 1.8.5e: zero targets means the optional targeted effect was not
    // generated. A non-empty declaration is the may-choice itself, so no
    // second boolean decision is published at resolution.
    process.effectChoices[decision.path.join(".")] = declaredOptionalTargets.every(
      ({ key }) => (answers[key]?.length ?? 0) > 0,
    );
    return ctx.advance(state, layer, options);
  }

  // A choice-principal optional ("you may discard or destroy…") must persist
  // the boolean even when one arm has no legal target. The player still
  // answers yes/no, then picks an available arm.
  for (const occurrence of optionalPrincipalOccurrences(
    state,
    layer,
    principal,
    `${decision.targetPath}:effect`,
  )) {
    const requiredTarget =
      occurrence.effect.type === "choice"
        ? null
        : ctx.firstRequiredAtResolutionTarget(occurrence.effect);
    if (requiredTarget) {
      // Pre-check uses the layer controller + bindings (same as resolution),
      // not the chooser seat. For-each optionals bind iteration-subject and
      // target `player: "iteration-subject"` so the scan finds that seat's
      // cards without rebinding controllerId to the chooser.
      const candidates = options.legalTargets(
        state,
        {
          controllerId: layer.controllerId,
          source: layer.source,
          abilityId: layer.kind === "triggered" ? layer.abilityId : layer.layerId,
          bindings: occurrence.layer.bindings,
        },
        requiredTarget as Parameters<typeof options.legalTargets>[2],
      );
      // "You may destroy 3 Gold" requires enough legal targets for a non-upTo
      // numeric count — fewer than N is not a legal acceptance path (match-fixer).
      const requiredCount =
        requiredTarget &&
        typeof requiredTarget === "object" &&
        "count" in requiredTarget &&
        typeof (requiredTarget as { count?: unknown }).count === "number" &&
        !(requiredTarget as { upTo?: boolean }).upTo
          ? ((requiredTarget as { count: number }).count as number)
          : 1;
      if (candidates.length < requiredCount) {
        process.effectChoices[decision.path.join(".")] = false;
        return ctx.advance(state, layer, options);
      }
    }
  }
  publishFabDecision(
    state,
    createFabOptionalDecision(state, {
      actorId: chooserId,
      label: `Use the optional effect of ${layer.source.current.names.join(" // ") || layer.layerId}?`,
      ...optionalDecisionLabels(principal),
      source: {
        instanceId: layer.source.instanceId,
        ...(layer.source.canonicalId ? { canonicalId: layer.source.canonicalId } : {}),
        ownerId: layer.source.ownerId,
      },
      continuation: {
        kind: "optional-effect",
        processId: process.processId,
        effectPath: decision.path,
      },
    }),
  );
  return { accepted: true, state };
}
