import type { CardInstanceId } from "../types/branded.ts";
import type { MoveDefinition, MoveInput } from "../types/commands.ts";
import { processCardSpentEventsSince, processEventTriggers } from "../ability-executor.ts";
import { defOf } from "../state/lookups.ts";
import { computeEffectiveCost, consumeCostModifierUse } from "./compute-effective-cost.ts";
import { availableEddies, canSpendSelectedEddies } from "./eddie-resources.ts";
import { isReactStep } from "./is-react-step.ts";
import { listLegalGearAttachHosts } from "../state/gear-attachment.ts";

export interface PlayCardInput extends MoveInput {
  args: {
    cardId: string;
    attachToId?: string;
    paymentSourceIds?: string[];
  };
}

export const playCardMove: MoveDefinition<PlayCardInput> = {
  available({ state, playerId }) {
    const player = state.G.players[playerId as string];
    if (!player) return false;
    if (state.G.gamePhase !== "main") return false;

    const isDefending = isReactStep(state, playerId);
    if (state.G.attackState && !isDefending) return false;
    if (!isDefending && state.G.turnMetadata.activePlayerId !== playerId) return false;

    if (isDefending) {
      // During react step, only QUICK cards can be played.
      return player.zones.hand.some((id) => {
        const card = state.G.cardIndex[id as string];
        return card && defOf(card).keywords.includes("quick");
      });
    }

    return player.zones.hand.length > 0;
  },

  validate({ state, playerId, input }) {
    const { cardId, attachToId } = input.args;
    const player = state.G.players[playerId as string];
    if (!player) return { valid: false, error: "Player not found", errorCode: "PLAYER_NOT_FOUND" };
    if (state.G.gamePhase !== "main")
      return { valid: false, error: "Not in main phase", errorCode: "WRONG_PHASE" };

    const isDefending = isReactStep(state, playerId);
    if (state.G.attackState && !isDefending) {
      return { valid: false, error: "Attack in progress", errorCode: "ATTACK_IN_PROGRESS" };
    }
    if (!isDefending && state.G.turnMetadata.activePlayerId !== playerId)
      return { valid: false, error: "Not your turn", errorCode: "NOT_YOUR_TURN" };

    const card = state.G.cardIndex[cardId];
    if (card && isDefending && !defOf(card).keywords.includes("quick")) {
      return {
        valid: false,
        error: "Can only play QUICK cards as a reaction",
        errorCode: "NOT_QUICK",
      };
    }

    if (!player.zones.hand.includes(cardId as CardInstanceId)) {
      return { valid: false, error: "Card not in hand", errorCode: "CARD_NOT_IN_HAND" };
    }

    if (!card)
      return { valid: false, error: "Card instance not found", errorCode: "CARD_NOT_FOUND" };

    const def = defOf(card);
    if (def.type === "gear") {
      if (!attachToId) {
        return {
          valid: false,
          error: "Gear must be played attached to a friendly Unit or face-up Legend",
          errorCode: "INVALID_ATTACH_TARGET",
        };
      }
      const legalHosts = listLegalGearAttachHosts(
        state as import("../types/match-state.ts").MatchState,
        cardId as CardInstanceId,
        playerId,
      );
      if (!legalHosts.includes(attachToId)) {
        return {
          valid: false,
          error: `Entity "${attachToId}" is not a legal Gear attach target`,
          errorCode: "INVALID_ATTACH_TARGET",
        };
      }
    } else if (attachToId) {
      return {
        valid: false,
        error: "Only Gear can have an attachment host",
        errorCode: "INVALID_ARGS",
      };
    }

    const cost = computeEffectiveCost(
      state as import("../types/match-state.ts").MatchState,
      cardId as CardInstanceId,
      playerId,
    );
    if (availableEddies(state as import("../types/match-state.ts").MatchState, playerId) < cost) {
      return { valid: false, error: "Not enough eddies", errorCode: "INSUFFICIENT_EDDIES" };
    }
    if (
      input.args.paymentSourceIds !== undefined &&
      !canSpendSelectedEddies(
        state.G,
        playerId,
        cost,
        input.args.paymentSourceIds as CardInstanceId[],
      )
    ) {
      return { valid: false, error: "Invalid payment sources", errorCode: "INVALID_PAYMENT" };
    }

    return { valid: true };
  },

  execute({ state, playerId, input, operations }) {
    const { cardId, attachToId, paymentSourceIds } = input.args;
    const player = state.G.players[playerId as string];
    const card = state.G.cardIndex[cardId];

    if (!player || !card) return;

    const def = defOf(card);
    const cost = computeEffectiveCost(
      state as import("../types/match-state.ts").MatchState,
      cardId as CardInstanceId,
      playerId,
    );
    const eventsBeforePayment = operations.event.getEmittedEvents().length;
    operations.game.spendEddies(
      playerId,
      cost,
      "playCard",
      paymentSourceIds === undefined ? {} : { sourceIds: paymentSourceIds as CardInstanceId[] },
    );
    consumeCostModifierUse(
      state as import("../types/match-state.ts").MatchState,
      cardId as CardInstanceId,
      playerId,
    );

    if (def.type === "program") {
      operations.zone.moveCard(cardId as CardInstanceId, "trash", playerId);
    } else if (def.type === "gear" && attachToId) {
      operations.zone.moveCard(cardId as CardInstanceId, "field", playerId);
      operations.card.attachGear(cardId as CardInstanceId, attachToId as CardInstanceId);
    } else if (def.type === "unit") {
      operations.zone.moveCard(cardId as CardInstanceId, "field", playerId);
      operations.card.moveAttachedGear(cardId as CardInstanceId, "field");
      operations.card.setHasLag(cardId as CardInstanceId, true);
    }

    const cardPlayedEvent = {
      type: "cardPlayed" as const,
      cardId: cardId as CardInstanceId,
      playerId,
      cost,
    };
    operations.event.emit(cardPlayedEvent);

    const isGearAttach = def.type === "gear" && attachToId != null;
    const attachedToCard = isGearAttach ? state.G.cardIndex[attachToId!] : undefined;
    operations.event.emit({
      type: "actionLog",
      messageKey: isGearAttach ? "move.playCard.gear" : "move.playCard",
      params: {
        cardName: def.displayName,
        cost,
        ...(isGearAttach && attachedToCard
          ? { attachedToName: defOf(attachedToCard).displayName }
          : {}),
      },
      playerId,
    });

    processCardSpentEventsSince(
      eventsBeforePayment,
      state as import("../types/match-state.ts").MatchState,
      operations,
    );

    processEventTriggers(
      cardPlayedEvent,
      state as import("../types/match-state.ts").MatchState,
      operations,
    );
  },
};
