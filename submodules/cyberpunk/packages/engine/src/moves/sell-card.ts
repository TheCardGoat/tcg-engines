import type { CardInstanceId } from "../types/branded.ts";
import type { MoveDefinition, MoveInput } from "../types/commands.ts";
import { defOf, getDefinitionFor } from "../state/lookups.ts";

export interface SellCardInput extends MoveInput {
  args: {
    cardId: string;
  };
}

export const sellCardMove: MoveDefinition<SellCardInput> = {
  available({ state, playerId }) {
    const player = state.G.players[playerId as string];
    if (!player) return false;
    if (state.G.gamePhase !== "main") return false;
    if (state.G.attackState) return false;
    if (state.G.turnMetadata.activePlayerId !== playerId) return false;
    if (player.soldThisTurn) return false;
    return player.zones.hand.some((id) => {
      const card = state.G.cardIndex[id as string];
      return card && defOf(card).hasSellTag;
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
    if (player.soldThisTurn)
      return { valid: false, error: "Already sold this turn", errorCode: "ALREADY_SOLD" };

    if (!player.zones.hand.includes(cardId as CardInstanceId)) {
      return { valid: false, error: "Card not in hand", errorCode: "CARD_NOT_IN_HAND" };
    }

    const card = state.G.cardIndex[cardId];
    if (!card) return { valid: false, error: "Card not found", errorCode: "CARD_NOT_FOUND" };
    if (!defOf(card).hasSellTag) {
      return { valid: false, error: "Card does not have sell tag", errorCode: "NO_SELL_TAG" };
    }

    return { valid: true };
  },

  execute({ state, playerId, input, operations }) {
    const { cardId } = input.args;
    const player = state.G.players[playerId as string];
    if (!player) return;

    operations.zone.moveCard(cardId as CardInstanceId, "eddieArea", playerId);
    operations.game.markSoldThisTurn(playerId);

    player.eddieCardIds.push(cardId as CardInstanceId);
    operations.game.gainEddies(playerId, 1);

    const cardDef = state.G.cardIndex[cardId] ? getDefinitionFor(state.G, cardId) : undefined;
    operations.event.emit({
      type: "cardSold",
      cardId: cardId as CardInstanceId,
      playerId,
    });

    operations.event.emit({
      type: "actionLog",
      messageKey: "move.sellCard",
      params: { cardName: cardDef?.displayName ?? "" },
      playerId,
    });

    operations.log.emit({
      type: "sellCard",
      playerId,
      timestamp: Date.now(),
      turnNumber: state.G.turnMetadata.turnNumber,
      cardId: cardId as CardInstanceId,
      cardName: cardDef?.displayName ?? "",
    });
  },
};
