/**
 * # One Piece Engine
 *
 * Core engine implementation for the One Piece Trading Card Game.
 *
 * ## Overview
 * The OnePieceEngine provides the main interface for interacting with One Piece TCG game state,
 * processing moves, and querying cards. It wraps the CoreEngine and provides game-specific
 * functionality.
 *
 * ## Key Components
 * - **CoreEngine**: The underlying engine that handles state management and move processing
 * - **OnePieceGame**: Game definition with rules, phases, and moves
 * - **OnePieceModel**: Card model for querying and manipulating cards
 * - **OnePieceCardRepository**: Repository for card definitions
 *
 * ## Usage
 * ```typescript
 * const engine = new OnePieceEngine({
 *   initialState: onePieceGameState,
 *   cards: playerCards,
 *   cardRepository: repository,
 *   gameId: "game-123",
 *   playerId: "player_one", // undefined for authoritative engine
 *   players: ["player_one", "player_two"],
 *   seed: "random-seed",
 *   debug: true
 * });
 *
 * // Process moves
 * engine.moves.chooseFirstPlayer("player_one");
 * engine.moves.mulligan(true);
 * engine.moves.playCharacter("character-instance-id");
 *
 * // Query state
 * const state = engine.getState();
 * const ctx = engine.getCtx();
 * const priorityPlayers = engine.getPriorityPlayers();
 *
 * // Query cards
 * const allCards = engine.queryAllCards();
 * ```
 *
 * ## Architecture Notes
 * - Uses CoreEngine for state management and move processing
 * - Maintains card models for enhanced querying capabilities
 * - Supports authoritative engine pattern for server-client synchronization
 * - Implements One Piece TCG specific rules and mechanics
 */

import type { CardRepository } from "~/game-engine/core-engine/card/card-repository-factory";
import type { CoreCardInstance } from "~/game-engine/core-engine/card/core-card-instance";
import { CoreEngine } from "~/game-engine/core-engine/engine/core-engine";
import {
  type CoreCtx,
  getCurrentPriorityPlayer,
} from "~/game-engine/core-engine/state/context";
import { allOnePieceCardsById } from "./cards/definitions/cards";
import { OnePieceModel } from "./cards/one-piece-card-model";
import type { OnePieceCardRepository } from "./cards/one-piece-card-repository";
import { OnePieceGame } from "./game-definition/one-piece-game-definition";
import type {
  GameCards,
  OnePieceGameState,
  ZoneType,
} from "./one-piece-engine-types";
import type {
  OnePieceCard,
  OnePieceCardFilter,
  OnePiecePlayerState,
} from "./one-piece-generic-types";

// Re-export types for external usage
export type { OnePieceCard, OnePieceCardFilter, OnePiecePlayerState };

// Define card instance type for One Piece
type OnePieceCardInstance = CoreCardInstance<OnePieceCard>;

/**
 * ## OnePieceEngine Class
 * Main engine class for One Piece TCG game logic.
 *
 * ### Properties
 * - `client`: CoreEngine instance handling low-level game operations
 * - `playerCards`: Map of player cards (player -> instanceId -> publicId)
 * - `cardModels`: Enhanced card models with additional query capabilities
 *
 * ### Methods
 * - `moves`: Available game moves (chooseFirstPlayer, mulligan, playCharacter, etc.)
 * - `getState()`: Get current game state
 * - `getCtx()`: Get game context (turns, phases, players)
 * - `queryAllCards()`: Get all card models
 * - `getPriorityPlayers()`: Get players with current priority
 * - `getTurnPlayer()`: Get current turn player
 * - `setAuthoritativeEngine()`: Connect to authoritative engine for sync
 */
export class OnePieceEngine {
  private client: CoreEngine<
    OnePieceGameState,
    OnePieceCard,
    OnePiecePlayerState,
    OnePieceCardFilter,
    OnePieceCardInstance
  >;
  private readonly playerCards: Record<string, Record<string, string>>;
  private readonly cardModels: Record<string, OnePieceModel>;

