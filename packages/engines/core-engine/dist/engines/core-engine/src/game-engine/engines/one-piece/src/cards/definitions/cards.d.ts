/**
 * Master card registry for One Piece TCG
 * This file aggregates all card definitions from various sets
 */
import type { OnePieceCard } from "./cardTypes";
export declare const allOnePieceCardsById: Record<string, OnePieceCard>;
export declare const getCardById: (id: string) => OnePieceCard | undefined;
export declare const getCardsBySet: (setCode: string) => OnePieceCard[];
export declare const getCardsByCategory: (category: string) => OnePieceCard[];
export declare const getCardsByColor: (color: string) => OnePieceCard[];
export declare const getCardsByRarity: (rarity: string) => OnePieceCard[];
export declare const getImplementedCards: () => OnePieceCard[];
export declare const getDeckEligibleCards: (leaderColors: string[]) => OnePieceCard[];
export declare const getCardCount: () => number;
export declare const getImplementedCardCount: () => number;
export declare const getSetList: () => string[];
//# sourceMappingURL=cards.d.ts.map