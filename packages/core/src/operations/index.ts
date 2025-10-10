/**
 * Operations API
 *
 * Provides controlled access to internal game state through specialized operations interfaces:
 * - ZoneOperations: Manage card zones and card movement
 * - CardOperations: Manage card metadata and state
 * - CardRegistry: Access static card definitions
 */

export type { CardOperations } from "./card-operations";
export type { CardRegistry } from "./card-registry";
export { createCardRegistry } from "./card-registry-impl";

export { createCardOperations, createZoneOperations } from "./operations-impl";
export type { ZoneOperations } from "./zone-operations";
