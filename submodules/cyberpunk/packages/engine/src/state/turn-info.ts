import type { MatchState } from "../types/match-state.ts";
import type { PlayerId } from "../types/branded.ts";

/**
 * CR 7.9.2 — the player going first must finish their one keep-or-mulligan
 * decision before the second player may declare. Shared by `mulligan` and
 * `keepHand` so availability and validation cannot diverge.
 */
export function isOpeningHandDecisionWindow(state: MatchState, playerId: PlayerId): boolean {
  const player = state.G.players[playerId as string];
  if (!player) return false;
  if (player.firstPlayer) return true;

  const firstPlayerId = state.ctx.playerIds.find(
    (pid) => state.G.players[pid as string]?.firstPlayer === true,
  );
  if (!firstPlayerId) return false;
  return state.G.players[firstPlayerId as string]?.mulliganDone === true;
}

/**
 * Effective "who has priority right now" lookup for setup's sequential
 * opening-hand window.
 *
 * The on-state `state.G.turnMetadata.activePlayerId` is the canonical
 * priority owner for every phase EXCEPT setup. During setup the first
 * player decides keep/mulligan first; after they decide, the second
 * player still owes a decision while `activePlayerId` still points at
 * the first player.
 *
 * Concrete failure mode this helper exists to fix: the server-side bot
 * driver calls `engine.getActivePlayerId()` to decide whether the bot
 * should act. Without this carve-out, after the first player keeps their
 * hand the bot never gets priority if it is sitting second — the
 * canonical `activePlayerId` is still pointing at the first player —
 * and the match stalls forever in SETUP.
 *
 * Rules:
 *   - non-setup phases → return `turnMetadata.activePlayerId` (no change)
 *   - setup phase, canonical active player still has work → return them
 *   - setup phase, canonical active player has decided → return the
 *     opposite (still-undecided) player
 *   - setup phase, both decided (transient state right before
 *     `advanceIfBothDecided` flips to play) → return canonical active
 */
export function getEffectiveActivePlayerId(state: MatchState): PlayerId | undefined {
  const canonical = state.G.turnMetadata.activePlayerId;
  if (state.G.gamePhase !== "setup") return canonical;

  const canonicalPlayer = state.G.players[canonical as string];
  if (canonicalPlayer && !canonicalPlayer.mulliganDone) return canonical;

  const undecided = state.ctx.playerIds.find(
    (pid) => !state.G.players[pid as string]?.mulliganDone,
  );
  return (undecided as PlayerId | undefined) ?? canonical;
}
