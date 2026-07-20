import type { Action, Cost, GroupedPlayAction, PlayAction } from "@tcg/op-types";
import {
  basePower,
  cardName,
  cardNames,
  effectBlocksFor,
  effectBlocksForInstance,
  emitEvent,
  emitLog,
  enqueueEffectsForTrigger,
  enqueueInPlayEffectsForTrigger,
  enqueueResolution,
  getCardForInstance,
  getCardCost,
  getCardPower,
  getInstance,
  getKeywords,
  getPlayer,
  hasFlagModifier,
  isDonActivationByCharacterEffectPrevented,
  recordCapabilityIssue,
  restCard,
  otherSeat,
  shuffle,
} from "../shared.ts";
import {
  addDonFromDeck,
  addModifier,
  consumeNextPlayCostModifiers,
  createChoicePrompt,
  drawCards,
  enqueueJudgePrompt,
  formatCardList,
  getOpenCharacterSlots,
  moveCard,
} from "../state.ts";
import type {
  EffectBlockContinuation,
  MatchSeat,
  MatchState,
  PromptOption,
  ReturnToDeckContinuation,
  ReturnToDeckOwnerGroup,
} from "../types.ts";
import { evaluateConditions } from "./conditions.ts";
import {
  isCardPlayRestricted,
  isCharacterRemovalPreventedByPermanentEffect,
  isKoPreventedByModifier,
  isPlayedRestedByPermanentEffect,
  isRestPreventedByPermanentEffect,
} from "./permanent.ts";
import {
  findKoReplacement,
  findRemoveFromFieldReplacement,
  findRestReplacement,
  restActionCandidateIds,
} from "./replacements.ts";
import { candidatePoolForTarget, candidatesForTarget, matchesTargetFilter } from "./targeting.ts";

type RestCardsCost = Extract<Cost, { cost: "restCards" }>;
type TrashCharacterCost = Extract<Cost, { cost: "trashCharacter" }>;
type KoCharacterCost = Extract<Cost, { cost: "koCharacter" }>;
type RevealFromHandCost = Extract<Cost, { cost: "revealFromHand" }>;
type PlayCardCost = Extract<Cost, { cost: "playCard" }>;
type TrashCardCost = Extract<Cost, { cost: "trashCard" }>;
type CardCostOption = PlayCardCost | TrashCardCost["options"][number];
type TrashFromHandCost = Extract<Cost, { cost: "trashFromHand" }>;
type EffectRemovalAction = Extract<
  Action,
  { action: "returnToHand" | "returnToDeck" | "trashFromField" }
>;

function delayedActionMovesSource(action: Action): boolean {
  switch (action.action) {
    case "trashThisCard":
    case "playThisCard":
    case "addThisCardToHand":
      return true;
    case "ko":
    case "returnToHand":
    case "returnToDeck":
    case "addToLife":
    case "trashFromField":
      return action.target.self === true;
    default:
      return false;
  }
}

function randomizedConcealedHandOrder(
  state: MatchState,
  sourceInstanceId: string,
  chooser: MatchSeat,
  candidateIds: string[],
  promptKind: string,
): string[] {
  const concealedIds = candidateIds.filter((instanceId) => {
    const instance = getInstance(state, instanceId);
    return instance.zone === "hand" && instance.controller !== chooser;
  });
  if (concealedIds.length < 2) {
    return candidateIds;
  }
  const randomizedIds = shuffle(
    concealedIds,
    [
      state.config.seed ?? "0",
      state.turnNumber,
      state.eventSequence,
      state.idCounter,
      sourceInstanceId,
      chooser,
      promptKind,
      ...concealedIds,
    ].join(":"),
  );
  let concealedIndex = 0;
  return candidateIds.map((instanceId) => {
    const instance = getInstance(state, instanceId);
    if (instance.zone !== "hand" || instance.controller === chooser) {
      return instanceId;
    }
    const randomizedId = randomizedIds[concealedIndex];
    concealedIndex += 1;
    return randomizedId ?? instanceId;
  });
}

export function restCharacterByEffect(
  state: MatchState,
  instanceId: string,
  effectController: MatchSeat,
  sourceInstanceId: string,
): boolean {
  const instance = getInstance(state, instanceId);
  if (!restCard(state, instanceId, effectController, sourceInstanceId)) {
    return false;
  }
  if (instance.zone === "character") {
    enqueueInPlayEffectsForTrigger(
      state,
      "whenCharacterRestedByEffect",
      {
        instanceId,
        effectController,
        sourceInstanceId,
        targetInstanceId: instanceId,
      },
      [effectController],
    );
  }
  return true;
}

function promptForEffectRestReplacement(
  state: MatchState,
  targetId: string,
  controller: MatchSeat,
  sourceInstanceId: string,
  action: Extract<Action, { action: "rest" }>,
  remainingTargetIds: string[],
): boolean {
  const target = getInstance(state, targetId);
  if (target.zone !== "character") {
    return false;
  }
  const replacement = findRestReplacement(state, targetId, controller, sourceInstanceId);
  if (!replacement) {
    return false;
  }
  createChoicePrompt(state, {
    choiceKind: "confirm",
    seat: replacement.controller,
    label: `${effectSourceName(state, replacement.sourceInstanceId)} may replace being rested`,
    details: "Apply the replacement effect instead of resting this Character?",
    sourceCardId: getInstance(state, replacement.sourceInstanceId).cardId,
    sourceInstanceId: replacement.sourceInstanceId,
    eventId: null,
    options: [
      { id: "no", label: "Rest this Character", value: "no" },
      { id: "yes", label: "Apply replacement", value: "yes" },
    ],
    minSelections: 1,
    maxSelections: 1,
    context: { action: "rest", replacement: true },
    resolutionContext: {
      intent: "effectRestReplacement",
      targetId,
      controller: replacement.controller,
      replacementSourceInstanceId: replacement.sourceInstanceId,
      replacementEffectIndex: replacement.replacementEffectIndex,
      replacementEffectKey: replacement.effectKey,
      replacementAction: replacement.effect.replacementAction,
      restSourceInstanceId: sourceInstanceId,
      restController: controller,
      restAction: {
        ...action,
        target: {
          ...action.target,
          count: { amount: remainingTargetIds.length },
        },
      },
      remainingTargetIds,
    },
  });
  return true;
}

export function koCharacterByEffect(
  state: MatchState,
  targetId: string,
  controller: MatchSeat,
  sourceInstanceId: string,
) {
  if (isCharacterRemovalPreventedByPermanentEffect(state, targetId, controller)) {
    emitLog(
      state,
      controller,
      `${cardName(getCardForInstance(state, targetId))} cannot be removed from the field by this effect.`,
      {
        sourceCardId: getInstance(state, sourceInstanceId).cardId,
        sourceInstanceId,
        targetIds: [targetId],
        visibility: "public",
      },
    );
    return;
  }
  const target = getInstance(state, targetId);
  const owner = target.owner;
  const effectController = target.controller;
  const attachedDon = target.attachedDon;
  if (target.attachedDon > 0) {
    getPlayer(state, effectController).restedDon += target.attachedDon;
    target.attachedDon = 0;
  }
  moveCard(state, targetId, owner, "trash", {
    faceUp: true,
    publicKnowledge: true,
    actor: controller,
  });
  const triggerEvent = {
    instanceId: targetId,
    instanceController: effectController,
    effectController: controller,
    koCause: "effect" as const,
    attachedDon,
  };
  enqueueEffectsForTrigger(state, targetId, effectController, "onKo", undefined, triggerEvent);
  enqueueEffectsForTrigger(
    state,
    targetId,
    effectController,
    "whenCharacterKod",
    undefined,
    triggerEvent,
  );
  enqueueInPlayEffectsForTrigger(state, "whenCharacterKod", triggerEvent);
  emitLog(
    state,
    controller,
    `${effectSourceName(state, sourceInstanceId)} K.O.'s ${cardName(getCardForInstance(state, targetId))}.`,
    {
      sourceCardId: getInstance(state, sourceInstanceId).cardId,
      sourceInstanceId,
      targetIds: [targetId],
      visibility: "public",
    },
  );
}

function effectSourceName(state: MatchState, sourceInstanceId: string): string {
  return cardName(getCardForInstance(state, sourceInstanceId));
}

function targetNames(state: MatchState, targetIds: readonly string[]): string {
  return targetIds.map((targetId) => cardName(getCardForInstance(state, targetId))).join(", ");
}

function resolveAmountFromTarget(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  amountFromTarget: Extract<Action, { action: "draw" }>["amountFromTarget"],
): number | null {
  if (!amountFromTarget) {
    return null;
  }
  const pool = candidatePoolForTarget(state, controller, sourceInstanceId, amountFromTarget);
  if (pool.supported) {
    return pool.candidateIds.length;
  }
  const issue = recordCapabilityIssue(state, {
    kind: "unsupportedAction",
    code: "action:dynamicAmount",
    actor: controller,
    sourceCardId: getInstance(state, sourceInstanceId).cardId,
    sourceInstanceId,
    eventId: null,
    details: `${effectSourceName(state, sourceInstanceId)} uses an unsupported target-derived amount.`,
  });
  enqueueJudgePrompt(
    state,
    sourceInstanceId,
    "Judge review: unsupported target-derived amount",
    `${effectSourceName(state, sourceInstanceId)} uses an unsupported target-derived amount.`,
    { issueId: issue.id },
  );
  return null;
}

export function returnAttachedDonToCostArea(state: MatchState, instanceId: string) {
  const instance = getInstance(state, instanceId);
  if (instance.zone !== "character" || instance.attachedDon === 0) {
    return;
  }
  getPlayer(state, instance.controller).restedDon += instance.attachedDon;
  instance.attachedDon = 0;
}

export function promptForEffectRemovalReplacement(
  state: MatchState,
  targetId: string,
  controller: MatchSeat,
  sourceInstanceId: string,
  action: EffectRemovalAction,
  remainingTargetIds: string[],
  returnToDeckContinuation?: ReturnToDeckContinuation,
  returnCharacterCostContinuation?: EffectBlockContinuation,
): boolean {
  const replacement = findRemoveFromFieldReplacement(state, targetId, controller, sourceInstanceId);
  if (!replacement) {
    return false;
  }
  const replacementEvent = replacement.effect.replacedEvent;
  if (replacementEvent !== "removeFromField" && replacementEvent !== "leaveField") {
    return false;
  }
  if (replacement.effect.mandatory) {
    if (remainingTargetIds.length > 0) {
      enqueueResolution(
        state,
        {
          kind: "effectAction",
          sourceInstanceId,
          controller,
          action,
          selectedTargetIds: remainingTargetIds,
          returnToDeckContinuation,
        },
        { next: true },
      );
    } else if (returnToDeckContinuation) {
      enqueueResolution(
        state,
        {
          kind: "effectAction",
          sourceInstanceId,
          controller,
          action,
          selectedTargetIds: [],
          returnToDeckContinuation,
        },
        { next: true },
      );
    }
    getInstance(state, replacement.sourceInstanceId).usedEffectKeys.push(replacement.effectKey);
    enqueueResolution(
      state,
      {
        kind: "effectAction",
        sourceInstanceId: replacement.sourceInstanceId,
        controller: replacement.controller,
        action: replacement.effect.replacementAction,
        previousActionTargetIds: [targetId],
      },
      { next: true },
    );
    return true;
  }
  createChoicePrompt(state, {
    choiceKind: "confirm",
    seat: replacement.controller,
    label: `${effectSourceName(state, replacement.sourceInstanceId)} may replace the removal`,
    details: "Apply the replacement effect instead of removing the card from the field?",
    sourceCardId: getInstance(state, replacement.sourceInstanceId).cardId,
    sourceInstanceId: replacement.sourceInstanceId,
    eventId: null,
    options: [
      { id: "no", label: "Allow removal", value: "no" },
      { id: "yes", label: "Apply replacement", value: "yes" },
    ],
    minSelections: 1,
    maxSelections: 1,
    context: { action: action.action, replacement: true },
    resolutionContext: {
      intent: "effectRemovalReplacement",
      targetId,
      controller: replacement.controller,
      replacementSourceInstanceId: replacement.sourceInstanceId,
      replacementEffectIndex: replacement.replacementEffectIndex,
      replacementEvent,
      replacementEffectKey: replacement.effectKey,
      replacementAction: replacement.effect.replacementAction,
      removalSourceInstanceId: sourceInstanceId,
      removalController: controller,
      removalAction: action,
      remainingTargetIds,
      returnToDeckContinuation,
      returnCharacterCostContinuation,
    },
  });
  return true;
}

function returnToDeckDestination(
  state: MatchState,
  controller: MatchSeat,
  targetId: string,
  action: Extract<Action, { action: "returnToDeck" }>,
): MatchSeat {
  if (action.destinationPlayer === "opponent") {
    return otherSeat(controller);
  }
  if (action.destinationPlayer === "self") {
    return controller;
  }
  return getInstance(state, targetId).owner;
}

function promptForReturnToDeckOwnerOrder(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  action: Extract<Action, { action: "returnToDeck" }>,
  targetIds: string[],
  continuation: ReturnToDeckContinuation,
) {
  createChoicePrompt(state, {
    choiceKind: "orderCards",
    seat: continuation.owner,
    label: `${effectSourceName(state, sourceInstanceId)} orders cards returned to the deck`,
    details: `Order the cards from first to last at the ${action.position} of your deck.`,
    sourceCardId: getInstance(state, sourceInstanceId).cardId,
    sourceInstanceId,
    eventId: null,
    options: targetIds.map((instanceId) => ({
      id: instanceId,
      label: cardName(getCardForInstance(state, instanceId)),
      value: instanceId,
      targetId: instanceId,
    })),
    minSelections: targetIds.length,
    maxSelections: targetIds.length,
    context: { action: "returnToDeck", ordered: true },
    resolutionContext: {
      intent: "effectReturnToDeckOwnerOrder",
      sourceInstanceId,
      controller,
      action,
      targetIds,
      continuation,
    },
  });
}

function enqueueReturnToDeckOwnerGroup(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  action: Extract<Action, { action: "returnToDeck" }>,
  group: ReturnToDeckOwnerGroup,
  remainingOwnerGroups: ReturnToDeckOwnerGroup[],
  allTargetIds: string[],
) {
  enqueueResolution(
    state,
    {
      kind: "effectAction",
      sourceInstanceId,
      controller,
      action,
      selectedTargetIds: group.targetIds,
      returnToDeckContinuation: {
        owner: group.owner,
        allTargetIds,
        publicTargetIds: group.targetIds,
        orderedTargetIds: group.targetIds,
        remainingOwnerGroups,
        orderResolved: group.targetIds.length <= 1,
        finalizeOwnerGroup: true,
      },
    },
    { next: true },
  );
}

function finalizeReturnToDeckOwnerGroup(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  action: Extract<Action, { action: "returnToDeck" }>,
  continuation: ReturnToDeckContinuation,
) {
  const movedIds = continuation.publicTargetIds.filter((instanceId) => {
    const instance = getInstance(state, instanceId);
    return (
      instance.zone === "deck" &&
      instance.controller === returnToDeckDestination(state, controller, instanceId, action)
    );
  });
  const movedSet = new Set(movedIds);
  const privateOrderedIds = continuation.orderedTargetIds.filter((instanceId) =>
    movedSet.has(instanceId),
  );
  if (movedIds.length > 0) {
    const ownerName = getPlayer(state, continuation.owner).playerName;
    const publicMessage = `${effectSourceName(state, sourceInstanceId)} places ${formatCardList(state, movedIds)} at the ${action.position} of ${ownerName}'s deck.`;
    const orderedMessage = `${publicMessage} Order: ${formatCardList(state, privateOrderedIds)}.`;
    emitLog(state, controller, publicMessage, {
      sourceCardId: getInstance(state, sourceInstanceId).cardId,
      sourceInstanceId,
      targetIds: movedIds,
      visibility: "public",
      privateMessages: { [continuation.owner]: orderedMessage },
      judgeMessage: orderedMessage,
    });
  }
  const [nextGroup, ...remainingOwnerGroups] = continuation.remainingOwnerGroups;
  if (nextGroup) {
    enqueueReturnToDeckOwnerGroup(
      state,
      controller,
      sourceInstanceId,
      action,
      nextGroup,
      remainingOwnerGroups,
      continuation.allTargetIds,
    );
  }
}

export function removeCardByEffectAction(
  state: MatchState,
  targetId: string,
  controller: MatchSeat,
  sourceInstanceId: string,
  action: EffectRemovalAction,
  redactDeckOrder = false,
) {
  if (isCharacterRemovalPreventedByPermanentEffect(state, targetId, controller)) {
    return;
  }
  const target = getInstance(state, targetId);
  returnAttachedDonToCostArea(state, targetId);
  if (action.action === "returnToHand") {
    moveCard(state, targetId, target.owner, "hand", {
      faceUp: false,
      publicKnowledge: false,
      actor: controller,
    });
    return;
  }
  if (action.action === "returnToDeck") {
    if (action.position === "any") {
      return;
    }
    const destination = returnToDeckDestination(state, controller, targetId, action);
    const returnsFromHand = target.zone === "hand";
    if (returnsFromHand && !redactDeckOrder) {
      emitLog(
        state,
        controller,
        `${getPlayer(state, target.controller).playerName} places a card from their hand at the ${action.position} of ${getPlayer(state, destination).playerName}'s deck.`,
        {
          sourceCardId: null,
          sourceInstanceId: null,
          visibility: "public",
        },
      );
    }
    moveCard(state, targetId, destination, "deck", {
      deckPosition: action.position,
      faceUp: false,
      publicKnowledge: false,
      actor: controller,
      visibility: "public",
      suppressLog: returnsFromHand || redactDeckOrder,
      redactIdentity: redactDeckOrder,
    });
    return;
  }
  moveCard(state, targetId, target.owner, "trash", {
    faceUp: true,
    publicKnowledge: true,
    actor: controller,
  });
}

export function addTopDeckCardsToLife(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  action: Extract<Action, { action: "addToLife" }>,
  amount: number,
): boolean {
  if (action.position === "choice") {
    return false;
  }
  const targetSeat = action.target.player === "self" ? controller : otherSeat(controller);
  const player = getPlayer(state, targetSeat);
  const targetIds = player.deck.slice(0, amount);

  const movementOrder = action.position === "top" ? [...targetIds].reverse() : targetIds;
  for (const targetId of movementOrder) {
    moveCard(state, targetId, targetSeat, "life", {
      lifePosition: action.position,
      faceUp: action.faceUp ?? false,
      publicKnowledge: action.faceUp ?? false,
      actor: controller,
      visibility: action.faceUp ? "public" : "private",
      suppressLog: true,
    });
  }

  if (targetIds.length > 0) {
    emitLog(
      state,
      controller,
      `${getPlayer(state, controller).playerName} adds ${targetIds.length} card${targetIds.length === 1 ? "" : "s"} from the top of the deck to ${action.position} of Life.`,
      {
        sourceCardId: getInstance(state, sourceInstanceId).cardId,
        sourceInstanceId,
        visibility: "public",
      },
    );
  }

  return true;
}

export function trashTopDeckCards(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  action: Extract<Action, { action: "trashFromDeck" }>,
  amount: number,
  requestedAmount = action.amount,
): boolean {
  const targetSeat = action.player === "self" ? controller : otherSeat(controller);
  const targetIds = getPlayer(state, targetSeat).deck.slice(0, amount);
  for (const targetId of targetIds) {
    moveCard(state, targetId, getInstance(state, targetId).owner, "trash", {
      faceUp: true,
      publicKnowledge: true,
      actor: controller,
      sourceInstanceId,
      visibility: "public",
    });
  }
  const completedTrash = action.upTo ? targetIds.length > 0 : targetIds.length === requestedAmount;
  if (completedTrash) {
    for (const nestedAction of [...(action.thenActions ?? [])].reverse()) {
      enqueueResolution(
        state,
        {
          kind: "effectAction",
          sourceInstanceId,
          controller,
          action: nestedAction,
        },
        { next: true },
      );
    }
  }
  return true;
}

export function removeLifeCards(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  action: Extract<Action, { action: "removeFromLife" }>,
  amount: number,
  selectedTargetIds?: string[],
): boolean {
  const targetSeat = action.player === "self" ? controller : otherSeat(controller);
  const player = getPlayer(state, targetSeat);
  const destination =
    action.destination === "hand" ? "hand" : action.destination === "deck" ? "deck" : "trash";
  if (
    destination === "hand" &&
    targetSeat === controller &&
    hasFlagModifier(state, player.leaderInstanceId, "cannotAddLifeToHandByOwnEffect")
  ) {
    emitLog(
      state,
      controller,
      `${effectSourceName(state, sourceInstanceId)} cannot add Life cards to hand because of an active effect.`,
      {
        sourceCardId: getInstance(state, sourceInstanceId).cardId,
        sourceInstanceId,
        visibility: "public",
      },
    );
    return true;
  }

  const targetIds =
    selectedTargetIds ??
    (action.position === "bottom" ? player.life.slice(-amount) : player.life.slice(0, amount));
  if (
    targetIds.length !== amount ||
    new Set(targetIds).size !== targetIds.length ||
    targetIds.some((instanceId) => !player.life.includes(instanceId))
  ) {
    return false;
  }
  for (const targetId of targetIds) {
    const targetOwner = getInstance(state, targetId).owner;
    const destinationSeat = destination === "trash" ? targetOwner : targetSeat;
    const redactIdentity = !getInstance(state, targetId).faceUp && destination !== "trash";
    moveCard(state, targetId, destinationSeat, destination, {
      ...(destination === "deck" && {
        deckPosition: action.destinationPosition ?? ("bottom" as const),
      }),
      faceUp: destination === "trash",
      publicKnowledge: destination === "trash",
      actor: controller,
      sourceInstanceId,
      visibility: destination === "trash" ? "public" : "private",
      redactIdentity,
    });
  }
  if (targetIds.length > 0) {
    for (const nestedAction of [...(action.thenActions ?? [])].reverse()) {
      enqueueResolution(
        state,
        {
          kind: "effectAction",
          sourceInstanceId,
          controller,
          action: nestedAction,
        },
        { next: true },
      );
    }
  }
  return true;
}

function durationLabel(duration: string): string {
  switch (duration) {
    case "thisTurn":
      return "this turn";
    case "thisBattle":
      return "this battle";
    case "untilStartOfNextTurn":
      return "until the start of the next turn";
    case "untilEndOfYourNextTurn":
      return "until the end of your next turn";
    case "untilEndOfOpponentNextTurn":
      return "until the end of the opponent's next turn";
    case "untilEndOfOpponentNextEndPhase":
      return "until the end of the opponent's next End Phase";
    case "permanent":
      return "permanently";
    default:
      return duration;
  }
}

