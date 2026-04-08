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
   * Supports wildcards - "quested:*" matches all "quested:cardId" trackers
   * "boosted:*" matches all "boosted:cardId" trackers (Boost is once per card per turn)
   */
  perTurn: ["hasInked", "quested:*", "boosted:*"],

  /**
   * Track actions separately for each player
   */
  perPlayer: true,
};
