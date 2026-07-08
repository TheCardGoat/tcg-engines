import type { CardInstanceId } from "../types/branded.ts";
import type { MoveDefinition, MoveInput } from "../types/commands.ts";
import type { ChooseCardToPlayPendingChoice } from "../types/match-state.ts";
import type { MatchState } from "../types/match-state.ts";
import {
  executeAbilityEffects,
  processCardSpentEventsSince,
  processEventTriggers,
  resumeCurrentTrigger,
} from "../ability-executor.ts";
import type { ResolutionContext } from "../effects/target-resolver.ts";
import { defOf } from "../state/lookups.ts";
import { computeEffectiveCost, consumeCostModifierUse } from "./compute-effective-cost.ts";
import { availableEddies } from "./eddie-resources.ts";

export interface ResolveCardToPlayInput extends MoveInput {
  args: {
    cardId: string;
  };
}

export const resolveCardToPlayMove: MoveDefinition<ResolveCardToPlayInput> = {
  handlesPendingChoice: true,
  available({ state, playerId }) {
    const choice = state.G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseCardToPlay") return false;
    return (choice.chooserId as string) === (playerId as string);
  },

  validate({ state, playerId, input }) {
    const choice = state.G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseCardToPlay") {
      return { valid: false, error: "No chooseCardToPlay pending", errorCode: "NO_PENDING_CHOICE" };
    }
    if ((choice.chooserId as string) !== (playerId as string)) {
      return { valid: false, error: "Not your choice to resolve", errorCode: "NOT_YOUR_CHOICE" };
    }
    const { cardId } = input.args;
    const typedChoice = choice as ChooseCardToPlayPendingChoice;
    if (!typedChoice.payload.cardIds.includes(cardId as CardInstanceId)) {
      return { valid: false, error: "Card is not a valid choice", errorCode: "INVALID_CHOICE" };
    }
    if (!typedChoice.payload.free) {
      const cost = computeEffectiveCost(state as MatchState, cardId as CardInstanceId, playerId);
      if (availableEddies(state as MatchState, playerId) < cost) {
        return { valid: false, error: "Not enough eddies", errorCode: "INSUFFICIENT_EDDIES" };
      }
    }
    return { valid: true };
  },

  execute({ state, playerId, input, operations }) {
    const choice = state.G.turnMetadata.pendingChoice as ChooseCardToPlayPendingChoice;
    const { cardId } = input.args;
    const card = state.G.cardIndex[cardId];
    if (!card) return;

    const {
      free,
      resolvedAttachToId,
      boundTargets,
      sourceCardId,
      sourcePlayerId,
      abilityIndex,
      ifEffects,
    } = choice.payload;
    const def = defOf(card);
    const eventsBeforePayment = operations.event.getEmittedEvents().length;

    const cost = free
      ? 0
      : computeEffectiveCost(state as MatchState, cardId as CardInstanceId, playerId);
    if (!free) {
      operations.game.spendEddies(playerId, cost, "playCard");
      consumeCostModifierUse(state as MatchState, cardId as CardInstanceId, playerId);
    }

    if (def.type === "gear" && resolvedAttachToId) {
      operations.zone.moveCard(cardId as CardInstanceId, "field", playerId);
      operations.card.attachGear(cardId as CardInstanceId, resolvedAttachToId as CardInstanceId);
    } else if (def.type === "program") {
      operations.zone.moveCard(cardId as CardInstanceId, "trash", playerId);
    } else {
      operations.zone.moveCard(cardId as CardInstanceId, "field", playerId);
      operations.card.moveAttachedGear(cardId as CardInstanceId, "field");
      if (def.type === "unit") {
        operations.card.setPlayedThisTurn(cardId as CardInstanceId, true);
      }
    }

    // Clear the old pending choice before emitting cardPlayed so that any new
    // pendingChoice set by downstream triggers (processEventTriggers below) is
    // not overwritten by this setPendingChoice(undefined) call.
    operations.game.setPendingChoice(undefined);

    const cardPlayedEvent = {
      type: "cardPlayed" as const,
      cardId: cardId as CardInstanceId,
      playerId,
      cost,
    };
    operations.event.emit(cardPlayedEvent);
    processCardSpentEventsSince(eventsBeforePayment, state as MatchState, operations);
    processEventTriggers(cardPlayedEvent, state as MatchState, operations);

    operations.event.emit({
      type: "actionLog",
      messageKey: "move.playCard",
      params: { cardName: def.displayName, cost },
      playerId,
    });

    if (
      ifEffects &&
      ifEffects.length > 0 &&
      sourceCardId &&
      sourcePlayerId &&
      abilityIndex !== undefined
    ) {
      const ctx: ResolutionContext = {
        state,
        sourceCardId,
        sourcePlayerId,
        abilityIndex,
        contextTargets: {},
        boundTargets: boundTargets ?? {},
      };
      const followupStatus = executeAbilityEffects(ifEffects, ctx, operations);
      if (followupStatus === "suspended") return;
    }

    resumeCurrentTrigger(state as MatchState, operations);
  },
};
