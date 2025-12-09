/**
 * Test engine for Riftbound TCG
 * Provides testing utilities and mock game states for unit tests
 */
import { type CoreCtx } from "~/game-engine/core-engine/state/context";
import type { RiftboundCard } from "../cards/definitions/cardTypes";
import { RiftboundEngine } from "../riftbound-engine";
import type { Domain, GamePhase, GameSegment, RiftboundGameState, ZoneType } from "../riftbound-generic-types";
export declare const mockUnitCard: RiftboundCard;
export declare const mockSpellCard: RiftboundCard;
export declare const mockRuneCard: RiftboundCard;
export declare const mockBattlefieldCard: RiftboundCard;
export declare const mockLegendCard: RiftboundCard;
export type TestInitialState = Partial<Record<ZoneType, RiftboundCard[] | number>>;
interface TestOptions {
    debug?: boolean;
    skipPreGame?: boolean;
    gameMode?: string;
}
/**
 * Riftbound Test Engine class
 * Provides utilities for testing Riftbound game logic
 */
export declare class RiftboundTestEngine {
    private readonly cards;
    authoritativeEngine: RiftboundEngine;
    playerOneEngine: RiftboundEngine;
    playerTwoEngine: RiftboundEngine;
    activeEngine: string;
    constructor(playerState?: TestInitialState, opponentState?: TestInitialState, opts?: TestOptions);
    /**
     * Create a mock game state for testing
     */
    private createMockGame;
    /**
     * Update initial state with test data
     */
    private updateInitialState;
    /**
     * Generate mock cards for testing
     */
    private generateMockCards;
    /**
     * Get zone visibility
     */
    private getZoneVisibility;
    /**
     * Check if zone is ordered
     */
    private isZoneOrdered;
    get engine(): RiftboundEngine;
    changeActivePlayer(playerId: string): void;
    getState(): RiftboundGameState;
    getCtx(): CoreCtx & {
        turnPlayer: string;
        priorityPlayer: string;
    };
    getTurnPlayer(): string;
    getPriorityPlayers(): string[];
    getGameSegment(): GameSegment;
    getGamePhase(): GamePhase;
    getZonesCardCount(playerId?: string): Record<ZoneType, number>;
    /**
     * Assert that zones contain the expected cards
     */
    assertThatZonesContain(zones: Partial<Record<ZoneType, number>>, playerId?: string): void;
    /**
     * Assert that the current game phase matches expected value
     */
    assertGamePhase(expectedPhase: GamePhase): void;
    /**
     * Assert that the current game segment matches expected value
     */
    assertGameSegment(expectedSegment: GameSegment): void;
    /**
     * Assert that the turn player matches expected value
     */
    assertTurnPlayer(expectedPlayer: string): void;
    chooseDomainIdentity(playerId: string, domains: Domain[]): void;
    /**
     * First player selection move
     */
    chooseFirstPlayer(playerId: string): void;
    /**
     * End the current player's turn
     */
    endTurn(): void;
    /**
     * Draw cards for the active player
     */
    drawCard(count?: number): void;
    /**
     * Clean up resources
     */
    dispose(): void;
}
export {};
//# sourceMappingURL=riftbound-test-engine.d.ts.map