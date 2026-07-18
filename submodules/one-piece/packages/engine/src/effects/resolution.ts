import { getCard } from "../../../cards/src/runtime-catalog.ts";
import {
  baseCost,
  cardName,
  effectBlocksFor,
  effectBlocksForInstance,
  emitEvent,
  emitLog,
  enqueueEffectsForTrigger,
  enqueueInPlayEffectsForTrigger,
  enqueueResolution,
  getCardForInstance,
  getInstance,
  getPlayer,
  isDonActivationByCharacterEffectPrevented,
  otherSeat,
  recordCapabilityIssue,
} from "../shared.ts";
import {
  addDonFromDeck,
  createChoicePrompt,
  drawCards,
  enqueueJudgePrompt,
  getOpenCharacterSlots,
  moveCard,
} from "../state.ts";
import type { GameCommand, MatchSeat, MatchState, PromptState, ResolutionItem } from "../types.ts";
import { completeBattleResolution } from "../battle.ts";
import {
  addTopDeckCardsToLife,
  actionTargetIsEligible,
  canPayCosts,
  candidatesForGroupedPlayAction,
  candidatesForPlayAction,
  candidatesForKoCharacterCost,
  candidatesForPlayCardCost,
  candidatesForTrashCardCost,
  candidatesForTrashCharacterCost,
  candidatesForTrashFromHandCost,
  freezeActionCandidateIds,
  candidatesForRevealFromHandCost,
  candidatesForReturnCharacterCost,
  candidatesForRestCardsCost,
  candidatesForReturnCharacterToDeckCost,
  candidatesForReturnTrashToDeckCost,
  koCharacterByEffect,
  playCardFromEffect,
  promptForEffectRemovalReplacement,
  promptForRearrangeDeckOrder,
  processEffectAction,
  restCharacterByEffect,
  removeLifeCards,
  returnDonCostOptions,
  returnSelectedDonToDeck,
  selectionSatisfiesGroupedPlayAction,
  validActiveIdsForGroupedPlayAction,
  trashTopDeckCards,
  payCosts,
} from "./actions.ts";
import { evaluateConditions } from "./conditions.ts";
import {
  candidatePoolForTarget,
  matchesTargetFilter,
  selectionSatisfiesTotalConstraint,
} from "./targeting.ts";

export function processBattleEndEffects(
  state: MatchState,
  item: Extract<ResolutionItem, { kind: "battleEndEffects" }>,
) {
  const battle = state.battle;
  if (!battle || battle.id !== item.battleId || !battle.completionQueued) {
    return;
  }

  enqueueInPlayEffectsForTrigger(state, "endOfBattle", {
    instanceId: item.attackerId,
    instanceController: item.attackerController,
    effectController: item.attackerController,
    sourceInstanceId: item.attackerId,
    targetInstanceId: item.targetId,
  });

  const delayedActions = state.delayedEffectActions.filter(
    (delayed) => delayed.scheduledBattleId === item.battleId,
  );
  state.delayedEffectActions = state.delayedEffectActions.filter(
    (delayed) => delayed.scheduledBattleId !== item.battleId,
  );
  for (const delayed of delayedActions) {
    if (
      delayed.sourceZoneChangeCounter !== undefined &&
      getInstance(state, delayed.sourceInstanceId).zoneChangeCounter !==
        delayed.sourceZoneChangeCounter
    ) {
      continue;
    }
    enqueueResolution(state, {
      kind: "effectAction",
      sourceInstanceId: delayed.sourceInstanceId,
      controller: delayed.controller,
      action: delayed.action,
      previousActionTargetIds: delayed.previousActionTargetIds,
    });
  }

  enqueueResolution(state, { kind: "battleCleanupFinalize", battleId: item.battleId });
}

