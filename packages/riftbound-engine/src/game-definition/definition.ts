/**
 * Riftbound Game Definition
 *
 * The main game definition implementing GameDefinition<TState, TMoves>.
 */

import type { GameDefinition } from "@tcg/core";
import type { RiftboundState } from "../types";

/**
 * Move types for Riftbound
 */
export type RiftboundMoves = {};

/**
 * Riftbound game definition
 *
 * This will be populated with the full game rules as they are defined.
 */
export const riftboundDefinition: Partial<
  GameDefinition<RiftboundState, RiftboundMoves>
> = {
  // Game definition will be implemented here
  // moves: {},
  // setup: {},
  // flow: {},
  // winConditions: [],
};
