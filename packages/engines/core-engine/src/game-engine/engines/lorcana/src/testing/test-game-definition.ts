import type { GameDefinition } from "~/game-engine/core-engine/game-configuration";
import type { LorcanaGameState } from "../lorcana-engine-types";
import { lorcanaMoves } from "../moves/moves";

/**
 * Test-specific game definition with all moves registered at the top level
 * for easy testing without segment/phase restrictions
 */
export const LorcanaTestGame: GameDefinition<LorcanaGameState> = {
  name: "lorcana-test",
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

  // Register all moves at the top level for easier testing
  moves: {
    // Game Setup Moves
    chooseWhoGoesFirstMove: lorcanaMoves.chooseWhoGoesFirstMove,
    alterHand: lorcanaMoves.alterHand,
    // Core Game Moves
    passTurn: lorcanaMoves.passTurn,
    putACardIntoTheInkwell: lorcanaMoves.putACardIntoTheInkwell,
    playCard: lorcanaMoves.playCard,
    quest: lorcanaMoves.quest,
    challenge: lorcanaMoves.challenge,
    moveCharacterToLocation: lorcanaMoves.moveCharacterToLocation,
    useActivatedAbility: lorcanaMoves.useActivatedAbility,
    // System Moves
    concede: lorcanaMoves.concede,
  },

  // Simplified segments for testing
  segments: {
    startingAGame: {
      next: "duringGame",
      turn: {
        phases: {
          chooseFirstPlayer: {
            start: true,
          },
        },
      },
    },
    duringGame: {
      next: "endGame",
      turn: {
        phases: {
          mainPhase: {
            start: true,
          },
        },
      },
    },
    endGame: {
      next: "endGame",
      turn: {
        phases: {},
      },
    },
  },
};