export function processEffectBlock(
  state: MatchState,
  item: Extract<ResolutionItem, { kind: "effectBlock" }>,
) {
  const source = getInstance(state, item.sourceInstanceId);
  if (
    item.sourceZoneChangeCounter !== undefined &&
    source.zoneChangeCounter !== item.sourceZoneChangeCounter
  ) {
    return;
  }
  const card = getCard(source.cardId);
  const block = effectBlocksFor(card, item.trigger)[item.blockIndex];

  if (!block) {
    return;
  }

  const effectKey = block.oncePerTurnKey ?? `${item.trigger}:${item.blockIndex}`;
  if (block.oncePerTurn && source.usedEffectKeys.includes(effectKey)) {
    return;
  }

  if (block.eventFilter) {
    const event = item.triggerEvent;
    if (!event) {
      return;
    }
    const triggeringCard = getInstance(state, event.instanceId);
    const triggeringController = event.instanceController ?? triggeringCard.controller;
    const playerMatches =
      !block.eventFilter.player ||
      block.eventFilter.player === "any" ||
      (block.eventFilter.player === "self" && triggeringController === item.controller) ||
      (block.eventFilter.player === "opponent" && triggeringController !== item.controller);
    const causeMatches =
      !block.eventFilter.causedBy ||
      block.eventFilter.causedBy === "any" ||
      (block.eventFilter.causedBy === "self" && event.effectController === item.controller) ||
      (block.eventFilter.causedBy === "opponent" && event.effectController !== item.controller);
    const koCauseMatches =
      !block.eventFilter.koCause || event.koCause === block.eventFilter.koCause;
    const fromZoneMatches =
      !block.eventFilter.fromZone ||
      ("fromZone" in event && event.fromZone === block.eventFilter.fromZone);
    const toZoneMatches =
      !block.eventFilter.toZone || ("toZone" in event && event.toZone === block.eventFilter.toZone);
    const targetSelfMatches =
      !block.eventFilter.targetSelf || event.targetInstanceId === item.sourceInstanceId;
    const sourceSelfMatches =
      !block.eventFilter.sourceSelf || event.sourceInstanceId === item.sourceInstanceId;
    const filtersMatch = (block.eventFilter.filters ?? []).every((filter) => {
      const result = matchesTargetFilter(state, item.sourceInstanceId, event.instanceId, filter);
      return result.supported && result.matches;
    });
    const sourceFiltersMatch = (block.eventFilter.sourceFilters ?? []).every((filter) => {
      if (!event.sourceInstanceId) return false;
      const result = matchesTargetFilter(
        state,
        item.sourceInstanceId,
        event.sourceInstanceId,
        filter,
      );
      return result.supported && result.matches;
    });
    const targetFiltersMatch = (block.eventFilter.targetFilters ?? []).every((filter) => {
      if (!event.targetInstanceId) return false;
      const result = matchesTargetFilter(
        state,
        item.sourceInstanceId,
        event.targetInstanceId,
        filter,
      );
      return result.supported && result.matches;
    });
    const sourceFromZoneMatches =
      !block.eventFilter.sourceFromZone ||
      event.sourceFromZone === block.eventFilter.sourceFromZone;
    const amountMatches =
      block.eventFilter.minimumAmount === undefined ||
      (event.amount ?? 0) >= block.eventFilter.minimumAmount;
    if (
      !playerMatches ||
      !causeMatches ||
      !koCauseMatches ||
      !fromZoneMatches ||
      !toZoneMatches ||
      !targetSelfMatches ||
      !sourceSelfMatches ||
      !filtersMatch ||
      !sourceFiltersMatch ||
      !targetFiltersMatch ||
      !sourceFromZoneMatches ||
      !amountMatches
    ) {
      return;
    }
  }
  if (block.source) {
    const event = item.triggerEvent;
    if (!event?.effectController) {
      return;
    }
    const isOpponentEffect = event.effectController !== item.controller;
    const isSelfEffect = event.effectController === item.controller;
    const isEffectKOD = event.koCause === undefined || event.koCause === "effect";
    const isOpponentCharacterEffect =
      isOpponentEffect &&
      isEffectKOD &&
      Boolean(
        event.sourceInstanceId &&
        getCardForInstance(state, event.sourceInstanceId).cardType === "character",
      );
    if (
      (block.source === "effect" && (!isSelfEffect || !isEffectKOD)) ||
      (block.source === "opponentEffect" && (!isOpponentEffect || !isEffectKOD)) ||
      (block.source === "opponentCharacterEffect" && !isOpponentCharacterEffect)
    ) {
      return;
    }
  }

  const conditions = evaluateConditions(
    state,
    item.controller,
    item.sourceInstanceId,
    block.conditions,
    [],
    item.triggerEvent,
  );
  if (!conditions.supported) {
    const issue = recordCapabilityIssue(state, {
      kind: "unsupportedCondition",
      code: `condition:${item.trigger}:${item.blockIndex}`,
      actor: item.controller,
      sourceCardId: source.cardId,
      sourceInstanceId: item.sourceInstanceId,
      eventId: null,
      details: `${cardName(card)} uses an effect condition that is not automated yet.`,
    });
    enqueueJudgePrompt(
      state,
      item.sourceInstanceId,
      "Judge review: unsupported effect condition",
      `${cardName(card)} uses a condition that is not automated yet.`,
      { issueId: issue.id },
    );
    return;
  }
  if (!conditions.matches) {
    return;
  }

  if (block.optional && !item.confirmed) {
    if (
      !canPayCosts(
        state,
        item.controller,
        item.sourceInstanceId,
        block.costs,
        item.trashHandIds,
        item.costPaymentIds,
        item.costPaymentIdsByType,
      )
    ) {
      return;
    }
    createChoicePrompt(state, {
      choiceKind: "confirm",
      seat: item.controller,
      label: `${cardName(card)} has an optional effect`,
      details: `Activate ${item.trigger} effect?`,
      sourceCardId: source.cardId,
      sourceInstanceId: item.sourceInstanceId,
      eventId: null,
      options: [
        { id: "yes", label: "Activate", value: "yes" },
        { id: "no", label: "Skip", value: "no" },
      ],
      minSelections: 0,
      maxSelections: 1,
      context: {
        trigger: item.trigger,
      },
      resolutionContext: {
        intent: "effectOptional",
        sourceInstanceId: item.sourceInstanceId,
        controller: item.controller,
        trigger: item.trigger,
        blockIndex: item.blockIndex,
        trashHandIds: item.trashHandIds,
        triggerEvent: item.triggerEvent,
      },
    });
    return;
  }

  const pendingOrderedCost = block.costs?.find((cost) =>
    cost.cost === "trashFromHand"
      ? !item.trashHandIds
      : cost.cost === "returnDon"
        ? !item.costPaymentIds
        : false,
  );
  const trashFromHandCost = block.costs?.find((cost) => cost.cost === "trashFromHand");
  if (trashFromHandCost && pendingOrderedCost === trashFromHandCost) {
    const candidateIds = candidatesForTrashFromHandCost(
      state,
      item.controller,
      item.sourceInstanceId,
      trashFromHandCost,
    );
    if (candidateIds.length > trashFromHandCost.amount) {
      createChoicePrompt(state, {
        choiceKind: "costPayment",
        seat: item.controller,
        label: `${cardName(card)} cost payment`,
        details: `Choose ${trashFromHandCost.amount} card(s) to trash${trashFromHandCost.fieldZones?.length ? " from hand or field" : " from hand"}.`,
        sourceCardId: source.cardId,
        sourceInstanceId: item.sourceInstanceId,
        eventId: null,
        options: candidateIds.map((instanceId) => ({
          id: instanceId,
          label: cardName(getCardForInstance(state, instanceId)),
          value: instanceId,
          targetId: instanceId,
        })),
        minSelections: trashFromHandCost.amount,
        maxSelections: trashFromHandCost.amount,
        context: {
          cost: "trashFromHand",
        },
        resolutionContext: {
          intent: "effectCostTrashFromHand",
          sourceInstanceId: item.sourceInstanceId,
          controller: item.controller,
          trigger: item.trigger,
          blockIndex: item.blockIndex,
          amount: trashFromHandCost.amount,
          cost: trashFromHandCost,
          candidateIds,
          costPaymentIds: item.costPaymentIds,
          triggerEvent: item.triggerEvent,
        },
      });
      return;
    }
  }

  const playCardCost = block.costs?.find((cost) => cost.cost === "playCard");
  if (playCardCost && !item.costPaymentIds) {
    const candidateIds = candidatesForPlayCardCost(
      state,
      item.controller,
      item.sourceInstanceId,
      playCardCost,
    );
    if (candidateIds.length > playCardCost.amount) {
      createChoicePrompt(state, {
        choiceKind: "costPayment",
        seat: item.controller,
        label: `${cardName(card)} cost payment`,
        details: `Choose ${playCardCost.amount} card(s) to play as the effect cost.`,
        sourceCardId: source.cardId,
        sourceInstanceId: item.sourceInstanceId,
        eventId: null,
        options: candidateIds.map((instanceId) => ({
          id: instanceId,
          label: cardName(getCardForInstance(state, instanceId)),
          value: instanceId,
          targetId: instanceId,
        })),
        minSelections: playCardCost.amount,
        maxSelections: playCardCost.amount,
        context: { cost: "playCard" },
        resolutionContext: {
          intent: "effectCostPlayCard",
          sourceInstanceId: item.sourceInstanceId,
          controller: item.controller,
          trigger: item.trigger,
          blockIndex: item.blockIndex,
          amount: playCardCost.amount,
          candidateIds,
          triggerEvent: item.triggerEvent,
        },
      });
      return;
    }
  }

  const trashCardCost = block.costs?.find((cost) => cost.cost === "trashCard");
  if (trashCardCost && !item.costPaymentIds) {
    const candidateIds = candidatesForTrashCardCost(
      state,
      item.controller,
      item.sourceInstanceId,
      trashCardCost,
    );
    if (candidateIds.length > trashCardCost.amount) {
      createChoicePrompt(state, {
        choiceKind: "costPayment",
        seat: item.controller,
        label: `${cardName(card)} cost payment`,
        details: `Choose ${trashCardCost.amount} card(s) to trash as the effect cost.`,
        sourceCardId: source.cardId,
        sourceInstanceId: item.sourceInstanceId,
        eventId: null,
        options: candidateIds.map((instanceId) => ({
          id: instanceId,
          label: cardName(getCardForInstance(state, instanceId)),
          value: instanceId,
          targetId: instanceId,
        })),
        minSelections: trashCardCost.amount,
        maxSelections: trashCardCost.amount,
        context: { cost: "trashCard" },
        resolutionContext: {
          intent: "effectCostTrashCard",
          sourceInstanceId: item.sourceInstanceId,
          controller: item.controller,
          trigger: item.trigger,
          blockIndex: item.blockIndex,
          amount: trashCardCost.amount,
          candidateIds,
          triggerEvent: item.triggerEvent,
        },
      });
      return;
    }
  }

  const returnDonCost = block.costs?.find((cost) => cost.cost === "returnDon");
  if (returnDonCost && pendingOrderedCost === returnDonCost) {
    const options = returnDonCostOptions(state, item.controller);
    const minimumAmount = returnDonCost.minimumAmount ?? returnDonCost.amount;
    const maximumAmount =
      returnDonCost.minimumAmount === undefined ? minimumAmount : options.length;
    const sourceKeys = new Set(
      options.map((option) =>
        option.id.startsWith("attached-don:")
          ? option.id.slice(0, option.id.lastIndexOf(":"))
          : option.id.slice(0, option.id.indexOf(":")),
      ),
    );
    if (
      returnDonCost.minimumAmount !== undefined
        ? options.length > minimumAmount
        : options.length > minimumAmount && sourceKeys.size > 1
    ) {
      createChoicePrompt(state, {
        choiceKind: "costPayment",
        seat: item.controller,
        label: `${cardName(card)} DON!! cost payment`,
        details:
          returnDonCost.minimumAmount === undefined
            ? `Choose ${minimumAmount} DON!! card(s) from your field to return to your DON!! deck.`
            : `Choose ${minimumAmount} or more DON!! cards from your field to return to your DON!! deck.`,
        sourceCardId: source.cardId,
        sourceInstanceId: item.sourceInstanceId,
        eventId: null,
        options: options.map((option) => ({
          id: option.id,
          label: option.label,
          value: option.id,
        })),
        minSelections: minimumAmount,
        maxSelections: maximumAmount,
        context: {
          cost: "returnDon",
        },
        resolutionContext: {
          intent: "effectCostReturnDon",
          sourceInstanceId: item.sourceInstanceId,
          controller: item.controller,
          trigger: item.trigger,
          blockIndex: item.blockIndex,
          amount: minimumAmount,
          candidateIds: options.map((option) => option.id),
          trashHandIds: item.trashHandIds,
          triggerEvent: item.triggerEvent,
        },
      });
      return;
    }
  }

  const returnCharacterToDeckCost = block.costs?.find(
    (cost) => cost.cost === "returnCharacterToDeck",
  );
  if (returnCharacterToDeckCost && !item.costPaymentIds) {
    const candidateIds = candidatesForReturnCharacterToDeckCost(
      state,
      item.controller,
      item.sourceInstanceId,
      returnCharacterToDeckCost,
    );

    if (candidateIds.length > returnCharacterToDeckCost.amount) {
      createChoicePrompt(state, {
        choiceKind: "costPayment",
        seat: item.controller,
        label: `${cardName(card)} cost payment`,
        details: `Choose ${returnCharacterToDeckCost.amount} Character card(s) to place at the ${returnCharacterToDeckCost.position} of the owner's deck.`,
        sourceCardId: source.cardId,
        sourceInstanceId: item.sourceInstanceId,
        eventId: null,
        options: candidateIds.map((instanceId) => ({
          id: instanceId,
          label: cardName(getCardForInstance(state, instanceId)),
          value: instanceId,
          targetId: instanceId,
        })),
        minSelections: returnCharacterToDeckCost.amount,
        maxSelections: returnCharacterToDeckCost.amount,
        context: {
          cost: "returnCharacterToDeck",
        },
        resolutionContext: {
          intent: "effectCostReturnCharacterToDeck",
          sourceInstanceId: item.sourceInstanceId,
          controller: item.controller,
          trigger: item.trigger,
          blockIndex: item.blockIndex,
          amount: returnCharacterToDeckCost.amount,
          candidateIds,
          trashHandIds: item.trashHandIds,
          triggerEvent: item.triggerEvent,
        },
      });
      return;
    }
  }

  const returnCharacterCost = block.costs?.find((cost) => cost.cost === "returnCharacter");
  const pendingCompoundCardCost = block.costs?.find((cost) => {
    if (cost.cost === "restCards") {
      return (
        !item.costPaymentIdsByType?.restCards &&
        candidatesForRestCardsCost(state, item.controller, item.sourceInstanceId, cost).length >
          cost.amount
      );
    }
    if (cost.cost === "returnCharacter") {
      return (
        !item.costPaymentIdsByType?.returnCharacter &&
        candidatesForReturnCharacterCost(state, item.controller, item.sourceInstanceId, cost)
          .length > cost.amount
      );
    }
    return false;
  });
  if (
    returnCharacterCost &&
    !item.costPaymentIdsByType?.returnCharacter &&
    pendingCompoundCardCost === returnCharacterCost
  ) {
    const candidateIds = candidatesForReturnCharacterCost(
      state,
      item.controller,
      item.sourceInstanceId,
      returnCharacterCost,
    );
    if (candidateIds.length > returnCharacterCost.amount) {
      createChoicePrompt(state, {
        choiceKind: "costPayment",
        seat: item.controller,
        label: `${cardName(card)} cost payment`,
        details: `Choose ${returnCharacterCost.amount} Character card(s) to return to the owner's hand.`,
        sourceCardId: source.cardId,
        sourceInstanceId: item.sourceInstanceId,
        eventId: null,
        options: candidateIds.map((instanceId) => ({
          id: instanceId,
          label: cardName(getCardForInstance(state, instanceId)),
          value: instanceId,
          targetId: instanceId,
        })),
        minSelections: returnCharacterCost.amount,
        maxSelections: returnCharacterCost.amount,
        context: { cost: "returnCharacter" },
        resolutionContext: {
          intent: "effectCostReturnCharacter",
          sourceInstanceId: item.sourceInstanceId,
          controller: item.controller,
          trigger: item.trigger,
          blockIndex: item.blockIndex,
          amount: returnCharacterCost.amount,
          candidateIds,
          costPaymentIdsByType: item.costPaymentIdsByType,
          triggerEvent: item.triggerEvent,
        },
      });
      return;
    }
  }

  const restCardsCost = block.costs?.find((cost) => cost.cost === "restCards");
  if (
    restCardsCost &&
    !item.costPaymentIdsByType?.restCards &&
    pendingCompoundCardCost === restCardsCost
  ) {
    const candidateIds = candidatesForRestCardsCost(
      state,
      item.controller,
      item.sourceInstanceId,
      restCardsCost,
    );
    if (candidateIds.length > restCardsCost.amount) {
      createChoicePrompt(state, {
        choiceKind: "costPayment",
        seat: item.controller,
        label: `${cardName(card)} cost payment`,
        details: `Choose ${restCardsCost.amount} active card(s) to rest.`,
        sourceCardId: source.cardId,
        sourceInstanceId: item.sourceInstanceId,
        eventId: null,
        options: candidateIds.map((instanceId) => ({
          id: instanceId,
          label: cardName(getCardForInstance(state, instanceId)),
          value: instanceId,
          targetId: instanceId,
        })),
        minSelections: restCardsCost.amount,
        maxSelections: restCardsCost.amount,
        context: {
          cost: "restCards",
        },
        resolutionContext: {
          intent: "effectCostRestCards",
          sourceInstanceId: item.sourceInstanceId,
          controller: item.controller,
          trigger: item.trigger,
          blockIndex: item.blockIndex,
          amount: restCardsCost.amount,
          candidateIds,
          costPaymentIdsByType: item.costPaymentIdsByType,
          triggerEvent: item.triggerEvent,
        },
      });
      return;
    }
  }

  const koCharacterCost = block.costs?.find((cost) => cost.cost === "koCharacter");
  if (koCharacterCost && !item.costPaymentIds) {
    const candidateIds = candidatesForKoCharacterCost(
      state,
      item.controller,
      item.sourceInstanceId,
      koCharacterCost,
    );
    if (candidateIds.length > koCharacterCost.amount) {
      createChoicePrompt(state, {
        choiceKind: "costPayment",
        seat: item.controller,
        label: `${cardName(card)} cost payment`,
        details: `Choose ${koCharacterCost.amount} Character card(s) to K.O.`,
        sourceCardId: source.cardId,
        sourceInstanceId: item.sourceInstanceId,
        eventId: null,
        options: candidateIds.map((instanceId) => ({
          id: instanceId,
          label: cardName(getCardForInstance(state, instanceId)),
          value: instanceId,
          targetId: instanceId,
        })),
        minSelections: koCharacterCost.amount,
        maxSelections: koCharacterCost.amount,
        context: { cost: "koCharacter" },
        resolutionContext: {
          intent: "effectCostKoCharacter",
          sourceInstanceId: item.sourceInstanceId,
          controller: item.controller,
          trigger: item.trigger,
          blockIndex: item.blockIndex,
          amount: koCharacterCost.amount,
          candidateIds,
          triggerEvent: item.triggerEvent,
        },
      });
      return;
    }
  }

  const trashCharacterCost = block.costs?.find((cost) => cost.cost === "trashCharacter");
  if (trashCharacterCost && !item.costPaymentIds) {
    const candidateIds = candidatesForTrashCharacterCost(
      state,
      item.controller,
      item.sourceInstanceId,
      trashCharacterCost,
    );
    if (candidateIds.length > trashCharacterCost.amount) {
      createChoicePrompt(state, {
        choiceKind: "costPayment",
        seat: item.controller,
        label: `${cardName(card)} cost payment`,
        details: `Choose ${trashCharacterCost.amount} Character card(s) to trash.`,
        sourceCardId: source.cardId,
        sourceInstanceId: item.sourceInstanceId,
        eventId: null,
        options: candidateIds.map((instanceId) => ({
          id: instanceId,
          label: cardName(getCardForInstance(state, instanceId)),
          value: instanceId,
          targetId: instanceId,
        })),
        minSelections: trashCharacterCost.amount,
        maxSelections: trashCharacterCost.amount,
        context: { cost: "trashCharacter" },
        resolutionContext: {
          intent: "effectCostTrashCharacter",
          sourceInstanceId: item.sourceInstanceId,
          controller: item.controller,
          trigger: item.trigger,
          blockIndex: item.blockIndex,
          amount: trashCharacterCost.amount,
          candidateIds,
          triggerEvent: item.triggerEvent,
        },
      });
      return;
    }
    if (
      candidateIds.length === 1 &&
      trashCharacterCost.amount === 1 &&
      promptForEffectRemovalReplacement(
        state,
        candidateIds[0]!,
        item.controller,
        item.sourceInstanceId,
        {
          action: "trashFromField",
          target: {
            player: "self",
            zones: ["character"],
            count: { amount: 1 },
          },
        },
        [],
        undefined,
        {
          sourceInstanceId: item.sourceInstanceId,
          controller: item.controller,
          trigger: item.trigger,
          blockIndex: item.blockIndex,
          costPaymentIds: candidateIds,
          costsPaid: true,
          confirmed: true,
          triggerEvent: item.triggerEvent,
        },
      )
    ) {
      return;
    }
  }

  const revealFromHandCost = block.costs?.find((cost) => cost.cost === "revealFromHand");
  if (revealFromHandCost && !item.costPaymentIds) {
    const candidateIds = candidatesForRevealFromHandCost(
      state,
      item.controller,
      item.sourceInstanceId,
      revealFromHandCost,
    );
    if (candidateIds.length > revealFromHandCost.amount) {
      createChoicePrompt(state, {
        choiceKind: "costPayment",
        seat: item.controller,
        label: `${cardName(card)} cost payment`,
        details: `Choose ${revealFromHandCost.amount} card(s) to reveal from hand.`,
        sourceCardId: source.cardId,
        sourceInstanceId: item.sourceInstanceId,
        eventId: null,
        options: candidateIds.map((instanceId) => ({
          id: instanceId,
          label: cardName(getCardForInstance(state, instanceId)),
          value: instanceId,
          targetId: instanceId,
        })),
        minSelections: revealFromHandCost.amount,
        maxSelections: revealFromHandCost.amount,
        context: { cost: "revealFromHand" },
        resolutionContext: {
          intent: "effectCostRevealFromHand",
          sourceInstanceId: item.sourceInstanceId,
          controller: item.controller,
          trigger: item.trigger,
          blockIndex: item.blockIndex,
          amount: revealFromHandCost.amount,
          candidateIds,
          triggerEvent: item.triggerEvent,
        },
      });
      return;
    }
  }

  const returnHandToDeckCost = block.costs?.find((cost) => cost.cost === "returnHandToDeck");
  if (returnHandToDeckCost && !item.costPaymentIds) {
    const candidateIds = [...getPlayer(state, item.controller).hand];
    createChoicePrompt(state, {
      choiceKind: "costPayment",
      seat: item.controller,
      label: `${cardName(card)} cost payment`,
      details: `Choose ${returnHandToDeckCost.amount} card(s) from your hand in the order they should be placed at the ${returnHandToDeckCost.position} of your deck.`,
      sourceCardId: source.cardId,
      sourceInstanceId: item.sourceInstanceId,
      eventId: null,
      options: candidateIds.map((instanceId) => ({
        id: instanceId,
        label: cardName(getCardForInstance(state, instanceId)),
        value: instanceId,
        targetId: instanceId,
      })),
      minSelections: returnHandToDeckCost.amount,
      maxSelections: returnHandToDeckCost.amount,
      context: {
        cost: "returnHandToDeck",
        ordered: true,
      },
      resolutionContext: {
        intent: "effectCostReturnHandToDeck",
        sourceInstanceId: item.sourceInstanceId,
        controller: item.controller,
        trigger: item.trigger,
        blockIndex: item.blockIndex,
        amount: returnHandToDeckCost.amount,
        candidateIds,
        triggerEvent: item.triggerEvent,
      },
    });
    return;
  }

  const returnTrashToDeckCost = block.costs?.find((cost) => cost.cost === "returnTrashToDeck");
  if (returnTrashToDeckCost && !item.costPaymentIds) {
    const candidateIds = candidatesForReturnTrashToDeckCost(
      state,
      item.controller,
      item.sourceInstanceId,
      returnTrashToDeckCost,
    );
    if (candidateIds.length > returnTrashToDeckCost.amount || returnTrashToDeckCost.amount > 1) {
      createChoicePrompt(state, {
        choiceKind: "costPayment",
        seat: item.controller,
        label: `${cardName(card)} cost payment`,
        details: `Choose ${returnTrashToDeckCost.amount} card(s) from your trash in the order they should be placed at the ${returnTrashToDeckCost.position} of your deck.`,
        sourceCardId: source.cardId,
        sourceInstanceId: item.sourceInstanceId,
        eventId: null,
        options: candidateIds.map((instanceId) => ({
          id: instanceId,
          label: cardName(getCardForInstance(state, instanceId)),
          value: instanceId,
          targetId: instanceId,
        })),
        minSelections: returnTrashToDeckCost.amount,
        maxSelections: returnTrashToDeckCost.amount,
        context: { cost: "returnTrashToDeck", ordered: true },
        resolutionContext: {
          intent: "effectCostReturnTrashToDeck",
          sourceInstanceId: item.sourceInstanceId,
          controller: item.controller,
          trigger: item.trigger,
          blockIndex: item.blockIndex,
          amount: returnTrashToDeckCost.amount,
          candidateIds,
          triggerEvent: item.triggerEvent,
        },
      });
      return;
    }
  }

  const returnThisAndHandToDeckCost = block.costs?.find(
    (cost) => cost.cost === "returnThisAndHandToDeck",
  );
  if (returnThisAndHandToDeckCost && !item.costPaymentIds) {
    const player = getPlayer(state, item.controller);
    const candidateIds = [item.sourceInstanceId, ...player.hand];
    createChoicePrompt(state, {
      choiceKind: "costPayment",
      seat: item.controller,
      label: `${cardName(card)} cost payment`,
      details: `Choose this card and ${returnThisAndHandToDeckCost.handAmount} card(s) from your hand in the order they should be placed at the ${returnThisAndHandToDeckCost.position} of your deck.`,
      sourceCardId: source.cardId,
      sourceInstanceId: item.sourceInstanceId,
      eventId: null,
      options: candidateIds.map((instanceId) => ({
        id: instanceId,
        label: cardName(getCardForInstance(state, instanceId)),
        value: instanceId,
        targetId: instanceId,
      })),
      minSelections: returnThisAndHandToDeckCost.handAmount + 1,
      maxSelections: returnThisAndHandToDeckCost.handAmount + 1,
      context: {
        cost: "returnThisAndHandToDeck",
        ordered: true,
      },
      resolutionContext: {
        intent: "effectCostReturnThisAndHandToDeck",
        sourceInstanceId: item.sourceInstanceId,
        controller: item.controller,
        trigger: item.trigger,
        blockIndex: item.blockIndex,
        handAmount: returnThisAndHandToDeckCost.handAmount,
        candidateIds,
        triggerEvent: item.triggerEvent,
      },
    });
    return;
  }

  const addLifeToHandCost = block.costs?.find((cost) => cost.cost === "addLifeToHand");
  const trashLifeCost = block.costs?.find((cost) => cost.cost === "trashLife");
  if (
    trashLifeCost?.position === "choice" &&
    getPlayer(state, item.controller).life.length > 1 &&
    !item.costPaymentIds
  ) {
    createChoicePrompt(state, {
      choiceKind: "chooseOption",
      seat: item.controller,
      label: `${cardName(card)} Life cost payment`,
      details: "Choose whether to trash from the top or bottom of Life.",
      sourceCardId: source.cardId,
      sourceInstanceId: item.sourceInstanceId,
      eventId: null,
      options: [
        { id: "top", label: "Top of Life", value: "top" },
        { id: "bottom", label: "Bottom of Life", value: "bottom" },
      ],
      minSelections: 1,
      maxSelections: 1,
      context: { cost: "trashLife" },
      resolutionContext: {
        intent: "effectCostTrashLife",
        sourceInstanceId: item.sourceInstanceId,
        controller: item.controller,
        trigger: item.trigger,
        blockIndex: item.blockIndex,
        triggerEvent: item.triggerEvent,
      },
    });
    return;
  }
  if (
    addLifeToHandCost?.position === "choice" &&
    getPlayer(state, item.controller).life.length > 1 &&
    !item.costPaymentIds
  ) {
    createChoicePrompt(state, {
      choiceKind: "chooseOption",
      seat: item.controller,
      label: `${cardName(card)} Life cost payment`,
      details: "Choose whether to add from the top or bottom of Life.",
      sourceCardId: source.cardId,
      sourceInstanceId: item.sourceInstanceId,
      eventId: null,
      options: [
        { id: "top", label: "Top of Life", value: "top" },
        { id: "bottom", label: "Bottom of Life", value: "bottom" },
      ],
      minSelections: 1,
      maxSelections: 1,
      context: { cost: "addLifeToHand" },
      resolutionContext: {
        intent: "effectCostAddLifeToHand",
        sourceInstanceId: item.sourceInstanceId,
        controller: item.controller,
        trigger: item.trigger,
        blockIndex: item.blockIndex,
        triggerEvent: item.triggerEvent,
      },
    });
    return;
  }

  const charactersBeforeCosts = new Map(
    Object.values(state.cards)
      .filter((instance) => instance.zone === "character")
      .map((instance) => [instance.instanceId, instance.controller]),
  );
  if (
    !item.costsPaid &&
    !payCosts(
      state,
      item.controller,
      item.sourceInstanceId,
      block.costs,
      item.trashHandIds,
      item.costPaymentIds,
      item.costPaymentIdsByType,
    )
  ) {
    const issue = recordCapabilityIssue(state, {
      kind: "unsupportedCost",
      code: `cost:${item.trigger}:${item.blockIndex}`,
      actor: item.controller,
      sourceCardId: source.cardId,
      sourceInstanceId: item.sourceInstanceId,
      eventId: null,
      details: `${cardName(card)} has costs that could not be paid automatically.`,
    });
    enqueueJudgePrompt(
      state,
      item.sourceInstanceId,
      "Judge review: effect costs",
      `${cardName(card)} has costs that could not be paid automatically.`,
      { issueId: issue.id },
    );
    return;
  }
  if (!item.costsPaid) {
    enqueueCharacterRemovalEffects(state, charactersBeforeCosts, item.controller);
  }

  const battle = state.battle;
  if (
    battle?.attackerId === item.sourceInstanceId &&
    source.zone !== "leader" &&
    source.zone !== "character"
  ) {
    battle.result = "no_damage";
    completeBattleResolution(state);
  }

  if (block.oncePerTurn) {
    source.usedEffectKeys.push(effectKey);
  }

  emitEvent(state, "effectResolved", item.controller, {
    sourceCardId: source.cardId,
    sourceInstanceId: item.sourceInstanceId,
    visibility: "public",
    data: {
      trigger: item.trigger,
    },
  });
  emitLog(state, item.controller, `${cardName(card)} resolves its ${item.trigger} effect.`, {
    sourceCardId: source.cardId,
    sourceInstanceId: item.sourceInstanceId,
    visibility: "public",
  });

  for (const action of [...block.actions].reverse()) {
    const previousActionTargetIds =
      item.trashHandIds ??
      item.costPaymentIds?.filter((instanceId) => Boolean(state.cards[instanceId])) ??
      Object.values(item.costPaymentIdsByType ?? {})
        .flat()
        .filter((instanceId) => Boolean(state.cards[instanceId]));
    const resolvedAction =
      action.action === "draw" && action.amountFromTriggerEvent
        ? { ...action, amount: item.triggerEvent?.amount ?? 0 }
        : action;
    const bindsTriggerEventTarget =
      (action.action === "returnToDeck" && action.triggerEventTarget) ||
      (action.action === "copyPower" && action.triggerEventAttacker);
    const triggerEventTargetId =
      action.action === "returnToDeck" && action.triggerEventTarget
        ? item.triggerEvent?.targetInstanceId
        : action.action === "copyPower" && action.triggerEventAttacker
          ? item.triggerEvent?.instanceId
          : undefined;
    const triggerEventTargetPool = bindsTriggerEventTarget
      ? candidatePoolForTarget(state, item.controller, item.sourceInstanceId, action.target)
      : undefined;
    const selectedTargetIds = bindsTriggerEventTarget
      ? triggerEventTargetId &&
        triggerEventTargetPool?.supported &&
        triggerEventTargetPool.candidateIds.includes(triggerEventTargetId)
        ? [triggerEventTargetId]
        : []
      : undefined;
    enqueueResolution(
      state,
      {
        kind: "effectAction",
        sourceInstanceId: item.sourceInstanceId,
        controller: item.controller,
        action: resolvedAction,
        ...(selectedTargetIds && { selectedTargetIds }),
        previousActionTargetIds,
      },
      { next: true },
    );
  }
}