export function candidatesForPlayAction(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  action: PlayAction,
  previousActionTargetIds: string[] = [],
): string[] | null {
  const zones = Array.isArray(action.source.zone) ? action.source.zone : [action.source.zone];
  const topDeckOnly = action.topOnly && zones.length === 1 && zones[0] === "deck";
  if (action.self) {
    const source = getInstance(state, sourceInstanceId);
    const playingSeat = action.source.player === "self" ? controller : otherSeat(controller);
    const sourceZoneMatches =
      source.zone === "resolution" ? zones.includes("hand") : zones.includes(source.zone);
    const filtersMatch = (action.filters ?? []).every((filter) => {
      const result = matchesTargetFilter(state, sourceInstanceId, sourceInstanceId, filter);
      return result.supported && result.matches;
    });
    const card = getCardForInstance(state, sourceInstanceId);
    if (
      source.controller !== playingSeat ||
      !sourceZoneMatches ||
      !filtersMatch ||
      (card.cardType !== "stage" && card.cardType !== "character") ||
      isCardPlayRestricted(state, playingSeat, sourceInstanceId, source.zone, "effect")
    ) {
      return [];
    }
    return [sourceInstanceId];
  }
  if (
    !topDeckOnly &&
    zones.some((zone) => zone !== "hand" && zone !== "trash" && zone !== "deck")
  ) {
    return null;
  }

  const pool = candidatePoolForTarget(state, controller, sourceInstanceId, {
    player: action.source.player,
    zones,
    count: action.count,
    filters: action.filters,
  });
  if (!pool.supported) {
    return null;
  }

  const previousColors = new Set(
    previousActionTargetIds.flatMap((instanceId) => getCardForInstance(state, instanceId).color),
  );
  const previousNames = new Set(
    previousActionTargetIds.flatMap((instanceId) =>
      cardNames(getCardForInstance(state, instanceId)),
    ),
  );

  const candidateIds = topDeckOnly
    ? pool.candidateIds.filter((instanceId) => instanceId === getPlayer(state, controller).deck[0])
    : pool.candidateIds;

  return candidateIds.filter((instanceId) => {
    const card = getCardForInstance(state, instanceId);
    return (
      (card.cardType === "stage" || card.cardType === "character") &&
      !isCardPlayRestricted(
        state,
        controller,
        instanceId,
        getInstance(state, instanceId).zone,
        "effect",
      ) &&
      (!action.differentColorFromPreviousCharacter ||
        (previousColors.size > 0 && card.color.every((color) => !previousColors.has(color)))) &&
      (!action.sameNameAsPreviousCard || cardNames(card).some((name) => previousNames.has(name)))
    );
  });
}

export function candidatesForGroupedPlayAction(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  action: GroupedPlayAction,
  previousActionTargetIds?: string[],
): string[] | null {
  const candidatesByGroup = action.groups.map((group) =>
    candidatesForPlayAction(state, controller, sourceInstanceId, {
      action: "play",
      source: action.source,
      count: group.count,
      filters: group.filters,
    }),
  );
  if (candidatesByGroup.some((candidateIds) => candidateIds === null)) {
    return null;
  }
  const candidates = [...new Set(candidatesByGroup.flatMap((candidateIds) => candidateIds ?? []))];
  return action.previousActionTargets
    ? candidates.filter((instanceId) => previousActionTargetIds?.includes(instanceId))
    : candidates;
}

export function selectionSatisfiesGroupedPlayAction(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  action: GroupedPlayAction,
  selectedIds: string[],
): boolean {
  const candidatesByGroup = action.groups.map((group) =>
    candidatesForPlayAction(state, controller, sourceInstanceId, {
      action: "play",
      source: action.source,
      count: group.count,
      filters: group.filters,
    }),
  );
  if (candidatesByGroup.some((candidateIds) => candidateIds === null)) {
    return false;
  }
  const maximum = action.groups.length;
  if (selectedIds.length > maximum || new Set(selectedIds).size !== selectedIds.length) {
    return false;
  }

  const assign = (selectedIndex: number, usedGroups: Set<number>): boolean => {
    if (selectedIndex === selectedIds.length) return true;
    const instanceId = selectedIds[selectedIndex]!;
    return candidatesByGroup.some((candidateIds, groupIndex) => {
      if (usedGroups.has(groupIndex) || !candidateIds?.includes(instanceId)) return false;
      const nextUsedGroups = new Set(usedGroups);
      nextUsedGroups.add(groupIndex);
      return assign(selectedIndex + 1, nextUsedGroups);
    });
  };
  return assign(0, new Set());
}

export function validActiveIdsForGroupedPlayAction(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  action: GroupedPlayAction,
  selectedIds: string[],
): string[] {
  if (
    selectedIds.length === 0 ||
    !selectionSatisfiesGroupedPlayAction(state, controller, sourceInstanceId, action, selectedIds)
  ) {
    return [];
  }
  if (selectedIds.length === 1 || !action.playStates.byGroup) return [...selectedIds];

  const candidatesByGroup = action.groups.map((group) =>
    candidatesForPlayAction(state, controller, sourceInstanceId, {
      action: "play",
      source: action.source,
      count: group.count,
      filters: group.filters,
    }),
  );

  return selectedIds.filter((activeId) => {
    const assign = (selectedIndex: number, usedGroups: Set<number>): boolean => {
      if (selectedIndex === selectedIds.length) return true;
      const instanceId = selectedIds[selectedIndex]!;
      const requiredPlayState = instanceId === activeId ? "active" : "rested";
      return candidatesByGroup.some((candidateIds, groupIndex) => {
        if (
          usedGroups.has(groupIndex) ||
          action.playStates.multiple[groupIndex] !== requiredPlayState ||
          !candidateIds?.includes(instanceId)
        ) {
          return false;
        }
        const nextUsedGroups = new Set(usedGroups);
        nextUsedGroups.add(groupIndex);
        return assign(selectedIndex + 1, nextUsedGroups);
      });
    };
    return assign(0, new Set());
  });
}

export function candidatesForRestCardsCost(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  cost: RestCardsCost,
): string[] {
  const player = getPlayer(state, controller);
  return [
    player.leaderInstanceId,
    ...player.characterArea.filter((entry): entry is string => Boolean(entry)),
    ...(player.stageArea ? [player.stageArea] : []),
  ].filter(
    (instanceId) =>
      !getInstance(state, instanceId).rested &&
      !hasFlagModifier(state, instanceId, "cannotBeRested") &&
      (cost.filters ?? []).every((filter) => {
        const result = matchesTargetFilter(state, sourceInstanceId, instanceId, filter);
        return result.supported && result.matches;
      }),
  );
}

function candidatesForCardCostOption(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  option: CardCostOption,
): string[] {
  const player = getPlayer(state, controller);
  const ids = option.zones.flatMap((zone) => {
    switch (zone) {
      case "hand":
        return player.hand;
      case "character":
        return player.characterArea.filter((entry): entry is string => Boolean(entry));
      case "stage":
        return player.stageArea ? [player.stageArea] : [];
      case "leader":
        return [player.leaderInstanceId];
      case "deck":
        return player.deck;
      case "trash":
        return player.trash;
      case "life":
        return player.life;
      case "field":
        return [
          player.leaderInstanceId,
          ...player.characterArea.filter((entry): entry is string => Boolean(entry)),
          ...(player.stageArea ? [player.stageArea] : []),
        ];
      default:
        return [];
    }
  });
  return [...new Set(ids)].filter((instanceId) =>
    (option.filters ?? []).every((filter) => {
      const result = matchesTargetFilter(state, sourceInstanceId, instanceId, filter);
      return result.supported && result.matches;
    }),
  );
}

export function candidatesForPlayCardCost(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  cost: PlayCardCost,
): string[] {
  return candidatesForCardCostOption(state, controller, sourceInstanceId, cost).filter(
    (instanceId) => {
      const card = getCardForInstance(state, instanceId);
      return (
        (card.cardType === "stage" ||
          (card.cardType === "character" && getOpenCharacterSlots(state, controller).length > 0)) &&
        !isCardPlayRestricted(
          state,
          controller,
          instanceId,
          getInstance(state, instanceId).zone,
          "effect",
        )
      );
    },
  );
}

export function candidatesForTrashCardCost(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  cost: TrashCardCost,
): string[] {
  return [
    ...new Set(
      cost.options.flatMap((option) =>
        candidatesForCardCostOption(state, controller, sourceInstanceId, option),
      ),
    ),
  ];
}

export function candidatesForKoCharacterCost(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  cost: KoCharacterCost,
): string[] {
  return getPlayer(state, controller)
    .characterArea.filter((entry): entry is string => Boolean(entry))
    .filter(
      (instanceId) =>
        !isCharacterRemovalPreventedByPermanentEffect(state, instanceId, controller) &&
        !isKoPreventedByModifier(state, instanceId, sourceInstanceId, "effect"),
    )
    .filter((instanceId) =>
      (cost.filters ?? []).every((filter) => {
        const result = matchesTargetFilter(state, sourceInstanceId, instanceId, filter);
        return result.supported && result.matches;
      }),
    );
}

export function candidatesForTrashCharacterCost(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  cost: TrashCharacterCost,
): string[] {
  return getPlayer(state, controller)
    .characterArea.filter((entry): entry is string => Boolean(entry))
    .filter(
      (instanceId) => !isCharacterRemovalPreventedByPermanentEffect(state, instanceId, controller),
    )
    .filter((instanceId) =>
      (cost.filters ?? []).every((filter) => {
        const result = matchesTargetFilter(state, sourceInstanceId, instanceId, filter);
        return result.supported && result.matches;
      }),
    );
}

export function candidatesForReturnCharacterCost(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  cost: Extract<Cost, { cost: "returnCharacter" }>,
): string[] {
  return getPlayer(state, controller)
    .characterArea.filter((entry): entry is string => Boolean(entry))
    .filter((instanceId) =>
      (cost.filters ?? []).every((filter) => {
        const result = matchesTargetFilter(state, sourceInstanceId, instanceId, filter);
        return result.supported && result.matches;
      }),
    );
}

export function candidatesForTrashFromHandCost(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  cost: TrashFromHandCost,
): string[] {
  const player = getPlayer(state, controller);
  const fieldIds = (cost.fieldZones ?? []).flatMap((zone) =>
    zone === "stage"
      ? player.stageArea
        ? [player.stageArea]
        : []
      : player.characterArea.filter((entry): entry is string => Boolean(entry)),
  );
  return [...player.hand, ...fieldIds].filter((instanceId) => {
    const filters =
      getInstance(state, instanceId).zone === "hand" ? cost.filters : cost.fieldFilters;
    return (filters ?? []).every((filter) => {
      const result = matchesTargetFilter(state, sourceInstanceId, instanceId, filter);
      return result.supported && result.matches;
    });
  });
}

export function candidatesForReturnCharacterToDeckCost(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  cost: Extract<Cost, { cost: "returnCharacterToDeck" }>,
): string[] {
  const zones = cost.zones ?? ["character"];
  const seats =
    cost.player === "both"
      ? ([controller, otherSeat(controller)] as const)
      : ([cost.player === "opponent" ? otherSeat(controller) : controller] as const);
  return seats.flatMap((seat) => {
    const player = getPlayer(state, seat);
    const candidates = zones.flatMap((zone) =>
      zone === "stage"
        ? player.stageArea
          ? [player.stageArea]
          : []
        : player.characterArea.filter((entry): entry is string => Boolean(entry)),
    );
    return candidates.filter((instanceId) =>
      (cost.filters ?? []).every((filter) => {
        const result = matchesTargetFilter(state, sourceInstanceId, instanceId, filter);
        return result.supported && result.matches;
      }),
    );
  });
}

export function candidatesForReturnTrashToDeckCost(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  cost: Extract<Cost, { cost: "returnTrashToDeck" }>,
): string[] {
  return getPlayer(state, controller).trash.filter((instanceId) =>
    (cost.filters ?? []).every((filter) => {
      const result = matchesTargetFilter(state, sourceInstanceId, instanceId, filter);
      return result.supported && result.matches;
    }),
  );
}

export function returnDonCostOptions(
  state: MatchState,
  controller: MatchSeat,
): Array<{ id: string; label: string }> {
  const player = getPlayer(state, controller);
  const options = [
    ...Array.from({ length: player.activeDon }, (_, index) => ({
      id: `active-don:${index}`,
      label: `Active DON!! in cost area ${index + 1}`,
    })),
    ...Array.from({ length: player.restedDon }, (_, index) => ({
      id: `rested-don:${index}`,
      label: `Rested DON!! in cost area ${index + 1}`,
    })),
  ];
  const attachedTargets = [
    player.leaderInstanceId,
    ...player.characterArea.filter((entry): entry is string => Boolean(entry)),
  ];
  for (const instanceId of attachedTargets) {
    const instance = getInstance(state, instanceId);
    for (let index = 0; index < instance.attachedDon; index += 1) {
      options.push({
        id: `attached-don:${instanceId}:${index}`,
        label: `DON!! attached to ${cardName(getCardForInstance(state, instanceId))} ${index + 1}`,
      });
    }
  }
  return options;
}

export function returnSelectedDonToDeck(
  state: MatchState,
  seat: MatchSeat,
  selectedIds: string[],
  sourceInstanceId?: string,
  effectController?: MatchSeat,
): void {
  const player = getPlayer(state, seat);
  const orderedIds = [...selectedIds].sort((left, right) => {
    const leftIndex = left.startsWith("rested-don:")
      ? Number(left.slice("rested-don:".length))
      : -1;
    const rightIndex = right.startsWith("rested-don:")
      ? Number(right.slice("rested-don:".length))
      : -1;
    return rightIndex - leftIndex;
  });
  for (const id of orderedIds) {
    if (id.startsWith("active-don:")) {
      player.activeDon -= 1;
    } else if (id.startsWith("rested-don:")) {
      const returnedIndex = Number(id.slice("rested-don:".length));
      for (const modifier of Object.values(state.modifiers)) {
        const match = new RegExp(`^rested-don:${seat}:(\\d+)$`).exec(modifier.targetId);
        if (modifier.type !== "flag" || modifier.flag !== "freezeDon" || !match) continue;
        const frozenIndex = Number(match[1]);
        if (frozenIndex === returnedIndex) {
          delete state.modifiers[modifier.id];
        } else if (frozenIndex > returnedIndex) {
          modifier.targetId = `rested-don:${seat}:${frozenIndex - 1}`;
        }
      }
      player.restedDon -= 1;
    } else if (id.startsWith("attached-don:")) {
      const instanceId = id.slice("attached-don:".length, id.lastIndexOf(":"));
      getInstance(state, instanceId).attachedDon -= 1;
    }
    player.donDeckCount += 1;
  }
  if (selectedIds.length > 0) {
    const triggerEvent =
      sourceInstanceId && effectController
        ? { instanceId: sourceInstanceId, effectController, amount: selectedIds.length }
        : undefined;
    enqueueInPlayEffectsForTrigger(state, "whenDonReturned", triggerEvent, [seat]);
  }
}

export function playCardFromEffect(
  state: MatchState,
  controller: MatchSeat,
  instanceId: string,
  playState: PlayAction["playState"],
  effectSourceInstanceId: string,
  options: { deferOnPlay?: boolean } = {},
): boolean {
  const instance = getInstance(state, instanceId);
  const card = getCardForInstance(state, instanceId);
  if (isCardPlayRestricted(state, controller, instanceId, instance.zone, "effect")) {
    return false;
  }
  const fromZone = instance.zone;
  if (instance.controller !== controller) {
    return false;
  }

  if (card.cardType === "character") {
    const slotIndex = getOpenCharacterSlots(state, controller)[0];
    if (slotIndex === undefined) {
      return false;
    }
    if (fromZone === "hand") {
      consumeNextPlayCostModifiers(state, instanceId);
    }
    moveCard(state, instanceId, controller, "character", {
      slotIndex,
      faceUp: true,
      publicKnowledge: true,
      actor: controller,
    });
    const played = getInstance(state, instanceId);
    played.playedOnTurn = state.turnNumber;
    played.rested =
      playState === "rested" || isPlayedRestedByPermanentEffect(state, controller, instanceId);
  } else if (card.cardType === "stage") {
    const existingStage = getPlayer(state, controller).stageArea;
    if (existingStage) {
      moveCard(state, existingStage, getInstance(state, existingStage).owner, "trash", {
        faceUp: true,
        publicKnowledge: true,
        actor: controller,
      });
    }
    moveCard(state, instanceId, controller, "stage", {
      faceUp: true,
      publicKnowledge: true,
      actor: controller,
    });
    getInstance(state, instanceId).rested = playState === "rested";
  } else {
    return false;
  }

  emitEvent(state, "cardPlayed", controller, {
    sourceCardId: card.id,
    sourceInstanceId: instanceId,
    visibility: "public",
  });
  emitLog(
    state,
    controller,
    `${getPlayer(state, controller).playerName} plays ${cardName(card)}.`,
    {
      sourceCardId: card.id,
      sourceInstanceId: instanceId,
      visibility: "public",
    },
  );
  if (!options.deferOnPlay) {
    for (const [blockIndex] of effectBlocksForInstance(state, instanceId, "onPlay").entries()) {
      enqueueResolution(state, {
        kind: "effectBlock",
        sourceInstanceId: instanceId,
        controller,
        trigger: "onPlay",
        blockIndex,
      });
    }
  }
  if (card.cardType === "character") {
    const triggerEvent = {
      instanceId,
      effectController: controller,
      fromZone,
      sourceInstanceId: effectSourceInstanceId,
      sourceFromZone: getInstance(state, effectSourceInstanceId).zone,
    };
    enqueueInPlayEffectsForTrigger(state, "whenYouPlayCharacter", triggerEvent, [controller]);
    enqueueInPlayEffectsForTrigger(state, "whenOpponentPlaysCharacter", triggerEvent, [
      otherSeat(controller),
    ]);
    if (card.trigger || effectBlocksFor(card, "trigger").length > 0) {
      enqueueInPlayEffectsForTrigger(state, "whenTriggerCharacterPlayed", triggerEvent, [
        controller,
      ]);
    }
  }
  return true;
}

function promptForTargetSelection(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  action: Action,
  candidateIds: string[],
  previousActionTargetIds?: string[],
) {
  const sourceCard = getCardForInstance(state, sourceInstanceId);
  const target = "target" in action ? action.target : null;
  const chooser = target?.chosenBy === "opponent" ? otherSeat(controller) : controller;
  const orderedCandidateIds = randomizedConcealedHandOrder(
    state,
    sourceInstanceId,
    chooser,
    candidateIds,
    "target-selection",
  );
  let hiddenHandIndex = 0;
  const opaqueCandidateIds: Record<string, string> = {};
  const options: PromptOption[] = orderedCandidateIds.map((instanceId) => {
    const instance = getInstance(state, instanceId);
    const concealedFromChooser = instance.zone === "hand" && instance.controller !== chooser;
    if (concealedFromChooser) {
      hiddenHandIndex += 1;
    }
    const optionId = concealedFromChooser ? `hidden-card:${hiddenHandIndex}` : instanceId;
    if (concealedFromChooser) {
      opaqueCandidateIds[optionId] = instanceId;
    }
    return {
      id: optionId,
      label: concealedFromChooser
        ? `Card ${hiddenHandIndex}`
        : cardName(getCardForInstance(state, instanceId)),
      value: optionId,
      ...(!concealedFromChooser && { targetId: instanceId }),
    };
  });
  const maximum =
    target?.count.amount === "all" || target?.count.amount === undefined
      ? options.length
      : Math.min(target.count.amount, options.length);
  createChoicePrompt(state, {
    choiceKind: "selectTargets",
    seat: chooser,
    label: `${cardName(sourceCard)} needs a target`,
    details: "Choose valid targets to continue resolving the effect.",
    sourceCardId: sourceCard.id,
    sourceInstanceId,
    eventId: null,
    options,
    minSelections: target?.count.upTo ? 0 : maximum,
    maxSelections: maximum,
    context: {
      action: action.action,
    },
    resolutionContext: {
      intent: "effectTargetSelection",
      sourceInstanceId,
      controller,
      action,
      previousActionTargetIds,
      ...(Object.keys(opaqueCandidateIds).length > 0 && { opaqueCandidateIds }),
    },
  });
}

function resolveActionTargets(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  action: Action,
  selectedTargetIds: string[] | undefined,
  previousActionTargetIds?: string[],
): string[] | null | "prompt" {
  if (!("target" in action) || !action.target || selectedTargetIds) {
    return selectedTargetIds ?? [];
  }

  const targetIds = candidatesForTarget(state, controller, sourceInstanceId, action.target);
  if (targetIds === null) {
    const candidateSeat = action.target.player === "self" ? controller : otherSeat(controller);
    const candidatePlayer = getPlayer(state, candidateSeat);
    const pool = candidatePoolForTarget(state, controller, sourceInstanceId, action.target);
    const candidateIds = pool.supported
      ? pool.candidateIds
      : [
          candidatePlayer.leaderInstanceId,
          ...candidatePlayer.characterArea.filter((entry): entry is string => Boolean(entry)),
          ...(candidatePlayer.stageArea ? [candidatePlayer.stageArea] : []),
          ...candidatePlayer.hand,
          ...candidatePlayer.trash,
          ...candidatePlayer.life,
          ...candidatePlayer.deck,
        ];
    const eligibleCandidateIds = candidateIds.filter((instanceId) =>
      actionTargetIsEligible(state, action, instanceId, sourceInstanceId),
    );
    promptForTargetSelection(
      state,
      controller,
      sourceInstanceId,
      action,
      eligibleCandidateIds,
      previousActionTargetIds,
    );
    return "prompt";
  }

  return targetIds.filter((instanceId) =>
    actionTargetIsEligible(state, action, instanceId, sourceInstanceId),
  );
}

export function freezeActionCandidateIds(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  action: Extract<Action, { action: "freeze" }>,
): string[] {
  const fieldZones = action.target.zones.filter((zone) => zone !== "costArea");
  const fieldCandidates =
    fieldZones.length === 0
      ? []
      : candidatePoolForTarget(state, controller, sourceInstanceId, {
          ...action.target,
          zones: fieldZones,
        }).candidateIds.filter((instanceId) =>
          actionTargetIsEligible(state, action, instanceId, sourceInstanceId),
        );
  if (!action.target.zones.includes("costArea")) {
    return fieldCandidates;
  }
  const seats =
    action.target.player === "both" || action.target.player === "any"
      ? ([controller, otherSeat(controller)] as const)
      : ([action.target.player === "self" ? controller : otherSeat(controller)] as const);
  const donFiltersSupported = (action.target.filters ?? []).every(
    (filter) => filter.filter === "state" && filter.value === "rested",
  );
  const donCandidates = donFiltersSupported
    ? seats.flatMap((seat) =>
        Array.from(
          { length: getPlayer(state, seat).restedDon },
          (_, index) => `rested-don:${seat}:${index}`,
        ),
      )
    : [];
  return [...fieldCandidates, ...donCandidates];
}

export function actionTargetIsEligible(
  state: MatchState,
  action: Action,
  instanceId: string,
  sourceInstanceId: string,
): boolean {
  if (
    ["ko", "returnToHand", "returnToDeck", "trashFromField", "addToLife"].includes(action.action) &&
    getInstance(state, instanceId).zone === "character" &&
    isCharacterRemovalPreventedByPermanentEffect(
      state,
      instanceId,
      getInstance(state, sourceInstanceId).controller,
    )
  ) {
    return false;
  }
  if (
    action.action === "ko" &&
    isKoPreventedByModifier(state, instanceId, sourceInstanceId, "effect")
  ) {
    return false;
  }
  if (
    action.action === "rest" &&
    (getInstance(state, instanceId).rested ||
      hasFlagModifier(state, instanceId, "cannotBeRested") ||
      isRestPreventedByPermanentEffect(state, instanceId, sourceInstanceId))
  ) {
    return false;
  }
  if (
    action.action === "cannotActivate" &&
    action.requiresKeyword &&
    !getKeywords(state, instanceId).has(action.keyword)
  ) {
    return false;
  }
  return true;
}

