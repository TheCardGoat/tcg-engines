/**
 * Card type definitions for Riftbound TCG
 * Based on the comprehensive rules analysis covering all card categories
 */

import type {
  CardRarity,
  CardType,
  Domain,
} from "../../riftbound-engine-types";

// Base interface for all Riftbound cards
export interface RiftboundBaseCard {
  id: string; // Unique identifier
  name: string; // Card name
  type: CardType; // Card category
  set: string; // Set code (e.g., "RF01")
  number: number; // Card number in set
  rarity: CardRarity; // Card rarity
  implemented: boolean; // Implementation status

  // Domain and cost information
  domains: Domain[]; // One or more domains
  energyCost: number; // Numeric energy cost
  powerCost: Partial<Record<Domain, number>>; // Domain-specific power costs

  // Rules text and flavor
  rulesText?: string; // Game mechanics text
  flavorText?: string; // Lore/aesthetic text
  reminderText?: string; // Keyword explanations

  // Art and presentation
  illustrator?: string;
  artVariant?: string;
}

// Keywords that can appear on cards
export type Keyword =
  | "accelerate" // Units enter ready if cost paid
  | "action" // Can be played during showdowns
  | "reaction" // Can be played during closed states
  | "assault" // +X Might while attacking
  | "shield" // +X Might while defending
  | "tank" // Must be assigned combat damage first
  | "ganking" // Can move battlefield to battlefield
  | "hidden" // Can be hidden facedown at battlefields
  | "deflect" // Spells targeting this cost extra
  | "deathknell" // Triggered ability when killed
  | "legion" // Enhanced if played second+ card this turn
  | "temporary" // Killed at start of controller's turn
  | "vision"; // Look at top of deck when played

// Ability structure for cards
export interface CardAbility {
  type: "passive" | "activated" | "triggered" | "replacement";
  cost?: {
    energy?: number;
    power?: Partial<Record<Domain, number>>;
    exhaust?: boolean;
    sacrifice?: boolean;
    discard?: number;
    other?: string;
  };
  condition?: string; // When ability can be used
  trigger?: string; // What causes triggered abilities
  effect: string; // What the ability does
  keywords?: Keyword[]; // Associated keywords
}

// Tag types for tribal/archetype synergies
export type CharacterTag = string; // e.g., "Jinx", "Annie", "Kai'Sa"
export type RegionTag = string; // e.g., "Piltover", "Zaun", "Demacia"
export type FactionTag = string; // e.g., "Hextech", "Chemtech", "Academy"
export type SpeciesTag = string; // e.g., "Yordle", "Vastayan", "Human"

// Main deck card types
export interface RiftboundUnitCard extends RiftboundBaseCard {
  type: "unit";

  // Combat statistics
  might: number; // Base might for combat

  // Tags for tribal synergies
  tags: Array<CharacterTag | RegionTag | FactionTag | SpeciesTag>;

  // Abilities and keywords
  abilities: CardAbility[];
  keywords: Keyword[];

  // Champion-specific properties
  isChampion?: boolean; // Can be chosen as champion
  championTag?: CharacterTag; // Tag for champion identification
  isSignature?: boolean; // Signature card (limited to 3 total)

  // Unit-specific mechanics
  canBeAtBase?: boolean; // Can be played to base (default true)
  canBeAtBattlefield?: boolean; // Can be played to battlefields (default true)

  // Link requirements for champion units
  linkRequirement?: CharacterTag; // Champion tag required
}

export interface RiftboundGearCard extends RiftboundBaseCard {
  type: "gear";

  // Gear always stays at base
  abilities: CardAbility[];
  keywords: Keyword[];

  // Gear-specific properties
  isEquipment?: boolean; // Attaches to units
  attachmentRestriction?: string; // What it can attach to
}

export interface RiftboundSpellCard extends RiftboundBaseCard {
  type: "spell";

  // Spell instructions (executed top to bottom)
  instructions: string[];

  // Timing restrictions
  keywords: Array<"action" | "reaction">; // When it can be played

  // Modal spells
  modes?: Array<{
    name: string;
    effect: string;
    condition?: string;
  }>;

  // Targeting information
  targets?: Array<{
    type: string;
    count: number | "any";
    restriction: string;
    optional?: boolean;
  }>;
}

// Rune deck cards
export interface RiftboundRuneCard extends RiftboundBaseCard {
  type: "rune";