export function processQueuedEffectAction(
  state: MatchState,
  item: Extract<ResolutionItem, { kind: "effectAction" }>,
) {
  if (item.action.condition) {
    const condition = evaluateConditions(
      state,
      item.controller,
      item.sourceInstanceId,
      [item.action.condition],
      item.previousActionTargetIds,
    );
    if (!condition.supported) {
      const source = getInstance(state, item.sourceInstanceId);
      const card = getCard(source.cardId);
      const issue = recordCapabilityIssue(state, {
        kind: "unsupportedCondition",
        code: `action-condition:${item.action.action}`,
        actor: item.controller,
        sourceCardId: source.cardId,
        sourceInstanceId: item.sourceInstanceId,
        eventId: null,
        details: `${cardName(card)} uses an action condition that is not automated yet.`,
      });
      enqueueJudgePrompt(
        state,
        item.sourceInstanceId,
        "Judge review: unsupported action condition",
        `${cardName(card)} uses an action condition that is not automated yet.`,
        { issueId: issue.id },
      );
      return;
    }
    if (!condition.matches) {
      return;
    }
  }

  const zonesBefore = new Map(
    Object.values(state.cards).map((instance) => [instance.instanceId, instance.zone]),
  );
  const charactersBefore = new Map(
    Object.values(state.cards)
      .filter((instance) => instance.zone === "character")
      .map((instance) => [instance.instanceId, instance.controller]),
  );
  const completed = processEffectAction(
    state,
    item.controller,
    item.sourceInstanceId,
    item.action,
    item.selectedTargetIds,
    item.previousActionTargetIds,
    item.skipRemovalReplacementIds,
    item.returnToDeckContinuation,
  );
  if (!completed) {
    return;
  }

  const movedCardIds = Object.values(state.cards)
    .filter((instance) => zonesBefore.get(instance.instanceId) !== instance.zone)
    .map((instance) => instance.instanceId);
  const nextItem = state.resolutionQueue[0];
  if (
    nextItem?.kind === "effectAction" &&
    nextItem.sourceInstanceId === item.sourceInstanceId &&
    nextItem.controller === item.controller
  ) {
    const completedTargetIds =
      item.returnToDeckContinuation?.finalizeOwnerGroup &&
      item.returnToDeckContinuation.remainingOwnerGroups.length === 0
        ? item.returnToDeckContinuation.allTargetIds
        : item.action.action === "ko"
          ? movedCardIds
          : item.selectedTargetIds;
    nextItem.previousActionTargetIds = completedTargetIds?.length
      ? completedTargetIds
      : movedCardIds;
  }
  enqueueCharacterRemovalEffects(state, charactersBefore, item.controller);
}

function enqueueCharacterRemovalEffects(
  state: MatchState,
  charactersBefore: Map<string, MatchSeat>,
  effectController: MatchSeat,
) {
  const removedCharacterIds = [...charactersBefore.keys()].filter(
    (instanceId) => getInstance(state, instanceId).zone !== "character",
  );
  for (const removedCharacterId of removedCharacterIds) {
    enqueueInPlayEffectsForTrigger(state, "whenCharacterRemoved", {
      instanceId: removedCharacterId,
      instanceController: charactersBefore.get(removedCharacterId),
      effectController,
    });
    for (const source of Object.values(state.cards)) {
      const player = getPlayer(state, source.controller);
      const isInPlay =
        (source.zone === "leader" && player.leaderInstanceId === source.instanceId) ||
        (source.zone === "character" && player.characterArea.includes(source.instanceId)) ||
        (source.zone === "stage" && player.stageArea === source.instanceId);
      if (!isInPlay) {
        continue;
      }
      if (effectBlocksForInstance(state, source.instanceId, "whenLeaving").length === 0) {
        continue;
      }
      enqueueEffectsForTrigger(
        state,
        source.instanceId,
        source.controller,
        "whenLeaving",
        undefined,
        {
          instanceId: removedCharacterId,
          instanceController: charactersBefore.get(removedCharacterId),
          effectController,
          toZone: getInstance(state, removedCharacterId).zone,
        },
      );
    }
  }
}

function finishSearchRemainder(
  state: MatchState,
  sourceInstanceId: string,
  controller: MatchSeat,
  remainderIds: string[],
  position: "top" | "bottom" | "trash",
) {
  if (position === "trash") {
    for (const instanceId of remainderIds) {
      moveCard(state, instanceId, getInstance(state, instanceId).owner, "trash", {
        faceUp: true,
        publicKnowledge: true,
        actor: controller,
        sourceInstanceId,
        visibility: "public",
      });
    }
    emitLog(
      state,
      controller,
      `${getPlayer(state, controller).playerName} trashes ${remainderIds.length} card${remainderIds.length === 1 ? "" : "s"} from the cards they looked at.`,
      {
        sourceCardId: getInstance(state, sourceInstanceId).cardId,
        sourceInstanceId,
        targetIds: remainderIds,
        visibility: "public",
      },
    );
    return;
  }
  const movementOrder = position === "top" ? [...remainderIds].reverse() : remainderIds;
  for (const instanceId of movementOrder) {
    moveCard(state, instanceId, controller, "deck", {
      deckPosition: position,
      faceUp: false,
      publicKnowledge: false,
      actor: controller,
      visibility: "private",
      suppressLog: true,
      redactIdentity: true,
    });
  }
  emitLog(
    state,
    controller,
    `${getPlayer(state, controller).playerName} places ${remainderIds.length} card${remainderIds.length === 1 ? "" : "s"} at the ${position} of their deck.`,
    {
      sourceCardId: getInstance(state, sourceInstanceId).cardId,
      sourceInstanceId,
      visibility: "public",
    },
  );
}

function promptForSearchRemainderPosition(
  state: MatchState,
  sourceInstanceId: string,
  controller: MatchSeat,
  orderedIds: string[],
) {
  createChoicePrompt(state, {
    choiceKind: "chooseOption",
    seat: controller,
    label: `${cardName(getCardForInstance(state, sourceInstanceId))} chooses the remainder position`,
    details: "Place the ordered remaining cards at the top or bottom of the deck.",
    sourceCardId: getInstance(state, sourceInstanceId).cardId,
    sourceInstanceId,
    eventId: null,
    options: [
      { id: "top", label: "Top of deck", value: "top" },
      { id: "bottom", label: "Bottom of deck", value: "bottom" },
    ],
    minSelections: 1,
    maxSelections: 1,
    context: { action: "search", role: "remainderPosition" },
    resolutionContext: {
      intent: "effectSearchRemainderPosition",
      sourceInstanceId,
      controller,
      orderedIds,
    },
  });
}

