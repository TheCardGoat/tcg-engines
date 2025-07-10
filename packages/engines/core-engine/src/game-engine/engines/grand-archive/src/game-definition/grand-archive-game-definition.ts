/**
 * Grand Archive Main Game Definition
 *
 * Central configuration for Grand Archive TCG game flow and rules
 */

import type { GameDefinition } from "~/game-engine/core-engine/game-configuration";
import { logger } from "~/game-engine/core-engine/utils/logger";
import type { GrandArchiveGameState } from "../../grand-archive-engine-types";
import { grandArchiveMoves } from "../moves/moves";
import { duringGameSegment } from "./segments/during-game/during-game-segment";
import { endGameSegment } from "./segments/end-game/end-game-segment";
import { startingAGameSegment } from "./segments/starting-a-game/starting-a-game-segment";

/**
 * Grand Archive Game Configuration
 */
export const GrandArchiveGame: GameDefinition<GrandArchiveGameState> = {
  // Game segments define the major phases of the game
  segments: {
    startingAGame: startingAGameSegment,
    duringGame: duringGameSegment,
    endGame: endGameSegment,
  },

  // Global moves available across all segments
  moves: grandArchiveMoves,

  // Win condition checker - let CoreEngine handle win conditions for now
  // TODO: Implement Grand Archive specific win conditions using CoreOperation methods
  endIf: ({ G, ctx }) => {
    // Check basic win condition: deck exhaustion
    for (const playerId of ctx.playerOrder) {
      const deck = ctx.cardZones?.[`${playerId}-mainDeck`];
      if (deck && deck.cards.length === 0) {
        logger.info(`Win condition met: ${playerId} has no cards left`);
        return true;
      }
    }

    // Let CoreEngine handle other win conditions
    return false;
  },

  // Player configuration
  numPlayers: 2, // Standard Grand Archive

  // Game metadata
  name: "Grand Archive",
};

/**
 * Helper function to determine zone visibility
 */
function getZoneVisibility(zone: string): "public" | "private" | "secret" {
  switch (zone) {
    case "hand":
    case "memory":
    case "innerLineage":
      return "private";
    case "mainDeck":
    case "materialDeck":
      return "secret";
    case "field":
    case "graveyard":
    case "banishment":
    case "effectsStack":
    case "intent":
    case "loadedCards":
      return "public";
    default:
      return "public";
  }
}

/**
 * Helper function to determine if zone is ordered
 */
function isZoneOrdered(zone: string): boolean {
  switch (zone) {
    case "mainDeck":
    case "materialDeck":
    case "effectsStack":
      return true;
    default:
      return false;
  }
}

/**
 * Get opponent player ID
 */
export function getOpponent(playerId: string, playerOrder: string[]): string {
  return playerOrder.find((id) => id !== playerId) || "";
}

// TODO: These helper functions need to be reimplemented using CoreOperation methods
// to access game-specific player data that is now managed through context

/**
 * Check if player has specific element available
 * TODO: Implement using CoreOperation methods
 */
// export function hasElementAvailable(
//   gameState: GrandArchiveGameState,
//   playerId: string,
//   element: string,
// ): boolean {
//   // Need CoreOperation method to get player's available elements
//   return false;
// }

/**
 * Get player's current champion level
 * TODO: Implement using CoreOperation methods
 */
// export function getPlayerChampionLevel(
//   gameState: GrandArchiveGameState,
//   playerId: string,
// ): number {
//   // Need CoreOperation method to get champion level
//   return 0;
// }

/**
 * Check if player can materialize this turn
 * TODO: Implement using CoreOperation methods
 */
// export function canMaterializeThisTurn(
//   gameState: GrandArchiveGameState,
//   playerId: string,
// ): boolean {
//   // Need CoreOperation method to check materialization status
//   return false;
// }
