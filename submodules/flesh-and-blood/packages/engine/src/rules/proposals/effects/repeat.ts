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
  unsupported,
  withObjectIncarnationOffset,
} from "../shared.ts";
import { proposeEffect } from "../propose-effect.ts";
import { isStarRepeatTimes, resolveRepeatTimes } from "../resolve-repeat-times.ts";

export function proposeRepeat(
  ctx: ProposalContext,
  effect: FabEffect & { type: "repeat" },
): FabEffectProposalResult {
  const times = resolveRepeatTimes(ctx.state, ctx.layer, effect.times, effect.until);
  if (times === null) {
    return unsupported(effect, "repeat requires a bounded constant count");
  }
  const untilSatisfied =
    isStarRepeatTimes(effect.times) || (effect.times === undefined && effect.until !== undefined);
  const events: ProposedEvent[] = [];
  const eventGroups: (readonly ProposedEvent[])[] = [];
  let resolvingLayer = ctx.layer;
  let workingState: FabRulesSnapshot = ctx.state;
  let resetOffset = 0;
  for (let index = 0; index < times; index += 1) {
    if (
      untilSatisfied &&
      index > 0 &&
      !iterationChoiceAccepted(ctx.effectChoices, [...ctx.effectPath, index - 1])
    ) {
      break;
    }
    const repeatCtx: ProposalContext = {
      ...ctx,
      state: withObjectIncarnationOffset(workingState, resetOffset),
      layer: resolvingLayer,
      effectPath: [...ctx.effectPath, index],
      targetPath: `${ctx.targetPath}:repeat-${index}`,
    };
    const result = proposeEffect(repeatCtx, effect.effect);
    if (!result.supported) {
      // "Repeat this process" ends when the process can no longer be
      // performed (empty deck, no legal banish). The first iteration is
      // included: an already-empty deck means the process never starts.
      if (untilSatisfied) break;
      return result;
    }
    if (result.events.length === 0) break;
    events.push(...result.events);
    resetOffset += proposedObjectResetCount(result.events);
    const iterationGroups = result.eventGroups ?? (result.events.length > 0 ? [result.events] : []);
    eventGroups.push(...iterationGroups);
    resolvingLayer = layerWithEventBindings(resolvingLayer, result.events);
    if (iterationGroups.length > 0) {
      const preview = reduceFabEventJournal(
        workingState,
        iterationGroups.map((groupEvents, groupIndex) => ({
          eventGroupId: `${ctx.processId}:repeat-preview-${index}-${groupIndex}`,
          required: true,
          events: [...groupEvents],
        })),
      );
      if (preview.committed) {
        workingState = preview.state;
        resetOffset = 0;
        resolvingLayer = {
          ...resolvingLayer,
          bindings: liveReanchorBindings(workingState, resolvingLayer.bindings),
        };
      }
    }
    if (untilSatisfied && starRepeatTerminalHolds(effect.effect, workingState, resolvingLayer)) {
      break;
    }
  }
  return {
    supported: true,
    events,
    eventGroups: eventGroups.length > 0 ? eventGroups : events.length > 0 ? [events] : [],
  };
}

function iterationChoiceAccepted(
  choices: Readonly<Record<string, boolean>> | undefined,
  iterationPath: readonly number[],
): boolean {
  if (!choices) return false;
  const prefix = iterationPath.join(".");
  return Object.entries(choices).some(
    ([key, value]) => value === true && (key === prefix || key.startsWith(`${prefix}.`)),
  );
}

/** Stop "repeat this process" once a terminal then-branch (no else) has fired. */
export function starRepeatTerminalHolds(
  effect: FabEffect,
  state: FabRulesSnapshot,
  layer: ProposalContext["layer"],
): boolean {
  if (effect.type === "conditional" && !effect.else) {
    return conditionHolds(state, layer, effect.condition);
  }
  if (effect.type === "sequence") {
    return effect.steps.some((step) => starRepeatTerminalHolds(step, state, layer));
  }
  if (effect.type === "optional") {
    return starRepeatTerminalHolds(effect.effect, state, layer);
  }
  return false;
}
