/**
 * Gundam Card Game Definition
 *
 * This file defines the complete game using the @tcg/core framework.
 * It brings together all game components: state shape, moves, phases, zones, and validation.
 *
 * The game definition is the central configuration that the framework uses to:
 * - Initialize game state
 * - Validate moves
 * - Execute game flow
 * - Manage zones
 * - Enforce rules
 *
 * @example
 * ```typescript
 * import { defineGame } from "@tcg/core";
 * import { GundamGameState, GundamMove } from "./types";
 * import * as moves from "./moves";
 * import * as phases from "./phases";
 * import * as zones from "./zones";
 *
 * export const gundamGame = defineGame<GundamGameState, GundamMove>({
 *   id: "gundam-card-game",
 *   name: "Gundam Card Game",
 *
 *   // Initial state configuration
 *   initialState: {
 *     // ... state setup
 *   },
 *
 *   // Register all available moves
 *   moves: {
 *     playResource: moves.PlayResourceMove,
 *     deployUnit: moves.DeployUnitMove,
 *     pairPilot: moves.PairPilotMove,
 *     attack: moves.AttackMove,
 *     // ... other moves
 *   },
 *
 *   // Define game flow (phases and turn structure)
 *   flow: {
 *     phases: [
 *       phases.StartPhase,
 *       phases.DrawPhase,
 *       phases.ResourcePhase,
 *       phases.MainPhase,
 *       phases.EndPhase,
 *     ],
 *   },
 *
 *   // Configure zones
 *   zones: {
 *     deck: zones.DeckZone,
 *     hand: zones.HandZone,
 *     battleArea: zones.BattleAreaZone,
 *     shieldArea: zones.ShieldAreaZone,
 *     resourceArea: zones.ResourceAreaZone,
 *     trash: zones.TrashZone,
 *     removal: zones.RemovalZone,
 *   },
 *
 *   // Validation rules
 *   validation: {
 *     // ... validation configuration
 *   },
 * });
 * ```
 */

// Implementation will go here

