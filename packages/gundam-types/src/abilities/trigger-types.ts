// ============================================================================
// Trigger Events
// ============================================================================

/**
 * Base trigger events - what action occurred
 *
 * These are the fundamental game actions. Use the `on` field
 * to specify what entity triggered the event.
 */
export type TriggerEvent =
  // Card actions
  | "deploy" // A card is deployed

  // Character actions
  | "paired" // A character pairs
  | "burst" // A character bursts

  // Combat-specific
  | "attack" // A character attacks
  | "defend" // A character defends

  // Turn phases
  | "start-turn" // Start of turn
  | "end-turn"; // End of turn

/**
 * Restrictions specific to triggers
 */
export type TriggerRestriction =
  // Usage tracking
  | { type: "once-per-turn" }

  // Turn phase
  | { type: "during-turn"; whose: "your" | "opponent" };

// ============================================================================
// Trigger Definition
// ============================================================================

/**
 * Complete trigger definition
 */
export interface Trigger {
  /** The event that causes this trigger to fire */
  event: TriggerEvent;

  /**
   * Additional restrictions on when this trigger fires
   * Uses the shared Restriction type from ability-types
   */
  restrictions?: TriggerRestriction[];
}

/**
 * Check if trigger has a specific restriction
 */
export function hasRestriction(
  trigger: Trigger,
  type: TriggerRestriction["type"],
): boolean {
  return trigger.restrictions?.some((r) => r.type === type) ?? false;
}
