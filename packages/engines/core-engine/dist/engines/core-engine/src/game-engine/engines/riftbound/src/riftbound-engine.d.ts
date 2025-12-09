/**
 * Main Riftbound Engine class
 * Extends the GameEngine framework to implement Riftbound TCG rules
 */
import { CardRepository } from "~/game-engine/core-engine/card/card-repository-factory";
import type { CoreCardInstance } from "~/game-engine/core-engine/card/core-card-instance";
import { GameEngine } from "~/game-engine/core-engine/game-engine";
import type { CoreCtx } from "~/game-engine/core-engine/state/context";
import type { BaseCoreCardFilter, DefaultCardDefinition } from "~/game-engine/core-engine/types/game-specific-types";
import type { MoveResult, RiftboundGameState, RiftboundMoveType, RiftboundPlayerState, ZoneType } from "./riftbound-generic-types";
type RiftboundCardDefinition = DefaultCardDefinition;
type RiftboundCardFilter = BaseCoreCardFilter;
type RiftboundCardInstance = CoreCardInstance<RiftboundCardDefinition>;
/**
 * Configuration options for the Riftbound engine
 */
export interface RiftboundEngineConfig {
    initialState?: RiftboundGameState;
    initialCoreCtx?: CoreCtx;
    cards?: Record<string, Record<string, string>>;
    cardRepository?: CardRepository<RiftboundCardDefinition>;
    playerId?: string;
    gameId: string;
    matchId?: string;
    debug?: boolean;
    seed: string;
    players: string[];
    skipPreGame?: boolean;
}
/**
 * Main Riftbound Engine class
 * Implements the complete Riftbound TCG ruleset
 */
export declare class RiftboundEngine extends GameEngine<RiftboundGameState, RiftboundCardDefinition, RiftboundPlayerState, RiftboundCardFilter, RiftboundCardInstance> {
    protected cardRepository?: CardRepository<RiftboundCardDefinition>;
    /**
     * Constructor for RiftboundEngine
     */
    constructor(config: RiftboundEngineConfig);
    /**
     * Initialize the engine with configuration
     */
    private initializeEngine;
    /**
     * Initializes card models with Riftbound-specific functionality
     */
    protected initializeCardModels(): void;
    /**
     * Get zone card counts for a player
     */
    getZonesCardCount(player?: string): Record<ZoneType, number>;
    /** Query all cards in the game */
    queryAllCards(): RiftboundCardInstance[];
    /**
     * Process a Riftbound-specific move with type safety
     */
    processRiftboundMove<T extends RiftboundMoveType>(moveType: T, params: any): MoveResult;
    /**
     * Game move implementations
     */
    get moves(): {
        concede: (playerId: string) => import("../../../core-engine").Result<import("../../../core-engine/game-configuration").CoreEngineState<import("./riftbound-engine-types").RiftboundGameState>, import("../../../core-engine/errors/engine-errors").AnyEngineError>;
    };
    /**
     * Get the current game state for debugging
     */
    getDebugState(): {
        gameSegment: string;
        gamePhase: string;
        gameState: string;
        turnPlayer: string;
        priorityPlayers: string[];
        playerCount: number;
        victoryScore: number;
    };
    /**
     * Required implementations of abstract methods
     */
    getCurrentPhase(): string;
    getCurrentSegment(): string;
    isGameOver(): boolean;
    /**
     * Check if a player can win the game
     */
    canWin(playerId: string): boolean;
    getWinners(): string[];
    /**
     * Serialize the game state for persistence
     */
    serialize(): string;
    /**
     * Deserialize and restore game state
     */
    static deserialize(data: string, config: Omit<RiftboundEngineConfig, "initialState">): RiftboundEngine;
}
export {};
//# sourceMappingURL=riftbound-engine.d.ts.map