import type { SegmentConfig } from "~/game-engine/core-engine/game/structure/segment";
import type { MoveFn } from "~/game-engine/core-engine/move/move-types";
import type { LorcanaGameState } from "../lorcana-engine-types";
import { lorcanaMoves } from "../moves/moves";
import { duringGameSegment } from "./segments/during-game/during-game-segment";
import { endGameSegment } from "./segments/end-game/end-game";
import { startingAGameSegment } from "./segments/starting-a-game/starting-a-game-segment";

export const lorcanaGameDefinition = {
  name: "Lorcana",
  minPlayers: 2,
  maxPlayers: 2,

  setup: () => {
    return {}; // Initial state - will be populated by startingAGame segment
  },

  moves: {
    concede: lorcanaMoves.concede as MoveFn<LorcanaGameState>,
  },

  segments: {
    startingAGame: startingAGameSegment,
    endGame: endGameSegment,
    duringGame: duringGameSegment as SegmentConfig<LorcanaGameState>,
  },
};

// Maintain backward compatibility
export const LorcanaGame = lorcanaGameDefinition;
