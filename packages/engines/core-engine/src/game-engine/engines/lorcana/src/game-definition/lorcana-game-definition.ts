import type { GameDefinition } from "~/game-engine/core-engine/game-configuration";
import { duringGameSegment } from "~/game-engine/engines/lorcana/src/game-definition/segments/during-game/during-game-segment";
import { endGameSegment } from "~/game-engine/engines/lorcana/src/game-definition/segments/end-game/end-game";
import { startingAGameSegment } from "~/game-engine/engines/lorcana/src/game-definition/segments/starting-a-game/starting-a-game-segment";
import type { LorcanaGameState } from "../lorcana-engine-types";
import { lorcanaMoves } from "../moves/moves";

export const LorcanaGame: GameDefinition<LorcanaGameState> = {
  name: "lorcana",
  numPlayers: 2,

  deltaState: false,
  disableUndo: true,

  endIf: () => {
    return false;
  },

  onEnd: ({ G }) => {
    return G;
  },

  playerView: ({ G }) => {
    return G;
  },

  moves: {
    concede: lorcanaMoves.concede,
  },

  segments: {
    startingAGame: startingAGameSegment,
    endGame: endGameSegment,
    duringGame: duringGameSegment,
  },
};
