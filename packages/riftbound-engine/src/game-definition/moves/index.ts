/**
 * Riftbound Moves
 *
 * All move definitions for the Riftbound tabletop simulator.
 */

import type { GameMoveDefinitions } from "@tcg/core";
import type {
  RiftboundCardMeta,
  RiftboundGameState,
  RiftboundMoves,
} from "../../types";

// Import all move categories
import { cardPlayMoves } from "./cards";
import { combatMoves } from "./combat";
import { counterMoves } from "./counters";
import { discardMoves } from "./discard";
import { movementMoves } from "./movement";
import { resourceMoves } from "./resources";
import { setupMoves } from "./setup";
import { turnMoves } from "./turn";

/**
 * All Riftbound move definitions combined
 */
export const riftboundMoves: GameMoveDefinitions<
  RiftboundGameState,
  RiftboundMoves,
  RiftboundCardMeta,
  unknown
> = {
  // Setup moves
  ...setupMoves,

  // Turn structure moves
  ...turnMoves,

  // Card play moves
  ...cardPlayMoves,

  // Movement moves
  ...movementMoves,

  // Resource moves
  ...resourceMoves,

  // Combat moves
  ...combatMoves,

  // Counter/token moves
  ...counterMoves,

  // Discard/trash moves
  ...discardMoves,
} as GameMoveDefinitions<
  RiftboundGameState,
  RiftboundMoves,
  RiftboundCardMeta,
  unknown
>;

export { cardPlayMoves } from "./cards";
export { combatMoves } from "./combat";
export { counterMoves } from "./counters";
export { discardMoves } from "./discard";
export { movementMoves } from "./movement";
export { resourceMoves } from "./resources";
// Re-export individual move categories for selective imports
export { setupMoves } from "./setup";
export { turnMoves } from "./turn";
