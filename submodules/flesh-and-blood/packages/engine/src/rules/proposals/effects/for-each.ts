import type { FabEffect } from "@tcg/flesh-and-blood-types";
import type { ProposedEvent } from "../../events.ts";
import { reduceFabEventJournal } from "../../../kernel/event-journal.ts";
import type { FabRulesSnapshot } from "../../../kernel/transaction-kernel.ts";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import { baseEvent, heroTargets, layerWithEventBindings, unsupported } from "../shared.ts";
import { proposeEffect } from "../propose-effect.ts";

/** Layer binding key for the current for-each hero subject. */
export const FOR_EACH_SUBJECT_BINDING = "iteration-subject";

/**
 * Iterate a deterministic hero set and run the inner effect once per hero.
 *
 * Ability `controllerId` is preserved ("you create a Silver" — Genis).
 * Each iteration binds `iteration-subject` to the current hero so relative
 * "they" effects and optional choosers can target that seat.
 *
 * Empty hero sets (e.g. tied life extrema) are a supported no-op.
 * Legacy random token choice remains supported as a fast path.
 */
export function proposeForEach(
  ctx: ProposalContext,
  effect: FabEffect & { type: "for-each" },
): FabEffectProposalResult {
  const playerIds = heroTargets(ctx.state, ctx.layer, effect.target, ctx.targetPath);
  if (!playerIds) return unsupported(effect, "for-each target is not a deterministic hero set");
  if (playerIds.length === 0) return { supported: true, events: [] };

  const inner = effect.effect;
  // Fast path: random token choice under each hero (existing Plague Hive family).
  if (
    inner.type === "choose-and-create-token" &&
    inner.random === true &&
    inner.options.length > 0
  ) {
    return {
      supported: true,
      events: playerIds.map((playerId, index) => ({
        ...baseEvent(ctx.layer, ctx.processId),
        name: "random-token-request" as const,
        affected: [],
        data: {
          playerId,
          options: inner.options,
          instanceId: `${ctx.processId}:${ctx.layer.layerId}:${ctx.targetPath}:random-token-${index}`,
        },
      })),
    };
  }

  const events: ProposedEvent[] = [];
  const eventGroups: (readonly ProposedEvent[])[] = [];
  let resolvingLayer = ctx.layer;
  let workingState: FabRulesSnapshot = ctx.state;
  for (const [index, playerId] of playerIds.entries()) {
    const subjectLayer = {
      ...resolvingLayer,
      bindings: {
        ...resolvingLayer.bindings,
        [FOR_EACH_SUBJECT_BINDING]: playerId,
      },
    };
    const result = proposeEffect(
      {
        ...ctx,
        state: workingState,
        layer: subjectLayer,
        effectPath: [...ctx.effectPath, index],
        targetPath: `${ctx.targetPath}:for-each-${index}`,
      },
      inner,
    );
    if (!result.supported) return result;
    events.push(...result.events);
    const iterationGroups = result.eventGroups ?? (result.events.length > 0 ? [result.events] : []);
    eventGroups.push(...iterationGroups);
    if (iterationGroups.length > 0) {
      const preview = reduceFabEventJournal(
        workingState,
        iterationGroups.map((groupEvents, groupIndex) => ({
          eventGroupId: `${ctx.processId}:for-each-preview-${index}-${groupIndex}`,
          required: true,
          events: [...groupEvents],
        })),
      );
      if (preview.committed) workingState = preview.state;
    }
    // Carry create-this-way / observation bindings into later iterations.
    resolvingLayer = layerWithEventBindings(subjectLayer, result.events);
  }
  return {
    supported: true,
    events,
    eventGroups: eventGroups.length > 0 ? eventGroups : undefined,
  };
}
