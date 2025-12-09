import { CardRepository } from "~/game-engine/core-engine/card/card-repository-factory";
import { allGundamCardsById } from "./definitions/cards";
/**
 * Streamlined Gundam card repository using factory approach
 * Eliminates the boilerplate while maintaining game-specific functionality
 */
export class GundamCardRepository extends CardRepository {
    constructor(dictionary) {
        super(dictionary, allGundamCardsById, {
            validateDuplicates: true,
            errorPrefix: "GundamCardRepository",
        });
    }
    /**
     * Gundam-specific helper methods
     */
    /**
     * Get cards by Gundam-specific card type
     */
    getCardsByType(cardType) {
        return Object.values(this.getAllCards()).filter((card) => card.cardType === cardType);
    }
    /**
     * Get pilot cards that can attach to a specific unit type
     */
    getCompatiblePilots(unitType) {
        return this.getCardsByType("pilot").filter((pilot) => {
            const restrictions = pilot.pilotRestrictions;
            return !restrictions || restrictions.includes(unitType);
        });
    }
    /**
     * Get cards by cost
     */
    getCardsByCost(cost) {
        return Object.values(this.getAllCards()).filter((card) => card.cost === cost);
    }
    /**
     * Get cards by zone restriction (space/earth)
     */
    getCardsByZoneRestriction(zone) {
        return Object.values(this.getAllCards()).filter((card) => {
            const restrictions = card.zoneRestrictions;
            return !restrictions || restrictions.includes(zone);
        });
    }
}
//# sourceMappingURL=gundam-card-repository.js.map