  /**
   * ### Constructor Parameters
   * - `initialState`: Starting game state
   * - `cards`: Player card mappings (player -> instanceId -> publicId)
   * - `cardRepository`: Optional repository for card definitions
   * - `gameId`: Unique game identifier
   * - `playerId`: Player ID (undefined for authoritative engine)
   * - `seed`: Random seed for reproducibility
   * - `players`: Array of player IDs
   * - `debug`: Enable debug logging
   */
  constructor({
    initialState,
    initialCoreCtx,
    cards,
    cardRepository,
    gameId,
    playerId,
    seed,
    players,
    debug,
  }: {
    initialState: OnePieceGameState;
    initialCoreCtx?: CoreCtx;
    cards: GameCards;
    cardRepository?: OnePieceCardRepository;
    gameId: string;
    playerId?: string;
    debug?: boolean;
    seed?: string;
    players: string[];
  }) {
    this.client = new CoreEngine<
      OnePieceGameState,
      OnePieceCard,
      OnePiecePlayerState,
      OnePieceCardFilter,
      OnePieceCardInstance
    >({
      game: OnePieceGame,
      seed,
      initialState,
      initialCoreCtx,
      matchID: gameId,
      playerID: playerId,
      players,
      cards,
      debug,
      repository: cardRepository || ({} as CardRepository<OnePieceCard>),
    });

    this.playerCards = cards;
    this.cardModels = {} as Record<string, OnePieceModel>;

    // Create a function to get card definitions - use repository if provided, fallback to allCardsById
    const getCardDefinition = cardRepository
      ? (id: string) => cardRepository.getCardByPublicId(id)
      : (id: string) => allOnePieceCardsById[id];

    // Create card models for enhanced querying
    for (const playerCards of Object.values(this.playerCards)) {
      for (const card of Object.keys(playerCards)) {
        const cardDefinition = getCardDefinition(playerCards[card]);
        if (cardDefinition) {
          // Extract only the original card properties, excluding instanceId and id added by repository
          const originalCard = cardRepository
            ? { ...cardDefinition }
            : cardDefinition;

          // Remove repository-added properties to get pure OnePieceCard
          if (cardRepository && originalCard) {
            (originalCard as any).instanceId = undefined;
            // Keep the original id property as it's part of OnePieceCard
          }

          this.cardModels[card] = new OnePieceModel({
            engine: this,
            card: originalCard,
            instanceId: card,
          });
        }
      }
    }
  }

  /**
   * ### Engine Synchronization
   * Methods for connecting engines in client-server architecture.
   */

  /** Connect this engine to an authoritative engine for state synchronization */
  setAuthoritativeEngine(authEngine: OnePieceEngine): void {
    this.client.setAuthoritativeEngine(authEngine.client);
  }

  /**
   * ### Enhanced Card Filtering
   * Type-safe card filtering with One Piece-specific properties
   */

  /** Query cards with One Piece-specific filtering capabilities */
  queryCardsByFilter(filter: OnePieceCardFilter) {
    return this.client.queryCardsByFilter(filter);
  }

  /** Get engine store for backward compatibility with legacy APIs */
  getStore() {
    // For backward compatibility - CoreEngine doesn't have store
    return {
      state: this.client.getGameState(),
      stateHash: "core-engine-hash", // CoreEngine doesn't track hash separately
    };
  }