  // Runes don't have play costs, they are channeled
  energyCost: 0;
  powerCost: {};

  // Domain determines power generation
  domains: [Domain]; // Runes have exactly one domain

  // Rune abilities (usually resource generation)
  abilities: CardAbility[];

  // Basic vs Advanced runes
  isBasic?: boolean; // Basic runes have standard abilities
}

// Non-deck cards
export interface RiftboundBattlefieldCard extends RiftboundBaseCard {
  type: "battlefield";

  // Battlefields don't have costs
  energyCost: 0;
  powerCost: {};

  // Battlefield abilities
  abilities: CardAbility[];

  // Victory point value when controlled
  pointValue?: number;

  // Special battlefield properties
  isUnique?: boolean; // Only one copy can be in play
  requirements?: string[]; // Domain identity requirements
}

export interface RiftboundLegendCard extends RiftboundBaseCard {
  type: "legend";

  // Legends don't have costs
  energyCost: 0;
  powerCost: {};

  // Champion legend properties
  championTag: CharacterTag; // Which champion this enables
  domainIdentity: Domain[]; // What domains deck can use

  // Legend abilities
  abilities: CardAbility[];

  // Deck construction constraints
  deckRestrictions?: {
    maxSignatures?: number; // Max signature cards (default 3)
    requireAllDomains?: boolean; // Must use all identity domains
    additionalRules?: string[]; // Other deck building rules
  };
}

// Token cards (created by effects during play)
export interface RiftboundTokenCard extends RiftboundBaseCard {
  type: "unit" | "gear"; // Tokens follow rules for their type

  // Tokens have no costs and no domains
  energyCost: 0;
  powerCost: {};
  domains: [];

  // Token-specific properties
  isToken: true;
  createdBy?: string; // What effect created this token

  // Token units have might
  might?: number;

  // Token properties
  abilities: CardAbility[];
  keywords: Keyword[];
  tags?: Array<CharacterTag | RegionTag | FactionTag | SpeciesTag>;
}

// Union type for all card types
export type RiftboundCard =
  | RiftboundUnitCard
  | RiftboundGearCard
  | RiftboundSpellCard
  | RiftboundRuneCard
  | RiftboundBattlefieldCard
  | RiftboundLegendCard
  | RiftboundTokenCard;

// Type guards for card categories
export const isUnitCard = (card: RiftboundCard): card is RiftboundUnitCard =>
  card.type === "unit";

export const isGearCard = (card: RiftboundCard): card is RiftboundGearCard =>
  card.type === "gear";

export const isSpellCard = (card: RiftboundCard): card is RiftboundSpellCard =>
  card.type === "spell";

export const isRuneCard = (card: RiftboundCard): card is RiftboundRuneCard =>
  card.type === "rune";

export const isBattlefieldCard = (
  card: RiftboundCard,
): card is RiftboundBattlefieldCard => card.type === "battlefield";

export const isLegendCard = (
  card: RiftboundCard,
): card is RiftboundLegendCard => card.type === "legend";

export const isTokenCard = (card: RiftboundCard): card is RiftboundTokenCard =>
  "isToken" in card && card.isToken === true;

// Helper functions for card properties
export const isMainDeckCard = (card: RiftboundCard): boolean =>
  card.type === "unit" || card.type === "gear" || card.type === "spell";

export const isPermanent = (card: RiftboundCard): boolean =>
  card.type === "unit" || card.type === "gear";

export const isChampionUnit = (card: RiftboundCard): boolean =>
  isUnitCard(card) && card.isChampion === true;

export const isSignatureCard = (card: RiftboundCard): boolean =>
  isUnitCard(card) && card.isSignature === true;

export const hasKeyword = (card: RiftboundCard, keyword: Keyword): boolean => {
  if (!("keywords" in card)) return false;
  return card.keywords.includes(keyword as any); // TODO: Fix type mismatch
};

export const getBaseCost = (
  card: RiftboundCard,
): { energy: number; power: Partial<Record<Domain, number>> } => ({
  energy: card.energyCost,
  power: card.powerCost,
});

// Export convenience types
export type MainDeckCard =
  | RiftboundUnitCard
  | RiftboundGearCard
  | RiftboundSpellCard;
export type RuneDeckCard = RiftboundRuneCard;
export type NonDeckCard = RiftboundBattlefieldCard | RiftboundLegendCard;
