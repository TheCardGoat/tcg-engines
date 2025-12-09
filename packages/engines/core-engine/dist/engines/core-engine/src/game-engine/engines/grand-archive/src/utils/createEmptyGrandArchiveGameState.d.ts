/**
 * Grand Archive Game State Creation Utilities
 *
 * Functions to create empty game states and manage player data
 */
import type { GrandArchiveGameState, GrandArchivePlayerState } from "../../grand-archive-engine-types";
/**
 * Create an empty Grand Archive game state
 */
export declare const createEmptyGrandArchiveGameState: () => GrandArchiveGameState;
/**
 * Create a default Grand Archive player state
 */
export declare const createDefaultGrandArchivePlayerState: (playerId: string, playerName?: string) => GrandArchivePlayerState;
/**
 * Add a player to an existing game state
 * TODO: Reimplement using CoreOperation methods to add player to context
 */
/**
 * Initialize player's champion lineage
 * TODO: Reimplement using CoreOperation methods to manage champion data
 */
/**
 * Level up a player's champion
 * TODO: Reimplement using CoreOperation methods to manage champion progression
 */
/**
 * Initialize game state for combat
 * TODO: Reimplement using proper game state properties
 */
/**
 * End combat phase
 * TODO: Reimplement using proper game state properties
 */
//# sourceMappingURL=createEmptyGrandArchiveGameState.d.ts.map