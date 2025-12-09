/**
 * Grand Archive Master Card Registry
 *
 * Central registry for all Grand Archive cards across all sets
 */
import type { GrandArchiveCard } from "./cardTypes";
/**
 * Master card registry - all Grand Archive cards by ID
 */
export declare const allGrandArchiveCardsById: Record<string, GrandArchiveCard>;
/**
 * Get all cards as an array
 */
export declare const getAllGrandArchiveCards: () => GrandArchiveCard[];
/**
 * Get cards by set
 */
export declare const getCardsBySet: (setCode: string) => GrandArchiveCard[];
/**
 * Get implemented cards only
 */
export declare const getImplementedCards: () => GrandArchiveCard[];
/**
 * Get cards by type
 */
export declare const getCardsByType: (type: string) => GrandArchiveCard[];
/**
 * Get cards by element
 */
export declare const getCardsByElement: (element: string) => GrandArchiveCard[];
/**
 * Validate card registry - ensure all cards have unique IDs
 */
export declare const validateCardRegistry: () => boolean;
//# sourceMappingURL=cards.d.ts.map