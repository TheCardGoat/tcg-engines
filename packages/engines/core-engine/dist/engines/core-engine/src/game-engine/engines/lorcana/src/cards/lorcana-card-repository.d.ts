import { type LorcanitoCard } from "@lorcanito/lorcana-engine";
import { CardRepository } from "~/game-engine/core-engine/card/card-repository-factory";
import type { GameCards } from "~/game-engine/core-engine/types";
export type LorcanaCardDefinition = LorcanitoCard & {
    id: string;
};
/**
 * Streamlined Lorcana card repository using factory approach
 * Eliminates 95% of the boilerplate from the inheritance approach
 */
export declare class LorcanaCardRepository extends CardRepository<LorcanaCardDefinition> {
    constructor(dictionary: GameCards);
    /**
     * Lorcana-specific helper methods
     */
    /**
     * Get cards by Lorcana-specific properties
     */
    getCardsByType(type: string): LorcanaCardDefinition[];
    /**
     * Get cards by color
     */
    getCardsByColor(color: string): LorcanaCardDefinition[];
    /**
     * Get cards with inkwell symbol
     */
    getInkwellCards(): LorcanaCardDefinition[];
    /**
     * Get cards by cost range
     */
    getCardsByCostRange(minCost: number, maxCost: number): LorcanaCardDefinition[];
}
//# sourceMappingURL=lorcana-card-repository.d.ts.map