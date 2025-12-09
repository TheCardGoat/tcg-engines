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
import type { CoreCardInstance } from "~/game-engine/core-engine/card/core-card-instance";
import { CoreEngine } from "~/game-engine/core-engine/engine/core-engine";
import { type CoreCtx } from "~/game-engine/core-engine/state/context";
import { OnePieceModel } from "./cards/one-piece-card-model";
import type { OnePieceCardRepository } from "./cards/one-piece-card-repository";
import type { GameCards, OnePieceGameState, ZoneType } from "./one-piece-engine-types";
import type { OnePieceCard, OnePieceCardFilter, OnePiecePlayerState } from "./one-piece-generic-types";
export type { OnePieceCard, OnePieceCardFilter, OnePiecePlayerState };
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
export declare class OnePieceEngine {
    private client;
    private readonly playerCards;
    private readonly cardModels;
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
    constructor({ initialState, initialCoreCtx, cards, cardRepository, gameId, playerId, seed, players, debug, }: {
        initialState: OnePieceGameState;
        initialCoreCtx?: CoreCtx;
        cards: GameCards;
        cardRepository?: OnePieceCardRepository;
        gameId: string;
        playerId?: string;
        debug?: boolean;
        seed?: string;
        players: string[];
    });
    /**
     * ### Engine Synchronization
     * Methods for connecting engines in client-server architecture.
     */
    /** Connect this engine to an authoritative engine for state synchronization */
    setAuthoritativeEngine(authEngine: OnePieceEngine): void;
    /**
     * ### Enhanced Card Filtering
     * Type-safe card filtering with One Piece-specific properties
     */
    /** Query cards with One Piece-specific filtering capabilities */
    queryCardsByFilter(filter: OnePieceCardFilter): CoreCardInstance<{
        id: string;
    }>[];
    /** Get engine store for backward compatibility with legacy APIs */
    getStore(): {
        state: import("../../../core-engine/game-configuration").CoreEngineState<OnePieceGameState>;
        stateHash: string;
    };
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
    get moves(): {
        chooseFirstPlayer: (playerId: string) => import("../../../core-engine").Result<import("../../../core-engine/game-configuration").CoreEngineState<OnePieceGameState>, import("../../../core-engine/errors/engine-errors").AnyEngineError>;
        mulligan: (redraw: boolean) => false | import("../../../core-engine").Result<import("../../../core-engine/game-configuration").CoreEngineState<OnePieceGameState>, import("../../../core-engine/errors/engine-errors").AnyEngineError>;
        placeDon: (count: number) => false | import("../../../core-engine").Result<import("../../../core-engine/game-configuration").CoreEngineState<OnePieceGameState>, import("../../../core-engine/errors/engine-errors").AnyEngineError>;
        playCharacter: (instanceId: string, position?: number, targets?: string[]) => false | import("../../../core-engine").Result<import("../../../core-engine/game-configuration").CoreEngineState<OnePieceGameState>, import("../../../core-engine/errors/engine-errors").AnyEngineError>;
        playStage: (instanceId: string, replaceExisting?: boolean) => false | import("../../../core-engine").Result<import("../../../core-engine/game-configuration").CoreEngineState<OnePieceGameState>, import("../../../core-engine/errors/engine-errors").AnyEngineError>;
        activateEvent: (instanceId: string, targets?: string[]) => false | import("../../../core-engine").Result<import("../../../core-engine/game-configuration").CoreEngineState<OnePieceGameState>, import("../../../core-engine/errors/engine-errors").AnyEngineError>;
        declareAttack: (attackerInstanceId: string, targetInstanceId?: string) => false | import("../../../core-engine").Result<import("../../../core-engine/game-configuration").CoreEngineState<OnePieceGameState>, import("../../../core-engine/errors/engine-errors").AnyEngineError>;
        giveDon: (donInstanceId: string, targetInstanceId: string) => false | import("../../../core-engine").Result<import("../../../core-engine/game-configuration").CoreEngineState<OnePieceGameState>, import("../../../core-engine/errors/engine-errors").AnyEngineError>;
        endPhase: () => false | import("../../../core-engine").Result<import("../../../core-engine/game-configuration").CoreEngineState<OnePieceGameState>, import("../../../core-engine/errors/engine-errors").AnyEngineError>;
        concede: () => false | import("../../../core-engine").Result<import("../../../core-engine/game-configuration").CoreEngineState<OnePieceGameState>, import("../../../core-engine/errors/engine-errors").AnyEngineError>;
    };
    /**
     * ### State Query Methods
     * Methods for querying game state and context.
     */
    /** Get the owner of a card by instance ID */
    getCardOwner(instanceId: string): string;
    /** Get the zone of a card by instance ID */
    getCardZone(instanceId: string): ZoneType | undefined;
    /** Get current game state */
    getState(): OnePieceGameState;
    /** Get game context (turns, phases, players) */
    getCtx(): CoreCtx<unknown>;
    /** Get number of turns played */
    getNumTurns(): number;
    /** Get number of moves made */
    getNumMoves(): number;
    /** Get current game segment (startingAGame, duringGame, etc.) */
    getGameSegment(): string;
    /** Get current game phase within segment */
    getGamePhase(): string;
    /** Get players with current priority */
    getPriorityPlayers(): string[];
    /** Get current turn player */
    getTurnPlayer(): string;
    /** Get zone card counts for a player */
    getZonesCardCount(player?: string): Record<ZoneType, number>;
    /**
     * ### Card Query Methods
     * Methods for querying cards and card models.
     */
    /** Get all card models in the game */
    queryAllCards(): OnePieceModel[];
    /**
     * ### One Piece Specific Methods
     */
    /** Check if a player can place DON!! cards */
    canPlaceDon(playerId: string, count: number): boolean;
    /** Check if a player can play a character card */
    canPlayCharacter(playerId: string, instanceId: string): boolean;
    /** Get Life cards count for a player */
    getLifeCount(playerId: string): number;
    /** Check if player has lost */
    hasPlayerLost(playerId: string): boolean;
    /**
     * ### Utility Methods
     */
    /** Serialize to JSON (not implemented) */
    toJSON(): any;
    /** Get direct access to CoreEngine (use with caution) */
    getUnsafeClient(): CoreEngine<OnePieceGameState, OnePieceCard, import("./one-piece-engine-types").PlayerState, OnePieceCardFilter, OnePieceCardInstance>;
    /** Check if a player has already made their mulligan decision */
    hasPlayerMulliganed(playerId: string): boolean;
}
//# sourceMappingURL=one-piece-engine.d.ts.map