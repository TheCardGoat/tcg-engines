import type { MoveDefinition, MoveInput } from "../types/commands.ts";
import { applyFirstPlayerChoice } from "../state/initial-state.ts";

export interface ResolveFirstPlayerInput extends MoveInput {
  args: {
    goFirst: boolean;
  };
}

export const resolveFirstPlayerMove: MoveDefinition<ResolveFirstPlayerInput> = {
  handlesPendingChoice: true,

  available({ state, playerId }) {
    const choice = state.G.turnMetadata.pendingChoice;
    return choice?.type === "chooseFirstPlayer" && choice.chooserId === playerId;
  },

  validate({ state, playerId, input: _input }) {
    const choice = state.G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseFirstPlayer") {
      return {
        valid: false,
        error: "No first-player choice pending",
        errorCode: "NO_PENDING_CHOICE",
      };
    }
    if (choice.chooserId !== playerId) {
      return { valid: false, error: "Not your first-player choice", errorCode: "NOT_YOUR_CHOICE" };
    }
    return { valid: true };
  },

  execute({ state, playerId, input, operations }) {
    const choice = state.G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseFirstPlayer") return;
    const rivalId = state.ctx.playerIds.find((id) => id !== playerId);
    if (!rivalId) return;
    const firstPlayerId = input.args.goFirst ? playerId : rivalId;
    const { events, blankEddieCounts } = applyFirstPlayerChoice(state, firstPlayerId);
    operations.event.emit({
      type: "actionLog",
      messageKey: "setup.firstPlayerChoice",
      params: { order: input.args.goFirst ? "first" : "second" },
      playerId,
      category: "setup",
    });
    for (const event of events) {
      operations.event.emit(event);
    }
    operations.game.setTurnMetadata({ activePlayerId: firstPlayerId });
    operations.game.setPendingChoice(undefined);
    for (const [pid, count] of Object.entries(blankEddieCounts)) {
      if (count <= 0) continue;
      operations.event.emit({
        type: "actionLog",
        messageKey: "setup.blankEddie",
        params: { count },
        playerId: pid as typeof playerId,
        category: "setup",
      });
    }
  },
};
