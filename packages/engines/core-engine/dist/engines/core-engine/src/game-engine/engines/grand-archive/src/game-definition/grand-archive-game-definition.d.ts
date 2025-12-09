/**
 * Grand Archive Main Game Definition
 *
 * Central configuration for Grand Archive TCG game flow and rules
 */
import type { GameDefinition } from "~/game-engine/core-engine/game-configuration";
import type { GrandArchiveGameState } from "../../grand-archive-engine-types";
/**
 * Grand Archive Game Configuration
 */
export declare const GrandArchiveGame: GameDefinition<GrandArchiveGameState>;
/**
 * Get opponent player ID
 */
export declare function getOpponent(playerId: string, playerOrder: string[]): string;
/**
 * Check if player has specific element available
 * TODO: Implement using CoreOperation methods
 */
/**
 * Get player's current champion level
 * TODO: Implement using CoreOperation methods
 */
/**
 * Check if player can materialize this turn
 * TODO: Implement using CoreOperation methods
 */
//# sourceMappingURL=grand-archive-game-definition.d.ts.map