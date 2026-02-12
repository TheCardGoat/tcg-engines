import type { CardId, PlayerId, ZoneId } from "../types";

/**
 * Mandatory base fields that ALL TCGs need
 * Every card instance must have these core properties
 */
export interface CardInstanceBase {
  // Identity (mandatory)
  id: CardId;
  definitionId: string; // References card definition
  owner: PlayerId;
  controller: PlayerId; // Can differ from owner (e.g., Mind Control effects)

  // Location (mandatory)
  zone: ZoneId;
  position?: number; // Position within zone if ordered

  // State flags (mandatory)
  tapped: boolean; // Tapped/exhausted state
  flipped: boolean; // Face-up (false) or face-down (true)
  revealed: boolean; // Temporarily visible to all players
  phased: boolean; // Phased out (not in play but not in another zone)
}

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
export type CardInstance<TCustomState = Record<string, never>> = CardInstanceBase & TCustomState;
