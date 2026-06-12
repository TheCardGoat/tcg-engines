import type { MatchState } from "../types/match-state.ts";
import type { PlayerId } from "../types/branded.ts";

/**
 * Effective "who has priority right now" lookup that handles cyberpunk's
 * parallel-action SETUP phase correctly.
 *
 * The on-state `state.G.turnMetadata.activePlayerId` is the canonical
 * priority owner for every phase EXCEPT setup. During setup both players
 * decide mulligan vs. keep in parallel (`mulliganMove` / `keepHandMove`
 * only check `state.G.gamePhase === "setup"` and `!player.mulliganDone`,
 * never `turnMetadata.activePlayerId`), so reading `activePlayerId`
 * directly there returns "whoever was canonically active at game start"
 * — which is misleading once that player has already kept/mulliganed and
 * is waiting on the opponent.
 *
 * Concrete failure mode this helper exists to fix: a server-side bot
 * driver (whether the legacy `gateway/routes/ws-route` path or the new
 * inbox `execute-move` handler) calls `engine.getActivePlayerId()` to
 * decide whether the bot should act. Without this carve-out, after the
 * human player keeps their hand the bot never gets priority — the
 * canonical `activePlayerId` is still pointing at the human — and the
 * match stalls forever in SETUP.
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
