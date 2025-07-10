import { allCardsById, type LorcanitoCard } from "@lorcanito/lorcana-engine";
import { CardRepository } from "~/game-engine/core-engine/card/card-repository-factory";
import type { GameCards } from "~/game-engine/core-engine/types";

export type LorcanaCardDefinition = LorcanitoCard & { id: string };

/**
 * Streamlined Lorcana card repository using factory approach
 * Eliminates 95% of the boilerplate from the inheritance approach
 */
export class LorcanaCardRepository extends CardRepository<LorcanaCardDefinition> {
  constructor(dictionary: GameCards) {
    super(dictionary, allCardsById as Record<string, LorcanitoCard>, {
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
  getCardsByType(type: string): LorcanaCardDefinition[] {
    return Object.values(this.getAllCards()).filter(
      (card) => card.type === type,
    );
  }

  /**
   * Get cards by color
   */
  getCardsByColor(color: string): LorcanaCardDefinition[] {
    return Object.values(this.getAllCards()).filter((card) =>
      card.colors?.includes(color as any),
    );
  }

  /**
   * Get cards with inkwell symbol
   */
  getInkwellCards(): LorcanaCardDefinition[] {
    return Object.values(this.getAllCards()).filter((card) => card.inkwell);
  }

  /**
   * Get cards by cost range
   */
  getCardsByCostRange(
    minCost: number,
    maxCost: number,
  ): LorcanaCardDefinition[] {
    return Object.values(this.getAllCards()).filter(
      (card) => card.cost >= minCost && card.cost <= maxCost,
    );
  }
}
