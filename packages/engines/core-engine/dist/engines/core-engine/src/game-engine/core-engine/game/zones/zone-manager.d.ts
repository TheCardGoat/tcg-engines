/**
 * Zone Manager for handling card movement and zone state management
 */
import type { CardLocation, MoveCardResult, Zone, ZoneConfiguration, ZoneQuery, ZoneState, ZoneStats } from "./zone-types";
/**
 * Manages game zones and card movements
 */
export declare class ZoneManager<T = any> {
    private zones;
    private configuration;
    private cardLocations;
    constructor(configuration: ZoneConfiguration);
    /**
     * Initialize zones based on configuration
     */
    private initializeZones;
    /**
     * Initialize player-specific zones
     */
    initializePlayerZones(playerId: string): void;
    /**
     * Move a card from one zone to another
     */
    moveCard(cardId: string, fromZoneId: string, toZoneId: string): MoveCardResult;
    /**
     * Get zone by ID
     */
    getZone(zoneId: string): Zone<T> | undefined;
    /**
     * Get player-specific zone
     */
    getPlayerZone(playerId: string, zoneType: string): Zone<T> | undefined;
    /**
     * Query zones based on criteria
     */
    queryZones(query: ZoneQuery): Zone<T>[];
    /**
     * Get statistics for a zone
     */
    getZoneStats(zoneId: string): ZoneStats | undefined;
    /**
     * Get all cards in a specific zone
     */
    getCardsInZone(zoneId: string): T[];
    /**
     * Find a card by ID across all zones
     */
    findCard(cardId: string): {
        card: T;
        zone: Zone<T>;
    } | undefined;
    /**
     * Get card location
     */
    getCardLocation(cardId: string): CardLocation | undefined;
    /**
     * Get current zone state snapshot
     */
    getZoneState(): ZoneState<T>;
    /**
     * Restore zone state from snapshot
     */
    restoreZoneState(state: ZoneState<T>): void;
    /**
     * Add a card to a specific zone
     */
    addCardToZone(card: T, zoneId: string): MoveCardResult;
    /**
     * Remove a card from a zone
     */
    removeCardFromZone(cardId: string, zoneId: string): MoveCardResult;
    /**
     * Helper method to get card ID
     * Override this method to customize card ID extraction
     */
    protected getCardId(card: any): string;
    /**
     * Clear all zones
     */
    clearAllZones(): void;
    /**
     * Get all zones
     */
    getAllZones(): Zone<T>[];
}
//# sourceMappingURL=zone-manager.d.ts.map