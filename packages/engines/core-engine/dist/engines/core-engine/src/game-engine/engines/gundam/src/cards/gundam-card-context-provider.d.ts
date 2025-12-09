import type { GundamEngine } from "~/game-engine/engines/gundam/src/gundam-engine";
/**
 * LorcanaEngine implementation of CardContextProvider
 * Provides fresh card state from the Lorcana engine's game state
 */
export declare class GundamCardContextProvider {
    private engine;
    constructor(engine: GundamEngine);
    /**
     * Get fresh card state by instance ID
     */
    getCardState(instanceId: string): {
        instanceId: string;
        publicId: string;
        owner: string;
        zone: import("../gundam-engine-types").ZoneType;
        modifiers: any[];
        counters: Record<string, number>;
        statusEffects: Set<string>;
        metadata: {};
    };
    /**
     * Get all card instance IDs for a player
     */
    getPlayerCards(playerId: string): string[];
    /**
     * Get all card instance IDs in a specific zone across all players
     */
    getZoneCards(zone: string): string[];
    /**
     * Get public ID for an instance ID from the engine's card mapping
     */
    private getPublicIdForInstance;
    /**
     * Get modifiers for a card from the Gundam game state
     */
    private getCardModifiers;
    /**
     * Get counters for a card from the Gundam game state
     */
    private getCardCounters;
    /**
     * Get status effects for a card from the Gundam game state
     */
    private getCardStatusEffects;
}
//# sourceMappingURL=gundam-card-context-provider.d.ts.map