export function promptForRearrangeDeckOrder(
  state: MatchState,
  sourceInstanceId: string,
  controller: MatchSeat,
  action: Extract<Action, { action: "rearrangeDeck" }>,
  lookedIds: string[],
) {
  if (lookedIds.length === 0) {
    return;
  }
  createChoicePrompt(state, {
    choiceKind: "orderCards",
    seat: controller,
    label: `${effectSourceName(state, sourceInstanceId)} orders cards from the deck`,
    details: `Order the ${lookedIds.length} looked-at card(s) from first to last.`,
    sourceCardId: getInstance(state, sourceInstanceId).cardId,
    sourceInstanceId,
    eventId: null,
    options: lookedIds.map((instanceId) => ({
      id: instanceId,
      label: cardName(getCardForInstance(state, instanceId)),
      value: instanceId,
      targetId: instanceId,
    })),
    minSelections: lookedIds.length,
    maxSelections: lookedIds.length,
    context: { action: "rearrangeDeck", ordered: true },
    resolutionContext: {
      intent: "effectRearrangeDeckOrder",
      sourceInstanceId,
      controller,
      action,
      lookedIds,
    },
  });
}

export function processEffectAction(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  action: Action,
  selectedTargetIds?: string[],
  previousActionTargetIds?: string[],
  skipRemovalReplacementIds?: string[],
  returnToDeckContinuation?: ReturnToDeckContinuation,
): boolean {
  switch (action.action) {
    case "sequence":
      for (const nestedAction of [...action.actions].reverse()) {
        enqueueResolution(
          state,
          {
            kind: "effectAction",
            sourceInstanceId,
            controller,
            action: nestedAction,
            previousActionTargetIds,
          },
          { next: true },
        );
      }
      return true;
    case "optional":
      createChoicePrompt(state, {
        choiceKind: "confirm",
        seat: controller,
        label: `${effectSourceName(state, sourceInstanceId)} has an optional action`,
        details: "Resolve the optional action?",
        sourceCardId: getInstance(state, sourceInstanceId).cardId,
        sourceInstanceId,
        eventId: null,
        options: [
          { id: "yes", label: "Resolve", value: "yes" },
          { id: "no", label: "Skip", value: "no" },
        ],
        minSelections: 0,
        maxSelections: 1,
        context: { action: "optional" },
        resolutionContext: {
          intent: "effectActionOptional",
          sourceInstanceId,
          controller,
          actions: action.actions,
          previousActionTargetIds,
        },
      });
      return false;
    case "delayed":
      if (action.timing === "endOfThisBattle" && !state.battle) {
        return false;
      }
      for (const nestedAction of action.actions) {
        state.delayedEffectActions.push({
          sourceInstanceId,
          controller,
          action: nestedAction,
          scheduledTurn: state.turnNumber,
          ...(previousActionTargetIds && { previousActionTargetIds }),
          ...(delayedActionMovesSource(nestedAction) && {
            sourceZoneChangeCounter: getInstance(state, sourceInstanceId).zoneChangeCounter,
          }),
          ...(action.timing === "endOfThisBattle" && {
            scheduledBattleId: state.battle!.id,
          }),
          ...(action.timing === "startOfOpponentNextMainPhase" && {
            scheduledPhase: "main" as const,
            scheduledSeat: otherSeat(controller),
          }),
        });
      }
      return true;
    case "modifyCounter":
      // Counter modifiers are continuous effects evaluated from their source card.
      return false;
    case "draw": {
      const resolvedAmount = action.amountFromTarget
        ? resolveAmountFromTarget(state, controller, sourceInstanceId, action.amountFromTarget)
        : action.amount;
      if (resolvedAmount === null) {
        return false;
      }
      const resolvedAction = { ...action, amount: resolvedAmount };
      {
        const drawingSeat = resolvedAction.player === "self" ? controller : otherSeat(controller);
        if (
          drawingSeat === controller &&
          hasFlagModifier(
            state,
            getPlayer(state, drawingSeat).leaderInstanceId,
            "cannotDrawByOwnEffects",
          )
        ) {
          return true;
        }
      }
      if (resolvedAction.upTo) {
        createChoicePrompt(state, {
          choiceKind: "chooseOption",
          seat: controller,
          label: `${effectSourceName(state, sourceInstanceId)} may draw cards`,
          details: `Choose how many cards to draw, up to ${resolvedAction.amount}.`,
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          eventId: null,
          options: Array.from({ length: resolvedAction.amount + 1 }, (_, count) => ({
            id: String(count),
            label: String(count),
            value: String(count),
          })),
          minSelections: 1,
          maxSelections: 1,
          context: { action: "draw", resource: "deck" },
          resolutionContext: {
            intent: "effectDrawCount",
            sourceInstanceId,
            controller,
            action: resolvedAction,
            maximum: resolvedAction.amount,
          },
        });
        return false;
      }
      drawCards(
        state,
        resolvedAction.player === "self" ? controller : otherSeat(controller),
        resolvedAction.untilHandSize === undefined
          ? resolvedAction.amount
          : Math.max(
              0,
              resolvedAction.untilHandSize -
                getPlayer(
                  state,
                  resolvedAction.player === "self" ? controller : otherSeat(controller),
                ).hand.length,
            ),
        `${cardName(getCardForInstance(state, sourceInstanceId))} resolves`,
      );
      return true;
    }
    case "trashFromHand": {
      const seat = action.player === "self" ? controller : otherSeat(controller);
      const choiceSeat = action.chosenBy
        ? action.chosenBy === "self"
          ? controller
          : otherSeat(controller)
        : seat;
      const player = getPlayer(state, seat);
      const targetDerivedAmount = action.amountFromTarget
        ? resolveAmountFromTarget(state, controller, sourceInstanceId, action.amountFromTarget)
        : null;
      if (action.amountFromTarget && targetDerivedAmount === null) {
        return false;
      }
      const previousActionAmount = action.amountFromPreviousActionTargets
        ? (previousActionTargetIds?.length ?? 0)
        : null;
      const resolvedAction =
        previousActionAmount !== null
          ? {
              ...action,
              amount: previousActionAmount,
              amountFromPreviousActionTargets: undefined,
            }
          : targetDerivedAmount === null
            ? action
            : { ...action, amount: targetDerivedAmount, amountFromTarget: undefined };
      const pool = resolvedAction.filters
        ? player.hand.filter((instanceId) =>
            resolvedAction.filters!.every((filter) => {
              const result = matchesTargetFilter(state, sourceInstanceId, instanceId, filter);
              return result.supported && result.matches;
            }),
          )
        : player.hand;
      const requestedAmount =
        resolvedAction.untilHandSize === undefined
          ? resolvedAction.amount === "all"
            ? pool.length
            : resolvedAction.amount
          : Math.max(0, player.hand.length - resolvedAction.untilHandSize);
      const maximum = Math.min(requestedAmount, pool.length);
      const minimum = resolvedAction.upTo ? 0 : maximum;
      if (selectedTargetIds === undefined) {
        if (maximum === 0) {
          return true;
        }
        if (!resolvedAction.upTo && maximum === pool.length) {
          selectedTargetIds = [...pool];
        } else {
          const concealFromChooser = choiceSeat !== seat;
          const orderedPool = concealFromChooser
            ? randomizedConcealedHandOrder(
                state,
                sourceInstanceId,
                choiceSeat,
                pool,
                "trash-from-hand",
              )
            : pool;
          const opaqueCandidateIds = concealFromChooser
            ? Object.fromEntries(
                orderedPool.map((instanceId, index) => [`hidden-card:${index + 1}`, instanceId]),
              )
            : undefined;
          createChoicePrompt(state, {
            choiceKind: "selectCards",
            seat: choiceSeat,
            label: `${effectSourceName(state, sourceInstanceId)} trashes from hand`,
            details: resolvedAction.upTo
              ? resolvedAction.amount === "all"
                ? "Choose any number of eligible cards to trash from hand."
                : `Choose up to ${resolvedAction.amount} card(s) to trash from hand.`
              : `Choose ${maximum} card(s) to trash from hand.`,
            sourceCardId: getInstance(state, sourceInstanceId).cardId,
            sourceInstanceId,
            eventId: null,
            options: orderedPool.map((instanceId, index) => ({
              id: concealFromChooser ? `hidden-card:${index + 1}` : instanceId,
              label: !concealFromChooser
                ? cardName(getCardForInstance(state, instanceId))
                : `Card ${index + 1}`,
              value: concealFromChooser ? `hidden-card:${index + 1}` : instanceId,
              ...(!concealFromChooser && { targetId: instanceId }),
            })),
            minSelections: minimum,
            maxSelections: maximum,
            context: {
              action: "trashFromHand",
            },
            resolutionContext: {
              intent: "effectTrashFromHandSelection",
              sourceInstanceId,
              controller,
              seat,
              action: resolvedAction,
              candidateIds: pool,
              ...(opaqueCandidateIds && { opaqueCandidateIds }),
            },
          });
          return false;
        }
      }
      const selected = selectedTargetIds;
      for (const instanceId of selected) {
        moveCard(state, instanceId, getInstance(state, instanceId).owner, "trash", {
          faceUp: true,
          publicKnowledge: true,
          actor: controller,
          visibility: "private",
        });
      }
      emitLog(
        state,
        controller,
        `${getPlayer(state, seat).playerName} trashes ${selected.length} card${selected.length === 1 ? "" : "s"} from hand.`,
        {
          visibility: "private",
          privateMessages: {
            [seat]: `You trashed ${formatCardList(state, selected)}.`,
          },
          judgeMessage: `${getPlayer(state, seat).playerName} trashes ${formatCardList(state, selected)} from hand.`,
        },
      );
      if (selected.length > 0) {
        const triggerEvent = {
          instanceId: selected[0]!,
          effectController: controller,
          amount: selected.length,
          sourceInstanceId,
        };
        enqueueInPlayEffectsForTrigger(state, "whenCardTrashedFromHandByEffect", triggerEvent);
        enqueueInPlayEffectsForTrigger(state, "whenCardsTrashedFromHandByEffect", triggerEvent);
      }
      return true;
    }
    case "trashFromHandUntil":
      return processEffectAction(
        state,
        controller,
        sourceInstanceId,
        {
          action: "trashFromHand",
          player: action.player,
          amount: "all",
          untilHandSize: action.handSize,
          condition: action.condition,
        },
        selectedTargetIds,
        previousActionTargetIds,
      );
    case "revealFromHand": {
      const seat = action.player === "self" ? controller : otherSeat(controller);
      const choiceSeat = action.chosenBy
        ? action.chosenBy === "self"
          ? controller
          : otherSeat(controller)
        : seat;
      const player = getPlayer(state, seat);
      const candidateIds = player.hand.filter((instanceId) =>
        (action.filters ?? []).every((filter) => {
          const result = matchesTargetFilter(state, sourceInstanceId, instanceId, filter);
          return result.supported && result.matches;
        }),
      );
      if (action.amount !== "all" && !action.upTo && candidateIds.length < action.amount) {
        return true;
      }
      const maximum =
        action.amount === "all"
          ? candidateIds.length
          : Math.min(action.amount, candidateIds.length);
      if (selectedTargetIds === undefined) {
        if (maximum === 0) {
          return true;
        }
        if (action.amount === "all") {
          selectedTargetIds = [...candidateIds];
        } else if (!action.upTo && candidateIds.length === 1 && maximum === 1) {
          selectedTargetIds = [candidateIds[0]!];
        } else {
          const concealFromChooser = choiceSeat !== seat;
          const orderedHand = concealFromChooser
            ? randomizedConcealedHandOrder(
                state,
                sourceInstanceId,
                choiceSeat,
                player.hand,
                "reveal-from-hand",
              )
            : player.hand;
          const opaqueCandidateIds = concealFromChooser
            ? Object.fromEntries(
                orderedHand.map((instanceId, index) => [`hidden-card:${index + 1}`, instanceId]),
              )
            : undefined;
          createChoicePrompt(state, {
            choiceKind: "selectCards",
            seat: choiceSeat,
            label: `${effectSourceName(state, sourceInstanceId)} reveals from hand`,
            details: `Choose ${maximum} card(s) to reveal from hand.`,
            sourceCardId: getInstance(state, sourceInstanceId).cardId,
            sourceInstanceId,
            eventId: null,
            options: orderedHand
              .filter((instanceId) => candidateIds.includes(instanceId))
              .map((instanceId, index) => ({
                id: concealFromChooser ? `hidden-card:${index + 1}` : instanceId,
                label: !concealFromChooser
                  ? cardName(getCardForInstance(state, instanceId))
                  : `Card ${index + 1}`,
                value: concealFromChooser ? `hidden-card:${index + 1}` : instanceId,
                ...(!concealFromChooser && { targetId: instanceId }),
              })),
            minSelections: action.upTo ? 0 : maximum,
            maxSelections: maximum,
            context: { action: "revealFromHand" },
            resolutionContext: {
              intent: "effectRevealFromHandSelection",
              sourceInstanceId,
              controller,
              seat,
              action,
              candidateIds,
              ...(opaqueCandidateIds && { opaqueCandidateIds }),
            },
          });
          return false;
        }
      }
      const selected = selectedTargetIds;
      if (
        selected.length > maximum ||
        (!action.upTo && selected.length !== maximum) ||
        new Set(selected).size !== selected.length ||
        selected.some((instanceId) => !candidateIds.includes(instanceId))
      ) {
        return false;
      }
      for (const instanceId of selected) {
        getInstance(state, instanceId).publicKnowledge = true;
      }
      emitLog(
        state,
        controller,
        `${getPlayer(state, seat).playerName} reveals ${formatCardList(state, selected)} from hand.`,
        {
          targetIds: selected,
          visibility: "public",
        },
      );
      for (const instanceId of selected) {
        getInstance(state, instanceId).publicKnowledge = false;
      }
      const followUp = action.ifRevealedCardMatches;
      const matches =
        selected.some((instanceId) =>
          (followUp?.filters ?? []).every((filter) => {
            const result = matchesTargetFilter(state, sourceInstanceId, instanceId, filter);
            return result.supported && result.matches;
          }),
        ) && followUp !== undefined;
      if (followUp && matches) {
        for (const nestedAction of [...followUp!.actions].reverse()) {
          enqueueResolution(
            state,
            {
              kind: "effectAction",
              sourceInstanceId,
              controller,
              action: nestedAction,
            },
            { next: true },
          );
        }
      }
      for (const nestedAction of [...(action.thenActions ?? [])].reverse()) {
        enqueueResolution(
          state,
          {
            kind: "effectAction",
            sourceInstanceId,
            controller,
            action: nestedAction,
            previousActionTargetIds: selected,
          },
          { next: true },
        );
      }
      return true;
    }
    case "modifyPower": {
      const targetIds = action.previousActionTargets
        ? (previousActionTargetIds ?? []).filter((instanceId) => {
            const pool = candidatePoolForTarget(state, controller, sourceInstanceId, action.target);
            return pool.supported && pool.candidateIds.includes(instanceId);
          })
        : resolveActionTargets(
            state,
            controller,
            sourceInstanceId,
            action,
            selectedTargetIds,
            previousActionTargetIds,
          );
      if (targetIds === "prompt" || !targetIds) {
        return false;
      }
      const cardGroupPool = action.valuePerCardGroup
        ? candidatePoolForTarget(
            state,
            controller,
            sourceInstanceId,
            action.valuePerCardGroup.target,
          )
        : undefined;
      const modifierValue = action.restedDonGroupSize
        ? Math.floor(getPlayer(state, controller).restedDon / action.restedDonGroupSize) *
          action.value
        : action.valuePerCardGroup && cardGroupPool?.supported
          ? Math.floor(cardGroupPool.candidateIds.length / action.valuePerCardGroup.size) *
            action.value
          : action.value +
            (action.valuePerPreviousActionTarget ?? 0) *
              Math.floor(
                (previousActionTargetIds?.length ?? 0) /
                  (action.previousActionTargetGroupSize ?? 1),
              );
      for (const [targetIndex, targetId] of targetIds.entries()) {
        const targetModifierValue = action.distributedValues?.[targetIndex] ?? modifierValue;
        addModifier(state, sourceInstanceId, targetId, {
          type: "power",
          value: targetModifierValue,
          duration: action.duration,
          expiresAtTurn:
            action.duration === "thisTurn"
              ? state.turnNumber
              : action.duration === "untilEndOfYourNextTurn"
                ? state.turnNumber + 1
                : action.duration === "untilEndOfOpponentNextTurn" ||
                    action.duration === "untilEndOfOpponentNextEndPhase"
                  ? state.turnNumber + 1
                  : null,
          expiresAtBattleId: action.duration === "thisBattle" ? (state.battle?.id ?? null) : null,
          expiresOnTurnStartOfSeat: action.duration === "untilStartOfNextTurn" ? controller : null,
        });
      }
      emitLog(
        state,
        controller,
        action.distributedValues
          ? `${effectSourceName(state, sourceInstanceId)} gives ${targetNames(state, targetIds)} distributed power modifiers ${action.distributedValues.slice(0, targetIds.length).join(", ")} ${durationLabel(action.duration)}.`
          : `${effectSourceName(state, sourceInstanceId)} gives ${targetNames(state, targetIds)} ${modifierValue >= 0 ? "+" : ""}${modifierValue} power ${durationLabel(action.duration)}.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          targetIds,
          visibility: "public",
        },
      );
      return true;
    }
    case "swapBasePower": {
      const resolvedTargetIds = resolveActionTargets(
        state,
        controller,
        sourceInstanceId,
        action,
        selectedTargetIds,
        previousActionTargetIds,
      );
      if (resolvedTargetIds === "prompt" || !resolvedTargetIds) {
        return false;
      }
      const pairedTargetIds = action.pairedTarget
        ? candidatesForTarget(state, controller, sourceInstanceId, action.pairedTarget)
        : [];
      const targetIds = action.pairedTarget
        ? [resolvedTargetIds[0], ...(pairedTargetIds ?? []).slice(0, 1)].filter(
            (instanceId): instanceId is string => Boolean(instanceId),
          )
        : resolvedTargetIds;
      if (targetIds.length !== 2) {
        return true;
      }
      const [firstId, secondId] = targetIds;
      const firstPower = basePower(getCardForInstance(state, firstId!));
      const secondPower = basePower(getCardForInstance(state, secondId!));
      for (const [targetId, value] of [
        [firstId!, secondPower - firstPower],
        [secondId!, firstPower - secondPower],
      ] as const) {
        addModifier(state, sourceInstanceId, targetId, {
          type: "power",
          value,
          duration: action.duration,
          expiresAtTurn: action.duration === "thisTurn" ? state.turnNumber : null,
          expiresAtBattleId: action.duration === "thisBattle" ? (state.battle?.id ?? null) : null,
          expiresOnTurnStartOfSeat: action.duration === "untilStartOfNextTurn" ? controller : null,
        });
      }
      emitLog(
        state,
        controller,
        `${effectSourceName(state, sourceInstanceId)} swaps the base power of ${targetNames(state, targetIds)} ${durationLabel(action.duration)}.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          targetIds,
          visibility: "public",
        },
      );
      return true;
    }
    case "setBasePowerFrom": {
      const targetIds = resolveActionTargets(
        state,
        controller,
        sourceInstanceId,
        action,
        selectedTargetIds,
        previousActionTargetIds,
      );
      if (targetIds === "prompt" || !targetIds) {
        return false;
      }
      const sourceIds = candidatesForTarget(state, controller, sourceInstanceId, action.source);
      if (!sourceIds || sourceIds.length !== 1) {
        enqueueJudgePrompt(
          state,
          sourceInstanceId,
          "Judge review: base-power source",
          "Setting base power from another card requires exactly one source card.",
        );
        return false;
      }
      const copiedBasePower = basePower(getCardForInstance(state, sourceIds[0]!));
      for (const targetId of targetIds) {
        const printedBasePower = basePower(getCardForInstance(state, targetId));
        addModifier(state, sourceInstanceId, targetId, {
          type: "power",
          value: copiedBasePower - printedBasePower,
          duration: action.duration,
          expiresAtTurn: action.duration === "thisTurn" ? state.turnNumber : null,
          expiresAtBattleId: action.duration === "thisBattle" ? (state.battle?.id ?? null) : null,
          expiresOnTurnStartOfSeat: action.duration === "untilStartOfNextTurn" ? controller : null,
        });
      }
      emitLog(
        state,
        controller,
        `${effectSourceName(state, sourceInstanceId)} sets the base power of ${targetNames(state, targetIds)} from ${targetNames(state, sourceIds)} ${durationLabel(action.duration)}.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          targetIds: [...targetIds, ...sourceIds],
          visibility: "public",
        },
      );
      return true;
    }
    case "copyPower": {
      const targetIds = resolveActionTargets(
        state,
        controller,
        sourceInstanceId,
        action,
        selectedTargetIds,
        previousActionTargetIds,
      );
      if (targetIds === "prompt" || !targetIds) {
        return false;
      }
      const copiedFromId = targetIds[0];
      if (!copiedFromId) {
        return true;
      }
      const copiedPower = getCardPower(state, copiedFromId);
      const sourceBasePower = basePower(getCardForInstance(state, sourceInstanceId));
      addModifier(state, sourceInstanceId, sourceInstanceId, {
        type: "power",
        value: copiedPower - sourceBasePower,
        duration: action.duration,
        expiresAtTurn: action.duration === "thisTurn" ? state.turnNumber : null,
        expiresAtBattleId: action.duration === "thisBattle" ? (state.battle?.id ?? null) : null,
        expiresOnTurnStartOfSeat: action.duration === "untilStartOfNextTurn" ? controller : null,
      });
      emitLog(
        state,
        controller,
        `${effectSourceName(state, sourceInstanceId)} sets its base power to ${copiedPower} from ${cardName(getCardForInstance(state, copiedFromId))} ${durationLabel(action.duration)}.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          targetIds: [sourceInstanceId, copiedFromId],
          visibility: "public",
        },
      );
      return true;
    }
    case "grantKeyword": {
      const targetIds = action.previousActionTargets
        ? (previousActionTargetIds ?? []).filter((instanceId) => {
            const pool = candidatePoolForTarget(state, controller, sourceInstanceId, action.target);
            return pool.supported && pool.candidateIds.includes(instanceId);
          })
        : resolveActionTargets(state, controller, sourceInstanceId, action, selectedTargetIds);
      if (targetIds === "prompt" || !targetIds) {
        return false;
      }
      for (const targetId of targetIds) {
        addModifier(state, sourceInstanceId, targetId, {
          type: "keyword",
          keyword: action.keyword,
          duration: action.duration,
          expiresAtTurn:
            action.duration === "thisTurn"
              ? state.turnNumber
              : action.duration === "untilEndOfYourNextTurn" ||
                  action.duration === "untilEndOfOpponentNextTurn" ||
                  action.duration === "untilEndOfOpponentNextEndPhase"
                ? state.turnNumber + 1
                : null,
          expiresAtBattleId: action.duration === "thisBattle" ? (state.battle?.id ?? null) : null,
          expiresOnTurnStartOfSeat: action.duration === "untilStartOfNextTurn" ? controller : null,
        });
      }
      emitLog(
        state,
        controller,
        `${effectSourceName(state, sourceInstanceId)} gives ${targetNames(state, targetIds)} [${action.keyword}] ${durationLabel(action.duration)}.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          targetIds,
          visibility: "public",
        },
      );
      return true;
    }
    case "modifyCost": {
      const duration = action.duration ?? "permanent";
      const targetIds = resolveActionTargets(
        state,
        controller,
        sourceInstanceId,
        action,
        selectedTargetIds,
      );
      if (targetIds === "prompt" || !targetIds) {
        return false;
      }
      for (const targetId of targetIds) {
        addModifier(state, sourceInstanceId, targetId, {
          type: "cost",
          value: action.value,
          consumeOnPlay: action.consumeOnPlay,
          duration,
          expiresAtTurn:
            duration === "thisTurn"
              ? state.turnNumber
              : duration === "untilEndOfOpponentNextTurn" ||
                  duration === "untilEndOfOpponentNextEndPhase"
                ? state.turnNumber + 1
                : null,
          expiresAtBattleId: null,
          expiresOnTurnStartOfSeat: duration === "untilStartOfNextTurn" ? controller : null,
        });
      }
      emitLog(
        state,
        controller,
        `${effectSourceName(state, sourceInstanceId)} gives ${targetNames(state, targetIds)} ${action.value >= 0 ? "+" : ""}${action.value} cost ${durationLabel(duration)}.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          targetIds,
          visibility: "public",
        },
      );
      return true;
    }
    case "setCost": {
      const targetIds = resolveActionTargets(
        state,
        controller,
        sourceInstanceId,
        action,
        selectedTargetIds,
      );
      if (targetIds === "prompt" || !targetIds) {
        return false;
      }
      const duration = action.duration ?? "permanent";
      for (const targetId of targetIds) {
        addModifier(state, sourceInstanceId, targetId, {
          type: "cost",
          value: action.value - getCardCost(state, targetId),
          duration,
          expiresAtTurn: duration === "thisTurn" ? state.turnNumber : null,
          expiresAtBattleId: duration === "thisBattle" ? (state.battle?.id ?? null) : null,
          expiresOnTurnStartOfSeat: duration === "untilStartOfNextTurn" ? controller : null,
        });
      }
      return true;
    }
    case "ko": {
      const targetIds = action.previousActionTargets
        ? (previousActionTargetIds ?? []).filter((instanceId) => {
            const pool = candidatePoolForTarget(state, controller, sourceInstanceId, action.target);
            return pool.supported && pool.candidateIds.includes(instanceId);
          })
        : resolveActionTargets(
            state,
            controller,
            sourceInstanceId,
            action,
            selectedTargetIds,
            previousActionTargetIds,
          );
      if (targetIds === "prompt" || !targetIds) {
        return false;
      }
      for (const [targetIndex, targetId] of targetIds.entries()) {
        if (isKoPreventedByModifier(state, targetId, sourceInstanceId, "effect")) {
          emitLog(
            state,
            controller,
            `${cardName(getCardForInstance(state, targetId))} cannot be K.O.'d.`,
            {
              sourceCardId: getInstance(state, sourceInstanceId).cardId,
              sourceInstanceId,
              targetIds: [targetId],
              visibility: "public",
            },
          );
          continue;
        }
        const replacement = findKoReplacement(
          state,
          targetId,
          controller,
          "effect",
          sourceInstanceId,
        );
        if (replacement) {
          const remainingTargetIds = targetIds.slice(targetIndex + 1);
          const replacementTargetIds = [
            targetId,
            ...remainingTargetIds.filter((remainingTargetId) => {
              const remainingReplacement = findKoReplacement(
                state,
                remainingTargetId,
                controller,
                "effect",
                sourceInstanceId,
              );
              return (
                remainingReplacement?.sourceInstanceId === replacement.sourceInstanceId &&
                remainingReplacement.replacementEffectIndex === replacement.replacementEffectIndex
              );
            }),
          ];
          if (replacement.effect.mandatory) {
            getInstance(state, replacement.sourceInstanceId).usedEffectKeys.push(
              replacement.effectKey,
            );
            if (remainingTargetIds.length > 0) {
              enqueueResolution(
                state,
                {
                  kind: "effectAction",
                  sourceInstanceId,
                  controller,
                  action: {
                    action: "ko",
                    target: {
                      player: "both",
                      zones: ["character"],
                      count: { amount: "all" },
                    },
                    previousActionTargets: true,
                  },
                  previousActionTargetIds: remainingTargetIds.filter(
                    (remainingTargetId) => !replacementTargetIds.includes(remainingTargetId),
                  ),
                },
                { next: true },
              );
            }
            enqueueResolution(
              state,
              {
                kind: "effectAction",
                sourceInstanceId: replacement.sourceInstanceId,
                controller: replacement.controller,
                action: replacement.effect.replacementAction,
                previousActionTargetIds: replacementTargetIds,
              },
              { next: true },
            );
            return false;
          }
          createChoicePrompt(state, {
            choiceKind: "confirm",
            seat: replacement.controller,
            label: `${effectSourceName(state, replacement.sourceInstanceId)} may replace the K.O.`,
            details: "Apply the replacement effect instead of allowing the K.O.?",
            sourceCardId: getInstance(state, replacement.sourceInstanceId).cardId,
            sourceInstanceId: replacement.sourceInstanceId,
            eventId: null,
            options: [
              { id: "no", label: "Allow K.O.", value: "no" },
              { id: "yes", label: "Apply replacement", value: "yes" },
            ],
            minSelections: 1,
            maxSelections: 1,
            context: { action: "ko", replacement: true },
            resolutionContext: {
              intent: "effectKoReplacement",
              targetId,
              controller: replacement.controller,
              replacementSourceInstanceId: replacement.sourceInstanceId,
              replacementEffectIndex: replacement.replacementEffectIndex,
              replacementEvent: replacement.effect.replacedEvent as "ko" | "removeFromField",
              replacementEffectKey: replacement.effectKey,
              replacementAction: replacement.effect.replacementAction,
              koSourceInstanceId: sourceInstanceId,
              koController: controller,
              replacementTargetIds,
              remainingTargetIds,
            },
          });
          return false;
        }
        koCharacterByEffect(state, targetId, controller, sourceInstanceId);
      }
      return true;
    }
    case "rest": {
      const hasFieldZone = action.target.zones.some((zone) => zone !== "costArea");
      if (
        action.target.zones.includes("costArea") &&
        hasFieldZone &&
        selectedTargetIds === undefined
      ) {
        const candidateIds = restActionCandidateIds(
          state,
          controller,
          sourceInstanceId,
          action.target,
        );
        const requested =
          action.target.count.amount === "all"
            ? candidateIds.length
            : Math.min(action.target.count.amount, candidateIds.length);
        if (requested === 0) {
          return true;
        }
        createChoicePrompt(state, {
          choiceKind: "costPayment",
          seat: controller,
          label: `${effectSourceName(state, sourceInstanceId)} rests cards`,
          details: `Choose ${requested} card${requested === 1 ? "" : "s"} or DON!! to rest.`,
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          eventId: null,
          options: candidateIds.map((id) => ({
            id,
            label: id.startsWith("active-don:")
              ? "Active DON!! in cost area"
              : cardName(getCardForInstance(state, id)),
            value: id,
            ...(!id.startsWith("active-don:") ? { targetId: id } : {}),
          })),
          minSelections: action.target.count.upTo ? 0 : requested,
          maxSelections: requested,
          context: { action: "rest", resource: "fieldOrDon" },
          resolutionContext: {
            intent: "effectMixedRestSelection",
            sourceInstanceId,
            controller,
            action,
            candidateIds,
            requested,
          },
        });
        return false;
      }
      if (
        action.target.zones.includes("costArea") &&
        !hasFieldZone &&
        selectedTargetIds === undefined
      ) {
        const targetSeat = action.target.player === "self" ? controller : otherSeat(controller);
        const requestedAmount =
          action.target.count.amount === "all"
            ? getPlayer(state, targetSeat).activeDon
            : action.target.count.amount;
        const maximum = Math.min(requestedAmount, getPlayer(state, targetSeat).activeDon);
        if (maximum > 0) {
          const choiceSeat =
            action.target.chosenBy === "opponent" ? otherSeat(controller) : controller;
          createChoicePrompt(state, {
            choiceKind: "chooseOption",
            seat: choiceSeat,
            label: `${effectSourceName(state, sourceInstanceId)} may rest DON!! cards`,
            details: `Choose how many of ${getPlayer(state, targetSeat).playerName}'s active DON!! cards to rest.`,
            sourceCardId: getInstance(state, sourceInstanceId).cardId,
            sourceInstanceId,
            eventId: null,
            options: Array.from(
              { length: action.target.count.upTo ? maximum + 1 : 1 },
              (_, index) => {
                const count = action.target.count.upTo ? index : maximum;
                return { id: String(count), label: String(count), value: String(count) };
              },
            ),
            minSelections: 1,
            maxSelections: 1,
            context: { action: "rest", resource: "don" },
            resolutionContext: {
              intent: "effectRestDonCount",
              sourceInstanceId,
              controller,
              action,
              targetSeat,
              maximum,
            },
          });
          return false;
        }
      }
      if (action.target.zones.includes("costArea") && hasFieldZone && selectedTargetIds) {
        const liveCandidateIds = restActionCandidateIds(
          state,
          controller,
          sourceInstanceId,
          action.target,
        );
        const requested =
          action.target.count.amount === "all"
            ? liveCandidateIds.length
            : Math.min(action.target.count.amount, liveCandidateIds.length);
        if (
          selectedTargetIds.length < (action.target.count.upTo ? 0 : requested) ||
          selectedTargetIds.length > requested ||
          new Set(selectedTargetIds).size !== selectedTargetIds.length ||
          selectedTargetIds.some((id) => !liveCandidateIds.includes(id))
        ) {
          return false;
        }
        for (const [targetIndex, id] of selectedTargetIds.entries()) {
          if (id.startsWith("active-don:")) {
            const seat = id.split(":")[1] as MatchSeat;
            getPlayer(state, seat).activeDon -= 1;
            getPlayer(state, seat).restedDon += 1;
          } else {
            if (
              promptForEffectRestReplacement(
                state,
                id,
                controller,
                sourceInstanceId,
                action,
                selectedTargetIds.slice(targetIndex + 1),
              )
            ) {
              return false;
            }
            restCharacterByEffect(state, id, controller, sourceInstanceId);
          }
        }
        return true;
      }
      const targetIds = resolveActionTargets(
        state,
        controller,
        sourceInstanceId,
        action,
        selectedTargetIds,
      );
      if (targetIds === "prompt" || !targetIds) {
        return false;
      }
      for (const [targetIndex, targetId] of targetIds.entries()) {
        if (
          promptForEffectRestReplacement(
            state,
            targetId,
            controller,
            sourceInstanceId,
            action,
            targetIds.slice(targetIndex + 1),
          )
        ) {
          return false;
        }
        restCharacterByEffect(state, targetId, controller, sourceInstanceId);
      }
      emitLog(
        state,
        controller,
        `${effectSourceName(state, sourceInstanceId)} rests ${targetNames(state, targetIds)}.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          targetIds,
          visibility: "public",
        },
      );
      return true;
    }
    case "restDonForPower": {
      const maximum = getPlayer(state, controller).activeDon;
      createChoicePrompt(state, {
        choiceKind: "chooseOption",
        seat: controller,
        label: `${effectSourceName(state, sourceInstanceId)} may rest DON!! cards`,
        details: `Choose how many active DON!! cards to rest for +${action.valuePerDon} power each.`,
        sourceCardId: getInstance(state, sourceInstanceId).cardId,
        sourceInstanceId,
        eventId: null,
        options: Array.from({ length: maximum + 1 }, (_, count) => ({
          id: String(count),
          label: String(count),
          value: String(count),
        })),
        minSelections: 1,
        maxSelections: 1,
        context: { action: "restDonForPower", resource: "don" },
        resolutionContext: {
          intent: "effectRestDonForPowerCount",
          sourceInstanceId,
          controller,
          action,
          maximum,
        },
      });
      return false;
    }
    case "setActive": {
      if (action.target.zones.includes("costArea")) {
        const seat = action.target.player === "self" ? controller : otherSeat(controller);
        const player = getPlayer(state, seat);
        if (isDonActivationByCharacterEffectPrevented(state, sourceInstanceId, seat)) {
          return true;
        }
        const requestedAmount =
          action.target.count.amount === "all" ? player.restedDon : action.target.count.amount;
        const maximum = Math.min(requestedAmount, player.restedDon);
        if (maximum === 0) {
          return true;
        }
        if (action.target.count.upTo) {
          createChoicePrompt(state, {
            choiceKind: "chooseOption",
            seat: controller,
            label: `${effectSourceName(state, sourceInstanceId)} may set DON!! cards as active`,
            details: `Choose how many rested DON!! cards to set as active, up to ${maximum}.`,
            sourceCardId: getInstance(state, sourceInstanceId).cardId,
            sourceInstanceId,
            eventId: null,
            options: Array.from({ length: maximum + 1 }, (_, count) => ({
              id: String(count),
              label: String(count),
              value: String(count),
            })),
            minSelections: 1,
            maxSelections: 1,
            context: {
              action: "setActive",
              resource: "don",
            },
            resolutionContext: {
              intent: "effectSetActiveDon",
              sourceInstanceId,
              controller,
              maximum,
            },
          });
          return false;
        }
        player.restedDon -= maximum;
        player.activeDon += maximum;
        return true;
      }
      const targetIds = resolveActionTargets(
        state,
        controller,
        sourceInstanceId,
        action,
        selectedTargetIds,
      );
      if (targetIds === "prompt" || !targetIds) {
        return false;
      }
      for (const targetId of targetIds) {
        getInstance(state, targetId).rested = false;
      }
      emitLog(
        state,
        controller,
        `${effectSourceName(state, sourceInstanceId)} sets ${targetNames(state, targetIds)} active.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          targetIds,
          visibility: "public",
        },
      );
      return true;
    }
    case "returnToHand": {
      const targetIds = resolveActionTargets(
        state,
        controller,
        sourceInstanceId,
        action,
        selectedTargetIds,
      );
      if (targetIds === "prompt" || !targetIds) {
        return false;
      }
      for (const [targetIndex, targetId] of targetIds.entries()) {
        if (
          !skipRemovalReplacementIds?.includes(targetId) &&
          promptForEffectRemovalReplacement(
            state,
            targetId,
            controller,
            sourceInstanceId,
            action,
            targetIds.slice(targetIndex + 1),
          )
        ) {
          return false;
        }
        removeCardByEffectAction(state, targetId, controller, sourceInstanceId, action);
      }
      if (targetIds.length > 0) {
        for (const nestedAction of [...(action.thenActions ?? [])].reverse()) {
          enqueueResolution(
            state,
            {
              kind: "effectAction",
              sourceInstanceId,
              controller,
              action: nestedAction,
              previousActionTargetIds: targetIds,
            },
            { next: true },
          );
        }
      }
      return true;
    }
    case "returnToDeck": {
      const targetIds = action.previousActionTargets
        ? (previousActionTargetIds ?? []).filter((instanceId) => {
            const pool = candidatePoolForTarget(state, controller, sourceInstanceId, action.target);
            return pool.supported && pool.candidateIds.includes(instanceId);
          })
        : resolveActionTargets(state, controller, sourceInstanceId, action, selectedTargetIds);
      if (targetIds === "prompt" || !targetIds) {
        return false;
      }
      const orderedHandOwners =
        action.order === "any" &&
        action.position === "any" &&
        targetIds.length > 1 &&
        action.target.zones.every((zone) => zone === "hand")
          ? [
              ...new Set(
                targetIds.map((targetId) =>
                  returnToDeckDestination(state, controller, targetId, action),
                ),
              ),
            ]
          : [];
      const orderedHandOwner = orderedHandOwners[0];
      if (
        orderedHandOwners.length === 1 &&
        orderedHandOwner &&
        targetIds.every((targetId) => getInstance(state, targetId).controller === orderedHandOwner)
      ) {
        createChoicePrompt(state, {
          choiceKind: "orderCards",
          seat: orderedHandOwner,
          label: `${effectSourceName(state, sourceInstanceId)} orders cards for the deck`,
          details: `Order the ${targetIds.length} cards from first to last.`,
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          eventId: null,
          options: targetIds.map((instanceId) => ({
            id: instanceId,
            label: cardName(getCardForInstance(state, instanceId)),
            value: instanceId,
            targetId: instanceId,
          })),
          minSelections: targetIds.length,
          maxSelections: targetIds.length,
          context: { action: "returnToDeck", ordered: true },
          resolutionContext: {
            intent: "effectReturnToDeckOrder",
            sourceInstanceId,
            controller,
            owner: orderedHandOwner,
            action,
            targetIds,
            previousActionTargetIds,
          },
        });
        return false;
      }
      if (action.position === "any") {
        createChoicePrompt(state, {
          choiceKind: "chooseOption",
          seat: controller,
          label: `${effectSourceName(state, sourceInstanceId)} chooses a deck position`,
          details: `Place the selected card${targetIds.length === 1 ? "" : "s"} at the top or bottom of your deck.`,
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
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
            sourceInstanceId,
            controller,
            action,
            selectedTargetIds: targetIds,
          },
        });
        return false;
      }
      if (!returnToDeckContinuation) {
        const ownerOrder = [state.activeSeat, otherSeat(state.activeSeat)];
        const ownerGroups = ownerOrder
          .map(
            (owner): ReturnToDeckOwnerGroup => ({
              owner,
              targetIds: targetIds.filter(
                (targetId) =>
                  returnToDeckDestination(state, controller, targetId, action) === owner,
              ),
            }),
          )
          .filter((group) => group.targetIds.length > 0);
        const [firstGroup, ...remainingOwnerGroups] = ownerGroups;
        const targetChooser =
          action.target.chosenBy === "opponent" ? otherSeat(controller) : controller;
        const selectionAlreadyProvidesOwnerOrder =
          selectedTargetIds !== undefined &&
          ownerGroups.length === 1 &&
          firstGroup?.owner === targetChooser &&
          action.target.zones.every((zone) => zone === "hand");
        if (
          firstGroup &&
          ownerGroups.some((group) => group.targetIds.length > 1) &&
          !selectionAlreadyProvidesOwnerOrder
        ) {
          enqueueReturnToDeckOwnerGroup(
            state,
            controller,
            sourceInstanceId,
            action,
            firstGroup,
            remainingOwnerGroups,
            targetIds,
          );
          return true;
        }
        for (const [targetIndex, targetId] of targetIds.entries()) {
          if (
            !skipRemovalReplacementIds?.includes(targetId) &&
            promptForEffectRemovalReplacement(
              state,
              targetId,
              controller,
              sourceInstanceId,
              action,
              targetIds.slice(targetIndex + 1),
            )
          ) {
            return false;
          }
          removeCardByEffectAction(state, targetId, controller, sourceInstanceId, action);
        }
        return true;
      }
      if (targetIds.length > 1 && !returnToDeckContinuation.orderResolved) {
        promptForReturnToDeckOwnerOrder(
          state,
          controller,
          sourceInstanceId,
          action,
          targetIds,
          returnToDeckContinuation,
        );
        return false;
      }
      for (const [targetIndex, targetId] of targetIds.entries()) {
        if (
          !skipRemovalReplacementIds?.includes(targetId) &&
          promptForEffectRemovalReplacement(
            state,
            targetId,
            controller,
            sourceInstanceId,
            action,
            targetIds.slice(targetIndex + 1),
            returnToDeckContinuation,
          )
        ) {
          return false;
        }
        removeCardByEffectAction(
          state,
          targetId,
          controller,
          sourceInstanceId,
          action,
          returnToDeckContinuation.publicTargetIds.length > 1,
        );
      }
      if (
        returnToDeckContinuation.finalizeOwnerGroup &&
        returnToDeckContinuation.publicTargetIds.length > 1
      ) {
        finalizeReturnToDeckOwnerGroup(
          state,
          controller,
          sourceInstanceId,
          action,
          returnToDeckContinuation,
        );
      } else if (returnToDeckContinuation.finalizeOwnerGroup) {
        const [nextGroup, ...remainingOwnerGroups] = returnToDeckContinuation.remainingOwnerGroups;
        if (nextGroup) {
          enqueueReturnToDeckOwnerGroup(
            state,
            controller,
            sourceInstanceId,
            action,
            nextGroup,
            remainingOwnerGroups,
            returnToDeckContinuation.allTargetIds,
          );
        }
      }
      return true;
    }
    case "addDon": {
      const recipient = action.player === "opponent" ? otherSeat(controller) : controller;
      const player = getPlayer(state, recipient);
      if (
        action.state !== "rested" &&
        isDonActivationByCharacterEffectPrevented(state, sourceInstanceId, recipient)
      ) {
        return true;
      }
      const requested = action.count.amount === "all" ? player.donDeckCount : action.count.amount;
      const maximum = Math.min(requested, player.donDeckCount);
      if (maximum === 0) {
        return true;
      }
      if (action.count.upTo) {
        createChoicePrompt(state, {
          choiceKind: "chooseOption",
          seat: recipient,
          label: `${effectSourceName(state, sourceInstanceId)} may add DON!!`,
          details: `Choose how many DON!! cards to add from your DON!! deck, up to ${maximum}.`,
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          eventId: null,
          options: Array.from({ length: maximum + 1 }, (_, count) => ({
            id: String(count),
            label: String(count),
            value: String(count),
          })),
          minSelections: 1,
          maxSelections: 1,
          context: { action: "addDon", resource: "don" },
          resolutionContext: {
            intent: "effectAddDon",
            sourceInstanceId,
            controller: recipient,
            maximum,
            rested: action.state === "rested",
          },
        });
        return false;
      }
      addDonFromDeck(state, recipient, maximum, action.state === "rested");
      return true;
    }
    case "addToLife": {
      const requestedAmount = action.target.count.amount;
      const isSupportedDeckTarget =
        action.target.player !== "both" &&
        action.target.zones.length === 1 &&
        action.target.zones[0] === "deck" &&
        !action.target.filters?.length &&
        typeof requestedAmount === "number";
      if (isSupportedDeckTarget && typeof requestedAmount === "number") {
        if (action.position === "choice") {
          recordCapabilityIssue(state, {
            kind: "unsupportedAction",
            code: "action:addToLife",
            actor: controller,
            sourceCardId: getInstance(state, sourceInstanceId).cardId,
            sourceInstanceId,
            eventId: null,
            details: `${cardName(getCardForInstance(state, sourceInstanceId))} cannot choose a Life position for cards added directly from the deck.`,
          });
          return false;
        }
        const targetSeat = action.target.player === "self" ? controller : otherSeat(controller);
        const maximum = Math.min(requestedAmount, getPlayer(state, targetSeat).deck.length);
        if (maximum === 0) {
          return true;
        }
        if (action.target.count.upTo) {
          createChoicePrompt(state, {
            choiceKind: "chooseOption",
            seat: controller,
            label: `${effectSourceName(state, sourceInstanceId)} may add cards to Life`,
            details: `Choose how many cards to add from the top of the deck to Life, up to ${maximum}.`,
            sourceCardId: getInstance(state, sourceInstanceId).cardId,
            sourceInstanceId,
            eventId: null,
            options: Array.from({ length: maximum + 1 }, (_, count) => ({
              id: String(count),
              label: String(count),
              value: String(count),
            })),
            minSelections: 1,
            maxSelections: 1,
            context: { action: "addToLife", resource: "life" },
            resolutionContext: {
              intent: "effectAddToLifeFromDeck",
              sourceInstanceId,
              controller,
              action,
              maximum,
            },
          });
          return false;
        }
        return addTopDeckCardsToLife(state, controller, sourceInstanceId, action, maximum);
      }

      const targetIds = action.previousActionTargets
        ? (previousActionTargetIds ?? []).filter((instanceId) => {
            const pool = candidatePoolForTarget(state, controller, sourceInstanceId, action.target);
            return pool.supported && pool.candidateIds.includes(instanceId);
          })
        : resolveActionTargets(state, controller, sourceInstanceId, action, selectedTargetIds);
      if (targetIds === "prompt") {
        return false;
      }
      if (targetIds === null || targetIds.length === 0) {
        return targetIds !== null;
      }
      if (action.position === "choice") {
        createChoicePrompt(state, {
          choiceKind: "chooseOption",
          seat: controller,
          label: `${effectSourceName(state, sourceInstanceId)} Life position`,
          details: "Choose whether to add the selected card to the top or bottom of Life.",
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          eventId: null,
          options: [
            { id: "top", label: "Top of Life", value: "top" },
            { id: "bottom", label: "Bottom of Life", value: "bottom" },
          ],
          minSelections: 1,
          maxSelections: 1,
          context: { action: "addToLife", resource: "life" },
          resolutionContext: {
            intent: "effectLifePosition",
            sourceInstanceId,
            controller,
            action,
            selectedTargetIds: targetIds,
          },
        });
        return false;
      }
      for (const targetId of targetIds) {
        if (isCharacterRemovalPreventedByPermanentEffect(state, targetId, controller)) continue;
        const target = getInstance(state, targetId);
        const destinationSeat =
          action.target.player === "self"
            ? controller
            : action.target.player === "opponent"
              ? otherSeat(controller)
              : target.controller;
        returnAttachedDonToCostArea(state, targetId);
        moveCard(state, targetId, destinationSeat, "life", {
          lifePosition: action.position,
          faceUp: action.faceUp ?? false,
          publicKnowledge: action.faceUp ?? false,
          actor: controller,
          visibility: action.faceUp ? "public" : "private",
        });
      }
      return true;
    }
    case "trashFromDeck": {
      const targetSeat = action.player === "self" ? controller : otherSeat(controller);
      const requestedAmount = action.amountFromPreviousActionTargets
        ? (previousActionTargetIds?.length ?? 0)
        : action.amount;
      const maximum = Math.min(requestedAmount, getPlayer(state, targetSeat).deck.length);
      if (maximum === 0) {
        return true;
      }
      if (!action.upTo && maximum < requestedAmount) {
        return true;
      }
      if (action.upTo) {
        createChoicePrompt(state, {
          choiceKind: "chooseOption",
          seat: controller,
          label: `${effectSourceName(state, sourceInstanceId)} may trash cards from the deck`,
          details: `Choose how many cards to trash from the top of the deck, up to ${maximum}.`,
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          eventId: null,
          options: Array.from({ length: maximum + 1 }, (_, count) => ({
            id: String(count),
            label: String(count),
            value: String(count),
          })),
          minSelections: 1,
          maxSelections: 1,
          context: { action: "trashFromDeck", resource: "deck" },
          resolutionContext: {
            intent: "effectTrashFromDeckCount",
            sourceInstanceId,
            controller,
            action,
            maximum,
          },
        });
        return false;
      }
      trashTopDeckCards(state, controller, sourceInstanceId, action, maximum, requestedAmount);
      return true;
    }
    case "removeFromLife": {
      const supported =
        action.destination === "trash" ||
        action.destination === "hand" ||
        action.destination === "deck";
      if (!supported) {
        recordCapabilityIssue(state, {
          kind: "unsupportedAction",
          code: "action:removeFromLife",
          actor: controller,
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          eventId: null,
          details: `${cardName(getCardForInstance(state, sourceInstanceId))} uses a removeFromLife variant that is not automated yet.`,
        });
        enqueueJudgePrompt(
          state,
          sourceInstanceId,
          "Judge review: unsupported action",
          `${cardName(getCardForInstance(state, sourceInstanceId))} uses a removeFromLife variant that is not automated yet.`,
        );
        return false;
      }

      const targetSeat = action.player === "self" ? controller : otherSeat(controller);
      const player = getPlayer(state, targetSeat);
      const requested =
        "untilRemaining" in action.count
          ? Math.max(0, player.life.length - action.count.untilRemaining)
          : action.count.amount === "all"
            ? player.life.length
            : action.count.amount;
      const maximum = Math.min(requested, player.life.length);
      const upTo = !("untilRemaining" in action.count) && action.count.upTo === true;
      if (action.position === "choice" && maximum > 0) {
        createChoicePrompt(state, {
          choiceKind: "chooseOption",
          seat: controller,
          label: `${effectSourceName(state, sourceInstanceId)} Life position`,
          details: "Choose whether to remove from the top or bottom of Life.",
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          eventId: null,
          options: [
            { id: "top", label: "Top of Life", value: "top" },
            { id: "bottom", label: "Bottom of Life", value: "bottom" },
          ],
          minSelections: 1,
          maxSelections: 1,
          context: { action: "removeFromLife", resource: "life" },
          resolutionContext: {
            intent: "effectLifePosition",
            sourceInstanceId,
            controller,
            action,
          },
        });
        return false;
      }
      if (action.destination === "deck" && action.position === undefined && maximum > 0) {
        const concealFromChooser = targetSeat !== controller;
        const opaqueCandidateIds = concealFromChooser
          ? Object.fromEntries(
              player.life.map((instanceId, index) => [`hidden-life:${index + 1}`, instanceId]),
            )
          : undefined;
        createChoicePrompt(state, {
          choiceKind: "selectCards",
          seat: controller,
          label: `${effectSourceName(state, sourceInstanceId)} removes Life cards`,
          details: upTo
            ? `Choose up to ${maximum} card(s) to remove from Life.`
            : `Choose ${maximum} card(s) to remove from Life.`,
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          eventId: null,
          options: player.life.map((instanceId, index) => ({
            id: concealFromChooser ? `hidden-life:${index + 1}` : instanceId,
            label: `Life card ${index + 1}`,
            value: concealFromChooser ? `hidden-life:${index + 1}` : instanceId,
          })),
          minSelections: upTo ? 0 : maximum,
          maxSelections: maximum,
          context: { action: "removeFromLife", resource: "life" },
          resolutionContext: {
            intent: "effectRemoveFromLifeSelection",
            sourceInstanceId,
            controller,
            action,
            candidateIds: [...player.life],
            ...(opaqueCandidateIds && { opaqueCandidateIds }),
            minimum: upTo ? 0 : maximum,
            maximum,
          },
        });
        return false;
      }
      if (!("untilRemaining" in action.count) && action.count.upTo) {
        createChoicePrompt(state, {
          choiceKind: "chooseOption",
          seat: controller,
          label: `${effectSourceName(state, sourceInstanceId)} may remove Life cards`,
          details: `Choose how many cards to remove from Life, up to ${maximum}.`,
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          eventId: null,
          options: Array.from({ length: maximum + 1 }, (_, count) => ({
            id: String(count),
            label: String(count),
            value: String(count),
          })),
          minSelections: 1,
          maxSelections: 1,
          context: { action: "removeFromLife", resource: "life" },
          resolutionContext: {
            intent: "effectRemoveFromLifeCount",
            sourceInstanceId,
            controller,
            action,
            maximum,
          },
        });
        return false;
      }
      return removeLifeCards(state, controller, sourceInstanceId, action, maximum);
    }
    case "freeze": {
      const mixedDonTarget = action.target.zones.includes("costArea");
      if (mixedDonTarget && selectedTargetIds === undefined && !action.previousActionTargets) {
        const candidateIds = freezeActionCandidateIds(state, controller, sourceInstanceId, action);
        const requested =
          action.target.count.amount === "all"
            ? candidateIds.length
            : Math.min(action.target.count.amount, candidateIds.length);
        if (requested === 0) {
          return true;
        }
        createChoicePrompt(state, {
          choiceKind: "selectTargets",
          seat: controller,
          label: `${effectSourceName(state, sourceInstanceId)} needs a target`,
          details: "Choose valid targets to continue resolving the effect.",
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          eventId: null,
          options: candidateIds.map((id) => ({
            id,
            label: id.startsWith("rested-don:")
              ? "Rested DON!! in cost area"
              : cardName(getCardForInstance(state, id)),
            value: id,
            ...(!id.startsWith("rested-don:") && { targetId: id }),
          })),
          minSelections: action.target.count.upTo ? 0 : requested,
          maxSelections: requested,
          context: { action: "freeze" },
          resolutionContext: {
            intent: "effectTargetSelection",
            sourceInstanceId,
            controller,
            action,
          },
        });
        return false;
      }
      const targetIds = action.previousActionTargets
        ? (previousActionTargetIds ?? []).filter((instanceId) => {
            const pool = candidatePoolForTarget(state, controller, sourceInstanceId, action.target);
            return pool.supported && pool.candidateIds.includes(instanceId);
          })
        : resolveActionTargets(state, controller, sourceInstanceId, action, selectedTargetIds);
      if (targetIds === "prompt" || !targetIds) {
        return false;
      }
      const cardTargetIds = targetIds.filter((targetId) => !targetId.startsWith("rested-don:"));
      const donTargetIds = targetIds.filter((targetId) => targetId.startsWith("rested-don:"));
      for (const targetId of cardTargetIds) {
        addModifier(state, sourceInstanceId, targetId, {
          type: "flag",
          flag: "freeze",
          duration: "untilStartOfNextTurn",
          expiresAtTurn: null,
          expiresAtBattleId: null,
          expiresOnTurnStartOfSeat: getInstance(state, targetId).controller,
        });
      }
      for (const targetId of donTargetIds) {
        const seat = targetId.split(":")[1] as MatchSeat;
        addModifier(state, sourceInstanceId, targetId, {
          type: "flag",
          flag: "freezeDon",
          duration: "untilStartOfNextTurn",
          expiresAtTurn: null,
          expiresAtBattleId: null,
          expiresOnTurnStartOfSeat: seat,
        });
      }
      if (targetIds.length > 0) {
        const targetDescription = [
          ...(cardTargetIds.length > 0 ? [targetNames(state, cardTargetIds)] : []),
          ...(donTargetIds.length > 0
            ? [`${donTargetIds.length} DON!! card${donTargetIds.length === 1 ? "" : "s"}`]
            : []),
        ].join(" and ");
        emitLog(
          state,
          controller,
          `${effectSourceName(state, sourceInstanceId)} prevents ${targetDescription} from becoming active in the next Refresh Phase.`,
          {
            sourceCardId: getInstance(state, sourceInstanceId).cardId,
            sourceInstanceId,
            targetIds: cardTargetIds,
            visibility: "public",
          },
        );
      }
      return true;
    }
    case "battleKoReplacement": {
      const targetPool = candidatePoolForTarget(state, controller, sourceInstanceId, action.target);
      if (!targetPool.supported) {
        return false;
      }
      for (const targetId of targetPool.candidateIds) {
        addModifier(state, sourceInstanceId, targetId, {
          type: "flag",
          flag: "battleKoReplacement",
          duration: action.duration,
          expiresAtTurn: state.turnNumber,
          expiresAtBattleId: null,
          expiresOnTurnStartOfSeat: null,
        });
      }
      emitLog(
        state,
        controller,
        `${effectSourceName(state, sourceInstanceId)} lets its controller replace battle K.O.s of ${targetPool.candidateIds.length} current Character${targetPool.candidateIds.length === 1 ? "" : "s"} by trashing a card from hand during this turn.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          targetIds: targetPool.candidateIds,
          visibility: "public",
        },
      );
      return true;
    }
    case "giveDon": {
      const player = getPlayer(state, controller);
      const availableDon = action.donState === "rested" ? player.restedDon : player.activeDon;
      if (action.distribution === "each") {
        if (action.count.amount === "all") {
          return false;
        }
        const amountPerTarget = action.count.amount;
        const targetPool = candidatePoolForTarget(
          state,
          controller,
          sourceInstanceId,
          action.target,
        );
        if (!targetPool.supported) {
          return false;
        }
        const requestedTargets =
          action.target.count.amount === "all"
            ? targetPool.candidateIds.length
            : action.target.count.amount;
        const maximumTargets = Math.min(
          requestedTargets,
          targetPool.candidateIds.length,
          Math.floor(availableDon / amountPerTarget),
        );
        if (maximumTargets === 0) {
          return true;
        }
        const distributedAction: Extract<Action, { action: "giveDon" }> = {
          ...action,
          target: {
            ...action.target,
            count: {
              amount: maximumTargets,
              upTo: action.target.count.upTo,
            },
          },
        };
        const targetIds = resolveActionTargets(
          state,
          controller,
          sourceInstanceId,
          distributedAction,
          selectedTargetIds,
        );
        if (targetIds === "prompt" || !targetIds) {
          return false;
        }
        const totalDon = targetIds.length * amountPerTarget;
        if (totalDon > availableDon) {
          return false;
        }
        if (action.donState === "rested") {
          player.restedDon -= totalDon;
        } else {
          player.activeDon -= totalDon;
        }
        for (const targetId of targetIds) {
          getInstance(state, targetId).attachedDon += amountPerTarget;
        }
        emitLog(
          state,
          controller,
          `${effectSourceName(state, sourceInstanceId)} gives ${amountPerTarget} DON!! to each of ${targetNames(state, targetIds)}.`,
          {
            sourceCardId: getInstance(state, sourceInstanceId).cardId,
            sourceInstanceId,
            targetIds,
            visibility: "public",
          },
        );
        return true;
      }
      const requested = action.count.amount === "all" ? availableDon : action.count.amount;
      const maximum = Math.min(requested, availableDon);
      if (maximum === 0) {
        return true;
      }
      if (action.count.upTo) {
        createChoicePrompt(state, {
          choiceKind: "chooseOption",
          seat: controller,
          label: `${effectSourceName(state, sourceInstanceId)} may give DON!!`,
          details: `Choose how many ${action.donState === "rested" ? "rested" : "active"} DON!! cards to give, up to ${maximum}.`,
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          eventId: null,
          options: Array.from({ length: maximum + 1 }, (_, count) => ({
            id: String(count),
            label: String(count),
            value: String(count),
          })),
          minSelections: 1,
          maxSelections: 1,
          context: { action: "giveDon", resource: "don" },
          resolutionContext: {
            intent: "effectGiveDonCount",
            sourceInstanceId,
            controller,
            action,
            maximum,
          },
        });
        return false;
      }
      const targetIds = resolveActionTargets(
        state,
        controller,
        sourceInstanceId,
        action,
        selectedTargetIds,
      );
      if (
        targetIds === "prompt" ||
        !targetIds ||
        targetIds.length !== 1 ||
        action.count.amount === "all"
      ) {
        return false;
      }
      const amount = action.count.amount;
      if (action.donState === "rested") {
        if (player.restedDon < amount) {
          enqueueJudgePrompt(
            state,
            sourceInstanceId,
            "Judge review: rested DON!! source",
            "Not enough rested DON!! is available.",
          );
          return false;
        }
        player.restedDon -= amount;
      } else {
        if (player.activeDon < amount) {
          enqueueJudgePrompt(
            state,
            sourceInstanceId,
            "Judge review: active DON!! source",
            "Not enough active DON!! is available.",
          );
          return false;
        }
        player.activeDon -= amount;
      }
      getInstance(state, targetIds[0]!).attachedDon += amount;
      emitLog(
        state,
        controller,
        `${effectSourceName(state, sourceInstanceId)} gives ${amount} DON!! to ${cardName(getCardForInstance(state, targetIds[0]!))}.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          targetIds,
          visibility: "public",
        },
      );
      return true;
    }
    case "giveDonFromDonPhase":
      return true;
    case "trashFromField": {
      const targetIds = resolveActionTargets(
        state,
        controller,
        sourceInstanceId,
        action,
        selectedTargetIds,
      );
      if (targetIds === "prompt" || !targetIds) {
        return false;
      }
      for (const [targetIndex, targetId] of targetIds.entries()) {
        if (
          !skipRemovalReplacementIds?.includes(targetId) &&
          promptForEffectRemovalReplacement(
            state,
            targetId,
            controller,
            sourceInstanceId,
            action,
            targetIds.slice(targetIndex + 1),
          )
        ) {
          return false;
        }
        removeCardByEffectAction(state, targetId, controller, sourceInstanceId, action);
      }
      return true;
    }
    case "trashThisCard": {
      const source = getInstance(state, sourceInstanceId);
      moveCard(state, sourceInstanceId, source.owner, "trash", {
        faceUp: true,
        publicKnowledge: true,
        actor: controller,
      });
      return true;
    }
    case "turnLifeFaceDown": {
      const seat = action.player === "self" ? controller : otherSeat(controller);
      for (const instanceId of getPlayer(state, seat).life) {
        getInstance(state, instanceId).faceUp = false;
      }
      emitLog(
        state,
        controller,
        `${effectSourceName(state, sourceInstanceId)} turns ${getPlayer(state, seat).playerName}'s Life face-down.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          visibility: "public",
        },
      );
      return true;
    }
    case "turnLifeFaceUp": {
      const seat = action.player === "self" ? controller : otherSeat(controller);
      const life = getPlayer(state, seat).life;
      const selected =
        action.position === "top"
          ? life.slice(0, action.count)
          : life.slice(Math.max(0, life.length - action.count));
      if (
        selected.length !== action.count ||
        selected.some((instanceId) => getInstance(state, instanceId).faceUp)
      ) {
        return false;
      }
      for (const instanceId of selected) {
        const instance = getInstance(state, instanceId);
        instance.faceUp = true;
        instance.publicKnowledge = true;
      }
      emitLog(
        state,
        controller,
        `${effectSourceName(state, sourceInstanceId)} turns ${formatCardList(state, selected)} face-up in Life.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          targetIds: selected,
          visibility: "public",
        },
      );
      return true;
    }
    case "redistributeDon": {
      const player = getPlayer(state, controller);
      const donorIds = [
        player.leaderInstanceId,
        ...player.characterArea.filter((entry): entry is string => Boolean(entry)),
      ].filter((instanceId) => getInstance(state, instanceId).attachedDon > 0);
      const recipientPool = candidatePoolForTarget(
        state,
        controller,
        sourceInstanceId,
        action.target,
      );
      if (
        !recipientPool.supported ||
        donorIds.length === 0 ||
        recipientPool.candidateIds.length === 0
      ) {
        return true;
      }

      const requested =
        action.count.amount === "all"
          ? donorIds.reduce(
              (total, instanceId) => total + getInstance(state, instanceId).attachedDon,
              0,
            )
          : action.count.amount;
      const tokenized = requested > 1;
      const sourceOptions = tokenized
        ? donorIds.flatMap((instanceId) =>
            Array.from({ length: getInstance(state, instanceId).attachedDon }, (_, index) => ({
              id: `attached-don:${instanceId}:${index}`,
              label: `${cardName(getCardForInstance(state, instanceId))} DON!! ${index + 1}`,
              value: `attached-don:${instanceId}:${index}`,
            })),
          )
        : donorIds.map((instanceId) => ({
            id: instanceId,
            label: cardName(getCardForInstance(state, instanceId)),
            value: instanceId,
            targetId: instanceId,
          }));
      const maximum = Math.min(requested, sourceOptions.length);

      createChoicePrompt(state, {
        choiceKind: "selectCards",
        seat: controller,
        label: `${effectSourceName(state, sourceInstanceId)} may move a given DON!! card`,
        details: "Choose a Leader or Character currently given a DON!! card, or skip.",
        sourceCardId: getInstance(state, sourceInstanceId).cardId,
        sourceInstanceId,
        eventId: null,
        options: sourceOptions,
        minSelections: action.count.upTo ? 0 : maximum,
        maxSelections: maximum,
        context: {
          action: "redistributeDon",
          role: "donSource",
        },
        resolutionContext: {
          intent: "effectRedistributeDonSource",
          sourceInstanceId,
          controller,
          action,
          candidateIds: sourceOptions.map((option) => option.id),
          tokenized,
        },
      });
      return false;
    }
    case "activateEffect": {
      const targetIds = action.target
        ? resolveActionTargets(
            state,
            controller,
            sourceInstanceId,
            action,
            selectedTargetIds,
            previousActionTargetIds,
          )
        : [sourceInstanceId];
      if (targetIds === "prompt" || !targetIds) return false;
      for (const targetId of targetIds) {
        for (const [blockIndex] of effectBlocksForInstance(
          state,
          targetId,
          action.effectTrigger,
        ).entries()) {
          enqueueResolution(state, {
            kind: "effectBlock",
            sourceInstanceId: targetId,
            controller,
            trigger: action.effectTrigger,
            blockIndex,
          });
        }
      }
      return true;
    }
    case "activateEvent": {
      const targetIds = resolveActionTargets(
        state,
        controller,
        sourceInstanceId,
        action,
        selectedTargetIds,
        previousActionTargetIds,
      );
      if (targetIds === "prompt" || !targetIds) return false;
      for (const eventInstanceId of targetIds) {
        const eventCard = getCardForInstance(state, eventInstanceId);
        const eventInstance = getInstance(state, eventInstanceId);
        if (
          eventCard.cardType !== "event" ||
          eventInstance.controller !== controller ||
          eventInstance.zone !== "hand"
        ) {
          return false;
        }
        moveCard(state, eventInstanceId, eventInstance.controller, "resolution", {
          faceUp: true,
          publicKnowledge: true,
          actor: controller,
          sourceInstanceId,
          visibility: "public",
        });
        emitLog(
          state,
          controller,
          `${effectSourceName(state, sourceInstanceId)} activates ${cardName(eventCard)}.`,
          {
            sourceCardId: getInstance(state, sourceInstanceId).cardId,
            sourceInstanceId,
            targetIds: [eventInstanceId],
            visibility: "public",
          },
        );
        for (const [blockIndex] of effectBlocksForInstance(
          state,
          eventInstanceId,
          action.effectTrigger,
        ).entries()) {
          enqueueResolution(state, {
            kind: "effectBlock",
            sourceInstanceId: eventInstanceId,
            controller,
            trigger: action.effectTrigger,
            blockIndex,
          });
        }
        const triggerEvent = { instanceId: eventInstanceId, effectController: controller };
        enqueueInPlayEffectsForTrigger(state, "whenYouActivateEvent", triggerEvent, [controller]);
        enqueueInPlayEffectsForTrigger(state, "whenOpponentActivatesEvent", triggerEvent, [
          otherSeat(controller),
        ]);
      }
      return true;
    }
    case "playThisCard": {
      const source = getInstance(state, sourceInstanceId);
      const card = getCardForInstance(state, sourceInstanceId);
      if (
        source.controller !== controller ||
        (source.zone !== "hand" && source.zone !== "resolution")
      ) {
        return false;
      }
      const fromZone = source.zone;

      if (card.cardType === "character") {
        const slotIndex = getOpenCharacterSlots(state, controller)[0];
        if (slotIndex === undefined) {
          return false;
        }
        moveCard(state, sourceInstanceId, controller, "character", {
          slotIndex,
          faceUp: true,
          publicKnowledge: true,
          actor: controller,
        });
        const played = getInstance(state, sourceInstanceId);
        played.playedOnTurn = state.turnNumber;
        played.rested = isPlayedRestedByPermanentEffect(state, controller, sourceInstanceId);
      } else if (card.cardType === "stage") {
        const existingStage = getPlayer(state, controller).stageArea;
        if (existingStage) {
          moveCard(state, existingStage, getInstance(state, existingStage).owner, "trash", {
            faceUp: true,
            publicKnowledge: true,
            actor: controller,
          });
        }
        moveCard(state, sourceInstanceId, controller, "stage", {
          faceUp: true,
          publicKnowledge: true,
          actor: controller,
        });
      } else {
        return false;
      }

      emitEvent(state, "cardPlayed", controller, {
        sourceCardId: card.id,
        sourceInstanceId,
        visibility: "public",
      });
      emitLog(
        state,
        controller,
        `${getPlayer(state, controller).playerName} plays ${cardName(card)}.`,
        {
          sourceCardId: card.id,
          sourceInstanceId,
          visibility: "public",
        },
      );
      for (const [blockIndex] of effectBlocksForInstance(
        state,
        sourceInstanceId,
        "onPlay",
      ).entries()) {
        enqueueResolution(state, {
          kind: "effectBlock",
          sourceInstanceId,
          controller,
          trigger: "onPlay",
          blockIndex,
        });
      }
      if (card.cardType === "character") {
        const triggerEvent = {
          instanceId: sourceInstanceId,
          effectController: controller,
          fromZone,
          sourceInstanceId,
          sourceFromZone: fromZone,
        };
        enqueueInPlayEffectsForTrigger(state, "whenYouPlayCharacter", triggerEvent, [controller]);
        enqueueInPlayEffectsForTrigger(state, "whenOpponentPlaysCharacter", triggerEvent, [
          otherSeat(controller),
        ]);
        if (card.trigger || effectBlocksFor(card, "trigger").length > 0) {
          enqueueInPlayEffectsForTrigger(state, "whenTriggerCharacterPlayed", triggerEvent, [
            controller,
          ]);
        }
      }
      return true;
    }
    case "search": {
      if (
        action.source.player !== "self" ||
        action.source.zone !== "deck" ||
        (action.revealDestination !== "hand" && action.revealDestination !== "character") ||
        (action.remainderPosition !== "bottom" &&
          action.remainderPosition !== "top" &&
          action.remainderPosition !== "trash" &&
          action.remainderPosition !== "any")
      ) {
        recordCapabilityIssue(state, {
          kind: "unsupportedAction",
          code: "action:search:configuration",
          actor: controller,
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          eventId: null,
          details: `${effectSourceName(state, sourceInstanceId)} uses an unsupported search configuration.`,
        });
        enqueueJudgePrompt(
          state,
          sourceInstanceId,
          "Judge review: search configuration",
          `${effectSourceName(state, sourceInstanceId)} uses an unsupported search configuration.`,
        );
        return false;
      }
      const deck = getPlayer(state, controller).deck;
      const lookedIds = action.lookCount === 0 ? [...deck] : deck.slice(0, action.lookCount);
      if (lookedIds.length === 0) {
        return true;
      }
      const eligibleIds = lookedIds.filter((instanceId) =>
        action.revealFilters?.length
          ? action.revealFilterMode === "any"
            ? action.revealFilters.some((filter) => {
                const result = matchesTargetFilter(state, sourceInstanceId, instanceId, filter);
                return result.supported && result.matches;
              })
            : action.revealFilters.every((filter) => {
                const result = matchesTargetFilter(state, sourceInstanceId, instanceId, filter);
                return result.supported && result.matches;
              })
          : true,
      );
      const requested =
        action.revealCount.amount === "all" ? eligibleIds.length : action.revealCount.amount;
      const playableEligibleIds =
        action.revealDestination === "character"
          ? eligibleIds.filter((instanceId) => {
              const card = getCardForInstance(state, instanceId);
              return (
                card.cardType === "stage" ||
                (card.cardType === "character" &&
                  getOpenCharacterSlots(state, controller).length > 0)
              );
            })
          : eligibleIds;
      const openCharacterSlots = getOpenCharacterSlots(state, controller).length;
      const destinationCapacity =
        action.revealDestination === "character"
          ? playableEligibleIds.filter(
              (instanceId) => getCardForInstance(state, instanceId).cardType === "stage",
            ).length + openCharacterSlots
          : playableEligibleIds.length;
      const maximum = Math.min(requested, playableEligibleIds.length, destinationCapacity);
      createChoicePrompt(state, {
        choiceKind: "selectCards",
        seat: controller,
        label: `${effectSourceName(state, sourceInstanceId)} looks at the top of the deck`,
        details:
          action.revealDestination === "character"
            ? `Choose up to ${maximum} eligible card(s) to play.`
            : `Choose up to ${maximum} eligible card(s) to reveal and add to your hand.`,
        sourceCardId: getInstance(state, sourceInstanceId).cardId,
        sourceInstanceId,
        eventId: null,
        options: lookedIds.map((instanceId) => ({
          id: instanceId,
          label: cardName(getCardForInstance(state, instanceId)),
          value: instanceId,
          targetId: instanceId,
          enabled: playableEligibleIds.includes(instanceId),
        })),
        minSelections: action.revealCount.upTo ? 0 : maximum,
        maxSelections: maximum,
        context: { action: "search", role: "revealedChoice" },
        resolutionContext: {
          intent: "effectSearchSelection",
          sourceInstanceId,
          controller,
          action,
          lookedIds,
          eligibleIds,
        },
      });
      return false;
    }
    case "winGame":
      state.status = "finished";
      state.phase = "finished";
      state.winner = controller;
      emitEvent(state, "winnerDeclared", controller, {
        data: {
          winner: controller,
        },
      });
      emitLog(state, controller, `${getPlayer(state, controller).playerName} wins the match.`, {
        visibility: "public",
      });
      return true;
    case "play": {
      const playingSeat = action.source.player === "self" ? controller : otherSeat(controller);
      const candidateIds = candidatesForPlayAction(
        state,
        controller,
        sourceInstanceId,
        action,
        previousActionTargetIds,
      );
      if (!candidateIds) {
        recordCapabilityIssue(state, {
          kind: "unsupportedAction",
          code: "action:play:source",
          actor: controller,
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          eventId: null,
          details: `${effectSourceName(state, sourceInstanceId)} plays from an unsupported source.`,
        });
        enqueueJudgePrompt(
          state,
          sourceInstanceId,
          "Judge review: unsupported play source",
          `${effectSourceName(state, sourceInstanceId)} plays from an unsupported source.`,
        );
        return false;
      }

      const requested = action.count.amount === "all" ? candidateIds.length : action.count.amount;
      const maximum = Math.min(requested, candidateIds.length);
      const minimum = action.count.upTo ? 0 : maximum;
      if (selectedTargetIds === undefined) {
        if (maximum === 0) {
          return true;
        }
        if (!action.count.upTo && maximum === 1 && candidateIds.length === 1) {
          selectedTargetIds = [candidateIds[0]!];
        } else {
          createChoicePrompt(state, {
            choiceKind: "selectCards",
            seat: playingSeat,
            label: `${effectSourceName(state, sourceInstanceId)} may play cards`,
            details: action.count.upTo
              ? `Choose up to ${maximum} eligible card(s) to play.`
              : `Choose ${maximum} eligible card(s) to play.`,
            sourceCardId: getInstance(state, sourceInstanceId).cardId,
            sourceInstanceId,
            eventId: null,
            options: candidateIds.map((instanceId) => ({
              id: instanceId,
              label: cardName(getCardForInstance(state, instanceId)),
              value: instanceId,
              targetId: instanceId,
            })),
            minSelections: minimum,
            maxSelections: maximum,
            context: { action: "play" },
            resolutionContext: {
              intent: "effectPlaySelection",
              sourceInstanceId,
              controller,
              action,
              candidateIds,
              previousActionTargetIds,
            },
          });
          return false;
        }
      }

      if (
        selectedTargetIds.length < minimum ||
        selectedTargetIds.length > maximum ||
        new Set(selectedTargetIds).size !== selectedTargetIds.length ||
        selectedTargetIds.some((instanceId) => !candidateIds.includes(instanceId))
      ) {
        return false;
      }
      const selectedCards = selectedTargetIds.map((instanceId) =>
        getCardForInstance(state, instanceId),
      );
      if (
        action.differentNames &&
        new Set(selectedCards.map((card) => card.name)).size !== selectedCards.length
      ) {
        return false;
      }
      if (
        selectedCards.filter((card) => card.cardType === "character").length >
          getOpenCharacterSlots(state, playingSeat).length ||
        selectedCards.filter((card) => card.cardType === "stage").length > 1
      ) {
        recordCapabilityIssue(state, {
          kind: "unsupportedAction",
          code: "action:play:placement",
          actor: controller,
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          eventId: null,
          details: `${effectSourceName(state, sourceInstanceId)} cannot place all selected cards.`,
        });
        enqueueJudgePrompt(
          state,
          sourceInstanceId,
          "Judge review: effect play placement",
          `${effectSourceName(state, sourceInstanceId)} cannot place all selected cards.`,
        );
        return false;
      }
      for (const instanceId of selectedTargetIds) {
        if (
          !playCardFromEffect(state, playingSeat, instanceId, action.playState, sourceInstanceId)
        ) {
          return false;
        }
      }
      if (selectedTargetIds.length > 0) {
        for (const nestedAction of [...(action.thenActions ?? [])].reverse()) {
          enqueueResolution(
            state,
            {
              kind: "effectAction",
              sourceInstanceId,
              controller,
              action: nestedAction,
              previousActionTargetIds: selectedTargetIds,
            },
            { next: true },
          );
        }
      }
      return true;
    }
    case "playGrouped": {
      const playingSeat = action.source.player === "self" ? controller : otherSeat(controller);
      const candidateIds = candidatesForGroupedPlayAction(
        state,
        controller,
        sourceInstanceId,
        action,
        previousActionTargetIds,
      );
      if (!candidateIds) {
        recordCapabilityIssue(state, {
          kind: "unsupportedAction",
          code: "action:playGrouped:source",
          actor: controller,
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          eventId: null,
          details: `${effectSourceName(state, sourceInstanceId)} plays grouped cards from an unsupported source.`,
        });
        return false;
      }
      const maximum = Math.min(
        action.groups.length,
        candidateIds.length,
        getOpenCharacterSlots(state, playingSeat).length,
      );
      if (maximum === 0) return true;
      createChoicePrompt(state, {
        choiceKind: "selectCards",
        seat: playingSeat,
        label: `${effectSourceName(state, sourceInstanceId)} may play cards`,
        details: `Choose up to ${maximum} eligible card(s) to play together.`,
        sourceCardId: getInstance(state, sourceInstanceId).cardId,
        sourceInstanceId,
        eventId: null,
        options: candidateIds.map((instanceId) => ({
          id: instanceId,
          label: cardName(getCardForInstance(state, instanceId)),
          value: instanceId,
          targetId: instanceId,
        })),
        minSelections: 0,
        maxSelections: maximum,
        context: { action: "playGrouped" },
        resolutionContext: {
          intent: "effectGroupedPlaySelection",
          sourceInstanceId,
          controller,
          action,
          candidateIds,
          ...(previousActionTargetIds && { previousActionTargetIds }),
        },
      });
      return false;
    }
    case "revealTopDeckCard": {
      const owner = action.player === "self" ? controller : otherSeat(controller);
      const revealedInstanceId = getPlayer(state, owner).deck[0];
      if (!revealedInstanceId) {
        return true;
      }
      const revealed = getInstance(state, revealedInstanceId);
      revealed.faceUp = true;
      revealed.publicKnowledge = true;
      emitLog(
        state,
        controller,
        `${getPlayer(state, controller).playerName} reveals ${cardName(getCardForInstance(state, revealedInstanceId))} from the top of ${getPlayer(state, owner).playerName}'s deck.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          targetIds: [revealedInstanceId],
          visibility: "public",
        },
      );
      enqueueResolution(
        state,
        {
          kind: "finalizeRevealedDeckCard",
          sourceInstanceId,
          controller,
          revealedInstanceId,
          owner,
          position: action.finalPosition,
        },
        { next: true },
      );
      const matchesConditional = (action.conditional?.filters ?? []).every((filter) => {
        const result = matchesTargetFilter(state, sourceInstanceId, revealedInstanceId, filter);
        return result.supported && result.matches;
      });
      if (action.conditional && matchesConditional) {
        for (const nestedAction of [...action.conditional.actions].reverse()) {
          enqueueResolution(
            state,
            {
              kind: "effectAction",
              sourceInstanceId,
              controller,
              action: nestedAction,
            },
            { next: true },
          );
        }
      }
      return true;
    }
    case "revealFromDeck": {
      const owner = action.player === "self" ? controller : otherSeat(controller);
      const revealedInstanceId = getPlayer(state, owner).deck[0];
      if (!revealedInstanceId) {
        return true;
      }
      const revealed = getInstance(state, revealedInstanceId);
      revealed.faceUp = true;
      revealed.publicKnowledge = true;
      emitLog(
        state,
        controller,
        `${effectSourceName(state, sourceInstanceId)} reveals ${cardName(getCardForInstance(state, revealedInstanceId))} from the top of the deck.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          targetIds: [revealedInstanceId],
          visibility: "public",
        },
      );
      enqueueResolution(
        state,
        {
          kind: "finalizeRevealedDeckCard",
          sourceInstanceId,
          controller,
          revealedInstanceId,
          owner,
          position: "top",
        },
        { next: true },
      );
      const followUp = action.ifRevealedCardMatches;
      const matches =
        followUp?.filters.every((filter) => {
          const result = matchesTargetFilter(state, sourceInstanceId, revealedInstanceId, filter);
          return result.supported && result.matches;
        }) ?? false;
      if (matches) {
        for (const nestedAction of [...followUp!.actions].reverse()) {
          enqueueResolution(
            state,
            {
              kind: "effectAction",
              sourceInstanceId,
              controller,
              action: nestedAction,
            },
            { next: true },
          );
        }
      }
      return true;
    }
    case "lookAtTopDeckCard": {
      const owner = action.player === "self" ? controller : otherSeat(controller);
      const instanceId = getPlayer(state, owner).deck[0];
      if (!instanceId) return true;
      emitLog(
        state,
        controller,
        `${getPlayer(state, controller).playerName} looks at the top card of ${getPlayer(state, owner).playerName}'s deck.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          visibility: "private",
          privateMessages: {
            [controller]: `You looked at ${cardName(getCardForInstance(state, instanceId))}.`,
          },
          judgeMessage: `${getPlayer(state, controller).playerName} looks at ${cardName(getCardForInstance(state, instanceId))}.`,
        },
      );
      return true;
    }
    case "changeBattleTarget": {
      const battle = state.battle;
      if (!battle || battle.defendingSeat !== controller) {
        return false;
      }
      const targetIds = resolveActionTargets(
        state,
        controller,
        sourceInstanceId,
        action,
        selectedTargetIds,
      );
      if (targetIds === "prompt" || !targetIds) {
        return false;
      }
      const targetId = targetIds[0];
      if (!targetId || targetIds.length !== 1) {
        return false;
      }
      battle.targetId = targetId;
      emitLog(
        state,
        controller,
        `${effectSourceName(state, sourceInstanceId)} changes the attack target to ${cardName(getCardForInstance(state, targetId))}.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          targetIds: [targetId],
          eventId: battle.id,
          visibility: "public",
        },
      );
      return true;
    }
    case "choice":
      const choiceSeat = action.player === "opponent" ? otherSeat(controller) : controller;
      createChoicePrompt(state, {
        choiceKind: "chooseOption",
        seat: choiceSeat,
        label: `${effectSourceName(state, sourceInstanceId)} requires a choice`,
        details: "Choose one effect to resolve.",
        sourceCardId: getInstance(state, sourceInstanceId).cardId,
        sourceInstanceId,
        eventId: null,
        options: action.options.map((option, index) => ({
          id: String(index),
          label: option.map((nestedAction) => nestedAction.action).join(" then "),
          value: String(index),
        })),
        minSelections: 1,
        maxSelections: 1,
        context: {
          action: "choice",
        },
        resolutionContext: {
          intent: "effectActionChoice",
          sourceInstanceId,
          controller,
          options: action.options,
          previousActionTargetIds,
        },
      });
      return false;
    case "conditional": {
      const result = evaluateConditions(
        state,
        controller,
        sourceInstanceId,
        [action.predicate],
        previousActionTargetIds,
      );
      if (!result.supported) {
        const source = getInstance(state, sourceInstanceId);
        const issue = recordCapabilityIssue(state, {
          kind: "unsupportedCondition",
          code: "conditional-action",
          actor: controller,
          sourceCardId: source.cardId,
          sourceInstanceId,
          eventId: null,
          details: `${effectSourceName(state, sourceInstanceId)} uses a conditional branch that is not automated yet.`,
        });
        enqueueJudgePrompt(
          state,
          sourceInstanceId,
          "Judge review: unsupported conditional branch",
          `${effectSourceName(state, sourceInstanceId)} uses a conditional branch that is not automated yet.`,
          { issueId: issue.id },
        );
        return false;
      }
      const branch = result.matches ? action.whenTrue : (action.whenFalse ?? []);
      for (const nestedAction of [...branch].reverse()) {
        enqueueResolution(
          state,
          {
            kind: "effectAction",
            sourceInstanceId,
            controller,
            action: nestedAction,
            previousActionTargetIds,
          },
          { next: true },
        );
      }
      return true;
    }
    case "scheduleAtEndOfTurn":
      for (const nestedAction of action.actions) {
        state.delayedEffectActions.push({
          sourceInstanceId,
          controller,
          action: nestedAction,
          scheduledTurn: state.turnNumber,
          ...(previousActionTargetIds && { previousActionTargetIds }),
          ...(delayedActionMovesSource(nestedAction) && {
            sourceZoneChangeCounter: getInstance(state, sourceInstanceId).zoneChangeCounter,
          }),
        });
      }
      return true;
    case "guessTopDeckCost": {
      const owner = action.player === "self" ? controller : otherSeat(controller);
      const revealedInstanceId = getPlayer(state, owner).deck[0];
      if (!revealedInstanceId) {
        return true;
      }
      const maximumCost = 10;
      createChoicePrompt(state, {
        choiceKind: "chooseOption",
        seat: controller,
        label: `${effectSourceName(state, sourceInstanceId)} chooses a cost`,
        details: "Choose a cost, then reveal the top card of your opponent's deck.",
        sourceCardId: getInstance(state, sourceInstanceId).cardId,
        sourceInstanceId,
        eventId: null,
        options: Array.from({ length: maximumCost + 1 }, (_, cost) => ({
          id: String(cost),
          label: `Cost ${cost}`,
          value: String(cost),
        })),
        minSelections: 1,
        maxSelections: 1,
        context: { action: "guessTopDeckCost" },
        resolutionContext: {
          intent: "effectGuessTopDeckCost",
          sourceInstanceId,
          controller,
          action,
          revealedInstanceId,
          owner,
        },
      });
      return false;
    }
    case "cannotAttack": {
      const targetIds = action.previousActionTargets
        ? (previousActionTargetIds ?? [])
        : resolveActionTargets(state, controller, sourceInstanceId, action, selectedTargetIds);
      if (targetIds === "prompt" || !targetIds) {
        return false;
      }
      for (const targetId of targetIds) {
        addModifier(state, sourceInstanceId, targetId, {
          type: "flag",
          flag: action.unlessTrashFromHand ? "attackHandTrashCost" : "cannotAttack",
          ...(action.unlessTrashFromHand && { value: action.unlessTrashFromHand }),
          duration: action.duration,
          expiresAtTurn:
            action.duration === "thisTurn"
              ? state.turnNumber
              : action.duration === "untilEndOfOpponentNextTurn" ||
                  action.duration === "untilEndOfOpponentNextEndPhase"
                ? state.turnNumber + 1
                : null,
          expiresAtBattleId: action.duration === "thisBattle" ? (state.battle?.id ?? null) : null,
          expiresOnTurnStartOfSeat: action.duration === "untilStartOfNextTurn" ? controller : null,
        });
      }
      emitLog(
        state,
        controller,
        `${effectSourceName(state, sourceInstanceId)} prevents ${targetNames(state, targetIds)} from attacking ${durationLabel(action.duration)}.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          targetIds,
          visibility: "public",
        },
      );
      return true;
    }
    case "cannotBeKod": {
      const targetIds = resolveActionTargets(
        state,
        controller,
        sourceInstanceId,
        action,
        selectedTargetIds,
      );
      if (targetIds === "prompt" || !targetIds) {
        return false;
      }
      for (const targetId of targetIds) {
        addModifier(state, sourceInstanceId, targetId, {
          type: "flag",
          flag: "cannotBeKO",
          koRestriction: action.restriction,
          koByPlayer: action.byPlayer,
          koByFilters: action.byFilter,
          duration: action.duration,
          expiresAtTurn:
            action.duration === "thisTurn"
              ? state.turnNumber
              : action.duration === "untilEndOfOpponentNextTurn" ||
                  action.duration === "untilEndOfOpponentNextEndPhase"
                ? state.turnNumber + 1
                : null,
          expiresAtBattleId: action.duration === "thisBattle" ? (state.battle?.id ?? null) : null,
          expiresOnTurnStartOfSeat: action.duration === "untilStartOfNextTurn" ? controller : null,
        });
      }
      emitLog(
        state,
        controller,
        `${effectSourceName(state, sourceInstanceId)} prevents ${targetNames(state, targetIds)} from being K.O.'d ${durationLabel(action.duration)}.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          targetIds,
          visibility: "public",
        },
      );
      return true;
    }
    case "negateEffects": {
      const targetIds = resolveActionTargets(
        state,
        controller,
        sourceInstanceId,
        action,
        selectedTargetIds,
        previousActionTargetIds,
      );
      if (targetIds === "prompt" || !targetIds) {
        return false;
      }
      for (const targetId of targetIds) {
        addModifier(state, sourceInstanceId, targetId, {
          type: "flag",
          flag: "effectsNegated",
          negatedEffectTypes: action.effectTypes,
          duration: action.duration,
          expiresAtTurn: action.duration === "thisTurn" ? state.turnNumber : null,
          expiresAtBattleId: action.duration === "thisBattle" ? (state.battle?.id ?? null) : null,
          expiresOnTurnStartOfSeat: action.duration === "untilStartOfNextTurn" ? controller : null,
        });
      }
      emitLog(
        state,
        controller,
        `${effectSourceName(state, sourceInstanceId)} negates the effects of ${targetNames(state, targetIds)} ${durationLabel(action.duration)}.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          targetIds,
          visibility: "public",
        },
      );
      return true;
    }
    case "negatePlayerEffects": {
      const targetSeat = action.player === "self" ? controller : otherSeat(controller);
      const targetLeaderId = getPlayer(state, targetSeat).leaderInstanceId;
      addModifier(state, sourceInstanceId, targetLeaderId, {
        type: "flag",
        flag: "effectsNegated",
        negatedEffectTypes: action.effectTypes,
        playerScope: true,
        duration: action.duration,
        expiresAtTurn:
          action.duration === "thisTurn"
            ? state.turnNumber
            : action.duration === "untilEndOfOpponentNextTurn" ||
                action.duration === "untilEndOfOpponentNextEndPhase"
              ? state.turnNumber + 1
              : null,
        expiresAtBattleId: action.duration === "thisBattle" ? (state.battle?.id ?? null) : null,
        expiresOnTurnStartOfSeat: action.duration === "untilStartOfNextTurn" ? controller : null,
      });
      emitLog(
        state,
        controller,
        `${effectSourceName(state, sourceInstanceId)} negates ${getPlayer(state, targetSeat).playerName}'s ${action.effectTypes?.join(", ") ?? "card"} effects ${durationLabel(action.duration)}.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          targetIds: [targetLeaderId],
          visibility: "public",
        },
      );
      return true;
    }
    case "cannotBeRested": {
      const targetIds = resolveActionTargets(
        state,
        controller,
        sourceInstanceId,
        action,
        selectedTargetIds,
      );
      if (targetIds === "prompt" || !targetIds) {
        return false;
      }
      for (const targetId of targetIds) {
        addModifier(state, sourceInstanceId, targetId, {
          type: "flag",
          flag: "cannotBeRested",
          duration: action.duration,
          expiresAtTurn:
            action.duration === "thisTurn"
              ? state.turnNumber
              : action.duration === "untilEndOfOpponentNextTurn" ||
                  action.duration === "untilEndOfOpponentNextEndPhase"
                ? state.turnNumber + 1
                : null,
          expiresAtBattleId: action.duration === "thisBattle" ? (state.battle?.id ?? null) : null,
          expiresOnTurnStartOfSeat: action.duration === "untilStartOfNextTurn" ? controller : null,
        });
      }
      emitLog(
        state,
        controller,
        `${effectSourceName(state, sourceInstanceId)} prevents ${targetNames(state, targetIds)} from being rested ${durationLabel(action.duration)}.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          targetIds,
          visibility: "public",
        },
      );
      return true;
    }
    case "canAttackActive": {
      const targetIds = resolveActionTargets(
        state,
        controller,
        sourceInstanceId,
        action,
        selectedTargetIds,
      );
      if (targetIds === "prompt" || !targetIds) {
        return false;
      }
      for (const targetId of targetIds) {
        addModifier(state, sourceInstanceId, targetId, {
          type: "flag",
          flag: "canAttackActive",
          duration: action.duration,
          expiresAtTurn:
            action.duration === "thisTurn"
              ? state.turnNumber
              : action.duration === "untilEndOfOpponentNextTurn" ||
                  action.duration === "untilEndOfOpponentNextEndPhase"
                ? state.turnNumber + 1
                : null,
          expiresAtBattleId: action.duration === "thisBattle" ? (state.battle?.id ?? null) : null,
          expiresOnTurnStartOfSeat: action.duration === "untilStartOfNextTurn" ? controller : null,
        });
      }
      emitLog(
        state,
        controller,
        `${effectSourceName(state, sourceInstanceId)} allows ${targetNames(state, targetIds)} to attack active Characters ${durationLabel(action.duration)}.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          targetIds,
          visibility: "public",
        },
      );
      return true;
    }
    case "cannotActivate": {
      let targetIds = resolveActionTargets(
        state,
        controller,
        sourceInstanceId,
        action,
        selectedTargetIds,
      );
      if (targetIds === "prompt" || !targetIds) {
        return false;
      }
      if (
        action.keyword === "blocker" &&
        action.target.count.amount === "all" &&
        action.target.zones.length === 1 &&
        action.target.zones[0] === "character" &&
        !action.target.filters?.length
      ) {
        const targetSeat = action.target.player === "self" ? controller : otherSeat(controller);
        const leaderId = getPlayer(state, targetSeat).leaderInstanceId;
        addModifier(state, sourceInstanceId, leaderId, {
          type: "flag",
          flag: "cannotActivate",
          keyword: action.keyword,
          playerScope: true,
          duration: action.duration,
          expiresAtTurn:
            action.duration === "thisTurn"
              ? state.turnNumber
              : action.duration === "untilEndOfOpponentNextTurn" ||
                  action.duration === "untilEndOfOpponentNextEndPhase"
                ? state.turnNumber + 1
                : null,
          expiresAtBattleId: action.duration === "thisBattle" ? (state.battle?.id ?? null) : null,
          expiresOnTurnStartOfSeat: action.duration === "untilStartOfNextTurn" ? controller : null,
        });
        targetIds = [...new Set([...targetIds, leaderId])];
      } else {
        for (const targetId of targetIds) {
          addModifier(state, sourceInstanceId, targetId, {
            type: "flag",
            flag: "cannotActivate",
            keyword: action.keyword,
            duration: action.duration,
            expiresAtTurn:
              action.duration === "thisTurn"
                ? state.turnNumber
                : action.duration === "untilEndOfOpponentNextTurn" ||
                    action.duration === "untilEndOfOpponentNextEndPhase"
                  ? state.turnNumber + 1
                  : null,
            expiresAtBattleId: action.duration === "thisBattle" ? (state.battle?.id ?? null) : null,
            expiresOnTurnStartOfSeat:
              action.duration === "untilStartOfNextTurn" ? controller : null,
          });
        }
      }
      emitLog(
        state,
        controller,
        `${effectSourceName(state, sourceInstanceId)} prevents ${targetNames(state, targetIds)} from activating ${action.keyword} ${durationLabel(action.duration)}.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          targetIds,
          visibility: "public",
        },
      );
      return true;
    }
    case "setPower": {
      const targetIds = resolveActionTargets(
        state,
        controller,
        sourceInstanceId,
        action,
        selectedTargetIds,
        previousActionTargetIds,
      );
      if (targetIds === "prompt" || !targetIds) {
        return false;
      }
      for (const targetId of targetIds) {
        const currentPower = getCardPower(state, targetId);
        addModifier(state, sourceInstanceId, targetId, {
          type: "power",
          value: action.value === 0 && currentPower < 0 ? 0 : action.value - currentPower,
          duration: action.duration,
          expiresAtTurn:
            action.duration === "thisTurn"
              ? state.turnNumber
              : action.duration === "untilEndOfOpponentNextTurn" ||
                  action.duration === "untilEndOfOpponentNextEndPhase"
                ? state.turnNumber + 1
                : null,
          expiresAtBattleId: action.duration === "thisBattle" ? (state.battle?.id ?? null) : null,
          expiresOnTurnStartOfSeat: action.duration === "untilStartOfNextTurn" ? controller : null,
        });
      }
      emitLog(
        state,
        controller,
        `${effectSourceName(state, sourceInstanceId)} sets ${targetNames(state, targetIds)} to ${action.value} power ${durationLabel(action.duration)}.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          targetIds,
          visibility: "public",
        },
      );
      return true;
    }
    case "attackRestriction":
    case "playRested":
      recordCapabilityIssue(state, {
        kind: "unsupportedAction",
        code: `action:${action.action}`,
        actor: controller,
        sourceCardId: getInstance(state, sourceInstanceId).cardId,
        sourceInstanceId,
        eventId: null,
        details: `${cardName(getCardForInstance(state, sourceInstanceId))} uses ${action.action}, which is not automated yet.`,
      });
      enqueueJudgePrompt(
        state,
        sourceInstanceId,
        "Judge review: unsupported action",
        `${cardName(getCardForInstance(state, sourceInstanceId))} uses ${action.action}, which is not automated yet.`,
      );
      return false;
    case "extraTurn":
      state.extraTurnSeat = controller;
      emitLog(
        state,
        controller,
        `${effectSourceName(state, sourceInstanceId)} grants ${getPlayer(state, controller).playerName} an extra turn after this one.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          visibility: "public",
        },
      );
      return true;
    case "playRestriction": {
      const targetLeaderId = getPlayer(state, controller).leaderInstanceId;
      addModifier(state, sourceInstanceId, targetLeaderId, {
        type: "flag",
        flag: "cannotPlay",
        playerScope: true,
        playRestrictionFilters: action.filters,
        playRestrictionSourceZones: action.sourceZones,
        duration: action.duration,
        expiresAtTurn: action.duration === "thisTurn" ? state.turnNumber : null,
        expiresAtBattleId: null,
        expiresOnTurnStartOfSeat: null,
      });
      emitLog(
        state,
        controller,
        `${effectSourceName(state, sourceInstanceId)} prevents ${getPlayer(state, controller).playerName} from playing matching cards ${durationLabel(action.duration)}.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          targetIds: [targetLeaderId],
          visibility: "public",
        },
      );
      return true;
    }
    case "cannotDraw": {
      const affectedSeat = action.player === "self" ? controller : otherSeat(controller);
      addModifier(state, sourceInstanceId, getPlayer(state, affectedSeat).leaderInstanceId, {
        type: "flag",
        flag: "cannotDrawByOwnEffects",
        playerScope: true,
        duration: action.duration,
        expiresAtTurn: action.duration === "thisTurn" ? state.turnNumber : null,
        expiresAtBattleId: null,
        expiresOnTurnStartOfSeat: null,
      });
      return true;
    }
    case "cannotSetDonActive": {
      const affectedSeat = action.player === "self" ? controller : otherSeat(controller);
      addModifier(state, sourceInstanceId, getPlayer(state, affectedSeat).leaderInstanceId, {
        type: "flag",
        flag: "cannotSetDonActiveByCharacterEffects",
        playerScope: true,
        duration: action.duration,
        expiresAtTurn: action.duration === "thisTurn" ? state.turnNumber : null,
        expiresAtBattleId: null,
        expiresOnTurnStartOfSeat: null,
      });
      return true;
    }
    case "cannotBePlayedByEffects":
      return true;
    case "addThisCardToHand": {
      const source = getInstance(state, sourceInstanceId);
      if (source.zone !== "hand") {
        moveCard(state, sourceInstanceId, source.owner, "hand", {
          faceUp: false,
          publicKnowledge: false,
          actor: controller,
          sourceInstanceId,
          visibility: "private",
        });
      }
      return true;
    }
    case "cannotAttackTargets": {
      const isPlayerWide =
        action.attacker.player === "self" &&
        action.attacker.count.amount === "all" &&
        action.attacker.zones.includes("leader") &&
        action.attacker.zones.includes("character") &&
        !action.attacker.filters?.length;
      const targetIds = resolveActionTargets(
        state,
        controller,
        sourceInstanceId,
        {
          action: "cannotAttack",
          target: action.attacker,
          duration: action.duration,
        },
        selectedTargetIds,
        previousActionTargetIds,
      );
      if (targetIds === "prompt" || !targetIds) return false;
      const modifierTargetIds = isPlayerWide
        ? [getPlayer(state, controller).leaderInstanceId]
        : targetIds;
      for (const targetId of modifierTargetIds) {
        addModifier(state, sourceInstanceId, targetId, {
          type: "attackRestriction",
          attackRestriction: "cannotAttack",
          attackTargetFilters: action.filters,
          playerScope: isPlayerWide,
          duration: action.duration,
          expiresAtTurn: action.duration === "thisTurn" ? state.turnNumber : null,
          expiresAtBattleId: null,
          expiresOnTurnStartOfSeat: null,
        });
      }
      return true;
    }
    case "revealFromLife": {
      const owner = action.player === "self" ? controller : otherSeat(controller);
      const revealedInstanceId = getPlayer(state, owner).life[0];
      if (!revealedInstanceId) {
        return true;
      }
      const revealed = getInstance(state, revealedInstanceId);
      revealed.faceUp = true;
      revealed.publicKnowledge = true;
      emitLog(
        state,
        controller,
        `${effectSourceName(state, sourceInstanceId)} reveals ${cardName(getCardForInstance(state, revealedInstanceId))} from the top of ${getPlayer(state, owner).playerName}'s Life.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          targetIds: [revealedInstanceId],
          visibility: "public",
        },
      );

      const conditionalPlay = action.conditionalPlay;
      const matches = conditionalPlay?.filters.every((filter) => {
        const result = matchesTargetFilter(state, sourceInstanceId, revealedInstanceId, filter);
        return result.supported && result.matches;
      });
      const card = getCardForInstance(state, revealedInstanceId);
      if (
        !conditionalPlay ||
        !matches ||
        owner !== controller ||
        card.cardType !== "character" ||
        getOpenCharacterSlots(state, controller).length === 0
      ) {
        revealed.faceUp = false;
        revealed.publicKnowledge = false;
        return true;
      }

      createChoicePrompt(state, {
        choiceKind: "confirm",
        seat: controller,
        label: `${effectSourceName(state, sourceInstanceId)} may play the revealed card`,
        details: `Play ${cardName(card)} from Life?`,
        sourceCardId: getInstance(state, sourceInstanceId).cardId,
        sourceInstanceId,
        eventId: null,
        options: [
          { id: "play", label: "Play card", value: "play" },
          { id: "keep", label: "Leave in Life", value: "keep" },
        ],
        minSelections: 1,
        maxSelections: 1,
        context: { action: "revealFromLife", resource: "life" },
        resolutionContext: {
          intent: "effectRevealFromLifePlay",
          sourceInstanceId,
          controller,
          owner,
          action,
          revealedInstanceId,
        },
      });
      return false;
    }
    case "lookAtLife": {
      const availableSeats = (
        action.player === "either"
          ? [controller, otherSeat(controller)]
          : [action.player === "self" ? controller : otherSeat(controller)]
      ).filter((seat) => getPlayer(state, seat).life.length > 0);
      if (availableSeats.length === 0) {
        return true;
      }
      createChoicePrompt(state, {
        choiceKind: "chooseOption",
        seat: controller,
        label: `${effectSourceName(state, sourceInstanceId)} looks at Life`,
        details: "Choose whose top Life card to look at.",
        sourceCardId: getInstance(state, sourceInstanceId).cardId,
        sourceInstanceId,
        eventId: null,
        options: [
          ...(action.upTo ? [{ id: "skip", label: "Do not look", value: "skip" }] : []),
          ...availableSeats.map((seat) => ({
            id: seat === controller ? "self" : "opponent",
            label: seat === controller ? "Your Life" : "Opponent's Life",
            value: seat === controller ? "self" : "opponent",
          })),
        ],
        minSelections: 1,
        maxSelections: 1,
        context: { action: "lookAtLife", resource: "life" },
        resolutionContext: {
          intent: "effectLookAtLifeOwner",
          sourceInstanceId,
          controller,
          action,
          availableSeats,
        },
      });
      return false;
    }
    case "dealDamage": {
      const targetSeat = action.player === "self" ? controller : otherSeat(controller);
      enqueueResolution(
        state,
        {
          kind: "effectDamageContinue",
          sourceInstanceId,
          controller,
          targetSeat,
          remaining: action.amount,
        },
        { next: true },
      );
      return true;
    }
    case "opponentReturnDon": {
      const returningSeat = otherSeat(controller);
      const options = returnDonCostOptions(state, returningSeat);
      const amount = Math.min(action.amount, options.length);
      if (amount === 0) {
        return true;
      }
      const sourceKeys = new Set(
        options.map((option) =>
          option.id.startsWith("attached-don:")
            ? option.id.slice(0, option.id.lastIndexOf(":"))
            : option.id.slice(0, option.id.indexOf(":")),
        ),
      );
      if (options.length > amount && sourceKeys.size > 1) {
        createChoicePrompt(state, {
          choiceKind: "costPayment",
          seat: returningSeat,
          label: `${effectSourceName(state, sourceInstanceId)} returns your DON!!`,
          details: `Choose ${amount} DON!! card(s) from your field to return to your DON!! deck.`,
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          eventId: null,
          options: options.map((option) => ({
            id: option.id,
            label: option.label,
            value: option.id,
          })),
          minSelections: amount,
          maxSelections: amount,
          context: { action: "opponentReturnDon", resource: "don" },
          resolutionContext: {
            intent: "effectOpponentReturnDon",
            sourceInstanceId,
            controller,
            returningSeat,
            amount,
            candidateIds: options.map((option) => option.id),
          },
        });
        return false;
      }
      returnSelectedDonToDeck(
        state,
        returningSeat,
        options.slice(0, amount).map((option) => option.id),
        sourceInstanceId,
        controller,
      );
      return true;
    }
    case "returnDon": {
      if (action.player === "opponent" && !action.thenActions?.length) {
        return processEffectAction(
          state,
          controller,
          sourceInstanceId,
          {
            action: "opponentReturnDon",
            amount: action.amount,
            condition: action.condition,
          },
          selectedTargetIds,
          previousActionTargetIds,
        );
      }
      const returningSeat = action.player === "self" ? controller : otherSeat(controller);
      const options = returnDonCostOptions(state, returningSeat);
      const requestedAmount = action.untilSameCountAsOpponent
        ? Math.max(0, options.length - returnDonCostOptions(state, otherSeat(returningSeat)).length)
        : action.amount;
      const amount = Math.min(requestedAmount, options.length);
      if (amount === 0) {
        return true;
      }
      if (options.length > amount) {
        createChoicePrompt(state, {
          choiceKind: "costPayment",
          seat: returningSeat,
          label: `${effectSourceName(state, sourceInstanceId)} returns your DON!!`,
          details: `Choose ${amount} DON!! card(s) from your field to return to your DON!! deck.`,
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          eventId: null,
          options: options.map((option) => ({
            id: option.id,
            label: option.label,
            value: option.id,
          })),
          minSelections: amount,
          maxSelections: amount,
          context: { action: "returnDon", resource: "don" },
          resolutionContext: {
            intent: "effectReturnDon",
            sourceInstanceId,
            controller,
            returningSeat,
            amount,
            candidateIds: options.map((option) => option.id),
            action,
          },
        });
        return false;
      }
      const selectedIds = options.map((option) => option.id);
      returnSelectedDonToDeck(state, returningSeat, selectedIds, sourceInstanceId, controller);
      for (const nestedAction of [...(action.thenActions ?? [])].reverse()) {
        enqueueResolution(
          state,
          {
            kind: "effectAction",
            sourceInstanceId,
            controller,
            action: nestedAction,
          },
          { next: true },
        );
      }
      return true;
    }
    case "rearrangeDeck": {
      const seat = action.player === "self" ? controller : otherSeat(controller);
      const lookedIds = getPlayer(state, seat).deck.slice(0, action.count);
      if (lookedIds.length === 0) {
        return true;
      }
      if (action.trashUpTo !== undefined) {
        const maximum = Math.min(action.trashUpTo, lookedIds.length);
        createChoicePrompt(state, {
          choiceKind: "selectCards",
          seat: controller,
          label: `${effectSourceName(state, sourceInstanceId)} looks at the top of the deck`,
          details: `Choose up to ${maximum} card(s) to trash.`,
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          eventId: null,
          options: lookedIds.map((instanceId) => ({
            id: instanceId,
            label: cardName(getCardForInstance(state, instanceId)),
            value: instanceId,
            targetId: instanceId,
          })),
          minSelections: 0,
          maxSelections: maximum,
          context: { action: "rearrangeDeck", role: "trashChoice" },
          resolutionContext: {
            intent: "effectRearrangeDeckTrashSelection",
            sourceInstanceId,
            controller,
            action,
            lookedIds,
          },
        });
        return false;
      }
      promptForRearrangeDeckOrder(state, sourceInstanceId, controller, action, lookedIds);
      return false;
    }
    case "shuffleDeck": {
      const seat = action.player === "self" ? controller : otherSeat(controller);
      const player = getPlayer(state, seat);
      player.deck = shuffle(
        player.deck,
        `${state.config.seed ?? "0"}:${state.turnNumber}:${state.eventSequence}:${sourceInstanceId}:effect-shuffle`,
      );
      for (const [index, instanceId] of player.deck.entries()) {
        const instance = getInstance(state, instanceId);
        instance.zoneIndex = index;
        instance.faceUp = false;
        instance.publicKnowledge = false;
      }
      emitLog(state, controller, `${getPlayer(state, seat).playerName} shuffles their deck.`, {
        sourceCardId: getInstance(state, sourceInstanceId).cardId,
        sourceInstanceId,
        visibility: "public",
      });
      return true;
    }
    case "redrawHand": {
      const seat = action.player === "self" ? controller : otherSeat(controller);
      const player = getPlayer(state, seat);
      const returnedIds = [...player.hand];

      emitLog(
        state,
        controller,
        returnedIds.length > 0
          ? `${player.playerName} returns ${returnedIds.length} card${returnedIds.length === 1 ? "" : "s"} from hand to their deck.`
          : `${player.playerName} has no cards to return from hand.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          visibility: "public",
        },
      );

      for (const instanceId of returnedIds) {
        moveCard(state, instanceId, seat, "deck", {
          deckPosition: "bottom",
          faceUp: false,
          publicKnowledge: false,
          actor: controller,
          sourceInstanceId,
          visibility: "public",
          suppressLog: true,
        });
      }

      player.deck = shuffle(
        player.deck,
        [
          state.config.seed ?? "0",
          state.turnNumber,
          state.eventSequence,
          sourceInstanceId,
          seat,
          "redraw-hand",
        ].join(":"),
      );
      for (const [index, instanceId] of player.deck.entries()) {
        const instance = getInstance(state, instanceId);
        instance.zoneIndex = index;
        instance.faceUp = false;
        instance.publicKnowledge = false;
      }

      const drawAmount = action.drawCount === "returned" ? returnedIds.length : action.drawCount;
      emitLog(state, controller, `${player.playerName} shuffles their deck.`, {
        sourceCardId: getInstance(state, sourceInstanceId).cardId,
        sourceInstanceId,
        visibility: "public",
      });
      const drawBlockedByOwnEffect =
        seat === controller &&
        hasFlagModifier(state, getPlayer(state, seat).leaderInstanceId, "cannotDrawByOwnEffects");
      if (!drawBlockedByOwnEffect) {
        drawCards(state, seat, drawAmount, `${effectSourceName(state, sourceInstanceId)} redraws`);
      }
      return true;
    }
    case "rearrangeLife": {
      const seat = action.player === "self" ? controller : otherSeat(controller);
      const lookedIds = [...getPlayer(state, seat).life];
      if (lookedIds.length <= 1) {
        if (action.moveOneToDeckTop && lookedIds[0]) {
          moveCard(state, lookedIds[0], seat, "deck", {
            deckPosition: "top",
            actor: controller,
            sourceInstanceId,
            visibility: "private",
          });
        }
        return true;
      }
      createChoicePrompt(state, {
        choiceKind: "orderCards",
        seat: controller,
        label: action.moveOneToDeckTop
          ? `${effectSourceName(state, sourceInstanceId)} chooses a Life card for the deck`
          : `${effectSourceName(state, sourceInstanceId)} orders Life cards`,
        details: action.moveOneToDeckTop
          ? "Place the first card on top of the deck, then order the remaining Life cards from top to bottom."
          : `Order the ${lookedIds.length} Life card(s) from top to bottom.`,
        sourceCardId: getInstance(state, sourceInstanceId).cardId,
        sourceInstanceId,
        eventId: null,
        options: lookedIds.map((instanceId) => ({
          id: instanceId,
          label: cardName(getCardForInstance(state, instanceId)),
          value: instanceId,
          targetId: instanceId,
        })),
        minSelections: lookedIds.length,
        maxSelections: lookedIds.length,
        context: { action: "rearrangeLife", ordered: true },
        resolutionContext: {
          intent: "effectRearrangeLifeOrder",
          sourceInstanceId,
          controller,
          action,
          lookedIds,
        },
      });
      return false;
    }
    case "cannotBeRemoved": {
      const supportedLifeRestriction =
        action.bySource === "ownEffect" &&
        action.target.player !== "both" &&
        action.target.zones.length === 1 &&
        action.target.zones[0] === "life" &&
        action.target.count.amount === "all";
      if (!supportedLifeRestriction) {
        recordCapabilityIssue(state, {
          kind: "unsupportedAction",
          code: "action:cannotBeRemoved",
          actor: controller,
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          eventId: null,
          details: `${cardName(getCardForInstance(state, sourceInstanceId))} uses cannotBeRemoved, which is not automated for this target.`,
        });
        enqueueJudgePrompt(
          state,
          sourceInstanceId,
          "Judge review: unsupported action",
          `${cardName(getCardForInstance(state, sourceInstanceId))} uses cannotBeRemoved, which is not automated for this target.`,
        );
        return false;
      }
      const targetSeat = action.target.player === "self" ? controller : otherSeat(controller);
      addModifier(state, sourceInstanceId, getPlayer(state, targetSeat).leaderInstanceId, {
        type: "flag",
        flag: "cannotAddLifeToHandByOwnEffect",
        duration: action.duration,
        expiresAtTurn: action.duration === "thisTurn" ? state.turnNumber : null,
        expiresAtBattleId: action.duration === "thisBattle" ? (state.battle?.id ?? null) : null,
        expiresOnTurnStartOfSeat: action.duration === "untilStartOfNextTurn" ? controller : null,
      });
      return true;
    }
  }
}

