/**
 * Riftbound State Trackers
 *
 * Configuration for tracking game state changes.
 */

/**
 * Tracker configuration type
 */
export interface TrackerConfig {
  readonly name: string;
  readonly description: string;
  readonly enabled: boolean;
}

/**
 * Default tracker configurations
 */
export const TRACKER_CONFIGS: readonly TrackerConfig[] = [
  {
    description: "Tracks turn-by-turn game history",
    enabled: true,
    name: "turnHistory",
  },
  {
    description: "Tracks damage dealt during the game",
    enabled: true,
    name: "damageDealt",
  },
  {
    description: "Tracks cards played by each player",
    enabled: true,
    name: "cardsPlayed",
  },
] as const;
