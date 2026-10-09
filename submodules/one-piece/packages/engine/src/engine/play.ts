import { requestCommandDonPayment } from "./command-don-payment.ts";
import { transferDonIdentities } from "./don-state.ts";
import { getCard } from "../../../cards/src/runtime-catalog.ts";
import { isPlayedRestedByPermanentEffect } from "../effects/permanent.ts";
import {
  cardName,
  effectBlocksFor,
  emitEvent,
  emitLog,
  enqueueEffectsForTrigger,
  enqueueInPlayEffectsForTrigger,
  enqueueMirroredInPlayEffectsForTrigger,
  getPaidPlayCost,
  getCardForInstance,
  getInstance,
  getPlayer,
} from "../shared.ts";
import { consumeNextPlayCostModifiers, createChoicePrompt, moveCard } from "../state.ts";
import type { EngineCommand, MatchSeat, MatchState, PromptState } from "../types.ts";

export function revealCardPlay(state: MatchState, seat: MatchSeat, instanceId: string): void {
  const instance = getInstance(state, instanceId);
  if (instance.publicKnowledge) return;
  instance.publicKnowledge = true;
  const card = getCard(instance.cardId);
  emitLog(
    state,
    seat,
    `${getPlayer(state, seat).playerName} reveals ${cardName(card)} to ${card.cardType === "event" ? "activate" : "play"} it.`,
    {
      sourceCardId: card.id,
      sourceInstanceId: instanceId,
      targetIds: [instanceId],
      visibility: "public",
    },
  );
}

// Cost is paid before playing (2-7-2), including before full-field rule trash.
export function payCharacterPlayCost(
  state: MatchState,
  seat: MatchSeat,
  instanceId: string,
  selectedDonIds?: string[],
): number {
  const player = getPlayer(state, seat);
  const cardCost = getPaidPlayCost(state, instanceId);
  transferDonIdentities(
    state,
    { seat, area: "active" },
    { seat, area: "rested" },
    cardCost,
    selectedDonIds,
  );
  player.activeDon -= cardCost;
  player.restedDon += cardCost;
  consumeNextPlayCostModifiers(state, instanceId);
  return cardCost;
}

// The saved full-field continuation has already paid; never price/pay it again.
export function completeCharacterPlayFromHand(
  state: MatchState,
  seat: MatchSeat,
  instanceId: string,
  slotIndex: number,
  selectedDonIds?: string[],
  paidCost?: number,
) {
  const player = getPlayer(state, seat);
  const card = getCard(getInstance(state, instanceId).cardId);
  if (paidCost === undefined) payCharacterPlayCost(state, seat, instanceId, selectedDonIds);
  moveCard(state, instanceId, seat, "character", {
    slotIndex,
    faceUp: true,
    publicKnowledge: true,
    actor: seat,
    // The public "plays X." line below is the player-facing record; the raw
    // zone-movement line would duplicate it.
    suppressLog: true,
  });
  getInstance(state, instanceId).playedOnTurn = state.turnNumber;
  getInstance(state, instanceId).rested = isPlayedRestedByPermanentEffect(state, seat, instanceId);

  emitEvent(state, "cardPlayed", seat, {
    sourceCardId: card.id,
    sourceInstanceId: instanceId,
    visibility: "public",
  });
  emitLog(state, seat, `${player.playerName} plays ${cardName(card)}.`, {
    sourceCardId: card.id,
    sourceInstanceId: instanceId,
    visibility: "public",
  });
  enqueueEffectsForTrigger(state, instanceId, seat, "onPlay", undefined);
  const triggerEvent = {
    instanceId,
    effectController: seat,
    fromZone: "hand" as const,
  };
  enqueueMirroredInPlayEffectsForTrigger(
    state,
    seat,
    "whenYouPlayCharacter",
    "whenOpponentPlaysCharacter",
    triggerEvent,
  );
  if (
    card.cardType === "character" &&
    (card.trigger || effectBlocksFor(card, "trigger").length > 0)
  ) {
    // Printed as "when you play a Character with a [Trigger]" (e.g. Jewelry
    // Bonney OP13-100), so only the playing player's in-play cards react.
    enqueueInPlayEffectsForTrigger(state, "whenTriggerCharacterPlayed", triggerEvent, [seat]);
  }
}