export function canPayCosts(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  costs: Cost[] | undefined,
  trashHandIds: string[] | undefined,
  costPaymentIds?: string[],
  costPaymentIdsByType?: {
    giveDon?: string[];
    restCards?: string[];
    returnCharacter?: string[];
  },
): boolean {
  if (!costs?.length) {
    return true;
  }

  for (const cost of costs) {
    switch (cost.cost) {
      case "restDon":
        if (getPlayer(state, controller).activeDon < cost.amount) {
          return false;
        }
        break;
      case "giveDon": {
        const player = getPlayer(state, controller);
        const candidates = [
          player.leaderInstanceId,
          ...player.characterArea.filter((instanceId): instanceId is string => instanceId !== null),
        ];
        const selected = costPaymentIdsByType?.giveDon ?? candidates.slice(0, 1);
        if (
          player.activeDon < cost.amount ||
          selected.length !== 1 ||
          !candidates.includes(selected[0]!)
        ) {
          return false;
        }
        break;
      }
      case "returnDon":
        if (returnDonCostOptions(state, controller).length < (cost.minimumAmount ?? cost.amount)) {
          return false;
        }
        if (costPaymentIds) {
          const candidateIds = returnDonCostOptions(state, controller).map((option) => option.id);
          const minimumAmount = cost.minimumAmount ?? cost.amount;
          const maximumAmount =
            cost.minimumAmount === undefined ? minimumAmount : candidateIds.length;
          if (
            costPaymentIds.length < minimumAmount ||
            costPaymentIds.length > maximumAmount ||
            new Set(costPaymentIds).size !== costPaymentIds.length ||
            costPaymentIds.some((id) => !candidateIds.includes(id))
          ) {
            return false;
          }
        }
        break;
      case "restThisCard":
        if (
          getInstance(state, sourceInstanceId).rested ||
          hasFlagModifier(state, sourceInstanceId, "cannotBeRested")
        ) {
          return false;
        }
        break;
      case "modifyLeaderPower":
        if (
          cost.requiresActive &&
          getInstance(state, getPlayer(state, controller).leaderInstanceId).rested
        ) {
          return false;
        }
        break;
      case "trashThisCard":
        break;
      case "returnThisToHand": {
        const source = getInstance(state, sourceInstanceId);
        if (source.controller !== controller || source.zone !== "character") {
          return false;
        }
        break;
      }
      case "trashFromHand":
        const trashCandidates = candidatesForTrashFromHandCost(
          state,
          controller,
          sourceInstanceId,
          cost,
        );
        const selectedTrashIds = trashHandIds ?? trashCandidates.slice(0, cost.amount);
        if (
          selectedTrashIds.length !== cost.amount ||
          new Set(selectedTrashIds).size !== selectedTrashIds.length ||
          selectedTrashIds.some((instanceId) => !trashCandidates.includes(instanceId))
        ) {
          return false;
        }
        break;
      case "playCard": {
        const candidates = candidatesForPlayCardCost(state, controller, sourceInstanceId, cost);
        const selected = costPaymentIds ?? candidates.slice(0, cost.amount);
        if (
          selected.length !== cost.amount ||
          new Set(selected).size !== selected.length ||
          selected.some((instanceId) => !candidates.includes(instanceId))
        ) {
          return false;
        }
        break;
      }
      case "trashCard": {
        const candidates = candidatesForTrashCardCost(state, controller, sourceInstanceId, cost);
        const selected = costPaymentIds ?? candidates.slice(0, cost.amount);
        if (
          selected.length !== cost.amount ||
          new Set(selected).size !== selected.length ||
          selected.some((instanceId) => !candidates.includes(instanceId))
        ) {
          return false;
        }
        break;
      }
      case "trashLife":
        if (
          getPlayer(state, controller).life.length < cost.amount ||
          (cost.position === "choice" &&
            getPlayer(state, controller).life.length > 1 &&
            costPaymentIds !== undefined &&
            (costPaymentIds.length !== 1 ||
              (costPaymentIds[0] !== "top" && costPaymentIds[0] !== "bottom")))
        ) {
          return false;
        }
        break;
      case "returnCharacterToDeck": {
        const candidates = candidatesForReturnCharacterToDeckCost(
          state,
          controller,
          sourceInstanceId,
          cost,
        );
        const selected = costPaymentIds ?? candidates.slice(0, cost.amount);
        if (
          selected.length !== cost.amount ||
          new Set(selected).size !== selected.length ||
          selected.some((instanceId) => !candidates.includes(instanceId))
        ) {
          return false;
        }
        break;
      }
      case "returnHandToDeck": {
        const player = getPlayer(state, controller);
        const selected = costPaymentIds ?? player.hand.slice(0, cost.amount);
        if (
          selected.length !== cost.amount ||
          new Set(selected).size !== selected.length ||
          selected.some((instanceId) => !player.hand.includes(instanceId))
        ) {
          return false;
        }
        break;
      }
      case "returnTrashToDeck": {
        const candidates = candidatesForReturnTrashToDeckCost(
          state,
          controller,
          sourceInstanceId,
          cost,
        );
        const selected = costPaymentIds ?? candidates.slice(0, cost.amount);
        if (
          selected.length !== cost.amount ||
          new Set(selected).size !== selected.length ||
          selected.some((instanceId) => !candidates.includes(instanceId))
        ) {
          return false;
        }
        break;
      }
      case "returnThisToDeck": {
        const source = getInstance(state, sourceInstanceId);
        if (source.controller !== controller) {
          return false;
        }
        break;
      }
      case "returnThisAndHandToDeck": {
        const player = getPlayer(state, controller);
        const source = getInstance(state, sourceInstanceId);
        if (source.controller !== controller || player.hand.length < cost.handAmount) {
          return false;
        }
        if (costPaymentIds) {
          const selectedHandIds = costPaymentIds.filter(
            (instanceId) => instanceId !== sourceInstanceId,
          );
          if (
            costPaymentIds.length !== cost.handAmount + 1 ||
            new Set(costPaymentIds).size !== costPaymentIds.length ||
            !costPaymentIds.includes(sourceInstanceId) ||
            selectedHandIds.length !== cost.handAmount ||
            selectedHandIds.some((instanceId) => !player.hand.includes(instanceId))
          ) {
            return false;
          }
        }
        break;
      }
      case "turnLifeFaceUp":
        if (getPlayer(state, controller).life.length < cost.count) {
          return false;
        }
        if (
          getPlayer(state, controller)
            .life.slice(0, cost.count)
            .some((instanceId) => getInstance(state, instanceId).faceUp === (cost.faceUp ?? true))
        ) {
          return false;
        }
        break;
      case "addLifeToHand": {
        const player = getPlayer(state, controller);
        if (
          player.life.length < cost.amount ||
          hasFlagModifier(state, player.leaderInstanceId, "cannotAddLifeToHandByOwnEffect")
        ) {
          return false;
        }
        if (
          cost.position === "choice" &&
          player.life.length > 1 &&
          costPaymentIds !== undefined &&
          (costPaymentIds.length !== 1 ||
            (costPaymentIds[0] !== "top" && costPaymentIds[0] !== "bottom"))
        ) {
          return false;
        }
        break;
      }
      case "restCards": {
        const candidates = candidatesForRestCardsCost(state, controller, sourceInstanceId, cost);
        const selected =
          costPaymentIdsByType?.restCards ?? costPaymentIds ?? candidates.slice(0, cost.amount);
        if (
          selected.length !== cost.amount ||
          new Set(selected).size !== selected.length ||
          selected.some((instanceId) => !candidates.includes(instanceId))
        ) {
          return false;
        }
        break;
      }
      case "koCharacter": {
        const candidates = candidatesForKoCharacterCost(state, controller, sourceInstanceId, cost);
        const selected = costPaymentIds ?? candidates.slice(0, cost.amount);
        if (
          selected.length !== cost.amount ||
          new Set(selected).size !== selected.length ||
          selected.some((instanceId) => !candidates.includes(instanceId))
        ) {
          return false;
        }
        break;
      }
      case "trashCharacter": {
        const candidates = candidatesForTrashCharacterCost(
          state,
          controller,
          sourceInstanceId,
          cost,
        );
        const selected = costPaymentIds ?? candidates.slice(0, cost.amount);
        if (
          selected.length !== cost.amount ||
          new Set(selected).size !== selected.length ||
          selected.some((instanceId) => !candidates.includes(instanceId))
        ) {
          return false;
        }
        break;
      }
      case "returnCharacter": {
        const candidates = candidatesForReturnCharacterCost(
          state,
          controller,
          sourceInstanceId,
          cost,
        );
        const selected =
          costPaymentIdsByType?.returnCharacter ??
          costPaymentIds ??
          candidates.slice(0, cost.amount);
        if (
          selected.length !== cost.amount ||
          new Set(selected).size !== selected.length ||
          selected.some((instanceId) => !candidates.includes(instanceId))
        ) {
          return false;
        }
        break;
      }
      case "revealFromHand": {
        const candidates = candidatesForRevealFromHandCost(
          state,
          controller,
          sourceInstanceId,
          cost,
        );
        const selected = costPaymentIds ?? candidates.slice(0, cost.amount);
        if (
          selected.length !== cost.amount ||
          new Set(selected).size !== selected.length ||
          selected.some((instanceId) => !candidates.includes(instanceId))
        ) {
          return false;
        }
        break;
      }
    }
  }

  return true;
}

