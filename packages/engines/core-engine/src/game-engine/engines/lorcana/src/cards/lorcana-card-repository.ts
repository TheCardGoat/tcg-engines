import { CardRepository } from "~/game-engine/core-engine/card/card-repository-factory";
import type { GameCards } from "~/game-engine/core-engine/types";
import type { LorcanaCardDefinition } from "./lorcana-card-types";

// Re-export types from the types file to maintain backward compatibility
export type {
  CardColor,
  CardRarity,
  Characteristics,
  LorcanaActionCardDefinition,
  LorcanaCardDefinition,
  LorcanaCharacterCardDefinition,
  LorcanaItemCardDefinition,
  LorcanaLocationCardDefinition,
} from "./lorcana-card-types";

export class LorcanaCardRepository extends CardRepository<LorcanaCardDefinition> {
  constructor(
    dictionary: GameCards,
    allCardsById?: Record<string, LorcanaCardDefinition>,
  ) {
    // Lazy import to avoid circular dependency
    const cardsById =
      allCardsById ||
      (() => {
        const {
          allCardsById: cards,
        } = require("~/game-engine/engines/lorcana/src/cards/definitions/cards");
        return cards as Record<string, LorcanaCardDefinition>;
      })();

    super(dictionary, cardsById, {
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

// Legacy type alias for backward compatibility
// Legacy type alias already defined above as interface LorcanaCharacterCardDefinition