function finishRearrangeDeckOrder(
  state: MatchState,
  sourceInstanceId: string,
  controller: MatchSeat,
  targetSeat: MatchSeat,
  lookedIds: string[],
  orderedIds: string[],
  position: "top" | "bottom",
) {
  const moveOrder = position === "top" ? [...orderedIds].reverse() : orderedIds;
  for (const instanceId of moveOrder) {
    moveCard(state, instanceId, targetSeat, "deck", {
      deckPosition: position,
      faceUp: false,
      publicKnowledge: false,
      actor: controller,
      sourceInstanceId,
      visibility: "private",
      suppressLog: true,
      redactIdentity: true,
    });
  }
  emitLog(
    state,
    controller,
    `${cardName(getCardForInstance(state, sourceInstanceId))} rearranges ${lookedIds.length} card(s) from the top of the deck.`,
    {
      sourceCardId: getInstance(state, sourceInstanceId).cardId,
      sourceInstanceId,
      visibility: "public",
    },
  );
}

function enqueueDeferredOnPlayBlocks(
  state: MatchState,
  controller: MatchSeat,
  playedCards: Array<{ instanceId: string; zoneChangeCounter: number }>,
) {
  for (const playedCard of [...playedCards].reverse()) {
    const blocks = effectBlocksForInstance(state, playedCard.instanceId, "onPlay");
    for (let blockIndex = blocks.length - 1; blockIndex >= 0; blockIndex -= 1) {
      enqueueResolution(
        state,
        {
          kind: "effectBlock",
          sourceInstanceId: playedCard.instanceId,
          controller,
          trigger: "onPlay",
          blockIndex,
        },
        { next: true },
      );
    }
  }
}

function completeGroupedPlay(
  state: MatchState,
  sourceInstanceId: string,
  controller: MatchSeat,
  action: Extract<import("@tcg/op-types").Action, { action: "playGrouped" }>,
  selectedIds: string[],
  activeId: string,
): boolean {
  const playingSeat = action.source.player === "self" ? controller : otherSeat(controller);
  if (
    !selectionSatisfiesGroupedPlayAction(
      state,
      controller,
      sourceInstanceId,
      action,
      selectedIds,
    ) ||
    !validActiveIdsForGroupedPlayAction(
      state,
      controller,
      sourceInstanceId,
      action,
      selectedIds,
    ).includes(activeId) ||
    selectedIds.filter(
      (instanceId) => getCardForInstance(state, instanceId).cardType === "character",
    ).length > getOpenCharacterSlots(state, playingSeat).length
  ) {
    return false;
  }

  for (const instanceId of selectedIds) {
    const playState = instanceId === activeId ? "active" : "rested";
    if (
      !playCardFromEffect(state, playingSeat, instanceId, playState, sourceInstanceId, {
        deferOnPlay: true,
      })
    ) {
      return false;
    }
  }

  const playedCards = selectedIds
    .filter((instanceId) => effectBlocksForInstance(state, instanceId, "onPlay").length > 0)
    .map((instanceId) => ({
      instanceId,
      zoneChangeCounter: getInstance(state, instanceId).zoneChangeCounter,
    }));
  if (action.chooseOnPlayOrder && playedCards.length > 1) {
    createChoicePrompt(state, {
      choiceKind: "orderCards",
      seat: playingSeat,
      label: `${cardName(getCardForInstance(state, sourceInstanceId))} On Play order`,
      details: "Choose the order in which the played cards' On Play effects activate.",
      sourceCardId: getInstance(state, sourceInstanceId).cardId,
      sourceInstanceId,
      eventId: null,
      options: playedCards.map(({ instanceId }) => ({
        id: instanceId,
        label: cardName(getCardForInstance(state, instanceId)),
        value: instanceId,
        targetId: instanceId,
      })),
      minSelections: playedCards.length,
      maxSelections: playedCards.length,
      context: { action: "playGrouped", ordered: true },
      resolutionContext: {
        intent: "effectGroupedPlayOnPlayOrder",
        sourceInstanceId,
        controller: playingSeat,
        playedCards,
      },
    });
  } else {
    enqueueDeferredOnPlayBlocks(state, playingSeat, playedCards);
  }
  return true;
}

