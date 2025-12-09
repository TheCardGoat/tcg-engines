/**
 * Grand Archive Master Card Registry
 *
 * Central registry for all Grand Archive cards across all sets
 */
// Import all sets
import { SET001_CARDS } from "./SET001";
import { TOKEN_CARDS } from "./tokens/tokens";
/**
 * Master card registry - all Grand Archive cards by ID
 */
export const allGrandArchiveCardsById = {
    ...SET001_CARDS,
    ...TOKEN_CARDS,
};
/**
 * Get all cards as an array
 */
export const getAllGrandArchiveCards = () => {
    return Object.values(allGrandArchiveCardsById);
};
/**
 * Get cards by set
 */
export const getCardsBySet = (setCode) => {
    return getAllGrandArchiveCards().filter((card) => card.set === setCode);
};
/**
 * Get implemented cards only
 */
export const getImplementedCards = () => {
    return getAllGrandArchiveCards().filter((card) => card.implemented);
};
/**
 * Get cards by type
 */
export const getCardsByType = (type) => {
    return getAllGrandArchiveCards().filter((card) => card.type === type);
};
/**
 * Get cards by element
 */
export const getCardsByElement = (element) => {
    return getAllGrandArchiveCards().filter((card) => card.element === element);
};
/**
 * Validate card registry - ensure all cards have unique IDs
 */
export const validateCardRegistry = () => {
    const allCards = getAllGrandArchiveCards();
    const uniqueIds = new Set(allCards.map((card) => card.id));
    if (allCards.length !== uniqueIds.size) {
        console.error("Duplicate card IDs found in registry!");
        return false;
    }
    return true;
};
// Validate on module load
if (!validateCardRegistry()) {
    throw new Error("Card registry validation failed - duplicate IDs detected");
}
//# sourceMappingURL=cards.js.map