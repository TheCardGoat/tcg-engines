/**
 * Riftbound Turn Flow
 *
 * Defines the turn structure and phase transitions.
 */

import type { GamePhase } from "../../types";

/**
 * Phase order for a standard turn
 */
export const PHASE_ORDER: readonly GamePhase[] = [
  "setup",
  "draw",
  "main",
  "combat",
  "end",
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
  return PHASE_ORDER[currentIndex + 1];
}

/**
 * Check if a phase allows player actions
 *
 * @param phase - The phase to check
 * @returns true if the phase allows player actions
 */
export function isActionPhase(phase: GamePhase): boolean {
  return phase === "main" || phase === "combat";
}
