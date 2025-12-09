/**
 * Alpha Clash Card Repository
 *
 * Manages card definitions and provides lookup functionality
 * for Alpha Clash cards. Extends the CoreEngine card repository.
 */
import { CardRepository } from "~/game-engine/core-engine/card/card-repository-factory";
import type { AlphaClashCardDefinition } from "../../alpha-clash-engine-types";
export declare class AlphaClashCardRepository extends CardRepository<AlphaClashCardDefinition> {
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
     * Validate a card can be played based on its properties
     */
    canPlayCard(instanceId: string, context: {
        phase: string;
        priorityWindow?: string;
    }): boolean;
}
//# sourceMappingURL=alpha-clash-card-repository.d.ts.map