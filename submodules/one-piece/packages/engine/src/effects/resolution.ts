import { rebindDelayedPrevious, delayedActionChain } from "./delayed-identity.ts";
import {
  requiresDonIdentityChoice,
  beginDonIdentityProcess,
  endDonIdentityProcess,
  donIdentityLabel,
  donIdentitiesAt,
  donIdentitiesForVirtualIds,
  transferDonIdentities,
  locateDonIdentity,
} from "../engine/don-state.ts";
import { chooseContinuousCostOrder, settleContinuousCosts } from "../engine/continuous-cost.ts";
import { faceUpLifeToHandReplacement } from "./permanent.ts";
import {
  extendReplacementProcess,
  currentReplacementProcess,
  declineReplacementProcess,
  withReplacementProcess,
} from "./replacement-process.ts";
import { declareLoopIterations, observeOptionalLoop } from "../engine/optional-loop.ts";
import { getCard } from "../../../cards/src/runtime-catalog.ts";
import {
  getBaseCost,
  cardName,
  effectBlocksForInstance,
  effectBlocksFor,
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
  continueLifeReplacementOrder,
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
  bindDonCostSelections,
  promptForEffectRestReplacement,
  restCharacterByEffect,
  availableDonForGive,
  completeGiveDon,
  continueSimultaneousStateChange,
  continueDonTransfers,
  continueGiveDonEach,
  canPayCosts,
  canPayEffectBlockCosts,
  partiallyPayableCost,
  costSourceIsCurrent,
  effectBlockWithSelectedCost,
  candidatesForGroupedPlayAction,
  candidatesForPlayAction,
  candidatesForKoCharacterCost,
  candidatesForPlayCardCost,
  candidatesForTrashCardCost,
  candidatesForTrashCharacterCost,
  candidatesForTrashFromHandCost,
  completePlayThisCard,
  freezeActionCandidateIds,
  giveDonCostCandidateIds,
  giveDonCostParts,
  candidatesForRevealFromHandCost,
  candidatesForReturnCharacterCost,
  candidatesForLifeCardCost,
  candidatesForRestCardsCost,
  candidatesForReturnCharacterToDeckCost,
  candidatesForReturnTrashToDeckCost,
  playCardFromEffect,
  playCardsFromEffectSequence,
  promptForEffectCharacterReplacement,
  promptForEffectRemovalReplacement,
  promptForRearrangeDeckOrder,
  promptForTargetSelection,
  processEffectAction,
  removeLifeCards,
  returnDonCostOptions,
  returnSelectedDonToDeck,
  selectionSatisfiesGroupedPlayAction,
  validActiveIdsForGroupedPlayAction,
  trashTopDeckCards,
  payCosts,
} from "./actions.ts";
import { evaluateConditions } from "./conditions.ts";
import { isCardPlayRestricted } from "./permanent.ts";
import { findRemoveFromFieldReplacement } from "./replacements.ts";
import {
  candidatePoolForTarget,
  matchesTargetFilter,
  resolveTargetCount,
  selectionSatisfiesTotalConstraint,
} from "./targeting.ts";
import type { Action, EffectBlock, EffectTrigger } from "@tcg/op-types";

/**
 * Printed form of an effect trigger for player-facing log lines, matching the
 * bracketed keyword style on the physical cards ([On Play], [When Attacking],
 * ...). Exhaustive over EffectTrigger: adding a member breaks the switch
 * until a printed form is chosen, so a raw engine literal can never leak
 * into the public log.
 */
export function triggerLabel(trigger: EffectTrigger): string {
  switch (trigger) {
    case "onPlay":
      return "[On Play]";
    case "whenAttacking":
      return "[When Attacking]";
    case "onBlock":
      return "[On Block]";
    case "onKo":
      return "[On K.O.]";
    case "startOfYourTurn":
      return "[Start of Your Turn]";
    case "endOfYourTurn":
      return "[End of Your Turn]";
    case "endOfOpponentTurn":
      return "[End of Your Opponent's Turn]";
    case "onYourAttack":
      return "[When You Attack]";
    case "onOpponentAttack":
      return "[When Your Opponent Attacks]";
    case "activateMain":
      return "[Activate: Main]";
    case "counter":
      return "[Counter]";
    case "main":
      return "[Main]";
    case "trigger":
      return "[Trigger]";
    case "whenDealsDamage":
      return "[When This Card Deals Damage]";
    case "whenYouDealDamage":
      return "[When You Deal Damage]";
    case "whenCharacterKod":
      return "[When a Character Is K.O.'d]";
    case "whenCharacterRemoved":
      return "[When a Character Leaves the Field]";
    case "whenLeaving":
      return "[When This Card Leaves the Field]";
    case "whenBlockerActivated":
      return "[On Block]";
    case "whenTriggerActivates":
      return "[When a [Trigger] Activates]";
    case "whenDonReturned":
      return "[When a DON!! Card Is Returned]";
    case "whenOpponentActivatesEvent":
      return "[When Your Opponent Activates an Event]";
    case "whenYouActivateEvent":
      return "[When You Activate an Event]";
    case "whenDonGiven":
      return "[When a DON!! Card Is Given]";
    case "endOfBattle":
      return "[End of the Battle]";
    case "whenCardDrawn":
      return "[When a Card Is Drawn]";
    case "whenCardTrashedFromHandByEffect":
      return "[When a Card Is Trashed from Hand]";
    case "whenCardsTrashedFromHandByEffect":
      return "[When Cards Are Trashed from Hand]";
    case "whenLifeAddedToHand":
      return "[When Life Is Added to Hand]";
    case "whenLifeRemoved":
      return "[When Life Is Removed]";
    case "whenOpponentPlaysCharacter":
      return "[When Your Opponent Plays a Character]";
    case "whenYouPlayCharacter":
      return "[When You Play a Character]";
    case "whenTriggerCharacterPlayed":
      return "[When a [Trigger] Character Is Played]";
    case "whenBecomesRested":
      return "[When This Card Becomes Rested]";
    case "whenCharacterRestedByEffect":
      return "[When a Character Is Rested by an Effect]";
    case "whenYouTakeDamage":
      return "[When You Take Damage]";
    default: {
      // Compile-time exhaustiveness guard: never reached at runtime.
      const unhandled: never = trigger;
      return unhandled;
    }
  }
}

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
    battlePowerCompared: battle.powerCompared === true,
    targetZoneChangeCounter: battle.comparedParticipants?.find(
      (participant) => participant.instanceId === item.targetId,
    )?.zoneChangeCounter,
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

function eventFilterMatches(
  state: MatchState,
  item: Extract<ResolutionItem, { kind: "effectBlock" }>,
  eventFilter: NonNullable<NonNullable<ReturnType<typeof effectBlocksFor>[number]>["eventFilter"]>,
  event: NonNullable<Extract<ResolutionItem, { kind: "effectBlock" }>["triggerEvent"]>,
): boolean {
  const anyOfMatches =
    !eventFilter.anyOf?.length ||
    eventFilter.anyOf.some((alt) => eventFilterMatches(state, item, alt, event));
  const triggeringCard = getInstance(state, event.instanceId);
  const triggeringController = event.instanceController ?? triggeringCard.controller;
  const playerMatches =
    !eventFilter.player ||
    eventFilter.player === "any" ||
    (eventFilter.player === "self" && triggeringController === item.controller) ||
    (eventFilter.player === "opponent" && triggeringController !== item.controller);
  const causeMatches =
    !eventFilter.causedBy ||
    eventFilter.causedBy === "any" ||
    (eventFilter.causedBy === "self" && event.effectController === item.controller) ||
    (eventFilter.causedBy === "opponent" && event.effectController !== item.controller);
  const koCauseMatches = !eventFilter.koCause || event.koCause === eventFilter.koCause;
  const fromZoneMatches =
    !eventFilter.fromZone || ("fromZone" in event && event.fromZone === eventFilter.fromZone);
  const toZoneMatches =
    !eventFilter.toZone || ("toZone" in event && event.toZone === eventFilter.toZone);
  const targetSelfMatches =
    !eventFilter.targetSelf || event.targetInstanceId === item.sourceInstanceId;
  const sourceSelfMatches =
    !eventFilter.sourceSelf || event.sourceInstanceId === item.sourceInstanceId;
  const filtersMatch = (eventFilter.filters ?? []).every((filter) => {
    const result = matchesTargetFilter(state, item.sourceInstanceId, event.instanceId, filter, {
      basePower: event.koBasePower,
      baseCost: event.baseCostAtActivation,
    });
    return result.supported && result.matches;
  });
  const sourceFiltersMatch = (eventFilter.sourceFilters ?? []).every((filter) => {
    if (!event.sourceInstanceId) return false;
    const result = matchesTargetFilter(
      state,
      item.sourceInstanceId,
      event.sourceInstanceId,
      filter,
      event.sourceInstanceId === event.instanceId
        ? { basePower: event.koBasePower, baseCost: event.baseCostAtActivation }
        : undefined,
    );
    return result.supported && result.matches;
  });
  const targetFiltersMatch = (eventFilter.targetFilters ?? []).every((filter) => {
    if (!event.targetInstanceId) return false;
    const result = matchesTargetFilter(
      state,
      item.sourceInstanceId,
      event.targetInstanceId,
      filter,
      event.targetInstanceId === event.instanceId
        ? { basePower: event.koBasePower, baseCost: event.baseCostAtActivation }
        : undefined,
    );
    return result.supported && result.matches;
  });
  const sourceFromZoneMatches =
    !eventFilter.sourceFromZone || event.sourceFromZone === eventFilter.sourceFromZone;
  const lifeCountMatches =
    eventFilter.lifeCountAfterRemoval === undefined ||
    event.lifeCountAfterRemoval === eventFilter.lifeCountAfterRemoval;
  const battleComparisonMatches =
    eventFilter.battlePowerCompared === undefined ||
    event.battlePowerCompared === eventFilter.battlePowerCompared;
  const amountMatches =
    eventFilter.minimumAmount === undefined || (event.amount ?? 0) >= eventFilter.minimumAmount;
  return (
    anyOfMatches &&
    playerMatches &&
    causeMatches &&
    koCauseMatches &&
    fromZoneMatches &&
    toZoneMatches &&
    targetSelfMatches &&
    sourceSelfMatches &&
    filtersMatch &&
    sourceFiltersMatch &&
    targetFiltersMatch &&
    sourceFromZoneMatches &&
    lifeCountMatches &&
    battleComparisonMatches &&
    amountMatches
  );
}

function effectBlockForContinuation(
  state: MatchState,
  item: {
    sourceInstanceId: string;
    trigger: EffectTrigger;
    blockIndex: number;
    activatedBlock?: EffectBlock;
    paidCostCount?: number;
    selectedAlternativeCostIndex?: number;
    costPaymentProgress?: import("../types.ts").CostPaymentProgress;
  },
): EffectBlock | undefined {
  const block =
    item.activatedBlock ??
    effectBlocksForInstance(state, item.sourceInstanceId, item.trigger)[item.blockIndex];
  const adjusted = item.costPaymentProgress?.adjustedCost;
  if (!block || !adjusted) return block;
  const index = item.paidCostCount ?? 0;
  const baseLength = block.costs?.length ?? 0;
  if (index < baseLength)
    return { ...block, costs: block.costs?.map((cost, i) => (i === index ? adjusted : cost)) };
  return {
    ...block,
    alternativeCosts: block.alternativeCosts?.map((costs, alternativeIndex) =>
      alternativeIndex === item.selectedAlternativeCostIndex
        ? costs.map((cost, i) => (i === index - baseLength ? adjusted : cost))
        : costs,
    ),
  };
}

