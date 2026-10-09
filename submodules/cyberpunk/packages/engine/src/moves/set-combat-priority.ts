import type { MoveDefinition } from "../types/commands.ts";

/** Owner-scoped private preference, legal even while the rival is choosing. */
export const setCombatPriorityMove: MoveDefinition = {
  undoable: false,
  handlesPendingChoice: true,
  available: ({ state, playerId }) => !state.G.gameEnded && state.ctx.playerIds.includes(playerId),
  validate({ state, playerId, input }) {
    if (state.G.gameEnded || !state.ctx.playerIds.includes(playerId)) {
      return {
        valid: false,
        error: "Only a seated player can change combat priority",
        errorCode: "INVALID_PLAYER",
      };
    }
    const args = input.args;
    if (
      !args ||
      typeof args !== "object" ||
      !("mode" in args) ||
      (args.mode !== "automatic" && args.mode !== "hold") ||
      Object.keys(args).length !== 1
    ) {
      return { valid: false, error: "Expected a combat priority mode", errorCode: "INVALID_INPUT" };
    }
    return { valid: true };
  },
  execute({ state, playerId, input }) {
    const args = input.args;
    if (
      args &&
      typeof args === "object" &&
      "mode" in args &&
      (args.mode === "automatic" || args.mode === "hold")
    ) {
      state.G.players[playerId]!.combatPriority = args.mode;
    }
  },
};
