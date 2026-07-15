/**
 * Riftbound Turn Flow
 *
 * Defines the turn structure and phase transitions.
 * Follows the official Riftbound turn structure:
 * - Awaken Phase: Ready all game objects
 * - Beginning Phase: Start of turn effects, scoring
 * - Channel Phase: Channel 2 runes
 * - Draw Phase: Draw 1 card, rune pool empties
 * - Action Phase: Main phase for playing cards and abilities
 * - Ending Phase: End of turn effects, cleanup
 */

import type { GamePhase } from "../../types";

/**
 * Phase order for a standard turn
 */
export const PHASE_ORDER: readonly GamePhase[] = [
  "awaken",
  "beginning",
  "channel",
  "draw",
  "action",
  "ending",
  "cleanup",
] as const;

/**
 * Get the next phase in the turn sequence
 *
 * @param currentPhase - The current phase
 * @returns The next phase, or null if at end of turn
 */
export function getNextPhase(currentPhase: GamePhase): GamePhase | null {
  const currentIndex = PHASE_ORDER.indexOf(currentPhase);
  if (currentIndex === -1 || currentIndex === PHASE_ORDER.length - 1) {
    return null;
  }
  return PHASE_ORDER[currentIndex + 1] ?? null;
}

/**
 * Check if a phase allows player actions
 *
 * @param phase - The phase to check
 * @returns true if the phase allows player actions
 */
export function isActionPhase(phase: GamePhase): boolean {
  return phase === "action";
}

/**
 * Check if a phase is the setup phase
 *
 * @param phase - The phase to check
 * @returns true if the phase is setup
 */
export function isSetupPhase(phase: GamePhase): boolean {
  return phase === "setup";
}
