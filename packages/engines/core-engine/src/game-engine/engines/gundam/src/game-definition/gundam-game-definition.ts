import type { GameDefinition } from "~/game-engine/core-engine/game-configuration";
import { duringGameSegment } from "~/game-engine/engines/gundam/src/game-definition/segments/during-game/during-game-segment";
import { endGameSegment } from "~/game-engine/engines/gundam/src/game-definition/segments/end-game/end-game-segment";
import { startingAGameSegment } from "~/game-engine/engines/gundam/src/game-definition/segments/starting-a-game/starting-a-game-segment";
import type { GundamGameState } from "../gundam-engine-types";
import { gundamMoves } from "../moves/moves";

export const GundamGame: GameDefinition<GundamGameState> = {
  name: "gundam",
  numPlayers: 2,

  deltaState: false,
  disableUndo: true,

  endIf: ({ G }) => {
    // Game ends if a player has no shields and takes damage (Rule 1-2-2-1)
    // or if a player has no cards left in deck (Rule 1-2-2-2)
    return G.winner !== undefined;
  },

  onEnd: ({ G }) => {
    return G;
  },

  playerView: ({ G }) => {
    return G;
  },

  moves: {
    concede: gundamMoves.concede,
  },

  segments: {
    startingAGame: startingAGameSegment,
    duringGame: duringGameSegment,
    endGame: endGameSegment,
  },
};
