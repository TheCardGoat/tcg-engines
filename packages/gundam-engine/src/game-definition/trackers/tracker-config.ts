/**
 * Tracker Configuration
 *
 * Defines boolean flags that track actions taken during gameplay.
 * These trackers are automatically reset based on their configuration:
 *
 * - hasPlayedCommand: Player can only put one card into inkwell per turn
 * - attacked:{cardId}: Each character can only quest once per turn
 *
 * The engine automatically resets perTurn trackers at the end of each turn.
 */
export const trackerConfig = {
  /**
   * Actions that reset at the end of each turn
   * Supports wildcards - "attacked:*" matches all "attacked:cardId" trackers
   */
  perTurn: ["hasPlayedCommand", "attacked:*"],

  /**
   * Track actions separately for each player
   */
  perPlayer: true,
};