// 3-7-6-1: with 5 Characters in the Character area, a player who wants to
// play a new Character reveals it and trashes 1 of their Characters first.
export function projectCharacterReplacementPrompt(
  state: MatchState,
  seat: MatchSeat,
  instanceId: string,
  paidCost?: number,
) {
  const player = getPlayer(state, seat);
  const card = getCard(getInstance(state, instanceId).cardId);
  revealCardPlay(state, seat, instanceId);
  const candidateIds = player.characterArea.filter((entry): entry is string => Boolean(entry));
  createChoicePrompt(state, {
    choiceKind: "selectCards",
    seat,
    label: `${player.playerName} trashes 1 Character to play ${cardName(card)}.`,
    details: "Select 1 of your Characters to trash.",
    sourceCardId: card.id,
    sourceInstanceId: instanceId,
    eventId: null,
    options: candidateIds.map((candidateId) => ({
      id: candidateId,
      label: cardName(getCardForInstance(state, candidateId)),
      value: candidateId,
      targetId: candidateId,
    })),
    minSelections: 1,
    maxSelections: 1,
    context: {},
    resolutionContext: {
      intent: "playCharacterReplacement",
      paidCost,
      sourceGeneration: getInstance(state, instanceId).zoneChangeCounter,
      controller: seat,
      instanceId,
      candidateIds,
    },
  });
}

export function resolveCharacterReplacementPrompt(
  state: MatchState,
  prompt: PromptState,
  command: Extract<EngineCommand, { type: "resolvePrompt"; seat: MatchSeat }>,
): boolean {
  const context = prompt.resolutionContext;
  if (context?.intent !== "playCharacterReplacement") {
    return false;
  }
  const selectedIds = command.selectedIds ?? (command.optionId ? [command.optionId] : []);
  const player = getPlayer(state, context.controller);
  const instance = getInstance(state, context.instanceId);
  if (
    selectedIds.length !== 1 ||
    selectedIds.some(
      (selectedId) =>
        !context.candidateIds.includes(selectedId) || !player.characterArea.includes(selectedId),
    ) ||
    instance.controller !== context.controller ||
    instance.zone !== "hand" ||
    (context.sourceGeneration !== undefined &&
      instance.zoneChangeCounter !== context.sourceGeneration) ||
    (context.paidCost === undefined &&
      player.activeDon < getPaidPlayCost(state, context.instanceId))
  ) {
    return false;
  }
  // Legacy saved prompts predate paidCost. Pay before any rule trash, and
  // if physical selection is needed resume a fresh normal play first.
  let paidCost = context.paidCost;
  if (paidCost === undefined) {
    const payment = requestCommandDonPayment(
      state,
      { type: "playCard", seat: context.controller, instanceId: context.instanceId },
      getPaidPlayCost(state, context.instanceId),
      context.instanceId,
    );
    if (payment === "prompt") return true;
    if (payment === "invalid") return false;
    paidCost = payCharacterPlayCost(state, context.controller, context.instanceId);
  }
  const trashedId = selectedIds[0]!;
  const slotIndex = player.characterArea.indexOf(trashedId);
  const trashedInstance = getInstance(state, trashedId);
  // 3-7-6-1-1: this trash processes a rule, so no effect can be applied — it
  // is not a K.O. (10-2-1-3) and dispatches no triggers or replacements.
  // Return any attached DON!! to the cost area before the Character leaves play.
  if (trashedInstance.attachedDon > 0) {
    transferDonIdentities(
      state,
      { attachedTo: trashedId },
      { seat: trashedInstance.owner, area: "rested" },
      trashedInstance.attachedDon,
    );
    getPlayer(state, trashedInstance.owner).restedDon += trashedInstance.attachedDon;
    trashedInstance.attachedDon = 0;
  }
  moveCard(state, trashedId, trashedInstance.owner, "trash", {
    faceUp: true,
    publicKnowledge: true,
    actor: context.controller,
  });
  completeCharacterPlayFromHand(
    state,
    context.controller,
    context.instanceId,
    slotIndex,
    undefined,
    paidCost,
  );
  return true;
}
