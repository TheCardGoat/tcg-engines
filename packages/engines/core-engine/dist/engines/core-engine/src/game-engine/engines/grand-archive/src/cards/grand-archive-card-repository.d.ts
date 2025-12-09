/**
 * Grand Archive Card Repository
 *
 * Extends CoreEngine's card repository for Grand Archive specific functionality
 */
import { CardRepository } from "~/game-engine/core-engine/card/card-repository-factory";
import type { GrandArchiveCardDefinition } from "../../grand-archive-engine-types";
/**
 * Grand Archive card repository implementation
 */
export declare class GrandArchiveCardRepository extends CardRepository<GrandArchiveCardDefinition> {
    constructor(cards: Record<string, Record<string, string>>);
    /**
     * Process cards for CardRepository format
     */
    private static processCards;
    /**
     * Create dictionary for CardRepository
     */
    private static createDictionary;
    /**
     * Get all card instance IDs
     */
    getAllInstanceIds(): string[];
    /**
     * Get all card definitions
     */
    getAllDefinitions(): GrandArchiveCardDefinition[];
    /**
     * Check if card exists by instance ID
     */
    hasCard(instanceId: string): boolean;
    /**
     * Get cards by type
     */
    getCardsByType(cardType: string): GrandArchiveCardDefinition[];
    /**
     * Get cards by element
     */
    getCardsByElement(element: string): GrandArchiveCardDefinition[];
    /**
     * Get implemented cards only
     */
    getImplementedCards(): GrandArchiveCardDefinition[];
    /**
     * Get cards with specific keyword
     */
    getCardsWithKeyword(keyword: string): GrandArchiveCardDefinition[];
    /**
     * Get cards with specific subtype
     */
    getCardsWithSubtype(subtype: string): GrandArchiveCardDefinition[];
    /**
     * Get cards by cost range
     */
    getCardsByCostRange(minCost: number, maxCost: number): GrandArchiveCardDefinition[];
    /**
     * Search cards by name (case-insensitive)
     */
    searchCardsByName(nameQuery: string): GrandArchiveCardDefinition[];
    /**
     * Get card statistics
     */
    getRepositoryStats(): {
        totalCards: number;
        implementedCards: number;
        cardsByType: Record<string, number>;
        cardsByElement: Record<string, number>;
        cardsBySet: Record<string, number>;
    };
    /**
     * Helper to group cards by property
     */
    private groupCardsByProperty;
    /**
     * Validate repository integrity
     */
    validateRepository(): boolean;
}
//# sourceMappingURL=grand-archive-card-repository.d.ts.map