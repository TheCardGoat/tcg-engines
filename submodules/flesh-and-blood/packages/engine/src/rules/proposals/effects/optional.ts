import type { FabEffect } from "@tcg/flesh-and-blood-types";
import type { ProposedEvent } from "../../events.ts";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import {
  layerWithEventBindings,
  proposedObjectResetCount,
  retrieveOptionalIsUnavailable,
  unsupported,
  withObjectIncarnationOffset,
} from "../shared.ts";
import { proposeEffect } from "../propose-effect.ts";
import { proposeContinuousRuleEffect } from "../continuous-rule-effects.ts";

/**
 * Optional ("you may") effects: when accepted, resolve the principal effect,
 * then any FabEffectBase.then continuation ("If you do, …") with bindings from
 * the principal events — same binding staging as sequence steps.
 */
export function proposeOptional(
  ctx: ProposalContext,
  effect: FabEffect & { type: "optional" },
): FabEffectProposalResult {
  // EVR170 family: "The next time an attack action card hits a hero this turn,
  // you may …". Catalog encodes that as optional + appliesTo.next. Do not
  // resolve the optional now; arm a one-shot delayed hit trigger.
  if (effect.appliesTo) {
    const { appliesTo: _appliesTo, ...immediate } = effect;
    return (
      proposeContinuousRuleEffect(ctx, {
        type: "delayed-trigger",
        trigger: {
          kind: "event",
          event: {
            name: "hit",
            actor: { kind: "any" },
            observes: {
              kind: "event-object",
              selector: "attack",
              relationship: { kind: "any" },
              filter: effect.appliesTo.next ?? {},
            },
            target: { kind: "hero" },
          },
        },
        policy: {
          kind: "windowed",
          duration: "this-turn",
          matching: "first",
        },
        resolution: {
          kind: "effect",
          effect: immediate,
        },
      }) ?? unsupported(effect, "next-hit optional delayed trigger is unsupported")
    );
  }
  const accepted = ctx.effectChoices[ctx.effectPath.join(".")];
  if (accepted === undefined) {
    // CR 8.5.51a: the decision finder suppressed a retrieve may whose
    // target cannot legally be paid for and equipped — resolve it as declined
    // instead of demanding a choice that was never offered.
    if (retrieveOptionalIsUnavailable(ctx.state, ctx.layer, effect.effect)) {
      return { supported: true, events: [] };
    }
    return unsupported(effect, "optional choice is unresolved");
  }
  if (!accepted) return { supported: true, events: [] };

  const main = proposeEffect(
    { ...ctx, effectPath: [...ctx.effectPath, 0], targetPath: `${ctx.targetPath}:effect` },
    effect.effect,
  );
  if (!main.supported) return main;
  if (!effect.then) return main;

  // "If you do, …" (CR 1.13.4): the continuation only stages when the principal
  // effect actually produced events (e.g. pay-life succeeded). An accepted
  // optional that could not pay must not grant the then-branch (Vynnset).
  const mainSucceeded =
    main.outcome === "committed" ||
    (main.outcome === undefined &&
      (main.events.length > 0 || (main.eventGroups?.some((group) => group.length > 0) ?? false)));
  if (!mainSucceeded) return main;

  const thenCtx: ProposalContext = {
    ...ctx,
    state: withObjectIncarnationOffset(ctx.state, proposedObjectResetCount(main.events)),
    layer: layerWithEventBindings(ctx.layer, main.events),
    effectPath: [...ctx.effectPath, 1],
    targetPath: `${ctx.targetPath}:then`,
  };
  const thenResult = proposeEffect(thenCtx, effect.then);
  if (!thenResult.supported) return thenResult;

  const events: ProposedEvent[] = [...main.events, ...thenResult.events];
  const eventGroups = [
    ...(main.eventGroups ?? (main.events.length > 0 ? [main.events] : [])),
    ...(thenResult.eventGroups ?? (thenResult.events.length > 0 ? [thenResult.events] : [])),
  ];
  return { supported: true, events, eventGroups };
}
