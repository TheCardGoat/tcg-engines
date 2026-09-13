import type { FabEffect } from "@tcg/flesh-and-blood-types";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import { baseEvent } from "../shared.ts";

export function proposeReturnToBrood(
  ctx: ProposalContext,
  _effect: FabEffect & { type: "return-to-brood" },
): FabEffectProposalResult {
  const { state, layer, processId } = ctx;
  const heroId = state.containers.zonesByPlayerId[layer.controllerId]?.heroZone[0];
  const hero = heroId ? state.objects[heroId] : null;
  if (!hero) return { supported: true, events: [] };
  const effectIds = state.continuousEffectInstances
    .filter(
      (instance) =>
        instance.controllerId === layer.controllerId &&
        instance.atoms.some(
          (atom) =>
            atom.kind === "copy" &&
            instance.initialSubjects.some(
              (subject) =>
                subject.instanceId === hero.instanceId && subject.incarnation === hero.incarnation,
            ),
        ),
    )
    .map((instance) => instance.effectId);
  return {
    supported: true,
    events: effectIds.map((effectId) => ({
      ...baseEvent(layer, processId),
      name: "continuous-effect-ceased" as const,
      affected: [layer.source],
      data: { effectId },
    })),
  };
}
