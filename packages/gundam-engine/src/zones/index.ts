/**
 * Gundam Card Game - Zone Configurations
 *
 * This directory contains zone configurations for all game zones in the Gundam Card Game.
 * Zones define where cards can be during the game and the rules for moving cards between zones.
 *
 * Gundam Card Game Zones (per player):
 * 1. Deck Area - Main deck (50 cards, face-down, private)
 * 2. Resource Deck Area - Resource deck (10 cards, face-down, private)
 * 3. Hand - Cards drawn from deck (private, max 10 at end of turn)
 * 4. Battle Area - Units and paired Pilots (face-up, public, max 6 units)
 * 5. Shield Area - Defense zone with two sections:
 *    - Shield Section - Face-down cards (6 at start, public count but private cards)
 *    - Base Section - Base card (face-up, public, max 1)
 * 6. Resource Area - Played resource cards (face-up, public, max 15)
 * 7. Trash - Discard pile (face-up, public)
 * 8. Removal Area - Removed from game (public)
 *
 * @example Zone Configuration
 * ```typescript
 * import { defineZone } from "@tcg/core";
 *
 * export const BattleAreaZone = defineZone({
 *   id: "battle-area",
 *   name: "Battle Area",
 *
 *   // Visibility rules
 *   visibility: {
 *     owner: "public",      // Owner can see all cards
 *     opponent: "public",   // Opponent can see all cards
 *     spectator: "public",  // Spectators can see all cards
 *   },
 *
 *   // Zone properties
 *   ordered: true,          // Card order matters (positions)
 *   maxCards: 6,            // Max 6 units
 *
 *   // Validation: can this card be added to this zone?
 *   canAddCard: (zone, card, state) => {
 *     // Check if zone is full
 *     if (zone.cards.length >= 6) {
 *       return { allowed: false, reason: "Battle area full" };
 *     }
 *
 *     // Check if card is a Unit
 *     if (card.cardType !== "UNIT") {
 *       return { allowed: false, reason: "Only units can be in battle area" };
 *     }
 *
 *     return { allowed: true };
 *   },
 *
 *   // Hook: when a card enters this zone
 *   onCardEnter: (zone, card, state) => {
 *     // Trigger [Deploy] effects
 *     const deployAbilities = card.abilities.filter(
 *       (a) => a.trigger === "ON_DEPLOY"
 *     );
 *
 *     // Execute deploy effects
 *     let newState = state;
 *     for (const ability of deployAbilities) {
 *       newState = executeAbility(newState, ability, card);
 *     }
 *
 *     return newState;
 *   },
 *
 *   // Hook: when a card leaves this zone
 *   onCardLeave: (zone, card, state) => {
 *     // If card has paired pilot, also remove pilot
 *     const pairedPilot = findPairedPilot(state, card.id);
 *     if (pairedPilot) {
 *       return removeCardFromZone(state, pairedPilot.id, zone.id);
 *     }
 *
 *     return state;
 *   },
 * });
 * ```
 *
 * @example Shield Zone (Special Rules)
 * ```typescript
 * export const ShieldZone = defineZone({
 *   id: "shield-section",
 *   name: "Shield Section",
 *
 *   // Shields are face-down but count is public
 *   visibility: {
 *     owner: "count-only",    // Owner knows count but not cards
 *     opponent: "count-only",  // Opponent knows count but not cards
 *   },
 *
 *   ordered: true,
 *   maxCards: 6,
 *
 *   onCardLeave: (zone, card, state) => {
 *     // When a shield is destroyed, check for [Burst] effect
 *     const burstEffect = card.burstEffect;
 *     if (burstEffect) {
 *       // Owner may activate burst effect
 *       return promptBurstActivation(state, card, burstEffect);
 *     }
 *
 *     return state;
 *   },
 * });
 * ```
 */

// Zone configurations will go here
// export { DeckZone } from "./deck-zone";
// export { ResourceDeckZone } from "./resource-deck-zone";
// export { HandZone } from "./hand-zone";
// export { BattleAreaZone } from "./battle-area-zone";
// export { ShieldZone } from "./shield-zone";
// export { BaseZone } from "./base-zone";
// export { ResourceAreaZone } from "./resource-area-zone";
// export { TrashZone } from "./trash-zone";
// export { RemovalZone } from "./removal-zone";

