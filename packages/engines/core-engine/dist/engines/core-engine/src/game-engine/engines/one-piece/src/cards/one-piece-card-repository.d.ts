/**
 * Card repository for One Piece TCG
 * Extends CoreEngine's card repository with One Piece-specific functionality
 */
import { CardRepository } from "~/game-engine/core-engine/card/card-repository-factory";
import type { OnePieceCard } from "./definitions/cardTypes";
export declare class OnePieceCardRepository extends CardRepository<OnePieceCard> {
    constructor(cards: Record<string, Record<string, string>>);
    private validateAndPopulate;
    /**
     * Get card definition by public ID
     */
    getCardByPublicId(publicId: string): OnePieceCard | undefined;
    /**
     * Get card definition by instance ID
     */
    getCardByInstanceId(instanceId: string): OnePieceCard | undefined;
    /**
     * Get all cards by category
     */
    getCardsByCategory(category: string): OnePieceCard[];
    /**
     * Get all leaders
     */
    getLeaders(): OnePieceCard[];
    /**
     * Get all characters
     */
    getCharacters(): OnePieceCard[];
    /**
     * Get all events
     */
    getEvents(): OnePieceCard[];
    /**
     * Get all stages
     */
    getStages(): OnePieceCard[];
    /**
     * Get all DON!! cards
     */
    getDonCards(): OnePieceCard[];
    /**
     * Get cards eligible for deck construction with given leader
     */
    getDeckEligibleCards(leaderColors: string[]): OnePieceCard[];
    /**
     * Validate deck construction rules
     */
    validateDeck(leaderPublicId: string, deckCardIds: string[]): {
        valid: boolean;
        errors: string[];
    };
    /**
     * Create standard DON!! deck (10 DON!! cards)
     */
    createStandardDonDeck(): string[];
    /**
     * Get implementation statistics
     */
    getImplementationStats(): {
        total: number;
        implemented: number;
        byCategory: Record<string, {
            total: number;
            implemented: number;
        }>;
    };
}
//# sourceMappingURL=one-piece-card-repository.d.ts.map