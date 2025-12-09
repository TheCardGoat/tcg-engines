/**
 * Alpha Clash master card registry
 *
 * Imports and exports all Alpha Clash cards from all sets
 */
import type { AlphaClashCard } from "./cardTypes";
/**
 * Master card registry - all Alpha Clash cards by ID
 */
export declare const allAlphaClashCardsById: Record<string, AlphaClashCard>;
/**
 * Helper function to get card by ID
 */
export declare const getAlphaClashCardById: (id: string) => AlphaClashCard | undefined;
/**
 * Helper function to get all cards of a specific type
 */
export declare const getAlphaClashCardsByType: (type: AlphaClashCard["type"]) => AlphaClashCard[];
/**
 * Helper function to get all cards from a specific set
 */
export declare const getAlphaClashCardsBySet: (set: string) => AlphaClashCard[];
/**
 * Validation function to ensure all card IDs are unique
 */
export declare const validateCardRegistry: () => string[];
//# sourceMappingURL=cards.d.ts.map