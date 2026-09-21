import { PLAYER_SIDE_TO_ID, type Side } from "../engine";

/**
 * How long the board may sit in the pre-deal setup state before we treat it
 * as a missed state update and surface the sync/reload recovery affordance.
 */
export const SETUP_SYNC_STALL_GRACE_MS = 10_000;

/**
 * Structural subset of the Cyberpunk match state this predicate reads. Kept
 * narrow so tests can pass minimal fixtures while real `MatchState` values
 * type-check directly.
 */
export interface SetupStateProbe {
  G: {
    gameEnded: boolean;
    gamePhase: string;
    turnMetadata: { pendingChoice?: unknown };
    players: Record<string, { zones: { hand: unknown[] } }>;
  };
}

/**
 * True when the local board is still sitting in the pre-deal setup state: the
 * engine phase is `setup`, no opening hands have been dealt, and no pending
 * choice exists. A healthy match only passes through this state for moments
 * before the first setup update lands, so a sustained reading means this
 * client missed its setup `state_update`s and should request a fresh copy.
 *
 * A waiting player whose Rival is deciding their opening-hand mulligan does
 * not match: hands are already dealt by then (CR 7.9.1) and the pending
 * choice is set, so the normal "Waiting" sidebar state stays free of recovery
 * noise.
 */
export function isSetupStateStale(state: SetupStateProbe, humanSide: Side): boolean {
  if (state.G.gameEnded || state.G.gamePhase !== "setup") return false;
  if (state.G.turnMetadata.pendingChoice != null) return false;
  const sideId = PLAYER_SIDE_TO_ID[humanSide];
  const hand = state.G.players[sideId]?.zones.hand;
  return Array.isArray(hand) && hand.length === 0;
}
