/**
 * Gundam Test Helpers
 *
 * Utilities for creating test states and game configurations.
 * Follows the IState pattern from @tcg/core.
 *
 * @module testing/test-helpers
 */

import type { CardId, CardZoneConfig, PlayerId } from "@tcg/core";
import { createZoneId } from "@tcg/core";
import type { GundamCardMeta, GundamGameState, GundamPhase } from "../types";

/**
 * Zone data type for internal state
 */
export type TestZoneData = {
  config: CardZoneConfig;
  cardIds: CardId[];
};

/**
 * Options for creating a test state
 */
export interface CreateTestStateOptions {
  /** Player IDs (default: ["player1", "player2"]) */
  players?: PlayerId[];
  /** Active player (default: first player) */
  activePlayerId?: PlayerId;
  /** Turn number (default: 1) */
  turnNumber?: number;
  /** Current phase (default: "main") */
  currentPhase?: GundamPhase;
  /** Cards in each player's deck */
  deckCards?: Record<PlayerId, CardId[]>;
  /** Cards in each player's battle area */
  battleAreaCards?: Record<PlayerId, CardId[]>;
  /** Cards in each player's hand */
  handCards?: Record<PlayerId, CardId[]>;
  /** Card positions (active/rested) */
  cardPositions?: Record<CardId, "active" | "rested">;
  /** Active resources per player */
  activeResources?: Record<PlayerId, number>;
  /** Card metas (damage, rested state, etc.) */
  cardMetas?: Record<CardId, Partial<GundamCardMeta>>;
}

/**
 * Creates a zone with the proper structure
 */
export function createTestZone(
  owner: PlayerId,
  zoneName: string,
  cards: CardId[] = [],
  visibility: "public" | "private" | "secret" = "public",
  ordered = false,
): TestZoneData {
  return {
    config: {
      id: createZoneId(`${zoneName}-${owner}`),
      name: zoneName,
      visibility,
      ordered,
      owner,
      maxSize: undefined,
      faceDown: visibility === "secret",
    },
    cardIds: cards,
  };
}

/**
 * Creates a complete GundamGameState for testing
 *
 * This helper creates a properly structured game state following
 * the IState pattern with internal and external state separation.
 *
 * @example
 * ```typescript
 * const state = createTestState({
 *   players: ["p1", "p2"],
 *   battleAreaCards: { p1: ["card1"], p2: ["card2"] },
 *   cardPositions: { card1: "active", card2: "rested" },
 * });
 * ```
 */
export function createTestState(
  options: CreateTestStateOptions = {},
): GundamGameState {
  const {
    players = ["player1" as PlayerId, "player2" as PlayerId],
    activePlayerId = players[0],
    turnNumber = 1,
    currentPhase = "main",
    deckCards = {},
    battleAreaCards = {},
    handCards = {},
    cardPositions = {},
    activeResources = {},
    cardMetas = {},
  } = options;

  // Create zones for each player
  const zones: Record<string, TestZoneData> = {};

  const zoneConfigs: Array<{
    name: string;
    visibility: "public" | "private" | "secret";
    ordered: boolean;
  }> = [
    { name: "deck", visibility: "secret", ordered: true },
    { name: "resourceDeck", visibility: "secret", ordered: true },
    { name: "hand", visibility: "private", ordered: false },
    { name: "battleArea", visibility: "public", ordered: true },
    { name: "shieldSection", visibility: "secret", ordered: true },
    { name: "baseSection", visibility: "public", ordered: false },
    { name: "resourceArea", visibility: "public", ordered: false },
    { name: "trash", visibility: "public", ordered: true },
    { name: "removal", visibility: "public", ordered: false },
    { name: "limbo", visibility: "public", ordered: false },
  ];

  for (const player of players) {
    for (const { name, visibility, ordered } of zoneConfigs) {
      let cards: CardId[] = [];

      if (name === "deck" && deckCards[player]) {
        cards = deckCards[player];
      } else if (name === "battleArea" && battleAreaCards[player]) {
        cards = battleAreaCards[player];
      } else if (name === "hand" && handCards[player]) {
        cards = handCards[player];
      }

      zones[`${name}-${player}`] = createTestZone(
        player,
        name,
        cards,
        visibility,
        ordered,
      );
    }
  }

  // Create card metas with defaults
  const finalCardMetas: Record<CardId, GundamCardMeta> = {};
  for (const [cardId, meta] of Object.entries(cardMetas)) {
    finalCardMetas[cardId as CardId] = {
      isRested: meta.isRested ?? false,
      damage: meta.damage ?? 0,
      playedThisTurn: meta.playedThisTurn ?? false,
    };
  }

  // Create active resources with defaults
  const finalActiveResources: Record<PlayerId, number> = {};
  for (const player of players) {
    finalActiveResources[player] = activeResources[player] ?? 3;
  }

  // Create hasPlayedResourceThisTurn
  const hasPlayedResourceThisTurn: Record<PlayerId, boolean> = {};
  for (const player of players) {
    hasPlayedResourceThisTurn[player] = false;
  }

  return {
    internal: {
      zones,
      cards: {},
      cardMetas: finalCardMetas,
    },
    external: {
      playerIds: players,
      activePlayerId,
      turnNumber,
      currentPhase,
      activeResources: finalActiveResources,
      cardPositions,
      attackedThisTurn: [],
      hasPlayedResourceThisTurn,
      effectStack: { stack: [], nextInstanceId: 0 },
      temporaryModifiers: {},
      revealedCards: [],
    },
  };
}

/**
 * Creates a minimal test state with just the essentials
 */
export function createMinimalTestState(
  player1: PlayerId = "player1" as PlayerId,
  player2: PlayerId = "player2" as PlayerId,
): GundamGameState {
  return createTestState({
    players: [player1, player2],
  });
}

/**
 * Gets a card to a specific zone in a test state
 * Returns a new state with the card moved
 */
export function withCardInZone(
  state: GundamGameState,
  cardId: CardId,
  zoneName: string,
  player: PlayerId,
): GundamGameState {
  const zoneKey = `${zoneName}-${player}`;
  return {
    ...state,
    internal: {
      ...state.internal,
      zones: {
        ...state.internal.zones,
        [zoneKey]: {
          ...state.internal.zones[zoneKey],
          cardIds: [...state.internal.zones[zoneKey].cardIds, cardId],
        },
      },
    },
  };
}

/**
 * Creates a test card ID
 */
export function testCardId(id: string | number): CardId {
  return `card-${id}` as CardId;
}

/**
 * Creates a test player ID
 */
export function testPlayerId(id: string | number): PlayerId {
  return `player-${id}` as PlayerId;
}
