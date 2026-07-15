/**
 * Operations API
 *
 * Provides controlled access to internal game state through specialized operations interfaces:
 * - ZoneOperations: Manage card zones and card movement
 * - CardOperations: Manage card metadata and state
 * - GameOperations: Manage game-level state (OTP, mulligan)
 * - CounterOperations: Manage counters and flags on cards
 * - CardRegistry: Access static card definitions
 */

export type { CardOperations } from "./card-operations";
export type { CardRegistry } from "./card-registry";
export { createCardRegistry } from "./card-registry-impl";
export type { CounterOperations } from "./counter-operations";
export type { GameOperations } from "./game-operations";

export {
  createCardOperations,
  createCounterOperations,
  createGameOperations,
  createZoneOperations,
} from "./operations-impl";
export type { ZoneOperations } from "./zone-operations";
