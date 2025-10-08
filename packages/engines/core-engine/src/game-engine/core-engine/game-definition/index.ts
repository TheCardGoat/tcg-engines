/**
 * GameDefinition type system exports
 */

export type {
  GameDefinition,
  GameEndResult,
  Player,
} from "./game-definition";
export { validateGameDefinition } from "./game-definition";

export type {
  Move,
  MoveCondition,
  MoveContext,
  MoveDefinition,
  MoveDefinitions,
  MoveMetadata,
  MoveReducer,
  MoveResult,
} from "./move-definition";
