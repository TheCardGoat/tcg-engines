// Core engine exports

// Card abstraction patterns and utilities
export * from "./game-engine/core-engine/card";
export type {
  ClientState,
  CoreEngineOpts,
} from "./game-engine/core-engine/engine/core-engine";
export { Core, CoreEngine } from "./game-engine/core-engine/engine/core-engine";
export type { GameDefinition as Game } from "./game-engine/core-engine/game-configuration";
// Move system
export type {
  EnumerableMove,
  InvalidMoveResult,
  Move,
  MoveFn,
} from "./game-engine/core-engine/move/move-types";
export {
  createEnumerableMove,
  createInvalidMove,
  isEnumerableMove,
  isInvalidMove,
  isMoveFn,
} from "./game-engine/core-engine/move/move-types";
// Game types
export type { GameCards } from "./game-engine/core-engine/types";
// Backward compatibility type aliases
export type {
  // Card abstraction aliases
  Card,
  CardDefinitionId,
  // Filter aliases
  CardFilter,
  CardId,
  ContextCard,
  // Game definition aliases
  Game as GameDefinition,
  // Context aliases
  GameContext,
  // Move aliases
  GameMove,
  // Game state aliases
  GameState,
  MoveContext,
  MoveFunction,
  // Result aliases
  OperationResult,
  // Core type aliases
  Player,
  PlayerState,
  ZoneIdentifier,
} from "./game-engine/core-engine/types/backward-compatibility";
// Core types
export type {
  // Backward compatibility aliases
  CardInstanceID,
  InstanceId,
  PlayerID,
  PlayerId,
  PublicId,
  ZoneId,
} from "./game-engine/core-engine/types/core-types";
// Game-specific types
export type {
  BaseCoreCardFilter,
  BaseGameState,
  BasePlayerState,
  ExtendCardDefinition,
  ExtendCardFilter,
  ExtendGameState,
  ExtendPlayerState,
  GameSpecificCardDefinition,
  GameSpecificCardFilter,
  GameSpecificGameState,
  GameSpecificPlayerState,
  ValidateGameTypes,
} from "./game-engine/core-engine/types/game-specific-types";
// Result types and utilities
export type { Result } from "./game-engine/core-engine/types/result";
export { Result as ResultHelpers } from "./game-engine/core-engine/types/result";

// Lobby engine exports (minimal subset for backward compatibility)
export { createLobbyEngine } from "./lobby-engine/lobby-engine";
export type {
  LobbyEngine,
  LobbyOptions as LobbyEngineOptions,
} from "./lobby-engine/lobby-engine-types";

// Engine version
export const engineVersion = "1.0.0";
