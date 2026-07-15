import type { MoveDefinition, MoveInput } from "../types/commands.ts";

export interface ConcedeInput extends MoveInput {
  args: Record<string, never>;
}

export const concedeMove: MoveDefinition<ConcedeInput> = {
  handlesPendingChoice: true,

  available({ state, playerId: _playerId }) {
    return !state.G.gameEnded;
  },

  validate({ state }) {
    if (state.G.gameEnded) {
      return { valid: false, error: "Game already ended", errorCode: "GAME_ENDED" };
    }
    return { valid: true };
  },

  execute({ state, playerId, operations }) {
    const opponentId = state.ctx.playerIds.find((id) => id !== playerId)!;
    operations.game.endGame(opponentId, "concede");

    operations.event.emit({
      type: "actionLog",
      messageKey: "move.concede",
      params: {},
      playerId,
    });
  },
};
