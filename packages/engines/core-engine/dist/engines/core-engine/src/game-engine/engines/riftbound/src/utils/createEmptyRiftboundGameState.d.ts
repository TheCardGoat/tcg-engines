/**
 * Utility function to create an empty Riftbound game state
 * This provides a clean starting point for game initialization
 */
import type { RiftboundGameState, RiftboundPlayerState } from "../riftbound-generic-types";
/**
 * Creates an empty player state with all zones initialized
 */
export declare function createEmptyPlayerState(playerId: string, playerName: string): RiftboundPlayerState;
/**
 * Creates an empty Riftbound game state
 */
export declare function createEmptyRiftboundGameState(): RiftboundGameState;
/**
 * Adds a player to an existing game state
 */
export declare function addPlayerToGameState(gameState: RiftboundGameState, playerId: string, playerName: string, insertIndex?: number): RiftboundGameState;
/**
 * Sets up the game state for a specific mode of play
 */
export declare function setupGameMode(gameState: RiftboundGameState, mode: "1v1-duel" | "1v1-match" | "ffa3-skirmish" | "ffa4-war" | "2v2-magma"): RiftboundGameState;
/**
 * Sets up teams for 2v2 mode
 */
export declare function setupTeams(gameState: RiftboundGameState, team1: [string, string], team2: [string, string]): RiftboundGameState;
/**
 * Initialize the first turn based on game mode
 */
export declare function initializeFirstTurn(gameState: RiftboundGameState, firstPlayer: string): RiftboundGameState;
/**
 * Utility to get the number of battlefields for a game mode
 */
export declare function getBattlefieldCount(mode: string): number;
/**
 * Utility to check if a player is a teammate of another player
 */
export declare function areTeammates(gameState: RiftboundGameState, player1: string, player2: string): boolean;
/**
 * Utility to get a player's teammates
 */
export declare function getTeammates(gameState: RiftboundGameState, playerId: string): string[];
//# sourceMappingURL=createEmptyRiftboundGameState.d.ts.map