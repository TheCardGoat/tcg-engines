import { GameEngine } from "~/game-engine/core-engine/game-engine";
import type { CoreCtx } from "~/game-engine/core-engine/state/context";
import { GundamModel } from "./cards/gundam-card-model";
import type { GundamCardRepository } from "./cards/gundam-card-repository";
import type { GameCards, GundamGameState, ZoneType } from "./gundam-engine-types";
import type { GundamCardDefinition, GundamCardFilter, GundamPlayerState } from "./gundam-generic-types";
export type { GundamCardDefinition, GundamCardFilter, GundamPlayerState };
/**
 * GundamEngine Class
 * Main engine class for Gundam TCG game logic.
 */
export declare class GundamEngine extends GameEngine<GundamGameState, GundamCardDefinition, GundamPlayerState, GundamCardFilter, GundamModel> {
    protected cardRepository?: GundamCardRepository;
    /**
     * Constructor for GundamEngine
     */
    constructor({ initialState, initialCoreCtx, cards, cardRepository, gameId, playerId, seed, players, debug, }: {
        initialState: GundamGameState;
        initialCoreCtx?: CoreCtx;
        cards: GameCards;
        cardRepository?: GundamCardRepository;
        gameId: string;
        playerId?: string;
        debug?: boolean;
        seed?: string;
        players: string[];
    });
    /**
     * Initializes card models with Gundam-specific functionality
     */
    protected initializeCardModels(): void;
    /**
     * ### Enhanced Card Filtering
     * Type-safe card filtering with Gundam-specific properties
     */
    /** Query cards with Gundam-specific filtering capabilities */
    queryCardsByFilter(filter: GundamCardFilter): import("../../../core-engine/card/core-card-instance").CoreCardInstance<{
        id: string;
    }>[];
    /** Get engine store for backward compatibility with legacy APIs */
    getStore(): {
        state: import("../../../core-engine/game-configuration").CoreEngineState<GundamGameState>;
        stateHash: string;
    };
    /**
     * ### Available Moves
     * Game moves that can be executed by players.
     *
     * **chooseWhoGoesFirstMove(playerId)**
     * - Selects which player goes first
     * - Used during game setup phase
     * - Returns move result with success/failure status
     *
     * **alterHand(cardsToAlter)**
     * - Allows player to mulligan cards from hand
     * - Takes array of card instance IDs to replace
     * - Used during setup phase after initial draw
     */
    get moves(): {
        chooseFirstPlayer: (playerId: string) => import("../../../core-engine").Result<import("../../../core-engine/game-configuration").CoreEngineState<GundamGameState>, import("../../../core-engine/errors/engine-errors").AnyEngineError>;
        alterHand: (cardsToAlter: string[]) => false | import("../../../core-engine").Result<import("../../../core-engine/game-configuration").CoreEngineState<GundamGameState>, import("../../../core-engine/errors/engine-errors").AnyEngineError>;
        redrawHand: (shouldRedraw: boolean) => false | import("../../../core-engine").Result<import("../../../core-engine/game-configuration").CoreEngineState<GundamGameState>, import("../../../core-engine/errors/engine-errors").AnyEngineError>;
        concede: (playerId: string) => import("../../../core-engine").Result<import("../../../core-engine/game-configuration").CoreEngineState<GundamGameState>, import("../../../core-engine/errors/engine-errors").AnyEngineError>;
    };
    /**
     * ### State Query Methods
     * Methods for querying game state and context.
     */
    /** Get the owner of a card by instance ID */
    getCardOwner(instanceId: string): string;
    /** Get the zone of a card by instance ID */
    getCardZone(instanceId: string): ZoneType | undefined;
    getZonesCardCount(player?: string): Record<ZoneType, number>;
    /** Get all card models in the game */
    queryAllCards(): GundamModel[];
    /** Required implementations of abstract methods */
    getCurrentPhase(): string;
    getCurrentSegment(): string;
    isGameOver(): boolean;
    getWinners(): string[];
}
//# sourceMappingURL=gundam-engine.d.ts.map