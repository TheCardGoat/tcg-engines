/**
 * Master card registry for One Piece TCG
 * This file aggregates all card definitions from various sets
 */

import type { OnePieceCard } from "./cardTypes";
import { TOKEN_CARDS } from "./tokens/tokens";

// Import card sets as they are created
// import { OP01_CARDS } from "./OP01";
// import { OP02_CARDS } from "./OP02";
// import { ST01_CARDS } from "./ST01";

// Create master card registry
export const allOnePieceCardsById: Record<string, OnePieceCard> = {
  // Card sets will be added here as they are implemented
  // ...OP01_CARDS,
  // ...OP02_CARDS,
  // ...ST01_CARDS,

  // Token cards
  ...TOKEN_CARDS,
};

// Helper functions for card lookup
export const getCardById = (id: string): OnePieceCard | undefined => {
  return allOnePieceCardsById[id];
};

export const getCardsBySet = (setCode: string): OnePieceCard[] => {
  return Object.values(allOnePieceCardsById).filter(
    (card) => card.set === setCode,
  );
};

export const getCardsByCategory = (category: string): OnePieceCard[] => {
  return Object.values(allOnePieceCardsById).filter(
    (card) => card.category === category,
  );
};

export const getCardsByColor = (color: string): OnePieceCard[] => {
  return Object.values(allOnePieceCardsById).filter((card) =>
    card.colors.some((c) => c === color),
  );
};

export const getCardsByRarity = (rarity: string): OnePieceCard[] => {
  return Object.values(allOnePieceCardsById).filter(
    (card) => card.rarity === rarity,
  );
};

// Get all implemented cards
export const getImplementedCards = (): OnePieceCard[] => {
  return Object.values(allOnePieceCardsById).filter((card) => card.implemented);
};

// Get cards that can be included in a deck with given leader colors
export const getDeckEligibleCards = (
  leaderColors: string[],
): OnePieceCard[] => {
  return Object.values(allOnePieceCardsById).filter((card) => {
    // Exclude leaders and DON!! cards from deck
    if (card.category === "leader" || card.category === "don") {
      return false;
    }

    // Card must share at least one color with leader
    return card.colors.some((color) => leaderColors.includes(color));
  });
};

// Statistics helpers
export const getCardCount = (): number => {
  return Object.keys(allOnePieceCardsById).length;
};

export const getImplementedCardCount = (): number => {
  return getImplementedCards().length;
};

export const getSetList = (): string[] => {
  const sets = new Set<string>();
  Object.values(allOnePieceCardsById).forEach((card) => sets.add(card.set));
  return Array.from(sets).sort();
};