export function resolveEffectChoicePrompt(
  state: MatchState,
  prompt: PromptState,
  command: Extract<GameCommand, { type: "resolvePrompt" }>,
): boolean {
  switch (prompt.resolutionContext?.intent) {
    case "effectKoReplacement": {
      const context = prompt.resolutionContext;
      if (command.optionId !== "yes" && command.optionId !== "no") {
        return false;
      }
      if (command.optionId === "yes") {
        getInstance(state, context.replacementSourceInstanceId).usedEffectKeys.push(
          `replacement:${context.replacementEvent}:${context.replacementEffectIndex}`,
        );
        const remainingTargetIds = context.remainingTargetIds.filter(
          (targetId) => !context.replacementTargetIds.includes(targetId),
        );
        if (remainingTargetIds.length > 0) {
          enqueueResolution(
            state,
            {
              kind: "effectAction",
              sourceInstanceId: context.koSourceInstanceId,
              controller: context.koController,
              action: {
                action: "ko",
                target: {
                  player: "both",
                  zones: ["character"],
                  count: { amount: "all" },
                },
                previousActionTargets: true,
              },
              previousActionTargetIds: remainingTargetIds,
            },
            { next: true },
          );
        }
        enqueueResolution(
          state,
          {
            kind: "effectAction",
            sourceInstanceId: context.replacementSourceInstanceId,
            controller: context.controller,
            action: context.replacementAction,
            previousActionTargetIds: context.replacementTargetIds,
          },
          { next: true },
        );
      } else {
        koCharacterByEffect(
          state,
          context.targetId,
          context.koController,
          context.koSourceInstanceId,
        );
        if (context.remainingTargetIds.length > 0) {
          enqueueResolution(
            state,
            {
              kind: "effectAction",
              sourceInstanceId: context.koSourceInstanceId,
              controller: context.koController,
              action: {
                action: "ko",
                target: {
                  player: "both",
                  zones: ["character"],
                  count: { amount: "all" },
                },
                previousActionTargets: true,
              },
              previousActionTargetIds: context.remainingTargetIds,
            },
            { next: true },
          );
        }
      }
      return true;
    }
    case "effectRestReplacement": {
      const context = prompt.resolutionContext;
      if (command.optionId !== "yes" && command.optionId !== "no") {
        return false;
      }
      if (context.remainingTargetIds.length > 0) {
        enqueueResolution(
          state,
          {
            kind: "effectAction",
            sourceInstanceId: context.restSourceInstanceId,
            controller: context.restController,
            action: context.restAction,
            selectedTargetIds: context.remainingTargetIds,
          },
          { next: true },
        );
      }
      if (command.optionId === "yes") {
        getInstance(state, context.replacementSourceInstanceId).usedEffectKeys.push(
          `replacement:rested:${context.replacementEffectIndex}`,
        );
        enqueueResolution(
          state,
          {
            kind: "effectAction",
            sourceInstanceId: context.replacementSourceInstanceId,
            controller: context.controller,
            action: context.replacementAction,
            previousActionTargetIds: [context.targetId],
          },
          { next: true },
        );
      } else {
        restCharacterByEffect(state, context.targetId, context.restController);
      }
      return true;
    }
    case "effectRemovalReplacement": {
      const context = prompt.resolutionContext;
      if (command.optionId !== "yes" && command.optionId !== "no") {
        return false;
      }
      if (context.remainingTargetIds.length > 0) {
        enqueueResolution(
          state,
          {
            kind: "effectAction",
            sourceInstanceId: context.removalSourceInstanceId,
            controller: context.removalController,
            action: context.removalAction,
            selectedTargetIds: context.remainingTargetIds,
            returnToDeckContinuation: context.returnToDeckContinuation,
          },
          { next: true },
        );
      } else if (command.optionId === "yes" && context.returnToDeckContinuation) {
        enqueueResolution(
          state,
          {
            kind: "effectAction",
            sourceInstanceId: context.removalSourceInstanceId,
            controller: context.removalController,
            action: context.removalAction,
            selectedTargetIds: [],
            returnToDeckContinuation: context.returnToDeckContinuation,
          },
          { next: true },
        );
      }
      if (command.optionId === "no" && context.returnCharacterCostContinuation) {
        enqueueResolution(
          state,
          {
            kind: "effectBlock",
            ...context.returnCharacterCostContinuation,
          },
          { next: true },
        );
      }
      if (command.optionId === "yes") {
        getInstance(state, context.replacementSourceInstanceId).usedEffectKeys.push(
          `replacement:${context.replacementEvent}:${context.replacementEffectIndex}`,
        );
        enqueueResolution(
          state,
          {
            kind: "effectAction",
            sourceInstanceId: context.replacementSourceInstanceId,
            controller: context.controller,
            action: context.replacementAction,
            previousActionTargetIds: [context.targetId],
          },
          { next: true },
        );
      } else {
        enqueueResolution(
          state,
          {
            kind: "effectAction",
            sourceInstanceId: context.removalSourceInstanceId,
            controller: context.removalController,
            action: context.removalAction,
            selectedTargetIds: [context.targetId],
            skipRemovalReplacementIds: [context.targetId],
            returnToDeckContinuation: context.returnToDeckContinuation
              ? {
                  ...context.returnToDeckContinuation,
                  finalizeOwnerGroup: context.remainingTargetIds.length === 0,
                }
              : undefined,
          },
          { next: true },
        );
      }
      return true;
    }
    case "effectRestDonCount": {
      const context = prompt.resolutionContext;
      const count = Number(command.optionId);
      const targetPlayer = getPlayer(state, context.targetSeat);
      if (
        !Number.isInteger(count) ||
        count < 0 ||
        count > context.maximum ||
        count > targetPlayer.activeDon ||
        (!context.action.target.count.upTo && count !== context.maximum)
      ) {
        return false;
      }
      targetPlayer.activeDon -= count;
      targetPlayer.restedDon += count;
      if (count > 0) {
        emitLog(
          state,
          context.controller,
          `${getPlayer(state, context.controller).playerName} rests ${count} of ${targetPlayer.playerName}'s DON!! cards.`,
          {
            sourceCardId: getInstance(state, context.sourceInstanceId).cardId,
            sourceInstanceId: context.sourceInstanceId,
            visibility: "public",
          },
        );
      }
      const originalAmount = context.action.target.count.amount;
      const remaining = originalAmount === "all" ? null : Math.max(0, originalAmount - count);
      const remainingZones = context.action.target.zones.filter((zone) => zone !== "costArea");
      if ((remaining === null || remaining > 0) && remainingZones.length > 0) {
        enqueueResolution(
          state,
          {
            kind: "effectAction",
            sourceInstanceId: context.sourceInstanceId,
            controller: context.controller,
            action: {
              ...context.action,
              target: {
                ...context.action.target,
                zones: remainingZones,
                count:
                  remaining === null
                    ? { amount: "all" }
                    : {
                        amount: remaining,
                        ...(context.action.target.count.upTo ? { upTo: true } : {}),
                      },
              },
            },
          },
          { next: true },
        );
      }
      return true;
    }
    case "effectMixedRestSelection": {
      const context = prompt.resolutionContext;
      const selectedIds = command.selectedIds ?? [];
      if (
        selectedIds.length < (context.action.target.count.upTo ? 0 : context.requested) ||
        selectedIds.length > context.requested ||
        new Set(selectedIds).size !== selectedIds.length ||
        selectedIds.some((id) => !context.candidateIds.includes(id))
      ) {
        return false;
      }
      enqueueResolution(
        state,
        {
          kind: "effectAction",
          sourceInstanceId: context.sourceInstanceId,
          controller: context.controller,
          action: context.action,
          selectedTargetIds: selectedIds,
        },
        { next: true },
      );
      return true;
    }
    case "effectRestDonForPowerCount": {
      const context = prompt.resolutionContext;
      const player = getPlayer(state, context.controller);
      const count = Number(command.optionId);
      if (
        !Number.isInteger(count) ||
        count < 0 ||
        count > context.maximum ||
        count > player.activeDon
      ) {
        return false;
      }
      player.activeDon -= count;
      player.restedDon += count;
      enqueueResolution(
        state,
        {
          kind: "effectAction",
          sourceInstanceId: context.sourceInstanceId,
          controller: context.controller,
          action: {
            action: "modifyPower",
            target: context.action.target,
            value: count * context.action.valuePerDon,
            duration: context.action.duration,
          },
        },
        { next: true },
      );
      return true;
    }
    case "effectGuessTopDeckCost": {
      const context = prompt.resolutionContext;
      const chosenCost = Number(command.optionId);
      if (!Number.isInteger(chosenCost) || chosenCost < 0 || chosenCost > 10) {
        return false;
      }
      if (getPlayer(state, context.owner).deck[0] !== context.revealedInstanceId) {
        return false;
      }
      const revealedCard = getCardForInstance(state, context.revealedInstanceId);
      emitLog(
        state,
        context.controller,
        `${getPlayer(state, context.controller).playerName} chooses cost ${chosenCost} and reveals ${cardName(revealedCard)} from the top of ${getPlayer(state, context.owner).playerName}'s deck.`,
        {
          sourceCardId: getInstance(state, context.sourceInstanceId).cardId,
          sourceInstanceId: context.sourceInstanceId,
          targetIds: [context.revealedInstanceId],
          visibility: "public",
        },
      );
      if (baseCost(revealedCard) === chosenCost) {
        for (const action of [...context.action.onMatch].reverse()) {
          enqueueResolution(
            state,
            {
              kind: "effectAction",
              sourceInstanceId: context.sourceInstanceId,
              controller: context.controller,
              action,
            },
            { next: true },
          );
        }
      }
      return true;
    }
    case "effectActionChoice": {
      const context = prompt.resolutionContext;
      const optionIndex = Number(command.optionId);
      const selectedActions = context.options[optionIndex];
      if (!Number.isInteger(optionIndex) || !selectedActions) {
        return false;
      }
      for (const action of [...selectedActions].reverse()) {
        enqueueResolution(
          state,
          {
            kind: "effectAction",
            sourceInstanceId: context.sourceInstanceId,
            controller: context.controller,
            action,
            previousActionTargetIds: context.previousActionTargetIds,
          },
          { next: true },
        );
      }
      return true;
    }
    case "effectActionOptional": {
      const context = prompt.resolutionContext;
      if (command.optionId === "yes") {
        for (const action of [...context.actions].reverse()) {
          enqueueResolution(
            state,
            {
              kind: "effectAction",
              sourceInstanceId: context.sourceInstanceId,
              controller: context.controller,
              action,
              previousActionTargetIds: context.previousActionTargetIds,
            },
            { next: true },
          );
        }
      } else {
        emitLog(
          state,
          command.seat,
          `${getPlayer(state, command.seat).playerName} skips the optional action.`,
          {
            sourceCardId: prompt.sourceCardId,
            sourceInstanceId: prompt.sourceInstanceId,
            visibility: "public",
          },
        );
      }
      return true;
    }
    case "effectOptional":
      if (command.optionId === "yes") {
        enqueueResolution(
          state,
          {
            kind: "effectBlock",
            sourceInstanceId: prompt.resolutionContext.sourceInstanceId,
            controller: prompt.resolutionContext.controller,
            trigger: prompt.resolutionContext.trigger,
            blockIndex: prompt.resolutionContext.blockIndex,
            trashHandIds: prompt.resolutionContext.trashHandIds,
            confirmed: true,
            triggerEvent: prompt.resolutionContext.triggerEvent,
          },
          { next: true },
        );
      } else {
        emitLog(
          state,
          command.seat,
          `${getPlayer(state, command.seat).playerName} skips the optional effect.`,
          {
            sourceCardId: prompt.sourceCardId,
            sourceInstanceId: prompt.sourceInstanceId,
            visibility: "public",
          },
        );
      }
      return true;
    case "effectCostTrashFromHand": {
      const context = prompt.resolutionContext;
      const selectedIds = command.selectedIds ?? [];
      const liveCandidateIds = candidatesForTrashFromHandCost(
        state,
        context.controller,
        context.sourceInstanceId,
        context.cost,
      );
      if (
        selectedIds.length !== context.amount ||
        new Set(selectedIds).size !== selectedIds.length ||
        selectedIds.some(
          (instanceId) =>
            !context.candidateIds.includes(instanceId) || !liveCandidateIds.includes(instanceId),
        )
      ) {
        return false;
      }
      enqueueResolution(
        state,
        {
          kind: "effectBlock",
          sourceInstanceId: context.sourceInstanceId,
          controller: context.controller,
          trigger: context.trigger,
          blockIndex: context.blockIndex,
          trashHandIds: selectedIds,
          costPaymentIds: context.costPaymentIds,
          confirmed: true,
          triggerEvent: context.triggerEvent,
        },
        { next: true },
      );
      return true;
    }
    case "effectCostPlayCard":
    case "effectCostTrashCard": {
      const context = prompt.resolutionContext;
      const selectedIds = command.selectedIds ?? [];
      if (
        selectedIds.length !== context.amount ||
        new Set(selectedIds).size !== selectedIds.length ||
        selectedIds.some((instanceId) => !context.candidateIds.includes(instanceId))
      ) {
        return false;
      }
      enqueueResolution(
        state,
        {
          kind: "effectBlock",
          sourceInstanceId: context.sourceInstanceId,
          controller: context.controller,
          trigger: context.trigger,
          blockIndex: context.blockIndex,
          costPaymentIds: selectedIds,
          confirmed: true,
          triggerEvent: context.triggerEvent,
        },
        { next: true },
      );
      return true;
    }
    case "effectCostReturnDon": {
      const context = prompt.resolutionContext;
      const selectedIds = command.selectedIds ?? [];
      const liveCandidateIds = returnDonCostOptions(state, context.controller).map(
        (option) => option.id,
      );
      const card = getCard(getInstance(state, context.sourceInstanceId).cardId);
      const returnDonCost = effectBlocksFor(card, context.trigger)[context.blockIndex]?.costs?.find(
        (cost) => cost.cost === "returnDon",
      );
      const minimumAmount = returnDonCost?.minimumAmount ?? context.amount;
      const maximumAmount =
        returnDonCost?.minimumAmount === undefined ? context.amount : liveCandidateIds.length;
      if (
        selectedIds.length < minimumAmount ||
        selectedIds.length > maximumAmount ||
        new Set(selectedIds).size !== selectedIds.length ||
        selectedIds.some(
          (id) => !context.candidateIds.includes(id) || !liveCandidateIds.includes(id),
        )
      ) {
        return false;
      }
      enqueueResolution(
        state,
        {
          kind: "effectBlock",
          sourceInstanceId: context.sourceInstanceId,
          controller: context.controller,
          trigger: context.trigger,
          blockIndex: context.blockIndex,
          trashHandIds: context.trashHandIds,
          costPaymentIds: selectedIds,
          confirmed: true,
          triggerEvent: context.triggerEvent,
        },
        { next: true },
      );
      return true;
    }
    case "effectCostReturnCharacterToDeck":
      enqueueResolution(
        state,
        {
          kind: "effectBlock",
          sourceInstanceId: prompt.resolutionContext.sourceInstanceId,
          controller: prompt.resolutionContext.controller,
          trigger: prompt.resolutionContext.trigger,
          blockIndex: prompt.resolutionContext.blockIndex,
          trashHandIds: prompt.resolutionContext.trashHandIds,
          costPaymentIds: command.selectedIds ?? [],
          confirmed: true,
          triggerEvent: prompt.resolutionContext.triggerEvent,
        },
        { next: true },
      );
      return true;
    case "effectCostReturnCharacter": {
      const context = prompt.resolutionContext;
      const selectedIds = command.selectedIds ?? [];
      const liveCandidateIds = getPlayer(state, context.controller).characterArea.filter(
        (entry): entry is string => Boolean(entry),
      );
      if (
        selectedIds.length !== context.amount ||
        new Set(selectedIds).size !== selectedIds.length ||
        selectedIds.some(
          (instanceId) =>
            !context.candidateIds.includes(instanceId) || !liveCandidateIds.includes(instanceId),
        )
      ) {
        return false;
      }
      if (
        selectedIds.length === 1 &&
        promptForEffectRemovalReplacement(
          state,
          selectedIds[0]!,
          context.controller,
          context.sourceInstanceId,
          {
            action: "returnToHand",
            target: {
              player: "self",
              zones: ["character"],
              count: { amount: 1 },
            },
          },
          [],
          undefined,
          {
            sourceInstanceId: context.sourceInstanceId,
            controller: context.controller,
            trigger: context.trigger,
            blockIndex: context.blockIndex,
            costPaymentIdsByType: {
              ...context.costPaymentIdsByType,
              returnCharacter: selectedIds,
            },
            confirmed: true,
            triggerEvent: context.triggerEvent,
          },
        )
      ) {
        return true;
      }
      enqueueResolution(
        state,
        {
          kind: "effectBlock",
          sourceInstanceId: context.sourceInstanceId,
          controller: context.controller,
          trigger: context.trigger,
          blockIndex: context.blockIndex,
          costPaymentIdsByType: {
            ...context.costPaymentIdsByType,
            returnCharacter: selectedIds,
          },
          confirmed: true,
          triggerEvent: context.triggerEvent,
        },
        { next: true },
      );
      return true;
    }
    case "effectCostTrashLife":
    case "effectCostAddLifeToHand": {
      if (command.optionId !== "top" && command.optionId !== "bottom") {
        return false;
      }
      const context = prompt.resolutionContext;
      enqueueResolution(
        state,
        {
          kind: "effectBlock",
          sourceInstanceId: context.sourceInstanceId,
          controller: context.controller,
          trigger: context.trigger,
          blockIndex: context.blockIndex,
          costPaymentIds: [command.optionId],
          confirmed: true,
          triggerEvent: context.triggerEvent,
        },
        { next: true },
      );
      return true;
    }
    case "effectCostReturnHandToDeck": {
      const context = prompt.resolutionContext;
      const selectedIds = command.selectedIds ?? [];
      const player = getPlayer(state, context.controller);
      if (
        selectedIds.length !== context.amount ||
        new Set(selectedIds).size !== selectedIds.length ||
        selectedIds.some(
          (instanceId) =>
            !context.candidateIds.includes(instanceId) || !player.hand.includes(instanceId),
        )
      ) {
        return false;
      }
      enqueueResolution(
        state,
        {
          kind: "effectBlock",
          sourceInstanceId: context.sourceInstanceId,
          controller: context.controller,
          trigger: context.trigger,
          blockIndex: context.blockIndex,
          costPaymentIds: selectedIds,
          confirmed: true,
          triggerEvent: context.triggerEvent,
        },
        { next: true },
      );
      return true;
    }
    case "effectCostReturnTrashToDeck": {
      const context = prompt.resolutionContext;
      const selectedIds = command.selectedIds ?? [];
      const liveCandidateIds = getPlayer(state, context.controller).trash;
      if (
        selectedIds.length !== context.amount ||
        new Set(selectedIds).size !== selectedIds.length ||
        selectedIds.some(
          (instanceId) =>
            !context.candidateIds.includes(instanceId) || !liveCandidateIds.includes(instanceId),
        )
      ) {
        return false;
      }
      enqueueResolution(
        state,
        {
          kind: "effectBlock",
          sourceInstanceId: context.sourceInstanceId,
          controller: context.controller,
          trigger: context.trigger,
          blockIndex: context.blockIndex,
          costPaymentIds: selectedIds,
          confirmed: true,
          triggerEvent: context.triggerEvent,
        },
        { next: true },
      );
      return true;
    }
    case "effectCostReturnThisAndHandToDeck":
      enqueueResolution(
        state,
        {
          kind: "effectBlock",
          sourceInstanceId: prompt.resolutionContext.sourceInstanceId,
          controller: prompt.resolutionContext.controller,
          trigger: prompt.resolutionContext.trigger,
          blockIndex: prompt.resolutionContext.blockIndex,
          costPaymentIds: command.selectedIds ?? [],
          confirmed: true,
          triggerEvent: prompt.resolutionContext.triggerEvent,
        },
        { next: true },
      );
      return true;
    case "effectCostRestCards": {
      const context = prompt.resolutionContext;
      const selectedIds = command.selectedIds ?? [];
      if (
        selectedIds.length !== context.amount ||
        new Set(selectedIds).size !== selectedIds.length ||
        selectedIds.some((instanceId) => !context.candidateIds.includes(instanceId))
      ) {
        return false;
      }
      enqueueResolution(
        state,
        {
          kind: "effectBlock",
          sourceInstanceId: context.sourceInstanceId,
          controller: context.controller,
          trigger: context.trigger,
          blockIndex: context.blockIndex,
          costPaymentIdsByType: {
            ...context.costPaymentIdsByType,
            restCards: selectedIds,
          },
          confirmed: true,
          triggerEvent: context.triggerEvent,
        },
        { next: true },
      );
      return true;
    }
    case "effectCostKoCharacter": {
      const context = prompt.resolutionContext;
      const selectedIds = command.selectedIds ?? [];
      const card = getCard(getInstance(state, context.sourceInstanceId).cardId);
      const block = effectBlocksFor(card, context.trigger)[context.blockIndex];
      const cost = block?.costs?.find((candidate) => candidate.cost === "koCharacter");
      if (!cost) return false;
      const liveCandidateIds = candidatesForKoCharacterCost(
        state,
        context.controller,
        context.sourceInstanceId,
        cost,
      );
      if (
        selectedIds.length !== context.amount ||
        new Set(selectedIds).size !== selectedIds.length ||
        selectedIds.some(
          (instanceId) =>
            !context.candidateIds.includes(instanceId) || !liveCandidateIds.includes(instanceId),
        )
      ) {
        return false;
      }
      enqueueResolution(
        state,
        {
          kind: "effectBlock",
          sourceInstanceId: context.sourceInstanceId,
          controller: context.controller,
          trigger: context.trigger,
          blockIndex: context.blockIndex,
          costPaymentIds: selectedIds,
          confirmed: true,
          triggerEvent: context.triggerEvent,
        },
        { next: true },
      );
      return true;
    }
    case "effectCostTrashCharacter": {
      const context = prompt.resolutionContext;
      const selectedIds = command.selectedIds ?? [];
      const card = getCard(getInstance(state, context.sourceInstanceId).cardId);
      const block = effectBlocksFor(card, context.trigger)[context.blockIndex];
      const cost = block?.costs?.find((candidate) => candidate.cost === "trashCharacter");
      if (!cost) return false;
      const liveCandidateIds = candidatesForTrashCharacterCost(
        state,
        context.controller,
        context.sourceInstanceId,
        cost,
      );
      if (
        selectedIds.length !== context.amount ||
        new Set(selectedIds).size !== selectedIds.length ||
        selectedIds.some(
          (instanceId) =>
            !context.candidateIds.includes(instanceId) || !liveCandidateIds.includes(instanceId),
        )
      ) {
        return false;
      }
      if (
        selectedIds.length === 1 &&
        promptForEffectRemovalReplacement(
          state,
          selectedIds[0]!,
          context.controller,
          context.sourceInstanceId,
          {
            action: "trashFromField",
            target: {
              player: "self",
              zones: ["character"],
              count: { amount: 1 },
            },
          },
          [],
          undefined,
          {
            sourceInstanceId: context.sourceInstanceId,
            controller: context.controller,
            trigger: context.trigger,
            blockIndex: context.blockIndex,
            costPaymentIds: selectedIds,
            costsPaid: true,
            confirmed: true,
            triggerEvent: context.triggerEvent,
          },
        )
      ) {
        return true;
      }
      enqueueResolution(
        state,
        {
          kind: "effectBlock",
          sourceInstanceId: context.sourceInstanceId,
          controller: context.controller,
          trigger: context.trigger,
          blockIndex: context.blockIndex,
          costPaymentIds: selectedIds,
          confirmed: true,
          triggerEvent: context.triggerEvent,
        },
        { next: true },
      );
      return true;
    }
    case "effectCostRevealFromHand": {
      const context = prompt.resolutionContext;
      const selectedIds = command.selectedIds ?? [];
      const card = getCard(getInstance(state, context.sourceInstanceId).cardId);
      const block = effectBlocksFor(card, context.trigger)[context.blockIndex];
      const cost = block?.costs?.find((candidate) => candidate.cost === "revealFromHand");
      if (!cost) {
        return false;
      }
      const liveCandidateIds = candidatesForRevealFromHandCost(
        state,
        context.controller,
        context.sourceInstanceId,
        cost,
      );
      if (
        selectedIds.length !== context.amount ||
        new Set(selectedIds).size !== selectedIds.length ||
        selectedIds.some(
          (instanceId) =>
            !context.candidateIds.includes(instanceId) || !liveCandidateIds.includes(instanceId),
        )
      ) {
        return false;
      }
      enqueueResolution(
        state,
        {
          kind: "effectBlock",
          sourceInstanceId: context.sourceInstanceId,
          controller: context.controller,
          trigger: context.trigger,
          blockIndex: context.blockIndex,
          costPaymentIds: selectedIds,
          confirmed: true,
          triggerEvent: context.triggerEvent,
        },
        { next: true },
      );
      return true;
    }
    case "effectTargetSelection": {
      const submittedIds = command.selectedIds ?? (command.optionId ? [command.optionId] : []);
      const opaqueCandidateIds = prompt.resolutionContext.opaqueCandidateIds;
      const concealedCandidateIds = opaqueCandidateIds
        ? new Set(Object.values(opaqueCandidateIds))
        : undefined;
      const selectedTargetIds = opaqueCandidateIds
        ? submittedIds
            .map(
              (id) => opaqueCandidateIds[id] ?? (concealedCandidateIds?.has(id) ? undefined : id),
            )
            .filter((id): id is string => Boolean(id))
        : submittedIds;
      if (opaqueCandidateIds && selectedTargetIds.length !== submittedIds.length) {
        return false;
      }
      const action = prompt.resolutionContext.action;
      const sourceInstanceId = prompt.resolutionContext.sourceInstanceId;
      const target = "target" in action ? action.target : null;
      if (!target) {
        return false;
      }
      const pool = candidatePoolForTarget(
        state,
        prompt.resolutionContext.controller,
        prompt.resolutionContext.sourceInstanceId,
        target,
      );
      const liveCandidateIds =
        action.action === "freeze" && target.zones.includes("costArea")
          ? freezeActionCandidateIds(
              state,
              prompt.resolutionContext.controller,
              prompt.resolutionContext.sourceInstanceId,
              action,
            )
          : pool.candidateIds.filter((instanceId) =>
              actionTargetIsEligible(state, action, instanceId, sourceInstanceId),
            );
      const maximum =
        target.count.amount === "all"
          ? liveCandidateIds.length
          : Math.min(target.count.amount, liveCandidateIds.length);
      const minimum = target.count.upTo ? 0 : maximum;
      if (
        (!pool.supported && !(action.action === "freeze" && target.zones.includes("costArea"))) ||
        selectedTargetIds.length < minimum ||
        selectedTargetIds.length > maximum ||
        new Set(selectedTargetIds).size !== selectedTargetIds.length ||
        selectedTargetIds.some((instanceId) => !liveCandidateIds.includes(instanceId)) ||
        !selectionSatisfiesTotalConstraint(state, selectedTargetIds, target)
      ) {
        return false;
      }
      enqueueResolution(
        state,
        {
          kind: "effectAction",
          sourceInstanceId: prompt.resolutionContext.sourceInstanceId,
          controller: prompt.resolutionContext.controller,
          action,
          selectedTargetIds,
          previousActionTargetIds: prompt.resolutionContext.previousActionTargetIds,
        },
        { next: true },
      );
      return true;
    }
    case "effectTrashFromHandSelection": {
      const context = prompt.resolutionContext;
      const submittedIds = command.selectedIds ?? [];
      const selectedIds = context.opaqueCandidateIds
        ? submittedIds
            .map((id) => context.opaqueCandidateIds?.[id])
            .filter((id): id is string => Boolean(id))
        : submittedIds;
      if (context.opaqueCandidateIds && selectedIds.length !== submittedIds.length) {
        return false;
      }
      const player = getPlayer(state, context.seat);
      const requestedAmount =
        context.action.untilHandSize === undefined
          ? context.action.amount === "all"
            ? context.candidateIds.length
            : context.action.amount
          : Math.max(0, player.hand.length - context.action.untilHandSize);
      const maximum = Math.min(requestedAmount, context.candidateIds.length);
      const minimum = context.action.upTo ? 0 : maximum;
      const liveCandidateIds = player.hand.filter((instanceId) =>
        (context.action.filters ?? []).every((filter) => {
          const result = matchesTargetFilter(state, context.sourceInstanceId, instanceId, filter);
          return result.supported && result.matches;
        }),
      );
      if (
        selectedIds.length < minimum ||
        selectedIds.length > maximum ||
        new Set(selectedIds).size !== selectedIds.length ||
        selectedIds.some(
          (instanceId) =>
            !context.candidateIds.includes(instanceId) || !liveCandidateIds.includes(instanceId),
        )
      ) {
        return false;
      }
      enqueueResolution(
        state,
        {
          kind: "effectAction",
          sourceInstanceId: context.sourceInstanceId,
          controller: context.controller,
          action: context.action,
          selectedTargetIds: selectedIds,
        },
        { next: true },
      );
      return true;
    }
    case "effectRevealFromHandSelection": {
      const context = prompt.resolutionContext;
      const submittedIds = command.selectedIds ?? [];
      const selectedIds = context.opaqueCandidateIds
        ? submittedIds
            .map((id) => context.opaqueCandidateIds?.[id])
            .filter((id): id is string => Boolean(id))
        : submittedIds;
      if (context.opaqueCandidateIds && selectedIds.length !== submittedIds.length) {
        return false;
      }
      const player = getPlayer(state, context.seat);
      const maximum =
        context.action.amount === "all"
          ? context.candidateIds.length
          : Math.min(context.action.amount, context.candidateIds.length);
      if (
        selectedIds.length > maximum ||
        (!context.action.upTo && selectedIds.length !== maximum) ||
        new Set(selectedIds).size !== selectedIds.length ||
        selectedIds.some(
          (instanceId) =>
            !context.candidateIds.includes(instanceId) || !player.hand.includes(instanceId),
        )
      ) {
        return false;
      }
      enqueueResolution(
        state,
        {
          kind: "effectAction",
          sourceInstanceId: context.sourceInstanceId,
          controller: context.controller,
          action: context.action,
          selectedTargetIds: selectedIds,
        },
        { next: true },
      );
      return true;
    }
    case "effectPlaySelection": {
      const context = prompt.resolutionContext;
      const selectedIds = command.selectedIds ?? [];
      const liveCandidateIds = candidatesForPlayAction(
        state,
        context.controller,
        context.sourceInstanceId,
        context.action,
        context.previousActionTargetIds,
      );
      if (!liveCandidateIds) {
        return false;
      }
      const requested =
        context.action.count.amount === "all"
          ? liveCandidateIds.length
          : context.action.count.amount;
      const maximum = Math.min(requested, liveCandidateIds.length);
      const minimum = context.action.count.upTo ? 0 : maximum;
      if (
        selectedIds.length < minimum ||
        selectedIds.length > maximum ||
        new Set(selectedIds).size !== selectedIds.length ||
        selectedIds.some(
          (instanceId) =>
            !context.candidateIds.includes(instanceId) || !liveCandidateIds.includes(instanceId),
        )
      ) {
        return false;
      }
      if (
        context.action.differentNames &&
        new Set(selectedIds.map((instanceId) => getCardForInstance(state, instanceId).name))
          .size !== selectedIds.length
      ) {
        return false;
      }
      enqueueResolution(
        state,
        {
          kind: "effectAction",
          sourceInstanceId: context.sourceInstanceId,
          controller: context.controller,
          action: context.action,
          selectedTargetIds: selectedIds,
          previousActionTargetIds: context.previousActionTargetIds,
        },
        { next: true },
      );
      return true;
    }
    case "effectGroupedPlaySelection": {
      const context = prompt.resolutionContext;
      const selectedIds = command.selectedIds ?? [];
      const liveCandidateIds = candidatesForGroupedPlayAction(
        state,
        context.controller,
        context.sourceInstanceId,
        context.action,
        context.previousActionTargetIds,
      );
      const playingSeat =
        context.action.source.player === "self"
          ? context.controller
          : otherSeat(context.controller);
      const maximum = liveCandidateIds
        ? Math.min(
            context.action.groups.length,
            liveCandidateIds.length,
            getOpenCharacterSlots(state, playingSeat).length,
          )
        : 0;
      if (
        !liveCandidateIds ||
        selectedIds.length > maximum ||
        new Set(selectedIds).size !== selectedIds.length ||
        selectedIds.some(
          (instanceId) =>
            !context.candidateIds.includes(instanceId) || !liveCandidateIds.includes(instanceId),
        ) ||
        !selectionSatisfiesGroupedPlayAction(
          state,
          context.controller,
          context.sourceInstanceId,
          context.action,
          selectedIds,
        )
      ) {
        return false;
      }
      if (selectedIds.length === 0) return true;
      if (selectedIds.length === 1) {
        return completeGroupedPlay(
          state,
          context.sourceInstanceId,
          context.controller,
          context.action,
          selectedIds,
          selectedIds[0]!,
        );
      }
      createChoicePrompt(state, {
        choiceKind: "chooseOption",
        seat: playingSeat,
        label: `${cardName(getCardForInstance(state, context.sourceInstanceId))} play states`,
        details: "Choose which card to play active. The other card will be played rested.",
        sourceCardId: getInstance(state, context.sourceInstanceId).cardId,
        sourceInstanceId: context.sourceInstanceId,
        eventId: null,
        options: validActiveIdsForGroupedPlayAction(
          state,
          context.controller,
          context.sourceInstanceId,
          context.action,
          selectedIds,
        ).map((instanceId) => ({
          id: instanceId,
          label: cardName(getCardForInstance(state, instanceId)),
          value: instanceId,
          targetId: instanceId,
        })),
        minSelections: 1,
        maxSelections: 1,
        context: { action: "playGrouped", assignment: "active" },
        resolutionContext: {
          intent: "effectGroupedPlayStateAssignment",
          sourceInstanceId: context.sourceInstanceId,
          controller: context.controller,
          action: context.action,
          selectedIds,
        },
      });
      return true;
    }
    case "effectGroupedPlayStateAssignment": {
      const context = prompt.resolutionContext;
      if (!command.optionId || !context.selectedIds.includes(command.optionId)) return false;
      return completeGroupedPlay(
        state,
        context.sourceInstanceId,
        context.controller,
        context.action,
        context.selectedIds,
        command.optionId,
      );
    }
    case "effectGroupedPlayOnPlayOrder": {
      const context = prompt.resolutionContext;
      const selectedIds = command.selectedIds ?? [];
      const expectedIds = context.playedCards.map(({ instanceId }) => instanceId);
      if (
        selectedIds.length !== expectedIds.length ||
        new Set(selectedIds).size !== selectedIds.length ||
        selectedIds.some((instanceId) => !expectedIds.includes(instanceId))
      ) {
        return false;
      }
      enqueueDeferredOnPlayBlocks(
        state,
        context.controller,
        selectedIds.map(
          (instanceId) => context.playedCards.find((card) => card.instanceId === instanceId)!,
        ),
      );
      return true;
    }
    case "effectSearchSelection": {
      const context = prompt.resolutionContext;
      const selectedIds = command.selectedIds ?? [];
      const requested =
        context.action.revealCount.amount === "all"
          ? context.eligibleIds.length
          : context.action.revealCount.amount;
      const openCharacterSlots = getOpenCharacterSlots(state, context.controller).length;
      const playableEligibleIds =
        context.action.revealDestination === "character"
          ? context.eligibleIds.filter((instanceId) => {
              const card = getCardForInstance(state, instanceId);
              return card.cardType === "stage" || card.cardType === "character";
            })
          : context.eligibleIds;
      const destinationCapacity =
        context.action.revealDestination === "character"
          ? playableEligibleIds.filter(
              (instanceId) => getCardForInstance(state, instanceId).cardType === "stage",
            ).length + openCharacterSlots
          : playableEligibleIds.length;
      const maximum = Math.min(requested, playableEligibleIds.length, destinationCapacity);
      const minimum = context.action.revealCount.upTo ? 0 : maximum;
      const player = getPlayer(state, context.controller);
      if (
        selectedIds.length < minimum ||
        selectedIds.length > maximum ||
        new Set(selectedIds).size !== selectedIds.length ||
        selectedIds.some((instanceId) => !playableEligibleIds.includes(instanceId)) ||
        selectedIds.filter(
          (instanceId) => getCardForInstance(state, instanceId).cardType === "character",
        ).length > openCharacterSlots ||
        player.deck
          .slice(0, context.lookedIds.length)
          .some((instanceId, index) => instanceId !== context.lookedIds[index])
      ) {
        return false;
      }
      for (const instanceId of selectedIds) {
        if (context.action.revealDestination === "character") {
          if (
            !playCardFromEffect(
              state,
              context.controller,
              instanceId,
              context.action.playState,
              context.sourceInstanceId,
            )
          ) {
            return false;
          }
        } else {
          emitLog(
            state,
            context.controller,
            `${getPlayer(state, context.controller).playerName} reveals ${cardName(getCardForInstance(state, instanceId))} and adds it to their hand.`,
            {
              sourceCardId: prompt.sourceCardId,
              sourceInstanceId: context.sourceInstanceId,
              targetIds: [instanceId],
              visibility: "public",
            },
          );
          moveCard(state, instanceId, context.controller, "hand", {
            faceUp: false,
            publicKnowledge: false,
            actor: context.controller,
            visibility: "private",
          });
        }
      }
      const remainderIds = context.lookedIds.filter(
        (instanceId) => !selectedIds.includes(instanceId),
      );
      if (context.action.remainderPosition === "trash") {
        finishSearchRemainder(
          state,
          context.sourceInstanceId,
          context.controller,
          remainderIds,
          "trash",
        );
        return true;
      }
      if (remainderIds.length <= 1) {
        if (context.action.remainderPosition === "any") {
          promptForSearchRemainderPosition(
            state,
            context.sourceInstanceId,
            context.controller,
            remainderIds,
          );
          return true;
        }
        finishSearchRemainder(
          state,
          context.sourceInstanceId,
          context.controller,
          remainderIds,
          context.action.remainderPosition === "top" ? "top" : "bottom",
        );
        return true;
      }
      const remainderPosition = context.action.remainderPosition === "top" ? "top" : "bottom";
      createChoicePrompt(state, {
        choiceKind: "orderCards",
        seat: context.controller,
        label: `${cardName(getCardForInstance(state, context.sourceInstanceId))} orders the remaining cards`,
        details: `Order the remaining cards from first to last at the ${remainderPosition} of your deck.`,
        sourceCardId: prompt.sourceCardId,
        sourceInstanceId: context.sourceInstanceId,
        eventId: null,
        options: remainderIds.map((instanceId) => ({
          id: instanceId,
          label: cardName(getCardForInstance(state, instanceId)),
          value: instanceId,
          targetId: instanceId,
        })),
        minSelections: remainderIds.length,
        maxSelections: remainderIds.length,
        context: { action: "search", role: "remainderOrder", ordered: true },
        resolutionContext: {
          intent: "effectSearchRemainderOrder",
          sourceInstanceId: context.sourceInstanceId,
          controller: context.controller,
          action: context.action,
          remainderIds,
        },
      });
      return true;
    }
    case "effectSearchRemainderOrder": {
      const context = prompt.resolutionContext;
      const selectedIds = command.selectedIds ?? [];
      const player = getPlayer(state, context.controller);
      if (
        selectedIds.length !== context.remainderIds.length ||
        new Set(selectedIds).size !== selectedIds.length ||
        selectedIds.some(
          (instanceId) =>
            !context.remainderIds.includes(instanceId) || !player.deck.includes(instanceId),
        )
      ) {
        return false;
      }
      if (context.action.remainderPosition === "any") {
        promptForSearchRemainderPosition(
          state,
          context.sourceInstanceId,
          context.controller,
          selectedIds,
        );
        return true;
      }
      finishSearchRemainder(
        state,
        context.sourceInstanceId,
        context.controller,
        selectedIds,
        context.action.remainderPosition === "top" ? "top" : "bottom",
      );
      return true;
    }
    case "effectReturnToDeckOwnerOrder": {
      const context = prompt.resolutionContext;
      const selectedIds = command.selectedIds ?? [];
      if (
        selectedIds.length !== context.targetIds.length ||
        new Set(selectedIds).size !== selectedIds.length ||
        selectedIds.some((instanceId) => !context.targetIds.includes(instanceId))
      ) {
        return false;
      }
      enqueueResolution(
        state,
        {
          kind: "effectAction",
          sourceInstanceId: context.sourceInstanceId,
          controller: context.controller,
          action: context.action,
          selectedTargetIds: selectedIds,
          returnToDeckContinuation: {
            ...context.continuation,
            orderResolved: true,
            orderedTargetIds: selectedIds,
          },
        },
        { next: true },
      );
      return true;
    }
    case "effectReturnToDeckOrder": {
      const context = prompt.resolutionContext;
      const selectedIds = command.selectedIds ?? [];
      const livePool = candidatePoolForTarget(
        state,
        context.controller,
        context.sourceInstanceId,
        context.action.target,
      );
      if (
        selectedIds.length !== context.targetIds.length ||
        new Set(selectedIds).size !== selectedIds.length ||
        selectedIds.some((instanceId) => !context.targetIds.includes(instanceId)) ||
        !livePool.supported ||
        selectedIds.some((instanceId) => !livePool.candidateIds.includes(instanceId))
      ) {
        return false;
      }
      createChoicePrompt(state, {
        choiceKind: "chooseOption",
        seat: context.owner,
        label: `${cardName(getCardForInstance(state, context.sourceInstanceId))} chooses a deck position`,
        details: "Place the selected cards at the top or bottom of your deck.",
        sourceCardId: getInstance(state, context.sourceInstanceId).cardId,
        sourceInstanceId: context.sourceInstanceId,
        eventId: null,
        options: [
          { id: "top", label: "Top of deck", value: "top" },
          { id: "bottom", label: "Bottom of deck", value: "bottom" },
        ],
        minSelections: 1,
        maxSelections: 1,
        context: { action: "returnToDeck", position: "topOrBottom" },
        resolutionContext: {
          intent: "effectDeckPosition",
          sourceInstanceId: context.sourceInstanceId,
          controller: context.controller,
          action: context.action,
          selectedTargetIds: selectedIds,
          returnToDeckContinuation: {
            owner: context.owner,
            allTargetIds: selectedIds,
            publicTargetIds: selectedIds,
            orderedTargetIds: selectedIds,
            remainingOwnerGroups: [],
            orderResolved: true,
            finalizeOwnerGroup: true,
          },
        },
      });
      return true;
    }
    case "effectSearchRemainderPosition": {
      if (command.optionId !== "top" && command.optionId !== "bottom") {
        return false;
      }
      const context = prompt.resolutionContext;
      finishSearchRemainder(
        state,
        context.sourceInstanceId,
        context.controller,
        context.orderedIds,
        command.optionId,
      );
      return true;
    }
    case "effectRearrangeDeckTrashSelection": {
      const context = prompt.resolutionContext;
      const selectedIds = command.selectedIds ?? [];
      const targetSeat =
        context.action.player === "self" ? context.controller : otherSeat(context.controller);
      const player = getPlayer(state, targetSeat);
      if (
        selectedIds.length > (context.action.trashUpTo ?? 0) ||
        new Set(selectedIds).size !== selectedIds.length ||
        selectedIds.some((instanceId) => !context.lookedIds.includes(instanceId)) ||
        player.deck
          .slice(0, context.lookedIds.length)
          .some((instanceId, index) => instanceId !== context.lookedIds[index])
      ) {
        return false;
      }
      for (const instanceId of selectedIds) {
        const instance = getInstance(state, instanceId);
        moveCard(state, instanceId, instance.owner, "trash", {
          faceUp: true,
          publicKnowledge: true,
          actor: context.controller,
          sourceInstanceId: context.sourceInstanceId,
          visibility: "public",
        });
      }
      const remainderIds = context.lookedIds.filter(
        (instanceId) => !selectedIds.includes(instanceId),
      );
      if (remainderIds.length <= 1 && context.action.position !== "topOrBottom") {
        finishRearrangeDeckOrder(
          state,
          context.sourceInstanceId,
          context.controller,
          targetSeat,
          context.lookedIds,
          remainderIds,
          context.action.position,
        );
        return true;
      }
      promptForRearrangeDeckOrder(
        state,
        context.sourceInstanceId,
        context.controller,
        context.action,
        remainderIds,
      );
      return true;
    }
    case "effectRearrangeDeckOrder": {
      const context = prompt.resolutionContext;
      const selectedIds = command.selectedIds ?? [];
      const targetSeat =
        context.action.player === "self" ? context.controller : otherSeat(context.controller);
      const player = getPlayer(state, targetSeat);
      if (
        selectedIds.length !== context.lookedIds.length ||
        new Set(selectedIds).size !== selectedIds.length ||
        selectedIds.some((instanceId) => !context.lookedIds.includes(instanceId)) ||
        player.deck
          .slice(0, context.lookedIds.length)
          .some((instanceId, index) => instanceId !== context.lookedIds[index])
      ) {
        return false;
      }
      if (context.action.position !== "topOrBottom") {
        finishRearrangeDeckOrder(
          state,
          context.sourceInstanceId,
          context.controller,
          targetSeat,
          context.lookedIds,
          selectedIds,
          context.action.position,
        );
        return true;
      }
      createChoicePrompt(state, {
        choiceKind: "chooseOption",
        seat: context.controller,
        label: `${cardName(getCardForInstance(state, context.sourceInstanceId))} chooses a deck position`,
        details: "Place all looked-at cards at the top or all at the bottom of the deck.",
        sourceCardId: prompt.sourceCardId,
        sourceInstanceId: context.sourceInstanceId,
        eventId: null,
        options: [
          { id: "top", label: "Top of deck", value: "top" },
          { id: "bottom", label: "Bottom of deck", value: "bottom" },
        ],
        minSelections: 1,
        maxSelections: 1,
        context: { action: "rearrangeDeck", position: "topOrBottom" },
        resolutionContext: {
          intent: "effectRearrangeDeckPosition",
          sourceInstanceId: context.sourceInstanceId,
          controller: context.controller,
          action: context.action,
          lookedIds: context.lookedIds,
          orderedIds: selectedIds,
        },
      });
      return true;
    }
    case "effectRearrangeLifeOrder": {
      const context = prompt.resolutionContext;
      const selectedIds = command.selectedIds ?? [];
      const targetSeat =
        context.action.player === "self" ? context.controller : otherSeat(context.controller);
      const player = getPlayer(state, targetSeat);
      if (
        selectedIds.length !== context.lookedIds.length ||
        new Set(selectedIds).size !== selectedIds.length ||
        selectedIds.some((instanceId) => !context.lookedIds.includes(instanceId)) ||
        player.life.some((instanceId, index) => instanceId !== context.lookedIds[index])
      ) {
        return false;
      }
      const lifeIds = context.action.moveOneToDeckTop ? selectedIds.slice(1) : selectedIds;
      if (context.action.moveOneToDeckTop) {
        moveCard(state, selectedIds[0]!, targetSeat, "deck", {
          deckPosition: "top",
          actor: context.controller,
          sourceInstanceId: context.sourceInstanceId,
          visibility: "private",
        });
      }
      player.life = lifeIds;
      lifeIds.forEach((instanceId, index) => {
        getInstance(state, instanceId).zoneIndex = index;
      });
      emitLog(
        state,
        context.controller,
        `${cardName(getCardForInstance(state, context.sourceInstanceId))} rearranges ${lifeIds.length} Life card(s).`,
        {
          sourceCardId: prompt.sourceCardId,
          sourceInstanceId: context.sourceInstanceId,
          visibility: "public",
        },
      );
      return true;
    }
    case "effectRearrangeDeckPosition": {
      const context = prompt.resolutionContext;
      if (command.optionId !== "top" && command.optionId !== "bottom") {
        return false;
      }
      const targetSeat =
        context.action.player === "self" ? context.controller : otherSeat(context.controller);
      const player = getPlayer(state, targetSeat);
      if (
        player.deck
          .slice(0, context.lookedIds.length)
          .some((instanceId, index) => instanceId !== context.lookedIds[index])
      ) {
        return false;
      }
      finishRearrangeDeckOrder(
        state,
        context.sourceInstanceId,
        context.controller,
        targetSeat,
        context.lookedIds,
        context.orderedIds,
        command.optionId,
      );
      return true;
    }
    case "effectRedistributeDonSource": {
      const context = prompt.resolutionContext;
      const selectedIds = command.selectedIds ?? (command.optionId ? [command.optionId] : []);
      if (selectedIds.length === 0) {
        return true;
      }
      const maximum =
        context.action.count.amount === "all"
          ? context.candidateIds.length
          : context.action.count.amount;
      if (selectedIds.length > maximum || new Set(selectedIds).size !== selectedIds.length) {
        return false;
      }
      const player = getPlayer(state, context.controller);
      const liveDonorIds = [
        player.leaderInstanceId,
        ...player.characterArea.filter((entry): entry is string => Boolean(entry)),
      ];
      const selectedTokens = selectedIds.map((selectedId) => {
        if (!context.tokenized) {
          return { donorInstanceId: selectedId, tokenIndex: 0 };
        }
        const match = /^attached-don:(.+):(\d+)$/.exec(selectedId);
        return match
          ? { donorInstanceId: match[1]!, tokenIndex: Number.parseInt(match[2]!, 10) }
          : null;
      });
      if (selectedTokens.some((token) => token === null)) {
        return false;
      }
      const donorInstanceIds = selectedTokens.map((token) => token!.donorInstanceId);
      if (
        selectedIds.some((selectedId) => !context.candidateIds.includes(selectedId)) ||
        selectedTokens.some(
          (token) =>
            !liveDonorIds.includes(token!.donorInstanceId) ||
            token!.tokenIndex >= getInstance(state, token!.donorInstanceId).attachedDon,
        )
      ) {
        return false;
      }

      const recipientPool = candidatePoolForTarget(
        state,
        context.controller,
        context.sourceInstanceId,
        context.action.target,
      );
      if (!recipientPool.supported || recipientPool.candidateIds.length === 0) {
        return true;
      }

      const sourceCard = getCardForInstance(state, context.sourceInstanceId);
      createChoicePrompt(state, {
        choiceKind: "selectTargets",
        seat: context.controller,
        label: `${cardName(sourceCard)} needs a DON!! recipient`,
        details: "Choose an eligible Character to receive the DON!! card.",
        sourceCardId: sourceCard.id,
        sourceInstanceId: context.sourceInstanceId,
        eventId: null,
        options: recipientPool.candidateIds.map((instanceId) => ({
          id: instanceId,
          label: cardName(getCardForInstance(state, instanceId)),
          value: instanceId,
          targetId: instanceId,
        })),
        minSelections: 1,
        maxSelections: 1,
        context: {
          action: "redistributeDon",
          role: "donRecipient",
        },
        resolutionContext: {
          intent: "effectRedistributeDonTarget",
          sourceInstanceId: context.sourceInstanceId,
          controller: context.controller,
          action: context.action,
          donorInstanceIds,
          candidateIds: recipientPool.candidateIds,
        },
      });
      return true;
    }
    case "effectRedistributeDonTarget": {
      const selectedIds = command.selectedIds ?? (command.optionId ? [command.optionId] : []);
      if (selectedIds.length !== 1 || new Set(selectedIds).size !== 1) {
        return false;
      }
      const recipientInstanceId = selectedIds[0]!;
      const liveRecipientPool = candidatePoolForTarget(
        state,
        prompt.resolutionContext.controller,
        prompt.resolutionContext.sourceInstanceId,
        prompt.resolutionContext.action.target,
      );
      if (
        !prompt.resolutionContext.candidateIds.includes(recipientInstanceId) ||
        !liveRecipientPool.supported ||
        !liveRecipientPool.candidateIds.includes(recipientInstanceId)
      ) {
        return false;
      }

      const donorCounts = new Map<string, number>();
      for (const donorInstanceId of prompt.resolutionContext.donorInstanceIds) {
        donorCounts.set(donorInstanceId, (donorCounts.get(donorInstanceId) ?? 0) + 1);
      }
      if (
        [...donorCounts].some(
          ([donorInstanceId, count]) => getInstance(state, donorInstanceId).attachedDon < count,
        )
      ) {
        return false;
      }
      const recipient = getInstance(state, recipientInstanceId);
      for (const [donorInstanceId, count] of donorCounts) {
        getInstance(state, donorInstanceId).attachedDon -= count;
      }
      recipient.attachedDon += prompt.resolutionContext.donorInstanceIds.length;
      const donorNames = [...donorCounts].map(([donorInstanceId]) =>
        cardName(getCardForInstance(state, donorInstanceId)),
      );
      emitLog(
        state,
        prompt.resolutionContext.controller,
        `${cardName(getCardForInstance(state, prompt.resolutionContext.sourceInstanceId))} moves ${prompt.resolutionContext.donorInstanceIds.length} DON!! card(s) from ${donorNames.join(", ")} to ${cardName(getCardForInstance(state, recipient.instanceId))}.`,
        {
          sourceCardId: prompt.sourceCardId,
          sourceInstanceId: prompt.sourceInstanceId,
          targetIds: [...donorCounts.keys(), recipient.instanceId],
          visibility: "public",
        },
      );
      return true;
    }
    case "effectSetActiveDon": {
      const selectedCount = Number.parseInt(command.optionId ?? "", 10);
      const player = getPlayer(state, prompt.resolutionContext.controller);
      const maximum = Math.min(prompt.resolutionContext.maximum, player.restedDon);
      if (
        !Number.isInteger(selectedCount) ||
        command.optionId !== String(selectedCount) ||
        selectedCount < 0 ||
        selectedCount > maximum
      ) {
        return false;
      }
      player.restedDon -= selectedCount;
      player.activeDon += selectedCount;
      emitLog(
        state,
        prompt.resolutionContext.controller,
        `${getPlayer(state, prompt.resolutionContext.controller).playerName} sets ${selectedCount} DON!! card${selectedCount === 1 ? "" : "s"} as active.`,
        {
          sourceCardId: prompt.sourceCardId,
          sourceInstanceId: prompt.sourceInstanceId,
          visibility: "public",
        },
      );
      return true;
    }
    case "effectDeckPosition": {
      if (command.optionId !== "top" && command.optionId !== "bottom") {
        return false;
      }
      const livePool = candidatePoolForTarget(
        state,
        prompt.resolutionContext.controller,
        prompt.resolutionContext.sourceInstanceId,
        prompt.resolutionContext.action.target,
      );
      if (
        !livePool.supported ||
        prompt.resolutionContext.selectedTargetIds.some(
          (instanceId) => !livePool.candidateIds.includes(instanceId),
        )
      ) {
        return false;
      }
      enqueueResolution(
        state,
        {
          kind: "effectAction",
          sourceInstanceId: prompt.resolutionContext.sourceInstanceId,
          controller: prompt.resolutionContext.controller,
          action: {
            ...prompt.resolutionContext.action,
            position: command.optionId,
          },
          selectedTargetIds: prompt.resolutionContext.selectedTargetIds,
          returnToDeckContinuation: prompt.resolutionContext.returnToDeckContinuation,
        },
        { next: true },
      );
      return true;
    }
    case "effectLifePosition": {
      if (command.optionId !== "top" && command.optionId !== "bottom") {
        return false;
      }
      if (prompt.resolutionContext.action.action === "removeFromLife") {
        enqueueResolution(
          state,
          {
            kind: "effectAction",
            sourceInstanceId: prompt.resolutionContext.sourceInstanceId,
            controller: prompt.resolutionContext.controller,
            action: {
              ...prompt.resolutionContext.action,
              position: command.optionId,
            },
          },
          { next: true },
        );
        return true;
      }
      const selectedTargetIds = prompt.resolutionContext.selectedTargetIds ?? [];
      const livePool = candidatePoolForTarget(
        state,
        prompt.resolutionContext.controller,
        prompt.resolutionContext.sourceInstanceId,
        prompt.resolutionContext.action.target,
      );
      if (
        !livePool.supported ||
        selectedTargetIds.some((instanceId) => !livePool.candidateIds.includes(instanceId))
      ) {
        return false;
      }
      enqueueResolution(
        state,
        {
          kind: "effectAction",
          sourceInstanceId: prompt.resolutionContext.sourceInstanceId,
          controller: prompt.resolutionContext.controller,
          action: {
            ...prompt.resolutionContext.action,
            position: command.optionId,
          },
          selectedTargetIds,
        },
        { next: true },
      );
      return true;
    }
    case "effectLookAtLifeOwner": {
      const context = prompt.resolutionContext;
      if (command.optionId === "skip" && context.action.upTo) {
        return true;
      }
      const owner =
        command.optionId === "self"
          ? context.controller
          : command.optionId === "opponent"
            ? otherSeat(context.controller)
            : null;
      if (!owner || !context.availableSeats.includes(owner)) {
        return false;
      }
      const lookedInstanceId = getPlayer(state, owner).life[0];
      if (!lookedInstanceId) {
        return false;
      }
      createChoicePrompt(state, {
        choiceKind: "chooseOption",
        seat: context.controller,
        label: `${cardName(getCardForInstance(state, context.sourceInstanceId))} Life position`,
        details: `You looked at ${cardName(getCardForInstance(state, lookedInstanceId))}. Place it at the top or bottom of its owner's Life.`,
        sourceCardId: getInstance(state, context.sourceInstanceId).cardId,
        sourceInstanceId: context.sourceInstanceId,
        eventId: null,
        options: [
          { id: "top", label: "Top of Life", value: "top" },
          { id: "bottom", label: "Bottom of Life", value: "bottom" },
        ],
        minSelections: 1,
        maxSelections: 1,
        context: { action: "lookAtLife", resource: "life" },
        resolutionContext: {
          intent: "effectLookAtLifePosition",
          sourceInstanceId: context.sourceInstanceId,
          controller: context.controller,
          owner,
          lookedInstanceId,
        },
      });
      return true;
    }
    case "effectLookAtLifePosition": {
      const context = prompt.resolutionContext;
      if (command.optionId !== "top" && command.optionId !== "bottom") {
        return false;
      }
      const player = getPlayer(state, context.owner);
      if (player.life[0] !== context.lookedInstanceId) {
        return false;
      }
      const looked = getInstance(state, context.lookedInstanceId);
      moveCard(state, context.lookedInstanceId, context.owner, "life", {
        lifePosition: command.optionId,
        faceUp: looked.faceUp,
        publicKnowledge: looked.publicKnowledge,
        actor: context.controller,
        visibility: "private",
        suppressLog: true,
      });
      emitLog(
        state,
        context.controller,
        `${getPlayer(state, context.controller).playerName} looks at a Life card and places it at the ${command.optionId}.`,
        {
          sourceCardId: getInstance(state, context.sourceInstanceId).cardId,
          sourceInstanceId: context.sourceInstanceId,
          visibility: "private",
          privateMessages: {
            [context.controller]: `You placed ${cardName(getCardForInstance(state, context.lookedInstanceId))} at the ${command.optionId} of ${getPlayer(state, context.owner).playerName}'s Life.`,
          },
          judgeMessage: `${getPlayer(state, context.controller).playerName} placed ${cardName(getCardForInstance(state, context.lookedInstanceId))} at the ${command.optionId} of ${getPlayer(state, context.owner).playerName}'s Life.`,
        },
      );
      return true;
    }
    case "effectRevealFromLifePlay": {
      const context = prompt.resolutionContext;
      if (command.optionId !== "play" && command.optionId !== "keep") {
        return false;
      }
      const player = getPlayer(state, context.owner);
      const revealed = getInstance(state, context.revealedInstanceId);
      if (
        player.life[0] !== context.revealedInstanceId ||
        revealed.zone !== "life" ||
        !revealed.faceUp
      ) {
        return false;
      }
      if (command.optionId === "keep") {
        revealed.faceUp = false;
        revealed.publicKnowledge = false;
        return true;
      }
      const conditionalPlay = context.action.conditionalPlay;
      if (
        !conditionalPlay ||
        context.owner !== context.controller ||
        !conditionalPlay.filters.every((filter) => {
          const result = matchesTargetFilter(
            state,
            context.sourceInstanceId,
            context.revealedInstanceId,
            filter,
          );
          return result.supported && result.matches;
        }) ||
        !playCardFromEffect(
          state,
          context.controller,
          context.revealedInstanceId,
          "active",
          context.sourceInstanceId,
        )
      ) {
        return false;
      }
      for (const action of [...(conditionalPlay.thenActions ?? [])].reverse()) {
        enqueueResolution(
          state,
          {
            kind: "effectAction",
            sourceInstanceId: context.sourceInstanceId,
            controller: context.controller,
            action,
            previousActionTargetIds: [context.revealedInstanceId],
          },
          { next: true },
        );
      }
      return true;
    }
    case "effectRevealedDeckPosition": {
      if (command.optionId !== "top" && command.optionId !== "bottom") {
        return false;
      }
      const context = prompt.resolutionContext;
      const revealed = getInstance(state, context.revealedInstanceId);
      if (revealed.controller !== context.owner || revealed.zone !== "deck") {
        return false;
      }
      moveCard(state, context.revealedInstanceId, context.owner, "deck", {
        deckPosition: command.optionId,
        faceUp: false,
        publicKnowledge: false,
        actor: context.controller,
        sourceInstanceId: context.sourceInstanceId,
        visibility: "public",
      });
      return true;
    }
    case "effectAddDon": {
      const context = prompt.resolutionContext;
      if (
        !context.rested &&
        isDonActivationByCharacterEffectPrevented(
          state,
          context.sourceInstanceId,
          context.controller,
        )
      ) {
        return true;
      }
      const selectedCount = Number.parseInt(command.optionId ?? "", 10);
      const player = getPlayer(state, context.controller);
      const maximum = Math.min(context.maximum, player.donDeckCount);
      if (
        !Number.isInteger(selectedCount) ||
        command.optionId !== String(selectedCount) ||
        selectedCount < 0 ||
        selectedCount > maximum
      ) {
        return false;
      }
      addDonFromDeck(state, context.controller, selectedCount, context.rested);
      return true;
    }
    case "effectAddToLifeFromDeck": {
      const selectedCount = Number.parseInt(command.optionId ?? "", 10);
      const context = prompt.resolutionContext;
      const targetSeat =
        context.action.target.player === "self"
          ? context.controller
          : otherSeat(context.controller);
      const maximum = Math.min(context.maximum, getPlayer(state, targetSeat).deck.length);
      if (
        !Number.isInteger(selectedCount) ||
        command.optionId !== String(selectedCount) ||
        selectedCount < 0 ||
        selectedCount > maximum
      ) {
        return false;
      }
      return addTopDeckCardsToLife(
        state,
        context.controller,
        context.sourceInstanceId,
        context.action,
        selectedCount,
      );
    }
    case "effectDrawCount": {
      const selectedCount = Number.parseInt(command.optionId ?? "", 10);
      const context = prompt.resolutionContext;
      if (
        !Number.isInteger(selectedCount) ||
        command.optionId !== String(selectedCount) ||
        selectedCount < 0 ||
        selectedCount > context.maximum
      ) {
        return false;
      }
      drawCards(
        state,
        context.action.player === "self" ? context.controller : otherSeat(context.controller),
        selectedCount,
        `${cardName(getCardForInstance(state, context.sourceInstanceId))} resolves`,
      );
      return true;
    }
    case "effectOpponentReturnDon": {
      const context = prompt.resolutionContext;
      const selectedIds = command.selectedIds ?? [];
      const liveCandidateIds = returnDonCostOptions(state, context.returningSeat).map(
        (option) => option.id,
      );
      if (
        selectedIds.length !== context.amount ||
        new Set(selectedIds).size !== selectedIds.length ||
        selectedIds.some(
          (id) => !context.candidateIds.includes(id) || !liveCandidateIds.includes(id),
        )
      ) {
        return false;
      }
      returnSelectedDonToDeck(
        state,
        context.returningSeat,
        selectedIds,
        context.sourceInstanceId,
        context.controller,
      );
      emitLog(
        state,
        context.returningSeat,
        `${cardName(getCardForInstance(state, context.sourceInstanceId))} returns ${selectedIds.length} DON!! from ${context.returningSeat}'s field to their DON!! deck.`,
        {
          sourceCardId: getInstance(state, context.sourceInstanceId).cardId,
          sourceInstanceId: context.sourceInstanceId,
          visibility: "public",
        },
      );
      return true;
    }
    case "effectReturnDon": {
      const context = prompt.resolutionContext;
      const selectedIds = command.selectedIds ?? [];
      const liveCandidateIds = returnDonCostOptions(state, context.returningSeat).map(
        (option) => option.id,
      );
      if (
        selectedIds.length !== context.amount ||
        new Set(selectedIds).size !== selectedIds.length ||
        selectedIds.some(
          (id) => !context.candidateIds.includes(id) || !liveCandidateIds.includes(id),
        )
      ) {
        return false;
      }
      returnSelectedDonToDeck(
        state,
        context.returningSeat,
        selectedIds,
        context.sourceInstanceId,
        context.controller,
      );
      for (const nestedAction of [...(context.action.thenActions ?? [])].reverse()) {
        enqueueResolution(
          state,
          {
            kind: "effectAction",
            sourceInstanceId: context.sourceInstanceId,
            controller: context.controller,
            action: nestedAction,
          },
          { next: true },
        );
      }
      return true;
    }
    case "effectTrashFromDeckCount": {
      const context = prompt.resolutionContext;
      const selectedCount = Number.parseInt(command.optionId ?? "", 10);
      const targetSeat =
        context.action.player === "self" ? context.controller : otherSeat(context.controller);
      const maximum = Math.min(context.maximum, getPlayer(state, targetSeat).deck.length);
      if (
        !Number.isInteger(selectedCount) ||
        command.optionId !== String(selectedCount) ||
        selectedCount < 0 ||
        selectedCount > maximum
      ) {
        return false;
      }
      return trashTopDeckCards(
        state,
        context.controller,
        context.sourceInstanceId,
        context.action,
        selectedCount,
      );
    }
    case "effectRemoveFromLifeCount": {
      const context = prompt.resolutionContext;
      const selectedCount = Number.parseInt(command.optionId ?? "", 10);
      const targetSeat =
        context.action.player === "self" ? context.controller : otherSeat(context.controller);
      const maximum = Math.min(context.maximum, getPlayer(state, targetSeat).life.length);
      if (
        !Number.isInteger(selectedCount) ||
        command.optionId !== String(selectedCount) ||
        selectedCount < 0 ||
        selectedCount > maximum
      ) {
        return false;
      }
      return removeLifeCards(
        state,
        context.controller,
        context.sourceInstanceId,
        context.action,
        selectedCount,
      );
    }
    case "effectRemoveFromLifeSelection": {
      const context = prompt.resolutionContext;
      const submittedIds = command.selectedIds ?? [];
      const selectedIds = context.opaqueCandidateIds
        ? submittedIds
            .map((id) => context.opaqueCandidateIds?.[id])
            .filter((id): id is string => Boolean(id))
        : submittedIds;
      if (context.opaqueCandidateIds && selectedIds.length !== submittedIds.length) {
        return false;
      }
      const targetSeat =
        context.action.player === "self" ? context.controller : otherSeat(context.controller);
      const life = getPlayer(state, targetSeat).life;
      if (
        selectedIds.length < context.minimum ||
        selectedIds.length > context.maximum ||
        new Set(selectedIds).size !== selectedIds.length ||
        selectedIds.some(
          (instanceId) => !context.candidateIds.includes(instanceId) || !life.includes(instanceId),
        )
      ) {
        return false;
      }
      return removeLifeCards(
        state,
        context.controller,
        context.sourceInstanceId,
        context.action,
        selectedIds.length,
        selectedIds,
      );
    }
    case "effectGiveDonCount": {
      const selectedCount = Number.parseInt(command.optionId ?? "", 10);
      const context = prompt.resolutionContext;
      const player = getPlayer(state, context.controller);
      const availableDon =
        context.action.donState === "rested" ? player.restedDon : player.activeDon;
      const maximum = Math.min(context.maximum, availableDon);
      if (
        !Number.isInteger(selectedCount) ||
        command.optionId !== String(selectedCount) ||
        selectedCount < 0 ||
        selectedCount > maximum
      ) {
        return false;
      }
      if (selectedCount === 0) {
        return true;
      }
      enqueueResolution(
        state,
        {
          kind: "effectAction",
          sourceInstanceId: context.sourceInstanceId,
          controller: context.controller,
          action: {
            ...context.action,
            count: { amount: selectedCount },
          },
        },
        { next: true },
      );
      return true;
    }
    default:
      return false;
  }
}
