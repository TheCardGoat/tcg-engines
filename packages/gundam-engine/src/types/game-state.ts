/**
 * Gundam Game State Types
 *
 * Core game state types for Gundam engine.
 * Implements the @tcg/core IState pattern, following lorcana-engine as reference.
 *
 * Key exports:
 * - GundamCardMeta: Dynamic card state (damage, rested)
 * - GundamExternalState: Game-specific state
 * - GundamGameState: Complete state using IState pattern
 */

import type { CardId, IState, PlayerId } from "@tcg/core";
import type {
  CardDefinition,
  GundamCardMeta as GundamCardMetaBase,
  GundamExternalState as GundamExternalStateBase,
  GundamPhase,
} from "@tcg/gundam-types";

// Re-export phase type from gundam-types
export type { GundamPhase } from "@tcg/gundam-types";

// ============================================================================
// CARD METADATA
// ============================================================================

/**
 * Gundam Card Metadata
 *
 * Re-exported from gundam-types for convenience.
 * Stores mutable, game-specific card properties.
 */
export type GundamCardMeta = GundamCardMetaBase;

/**
 * Create default card meta state for new cards
 *
 * Cards enter play in active state with no damage.
 */
export function createDefaultCardMeta(): GundamCardMeta {
  return {
    isRested: false,
    damage: 0,
    playedThisTurn: true,
  };
}

// ============================================================================
// EXTERNAL STATE
// ============================================================================

/**
 * Gundam External State
 *
 * Re-exported from gundam-types for convenience.
 * Game-specific state not managed by framework.
 */
export type GundamExternalState = GundamExternalStateBase;

// ============================================================================
// COMPLETE GAME STATE
// ============================================================================

/**
 * Complete Gundam Game State
 *
 * Combines framework-managed state (internal) with game-specific state (external).
 * Uses the IState pattern from @tcg/core.
 */
export type GundamGameState = IState<
  GundamExternalState,
  CardDefinition,
  GundamCardMeta
>;

/**
 * Create initial Gundam game state
 *
 * Initializes external state with default values.
 * Internal state (zones, cards) is initialized by the framework.
 */
export function createInitialGundamState(
  player1Id: PlayerId,
  player2Id: PlayerId,
  startingPlayerId: PlayerId,
): GundamGameState {
  return {
    internal: {
      zones: {}, // Zones initialized by framework zone manager
      cards: {}, // Cards initialized by framework
      cardMetas: {}, // Card metas initialized as cards are created
    },
    external: {
      playerIds: [player1Id, player2Id],
      turnNumber: 1,
      activePlayerId: startingPlayerId,
      currentPhase: "setup",
      hasPlayedResourceThisTurn: {
        [player1Id]: false,
        [player2Id]: false,
      },
      activeResources: {
        [player1Id]: 0,
        [player2Id]: 0,
      },
      cardPositions: {},
      attackedThisTurn: [],
      effectStack: {
        stack: [],
        nextInstanceId: 0,
      },
      temporaryModifiers: {},
      revealedCards: [],
      winner: undefined,
      loser: undefined,
      gameEndReason: undefined,
    },
  };
}
