import type { GrandArchiveContinuousEffectInstance } from "../../game/model.ts";
import type { GrandArchiveEvaluationContext } from "../../procedures/effects/evaluation.ts";

/** A resolved modifier evaluates from its own source, never the caller's source checkpoint. */
export function continuousEffectSourceContext(
  instance: GrandArchiveContinuousEffectInstance,
): Pick<
  GrandArchiveEvaluationContext,
  | "sourceId"
  | "abilityBearerId"
  | "sourceIdentityId"
  | "sourceIncarnation"
  | "sourceLkiEventId"
  | "sourceInformationBasis"
> {
  return {
    sourceId: instance.sourceId,
    abilityBearerId: instance.sourceId,
    sourceIdentityId: instance.sourceId,
    sourceIncarnation: instance.sourceIncarnation,
    sourceLkiEventId: instance.sourceLkiEventId,
    sourceInformationBasis: undefined,
  };
}
