/**
 * @tcg/riftbound - Riftbound TCG Tabletop Simulator
 *
 * A tabletop simulator implementation of Riftbound TCG using the @tcg/core framework.
 * This is NOT a rules engine - players enforce rules themselves.
 * The system handles card movement, counters/tokens, and phase tracking.
 *
 * Key Features:
 * - 35+ manual moves for all game actions
 * - Counter/token system for damage, buffs, exhaustion
 * - Zone management for all Riftbound zones
 * - Victory point tracking
 * - Rune pool resource management
 */

// Re-export core framework types for convenience
export type {
  GameDefinition,
  MoveContext,
  MoveExecutionResult,
  RuleEngine,
  RuleEngineOptions,
} from "@tcg/core";

// Engine exports
export { RiftboundEngine } from "./engine/riftbound-engine";

// Game definition export
export { riftboundDefinition } from "./game-definition/definition";

// Move exports
export { riftboundMoves } from "./game-definition/moves";

// Type exports
export * from "./types";
// Move enumeration type exports
export type {
  AvailableMoveInfo,
  MoveParameterOptions,
  MoveParamSchema,
  MoveValidationError,
  ParameterInfo,
  ParamFieldSchema,
} from "./types/move-enumeration";
// Zone configuration exports
export {
  createBattlefieldZone,
  createFacedownZone,
  extractBattlefieldId,
  getBattlefieldZoneId,
  getFacedownZoneId,
  isBattlefieldZone,
  isFacedownZone,
  isLocation,
  isPublicZone,
  riftboundZones,
} from "./zones/zone-configs";
