import type { PlayerId, Zone, ZoneId } from "@tcg/core";
import type { GundamGameState } from "../../types";
import {
  createBaseSectionZone,
  createBattleAreaZone,
  createDeckZone,
  createHandZone,
  createRemovalZone,
  createResourceAreaZone,
  createResourceDeckZone,
  createShieldSectionZone,
  createTrashZone,
} from "../../zones";

/**
 * Create initial Gundam game state
 */
export function createInitialGundamState(
  player1Id: PlayerId,
  player2Id: PlayerId,
  startingPlayerId: PlayerId,
): GundamGameState {
  const zones = {
    deck: {
      [player1Id]: createDeckZone(player1Id, []),
      [player2Id]: createDeckZone(player2Id, []),
    },
    resourceDeck: {
      [player1Id]: createResourceDeckZone(player1Id, []),
      [player2Id]: createResourceDeckZone(player2Id, []),
    },
    hand: {
      [player1Id]: createHandZone(player1Id, []),
      [player2Id]: createHandZone(player2Id, []),
    },
    battleArea: {
      [player1Id]: createBattleAreaZone(player1Id, []),
      [player2Id]: createBattleAreaZone(player2Id, []),
    },
    shieldSection: {
      [player1Id]: createShieldSectionZone(player1Id, []),
      [player2Id]: createShieldSectionZone(player2Id, []),
    },
    baseSection: {
      [player1Id]: createBaseSectionZone(player1Id),
      [player2Id]: createBaseSectionZone(player2Id),
    },
    resourceArea: {
      [player1Id]: createResourceAreaZone(player1Id, []),
      [player2Id]: createResourceAreaZone(player2Id, []),
    },
    trash: {
      [player1Id]: createTrashZone(player1Id, []),
      [player2Id]: createTrashZone(player2Id, []),
    },
    removal: {
      [player1Id]: createRemovalZone(player1Id, []),
      [player2Id]: createRemovalZone(player2Id, []),
    },
  };
  return {
    players: [player1Id, player2Id],
    currentPlayer: startingPlayerId,
    turn: 1,
    phase: "setup",
    zones,
    gundam: {
      activeResources: {
        [player1Id]: 0,
        [player2Id]: 0,
      },
      cardPositions: {},
      attackedThisTurn: [],
      hasPlayedResourceThisTurn: {
        [player1Id]: false,
        [player2Id]: false,
      },
      winner: undefined,
      loser: undefined,
      gameEndReason: undefined,
    },
  };
}

/**
 * Game Setup Function
 *
 * Initializes the Gundam game state.
 *
 * @param players - List of players in the game
 * @returns Initial Gundam game state
 */
export function setupGundamGame(
  players: Array<{ id: string }>,
): GundamGameState {
  const playerIds = players.map((p) => p.id as PlayerId);
  // Default to first player starting if not specified
  // In a real game, this would be determined by coin flip or similar
  return createInitialGundamState(playerIds[0], playerIds[1], playerIds[0]);
}
