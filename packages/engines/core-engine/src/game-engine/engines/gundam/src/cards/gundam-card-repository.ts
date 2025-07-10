import { CardRepository } from "~/game-engine/core-engine/card/card-repository-factory";
import type { GameCards } from "~/game-engine/core-engine/types";
import type { GundamCardDefinition } from "~/game-engine/engines/gundam/src/gundam-engine-types";
import { allGundamCardsById } from "./definitions/cards";

/**
 * Streamlined Gundam card repository using factory approach
 * Eliminates the boilerplate while maintaining game-specific functionality
 */
export class GundamCardRepository extends CardRepository<GundamCardDefinition> {
  constructor(dictionary: GameCards) {
    super(
      dictionary,
      allGundamCardsById as Record<string, GundamCardDefinition>,
      {
        validateDuplicates: true,
        errorPrefix: "GundamCardRepository",
      },
    );
  }

  /**
   * Gundam-specific helper methods
   */

  /**
   * Get cards by Gundam-specific card type
   */
  getCardsByType(
    cardType: "pilot" | "unit" | "command" | "base",
  ): GundamCardDefinition[] {
    return Object.values(this.getAllCards()).filter(
      (card) => (card as any).cardType === cardType,
    );
  }

  /**
   * Get pilot cards that can attach to a specific unit type
   */
  getCompatiblePilots(unitType: string): GundamCardDefinition[] {
    return this.getCardsByType("pilot").filter((pilot) => {
      const restrictions = (pilot as any).pilotRestrictions;
      return !restrictions || restrictions.includes(unitType);
    });
  }

  /**
   * Get cards by cost
   */
  getCardsByCost(cost: number): GundamCardDefinition[] {
    return Object.values(this.getAllCards()).filter(
      (card) => (card as any).cost === cost,
    );
  }

  /**
   * Get cards by zone restriction (space/earth)
   */
  getCardsByZoneRestriction(zone: "space" | "earth"): GundamCardDefinition[] {
    return Object.values(this.getAllCards()).filter((card) => {
      const restrictions = (card as any).zoneRestrictions;
      return !restrictions || restrictions.includes(zone);
    });
  }
}
