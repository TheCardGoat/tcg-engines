import type { FabEffect } from "@tcg/flesh-and-blood-types";
import type { ProposedEvent } from "../../events.ts";
import { reduceFabEventJournal } from "../../../kernel/event-journal.ts";
import type { FabRulesSnapshot } from "../../../kernel/transaction-kernel.ts";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import {
  conditionHolds,
  layerWithEventBindings,
  liveReanchorBindings,
  proposedObjectResetCount,
  withObjectIncarnationOffset,
} from "../shared.ts";
import { proposeEffect } from "../propose-effect.ts";

/**
 * Sequence steps re-see intermediate state after prior steps so later
 * conditionals (e.g. Kavdaen "Then if a hero has less {h}…") evaluate against
 * post-resolution life, not the pre-layer snapshot alone.
 */
export function proposeSequence(
  ctx: ProposalContext,
  effect: FabEffect & { type: "sequence" },
): FabEffectProposalResult {
  const events: ProposedEvent[] = [];
  const eventGroups: (readonly ProposedEvent[])[] = [];
  let resolvingLayer = ctx.layer;
  let workingState: FabRulesSnapshot = ctx.state;
  let resetOffset = 0;
  for (const [index, step] of effect.steps.entries()) {
    // CR 6.4.7: a self-replacement step is consumed by the step it replaces
    // (look-ahead below) and never proposes its own events here.
    if (step.type === "self-replacement") continue;
    const stepCtx: ProposalContext = {
      ...ctx,
      state: withObjectIncarnationOffset(workingState, resetOffset),
      layer: resolvingLayer,
      effectPath: [...ctx.effectPath, index],
      targetPath: `${ctx.targetPath}:step-${index}`,
    };
    // CR 6.4.7/6.4.7b: when the NEXT step is a self-replacement, evaluate its
    // condition now — the moment the preceding effect is generated — and, if
    // it holds, propose the modification effect in the preceding step's place. The
    // preceding effect's events are then never proposed nor committed: the
    // modified event occurs instead (6.4.6). CR 6.4.7a: the modification is
    // the catalog's rewrite of that same preceding event (same declared target /
    // appliesTo). Do not reanchor `selector: "self"` onto the previous ability.
    const upcoming = effect.steps[index + 1];
    let effective: FabEffect = step;
    if (upcoming?.type === "self-replacement") {
      if (!upcoming.condition || conditionHolds(stepCtx.state, stepCtx.layer, upcoming.condition)) {
        effective = upcoming.modification;
      }
    }
    const result = proposeEffect(stepCtx, effective);
    if (!result.supported) {
      // Unresolved "you may" must not drop earlier required steps in the same
      // sequence (Roiling Fissure: destroy aura, then you may destroy a Surge).
      if (effective.type === "optional") continue;
      return result;
    }
    events.push(...result.events);
    resetOffset += proposedObjectResetCount(result.events);
    const stepGroups = result.eventGroups ?? (result.events.length > 0 ? [result.events] : []);
    eventGroups.push(...stepGroups);
    resolvingLayer = layerWithEventBindings(resolvingLayer, result.events);
    if (result.events.length > 0) {
      const preview = reduceFabEventJournal(
        workingState,
        stepGroups.map((groupEvents, groupIndex) => ({
          eventGroupId: `${ctx.processId}:seq-preview-${index}-${groupIndex}`,
          required: true,
          events: [...groupEvents],
        })),
      );
      if (preview.committed) {
        workingState = preview.state;
        resetOffset = 0;
        // CR 6.4 / 8.5.3a: damage is dealt only after replacements commit a
        // positive packet. Proposal-time bindings cannot prove that fact: a
        // prevention may reduce the packet to zero and cancel the event. Keep
        // target facts from the proposal, but derive the dealt-damage latch
        // from the committed preview that later sequence conditionals observe.
        if (result.events.some((event) => event.name === "deal-damage")) {
          const dealtDamageToHero = preview.batches.some((batch) =>
            batch.events.some(
              (event) =>
                event.name === "deal-damage" &&
                "kind" in event.data.target &&
                event.data.target.kind === "hero" &&
                event.data.amount > 0,
            ),
          );
          const heroKeys = new Set<string>();
          for (const batch of preview.batches) {
            for (const event of batch.events) {
              if (event.name !== "deal-damage" || event.data.amount <= 0) continue;
              const damageTarget = event.data.target;
              if ("kind" in damageTarget && damageTarget.kind === "hero") {
                heroKeys.add(damageTarget.playerId);
                continue;
              }
              if ("instanceId" in damageTarget) {
                const types = damageTarget.current?.typeBox?.types ?? [];
                if (types.includes("Hero")) {
                  heroKeys.add(
                    damageTarget.controllerId ?? damageTarget.ownerId ?? damageTarget.instanceId,
                  );
                }
              }
            }
          }
          resolvingLayer = {
            ...resolvingLayer,
            bindings: {
              ...resolvingLayer.bindings,
              "dealt-damage-to-hero": dealtDamageToHero ? "true" : "false",
              "heroes-dealt-damage-this-way-count": heroKeys.size,
            },
          };
        }
        resolvingLayer = {
          ...resolvingLayer,
          bindings: liveReanchorBindings(workingState, resolvingLayer.bindings),
        };
      }
    }
  }
  return { supported: true, events, eventGroups };
}
