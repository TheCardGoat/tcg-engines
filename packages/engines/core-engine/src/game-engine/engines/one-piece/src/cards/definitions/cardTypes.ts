/**
 * Card type definitions for One Piece TCG
 * Based on the comprehensive One Piece card information system
 */

import type {
  CardAttribute,
  CardCategory,
  CardColor,
  CardRarity,
} from "../../one-piece-generic-types";

// Base card interface - all cards extend this
export interface BaseCard {
  id: string; // Card number (unique identifier)
  name: string; // Card name
  category: CardCategory; // Card category (Leader, Character, Event, Stage, DON!!)
  set: string; // Block symbol
  number: number; // Card number within set
  rarity: CardRarity; // Card rarity
  colors: CardColor[]; // Card colors (can be multiple)
  cost?: number; // Cost to play (Character, Event, Stage cards only)
  text?: string; // Card text/effects
  flavorText?: string; // Flavor text
  types?: string[]; // Card types (e.g., "Straw Hat Crew", "Paramecia")
  implemented: boolean; // Whether card is implemented in engine
}

// Leader card interface
export interface LeaderCard extends BaseCard {
  category: "leader";
  power: number; // Leader power
  life: number; // Life value
  attribute: CardAttribute; // Leader attribute
  cost?: never; // Leaders don't have cost
}

// Character card interface
export interface CharacterCard extends BaseCard {
  category: "character";
  power: number; // Character power
  cost: number; // Cost to play
  attribute: CardAttribute; // Character attribute
  counter?: number; // Counter value (if any)
  life?: never; // Only Leaders have life
}

// Event card interface
export interface EventCard extends BaseCard {
  category: "event";
  cost: number; // Cost to activate
  counter?: number; // Counter value (if any)
  power?: never; // Events don't have power
  attribute?: never; // Events don't have attributes
  life?: never; // Events don't have life
}

// Stage card interface
export interface StageCard extends BaseCard {
  category: "stage";
  cost: number; // Cost to play
  power?: never; // Stages don't have power
  attribute?: never; // Stages don't have attributes
  life?: never; // Stages don't have life
  counter?: never; // Stages don't have counter
}

// DON!! card interface
export interface DonCard extends BaseCard {
  category: "don";
  cost?: never; // DON!! cards don't have cost
  power?: never; // DON!! cards don't have power
  attribute?: never; // DON!! cards don't have attributes
  life?: never; // DON!! cards don't have life
  counter?: never; // DON!! cards don't have counter
  colors: CardColor[]; // DON!! cards are colorless but need proper type
}

// Union type for all cards
export type OnePieceCard =
  | LeaderCard
  | CharacterCard
  | EventCard
  | StageCard
  | DonCard;

// Keyword effects for One Piece cards
export interface KeywordEffect {
  name: string;
  description: string;
  implemented: boolean;
}

// Ability interface for card effects
export interface CardAbility {
  type: "auto" | "activate" | "permanent" | "replacement";
  cost?: string; // Activation cost
  condition?: string; // Activation condition
  timing?: string; // When the ability can be used
  effect: string; // What the ability does
  keywords?: string[]; // Associated keywords
}

// Enhanced card interface with runtime information
export interface EnrichedCard {
  card: OnePieceCard;
  abilities: CardAbility[];
  keywords: KeywordEffect[];
  rulings?: string[]; // Official rulings for the card
  interactions?: string[]; // Notable interactions with other cards
}

// Card creation helpers
export const createLeaderCard = (
  base: Omit<LeaderCard, "category">,
): LeaderCard => ({
  ...base,
  category: "leader",
});

export const createCharacterCard = (
  base: Omit<CharacterCard, "category">,
): CharacterCard => ({
  ...base,
  category: "character",
});

export const createEventCard = (
  base: Omit<EventCard, "category">,
): EventCard => ({
  ...base,
  category: "event",
});

export const createStageCard = (
  base: Omit<StageCard, "category">,
): StageCard => ({
  ...base,
  category: "stage",
});

export const createDonCard = (base: Omit<DonCard, "category">): DonCard => ({
  ...base,
  category: "don",
  colors: [],
});

// Type guards for card categories
export const isLeaderCard = (card: OnePieceCard): card is LeaderCard => {
  return card.category === "leader";
};

export const isCharacterCard = (card: OnePieceCard): card is CharacterCard => {
  return card.category === "character";
};

export const isEventCard = (card: OnePieceCard): card is EventCard => {
  return card.category === "event";
};

export const isStageCard = (card: OnePieceCard): card is StageCard => {
  return card.category === "stage";
};

export const isDonCard = (card: OnePieceCard): card is DonCard => {
  return card.category === "don";
};

// Card validation helpers
export const hasColor = (card: OnePieceCard, color: CardColor): boolean => {
  return card.colors.includes(color);
};

export const isMulticolor = (card: OnePieceCard): boolean => {
  return card.colors.length > 1;
};

export const canPlayInDeck = (
  card: OnePieceCard,
  leaderColors: CardColor[],
): boolean => {
  if (card.category === "leader" || card.category === "don") {
    return false; // Leaders and DON!! cards are not in the deck
  }

  // Card must have at least one color in common with leader
  return card.colors.some((color) => leaderColors.includes(color));
};

export const hasKeyword = (card: OnePieceCard, keyword: string): boolean => {
  return card.text?.toLowerCase().includes(keyword.toLowerCase());
};

// Combat-related helpers
export const canAttack = (card: OnePieceCard): boolean => {
  return card.category === "leader" || card.category === "character";
};

export const canBlock = (card: OnePieceCard): boolean => {
  return card.category === "character" && hasKeyword(card, "blocker");
};

export const hasRush = (card: OnePieceCard): boolean => {
  return hasKeyword(card, "rush");
};

export const hasDoubleAttack = (card: OnePieceCard): boolean => {
  return hasKeyword(card, "double attack");
};

export const hasBanish = (card: OnePieceCard): boolean => {
  return hasKeyword(card, "banish");
};
