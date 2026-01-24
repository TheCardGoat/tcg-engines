/**
 * Gundam Card Game Definition
 *
 * This file defines the complete game using the @tcg/core framework.
 * It brings together all game components: state shape, moves, phases, zones, and validation.
 *
 * The game definition is the central configuration that the framework uses to:
 * - Initialize game state
 * - Validate moves
 * - Execute game flow
 * - Manage zones
 * - Enforce rules
 */

import type {
  GameDefinition,
  GameEndResult,
  GameMoveDefinitions,
  Player,
} from "@tcg/core";
import { createPlayerId, createZoneId } from "@tcg/core";
import { playCard } from "./game-definition/moves/core/play-card";
import { attackMove, drawMove, passMove, playResourceMove } from "./moves";
import type { GundamGameState, GundamMoves } from "./types";
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
} from "./zones";

/**
 * Setup function - creates initial game state
 *
 * TODO: Implement proper game setup with:
 * - Deck shuffling
 * - Initial hand draw
 * - Shield placement
 * - EX Base and EX Resource setup
 */
function setup(players: Player[]): GundamGameState {
  const [player1Id, player2Id] = players.map((p) => createPlayerId(p.id));

  // Create empty zones for each player
  // TODO: Initialize with actual cards from decks
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
    currentPlayer: player1Id,
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
    },
  };
}

/**
 * Game end condition check
 *
 * Checks if the game has ended and returns the result.
 */
function endIf(state: GundamGameState): GameEndResult | undefined {
  if (state.gundam.winner && state.gundam.loser) {
    return {
      winner: state.gundam.winner,
      reason: state.gundam.gameEndReason ?? "Game ended",
    };
  }
  return undefined;
}

/**
 * Move Definitions
 *
 * Maps move names to their GameMoveDefinition implementations.
 * Type-safe mapping ensures all moves in GundamMoves are defined.
 */
const moves: GameMoveDefinitions<GundamGameState, GundamMoves> = {
  draw: drawMove,
  playResource: playResourceMove,
  attack: attackMove,
  pass: passMove,
  playCard: playCard,

  concede: {
    reducer: (draft, context) => {
      const { playerId } = context;
      // Concede: current player loses
      draft.gundam.loser = playerId;
      draft.gundam.winner = draft.players.find((p) => p !== playerId);
      draft.gundam.gameEndReason = "Player conceded";
      draft.phase = "gameOver";
    },
  },
};

/**
 * Gundam Card Game Definition
 *
 * Complete game definition using @tcg/core framework.
 * Provides type-safe, declarative game configuration.
 */
export const gundamGame: GameDefinition<GundamGameState, GundamMoves> = {
  name: "Gundam Card Game",
  setup,
  moves,
  endIf,
  // TODO: Add flow definition for turn/phase management
  // TODO: Add playerView for hiding private information
};
