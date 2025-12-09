import { type Result } from "~/game-engine/core-engine";
import type { CardRepository } from "~/game-engine/core-engine/card/card-repository-factory";
import { CoreCardInstanceStore } from "~/game-engine/core-engine/card/core-card-instance-store";
import type { AnyEngineError } from "~/game-engine/core-engine/errors/engine-errors";
import type { CoreEngineState, GameDefinition } from "~/game-engine/core-engine/game-configuration";
import { type CoreCtx } from "~/game-engine/core-engine/state/context";
import type { GameCards } from "~/game-engine/core-engine/types";
import type { BaseCoreCardFilter, DefaultCardDefinition, DefaultGameState, DefaultPlayerState, GameSpecificCardDefinition, GameSpecificCardFilter, GameSpecificGameState, GameSpecificPlayerState } from "~/game-engine/core-engine/types/game-specific-types";
import type { CoreCardInstance } from "../card/core-card-instance";
import type { PlayerID } from "~/game-engine/core-engine/types/core-types";
export interface CoreEngineOpts<GameState extends GameSpecificGameState = DefaultGameState, CardDefinition extends GameSpecificCardDefinition = DefaultCardDefinition, PlayerState extends GameSpecificPlayerState = DefaultPlayerState, CardFilter extends GameSpecificCardFilter = BaseCoreCardFilter, CardModel extends CoreCardInstance<CardDefinition> = CoreCardInstance<CardDefinition>> {
    game: GameDefinition<GameState>;
    matchID?: string;
    gameID?: string;
    playerID?: PlayerID;
    initialState?: GameState;
    initialCoreCtx?: CoreCtx;
    players?: string[];
    cards: GameCards;
    debug?: boolean;
    seed?: string;
    repository: CardRepository<CardDefinition>;
}
export type ClientState<GameState extends GameSpecificGameState = DefaultGameState> = null | (CoreEngineState<GameState> & {
    isActive: boolean;
    isConnected: boolean;
});
export declare class CoreEngine<GameState extends GameSpecificGameState = DefaultGameState, CardDefinition extends GameSpecificCardDefinition = DefaultCardDefinition, PlayerState extends GameSpecificPlayerState = DefaultPlayerState, CardFilter extends GameSpecificCardFilter = BaseCoreCardFilter, CardInstance extends CoreCardInstance<CardDefinition> = CoreCardInstance<CardDefinition>> {
    private readonly debug?;
    private readonly gameRuntime;
    private subscribers;
    private gameStateStore;
    private flowManager;
    cardInstanceStore: CoreCardInstanceStore<CardDefinition>;
    private authoritativeEngine?;
    private clientEngines;
    private isAuthoritative;
    matchID: string;
    gameID: string;
    readonly playerID: PlayerID | null;
    constructor({ game, matchID, playerID, initialState, cards, players, debug, seed, repository, initialCoreCtx, }: CoreEngineOpts<GameState, CardDefinition, PlayerState, CardFilter, CardInstance>);
    private createFnContextFromState;
    processMove(playerID: string, moveType: string, args: unknown[]): Result<CoreEngineState<GameState>, AnyEngineError>;
    private canPlayerMove;
    private updateState;
    private notifySubscribers;
    setAuthoritativeEngine(authEngine: CoreEngine<GameState, CardDefinition, PlayerState, CardFilter, CardInstance>): void;
    private registerClientEngine;
    private receiveFromClient;
    private broadcastToClients;
    private receiveFromAuthoritative;
    subscribe(callback: (state: ClientState<GameState>) => void): () => void;
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
    getGameStep(): string;
    /**
     * Get players with current priority
     * @returns Array of player IDs who have priority
     */
    getPriorityPlayers(): string[];
    /**
     * Get current turn player
     * @returns ID of the current turn player
     */
    getTurnPlayer(): string;
    getState(): ClientState<GameState>;
    getCurrentPlayer(): PlayerID | null;
    getGameState(): CoreEngineState<GameState>;
    getGameStateHash(): string;
    isGameOver(): boolean;
    hasPlayerMulliganed(playerID: PlayerID): boolean;
    getAllCards(): CoreCardInstance<CardDefinition>[];
    queryAllCards(): CoreCardInstance<CardDefinition>[];
    /**
     * Type-safe card filtering with game-specific properties
     *
     * @param filter - Type-safe filter object with game-specific properties
     * @returns Array of matching card instances
     */
    queryCardsByFilter(filter: CardFilter): CoreCardInstance<{
        id: string;
    }>[];
    /**
     * Gets the owner of a card by instance ID
     * @param instanceId The instance ID of the card
     * @returns The player ID who owns the card, or undefined if not found
     */
    getCardOwner(instanceId: string): string | undefined;
    /**
     * Gets the zone of a card by instance ID
     * @param instanceId The instance ID of the card
     * @returns The zone name where the card is located, or undefined if not found
     */
    getCardZone(instanceId: string): string | undefined;
    /** Protected method for subclasses to initialize card models */
    protected initializeCardModels(): void;
    /**
     * Query cards by game-specific filter with enhanced type safety
     * @param filter The filter to apply
     * @returns Matched card models
     */
    queryCards(filter: CardFilter): CardInstance[];
    /**
     * Find cards in a specific zone
     * @param zoneName The zone to search
     * @param playerId Optional player ID to filter by
     * @returns Array of card models in the zone
     */
    getCardsInZone(zoneName: string, playerId?: string): CardInstance[];
    /**
     * Increment turn count (for testing state sharing with coreOps)
     */
    incrementTurnCount(): void;
    /**
     * Get current turn count (for testing state sharing with coreOps)
     */
    getTurnCount(): number;
}
export declare function Core<GameState extends GameSpecificGameState = DefaultGameState, CardDefinition extends GameSpecificCardDefinition = DefaultCardDefinition, PlayerState extends GameSpecificPlayerState = DefaultPlayerState, CardFilter extends GameSpecificCardFilter = BaseCoreCardFilter, CardModel extends CoreCardInstance<CardDefinition> = CoreCardInstance<CardDefinition>>(opts: CoreEngineOpts<GameState, CardDefinition, PlayerState, CardFilter, CardModel>): CoreEngine<GameState, CardDefinition, PlayerState, CardFilter, CardModel>;
//# sourceMappingURL=core-engine.d.ts.map