import {
  buildInteractionSubmissionForActionId,
  validateInteractionSubmission,
  type EngineInteractionView,
  type InteractionSubmission,
  type InteractionSubmissionValue,
} from "@tcg/protocol";
import type { EngineAction } from "../EngineProvider";

export function actionToInteractionSubmission(
  action: EngineAction,
  view: EngineInteractionView | undefined,
): InteractionSubmission | null {
  if (
    !view ||
    action.type === "undo" ||
    action.type === "undoToTurnStart" ||
    action.type === "manualSetGigValue" ||
    action.type === "manualMoveGig" ||
    action.type === "manualMoveCard" ||
    action.type === "manualAttachGear" ||
    action.type === "manualDetachGear" ||
    action.type === "manualExertCard" ||
    action.type === "manualReadyCard" ||
    action.type === "manualDrawCard" ||
    action.type === "manualClearPendingResolution" ||
    action.type === "manualResetCombat" ||
    action.type === "manualForcePassTurn" ||
    action.type === "manualSetEddies" ||
    action.type === "manualResetOncePerTurn" ||
    action.type === "manualSetCardFace" ||
    action.type === "manualReadyAll" ||
    action.type === "manualRecomputeActiveEffects" ||
    action.type === "manualDropEffectBagEntry" ||
    action.type === "rewindToTurnStart"
  ) {
    return null;
  }

  const submission = buildInteractionSubmissionForActionId({
    view,
    actionId: action.type,
    values: valuesForAction(action),
  });
  if (!submission || !validateInteractionSubmission(view, submission).ok) {
    return null;
  }
  return submission;
}

function valuesForAction(
  action: Exclude<EngineAction, { type: "undo" | "undoToTurnStart" }>,
): Record<string, InteractionSubmissionValue> {
  switch (action.type) {
    case "playCard":
      return withOptional(
        withOptional({ cardId: action.cardId }, "attachToId", action.attachToId),
        "paymentSourceIds",
        action.paymentSourceIds,
      );
    case "sellCard":
      return { cardId: action.cardId };
    case "callLegend":
    case "goSolo":
      return withOptional({ cardId: action.cardId }, "paymentSourceIds", action.paymentSourceIds);
    case "resolveCardToPlay":
      return action.pass
        ? { pass: true }
        : withOptional(withOptional({}, "cardId", action.cardId), "attachToId", action.attachToId);
    case "resolveChooseEffect":
      return { optionId: action.optionId };
    case "attackUnit":
      return { attackerId: action.attackerId, defenderId: action.defenderId };
    case "attackRival":
      return { attackerId: action.attackerId };
    case "useBlocker":
      return { blockerId: action.blockerId };
    case "activateAbility":
      // abilityIndex is an option-selection input whose option ids are
      // String(index); the protocol rejects numeric selection values.
      return { cardId: action.cardId, abilityIndex: String(action.abilityIndex) };
    case "resolveAttack":
      return withOptional({}, "pass", action.pass);
    case "resolveStealGigs":
      return { dieIds: action.dieIds };
    case "resolveTrigger":
      return action.pass ? { pass: true } : withOptional({}, "triggerId", action.triggerId);
    case "resolveAdjustGig":
      return action.choice.kind === "noAdjustment"
        ? { pass: true }
        : { dieId: action.choice.dieId, value: action.choice.value };
    case "resolveEffectTarget":
      return action.pass ? { pass: true } : { targetIds: action.targetIds ?? [] };
    case "resolveDiscardFromHand":
      return action.pass ? { pass: true } : { cardIds: action.cardIds ?? [] };
    case "resolvePreventGigSteal":
      return action.pass
        ? { pass: true, dieIds: [], cardIds: [] }
        : { dieIds: action.dieIds, cardIds: action.cardIds };
    case "resolveScry": {
      const destination =
        action.destinations.find((entry) => entry.cardIds.length > 0) ?? action.destinations[0];
      return {
        destinationZone: destination?.zone ?? "hand",
        selectedCardIds: destination?.cardIds ?? [],
      };
    }
    case "resolveRevealDestination":
      return { destination: action.destination };
    case "resolveCardTypeChoice":
      return { cardType: action.cardType };
    case "passPhase":
    case "mulligan":
    case "keepHand":
    case "concede":
    case "cancelPendingResolution":
      return {};
    case "gainGig":
      return { dieId: action.dieId };
    case "resolveCardToMove":
      return withOptional(withOptional({}, "cardId", action.cardId), "pass", action.pass);
    case "resolveRedirectDefeat":
      return withOptional({}, "pass", action.pass);
    case "resolveSacrificialGear":
      return { cardId: action.cardId };
    case "resolveFirstPlayer":
      return { goFirst: action.goFirst };
    case "manualSetGigValue":
    case "manualMoveGig":
    case "manualMoveCard":
    case "manualAttachGear":
    case "manualDetachGear":
    case "manualExertCard":
    case "manualReadyCard":
    case "manualDrawCard":
    case "manualClearPendingResolution":
    case "manualResetCombat":
    case "manualForcePassTurn":
    case "manualSetEddies":
    case "manualResetOncePerTurn":
    case "manualSetCardFace":
    case "manualReadyAll":
    case "manualRecomputeActiveEffects":
    case "manualDropEffectBagEntry":
    case "rewindToTurnStart":
      return {};
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
