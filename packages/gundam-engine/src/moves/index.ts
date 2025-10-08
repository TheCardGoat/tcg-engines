/**
 * Gundam Card Game - Move Definitions
 *
 * This directory contains all move implementations for the Gundam Card Game.
 * Each move represents a possible player action that can modify game state.
 *
 * Moves follow the @tcg/core move pattern:
 * 1. Define move parameters (type-safe)
 * 2. Implement validation logic
 * 3. Implement execution logic (immutable state update)
 * 4. Optionally implement enumeration (for AI/UI)
 *
 * @example Move Implementation
 * ```typescript
 * import { defineMove } from "@tcg/core";
 * import type { GundamGameState } from "../types";
 *
 * type PlayResourceParams = {
 *   playerId: PlayerId;
 * };
 *
 * export const PlayResourceMove = defineMove<
 *   GundamGameState,
 *   PlayResourceParams
 * >({
 *   type: "PLAY_RESOURCE",
 *
 *   validate: (state, params) => {
 *     const { playerId } = params;
 *
 *     // Check if it's the player's turn
 *     if (state.currentPlayer !== playerId) {
 *       return { valid: false, error: "Not your turn" };
 *     }
 *
 *     // Check if in Resource Phase
 *     if (state.phase !== "resource") {
 *       return { valid: false, error: "Not in Resource Phase" };
 *     }
 *
 *     // Check if already played resource this turn
 *     if (state.gundam.playedResourceThisTurn[playerId]) {
 *       return { valid: false, error: "Already played resource" };
 *     }
 *
 *     // Check resource deck has cards
 *     const resourceDeck = state.zones.resourceDeck[playerId];
 *     if (resourceDeck.length === 0) {
 *       return { valid: false, error: "No resources remaining" };
 *     }
 *
 *     return { valid: true };
 *   },
 *
 *   execute: (state, params) => {
 *     const { playerId } = params;
 *     const resourceDeck = state.zones.resourceDeck[playerId];
 *     const resourceArea = state.zones.resourceArea[playerId];
 *
 *     // Take top card from resource deck
 *     const [topCard, ...remainingDeck] = resourceDeck;
 *
 *     // Immutably update state
 *     return {
 *       ...state,
 *       zones: {
 *         ...state.zones,
 *         resourceDeck: {
 *           ...state.zones.resourceDeck,
 *           [playerId]: remainingDeck,
 *         },
 *         resourceArea: {
 *           ...state.zones.resourceArea,
 *           [playerId]: [...resourceArea, topCard],
 *         },
 *       },
 *       gundam: {
 *         ...state.gundam,
 *         playedResourceThisTurn: {
 *           ...state.gundam.playedResourceThisTurn,
 *           [playerId]: true,
 *         },
 *         activeResources: {
 *           ...state.gundam.activeResources,
 *           [playerId]: state.gundam.activeResources[playerId] + 1,
 *         },
 *       },
 *     };
 *   },
 *
 *   // Optional: for AI and move enumeration
 *   enumerate: (state, playerId) => {
 *     const validation = PlayResourceMove.validate(state, { playerId });
 *     if (!validation.valid) return [];
 *
 *     return [{ type: "PLAY_RESOURCE", playerId }];
 *   },
 * });
 * ```
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

// Move implementations will go here
// export { PlayResourceMove } from "./play-resource";
// export { DeployUnitMove } from "./deploy-unit";
// export { PairPilotMove } from "./pair-pilot";
// export { AttackMove } from "./attack";
// export { ActivateAbilityMove } from "./activate-ability";

