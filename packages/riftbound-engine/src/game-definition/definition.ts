/**
 * Riftbound Game Definition
 *
 * The main game definition implementing GameDefinition<TState, TMoves>.
 * This is a tabletop simulator - moves handle card manipulation without rule validation.
 */

import type { GameDefinition } from "@tcg/core";
import type {
  RiftboundCardMeta,
  RiftboundGameState,
  RiftboundMoves,
} from "../types";
import { riftboundZones } from "../zones/zone-configs";
import { riftboundMoves } from "./moves";
import { createInitialState } from "./setup/game-setup";

/**
 * Re-export RiftboundMoves from types for convenience
 */
export type { RiftboundMoves } from "../types";

/**
 * Riftbound game definition
 *
 * Complete game definition with all manual moves for the tabletop simulator.
 */
export const riftboundDefinition: GameDefinition<
  RiftboundGameState,
  RiftboundMoves,
  unknown,
  RiftboundCardMeta
> = {
  name: "Riftbound Tabletop Simulator",

  setup: createInitialState,

  moves: riftboundMoves,

  zones: riftboundZones,

  // Win condition based on victory points
  endIf: (state) => {
    for (const playerId of Object.keys(state.players)) {
      const player = state.players[playerId];
      if (player && player.victoryPoints >= state.victoryScore) {
        return {
          winner: playerId,
          reason: "victory_points",
        };
      }
    }
    return undefined;
  },

  // Player view - in tabletop simulator, most info is public
  // Only hide opponent's hand and facedown cards
  playerView: (state, playerId) => {
    // For now, return full state - players enforce rules themselves
    return state;
  },
};
