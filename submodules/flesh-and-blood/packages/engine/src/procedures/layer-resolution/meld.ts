import type { FabEffect } from "@tcg/flesh-and-blood-types";
import type { FabMatchState } from "../../state.ts";
import type { ProposedEvent } from "../../rules/events.ts";
import { activeFabCardResolutionStep, type FabRulesStackLayer } from "../../rules/layers.ts";
import type { FabRulesProcess } from "../../rules/process.ts";
import { mutateInPlace } from "../../copy-on-write.ts";
import { openFabPriority } from "../../priority.ts";

export function effectsForLayer(layer: FabRulesStackLayer): readonly FabEffect[] {
  switch (layer.kind) {
    case "card":
      return activeFabCardResolutionStep(layer).effects;
    case "activated":
      return [layer.effect];
    case "triggered":
      if (layer.resolution.kind === "effect") return [layer.resolution.effect];
      {
        const modal = layer.resolution.ability;
        return [
          ...(modal.effect ? [modal.effect] : []),
          ...layer.modes.flatMap((modeId) => {
            const mode = modal.modes.find((candidate) => candidate.id === modeId);
            return mode ? [mode.effect] : [];
          }),
        ];
      }
  }
}

/** Whether the card layer still has another resolution-plan step, and whether it is the same printed face. */
export function cardResolutionCursor(layer: FabRulesStackLayer): {
  readonly hasNextCardResolutionStep: boolean;
  readonly hasNextAbilityOnSameFace: boolean;
} {
  const hasNextCardResolutionStep =
    layer.kind === "card" && layer.resolutionPlan.cursor + 1 < layer.resolutionPlan.steps.length;
  const nextCardResolutionStep =
    layer.kind === "card" ? layer.resolutionPlan.steps[layer.resolutionPlan.cursor + 1] : undefined;
  const hasNextAbilityOnSameFace =
    layer.kind === "card" &&
    nextCardResolutionStep !== undefined &&
    activeFabCardResolutionStep(layer).faceId === nextCardResolutionStep.faceId;
  return { hasNextCardResolutionStep, hasNextAbilityOnSameFace };
}

export function nextAbilityStepContinuation(
  layer: Extract<FabRulesStackLayer, { kind: "card" }>,
  groups: readonly (readonly ProposedEvent[])[],
): NonNullable<FabRulesProcess["abilityStepContinuation"]> {
  return {
    layerId: layer.layerId,
    fromCursor: layer.resolutionPlan.cursor,
    faceId: activeFabCardResolutionStep(layer).faceId,
    // Carry discard/search/etc. LKI onto the next same-face ability
    // (Sand Sketched Plan: a2 binding-matches the card discarded in a1).
    events: groups.flat(),
  };
}

/** Advance the card-layer resolution-plan cursor. Priority opens only between meld faces. */
export function advanceMultiFaceCursor(
  state: FabMatchState,
  layer: Extract<FabRulesStackLayer, { kind: "card" }>,
): FabMatchState {
  return mutateInPlace(state, (draft) => {
    const index = draft.rulesStack.findIndex((candidate) => candidate.layerId === layer.layerId);
    if (index < 0) throw new Error("The multi-part FAB layer disappeared before its next step.");
    const live = draft.rulesStack[index];
    if (
      !live ||
      live.kind !== "card" ||
      live.resolutionPlan.cursor + 1 >= live.resolutionPlan.steps.length
    ) {
      throw new Error("The FAB layer no longer has a pending resolution step.");
    }
    const currentStep = activeFabCardResolutionStep(live);
    const nextStep = live.resolutionPlan.steps[live.resolutionPlan.cursor + 1];
    if (!nextStep) throw new Error("The next FAB card resolution step disappeared.");
    draft.rulesStack[index] = {
      ...live,
      resolutionPlan: {
        ...live.resolutionPlan,
        cursor: live.resolutionPlan.cursor + 1,
      },
    };
    // Separate abilities on one printed face resolve in order without a
    // priority boundary. CR 5.3.4d opens priority only between meld faces.
    if (
      currentStep.faceId !== nextStep.faceId &&
      !draft.rulesProcess &&
      !draft.decision &&
      !draft.gameEnded
    ) {
      openFabPriority(draft, draft.activePlayerId, "layer");
    }
  });
}