  /**
   * ### Available Moves
   * Game moves that can be executed by players.
   *
   * **chooseFirstPlayer(playerId)**
   * - Selects which player goes first
   * - Used during game setup phase
   * - Returns move result with success/failure status
   *
   * **mulligan(redraw)**
   * - Allows player to mulligan their starting hand
   * - Takes boolean indicating whether to redraw entire hand
   * - Used during setup phase after initial draw
   *
   * **playCharacter(instanceId)**
   * - Play a Character card from hand to character area
   * - Requires paying the cost using DON!! cards
   * - Returns move result with success/failure status
   */
  get moves() {
    const currentPlayer = this.client.getCurrentPlayer();

    return {
      chooseFirstPlayer: (playerId: string) => {
        return this.client.processMove(currentPlayer, "chooseFirstPlayer", [
          playerId,
        ]);
      },
      mulligan: (redraw: boolean) => {
        if (!currentPlayer) return false;
        return this.client.processMove(currentPlayer, "mulligan", [redraw]);
      },
      placeDon: (count: number) => {
        const currentPlayer = this.client.getCurrentPlayer();
        if (!currentPlayer) return false;
        return this.client.processMove(currentPlayer, "placeDon", [count]);
      },
      playCharacter: (
        instanceId: string,
        position?: number,
        targets?: string[],
      ) => {
        const currentPlayer = this.client.getCurrentPlayer();
        if (!currentPlayer) return false;
        return this.client.processMove(currentPlayer, "playCharacter", [
          instanceId,
          position,
          targets,
        ]);
      },
      playStage: (instanceId: string, replaceExisting?: boolean) => {
        const currentPlayer = this.client.getCurrentPlayer();
        if (!currentPlayer) return false;
        return this.client.processMove(currentPlayer, "playStage", [
          instanceId,
          replaceExisting,
        ]);
      },
      activateEvent: (instanceId: string, targets?: string[]) => {
        const currentPlayer = this.client.getCurrentPlayer();
        if (!currentPlayer) return false;
        return this.client.processMove(currentPlayer, "activateEvent", [
          instanceId,
          targets,
        ]);
      },
      declareAttack: (
        attackerInstanceId: string,
        targetInstanceId?: string,
      ) => {
        const currentPlayer = this.client.getCurrentPlayer();
        if (!currentPlayer) return false;
        return this.client.processMove(currentPlayer, "declareAttack", [
          attackerInstanceId,
          targetInstanceId,
        ]);
      },
      giveDon: (donInstanceId: string, targetInstanceId: string) => {
        const currentPlayer = this.client.getCurrentPlayer();
        if (!currentPlayer) return false;
        return this.client.processMove(currentPlayer, "giveDon", [
          donInstanceId,
          targetInstanceId,
        ]);
      },
      endPhase: () => {
        const currentPlayer = this.client.getCurrentPlayer();
        if (!currentPlayer) return false;
        return this.client.processMove(currentPlayer, "endPhase", []);
      },
      concede: () => {
        const currentPlayer = this.client.getCurrentPlayer();
        if (!currentPlayer) return false;
        return this.client.processMove(currentPlayer, "concede", []);
      },
    };
  }

  /**
   * ### State Query Methods
   * Methods for querying game state and context.
   */

  /** Get the owner of a card by instance ID */
  getCardOwner(instanceId: string) {
    for (const player of Object.keys(this.playerCards)) {
      if (this.playerCards[player][instanceId]) {
        return player;
      }
    }

    return undefined;
  }

  /** Get the zone of a card by instance ID */
  getCardZone(instanceId: string): ZoneType | undefined {
    const ctx = this.getCtx();

    // Search through all zones to find the card
    const zones: ZoneType[] = [
      "deck",
      "hand",
      "donDeck",
      "costArea",
      "lifeArea",
      "trash",
      "leaderArea",
      "characterArea",
      "stageArea",
    ];

    for (const player of Object.keys(this.playerCards)) {
      for (const zone of zones) {
        const cardZone = ctx.cardZones[`${player}-${zone}`];
        if (cardZone?.cards?.includes(instanceId)) {
          return zone;
        }
      }
    }

    return undefined;
  }

  /** Get current game state */
  getState() {
    return this.client.getState()?.G;
  }

  /** Get game context (turns, phases, players) */
  getCtx() {
    return this.client.getState()?.ctx;
  }

