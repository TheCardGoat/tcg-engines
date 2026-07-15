/**
 * Gundam TCG — Domain Events
 *
 * Emitted through the framework's EventAPI (framework.events.emit).
 * Consumers can subscribe to these for UI animations, logging, etc.
 */

import type { EventAPI } from "../types/move-types.ts";

export type GundamEventKind =
  | "FIRST_PLAYER_CHOSEN"
  | "RESOURCE_CHARGED"
  // Placement events — fired SYNCHRONOUSLY when a card enters its
  // destination zone, before any triggered effect has resolved. Use
  // these for "the card is now in zone X" reactions (UI animations,
  // zone-change subscriptions). Most consumers want the completion
  // event (`*_DEPLOYED` / `PILOT_ASSIGNED`) instead.
  | "UNIT_PLACED"
  | "BASE_PLACED"
  | "PILOT_PAIRED"
  // Completion events — fired AFTER every triggered effect produced
  // by the originating move resolves (own-card triggers + observer
  // triggers). Listeners that care about "the deploy is fully done,
  // it's safe to read the resulting board state" should hook these.
  | "UNIT_DEPLOYED"
  | "BASE_DEPLOYED"
  | "COMMAND_REVEALED"
  | "COMMAND_PLAYED"
  | "ATTACK_DECLARED"
  | "BLOCK_DECLARED"
  | "COMBAT_RESOLVED"
  | "DIRECT_ATTACK"
  | "UNIT_DEFEATED"
  | "DAMAGE_DEALT"
  | "SHIELD_REMOVED"
  | "PILOT_ASSIGNED"
  | "PILOT_REMOVED"
  | "ABILITY_ACTIVATED"
  | "TURN_STARTED"
  | "TURN_ENDED"
  | "DRAW_PHASE"
  | "SHIELD_ADDED_TO_HAND"
  | "KEYWORD_GRANTED"
  | "STAT_MODIFIED"
  | "EFFECT_DAMAGE_RECEIVED"
  | "AP_REDUCED_BY_ENEMY"
  | "EX_RESOURCE_PLACED";

export interface GundamDomainEvent {
  kind: GundamEventKind;
  payload?: Record<string, unknown>;
}

/**
 * Emit a Gundam domain event through the framework EventAPI.
 */
export function emitGundamEvent(events: EventAPI, event: GundamDomainEvent): void {
  events.emit({ type: event.kind, payload: event.payload });
}
