/**
 * Card Instance Model Types
 *
 * Defines the core card instance structure with mandatory base fields
 * and support for game-specific custom state extensions.
 */

import type { CardId, PlayerId, ZoneId } from "../types/branded-types";

/**
 * Mandatory base fields that ALL TCGs need for card instances.
 *
 * This is the foundation for all card instances in the engine.
 * Games extend this with custom state via the generic CardInstance type.
 */
export type CardInstanceBase = {
  // Identity (mandatory)
  /** Unique identifier for this card instance */
  id: CardId;

  /** References the card definition (static data) */
  definitionId: string;

  /** Player who owns this card */
  owner: PlayerId;

  /** Player who currently controls this card (can differ from owner) */
  controller: PlayerId;

  // Location (mandatory)
  /** Zone where this card is currently located */
  zone: ZoneId;

  /** Position within the zone if ordered (e.g., deck, hand) */
  position?: number;

  // State flags (mandatory)
  /** Whether the card is tapped/exhausted */
  tapped: boolean;

  /** Whether the card is face-down (false) or face-up (true) */
  flipped: boolean;

  /** Whether the card is temporarily visible to all players */
  revealed: boolean;

  /** Whether the card is phased out (not in play but not in another zone) */
  phased: boolean;
};

/**
 * Generic card instance type that extends CardInstanceBase with custom state.
 *
 * @template TCustomState - Game-specific custom state to add to the card instance
 *
 * @example
 * // Magic: The Gathering custom state
 * type MagicCardState = {
 *   summoningSick: boolean;
 *   damageTaken: number;
 *   counters: Record<string, number>;
 *   attachments: CardId[];
 *   attachedTo?: CardId;
 * };
 *
 * type MagicCard = CardInstance<MagicCardState>;
 *
 * @example
 * // Hearthstone custom state
 * type HearthstoneCardState = {
 *   damageTaken: number;
 *   divineShield: boolean;
 *   stealth: boolean;
 *   frozen: boolean;
 *   silenced: boolean;
 * };
 *
 * type HearthstoneCard = CardInstance<HearthstoneCardState>;
 */
export type CardInstance<TCustomState = unknown> = CardInstanceBase &
  TCustomState;
