import { allCardsById, type LorcanitoCard } from "@lorcanito/lorcana-engine";
import { CardRepository } from "~/game-engine/core-engine/card/card-repository-factory";
import type { GameCards } from "~/game-engine/core-engine/types";

import type { LorcanaAbility } from "~/game-engine/engines/lorcana/src/abilities/ability-types";

// TODO: Remove this once we have redefined card abilities
export type LorcanaCardDefinition = LorcanitoCard & {
  id: string;
  abilities?: LorcanaAbility[];
};

export class LorcanaCardRepository extends CardRepository<LorcanaCardDefinition> {
  constructor(dictionary: GameCards) {
    // TODO: Remove this once we have redefined card abilities
    super(
      dictionary,
      allCardsById as Record<
        string,
        LorcanitoCard & { id: string; abilities?: LorcanaAbility[] }
      >,
      {
        validateDuplicates: true,
        errorPrefix: "LorcanaCardRepository",
      },
    );
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
