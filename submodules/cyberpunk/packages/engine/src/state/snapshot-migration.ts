import type { MatchState } from "../types/match-state.ts";
import { COMBAT_STATE_VERSION, restoreCombatState } from "./combat-state-version.ts";

/** v1 had no whole-state version; v2 requires first-event history on every retained state. */
export const CYBERPUNK_SNAPSHOT_SCHEMA_VERSION = 2;

export function migrateCyberpunkSnapshotState(state: MatchState, version: number): MatchState {
  if (version !== 1 && version !== CYBERPUNK_SNAPSHOT_SCHEMA_VERSION) {
    throw new Error(`Unsupported Cyberpunk snapshot schema: ${version}`);
  }
  const restored = restoreCombatState(state, COMBAT_STATE_VERSION);
  const turn = restored.G.turnMetadata;
  if (version === 1 && turn.firstTimeEventsThisTurn === undefined) {
    turn.firstTimeEventsThisTurn = [];
    // These releases tracked only which abilities had fired. Do not invent
    // earlier events or reset that ledger. Retain those rules for the rest of
    // this turn; the next beginTurn starts complete event history normally.
    turn.legacyFirstTimeLimitsUntilNextTurn = true;
  }
  if (
    !Array.isArray(turn.firstTimeEventsThisTurn) ||
    !turn.firstTimeEventsThisTurn.every(
      (fact) =>
        fact &&
        fact.event &&
        ["cardPlayed", "cardDefeated", "attackDeclared"].includes(fact.event.type),
    ) ||
    !Array.isArray(turn.abilityFiredThisTurn) ||
    !Array.isArray(turn.triggerQueue) ||
    (turn.legacyFirstTimeLimitsUntilNextTurn !== undefined &&
      turn.legacyFirstTimeLimitsUntilNextTurn !== true)
  ) {
    throw new Error("Invalid Cyberpunk turn continuation in snapshot");
  }
  return restored;
}
