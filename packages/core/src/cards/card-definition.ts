/**
 * Card Definition - Static, immutable data for a card type
 * This represents the "blueprint" of a card, not an instance in play.
 * All instances of the same card share the same definition.
 */
export interface CardDefinition {
  /** Unique identifier for this card definition */
  id: string;

  /** Display name of the card */
  name: string;

  /** Card type (e.g., 'creature', 'instant', 'sorcery', 'enchantment') */
  type: string;

  /** Base power value (for creatures) */
  basePower?: number;

  /** Base toughness/health value (for creatures) */
  baseToughness?: number;

  /** Base mana/resource cost to play the card */
  baseCost?: number;

  /** Static abilities this card has */
  abilities?: string[];
}
