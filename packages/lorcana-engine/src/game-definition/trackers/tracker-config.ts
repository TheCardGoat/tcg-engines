/**
 * Tracker Configuration
 *
 * Defines boolean flags that track actions taken during gameplay.
 * These trackers are automatically reset based on their configuration:
 *
 * - hasInked: Player can only put one card into inkwell per turn
 * - quested:{cardId}: Each character can only quest once per turn
 *
 * The engine automatically resets perTurn trackers at the end of each turn.
 */
export const trackerConfig = {
  /**
   * Actions that reset at the end of each turn
   */
  perTurn: ["hasInked"],

  /**
   * Track actions separately for each player
   */
  perPlayer: true,
};
