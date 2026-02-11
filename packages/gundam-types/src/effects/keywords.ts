/**
 * Gundam Card Game Keyword Effects
 *
 * Keywords are game-defined abilities that work consistently across cards.
 * See Official Rules Section 10 for keyword definitions.
 */

/**
 * Official Gundam Card Game Keywords
 *
 * Keywords are game-defined abilities that work consistently across cards.
 * See Official Rules Section 10 for keyword definitions.
 */
export type KeywordEffect =
  | "Repair" // Remove 1 damage at end of turn
  | "Breach" // Can attack without being blocked by rested units
  | "Support" // Can be rested to boost attacking unit's AP
  | "Blocker" // Can rest to intercept an attack
  | "FirstStrike" // Deals damage before defender in combat
  | "HighManeuver" // Cannot be intercepted by rested units
  | "Assassin" // Can destroy rested units
  | "Intercept" // Can intercept attacks targeting other units
  | "Mobile" // Can attack the turn it is deployed
  | "Counter" // Deals damage when attacked
  | "Pilot" // Can be paired with compatible units
  | "Transform" // Can transform into specified card
  | "Brave" // Gains bonus stats when damaged
  | "Alert"; // Can be activated without resting
