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
  ctx: { stateID: number };
  G: {
    gameEnded: boolean;
    gamePhase: string;
    turnMetadata: { pendingChoice?: unknown };
    players: Record<string, { zones: { hand: unknown[] } }>;
  };
}

/**
 * True when the local board has no opening hand or known setup decision. A
 * healthy match only passes through this state for moments before its first
 * setup update lands, so a sustained reading warrants a fresh copy.
 *
 * The viewer projection hides the Rival's first-player choice. The matching
 * server interaction view still reports its resolution, so waiting for that
 * decision is not a sync stall. Mulligan follows the opening draw (CR 7.9.1).
 */
export function isSetupStateStale(
  state: SetupStateProbe,
  humanSide: Side,
  authoritativeChoiceStateVersion?: number,
): boolean {
  if (state.G.gameEnded || state.G.gamePhase !== "setup") return false;
  if (state.G.turnMetadata.pendingChoice != null) return false;
  // A rival's choice is hidden from this viewer projection. The server's
  // interaction view still records its resolution at the same state version.
  if (authoritativeChoiceStateVersion === state.ctx.stateID) return false;
  const sideId = PLAYER_SIDE_TO_ID[humanSide];
  const hand = state.G.players[sideId]?.zones.hand;
  return Array.isArray(hand) && hand.length === 0;
}
