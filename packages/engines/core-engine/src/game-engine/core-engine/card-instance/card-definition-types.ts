/**
 * Card Definition Types
 *
 * Defines the static card definition structure that represents the immutable
 * properties of a card (the "blueprint" for card instances).
 */

/**
 * Card Definition represents the static, immutable data for a card.
 *
 * This is the "blueprint" that card instances reference via definitionId.
 * Definitions never change during gameplay - only card instances have mutable state.
 *
 * @example
 * const grizzlyBears: CardDefinition = {
 *   id: "grizzly-bears",
 *   name: "Grizzly Bears",
 *   type: "creature",
 *   basePower: 2,
 *   baseToughness: 2,
 *   baseCost: 2,
 *   abilities: [],
 * };
 */
export type CardDefinition = {
  /** Unique identifier for this card definition */
  id: string;

  /** Display name of the card */
  name: string;

  /** Card type (creature, spell, land, etc.) */
  type: string;

  /** Base power value (optional, for creatures) */
  basePower?: number;

  /** Base toughness value (optional, for creatures) */
  baseToughness?: number;

  /** Base mana cost (optional, lands typically have no cost) */
  baseCost?: number;

  /** List of abilities this card has */
  abilities: string[];
};

/**
 * Registry for looking up card definitions by ID.
 *
 * This provides a centralized way to access card definitions
 * during computed property calculations.
 */
export type DefinitionRegistry = {
  /** Get a card definition by its ID */
  getDefinition: (id: string) => CardDefinition | undefined;
};
