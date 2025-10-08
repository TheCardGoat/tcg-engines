/**
 * Gundam Card Game - Zone Definitions
 *
 * This file defines the zone structure for the Gundam Card Game.
 * In @tcg/core, zones are simple state properties - arrays of card IDs per player.
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
 * @example Zone Definition in State
 * ```typescript
 * import type { CardId, PlayerId } from "@tcg/core";
 *
 * type GundamGameState = {
 *   // ... other state
 *
 *   zones: {
 *     deck: Record<PlayerId, CardId[]>;
 *     resourceDeck: Record<PlayerId, CardId[]>;
 *     hand: Record<PlayerId, CardId[]>;
 *     battleArea: Record<PlayerId, CardId[]>;
 *     shieldSection: Record<PlayerId, CardId[]>;
 *     baseSection: Record<PlayerId, CardId[]>;
 *     resourceArea: Record<PlayerId, CardId[]>;
 *     trash: Record<PlayerId, CardId[]>;
 *     removal: Record<PlayerId, CardId[]>;
 *   };
 * };
 * ```
 *
 * @example Zone Operations in Moves
 * ```typescript
 * // In move reducer (using Immer draft):
 * reducer: (draft, context) => {
 *   const { playerId } = context;
 *
 *   // Draw from deck
 *   const card = draft.zones.deck[playerId]?.pop();
 *   if (card) {
 *     draft.zones.hand[playerId]?.push(card);
 *   }
 *
 *   // Move to battle area
 *   const hand = draft.zones.hand[playerId];
 *   const battleArea = draft.zones.battleArea[playerId];
 *   if (hand && battleArea) {
 *     const index = hand.findIndex(c => String(c) === cardId);
 *     if (index >= 0) {
 *       const [card] = hand.splice(index, 1);
 *       if (card) {
 *         battleArea.push(card);
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * @example Visibility in playerView
 * ```typescript
 * playerView: (state, playerId) => ({
 *   ...state,
 *   zones: {
 *     ...state.zones,
 *     // Hide opponent's hand and decks
 *     hand: Object.fromEntries(
 *       Object.entries(state.zones.hand).map(([pid, cards]) => [
 *         pid,
 *         pid === playerId ? cards : []
 *       ])
 *     ),
 *     deck: Object.fromEntries(
 *       Object.entries(state.zones.deck).map(([pid, cards]) => [
 *         pid,
 *         pid === playerId ? cards : []
 *       ])
 *     ),
 *     // Shield section shows count but not actual cards for opponent
 *     shieldSection: Object.fromEntries(
 *       Object.entries(state.zones.shieldSection).map(([pid, cards]) => [
 *         pid,
 *         pid === playerId ? cards : [] // Opponent sees empty array
 *       ])
 *     ),
 *   },
 * })
 * ```
 *
 * Key Points:
 * - NO defineZone() helper - zones are just state arrays
 * - Zones are Record<PlayerId, CardId[]> in your state
 * - Zone operations use array methods in Immer reducers
 * - Visibility rules implemented in playerView function
 * - Validation logic goes in move conditions
 *
 * See template-engine package for working examples.
 */

// Zone types will be defined in types.ts as part of GundamGameState
