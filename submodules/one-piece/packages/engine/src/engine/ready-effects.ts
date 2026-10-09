import {
  isReadyEffectEligible,
  isReadyEffectStructurallyValid,
  triggerLabel,
} from "../effects/resolution.ts";
import { cardName, enqueueResolution, getCardForInstance, otherSeat } from "../shared.ts";
import { createChoicePrompt } from "../state.ts";
import type { MatchState } from "../types.ts";

/** Freeze the ready set before either player starts resolving it (8-6-1). */
export function prepareReadyEffect(state: MatchState): boolean {
  while (true) {
    if (!state.readyEffectGroup) {
      if (!state.pendingAutoEffects?.length) return false;
      state.readyEffectGroup = { turnPlayer: state.activeSeat, effects: state.pendingAutoEffects };
      state.pendingAutoEffects = undefined;
    }
    const group = state.readyEffectGroup;
    group.effects = group.effects.filter((item) => isReadyEffectStructurallyValid(state, item));
    if (!group.effects.length) {
      state.readyEffectGroup = undefined;
      continue;
    }
    const controller = group.effects.some((item) => item.controller === group.turnPlayer)
      ? group.turnPlayer
      : otherSeat(group.turnPlayer);
    const candidates = group.effects.filter(
      (item) => item.controller === controller && isReadyEffectEligible(state, item),
    );
    if (!candidates.length) {
      group.effects = group.effects.filter((item) => item.controller !== controller);
      continue;
    }
    if (candidates.length === 1) {
      const selected = candidates[0]!;
      group.effects = group.effects.filter((item) => item.id !== selected.id);
      enqueueResolution(state, { ...selected, readyEffectSelected: true }, { next: true });
      return true;
    }
    createChoicePrompt(state, {
      choiceKind: "chooseOption",
      seat: controller,
      label: "Choose the next effect to activate",
      details: "Resolve one of your effects that are ready to activate.",
      sourceCardId: null,
      sourceInstanceId: null,
      eventId: null,
      options: candidates.map((item) => ({
        id: item.id,
        value: item.id,
        targetId: item.sourceInstanceId,
        label: `${cardName(getCardForInstance(state, item.sourceInstanceId))} ${triggerLabel(item.trigger)} — effect ${item.blockIndex + 1}`,
      })),
      minSelections: 1,
      maxSelections: 1,
      context: { readyEffects: true },
      resolutionContext: {
        intent: "readyEffectOrder",
        controller,
        candidateIds: candidates.map((item) => item.id),
      },
    });
    return true;
  }
}
