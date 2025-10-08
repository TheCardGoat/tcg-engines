/**
 * Game Definition Module
 *
 * Task 10: GameDefinition Type System
 *
 * Provides declarative game definition pattern with full type safety.
 * Exports:
 * - GameDefinition type (core definition)
 * - MoveDefinition and MoveDefinitions types
 * - Validation utilities
 * - Supporting types (Player, GameEndResult, FlowDefinition)
 */

export type {
  FlowDefinition,
  GameDefinition,
  GameEndResult,
  Player,
} from "./game-definition";

export type {
  GameMoveDefinition,
  GameMoveDefinitions,
} from "./move-definitions";

export {
  type GameDefinitionValidationResult,
  validateGameDefinition,
} from "./validation";