  /** Get number of turns played */
  getNumTurns() {
    return this.getCtx().numTurns;
  }

  /** Get number of moves made */
  getNumMoves() {
    return this.getCtx().numMoves;
  }

  /** Get current game segment (startingAGame, duringGame, etc.) */
  getGameSegment() {
    return this.getCtx().currentSegment;
  }

  /** Get current game phase within segment */
  getGamePhase() {
    return this.getCtx().currentPhase;
  }

  /** Get players with current priority */
  getPriorityPlayers() {
    const ctx = this.getCtx();
    const priorityPlayer = getCurrentPriorityPlayer(ctx);
    return priorityPlayer ? [priorityPlayer] : [];
  }

  /** Get current turn player */
  getTurnPlayer() {
    return "NOT_IMPLEMENTED";
  }

  /** Get zone card counts for a player */
  getZonesCardCount(player?: string): Record<ZoneType, number> {
    const ctx = this.getCtx();
    const playerId = player || "player_one";

    const count: Record<ZoneType, number> = {
      deck: 0,
      hand: 0,
      donDeck: 0,
      costArea: 0,
      lifeArea: 0,
      trash: 0,
      leaderArea: 0,
      characterArea: 0,
      stageArea: 0,
    };

    // Get zone counts from ctx.cardZones
    const zones: ZoneType[] = [
      "deck",
      "hand",
      "donDeck",
      "costArea",
      "lifeArea",
      "trash",
      "leaderArea",
      "characterArea",
      "stageArea",
    ];

    for (const zone of zones) {
      const cardZone = ctx.cardZones[`${playerId}-${zone}`];
      count[zone] = cardZone?.cards?.length || 0;
    }

    return count;
  }

  /**
   * ### Card Query Methods
   * Methods for querying cards and card models.
   */

  /** Get all card models in the game */
  queryAllCards() {
    return Object.values(this.cardModels);
  }

  /**
   * ### One Piece Specific Methods
   */

  /** Check if a player can place DON!! cards */
  canPlaceDon(playerId: string, count: number): boolean {
    const ctx = this.getCtx();
    const donDeckZone = ctx.cardZones[`${playerId}-donDeck`];

    // Check if player has enough DON!! cards in deck
    if (!donDeckZone || donDeckZone.cards.length < count) {
      return false;
    }

    // Check if it's the DON!! phase
    return ctx.currentPhase === "donPhase";
  }

  /** Check if a player can play a character card */
  canPlayCharacter(playerId: string, instanceId: string): boolean {
    const ctx = this.getCtx();
    const handZone = ctx.cardZones[`${playerId}-hand`];
    const characterAreaZone = ctx.cardZones[`${playerId}-characterArea`];

    // Check if card is in hand
    if (!handZone?.cards.includes(instanceId)) {
      return false;
    }

    // Check if character area has space (max 5)
    if ((characterAreaZone?.cards.length || 0) >= 5) {
      return false;
    }

    // Check if it's the main phase
    return ctx.currentPhase === "mainPhase";
  }

  /** Get Life cards count for a player */
  getLifeCount(playerId: string): number {
    const ctx = this.getCtx();
    const lifeAreaZone = ctx.cardZones[`${playerId}-lifeArea`];
    return lifeAreaZone?.cards.length || 0;
  }

  /** Check if player has lost */
  hasPlayerLost(playerId: string): boolean {
    return false;
  }

  /**
   * ### Utility Methods
   */

  /** Serialize to JSON (not implemented) */
  toJSON() {
    return undefined;
  }

  /** Get direct access to CoreEngine (use with caution) */
  getUnsafeClient() {
    return this.client;
  }

  /** Check if a player has already made their mulligan decision */
  hasPlayerMulliganed(playerId: string): boolean {
    const ctx = this.getCtx();
    return ctx.pendingMulligan ? !ctx.pendingMulligan.has(playerId) : false;
  }
}
