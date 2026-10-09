import type { Condition } from "@tcg/lorcana-types";
import type { CardPlayedPayload, LorcanaG } from "../../../types";
import type { ActionResolutionInput } from "./types";
import type { CardRuntimeReadAPI, DeepReadonly, FrameworkReadAPI } from "../../../core/runtime";
import { evaluateCondition } from "../../../rules/condition-evaluator";
import { buildConditionContext } from "../../../rules/condition-context";

type ActionConditionRuntimeContext = {
  G: DeepReadonly<LorcanaG>;
  framework: FrameworkReadAPI;
  cards: CardRuntimeReadAPI;
};

export function evaluateActionCondition(
  condition: Condition | undefined,
  ctx: ActionConditionRuntimeContext,
  cardPlayed: CardPlayedPayload,
  resolutionInput: ActionResolutionInput,
  /**
   * The triggering play event's subject, when different from the ability
   * source. `sourceCardId`/`playerId` always anchor to `cardPlayed` (the
   * ability source: `has-card-under`, controller-scoped "you" conditions);
   * event-identity conditions (`played-card-name` etc.) read this payload.
   */
  eventCardPlayed?: CardPlayedPayload,
): boolean {
  if (!condition) {
    return true;
  }

  const evaluationContext = buildConditionContext({
    ctx,
    playerId: cardPlayed.playerId,
    sourceCardId: cardPlayed.cardId,
    cardPlayed: eventCardPlayed ?? cardPlayed,
    resolutionInput,
  });

  return evaluateCondition(condition, evaluationContext);
}
