import type { GameCards } from "~/game-engine/core-engine/types";
interface CoreCardDefinition {
    id: string;
}
/**
 * Generic factory function to create card repositories without inheritance boilerplate
 * Eliminates the need for game-specific repository classes
 */
export declare function createCardRepository<TCard extends CoreCardDefinition>(dictionary: GameCards, cardLookup: Record<string, TCard>, options?: {
    validateDuplicates?: boolean;
    errorPrefix?: string;
}): Record<string, TCard>;
/**
 * Simplified card repository interface
 * Combines the functionality of CoreCardDefinitionRepository with a cleaner API
 */
export declare class CardRepository<TCard extends CoreCardDefinition> {
    private cards;
    readonly dictionary: GameCards;
    constructor(dictionary: GameCards, cardLookup: Record<string, TCard>, options?: {
        validateDuplicates?: boolean;
        errorPrefix?: string;
    });
    /**
     * Get card definition by instance ID
     */
    getCardByInstanceId(instanceId: string): TCard | undefined;
    /**
     * Get card definition by public ID (slower, iterates through all cards)
     */
    getCardByPublicId(publicId: string): TCard | undefined;
    /**
     * Get all card definitions
     */
    getAllCards(): Record<string, TCard>;
    /**
     * Get card definitions for a specific player
     */
    getPlayerCards(playerId: string): TCard[];
    /**
     * Check if a card instance exists
     */
    hasCard(instanceId: string): boolean;
    /**
     * Get card statistics
     */
    getStats(): {
        totalCards: number;
        playersCount: number;
        uniquePublicIds: number;
    };
}
export {};
//# sourceMappingURL=card-repository-factory.d.ts.map