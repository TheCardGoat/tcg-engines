import type { CardId, PlayerId, ZoneId } from "../types";

/**
 * Mandatory base fields that ALL TCGs need
 * Every card instance must have these core properties
 */
export type CardInstanceBase = {
  // Identity (mandatory)
  id: CardId;
  definitionId: string; // references card definition
  owner: PlayerId;
  controller: PlayerId; // can differ from owner (e.g., Mind Control effects)

  // Location (mandatory)
  zone: ZoneId;
  position?: number; // position within zone if ordered

  // State flags (mandatory)
  tapped: boolean; // tapped/exhausted state
  flipped: boolean; // face-up (false) or face-down (true)
  revealed: boolean; // temporarily visible to all players
  phased: boolean; // phased out (not in play but not in another zone)
};

/**
 * Generic card instance - games extend with custom state
 * @template TCustomState - Game-specific state extensions (e.g., counters, damage, abilities)
 *
 * @example
 * ```typescript
 * // Magic the Gathering style
 * type MagicCardState = {
 *   summoningSick: boolean;
 *   damageTaken: number;
 *   counters: Record<string, number>;
 * };
 * type MagicCard = CardInstance<MagicCardState>;
 *
 * // Hearthstone style
 * type HearthstoneCardState = {
 *   damageTaken: number;
 *   divineShield: boolean;
 *   stealth: boolean;
 * };
 * type HearthstoneCard = CardInstance<HearthstoneCardState>;
 * ```
 */
export type CardInstance<TCustomState = Record<string, never>> =
  CardInstanceBase & TCustomState;
