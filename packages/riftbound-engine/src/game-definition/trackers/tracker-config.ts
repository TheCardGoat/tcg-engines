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
    name: "turnHistory",
    description: "Tracks turn-by-turn game history",
    enabled: true,
  },
  {
    name: "damageDealt",
    description: "Tracks damage dealt during the game",
    enabled: true,
  },
  {
    name: "cardsPlayed",
    description: "Tracks cards played by each player",
    enabled: true,
  },
] as const;
