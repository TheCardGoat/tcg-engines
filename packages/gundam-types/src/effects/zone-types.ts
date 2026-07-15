/**
 * Game Zone Types
 *
 * All possible zones where cards can exist in the Gundam Card Game.
 * Matches the zones defined in GundamGameState.
 */
export type ZoneType =
  | "deck"
  | "resourceDeck"
  | "hand"
  | "battleArea"
  | "shieldSection"
  | "baseSection"
  | "resourceArea"
  | "trash"
  | "removal"
  | "limbo";
