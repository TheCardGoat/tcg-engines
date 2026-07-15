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
): boolean {
  if (!condition) {
    return true;
  }

  const evaluationContext = buildConditionContext({
    ctx,
    playerId: cardPlayed.playerId,
    sourceCardId: cardPlayed.cardId,
    cardPlayed,
    resolutionInput,
  });

  return evaluateCondition(condition, evaluationContext);
}