function pendingEffectBlock(
  state: MatchState,
  item: Extract<ResolutionItem, { kind: "effectBlock" }>,
) {
  const source = getInstance(state, item.sourceInstanceId);
  if (
    item.sourceZoneChangeCounter !== undefined &&
    source.zoneChangeCounter !== item.sourceZoneChangeCounter &&
    !item.activatedBlock
  ) {
    return;
  }
  const card = getCard(source.cardId);
  const fullBlock = effectBlockWithSelectedCost(
    effectBlockForContinuation(state, item),
    item.selectedAlternativeCostIndex,
  );
  const block =
    fullBlock && item.orderedCostPayments
      ? {
          ...fullBlock,
          costs: fullBlock.costs?.slice(item.paidCostCount ?? 0, (item.paidCostCount ?? 0) + 1),
        }
      : fullBlock && item.paidCostCount
        ? { ...fullBlock, costs: fullBlock.costs?.slice(item.paidCostCount) }
        : fullBlock;

  if (!block) {
    return;
  }

  const effectKey = block.oncePerTurnKey ?? `${item.trigger}:${item.blockIndex}`;
  if (block.oncePerTurn && source.usedEffectKeys.includes(effectKey) && !item.activatedBlock) {
    return;
  }

  if (block.eventFilter && !item.activatedBlock) {
    const event = item.triggerEvent;
    if (!event) {
      return;
    }
    if (!eventFilterMatches(state, item, block.eventFilter, event)) {
      return;
    }
  }
  if (block.source && !item.activatedBlock) {
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
  return { source, card, block, effectKey, conditions };
}

export function isReadyEffectStructurallyValid(
  state: MatchState,
  item: Extract<ResolutionItem, { kind: "effectBlock" }>,
): boolean {
  return Boolean(pendingEffectBlock(state, item));
}

export function isReadyEffectEligible(
  state: MatchState,
  item: Extract<ResolutionItem, { kind: "effectBlock" }>,
): boolean {
  const pending = pendingEffectBlock(state, item);
  if (!pending || (pending.conditions.supported && !pending.conditions.matches)) return false;
  return (
    !pending.block.optional ||
    canPayEffectBlockCosts(
      state,
      item.controller,
      item.sourceInstanceId,
      pending.block,
      item.trashHandIds,
    )
  );
}

export function processEffectBlock(
  state: MatchState,
  item: Extract<ResolutionItem, { kind: "effectBlock" }>,
) {
  const pending = pendingEffectBlock(state, item);
  if (!pending) return;
  const { source, card, effectKey, conditions } = pending;
  let { block } = pending;
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
  if (!conditions.matches && !item.paidCostCount) {
    return;
  }

  // Only a fulfilled optional trigger is a loop stopping boundary. Ineligible
  // queued blocks must not add participants or consume the selected stop.
  if (block.optional && !item.confirmed) {
    const loop = observeOptionalLoop(state, item);
    if (loop === "pause") {
      enqueueResolution(
        state,
        { ...item, sourceZoneChangeCounter: source.zoneChangeCounter },
        { next: true },
      );
      return;
    }
    if (loop === "skip") return;
  }

  if (block.optional && !item.confirmed) {
    if (
      !canPayEffectBlockCosts(
        state,
        item.controller,
        item.sourceInstanceId,
        block,
        item.trashHandIds,
      )
    ) {
      return;
    }
    createChoicePrompt(state, {
      choiceKind: "confirm",
      seat: item.controller,
      label: `${cardName(card)} has an optional effect.`,
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
        activatedBlock: item.activatedBlock,
        orderedCostPayments: item.orderedCostPayments,
        paidCostCount: item.paidCostCount,
        costPaymentProgress: item.costPaymentProgress,
        selectedAlternativeCostIndex: item.selectedAlternativeCostIndex,
        trashHandIds: item.trashHandIds,
        costPaymentIdsByType: item.costPaymentIdsByType,
        triggerEvent: item.triggerEvent,
      },
    });
    return;
  }

  if (!item.activatedBlock) {
    item.costPaymentProgress ??= {
      incomplete: false,
      sourceZoneChangeCounter: source.zoneChangeCounter,
    };
    item.orderedCostPayments =
      (block.costs?.length ?? 0) > 1 ||
      Boolean(
        block.alternativeCosts?.some((costs) => (block.costs?.length ?? 0) + costs.length > 1),
      );
    if (
      item.orderedCostPayments &&
      !canPayEffectBlockCosts(
        state,
        item.controller,
        item.sourceInstanceId,
        block,
        item.trashHandIds,
      )
    )
      return;
  }
  item.activatedBlock ??= JSON.parse(
    JSON.stringify(
      effectBlocksForInstance(state, item.sourceInstanceId, item.trigger)[item.blockIndex],
    ),
  );

  if (block.alternativeCosts && item.selectedAlternativeCostIndex === undefined) {
    const affordableIndexes = block.alternativeCosts.flatMap((costs, index) =>
      canPayEffectBlockCosts(
        state,
        item.controller,
        item.sourceInstanceId,
        { ...block, costs: [...(block.costs ?? []), ...costs], alternativeCosts: undefined },
        item.trashHandIds,
      )
        ? [index]
        : [],
    );
    if (affordableIndexes.length === 0) return;
    if (affordableIndexes.length === 1) {
      enqueueResolution(
        state,
        { ...item, selectedAlternativeCostIndex: affordableIndexes[0], confirmed: true },
        { next: true },
      );
      return;
    }
    createChoicePrompt(state, {
      choiceKind: "chooseOption",
      seat: item.controller,
      label: `${cardName(card)} chooses a cost.`,
      details: "Choose one cost to pay.",
      sourceCardId: source.cardId,
      sourceInstanceId: item.sourceInstanceId,
      eventId: null,
      options: affordableIndexes.map((index) => ({
        id: String(index),
        value: String(index),
        label: block
          .alternativeCosts![index]!.map((cost) =>
            cost.cost === "trashFromHand"
              ? `Trash ${cost.amount} card(s) from your hand`
              : cost.cost === "restDon"
                ? `Rest ${cost.amount} DON!! card(s)`
                : `Pay cost option ${index + 1}`,
          )
          .join(" and "),
      })),
      minSelections: 1,
      maxSelections: 1,
      context: { trigger: item.trigger },
      resolutionContext: {
        intent: "effectAlternativeCost",
        sourceInstanceId: item.sourceInstanceId,
        controller: item.controller,
        affordableIndexes,
        continuation: { ...item, confirmed: true },
      },
    });
    return;
  }

  if (item.orderedCostPayments) {
    const full = effectBlockWithSelectedCost(
      effectBlockForContinuation(state, item),
      item.selectedAlternativeCostIndex,
    );
    block = {
      ...block,
      costs: full?.costs?.slice(item.paidCostCount ?? 0, (item.paidCostCount ?? 0) + 1),
    };
  }

  if (
    item.orderedCostPayments &&
    item.paidCostCount &&
    !item.costsPaid &&
    block.costs?.[0] &&
    (!costSourceIsCurrent(
      state,
      item.sourceInstanceId,
      block.costs[0],
      item.costPaymentProgress?.sourceZoneChangeCounter,
    ) ||
      !canPayCosts(
        state,
        item.controller,
        item.sourceInstanceId,
        block.costs,
        item.trashHandIds,
        item.costPaymentIds,
        item.costPaymentIdsByType,
      ))
  ) {
    // Pay the available part of each later entry, preserving original requirements.
    const adjusted = partiallyPayableCost(
      state,
      item.controller,
      item.sourceInstanceId,
      block.costs[0],
      item.costPaymentProgress?.sourceZoneChangeCounter,
    );
    if (block.costs[0].cost === "turnLifeFaceUp" && adjusted?.cost === "turnLifeFaceUp") {
      // Preserve the original positional scope; all remaining eligible Life
      // must be paid. Existing bindings survive a saved/resumed continuation.
      item.costPaymentIds ??= candidatesForLifeCardCost(
        state,
        item.controller,
        item.sourceInstanceId,
        block.costs[0],
      ).slice(0, adjusted.count);
    }
    item.costPaymentProgress = {
      ...item.costPaymentProgress,
      incomplete: true,
      adjustedCost: adjusted,
    };
    if (!adjusted) {
      finishPaidEffect(state, { ...item, costsPaid: true }, block);
      return;
    }
    block = { ...block, costs: [adjusted] };
  }

  const giveDonCost = block.costs?.find((cost) => cost.cost === "giveDon");
  if (giveDonCost && !item.costPaymentIdsByType?.giveDon) {
    const { recipientSeat, poolAmount } = giveDonCostParts(state, item.controller, giveDonCost);
    const candidateIds = giveDonCostCandidateIds(
      state,
      item.controller,
      giveDonCost,
      item.sourceInstanceId,
    );
    if (candidateIds.length === 1 && poolAmount >= giveDonCost.amount) {
      item.costPaymentIdsByType = {
        ...item.costPaymentIdsByType,
        giveDon: candidateIds,
      };
    }
    if (candidateIds.length > 1 && poolAmount >= giveDonCost.amount) {
      createChoicePrompt(state, {
        choiceKind: "costPayment",
        seat: item.controller,
        label: `${cardName(card)} DON!! recipient.`,
        details: `Choose 1 of ${getPlayer(state, recipientSeat).playerName}'s Leader or Character cards to receive ${giveDonCost.amount} ${giveDonCost.donState ?? "active"} DON!! as the activation cost.`,
        sourceCardId: source.cardId,
        sourceInstanceId: item.sourceInstanceId,
        eventId: null,
        options: candidateIds.map((instanceId) => ({
          id: instanceId,
          label: cardName(getCardForInstance(state, instanceId)),
          value: instanceId,
          targetId: instanceId,
        })),
        minSelections: 1,
        maxSelections: 1,
        context: { cost: "giveDon" },
        resolutionContext: {
          intent: "effectCostGiveDon",
          sourceInstanceId: item.sourceInstanceId,
          controller: item.controller,
          trigger: item.trigger,
          blockIndex: item.blockIndex,
          activatedBlock: item.activatedBlock,
          orderedCostPayments: item.orderedCostPayments,
          paidCostCount: item.paidCostCount,
          costPaymentProgress: item.costPaymentProgress,
          selectedAlternativeCostIndex: item.selectedAlternativeCostIndex,
          amount: giveDonCost.amount,
          candidateIds,
          costPaymentIdsByType: item.costPaymentIdsByType,
          triggerEvent: item.triggerEvent,
        },
      });
      return;
    }
  }

  if (state.donIdentities) {
    const restCost = block.costs?.find((cost) => cost.cost === "restDon");
    const giveCost = block.costs?.find((cost) => cost.cost === "giveDon");
    const cost =
      restCost && !item.costPaymentIdsByType?.restDon
        ? restCost
        : giveCost && !item.costPaymentIdsByType?.giveDonSources
          ? giveCost
          : undefined;
    if (cost) {
      const parts =
        cost.cost === "giveDon"
          ? giveDonCostParts(state, item.controller, cost)
          : { donorSeat: item.controller };
      const candidates = donIdentitiesAt(state, {
        seat: parts.donorSeat,
        area: cost.cost === "giveDon" && cost.donState === "rested" ? "rested" : "active",
      });
      const paymentType = cost.cost === "restDon" ? "restDon" : "giveDonSources";
      if (requiresDonIdentityChoice(state, candidates, cost.amount)) {
        createChoicePrompt(state, {
          choiceKind: "costPayment",
          seat: item.controller,
          label: `Choose ${cost.amount} DON!! card(s) for the cost.`,
          details: "Choose the specific DON!! cards.",
          sourceCardId: source.cardId,
          sourceInstanceId: item.sourceInstanceId,
          eventId: null,
          options: candidates.map((id) => ({ id, value: id, label: donIdentityLabel(state, id) })),
          minSelections: cost.amount,
          maxSelections: cost.amount,
          context: { resource: "don" },
          resolutionContext: {
            intent: "effectCostDonIdentity",
            continuation: { ...item, confirmed: true },
            candidates,
            amount: cost.amount,
            paymentType,
          },
        });
        return;
      }
      item.costPaymentIdsByType = {
        ...item.costPaymentIdsByType,
        [paymentType]: candidates.slice(0, cost.amount),
      };
    }
  }

  // A unique DON source needs no player choice, but its selected IDs must
  // still advance ordered cost selection before a later hand-discard cost.
  const automaticReturnDon = block.costs?.find((cost) => cost.cost === "returnDon");
  if (
    automaticReturnDon &&
    !item.costPaymentIds &&
    automaticReturnDon.minimumAmount === undefined
  ) {
    const options = returnDonCostOptions(state, item.controller, automaticReturnDon.donState);
    const sourceKeys = new Set(
      options.map((option) =>
        option.id.startsWith("attached-don:")
          ? option.id.slice(0, option.id.lastIndexOf(":"))
          : option.id.slice(0, option.id.indexOf(":")),
      ),
    );
    if (
      options.length >= automaticReturnDon.amount &&
      (options.length === automaticReturnDon.amount ||
        (sourceKeys.size === 1 &&
          !requiresDonIdentityChoice(
            state,
            donIdentitiesForVirtualIds(
              state,
              item.controller,
              options.map((option) => option.id),
            ),
            automaticReturnDon.amount,
          )))
    ) {
      item = {
        ...item,
        costPaymentIds: options.slice(0, automaticReturnDon.amount).map((option) => option.id),
        costPaymentIdsByType: {
          ...item.costPaymentIdsByType,
          ...(state.donIdentities
            ? {
                returnDonSources: donIdentitiesForVirtualIds(
                  state,
                  item.controller,
                  options.slice(0, automaticReturnDon.amount).map((option) => option.id),
                ),
              }
            : {}),
        },
      };
    }
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
        label: `${cardName(card)} cost: trash ${trashFromHandCost.amount} card(s) from hand.`,
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
          activatedBlock: item.activatedBlock,
          orderedCostPayments: item.orderedCostPayments,
          paidCostCount: item.paidCostCount,
          costPaymentProgress: item.costPaymentProgress,
          selectedAlternativeCostIndex: item.selectedAlternativeCostIndex,
          amount: trashFromHandCost.amount,
          cost: trashFromHandCost,
          candidateIds,
          costPaymentIds: item.costPaymentIds,
          costPaymentIdsByType: item.costPaymentIdsByType,
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
        label: `${cardName(card)} cost: play ${playCardCost.amount} card(s).`,
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
          activatedBlock: item.activatedBlock,
          orderedCostPayments: item.orderedCostPayments,
          paidCostCount: item.paidCostCount,
          costPaymentProgress: item.costPaymentProgress,
          selectedAlternativeCostIndex: item.selectedAlternativeCostIndex,
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
        label: `${cardName(card)} cost: trash ${trashCardCost.amount} card(s).`,
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
          activatedBlock: item.activatedBlock,
          orderedCostPayments: item.orderedCostPayments,
          paidCostCount: item.paidCostCount,
          costPaymentProgress: item.costPaymentProgress,
          selectedAlternativeCostIndex: item.selectedAlternativeCostIndex,
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
    const options = returnDonCostOptions(state, item.controller, returnDonCost.donState);
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
        : options.length > minimumAmount &&
          (sourceKeys.size > 1 ||
            requiresDonIdentityChoice(
              state,
              donIdentitiesForVirtualIds(
                state,
                item.controller,
                options.map((option) => option.id),
              ),
              minimumAmount,
            ))
    ) {
      const destination =
        returnDonCost.destination === "costAreaRested" ? "cost area rested" : "DON!! deck";
      const pool = returnDonCost.donState === "attached" ? "currently given DON!!" : "DON!!";
      createChoicePrompt(state, {
        choiceKind: "costPayment",
        seat: item.controller,
        label: `${cardName(card)} cost: return ${minimumAmount} ${pool} to your ${destination}.`,
        details:
          returnDonCost.minimumAmount === undefined
            ? `Choose ${minimumAmount} ${pool} card(s) from your field to return to your ${destination}.`
            : `Choose ${minimumAmount} or more ${pool} cards from your field to return to your ${destination}.`,
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
          activatedBlock: item.activatedBlock,
          orderedCostPayments: item.orderedCostPayments,
          paidCostCount: item.paidCostCount,
          costPaymentProgress: item.costPaymentProgress,
          selectedAlternativeCostIndex: item.selectedAlternativeCostIndex,
          amount: minimumAmount,
          candidateIds: options.map((option) => option.id),
          trashHandIds: item.trashHandIds,
          costPaymentIdsByType: item.costPaymentIdsByType,
          triggerEvent: item.triggerEvent,
        },
      });
      return;
    }
  }

  // 8-3-1-1: finish the DON!! payment before selecting a later Character
  // payment. Returning attached DON!! can change the eligible power boundary.
  // Keep the paid prefix across the second prompt instead of reusing DON!! IDs
  // as the Character selection or paying the DON!! a second time on resume.
  if (
    !item.costsPaid &&
    block.costs?.[0]?.cost === "returnDon" &&
    block.costs[1]?.cost === "returnCharacterToDeck"
  ) {
    if (
      !payCosts(
        state,
        item.controller,
        item.sourceInstanceId,
        [block.costs[0]],
        item.trashHandIds,
        item.costPaymentIds,
        item.costPaymentIdsByType,
      )
    )
      return;
    item = {
      ...item,
      paidCostCount: (item.paidCostCount ?? 0) + 1,
      costPaymentIds: undefined,
    };
    block = { ...block, costs: block.costs.slice(1) };
    if (
      !settleContinuousCosts(state) &&
      (state.continuousCosts?.pending || state.continuousCosts?.unsupported)
    ) {
      enqueueResolution(state, { ...item, confirmed: true }, { next: true });
      return;
    }
    if (
      !canPayCosts(state, item.controller, item.sourceInstanceId, block.costs, item.trashHandIds)
    ) {
      // 8-3-1-3-1 / 10-2-13-5: a later payment can become impossible;
      // retain the completed payment and consume the once-per-turn activation.
      if (block.oncePerTurn) source.usedEffectKeys.push(effectKey);
      return;
    }
  }

  const lifeCardCost = block.costs?.find(
    (cost) => cost.cost === "addCharacterToLife" || cost.cost === "turnLifeFaceUp",
  );
  if (lifeCardCost && !item.costPaymentIds && !item.costsPaid) {
    const candidateIds = candidatesForLifeCardCost(
      state,
      item.controller,
      item.sourceInstanceId,
      lifeCardCost,
    );
    const amount =
      lifeCardCost.cost === "turnLifeFaceUp" ? lifeCardCost.count : lifeCardCost.amount;
    if (candidateIds.length > amount) {
      createChoicePrompt(state, {
        choiceKind: "costPayment",
        seat: item.controller,
        label:
          lifeCardCost.cost === "turnLifeFaceUp"
            ? "Choose Life cards to turn face-down."
            : "Choose Characters to add to Life.",
        details: `Choose ${amount} card(s) to pay the activation cost.`,
        sourceCardId: source.cardId,
        sourceInstanceId: item.sourceInstanceId,
        eventId: null,
        options: candidateIds.map((id) => ({
          id,
          label: cardName(getCardForInstance(state, id)),
          value: id,
          targetId: id,
        })),
        minSelections: amount,
        maxSelections: amount,
        context: { cost: lifeCardCost.cost },
        resolutionContext: {
          intent:
            lifeCardCost.cost === "turnLifeFaceUp"
              ? "effectCostTurnLifeFaceUp"
              : "effectCostAddCharacterToLife",
          continuation: { ...item },
          candidateIds,
          amount,
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
        label: `${cardName(card)} cost: place ${returnCharacterToDeckCost.amount} Character(s) at the ${returnCharacterToDeckCost.position} of the owner's deck.`,
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
          activatedBlock: item.activatedBlock,
          orderedCostPayments: item.orderedCostPayments,
          paidCostCount: item.paidCostCount,
          costPaymentProgress: item.costPaymentProgress,
          selectedAlternativeCostIndex: item.selectedAlternativeCostIndex,
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
        label: `${cardName(card)} cost: return ${returnCharacterCost.amount} Character(s) to the owner's hand.`,
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
          activatedBlock: item.activatedBlock,
          orderedCostPayments: item.orderedCostPayments,
          paidCostCount: item.paidCostCount,
          costPaymentProgress: item.costPaymentProgress,
          selectedAlternativeCostIndex: item.selectedAlternativeCostIndex,
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
        label: `${cardName(card)} cost: rest ${restCardsCost.amount} active card(s).`,
        details: `Choose ${restCardsCost.amount} active card(s) to rest.`,
        sourceCardId: source.cardId,
        sourceInstanceId: item.sourceInstanceId,
        eventId: null,
        options: candidateIds.map((instanceId) => ({
          id: instanceId,
          label: instanceId.startsWith("active-don:")
            ? "Active DON!! in cost area"
            : cardName(getCardForInstance(state, instanceId)),
          value: instanceId,
          ...(!instanceId.startsWith("active-don:") ? { targetId: instanceId } : {}),
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
          activatedBlock: item.activatedBlock,
          orderedCostPayments: item.orderedCostPayments,
          paidCostCount: item.paidCostCount,
          costPaymentProgress: item.costPaymentProgress,
          selectedAlternativeCostIndex: item.selectedAlternativeCostIndex,
          amount: restCardsCost.amount,
          candidateIds,
          costPaymentIds: item.costPaymentIds,
          trashHandIds: item.trashHandIds,
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
        label: `${cardName(card)} cost: K.O. ${koCharacterCost.amount} Character(s).`,
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
          activatedBlock: item.activatedBlock,
          orderedCostPayments: item.orderedCostPayments,
          paidCostCount: item.paidCostCount,
          costPaymentProgress: item.costPaymentProgress,
          selectedAlternativeCostIndex: item.selectedAlternativeCostIndex,
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
        label: `${cardName(card)} cost: trash ${trashCharacterCost.amount} Character(s).`,
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
          activatedBlock: item.activatedBlock,
          orderedCostPayments: item.orderedCostPayments,
          paidCostCount: item.paidCostCount,
          costPaymentProgress: item.costPaymentProgress,
          selectedAlternativeCostIndex: item.selectedAlternativeCostIndex,
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
          activatedBlock: item.activatedBlock,
          orderedCostPayments: item.orderedCostPayments,
          paidCostCount: item.paidCostCount,
          costPaymentProgress: item.costPaymentProgress,
          selectedAlternativeCostIndex: item.selectedAlternativeCostIndex,
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
        label: `${cardName(card)} cost: reveal ${revealFromHandCost.amount} card(s) from hand.`,
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
          activatedBlock: item.activatedBlock,
          orderedCostPayments: item.orderedCostPayments,
          paidCostCount: item.paidCostCount,
          costPaymentProgress: item.costPaymentProgress,
          selectedAlternativeCostIndex: item.selectedAlternativeCostIndex,
          amount: revealFromHandCost.amount,
          candidateIds,
          triggerEvent: item.triggerEvent,
        },
      });
      return;
    }
    if (candidateIds.length === revealFromHandCost.amount) item.costPaymentIds = candidateIds;
  }

  const returnHandToDeckCost = block.costs?.find((cost) => cost.cost === "returnHandToDeck");
  if (returnHandToDeckCost && !item.costPaymentIds) {
    const candidateIds = [...getPlayer(state, item.controller).hand];
    createChoicePrompt(state, {
      choiceKind: "costPayment",
      seat: item.controller,
      label: `${cardName(card)} cost: return ${returnHandToDeckCost.amount} card(s) from hand to the ${returnHandToDeckCost.position} of your deck.`,
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
        activatedBlock: item.activatedBlock,
        orderedCostPayments: item.orderedCostPayments,
        paidCostCount: item.paidCostCount,
        costPaymentProgress: item.costPaymentProgress,
        selectedAlternativeCostIndex: item.selectedAlternativeCostIndex,
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
    if (returnTrashToDeckCost.includeSelf) candidateIds.unshift(item.sourceInstanceId);
    const amount = returnTrashToDeckCost.amount + (returnTrashToDeckCost.includeSelf ? 1 : 0);
    const origins = returnTrashToDeckCost.includeSelf
      ? "this Character and the selected cards from your trash"
      : "the selected cards from your trash";
    if (candidateIds.length > amount || amount > 1) {
      createChoicePrompt(state, {
        choiceKind: "costPayment",
        seat: item.controller,
        label: `${cardName(card)} cost: return ${origins} to the ${returnTrashToDeckCost.position} of your deck.`,
        details: `Choose ${amount} cards in the order they should be placed at the ${returnTrashToDeckCost.position} of your deck.`,
        sourceCardId: source.cardId,
        sourceInstanceId: item.sourceInstanceId,
        eventId: null,
        options: candidateIds.map((instanceId) => ({
          id: instanceId,
          label: cardName(getCardForInstance(state, instanceId)),
          value: instanceId,
          targetId: instanceId,
        })),
        minSelections: amount,
        maxSelections: amount,
        context: { cost: "returnTrashToDeck", ordered: true },
        resolutionContext: {
          intent: "effectCostReturnTrashToDeck",
          sourceInstanceId: item.sourceInstanceId,
          controller: item.controller,
          trigger: item.trigger,
          blockIndex: item.blockIndex,
          activatedBlock: item.activatedBlock,
          orderedCostPayments: item.orderedCostPayments,
          paidCostCount: item.paidCostCount,
          costPaymentProgress: item.costPaymentProgress,
          selectedAlternativeCostIndex: item.selectedAlternativeCostIndex,
          amount,
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
      label: `${cardName(card)} cost: return this card and ${returnThisAndHandToDeckCost.handAmount} hand card(s) to the ${returnThisAndHandToDeckCost.position} of your deck.`,
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
        activatedBlock: item.activatedBlock,
        orderedCostPayments: item.orderedCostPayments,
        paidCostCount: item.paidCostCount,
        costPaymentProgress: item.costPaymentProgress,
        selectedAlternativeCostIndex: item.selectedAlternativeCostIndex,
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
      label: `${cardName(card)} Life cost: choose the top or bottom of Life.`,
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
        activatedBlock: item.activatedBlock,
        orderedCostPayments: item.orderedCostPayments,
        paidCostCount: item.paidCostCount,
        costPaymentProgress: item.costPaymentProgress,
        selectedAlternativeCostIndex: item.selectedAlternativeCostIndex,
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
      label: `${cardName(card)} Life cost: choose the top or bottom of Life.`,
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
        activatedBlock: item.activatedBlock,
        orderedCostPayments: item.orderedCostPayments,
        paidCostCount: item.paidCostCount,
        costPaymentProgress: item.costPaymentProgress,
        selectedAlternativeCostIndex: item.selectedAlternativeCostIndex,
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
  if (playCardCost && !item.costsPaid) {
    // 3-7-6-1: a Character played as the effect cost into a full Character
    // area pauses the block for the replacement choice; the continuation
    // re-queues this block with costs already paid.
    const costPlayIds =
      item.costPaymentIds ??
      candidatesForPlayCardCost(state, item.controller, item.sourceInstanceId, playCardCost).slice(
        0,
        playCardCost.amount,
      );
    const replacementPlayId = costPlayIds.find(
      (instanceId) =>
        getCardForInstance(state, instanceId).cardType === "character" &&
        getOpenCharacterSlots(state, item.controller).length === 0,
    );
    if (replacementPlayId) {
      promptForEffectCharacterReplacement(state, {
        controller: item.controller,
        playingSeat: item.controller,
        sourceInstanceId: item.sourceInstanceId,
        instanceId: replacementPlayId,
        playState: "active",
        continuation: {
          kind: "playCardCost",
          trigger: item.trigger,
          blockIndex: item.blockIndex,
          activatedBlock: item.activatedBlock,
          orderedCostPayments: item.orderedCostPayments,
          paidCostCount: item.paidCostCount,
          costPaymentProgress: item.costPaymentProgress,
          selectedAlternativeCostIndex: item.selectedAlternativeCostIndex,
          selectedIds: costPlayIds,
          trashHandIds: item.trashHandIds,
          costPaymentIdsByType: item.costPaymentIdsByType,
          triggerEvent: item.triggerEvent,
        },
      });
      return;
    }
  }
  const restCost = block.costs?.find(
    (cost) => cost.cost === "restThisCard" || cost.cost === "restCards",
  );
  if (restCost && !item.costsPaid) {
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
    )
      return;
    const selected =
      restCost.cost === "restThisCard"
        ? [item.sourceInstanceId]
        : (item.costPaymentIdsByType?.restCards ??
          item.costPaymentIds ??
          candidatesForRestCardsCost(state, item.controller, item.sourceInstanceId, restCost).slice(
            0,
            restCost.amount,
          ));
    const donProcessId = selected.some((id) => id.startsWith("active-don:"))
      ? beginDonIdentityProcess(state)
      : undefined;
    const bound = bindDonCostSelections(
      state,
      item.controller,
      item.sourceInstanceId,
      [restCost],
      selected,
      item.costPaymentIdsByType,
    );
    if (!bound) {
      if (donProcessId) endDonIdentityProcess(state, donProcessId);
      return;
    }
    const tokens = [...(bound[0] ?? [])];
    const entries: import("../types.ts").RestCostProcess["entries"] = [];
    for (const id of selected) {
      if (id.startsWith("active-don:")) {
        const token = tokens.shift();
        if (!token) throw new Error("Rest cost requires a bound DON identity");
        entries.push({ kind: "don", token, seat: item.controller });
      } else {
        const target = getInstance(state, id);
        entries.push({
          kind: "card",
          instanceId: id,
          zone: target.zone,
          zoneChangeCounter: target.zoneChangeCounter,
        });
      }
    }
    if (
      block.oncePerTurn &&
      !source.usedEffectKeys.includes(effectKey) &&
      (item.costPaymentProgress?.sourceZoneChangeCounter === undefined ||
        source.zoneChangeCounter === item.costPaymentProgress.sourceZoneChangeCounter)
    )
      source.usedEffectKeys.push(effectKey);
    enqueueResolution(
      state,
      {
        kind: "effectRestCostContinue",
        replacementProcess: currentReplacementProcess(state),
        process: { continuation: item, block, entries, index: 0, incomplete: false, donProcessId },
      },
      { next: true },
    );
    return;
  }
  if (addLifeToHandCost && !item.costsPaid) {
    const position =
      addLifeToHandCost.position === "choice"
        ? (item.costPaymentIds?.[0] ?? "top")
        : addLifeToHandCost.position;
    const life = getPlayer(state, item.controller).life;
    const ids =
      position === "bottom"
        ? life.slice(-addLifeToHandCost.amount)
        : life.slice(0, addLifeToHandCost.amount);
    if (ids.some((id) => faceUpLifeToHandReplacement(state, id))) {
      // 8-3-1-7: replacement processing is allowed, but does not pay the
      // printed Life-to-hand cost. 10-2-13-5 still spends the activation.
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
      )
        return;
      payCosts(
        state,
        item.controller,
        item.sourceInstanceId,
        block.costs,
        item.trashHandIds,
        item.costPaymentIds,
        item.costPaymentIdsByType,
      );
      enqueueCharacterRemovalEffects(state, charactersBeforeCosts, item.controller);
      if (block.oncePerTurn) source.usedEffectKeys.push(effectKey);
      // Replacement order is already pending. Resume the cost cursor only
      // after that private choice, retaining nonpayment of the original cost.
      enqueueResolution(
        state,
        {
          kind: "effectAfterCostSettlement",
          continuation: {
            ...item,
            costsPaid: true,
            costPaymentProgress: { ...item.costPaymentProgress, incomplete: true },
          },
          block,
        },
        { next: true },
      );
      return;
    }
  }
  const removalCost =
    koCharacterCost ??
    returnCharacterToDeckCost ??
    (lifeCardCost?.cost === "addCharacterToLife" ? lifeCardCost : undefined);
  if (removalCost && !item.costsPaid) {
    const targetIds =
      item.costPaymentIds ??
      (removalCost.cost === "koCharacter"
        ? candidatesForKoCharacterCost(state, item.controller, item.sourceInstanceId, removalCost)
        : removalCost.cost === "addCharacterToLife"
          ? candidatesForLifeCardCost(state, item.controller, item.sourceInstanceId, removalCost)
          : candidatesForReturnCharacterToDeckCost(
              state,
              item.controller,
              item.sourceInstanceId,
              removalCost,
            )
      ).slice(0, removalCost.amount);
    if (
      !canPayCosts(
        state,
        item.controller,
        item.sourceInstanceId,
        block.costs,
        item.trashHandIds,
        targetIds,
        item.costPaymentIdsByType,
      )
    )
      return;
    const otherCosts = block.costs?.filter((cost) => cost !== removalCost);
    if (
      !payCosts(
        state,
        item.controller,
        item.sourceInstanceId,
        otherCosts,
        item.trashHandIds,
        item.costPaymentIds,
        item.costPaymentIdsByType,
      )
    )
      return;
    enqueueCharacterRemovalEffects(state, charactersBeforeCosts, item.controller);
    // 10-2-13-5: the activation is spent even if a replacement prevents payment.
    if (block.oncePerTurn) source.usedEffectKeys.push(effectKey);
    const payment = enqueueResolution(
      state,
      {
        kind: "effectRemovalCostComplete",
        continuation: { ...item, costPaymentIds: targetIds, costsPaid: true },
        targetIds,
        paidTargetIds: [],
      },
      { next: true },
    );
    enqueueResolution(
      state,
      {
        kind: "effectAction",
        sourceInstanceId: item.sourceInstanceId,
        controller: item.controller,
        removalCostPaymentId: payment.id,
        action:
          removalCost.cost === "koCharacter"
            ? {
                action: "ko",
                target: { player: "self", zones: ["character"], count: { amount: "all" } },
              }
            : removalCost.cost === "addCharacterToLife"
              ? {
                  action: "addToLife",
                  position: removalCost.position,
                  faceUp: removalCost.faceUp,
                  target: {
                    player: removalCost.player ?? "self",
                    zones: ["character"],
                    count: { amount: "all" },
                    filters: removalCost.filters,
                  },
                }
              : {
                  action: "returnToDeck",
                  position: removalCost.position,
                  target: {
                    player: removalCost.player ?? "self",
                    zones: ["character"],
                    count: { amount: "all" },
                  },
                },
        selectedTargetIds: targetIds,
      },
      { next: true },
    );
    return;
  }
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

  finishPaidEffect(state, item, block);
}

export function continueRestCostPayment(
  state: MatchState,
  process: import("../types.ts").RestCostProcess,
) {
  const item = process.continuation;
  while (process.index < process.entries.length) {
    const entry = process.entries[process.index]!;
    if (entry.kind === "don") {
      const location = locateDonIdentity(state, entry.token);
      if (
        location &&
        "seat" in location &&
        location.seat === entry.seat &&
        location.area === "active"
      ) {
        transferDonIdentities(state, location, { seat: entry.seat, area: "rested" }, 1, [
          entry.token,
        ]);
        getPlayer(state, entry.seat).activeDon -= 1;
        getPlayer(state, entry.seat).restedDon += 1;
      } else process.incomplete = true;
    } else {
      const card = state.cards[entry.instanceId];
      if (!card || card.zone !== entry.zone || card.zoneChangeCounter !== entry.zoneChangeCounter)
        process.incomplete = true;
      else {
        if (
          promptForEffectRestReplacement(
            state,
            entry.instanceId,
            item.controller,
            item.sourceInstanceId,
            {
              action: "rest",
              target: {
                player: "self",
                zones: ["leader", "character", "stage"],
                count: { amount: 1 },
              },
            },
            [],
            undefined,
            process,
          )
        )
          return;
        if (!restCharacterByEffect(state, entry.instanceId, item.controller, item.sourceInstanceId))
          process.incomplete = true;
      }
    }
    process.index += 1;
  }
  if (process.donProcessId) endDonIdentityProcess(state, process.donProcessId);
  if (process.incomplete)
    item.costPaymentProgress = { ...item.costPaymentProgress, incomplete: true };
  finishPaidEffect(state, { ...item, costsPaid: true }, process.block);
}

export function completeRemovalCostPayment(
  state: MatchState,
  payment: Extract<ResolutionItem, { kind: "effectRemovalCostComplete" }>,
) {
  // Only the original, unreplaced removal pays the printed cost (8-3-1-7).
  // A replacement that moves the same card does not pay that original cost.
  const item = payment.continuation;
  if (!payment.targetIds.every((id) => payment.paidTargetIds.includes(id)))
    item.costPaymentProgress = { ...item.costPaymentProgress, incomplete: true };
  const block = effectBlockWithSelectedCost(
    effectBlockForContinuation(state, item),
    item.selectedAlternativeCostIndex,
    item.orderedCostPayments ? (item.paidCostCount ?? 0) : undefined,
  );
  if (block) finishPaidEffect(state, item, block);
}

function finishPaidEffect(
  state: MatchState,
  item: Extract<ResolutionItem, { kind: "effectBlock" }>,
  block: EffectBlock,
) {
  if (
    !settleContinuousCosts(state) &&
    (state.continuousCosts?.pending || state.continuousCosts?.unsupported)
  ) {
    enqueueResolution(
      state,
      { kind: "effectAfterCostSettlement", continuation: { ...item, costsPaid: true }, block },
      { next: true },
    );
    return;
  }
  resolveEffectAfterCosts(state, item, block);
}

export function resolveEffectAfterCosts(
  state: MatchState,
  item: Extract<ResolutionItem, { kind: "effectBlock" }>,
  block: EffectBlock,
) {
  if (item.orderedCostPayments) {
    const full = effectBlockWithSelectedCost(
      item.activatedBlock,
      item.selectedAlternativeCostIndex,
    );
    const nextCost = (item.paidCostCount ?? 0) + 1;
    if (nextCost < (full?.costs?.length ?? 0)) {
      enqueueResolution(
        state,
        {
          ...item,
          paidCostCount: nextCost,
          costPaymentProgress: item.costPaymentProgress
            ? { ...item.costPaymentProgress, adjustedCost: undefined }
            : undefined,
          costsPaid: false,
          confirmed: true,
          costPaymentIds: undefined,
          costPaymentIdsByType: undefined,
          trashHandIds: undefined,
        },
        { next: true },
      );
      return;
    }
  }
  const source = getInstance(state, item.sourceInstanceId);
  const card = getCard(source.cardId);
  const effectKey = block.oncePerTurnKey ?? `${item.trigger}:${item.blockIndex}`;
  if (item.costPaymentProgress?.incomplete) {
    if (
      block.oncePerTurn &&
      (item.costPaymentProgress.sourceZoneChangeCounter === undefined ||
        source.zoneChangeCounter === item.costPaymentProgress.sourceZoneChangeCounter) &&
      !source.usedEffectKeys.includes(effectKey)
    )
      source.usedEffectKeys.push(effectKey);
    return;
  }
  if (block.postCostConditions?.length) {
    const postCostCondition = evaluateConditions(
      state,
      item.controller,
      item.sourceInstanceId,
      block.postCostConditions,
    );
    if (!postCostCondition.supported) {
      const issue = recordCapabilityIssue(state, {
        kind: "unsupportedCondition",
        code: `post-cost-condition:${item.trigger}:${item.blockIndex}`,
        actor: item.controller,
        sourceCardId: source.cardId,
        sourceInstanceId: item.sourceInstanceId,
        eventId: null,
        details: `${cardName(card)} has a post-cost condition that is not automated yet.`,
      });
      enqueueJudgePrompt(
        state,
        item.sourceInstanceId,
        "Judge review: post-cost condition",
        `${cardName(card)} has a post-cost condition that is not automated yet.`,
        { issueId: issue.id },
      );
      return;
    }
    if (!postCostCondition.matches) {
      return;
    }
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

  if (block.oncePerTurn && !source.usedEffectKeys.includes(effectKey)) {
    source.usedEffectKeys.push(effectKey);
  }

  // [DON!! xN] remains a requirement after paying the activation cost.
  // OP10-069 FAQ: returning its sole attached DON!! pays DON!! -1, but the
  // following K.O. does not resolve. Do not recheck unrelated textual gates.
  const donConditions = block.conditions?.filter(
    (condition) => condition.condition === "donAttached",
  );
  if (
    donConditions?.length &&
    !evaluateConditions(
      state,
      item.controller,
      item.sourceInstanceId,
      donConditions,
      [],
      // A removed source uses the DON!! count captured by its removal event.
      // Live sources must use the post-payment count, not a trigger snapshot.
      source.zone === "leader" || source.zone === "character" ? undefined : item.triggerEvent,
    ).matches
  )
    return;

  emitEvent(state, "effectResolved", item.controller, {
    sourceCardId: source.cardId,
    sourceInstanceId: item.sourceInstanceId,
    visibility: "public",
    data: {
      trigger: item.trigger,
    },
  });
  emitLog(
    state,
    item.controller,
    `${cardName(card)} resolves its ${triggerLabel(item.trigger)} effect.`,
    {
      sourceCardId: source.cardId,
      sourceInstanceId: item.sourceInstanceId,
      visibility: "public",
    },
  );

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
      ((action.action === "returnToDeck" || action.action === "grantKeyword") &&
        action.triggerEventTarget) ||
      (action.action === "copyPower" && action.triggerEventAttacker);
    const triggerEventTargetId =
      action.action === "returnToDeck" && action.triggerEventTarget
        ? item.triggerEvent?.targetInstanceId
        : (action.action === "copyPower" && action.triggerEventAttacker) ||
            (action.action === "grantKeyword" && action.triggerEventTarget)
          ? item.triggerEvent?.instanceId
          : undefined;
    const triggerEventTargetIsSameObject =
      action.action !== "returnToDeck" ||
      !action.triggerEventTarget ||
      item.triggerEvent?.targetZoneChangeCounter === undefined ||
      (triggerEventTargetId !== undefined &&
        getInstance(state, triggerEventTargetId).zoneChangeCounter ===
          item.triggerEvent.targetZoneChangeCounter);
    const triggerEventTargetPool = bindsTriggerEventTarget
      ? candidatePoolForTarget(state, item.controller, item.sourceInstanceId, action.target)
      : undefined;
    const selectedTargetIds =
      action.action === "returnToDeck" && action.costPaymentTargets
        ? [...previousActionTargetIds]
        : bindsTriggerEventTarget
          ? triggerEventTargetId &&
            triggerEventTargetIsSameObject &&
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
        effectTriggerEvent: item.triggerEvent,
        ...(selectedTargetIds && { selectedTargetIds }),
        previousActionTargetIds,
      },
      { next: true },
    );
  }
}

function selectRemovalGroup(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  action: Extract<Action, { action: "ko" | "returnToDeck" | "returnToHand" }>,
  selectedGroups: string[][],
  previousActionTargetIds?: string[],
) {
  const reportUnsupportedGroup = () => {
    const source = getInstance(state, sourceInstanceId);
    const details = `${cardName(getCard(source.cardId))} uses a target group that is not automated yet.`;
    const issue = recordCapabilityIssue(state, {
      kind: "unsupportedTarget",
      code: `action-target-group:${action.action}`,
      actor: controller,
      sourceCardId: source.cardId,
      sourceInstanceId,
      eventId: null,
      details,
    });
    enqueueJudgePrompt(state, sourceInstanceId, "Judge review: unsupported target group", details, {
      issueId: issue.id,
    });
  };
  const groups = action.targetGroups ?? [];
  while (selectedGroups.length < groups.length) {
    const target = groups[selectedGroups.length];
    if (!target) break;
    const groupAction = { ...action, target };
    const selected = new Set(selectedGroups.flat());
    const pool = candidatePoolForTarget(state, controller, sourceInstanceId, target);
    if (!pool.supported) {
      reportUnsupportedGroup();
      return;
    }
    const candidates = pool.candidateIds.filter(
      (id) => !selected.has(id) && actionTargetIsEligible(state, groupAction, id, sourceInstanceId),
    );
    if (candidates.length > 0) {
      promptForTargetSelection(
        state,
        controller,
        sourceInstanceId,
        groupAction,
        candidates,
        previousActionTargetIds,
        { action, selectedGroups },
      );
      return;
    }
    selectedGroups = [...selectedGroups, []];
  }
  // Recheck every group against the current state before a single movement action.
  const selectedTargetIds: string[] = [];
  for (const [index, ids] of selectedGroups.entries()) {
    const target = groups[index];
    if (!target) continue;
    const pool = candidatePoolForTarget(state, controller, sourceInstanceId, target);
    if (!pool.supported) {
      reportUnsupportedGroup();
      return;
    }
    selectedTargetIds.push(
      ...ids.filter(
        (id) =>
          pool.candidateIds.includes(id) &&
          actionTargetIsEligible(state, { ...action, target }, id, sourceInstanceId),
      ),
    );
  }
  enqueueResolution(
    state,
    {
      kind: "effectAction",
      controller,
      sourceInstanceId,
      action,
      selectedTargetIds,
      previousActionTargetIds,
    },
    { next: true },
  );
}

export function processQueuedEffectAction(
  state: MatchState,
  item: Extract<ResolutionItem, { kind: "effectAction" }>,
) {
  if ("condition" in item.action && item.action.condition) {
    const condition = evaluateConditions(
      state,
      item.controller,
      item.sourceInstanceId,
      [item.action.condition],
      item.previousActionTargetIds,
      item.effectTriggerEvent,
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

  if (
    (item.action.action === "ko" ||
      item.action.action === "returnToDeck" ||
      item.action.action === "returnToHand") &&
    item.action.targetGroups &&
    item.selectedTargetIds === undefined
  ) {
    selectRemovalGroup(
      state,
      item.controller,
      item.sourceInstanceId,
      item.action,
      [],
      item.previousActionTargetIds,
    );
    return;
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
    item.setPowerFromSourceIds,
    item.removalCostPaymentId,
    item.koCompletionId,
    item.movementCompletionId,
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
    nextItem.controller === item.controller &&
    delayedActionChain(nextItem.action) === delayedActionChain(item.action) &&
    (!delayedActionChain(item.action) ||
      !["sequence", "optional", "conditional"].includes(item.action.action))
  ) {
    const scheduling = ["delayed", "scheduleAtEndOfTurn"].includes(item.action.action);
    const completedTargetIds = scheduling
      ? item.previousActionTargetIds
      : item.returnToDeckContinuation?.finalizeOwnerGroup &&
          item.returnToDeckContinuation.remainingOwnerGroups.length === 0
        ? item.returnToDeckContinuation.allTargetIds
        : item.action.action === "ko"
          ? movedCardIds
          : item.selectedTargetIds;
    nextItem.previousActionTargetIds = completedTargetIds?.length
      ? completedTargetIds
      : movedCardIds;
    if (!scheduling)
      nextItem.action = rebindDelayedPrevious(
        state,
        nextItem.action,
        nextItem.previousActionTargetIds,
      );
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
    label: `${cardName(getCardForInstance(state, sourceInstanceId))} chooses the remainder position.`,
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
    if (
      getInstance(state, playedCard.instanceId).zoneChangeCounter !== playedCard.zoneChangeCounter
    ) {
      continue;
    }
    const blocks = effectBlocksForInstance(state, playedCard.instanceId, "onPlay");
    for (let blockIndex = blocks.length - 1; blockIndex >= 0; blockIndex -= 1) {
      enqueueResolution(
        state,
        {
          kind: "effectBlock",
          sourceInstanceId: playedCard.instanceId,
          sourceZoneChangeCounter: playedCard.zoneChangeCounter,
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
    ).includes(activeId)
  ) {
    return false;
  }

  return continueGroupedPlay(
    state,
    sourceInstanceId,
    controller,
    action,
    selectedIds,
    activeId,
    [],
  );
}

function continueGroupedPlay(
  state: MatchState,
  sourceInstanceId: string,
  controller: MatchSeat,
  action: Extract<import("@tcg/op-types").Action, { action: "playGrouped" }>,
  pendingIds: string[],
  activeId: string,
  playedCards: Array<{ instanceId: string; zoneChangeCounter: number }>,
): boolean {
  const playingSeat = action.source.player === "self" ? controller : otherSeat(controller);
  for (const [index, instanceId] of pendingIds.entries()) {
    const playState =
      action.playStates.multiple.every((playState) => playState === "active") ||
      instanceId === activeId
        ? "active"
        : "rested";
    if (getOpenCharacterSlots(state, playingSeat).length === 0) {
      promptForEffectCharacterReplacement(state, {
        controller,
        playingSeat,
        sourceInstanceId,
        instanceId,
        playState,
        continuation: {
          kind: "groupedPlay",
          action,
          remainingIds: pendingIds.slice(index + 1),
          playedCards,
          activeId,
        },
      });
      return true;
    }
    if (
      !playCardFromEffect(state, playingSeat, instanceId, playState, sourceInstanceId, {
        deferOnPlay: true,
      })
    ) {
      return false;
    }
    if (effectBlocksForInstance(state, instanceId, "onPlay").length > 0) {
      playedCards.push({
        instanceId,
        zoneChangeCounter: getInstance(state, instanceId).zoneChangeCounter,
      });
    }
  }
  // 8-1-3-1-3: a source that changed areas before activation has no
  // pending On Play effect, including a just-played card replaced for space.
  const pendingPlayedCards = playedCards.filter(
    (card) => getInstance(state, card.instanceId).zoneChangeCounter === card.zoneChangeCounter,
  );
  enqueueDeferredOnPlayBlocks(state, playingSeat, pendingPlayedCards);
  return true;
}

interface SearchPlayContext {
  sourceInstanceId: string;
  controller: MatchSeat;
  action: Extract<import("@tcg/op-types").Action, { action: "search" }>;
  lookedIds: string[];
}

// Handles the looked-at cards that were not selected once every selected card
// has been played or added to hand.
function finishSearchAfterSelections(
  state: MatchState,
  promptSourceCardId: string | null,
  context: SearchPlayContext,
  selectedIds: string[],
): boolean {
  const remainderIds = context.lookedIds.filter((instanceId) => !selectedIds.includes(instanceId));
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
    label: `${cardName(getCardForInstance(state, context.sourceInstanceId))} orders the remaining ${remainderIds.length} card(s) at the ${remainderPosition} of the deck.`,
    details: `Order the remaining cards from first to last at the ${remainderPosition} of your deck.`,
    sourceCardId: promptSourceCardId,
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

// Resolves the selected cards of a search, pausing for the 3-7-6-1
// replacement choice when a Character is played into a full Character area.
function playSearchSelections(
  state: MatchState,
  promptSourceCardId: string | null,
  context: SearchPlayContext,
  pendingIds: string[],
  playedIds: string[],
): boolean {
  for (let index = 0; index < pendingIds.length; index += 1) {
    const instanceId = pendingIds[index]!;
    if (context.action.revealDestination === "character") {
      if (
        getCardForInstance(state, instanceId).cardType === "character" &&
        getOpenCharacterSlots(state, context.controller).length === 0
      ) {
        promptForEffectCharacterReplacement(state, {
          controller: context.controller,
          playingSeat: context.controller,
          sourceInstanceId: context.sourceInstanceId,
          instanceId,
          playState: context.action.playState,
          continuation: {
            kind: "searchPlay",
            action: context.action,
            lookedIds: context.lookedIds,
            playedIds: [...playedIds, ...pendingIds.slice(0, index)],
            remainingIds: pendingIds.slice(index + 1),
            sourceCardId: promptSourceCardId,
          },
        });
        return true;
      }
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
    } else if (context.action.revealDestination !== "life") {
      emitLog(
        state,
        context.controller,
        context.action.reveal === false
          ? `${getPlayer(state, context.controller).playerName} adds a card to their hand.`
          : `${getPlayer(state, context.controller).playerName} reveals ${cardName(getCardForInstance(state, instanceId))} and adds it to their hand.`,
        {
          sourceCardId: promptSourceCardId,
          sourceInstanceId: context.sourceInstanceId,
          targetIds: context.action.reveal === false ? [] : [instanceId],
          visibility: "public",
          privateMessages:
            context.action.reveal === false
              ? {
                  [context.controller]: `${getPlayer(state, context.controller).playerName} adds ${cardName(getCardForInstance(state, instanceId))} to their hand.`,
                }
              : undefined,
        },
      );
      moveCard(state, instanceId, context.controller, "hand", {
        faceUp: false,
        publicKnowledge: false,
        actor: context.controller,
        visibility: "private",
      });
    } else if (context.action.revealDestination === "life") {
      emitLog(
        state,
        context.controller,
        `${getPlayer(state, context.controller).playerName} adds a card to the top of their Life.`,
        {
          sourceCardId: promptSourceCardId,
          sourceInstanceId: context.sourceInstanceId,
          targetIds: [instanceId],
          visibility: context.action.lifeFaceUp ? "public" : "private",
        },
      );
      moveCard(state, instanceId, context.controller, "life", {
        faceUp: context.action.lifeFaceUp ?? false,
        publicKnowledge: context.action.lifeFaceUp ?? false,
        actor: context.controller,
        visibility: context.action.lifeFaceUp ? "public" : "private",
        lifePosition: "top",
      });
    }
  }
  return finishSearchAfterSelections(state, promptSourceCardId, context, [
    ...playedIds,
    ...pendingIds,
  ]);
}

export function resolveEffectChoicePrompt(
  state: MatchState,
  prompt: PromptState,
  command: Extract<GameCommand, { type: "resolvePrompt" }>,
): boolean {
  switch (prompt.resolutionContext?.intent) {
    case "continuousCostOrder": {
      const context = prompt.resolutionContext;
      return (
        context.candidateIds.includes(command.optionId ?? "") &&
        chooseContinuousCostOrder(state, context.fingerprint, command.optionId)
      );
    }
    case "readyEffectOrder": {
      const context = prompt.resolutionContext;
      const group = state.readyEffectGroup;
      const selected = group?.effects.find(
        (item) => item.id === command.optionId && item.controller === context.controller,
      );
      if (
        !selected ||
        !context.candidateIds.includes(selected.id) ||
        !isReadyEffectEligible(state, selected)
      )
        return false;
      group!.effects = group!.effects.filter((item) => item.id !== selected.id);
      enqueueResolution(state, { ...selected, readyEffectSelected: true }, { next: true });
      return true;
    }

    case "loopIterations":
      return (
        command.iterations !== undefined &&
        declareLoopIterations(state, command.seat, command.iterations)
      );
    case "effectKoReplacement": {
      const originalContext = prompt.resolutionContext;
      if (originalContext.replacementRequired && command.optionId === "no") return false;
      const selected = originalContext.replacementChoices?.find(
        (choice) => choice.id === command.optionId,
      );
      if (originalContext.replacementChoices && command.optionId !== "no" && !selected)
        return false;
      const context = selected
        ? {
            ...originalContext,
            ...selected,
            replacementSourceInstanceId: selected.sourceInstanceId,
          }
        : originalContext;
      const optionId = selected ? "yes" : command.optionId;
      if (optionId !== "yes" && command.optionId !== "no") {
        return false;
      }
      if (optionId === "yes") {
        getInstance(state, context.replacementSourceInstanceId).usedEffectKeys.push(
          context.replacementEffectKey,
        );
        const remainingTargetIds = context.remainingTargetIds.filter(
          (targetId) => !context.replacementTargetIds.includes(targetId),
        );
        if (remainingTargetIds.length > 0) {
          enqueueResolution(
            state,
            {
              kind: "effectAction",
              removalCostPaymentId: context.removalCostPaymentId,
              koCompletionId: context.koCompletionId,
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
            replacementProcess: extendReplacementProcess(
              state,
              context.replacementSourceInstanceId,
              context.replacementEffectKey,
            ),
            previousActionTargetIds: context.replacementTargetIds,
          },
          { next: true },
        );
      } else {
        const declinedTargets =
          context.replacementChoices?.flatMap((choice) => choice.replacementTargetIds) ??
          context.replacementTargetIds;
        enqueueResolution(
          state,
          {
            kind: "effectAction",
            removalCostPaymentId: context.removalCostPaymentId,
            koCompletionId: context.koCompletionId,
            sourceInstanceId: context.koSourceInstanceId,
            controller: context.koController,
            action: {
              action: "ko",
              target: { player: "both", zones: ["character"], count: { amount: "all" } },
              previousActionTargets: true,
            },
            previousActionTargetIds: [
              ...new Set([context.targetId, ...context.remainingTargetIds]),
            ],
            replacementProcess: declineReplacementProcess(
              state,
              declinedTargets,
              prompt.replacementGroup ?? [],
            ),
          },
          { next: true },
        );
      }
      return true;
    }
    case "effectDonTransferSelection": {
      const { process, index } = prompt.resolutionContext;
      const move = process.moves[index];
      const ids = command.selectedIds ?? [];
      if (
        !move ||
        ids.length !== move.count ||
        new Set(ids).size !== ids.length ||
        ids.some(
          (id) => !move.candidates.includes(id) || !donIdentitiesAt(state, move.from).includes(id),
        )
      )
        return false;
      const next = { ...process, moves: process.moves.map((move) => ({ ...move })) };
      next.moves[index]!.selected = ids;
      return continueDonTransfers(state, next);
    }
    case "effectCostDonIdentity": {
      const context = prompt.resolutionContext,
        ids = command.selectedIds ?? [];
      if (
        ids.length !== context.amount ||
        new Set(ids).size !== ids.length ||
        ids.some((id) => !context.candidates.includes(id) || !locateDonIdentity(state, id))
      )
        return false;
      enqueueResolution(
        state,
        {
          ...context.continuation,
          kind: "effectBlock",
          costPaymentIdsByType: {
            ...context.continuation.costPaymentIdsByType,
            [context.paymentType]: ids,
          },
        },
        { next: true },
      );
      return true;
    }
    case "effectSimultaneousStateSelection": {
      const { process, groupIndex } = prompt.resolutionContext;
      const group = process.groups[groupIndex];
      if (!group) return false;
      const ids = command.selectedIds ?? (command.optionId ? [command.optionId] : []);
      const constraint = process.action.groups[group.index]!.target.totalConstraint;
      const total = constraint
        ? ids.reduce((sum, id) => sum + (process.snapshots[id]?.[constraint.property] ?? 0), 0)
        : 0;
      const validTotal =
        !constraint ||
        {
          eq: total === constraint.value,
          lt: total < constraint.value,
          lte: total <= constraint.value,
          gt: total > constraint.value,
          gte: total >= constraint.value,
        }[constraint.comparison];
      if (
        ids.length < group.minimum ||
        ids.length > group.maximum ||
        new Set(ids).size !== ids.length ||
        ids.some((id) => {
          const snapshot = process.snapshots[id],
            card = state.cards[id];
          if (snapshot?.donSeat) {
            const location = locateDonIdentity(state, id);
            return (
              !group.candidateIds.includes(id) ||
              !location ||
              "attachedTo" in location ||
              location.seat !== snapshot.donSeat
            );
          }
          return (
            !group.candidateIds.includes(id) ||
            !snapshot ||
            !card ||
            card.zone !== snapshot.zone ||
            card.zoneChangeCounter !== snapshot.zoneChangeCounter
          );
        }) ||
        !validTotal
      )
        return false;
      group.selectedIds = ids;
      continueSimultaneousStateChange(state, process);
      return true;
    }
    case "effectRestReplacement": {
      const originalContext = prompt.resolutionContext;
      if (originalContext.replacementRequired && command.optionId === "no") return false;
      const selected = originalContext.replacementChoices?.find(
        (choice) => choice.id === command.optionId,
      );
      if (originalContext.replacementChoices && command.optionId !== "no" && !selected)
        return false;
      const context = selected
        ? {
            ...originalContext,
            ...selected,
            replacementSourceInstanceId: selected.sourceInstanceId,
          }
        : originalContext;
      const optionId = selected ? "yes" : command.optionId;
      if (optionId !== "yes" && optionId !== "no") return false;
      if (context.restCostProcess) {
        const process = context.restCostProcess;
        const entry = process.entries[process.index];
        const target = state.cards[context.targetId];
        if (
          !entry ||
          entry.kind !== "card" ||
          entry.instanceId !== context.targetId ||
          !target ||
          target.zone !== entry.zone ||
          target.zoneChangeCounter !== entry.zoneChangeCounter
        )
          return false;
        if (optionId === "yes") {
          // The replacement is a different event, even if it rests this same card.
          process.incomplete = true;
          process.index += 1;
          getInstance(state, context.replacementSourceInstanceId).usedEffectKeys.push(
            context.replacementEffectKey,
          );
          enqueueResolution(
            state,
            {
              kind: "effectRestCostContinue",
              process,
              replacementProcess: currentReplacementProcess(state),
            },
            { next: true },
          );
          enqueueResolution(
            state,
            {
              kind: "effectAction",
              sourceInstanceId: context.replacementSourceInstanceId,
              controller: context.controller,
              action: context.replacementAction,
              replacementProcess: extendReplacementProcess(
                state,
                context.replacementSourceInstanceId,
                context.replacementEffectKey,
              ),
              previousActionTargetIds: [context.targetId],
            },
            { next: true },
          );
        } else {
          enqueueResolution(
            state,
            {
              kind: "effectRestCostContinue",
              process,
              replacementProcess: declineReplacementProcess(
                state,
                [context.targetId],
                prompt.replacementGroup ?? [],
              ),
            },
            { next: true },
          );
        }
        return true;
      }
      if (context.simultaneousStateChange) {
        const process = context.simultaneousStateChange;
        const snapshot = process.snapshots[context.targetId];
        const target = state.cards[context.targetId];
        if (
          !snapshot ||
          !target ||
          target.zone !== snapshot.zone ||
          target.zoneChangeCounter !== snapshot.zoneChangeCounter
        )
          return false;
        if (optionId === "yes") {
          process.winners![process.replacementIndex]!.replaced = true;
          process.replacementIndex += 1;
          getInstance(state, context.replacementSourceInstanceId).usedEffectKeys.push(
            context.replacementEffectKey,
          );
          enqueueResolution(state, { kind: "effectStateChangeContinue", process }, { next: true });
          enqueueResolution(
            state,
            {
              kind: "effectAction",
              sourceInstanceId: context.replacementSourceInstanceId,
              controller: context.controller,
              action: context.replacementAction,
              replacementProcess: extendReplacementProcess(
                state,
                context.replacementSourceInstanceId,
                context.replacementEffectKey,
              ),
              previousActionTargetIds: [context.targetId],
            },
            { next: true },
          );
        } else {
          enqueueResolution(
            state,
            {
              kind: "effectStateChangeContinue",
              process,
              replacementProcess: declineReplacementProcess(
                state,
                [context.targetId],
                prompt.replacementGroup ?? [],
              ),
            },
            { next: true },
          );
        }
        return true;
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
      if (optionId === "yes") {
        getInstance(state, context.replacementSourceInstanceId).usedEffectKeys.push(
          context.replacementEffectKey,
        );
        enqueueResolution(
          state,
          {
            kind: "effectAction",
            sourceInstanceId: context.replacementSourceInstanceId,
            controller: context.controller,
            action: context.replacementAction,
            replacementProcess: extendReplacementProcess(
              state,
              context.replacementSourceInstanceId,
              context.replacementEffectKey,
            ),
            previousActionTargetIds: [context.targetId],
          },
          { next: true },
        );
      } else {
        enqueueResolution(
          state,
          {
            kind: "effectAction",
            sourceInstanceId: context.restSourceInstanceId,
            controller: context.restController,
            action: {
              ...context.restAction,
              target: { ...context.restAction.target, count: { amount: 1 } },
            },
            selectedTargetIds: [context.targetId],
            replacementProcess: declineReplacementProcess(
              state,
              [context.targetId],
              prompt.replacementGroup ?? [],
            ),
          },
          { next: true },
        );
      }
      return true;
    }
    case "effectRemovalReplacement": {
      const originalContext = prompt.resolutionContext;
      if (originalContext.replacementRequired && command.optionId === "no") return false;
      const selected = originalContext.replacementChoices?.find(
        (choice) => choice.id === command.optionId,
      );
      if (originalContext.replacementChoices && command.optionId !== "no" && !selected)
        return false;
      const context = selected
        ? {
            ...originalContext,
            ...selected,
            replacementSourceInstanceId: selected.sourceInstanceId,
          }
        : originalContext;
      const optionId = selected ? "yes" : command.optionId;
      if (optionId !== "yes" && optionId !== "no") {
        return false;
      }
      if (optionId === "no") {
        const declinedTargets = context.replacementChoices?.flatMap(
          (choice) => choice.replacementTargetIds,
        ) ?? [
          context.targetId,
          ...context.remainingTargetIds.filter((id) => {
            const candidate = findRemoveFromFieldReplacement(
              state,
              id,
              context.removalController,
              context.removalSourceInstanceId,
            );
            return (
              candidate?.sourceInstanceId === context.replacementSourceInstanceId &&
              candidate.replacementEffectIndex === context.replacementEffectIndex
            );
          }),
        ];
        const process = declineReplacementProcess(
          state,
          declinedTargets,
          prompt.replacementGroup ?? [],
        );
        if (
          withReplacementProcess(state, process, () =>
            promptForEffectRemovalReplacement(
              state,
              context.targetId,
              context.removalController,
              context.removalSourceInstanceId,
              context.removalAction,
              context.remainingTargetIds,
              context.returnToDeckContinuation,
              context.returnCharacterCostContinuation,
              context.skipRemovalReplacementIds,
              context.removalCostPaymentId,
              context.movementCompletionId,
            ),
          )
        )
          return true;
      }
      const replacementTargetIds = selected?.replacementTargetIds ?? [
        context.targetId,
        ...context.remainingTargetIds.filter((targetId) => {
          if (context.skipRemovalReplacementIds?.includes(targetId)) return false;
          const replacement = findRemoveFromFieldReplacement(
            state,
            targetId,
            context.removalController,
            context.removalSourceInstanceId,
          );
          return (
            replacement?.sourceInstanceId === context.replacementSourceInstanceId &&
            replacement.replacementEffectIndex === context.replacementEffectIndex
          );
        }),
      ];
      const remainingTargetIds = context.remainingTargetIds.filter(
        (targetId) => !replacementTargetIds.includes(targetId),
      );
      if (optionId === "yes" && remainingTargetIds.length > 0) {
        enqueueResolution(
          state,
          {
            kind: "effectAction",
            sourceInstanceId: context.removalSourceInstanceId,
            removalCostPaymentId: context.removalCostPaymentId,
            movementCompletionId: context.movementCompletionId,
            controller: context.removalController,
            action: context.removalAction,
            selectedTargetIds: remainingTargetIds,
            skipRemovalReplacementIds: context.skipRemovalReplacementIds,
            returnToDeckContinuation: context.returnToDeckContinuation,
          },
          { next: true },
        );
      } else if (optionId === "yes" && context.returnToDeckContinuation) {
        enqueueResolution(
          state,
          {
            kind: "effectAction",
            sourceInstanceId: context.removalSourceInstanceId,
            removalCostPaymentId: context.removalCostPaymentId,
            movementCompletionId: context.movementCompletionId,
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
      if (optionId === "yes") {
        getInstance(state, context.replacementSourceInstanceId).usedEffectKeys.push(
          context.replacementEffectKey,
        );
        enqueueResolution(
          state,
          {
            kind: "effectAction",
            sourceInstanceId: context.replacementSourceInstanceId,
            controller: context.controller,
            action: context.replacementAction,
            replacementProcess: extendReplacementProcess(
              state,
              context.replacementSourceInstanceId,
              context.replacementEffectKey,
            ),
            previousActionTargetIds: replacementTargetIds,
          },
          { next: true },
        );
      } else {
        enqueueResolution(
          state,
          {
            kind: "effectAction",
            sourceInstanceId: context.removalSourceInstanceId,
            removalCostPaymentId: context.removalCostPaymentId,
            movementCompletionId: context.movementCompletionId,
            controller: context.removalController,
            action: context.removalAction,
            selectedTargetIds: [context.targetId, ...context.remainingTargetIds],
            skipRemovalReplacementIds: [
              ...(context.skipRemovalReplacementIds ?? []),
              ...replacementTargetIds,
            ],
            returnToDeckContinuation: context.returnToDeckContinuation,
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
      if (state.donIdentities)
        return continueDonTransfers(state, {
          controller: context.controller,
          sourceInstanceId: context.sourceInstanceId,
          moves: [
            {
              from: { seat: context.controller, area: "active" },
              to: { seat: context.controller, area: "rested" },
              count,
              candidates: donIdentitiesAt(state, { seat: context.controller, area: "active" }),
            },
          ],
          afterActions: [
            {
              action: "modifyPower",
              target: context.action.target,
              value: count * context.action.valuePerDon,
              duration: context.action.duration,
            },
          ],
        });
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
      if (getBaseCost(state, context.revealedInstanceId) === chosenCost) {
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
    case "effectAlternativeCost": {
      const context = prompt.resolutionContext;
      const index = context.affordableIndexes.find(
        (candidate) => String(candidate) === command.optionId,
      );
      if (index === undefined) return false;
      const original = effectBlockForContinuation(state, context.continuation);
      const selected = effectBlockWithSelectedCost(original, index);
      if (
        !selected ||
        !canPayEffectBlockCosts(
          state,
          context.controller,
          context.sourceInstanceId,
          { ...selected, alternativeCosts: undefined },
          context.continuation.trashHandIds,
        )
      )
        return false;
      enqueueResolution(
        state,
        {
          kind: "effectBlock",
          ...context.continuation,
          selectedAlternativeCostIndex: index,
          confirmed: true,
        },
        { next: true },
      );
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
            activatedBlock: prompt.resolutionContext.activatedBlock,
            orderedCostPayments: prompt.resolutionContext.orderedCostPayments,
            paidCostCount: prompt.resolutionContext.paidCostCount,
            costPaymentProgress: prompt.resolutionContext.costPaymentProgress,
            selectedAlternativeCostIndex: prompt.resolutionContext.selectedAlternativeCostIndex,
            trashHandIds: prompt.resolutionContext.trashHandIds,
            costPaymentIdsByType: prompt.resolutionContext.costPaymentIdsByType,
            confirmed: true,
            triggerEvent: prompt.resolutionContext.triggerEvent,
          },
          { next: true },
        );
      } else {
        state.optionalLoopEvidence = undefined;
        // Rules 8-1-2 / 10-2-13: Once Per Turn is consumed only when activated
        // and resolved — declining leaves later opportunities available.
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
    case "effectCostGiveDon": {
      const context = prompt.resolutionContext;
      const selectedIds = command.selectedIds ?? [];
      const block = effectBlockWithSelectedCost(
        effectBlockForContinuation(state, context),
        context.selectedAlternativeCostIndex,
        context.orderedCostPayments ? (context.paidCostCount ?? 0) : undefined,
      );
      const cost = block?.costs?.find((candidate) => candidate.cost === "giveDon");
      if (!cost) {
        return false;
      }
      const { poolAmount } = giveDonCostParts(state, context.controller, cost);
      const liveCandidateIds = giveDonCostCandidateIds(
        state,
        context.controller,
        cost,
        context.sourceInstanceId,
      );
      if (
        selectedIds.length !== 1 ||
        !context.candidateIds.includes(selectedIds[0]!) ||
        !liveCandidateIds.includes(selectedIds[0]!) ||
        poolAmount < context.amount
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
          activatedBlock: context.activatedBlock,
          orderedCostPayments: context.orderedCostPayments,
          paidCostCount: context.paidCostCount,
          costPaymentProgress: context.costPaymentProgress,
          selectedAlternativeCostIndex: context.selectedAlternativeCostIndex,
          costPaymentIdsByType: {
            ...context.costPaymentIdsByType,
            giveDon: selectedIds,
          },
          confirmed: true,
          triggerEvent: context.triggerEvent,
        },
        { next: true },
      );
      return true;
    }
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
          activatedBlock: context.activatedBlock,
          orderedCostPayments: context.orderedCostPayments,
          paidCostCount: context.paidCostCount,
          costPaymentProgress: context.costPaymentProgress,
          selectedAlternativeCostIndex: context.selectedAlternativeCostIndex,
          trashHandIds: selectedIds,
          costPaymentIds: context.costPaymentIds,
          costPaymentIdsByType: context.costPaymentIdsByType,
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
          activatedBlock: context.activatedBlock,
          orderedCostPayments: context.orderedCostPayments,
          paidCostCount: context.paidCostCount,
          costPaymentProgress: context.costPaymentProgress,
          selectedAlternativeCostIndex: context.selectedAlternativeCostIndex,
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
      const paymentBlock = effectBlockWithSelectedCost(
        effectBlockForContinuation(state, context),
        context.selectedAlternativeCostIndex,
        context.orderedCostPayments ? (context.paidCostCount ?? 0) : undefined,
      );
      const returnDonCost = paymentBlock?.costs?.find((cost) => cost.cost === "returnDon");
      if (!returnDonCost) return false;
      const liveCandidateIds = returnDonCostOptions(
        state,
        context.controller,
        returnDonCost.donState,
      ).map((option) => option.id);
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
      if (
        !bindDonCostSelections(
          state,
          context.controller,
          context.sourceInstanceId,
          paymentBlock?.costs ?? [],
          selectedIds,
          context.costPaymentIdsByType,
        )
      )
        return false;
      enqueueResolution(
        state,
        {
          kind: "effectBlock",
          sourceInstanceId: context.sourceInstanceId,
          controller: context.controller,
          trigger: context.trigger,
          blockIndex: context.blockIndex,
          activatedBlock: context.activatedBlock,
          orderedCostPayments: context.orderedCostPayments,
          paidCostCount: context.paidCostCount,
          costPaymentProgress: context.costPaymentProgress,
          selectedAlternativeCostIndex: context.selectedAlternativeCostIndex,
          trashHandIds: context.trashHandIds,
          costPaymentIds: selectedIds,
          costPaymentIdsByType: {
            ...context.costPaymentIdsByType,
            ...(state.donIdentities
              ? {
                  returnDonSources: donIdentitiesForVirtualIds(
                    state,
                    context.controller,
                    selectedIds,
                  ),
                }
              : {}),
          },
          confirmed: true,
          triggerEvent: context.triggerEvent,
        },
        { next: true },
      );
      return true;
    }
    case "effectCostReturnCharacterToDeck": {
      const context = prompt.resolutionContext;
      const selectedIds = command.selectedIds ?? [];
      const block = effectBlockWithSelectedCost(
        effectBlockForContinuation(state, context),
        context.selectedAlternativeCostIndex,
        context.orderedCostPayments ? (context.paidCostCount ?? 0) : undefined,
      );
      const cost = block?.costs?.find((candidate) => candidate.cost === "returnCharacterToDeck");
      if (!cost) return false;
      const liveCandidateIds = candidatesForReturnCharacterToDeckCost(
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
      )
        return false;
      enqueueResolution(
        state,
        {
          kind: "effectBlock",
          sourceInstanceId: prompt.resolutionContext.sourceInstanceId,
          controller: prompt.resolutionContext.controller,
          trigger: prompt.resolutionContext.trigger,
          blockIndex: prompt.resolutionContext.blockIndex,
          activatedBlock: prompt.resolutionContext.activatedBlock,
          orderedCostPayments: prompt.resolutionContext.orderedCostPayments,
          paidCostCount: prompt.resolutionContext.paidCostCount,
          costPaymentProgress: prompt.resolutionContext.costPaymentProgress,
          selectedAlternativeCostIndex: prompt.resolutionContext.selectedAlternativeCostIndex,
          trashHandIds: prompt.resolutionContext.trashHandIds,
          costPaymentIds: command.selectedIds ?? [],
          confirmed: true,
          triggerEvent: prompt.resolutionContext.triggerEvent,
        },
        { next: true },
      );
      return true;
    }
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
            activatedBlock: context.activatedBlock,
            orderedCostPayments: context.orderedCostPayments,
            paidCostCount: context.paidCostCount,
            costPaymentProgress: context.costPaymentProgress,
            selectedAlternativeCostIndex: context.selectedAlternativeCostIndex,
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
          activatedBlock: context.activatedBlock,
          orderedCostPayments: context.orderedCostPayments,
          paidCostCount: context.paidCostCount,
          costPaymentProgress: context.costPaymentProgress,
          selectedAlternativeCostIndex: context.selectedAlternativeCostIndex,
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
          activatedBlock: context.activatedBlock,
          orderedCostPayments: context.orderedCostPayments,
          paidCostCount: context.paidCostCount,
          costPaymentProgress: context.costPaymentProgress,
          selectedAlternativeCostIndex: context.selectedAlternativeCostIndex,
          costPaymentIds: [command.optionId],
          confirmed: true,
          triggerEvent: context.triggerEvent,
        },
        { next: true },
      );
      return true;
    }
    case "effectCostAddCharacterToLife":
    case "effectCostTurnLifeFaceUp": {
      const context = prompt.resolutionContext;
      const item = context.continuation;
      const selectedIds = command.selectedIds ?? [];
      const block = effectBlockWithSelectedCost(
        effectBlockForContinuation(state, item),
        item.selectedAlternativeCostIndex,
        item.orderedCostPayments ? (item.paidCostCount ?? 0) : undefined,
      );
      const cost = block?.costs?.find((cost) =>
        context.intent === "effectCostAddCharacterToLife"
          ? cost.cost === "addCharacterToLife"
          : cost.cost === "turnLifeFaceUp",
      );
      if (!cost || (cost.cost !== "addCharacterToLife" && cost.cost !== "turnLifeFaceUp"))
        return false;
      const live = candidatesForLifeCardCost(state, item.controller, item.sourceInstanceId, cost);
      if (
        selectedIds.length !== context.amount ||
        new Set(selectedIds).size !== selectedIds.length ||
        selectedIds.some((id) => !context.candidateIds.includes(id) || !live.includes(id))
      )
        return false;
      enqueueResolution(
        state,
        { ...item, kind: "effectBlock", confirmed: true, costPaymentIds: selectedIds },
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
          activatedBlock: context.activatedBlock,
          orderedCostPayments: context.orderedCostPayments,
          paidCostCount: context.paidCostCount,
          costPaymentProgress: context.costPaymentProgress,
          selectedAlternativeCostIndex: context.selectedAlternativeCostIndex,
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
      const block = effectBlockWithSelectedCost(
        effectBlockForContinuation(state, context),
        context.selectedAlternativeCostIndex,
        context.orderedCostPayments ? (context.paidCostCount ?? 0) : undefined,
      );
      const cost = block?.costs?.find((cost) => cost.cost === "returnTrashToDeck");
      if (!cost) return false;
      const liveCandidateIds = candidatesForReturnTrashToDeckCost(
        state,
        context.controller,
        context.sourceInstanceId,
        cost,
      );
      if (cost.includeSelf) {
        const source = getInstance(state, context.sourceInstanceId);
        if (
          source.zone !== "character" ||
          source.controller !== context.controller ||
          !selectedIds.includes(source.instanceId)
        )
          return false;
        liveCandidateIds.unshift(source.instanceId);
      }
      if (context.amount !== cost.amount + (cost.includeSelf ? 1 : 0)) return false;
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
          activatedBlock: context.activatedBlock,
          orderedCostPayments: context.orderedCostPayments,
          paidCostCount: context.paidCostCount,
          costPaymentProgress: context.costPaymentProgress,
          selectedAlternativeCostIndex: context.selectedAlternativeCostIndex,
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
          activatedBlock: prompt.resolutionContext.activatedBlock,
          orderedCostPayments: prompt.resolutionContext.orderedCostPayments,
          paidCostCount: prompt.resolutionContext.paidCostCount,
          costPaymentProgress: prompt.resolutionContext.costPaymentProgress,
          selectedAlternativeCostIndex: prompt.resolutionContext.selectedAlternativeCostIndex,
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
      const paymentBlock = effectBlockWithSelectedCost(
        effectBlockForContinuation(state, context),
        context.selectedAlternativeCostIndex,
        context.orderedCostPayments ? (context.paidCostCount ?? 0) : undefined,
      );
      if (
        !canPayCosts(
          state,
          context.controller,
          context.sourceInstanceId,
          paymentBlock?.costs,
          context.trashHandIds,
          context.costPaymentIds,
          { ...context.costPaymentIdsByType, restCards: selectedIds },
        )
      )
        return false;
      enqueueResolution(
        state,
        {
          kind: "effectBlock",
          sourceInstanceId: context.sourceInstanceId,
          controller: context.controller,
          trigger: context.trigger,
          blockIndex: context.blockIndex,
          activatedBlock: context.activatedBlock,
          orderedCostPayments: context.orderedCostPayments,
          paidCostCount: context.paidCostCount,
          costPaymentProgress: context.costPaymentProgress,
          selectedAlternativeCostIndex: context.selectedAlternativeCostIndex,
          costPaymentIds: context.costPaymentIds,
          trashHandIds: context.trashHandIds,
          costPaymentIdsByType: {
            ...context.costPaymentIdsByType,
            restCards: selectedIds,
            ...(state.donIdentities
              ? {
                  restCardsSources: donIdentitiesForVirtualIds(
                    state,
                    context.controller,
                    selectedIds,
                  ),
                }
              : {}),
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
      const block = effectBlockWithSelectedCost(
        effectBlockForContinuation(state, context),
        context.selectedAlternativeCostIndex,
        context.orderedCostPayments ? (context.paidCostCount ?? 0) : undefined,
      );
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
          activatedBlock: context.activatedBlock,
          orderedCostPayments: context.orderedCostPayments,
          paidCostCount: context.paidCostCount,
          costPaymentProgress: context.costPaymentProgress,
          selectedAlternativeCostIndex: context.selectedAlternativeCostIndex,
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
      const block = effectBlockWithSelectedCost(
        effectBlockForContinuation(state, context),
        context.selectedAlternativeCostIndex,
        context.orderedCostPayments ? (context.paidCostCount ?? 0) : undefined,
      );
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
            activatedBlock: context.activatedBlock,
            orderedCostPayments: context.orderedCostPayments,
            paidCostCount: context.paidCostCount,
            costPaymentProgress: context.costPaymentProgress,
            selectedAlternativeCostIndex: context.selectedAlternativeCostIndex,
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
          activatedBlock: context.activatedBlock,
          orderedCostPayments: context.orderedCostPayments,
          paidCostCount: context.paidCostCount,
          costPaymentProgress: context.costPaymentProgress,
          selectedAlternativeCostIndex: context.selectedAlternativeCostIndex,
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
      const block = effectBlockWithSelectedCost(
        effectBlockForContinuation(state, context),
        context.selectedAlternativeCostIndex,
        context.orderedCostPayments ? (context.paidCostCount ?? 0) : undefined,
      );
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
          activatedBlock: context.activatedBlock,
          orderedCostPayments: context.orderedCostPayments,
          paidCostCount: context.paidCostCount,
          costPaymentProgress: context.costPaymentProgress,
          selectedAlternativeCostIndex: context.selectedAlternativeCostIndex,
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
      const grouped = prompt.resolutionContext.groupedRemovalSelection;
      const alreadySelected = new Set(grouped?.selectedGroups.flat() ?? []);
      const liveCandidateIds =
        action.action === "freeze" && target.zones.includes("costArea")
          ? freezeActionCandidateIds(
              state,
              prompt.resolutionContext.controller,
              prompt.resolutionContext.sourceInstanceId,
              action,
            )
          : pool.candidateIds.filter(
              (instanceId) =>
                !alreadySelected.has(instanceId) &&
                actionTargetIsEligible(state, action, instanceId, sourceInstanceId),
            );
      const maximum =
        target.count.amount === "all"
          ? liveCandidateIds.length
          : Math.min(
              resolveTargetCount(
                state,
                prompt.resolutionContext.controller,
                prompt.resolutionContext.sourceInstanceId,
                target,
              ),
              liveCandidateIds.length,
            );
      const minimum =
        target.count.upTo || target.totalConstraint || target.count.amountFromMatchingCards
          ? 0
          : maximum;
      if (
        (!pool.supported && !(action.action === "freeze" && target.zones.includes("costArea"))) ||
        selectedTargetIds.length < minimum ||
        selectedTargetIds.length > maximum ||
        new Set(selectedTargetIds).size !== selectedTargetIds.length ||
        selectedTargetIds.some(
          (instanceId) => alreadySelected.has(instanceId) || !liveCandidateIds.includes(instanceId),
        ) ||
        !selectionSatisfiesTotalConstraint(state, selectedTargetIds, target.totalConstraint)
      ) {
        return false;
      }
      if (grouped) {
        selectRemovalGroup(
          state,
          prompt.resolutionContext.controller,
          sourceInstanceId,
          grouped.action,
          [...grouped.selectedGroups, selectedTargetIds],
          prompt.resolutionContext.previousActionTargetIds,
        );
        return true;
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
      if (!selectionSatisfiesTotalConstraint(state, selectedIds, context.action.totalConstraint)) {
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
        ? Math.min(context.action.groups.length, liveCandidateIds.length)
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
      if (
        selectedIds.length === 1 ||
        context.action.playStates.multiple.every((playState) => playState === "active")
      ) {
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
        label: `${cardName(getCardForInstance(state, context.sourceInstanceId))} play states.`,
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
    case "effectPlayCharacterReplacement": {
      const context = prompt.resolutionContext;
      const selectedIds = command.selectedIds ?? (command.optionId ? [command.optionId] : []);
      const player = getPlayer(state, context.playingSeat);
      const instance = getInstance(state, context.instanceId);
      const card = getCardForInstance(state, context.instanceId);
      if (
        selectedIds.length !== 1 ||
        selectedIds.some(
          (selectedId) =>
            !context.candidateIds.includes(selectedId) ||
            !player.characterArea.includes(selectedId),
        ) ||
        instance.controller !== context.playingSeat ||
        instance.zone === "character" ||
        card.cardType !== "character" ||
        isCardPlayRestricted(
          state,
          context.playingSeat,
          context.instanceId,
          instance.zone,
          "effect",
        )
      ) {
        return false;
      }
      const trashedId = selectedIds[0]!;
      const slotIndex = player.characterArea.indexOf(trashedId);
      const trashedInstance = getInstance(state, trashedId);
      // 3-7-6-1-1: this trash processes a rule, so no effect can be applied —
      // it is not a K.O. (10-2-1-3) and dispatches no triggers or replacements.
      // Return any attached DON!! to the cost area before the Character leaves play.
      if (trashedInstance.attachedDon > 0) {
        transferDonIdentities(
          state,
          { attachedTo: trashedInstance.instanceId },
          { seat: trashedInstance.owner, area: "rested" },
          trashedInstance.attachedDon,
        );
        getPlayer(state, trashedInstance.owner).restedDon += trashedInstance.attachedDon;
        trashedInstance.attachedDon = 0;
      }
      moveCard(state, trashedId, trashedInstance.owner, "trash", {
        faceUp: true,
        publicKnowledge: true,
        actor: context.playingSeat,
      });
      const continuation = context.continuation;
      if (continuation.kind === "playThisCard") {
        return completePlayThisCard(state, context.controller, context.instanceId, slotIndex);
      }
      if (
        !playCardFromEffect(
          state,
          context.playingSeat,
          context.instanceId,
          context.playState,
          context.sourceInstanceId,
          { slotIndex, deferOnPlay: continuation.kind === "groupedPlay" },
        )
      ) {
        return false;
      }
      switch (continuation.kind) {
        case "groupedPlay": {
          const playedCards = [...continuation.playedCards];
          if (effectBlocksForInstance(state, context.instanceId, "onPlay").length > 0) {
            playedCards.push({
              instanceId: context.instanceId,
              zoneChangeCounter: getInstance(state, context.instanceId).zoneChangeCounter,
            });
          }
          return continueGroupedPlay(
            state,
            context.sourceInstanceId,
            context.controller,
            continuation.action,
            continuation.remainingIds,
            continuation.activeId,
            playedCards,
          );
        }
        case "playAction":
          return (
            playCardsFromEffectSequence(
              state,
              context.controller,
              context.sourceInstanceId,
              continuation.action,
              context.playingSeat,
              continuation.remainingIds,
              [...continuation.playedIds, context.instanceId],
              continuation.previousActionTargetIds,
            ) !== "failed"
          );
        case "searchPlay":
          return playSearchSelections(
            state,
            continuation.sourceCardId,
            {
              sourceInstanceId: context.sourceInstanceId,
              controller: context.controller,
              action: continuation.action,
              lookedIds: continuation.lookedIds,
            },
            continuation.remainingIds,
            [...continuation.playedIds, context.instanceId],
          );
        case "revealFromLifePlay": {
          const conditionalPlay = continuation.action.conditionalPlay;
          for (const nestedAction of [...(conditionalPlay?.thenActions ?? [])].reverse()) {
            enqueueResolution(
              state,
              {
                kind: "effectAction",
                sourceInstanceId: context.sourceInstanceId,
                controller: context.controller,
                action: nestedAction,
                previousActionTargetIds: [context.instanceId],
              },
              { next: true },
            );
          }
          return true;
        }
        case "playCardCost": {
          const sourceCard = getCardForInstance(state, context.sourceInstanceId);
          const otherCosts = (
            effectBlockWithSelectedCost(
              effectBlockForContinuation(state, {
                ...continuation,
                sourceInstanceId: context.sourceInstanceId,
              }),
              continuation.selectedAlternativeCostIndex,
              continuation.orderedCostPayments ? (continuation.paidCostCount ?? 0) : undefined,
            )?.costs ?? []
          ).filter((cost) => cost.cost !== "playCard");
          if (
            otherCosts.length > 0 &&
            !payCosts(
              state,
              context.controller,
              context.sourceInstanceId,
              otherCosts,
              continuation.trashHandIds,
              undefined,
              continuation.costPaymentIdsByType,
            )
          ) {
            const issue = recordCapabilityIssue(state, {
              kind: "unsupportedCost",
              code: `cost:${continuation.trigger}:${continuation.blockIndex}`,
              actor: context.controller,
              sourceCardId: getInstance(state, context.sourceInstanceId).cardId,
              sourceInstanceId: context.sourceInstanceId,
              eventId: null,
              details: `${cardName(sourceCard)} has costs that could not be paid automatically.`,
            });
            enqueueJudgePrompt(
              state,
              context.sourceInstanceId,
              "Judge review: effect costs",
              `${cardName(sourceCard)} has costs that could not be paid automatically.`,
              { issueId: issue.id },
            );
            return true;
          }
          enqueueResolution(
            state,
            {
              kind: "effectBlock",
              sourceInstanceId: context.sourceInstanceId,
              controller: context.controller,
              trigger: continuation.trigger,
              blockIndex: continuation.blockIndex,
              activatedBlock: continuation.activatedBlock,
              orderedCostPayments: continuation.orderedCostPayments,
              paidCostCount: continuation.paidCostCount,
              costPaymentProgress: continuation.costPaymentProgress,
              selectedAlternativeCostIndex: continuation.selectedAlternativeCostIndex,
              trashHandIds: continuation.trashHandIds,
              costPaymentIds: continuation.selectedIds,
              costPaymentIdsByType: continuation.costPaymentIdsByType,
              costsPaid: true,
              confirmed: true,
              triggerEvent: continuation.triggerEvent,
            },
            { next: true },
          );
          return true;
        }
      }
    }
    case "effectSetPowerFromSource": {
      const context = prompt.resolutionContext;
      const selectedIds = command.selectedIds ?? [];
      if (
        selectedIds.length > 1 ||
        selectedIds.some((instanceId) => !context.sourceCandidateIds.includes(instanceId))
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
          previousActionTargetIds: context.previousActionTargetIds,
          setPowerFromSourceIds: selectedIds,
        },
        { next: true },
      );
      return true;
    }
    case "effectSearchLookCount": {
      const context = prompt.resolutionContext;
      const count = Number(command.optionId);
      if (
        !Number.isInteger(count) ||
        command.optionId !== String(count) ||
        count < 0 ||
        count > context.maximum
      )
        return false;
      // Zero means look at nothing here, not SearchAction's full-deck sentinel.
      if (count === 0) return true;
      enqueueResolution(
        state,
        {
          kind: "effectAction",
          sourceInstanceId: context.sourceInstanceId,
          controller: context.controller,
          action: {
            ...context.action,
            lookCount: count,
            lookCountUpTo: false,
            condition: undefined,
          },
        },
        { next: true },
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
      // 3-7-6-1 keeps Character plays legal even into a full Character area.
      const playableEligibleIds =
        context.action.revealDestination === "character"
          ? context.eligibleIds.filter((instanceId) => {
              const card = getCardForInstance(state, instanceId);
              return card.cardType === "stage" || card.cardType === "character";
            })
          : context.eligibleIds;
      const maximum = Math.min(requested, playableEligibleIds.length);
      const minimum = context.action.revealCount.upTo ? 0 : maximum;
      const player = getPlayer(state, context.controller);
      if (
        selectedIds.length < minimum ||
        selectedIds.length > maximum ||
        new Set(selectedIds).size !== selectedIds.length ||
        selectedIds.some((instanceId) => !playableEligibleIds.includes(instanceId)) ||
        player.deck
          .slice(0, context.lookedIds.length)
          .some((instanceId, index) => instanceId !== context.lookedIds[index])
      ) {
        return false;
      }
      return playSearchSelections(state, prompt.sourceCardId, context, selectedIds, []);
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
    case "effectLifeReplacementOrder": {
      const { groups } = prompt.resolutionContext;
      const group = groups[0];
      const ids = command.selectedIds ?? [];
      if (
        !group ||
        ids.length !== group.cards.length ||
        new Set(ids).size !== ids.length ||
        ids.some((id) => !group.cards.some((card) => card.instanceId === id)) ||
        group.cards.some((card) => {
          const current = state.cards[card.instanceId];
          return (
            !current ||
            current.zone !== "deck" ||
            current.controller !== group.destinationSeat ||
            current.zoneChangeCounter !== card.zoneChangeCounter
          );
        })
      )
        return false;
      const deck = getPlayer(state, group.destinationSeat).deck;
      const selected = new Set(ids);
      // Reorder only this simultaneous group. Later independent payments may
      // already have placed other cards after it; their positions stay fixed.
      let orderedIndex = 0;
      getPlayer(state, group.destinationSeat).deck = deck.map((id) =>
        selected.has(id) ? ids[orderedIndex++]! : id,
      );
      getPlayer(state, group.destinationSeat).deck.forEach((id, index) => {
        getInstance(state, id).zoneIndex = index;
      });
      continueLifeReplacementOrder(state, groups.slice(1));
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
          selectedTargetIds:
            context.action.position === "top" ? [...selectedIds].reverse() : selectedIds,
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
        label: `${cardName(getCardForInstance(state, context.sourceInstanceId))} chooses the deck position for the selected card(s).`,
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
        label: `${cardName(getCardForInstance(state, context.sourceInstanceId))} chooses the deck position for the selected card(s).`,
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
        label: `${cardName(sourceCard)} needs a DON!! recipient.`,
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
      if (state.donIdentities)
        return continueDonTransfers(state, {
          controller: prompt.resolutionContext.controller,
          sourceInstanceId: prompt.resolutionContext.sourceInstanceId,
          moves: [...donorCounts].map(([donorInstanceId, count]) => ({
            from: { attachedTo: donorInstanceId },
            to: { attachedTo: recipientInstanceId },
            count,
            candidates: donIdentitiesAt(state, { attachedTo: donorInstanceId }),
          })),
        });
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
      if (state.donIdentities)
        return continueDonTransfers(state, {
          controller: prompt.resolutionContext.controller,
          sourceInstanceId: prompt.resolutionContext.sourceInstanceId,
          moves: [
            {
              from: { seat: prompt.resolutionContext.controller, area: "rested" },
              to: { seat: prompt.resolutionContext.controller, area: "active" },
              count: selectedCount,
              candidates: donIdentitiesAt(state, {
                seat: prompt.resolutionContext.controller,
                area: "rested",
              }),
            },
          ],
        });
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
          selectedTargetIds:
            command.optionId === "top" &&
            prompt.resolutionContext.returnToDeckContinuation?.orderResolved
              ? [...prompt.resolutionContext.selectedTargetIds].reverse()
              : prompt.resolutionContext.selectedTargetIds,
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
          removalCostPaymentId: prompt.resolutionContext.removalCostPaymentId,
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
        label: `${cardName(getCardForInstance(state, context.sourceInstanceId))} Life position.`,
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
        })
      ) {
        return false;
      }
      if (getOpenCharacterSlots(state, context.controller).length === 0) {
        // 3-7-6-1: the Character area is full, so the play pauses for the
        // replacement choice instead of fizzling.
        promptForEffectCharacterReplacement(state, {
          controller: context.controller,
          playingSeat: context.controller,
          sourceInstanceId: context.sourceInstanceId,
          instanceId: context.revealedInstanceId,
          playState: "active",
          continuation: { kind: "revealFromLifePlay", action: context.action },
        });
        return true;
      }
      if (
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
      const liveCandidateIds = returnDonCostOptions(
        state,
        context.returningSeat,
        context.action.donState,
      ).map((option) => option.id);
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
      const liveCandidateIds = returnDonCostOptions(
        state,
        context.returningSeat,
        context.action.donState,
      ).map((option) => option.id);
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
    case "effectRevealFromLifeSelection": {
      const context = prompt.resolutionContext;
      const owner =
        context.action.player === "self" ? context.controller : otherSeat(context.controller);
      const revealedInstanceId = getPlayer(state, owner).life[0];
      const selected = command.optionId === "1" && revealedInstanceId;
      enqueueResolution(
        state,
        {
          kind: "effectAction",
          sourceInstanceId: context.sourceInstanceId,
          controller: context.controller,
          action: context.action,
          selectedTargetIds: selected ? [revealedInstanceId!] : [],
        },
        { next: true },
      );
      return true;
    }
    case "effectGiveDonEachCount":
      return (
        command.optionId !== undefined &&
        continueGiveDonEach(state, prompt.resolutionContext, command.optionId)
      );
    case "effectGiveDonSource": {
      const context = prompt.resolutionContext;
      const activeCount = Number(command.optionId);
      if (command.optionId !== String(activeCount)) return false;
      return completeGiveDon(
        state,
        context.controller,
        context.sourceInstanceId,
        context.action,
        context.targetId,
        activeCount,
      );
    }
    case "effectGiveDonCount": {
      const selectedCount = Number.parseInt(command.optionId ?? "", 10);
      const context = prompt.resolutionContext;
      const availableDon = availableDonForGive(state, context.controller, context.action);
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
