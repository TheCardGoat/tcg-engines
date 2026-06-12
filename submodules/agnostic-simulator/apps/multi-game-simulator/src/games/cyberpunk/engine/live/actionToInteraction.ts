import {
  buildInteractionSubmissionForActionId,
  type EngineInteractionView,
  type InteractionSubmission,
  type InteractionSubmissionValue,
} from "@tcg/protocol";
import type { EngineAction } from "../EngineProvider";

export function actionToInteractionSubmission(
  action: EngineAction,
  view: EngineInteractionView | undefined,
): InteractionSubmission | null {
  if (!view || action.type === "undo" || action.type === "undoToTurnStart") {
    return null;
  }

  return buildInteractionSubmissionForActionId({
    view,
    actionId: action.type,
    values: valuesForAction(action),
  });
}

function valuesForAction(
  action: Exclude<EngineAction, { type: "undo" | "undoToTurnStart" }>,
): Record<string, InteractionSubmissionValue> {
  switch (action.type) {
    case "playCard":
      return withOptional({ cardId: action.cardId }, "attachToId", action.attachToId);
    case "sellCard":
    case "callLegend":
    case "goSolo":
    case "resolveCardToPlay":
      return { cardId: action.cardId };
    case "attackUnit":
      return { attackerId: action.attackerId, defenderId: action.defenderId };
    case "attackRival":
      return { attackerId: action.attackerId };
    case "useBlocker":
      return { blockerId: action.blockerId };
    case "activateAbility":
      return { cardId: action.cardId, abilityIndex: action.abilityIndex };
    case "resolveAttack":
      return withOptional({}, "pass", action.pass);
    case "resolveStealGigs":
      return { dieIds: action.dieIds };
    case "resolveTrigger":
      return action.pass ? { pass: true } : withOptional({}, "triggerId", action.triggerId);
    case "resolveAdjustGig":
      return { value: action.value };
    case "resolveEffectTarget":
      return action.pass ? { pass: true } : { targetIds: action.targetIds ?? [] };
    case "resolveDiscardFromHand":
      return action.pass ? { pass: true } : { cardIds: action.cardIds ?? [] };
    case "resolveSearchDeck":
      return { selectedCardIds: action.selectedCardIds };
    case "passPhase":
    case "mulligan":
    case "keepHand":
    case "concede":
      return {};
    case "gainGig":
      return { dieId: action.dieId };
    case "resolveCardToMove":
      return withOptional(withOptional({}, "cardId", action.cardId), "pass", action.pass);
  }
}

function withOptional<T extends Record<string, InteractionSubmissionValue>>(
  values: T,
  key: string,
  value: InteractionSubmissionValue | undefined,
): T & Record<string, InteractionSubmissionValue> {
  if (value === undefined) {
    return values;
  }
  return { ...values, [key]: value };
}
