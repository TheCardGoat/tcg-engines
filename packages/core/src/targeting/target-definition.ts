import type { CardFilter } from "../filtering/card-filter";

/**
 * Target restriction types
 * Defines additional constraints on target selection beyond the filter
 */
export type TargetRestriction =
  | "not-self" // Cannot target the source card itself
  | "not-controller" // Cannot target cards controlled by the move's controller
  | "not-owner" // Cannot target cards owned by the move's player
  | "different-targets"; // All selected targets must be different cards

/**
 * Target count specification
 * Can be an exact number or a range (min, max)
 */
export type TargetCount =
  | number // Exact count (required)
  | {
      min: number; // Minimum number of targets (0 = optional)
      max: number; // Maximum number of targets (can be Infinity)
    };

/**
 * Target definition for a move
 * Specifies what can be targeted and how many targets are needed
 */
export type TargetDefinition = {
  /** Filter defining valid target cards/entities */
  filter: CardFilter;

  /** Number of targets required/allowed */
  count: TargetCount;

  /** Optional restrictions on target selection */
  restrictions?: TargetRestriction[];
};
