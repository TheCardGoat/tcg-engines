import type { GameDefinition } from "~/game-engine/core-engine/game-configuration";
import { duringGameSegment } from "~/game-engine/engines/one-piece/src/game-definition/segments/during-game/during-game-segment";
import { endGameSegment } from "~/game-engine/engines/one-piece/src/game-definition/segments/end-game/end-game-segment";
import { startingAGameSegment } from "~/game-engine/engines/one-piece/src/game-definition/segments/starting-a-game/starting-a-game-segment";
import { onePieceMoves } from "../moves/moves";
import type { OnePieceGameState } from "../one-piece-engine-types";

export const OnePieceGame: GameDefinition<OnePieceGameState> = {
  name: "one-piece",
  numPlayers: 2,

  deltaState: false,
  disableUndo: true,

  endIf: ({ G }) => {
    // Game ends based on One Piece defeat conditions:
    // 1. Player has 0 Life cards and Leader takes damage
    // 2. Player has 0 cards in deck at start of turn
    // 3. Player concedes
    // 4. Special card effects
    return false;
  },

  onEnd: ({ G }) => {
    return G;
  },

  playerView: ({ G }) => {
    // Return complete game state - client filtering will handle visibility
    return G;
  },

  moves: {
    concede: onePieceMoves.concede,
  },

  segments: {
    startingAGame: startingAGameSegment,
    duringGame: duringGameSegment,
    endGame: endGameSegment,
  },
};