export function payCosts(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  costs: Cost[] | undefined,
  trashHandIds: string[] | undefined,
  costPaymentIds?: string[],
  costPaymentIdsByType?: {
    giveDon?: string[];
    restCards?: string[];
    returnCharacter?: string[];
  },
): boolean {
  if (!costs?.length) {
    return true;
  }

  if (
    !canPayCosts(
      state,
      controller,
      sourceInstanceId,
      costs,
      trashHandIds,
      costPaymentIds,
      costPaymentIdsByType,
    )
  ) {
    return false;
  }

  for (const cost of costs) {
    switch (cost.cost) {
      case "restDon":
        getPlayer(state, controller).activeDon -= cost.amount;
        getPlayer(state, controller).restedDon += cost.amount;
        break;
      case "giveDon": {
        const player = getPlayer(state, controller);
        const targetId = (costPaymentIdsByType?.giveDon ?? [player.leaderInstanceId])[0]!;
        player.activeDon -= cost.amount;
        getInstance(state, targetId).attachedDon += cost.amount;
        emitLog(
          state,
          controller,
          `${effectSourceName(state, sourceInstanceId)} gives ${cost.amount} active DON!! to ${cardName(getCardForInstance(state, targetId))} as an activation cost.`,
          {
            sourceCardId: getInstance(state, sourceInstanceId).cardId,
            sourceInstanceId,
            targetIds: [targetId],
            visibility: "public",
          },
        );
        break;
      }
      case "returnDon": {
        const minimumAmount = cost.minimumAmount ?? cost.amount;
        const selectedIds =
          costPaymentIds ??
          returnDonCostOptions(state, controller)
            .slice(0, minimumAmount)
            .map((option) => option.id);
        returnSelectedDonToDeck(state, controller, selectedIds, sourceInstanceId, controller);
        break;
      }
      case "restThisCard":
        restCard(state, sourceInstanceId, controller);
        break;
      case "modifyLeaderPower": {
        const leaderId = getPlayer(state, controller).leaderInstanceId;
        addModifier(state, sourceInstanceId, leaderId, {
          type: "power",
          value: cost.value,
          duration: cost.duration,
          expiresAtTurn: state.turnNumber,
          expiresAtBattleId: null,
          expiresOnTurnStartOfSeat: null,
        });
        emitLog(
          state,
          controller,
          `${effectSourceName(state, sourceInstanceId)} gives ${cardName(getCardForInstance(state, leaderId))} ${cost.value} power during this turn as an activation cost.`,
          {
            sourceCardId: getInstance(state, sourceInstanceId).cardId,
            sourceInstanceId,
            targetIds: [leaderId],
            visibility: "public",
          },
        );
        break;
      }
      case "trashThisCard": {
        const source = getInstance(state, sourceInstanceId);
        returnAttachedDonToCostArea(state, sourceInstanceId);
        moveCard(state, sourceInstanceId, source.owner, "trash", {
          faceUp: true,
          publicKnowledge: true,
          actor: controller,
        });
        break;
      }
      case "returnThisToHand": {
        const source = getInstance(state, sourceInstanceId);
        returnAttachedDonToCostArea(state, sourceInstanceId);
        moveCard(state, sourceInstanceId, source.owner, "hand", {
          faceUp: false,
          publicKnowledge: false,
          actor: controller,
        });
        break;
      }
      case "trashFromHand": {
        const seat = controller;
        const selected =
          trashHandIds ??
          candidatesForTrashFromHandCost(state, seat, sourceInstanceId, cost).slice(0, cost.amount);
        for (const instanceId of selected) {
          returnAttachedDonToCostArea(state, instanceId);
          moveCard(state, instanceId, getInstance(state, instanceId).owner, "trash", {
            faceUp: true,
            publicKnowledge: true,
            actor: controller,
            visibility: "private",
          });
        }
        break;
      }
      case "playCard": {
        const candidates = candidatesForPlayCardCost(state, controller, sourceInstanceId, cost);
        const selected = costPaymentIds ?? candidates.slice(0, cost.amount);
        for (const instanceId of selected) {
          if (!playCardFromEffect(state, controller, instanceId, "active", sourceInstanceId)) {
            return false;
          }
        }
        break;
      }
      case "trashCard": {
        const candidates = candidatesForTrashCardCost(state, controller, sourceInstanceId, cost);
        const selected = costPaymentIds ?? candidates.slice(0, cost.amount);
        for (const instanceId of selected) {
          returnAttachedDonToCostArea(state, instanceId);
          moveCard(state, instanceId, getInstance(state, instanceId).owner, "trash", {
            faceUp: true,
            publicKnowledge: true,
            actor: controller,
          });
        }
        break;
      }
      case "trashLife": {
        const player = getPlayer(state, controller);
        const position =
          cost.position === "choice"
            ? costPaymentIds?.[0] === "bottom"
              ? "bottom"
              : "top"
            : cost.position;
        const selected =
          position === "bottom"
            ? player.life.slice(-cost.amount)
            : player.life.slice(0, cost.amount);
        for (const instanceId of selected) {
          moveCard(state, instanceId, getInstance(state, instanceId).owner, "trash", {
            faceUp: true,
            publicKnowledge: true,
            actor: controller,
            sourceInstanceId,
            visibility: "public",
          });
        }
        break;
      }
      case "returnCharacterToDeck": {
        const candidates = candidatesForReturnCharacterToDeckCost(
          state,
          controller,
          sourceInstanceId,
          cost,
        );
        const selected = costPaymentIds ?? candidates.slice(0, cost.amount);
        for (const instanceId of selected) {
          const owner = getInstance(state, instanceId).owner;
          returnAttachedDonToCostArea(state, instanceId);
          moveCard(state, instanceId, owner, "deck", {
            deckPosition: cost.position,
            faceUp: false,
            publicKnowledge: false,
            actor: controller,
          });
        }
        break;
      }
      case "returnHandToDeck": {
        const player = getPlayer(state, controller);
        const selected = costPaymentIds ?? player.hand.slice(0, cost.amount);
        for (const instanceId of selected) {
          moveCard(state, instanceId, controller, "deck", {
            deckPosition: cost.position,
            faceUp: false,
            publicKnowledge: false,
            actor: controller,
            visibility: "private",
          });
        }
        break;
      }
      case "returnTrashToDeck": {
        const candidates = candidatesForReturnTrashToDeckCost(
          state,
          controller,
          sourceInstanceId,
          cost,
        );
        const selected = costPaymentIds ?? candidates.slice(0, cost.amount);
        const publiclyRevealedIds = [...selected].sort((left, right) => left.localeCompare(right));
        emitLog(
          state,
          controller,
          `${getPlayer(state, controller).playerName} returns ${formatCardList(state, publiclyRevealedIds)} from trash to the ${cost.position} of their deck in a private order.`,
          {
            sourceCardId: getInstance(state, sourceInstanceId).cardId,
            sourceInstanceId,
            targetIds: publiclyRevealedIds,
            visibility: "public",
          },
        );
        const movementOrder = cost.position === "top" ? [...selected].reverse() : selected;
        for (const instanceId of movementOrder) {
          moveCard(state, instanceId, controller, "deck", {
            deckPosition: cost.position,
            faceUp: false,
            publicKnowledge: false,
            actor: controller,
            sourceInstanceId,
            visibility: "public",
            suppressLog: true,
            redactIdentity: true,
          });
        }
        break;
      }
      case "returnThisToDeck": {
        const source = getInstance(state, sourceInstanceId);
        returnAttachedDonToCostArea(state, sourceInstanceId);
        moveCard(state, sourceInstanceId, source.owner, "deck", {
          deckPosition: cost.position,
          faceUp: false,
          publicKnowledge: false,
          actor: controller,
        });
        break;
      }
      case "returnThisAndHandToDeck": {
        const player = getPlayer(state, controller);
        const selected = costPaymentIds ?? [
          sourceInstanceId,
          ...player.hand.slice(0, cost.handAmount),
        ];
        for (const instanceId of selected) {
          if (instanceId === sourceInstanceId) {
            returnAttachedDonToCostArea(state, instanceId);
          }
          moveCard(state, instanceId, controller, "deck", {
            deckPosition: cost.position,
            faceUp: false,
            publicKnowledge: false,
            actor: controller,
            visibility: "private",
          });
        }
        break;
      }
      case "restCards": {
        const selected =
          costPaymentIdsByType?.restCards ??
          costPaymentIds ??
          candidatesForRestCardsCost(state, controller, sourceInstanceId, cost).slice(
            0,
            cost.amount,
          );
        for (const instanceId of selected) {
          restCard(state, instanceId, controller);
        }
        break;
      }
      case "koCharacter": {
        const candidates = candidatesForKoCharacterCost(state, controller, sourceInstanceId, cost);
        const selected = costPaymentIds ?? candidates.slice(0, cost.amount);
        for (const instanceId of selected) {
          koCharacterByEffect(state, instanceId, controller, sourceInstanceId);
        }
        break;
      }
      case "trashCharacter": {
        const candidates = candidatesForTrashCharacterCost(
          state,
          controller,
          sourceInstanceId,
          cost,
        );
        const selected = costPaymentIds ?? candidates.slice(0, cost.amount);
        for (const instanceId of selected) {
          returnAttachedDonToCostArea(state, instanceId);
          moveCard(state, instanceId, getInstance(state, instanceId).owner, "trash", {
            faceUp: true,
            publicKnowledge: true,
            actor: controller,
          });
        }
        break;
      }
      case "turnLifeFaceUp": {
        const lifeIds = getPlayer(state, controller).life.slice(0, cost.count);
        const faceUp = cost.faceUp ?? true;
        for (const instanceId of lifeIds) {
          const instance = getInstance(state, instanceId);
          instance.faceUp = faceUp;
          instance.publicKnowledge = faceUp;
        }
        emitLog(
          state,
          controller,
          faceUp
            ? `${getPlayer(state, controller).playerName} turns ${formatCardList(state, lifeIds)} face-up in Life.`
            : `${getPlayer(state, controller).playerName} turns ${lifeIds.length} Life card(s) face-down.`,
          {
            sourceCardId: getInstance(state, sourceInstanceId).cardId,
            sourceInstanceId,
            ...(faceUp && { targetIds: lifeIds }),
            visibility: "public",
          },
        );
        break;
      }
      case "addLifeToHand": {
        const player = getPlayer(state, controller);
        const position =
          cost.position === "choice" ? (costPaymentIds?.[0] ?? "top") : (cost.position ?? "top");
        const selected =
          position === "bottom"
            ? player.life.slice(-cost.amount)
            : player.life.slice(0, cost.amount);
        for (const instanceId of selected) {
          moveCard(state, instanceId, controller, "hand", {
            faceUp: false,
            publicKnowledge: false,
            actor: controller,
            sourceInstanceId,
            visibility: "private",
          });
        }
        break;
      }
      case "returnCharacter": {
        const candidates = candidatesForReturnCharacterCost(
          state,
          controller,
          sourceInstanceId,
          cost,
        );
        const selected =
          costPaymentIdsByType?.returnCharacter ??
          costPaymentIds ??
          candidates.slice(0, cost.amount);
        for (const instanceId of selected) {
          returnAttachedDonToCostArea(state, instanceId);
          moveCard(state, instanceId, controller, "hand", {
            faceUp: false,
            publicKnowledge: false,
            actor: controller,
            sourceInstanceId,
            visibility: "private",
          });
        }
        break;
      }
      case "revealFromHand": {
        const candidates = candidatesForRevealFromHandCost(
          state,
          controller,
          sourceInstanceId,
          cost,
        );
        const selected = costPaymentIds ?? candidates.slice(0, cost.amount);
        emitLog(
          state,
          controller,
          `${getPlayer(state, controller).playerName} reveals ${formatCardList(state, selected)} from hand.`,
          {
            sourceCardId: getInstance(state, sourceInstanceId).cardId,
            sourceInstanceId,
            targetIds: selected,
            visibility: "public",
          },
        );
        break;
      }
    }
  }

  return true;
}

export function candidatesForRevealFromHandCost(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  cost: RevealFromHandCost,
): string[] {
  return getPlayer(state, controller).hand.filter((instanceId) =>
    (cost.filters ?? []).every((filter) => {
      const result = matchesTargetFilter(state, sourceInstanceId, instanceId, filter);
      return result.supported && result.matches;
    }),
  );
}
