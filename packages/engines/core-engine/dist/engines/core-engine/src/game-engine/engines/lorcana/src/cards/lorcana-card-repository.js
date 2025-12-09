import { allCardsById } from "@lorcanito/lorcana-engine";
import { CardRepository } from "~/game-engine/core-engine/card/card-repository-factory";
/**
 * Streamlined Lorcana card repository using factory approach
 * Eliminates 95% of the boilerplate from the inheritance approach
 */
export class LorcanaCardRepository extends CardRepository {
    constructor(dictionary) {
        super(dictionary, allCardsById, {
            validateDuplicates: true,
            errorPrefix: "LorcanaCardRepository",
        });
    }
    /**
     * Lorcana-specific helper methods
     */
    /**
     * Get cards by Lorcana-specific properties
     */
    getCardsByType(type) {
        return Object.values(this.getAllCards()).filter((card) => card.type === type);
    }
    /**
     * Get cards by color
     */
    getCardsByColor(color) {
        return Object.values(this.getAllCards()).filter((card) => card.colors?.includes(color));
    }
    /**
     * Get cards with inkwell symbol
     */
    getInkwellCards() {
        return Object.values(this.getAllCards()).filter((card) => card.inkwell);
    }
    /**
     * Get cards by cost range
     */
    getCardsByCostRange(minCost, maxCost) {
        return Object.values(this.getAllCards()).filter((card) => card.cost >= minCost && card.cost <= maxCost);
    }
}
//# sourceMappingURL=lorcana-card-repository.js.map