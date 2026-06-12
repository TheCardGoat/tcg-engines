import type { CardInstanceId } from "../types/branded.ts";
import type { MoveDefinition, MoveInput } from "../types/commands.ts";
import { processCardSpentEventsSince, processEventTriggers } from "../ability-executor.ts";
import { defOf } from "../state/lookups.ts";
import { availableEddies } from "./eddie-resources.ts";

export interface GoSoloInput extends MoveInput {
  args: {
    cardId: string;
  };
}

export const goSoloMove: MoveDefinition<GoSoloInput> = {
  available({ state, playerId }) {
    const player = state.G.players[playerId as string];
    if (!player) return false;
    if (state.G.gamePhase !== "main") return false;
    if (state.G.attackState) return false;
    if (state.G.turnMetadata.activePlayerId !== playerId) return false;

    return player.zones.legendArea.some((id) => {
      const card = state.G.cardIndex[id as string];
      if (!card || card.meta.faceDown) return false;
      const def = defOf(card);
      return (
        def.keywords.includes("goSolo") &&
        availableEddies(state as import("../types/match-state.ts").MatchState, playerId) >=
          (def.cost ?? 0)
      );
    });
  },

  validate({ state, playerId, input }) {
    const { cardId } = input.args;
    const player = state.G.players[playerId as string];
    if (!player) return { valid: false, error: "Player not found", errorCode: "PLAYER_NOT_FOUND" };
    if (state.G.gamePhase !== "main")
      return { valid: false, error: "Not in main phase", errorCode: "WRONG_PHASE" };
    if (state.G.attackState)
      return { valid: false, error: "Attack in progress", errorCode: "ATTACK_IN_PROGRESS" };
    if (state.G.turnMetadata.activePlayerId !== playerId)
      return { valid: false, error: "Not your turn", errorCode: "NOT_YOUR_TURN" };
    if (!player.zones.legendArea.includes(cardId as CardInstanceId)) {
      return { valid: false, error: "Legend not in legend area", errorCode: "CARD_NOT_FOUND" };
    }

    const card = state.G.cardIndex[cardId];
    if (!card)
      return { valid: false, error: "Card instance not found", errorCode: "CARD_NOT_FOUND" };
    if (card.meta.faceDown) {
      return { valid: false, error: "Legend is face-down", errorCode: "CARD_FACE_DOWN" };
    }

    const def = defOf(card);
    if (!def.keywords.includes("goSolo")) {
      return { valid: false, error: "Card does not have GO SOLO", errorCode: "NO_GO_SOLO" };
    }
    const cost = def.cost ?? 0;
    if (availableEddies(state as import("../types/match-state.ts").MatchState, playerId) < cost) {
      return { valid: false, error: "Not enough eddies", errorCode: "INSUFFICIENT_EDDIES" };
    }

    return { valid: true };
  },

  execute({ state, playerId, input, operations }) {
    const { cardId } = input.args;
    const card = state.G.cardIndex[cardId];
    if (!card) return;

    const def = defOf(card);
    const cost = def.cost ?? 0;
    const eventsBeforePayment = operations.event.getEmittedEvents().length;
    operations.game.spendEddies(playerId, cost, "goSolo");
    operations.zone.moveCard(cardId as CardInstanceId, "field", playerId);
    operations.card.ready(cardId as CardInstanceId);
    operations.card.setPlayedThisTurn(cardId as CardInstanceId, false);

    const cardPlayedEvent = {
      type: "cardPlayed",
      cardId: cardId as CardInstanceId,
      playerId,
      cost,
    } as const;
    operations.event.emit(cardPlayedEvent);

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

    operations.event.emit({
      type: "actionLog",
      messageKey: "move.playCard",
      params: { cardName: def.displayName, cost },
      playerId,
    });
  },
};
