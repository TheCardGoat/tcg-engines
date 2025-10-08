/**
 * Gundam Card Game - Move Definitions
 *
 * This directory contains all move implementations for the Gundam Card Game.
 * Each move represents a possible player action that can modify game state.
 *
 * Moves follow the @tcg/core move pattern using GameMoveDefinitions type:
 * 1. Define move shape in GundamGameMoves type (in types.ts)
 * 2. Implement condition function for validation
 * 3. Implement reducer function with Immer draft (mutate directly)
 * 4. Add to GameMoveDefinitions object
 *
 * @example Move Implementation
 * ```typescript
 * import type { GameMoveDefinitions } from "@tcg/core";
 * import type { GundamGameState, GundamGameMoves } from "../types";
 *
 * const moves: GameMoveDefinitions<GundamGameState, GundamGameMoves> = {
 *   playResource: {
 *     condition: (state, context) => {
 *       const { playerId } = context;
 *
 *       // Check if it's the player's turn
 *       if (state.currentPlayer !== playerId) {
 *         return false;
 *       }
 *
 *       // Check if in Resource Phase
 *       if (state.phase !== "resource") {
 *         return false;
 *       }
 *
 *       // Check if already played resource this turn
 *       if (state.gundam.playedResourceThisTurn[playerId]) {
 *         return false;
 *       }
 *
 *       // Check resource deck has cards
 *       const resourceDeck = state.zones.resourceDeck[playerId];
 *       return resourceDeck && resourceDeck.length > 0;
 *     },
 *
 *     reducer: (draft, context) => {
 *       const { playerId } = context;
 *       const resourceDeck = draft.zones.resourceDeck[playerId];
 *       const resourceArea = draft.zones.resourceArea[playerId];
 *
 *       if (resourceDeck && resourceArea) {
 *         // Take top card from resource deck (mutate draft directly with Immer)
 *         const topCard = resourceDeck.pop();
 *         if (topCard) {
 *           resourceArea.push(topCard);
 *         }
 *
 *         // Update gundam-specific state
 *         draft.gundam.playedResourceThisTurn[playerId] = true;
 *         draft.gundam.activeResources[playerId] += 1;
 *       }
 *     },
 *   },
 *
 *   // Add more moves here
 *   deployUnit: {
 *     condition: (state, context) => {
 *       // Validation logic
 *       return true;
 *     },
 *     reducer: (draft, context) => {
 *       // Mutate draft directly
 *     },
 *   },
 * };
 *
 * export { moves as gundamMoves };
 * ```
 *
 * Key Points:
 * - NO defineMove() helper - use GameMoveDefinitions type directly
 * - condition: returns boolean (true = can execute)
 * - reducer: receives Immer draft, mutate it directly
 * - context includes { playerId, sourceCardId?, targets?, data?, rng? }
 * - All moves added to one GameMoveDefinitions object
 *
 * Move Categories:
 * - Resource Management: playResource
 * - Deployment: deployUnit, pairPilot, deployBase
 * - Combat: attack, declareBlocker
 * - Abilities: activateAbility
 * - Phase Control: endMainPhase, passAction
 * - Setup: mulligan, chooseFirstPlayer
 * - Special: concede
 */

// Move implementations will go here once game-specific types are defined
// See template-engine package for working examples
