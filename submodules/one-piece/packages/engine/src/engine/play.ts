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
  getCardCost,
  getCardForInstance,
  getInstance,
  getPlayer,
} from "../shared.ts";
import { consumeNextPlayCostModifiers, createChoicePrompt, moveCard } from "../state.ts";
import type { EngineCommand, MatchSeat, MatchState, PromptState } from "../types.ts";

// Pays the cost, places the card, and publishes every normal play-from-hand
// event and trigger. Shared by the direct playCard path and the 3-7-6-1
// replacement flow so both complete an identical play.
export function completeCharacterPlayFromHand(
  state: MatchState,
  seat: MatchSeat,
  instanceId: string,
  slotIndex: number,
) {
  const player = getPlayer(state, seat);
  const card = getCard(getInstance(state, instanceId).cardId);
  const cardCost = getCardCost(state, instanceId);
  player.activeDon -= cardCost;
  player.restedDon += cardCost;
  consumeNextPlayCostModifiers(state, instanceId);
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
) {
  const player = getPlayer(state, seat);
  const card = getCard(getInstance(state, instanceId).cardId);
  getInstance(state, instanceId).publicKnowledge = true;
  emitLog(state, seat, `${player.playerName} reveals ${cardName(card)} to play it.`, {
    sourceCardId: card.id,
    sourceInstanceId: instanceId,
    targetIds: [instanceId],
    visibility: "public",
  });
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
    player.activeDon < getCardCost(state, context.instanceId)
  ) {
    return false;
  }
  const trashedId = selectedIds[0]!;
  const slotIndex = player.characterArea.indexOf(trashedId);
  const trashedInstance = getInstance(state, trashedId);
  // 3-7-6-1-1: this trash processes a rule, so no effect can be applied — it
  // is not a K.O. (10-2-1-3) and dispatches no triggers or replacements.
  // Return any attached DON!! to the cost area before the Character leaves play.
  if (trashedInstance.attachedDon > 0) {
    getPlayer(state, trashedInstance.owner).restedDon += trashedInstance.attachedDon;
    trashedInstance.attachedDon = 0;
  }
  moveCard(state, trashedId, trashedInstance.owner, "trash", {
    faceUp: true,
    publicKnowledge: true,
    actor: context.controller,
  });
  completeCharacterPlayFromHand(state, context.controller, context.instanceId, slotIndex);
  return true;
}
