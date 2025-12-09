import { CardRepository } from "~/game-engine/core-engine/card/card-repository-factory";
import type { GameCards } from "~/game-engine/core-engine/types";
import type { GundamCardDefinition } from "~/game-engine/engines/gundam/src/gundam-engine-types";
/**
 * Streamlined Gundam card repository using factory approach
 * Eliminates the boilerplate while maintaining game-specific functionality
 */
export declare class GundamCardRepository extends CardRepository<GundamCardDefinition> {
    constructor(dictionary: GameCards);
    /**
     * Gundam-specific helper methods
     */
    /**
     * Get cards by Gundam-specific card type
     */
    getCardsByType(cardType: "pilot" | "unit" | "command" | "base"): GundamCardDefinition[];
    /**
     * Get pilot cards that can attach to a specific unit type
     */
    getCompatiblePilots(unitType: string): GundamCardDefinition[];
    /**
     * Get cards by cost
     */
    getCardsByCost(cost: number): GundamCardDefinition[];
    /**
     * Get cards by zone restriction (space/earth)
     */
    getCardsByZoneRestriction(zone: "space" | "earth"): GundamCardDefinition[];
}
//# sourceMappingURL=gundam-card-repository.d.ts.map