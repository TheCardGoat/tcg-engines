/**
 * Gundam Card Game - Move Definitions
 *
 * This directory contains all move implementations for the Gundam Card Game.
 * Each move represents a possible player action that can modify game state.
 *
 * Moves follow the @tcg/core pattern using GameMoveDefinition type:
 * 1. Define move parameters in GundamMoves type (in types.ts)
 * 2. Implement condition function for validation (optional)
 * 3. Implement reducer function with Immer draft (mutate directly)
 * 4. Export from GameMoveDefinitions object
 *
 * @example Move Implementation
 * ```typescript
 * import type { GameMoveDefinition } from "@tcg/core";
 * import type { GundamGameState } from "../types";
 *
 * export const myMove: GameMoveDefinition<GundamGameState> = {
 *   condition: (state, context) => {
 *     // Validation logic - return true if move is legal
 *     return state.currentPlayer === context.playerId;
 *   },
 *
 *   reducer: (draft, context) => {
 *     // Mutate draft directly using Immer
 *     draft.turn += 1;
 *   },
 *
 *   metadata: {
 *     category: "core",
 *     tags: ["turn-management"],
 *   },
 * };
 * ```
 *
 * Key Points:
 * - Use GameMoveDefinition<GundamGameState> type for type safety
 * - condition: returns boolean (true = can execute)
 * - reducer: receives Immer draft, mutate it directly
 * - context includes { playerId, data?, timestamp }
 * - All moves exported together for game definition
 *
 * Move Categories:
 * - Draw: draw
 * - Deployment: deployUnit, deployBase
 * - Resource Management: playResource
 * - Combat: attack
 * - Phase Control: pass
 * - Command Cards: playCommand, resolveEffectStack, executeEffect
 * - Special: concede
 */

export { executeEffectMove } from "../game-definition/moves/core/execute-effect";
// Command card effect resolution moves (from game-definition/moves/core)
export { playCommandMove } from "../game-definition/moves/core/play-command";
export { resolveEffectStackMove } from "../game-definition/moves/core/resolve-effect-stack";
export { attackMove } from "./attack";
export { deployBaseMove } from "./deploy-base";
export { deployUnitMove } from "./deploy-unit";
export { drawMove } from "./draw";
export { passMove } from "./pass";
export { playResourceMove } from "./play-resource";

// TODO: Implement concede move
// Export { concedeMove } from "./concede";
