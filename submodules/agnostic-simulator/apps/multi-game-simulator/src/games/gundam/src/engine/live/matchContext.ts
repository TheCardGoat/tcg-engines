import type { EngineInteractionView } from "@tcg/protocol";

/**
 * Match-context helpers for the live-match page.
 *
 * Cyberpunk has a richer set of helpers (HTTP fetch of game context,
 * series progression, multi-game match navigation). Gundam's practice
 * path only ever runs a single game per match, and the quick-match
 * response gives us everything we need to open the socket directly —
 * no separate HTTP context fetch required. The first `state_sync`
 * delivered over the gateway *is* the initial state. So this module
 * stays small.
 */
export interface LiveMatchView {
  readonly matchId: string;
  readonly gameId: string;
  readonly playerId: string;
  /** Best-known engine state version. Bumped from server messages. */
  version: number;
  /** Last `state_sync` / `state_update` engine state, if any. */
  state: Record<string, unknown> | null;
  /** Protocol interaction projection for the controlled seat. */
  interactionView?: EngineInteractionView;
  /** Set when `game_ended` arrives. */
  ended: { winnerId: string | null; reason: string | null } | null;
}

export function createInitialLiveMatchView(input: {
  matchId: string;
  gameId: string;
  playerId: string;
}): LiveMatchView {
  return {
    matchId: input.matchId,
    gameId: input.gameId,
    playerId: input.playerId,
    version: 0,
    state: null,
    ended: null,
  };
}

/**
 * Where the simulator should send the user when they leave the match.
 * Mirrors cyberpunk's `getMatchmakingReturnUrl` — honours `?returnTo=`
 * (only if it points back to our tcg.online matchmaking page or to
 * localhost) and otherwise falls back to the VITE-injected URL.
 */
export function getMatchmakingReturnUrl(search = window.location.search): string {
  const params = new URLSearchParams(search);
  const requested = params.get("returnTo");
  if (requested && isAllowedReturnUrl(requested)) {
    return requested;
  }
  const env = import.meta.env as Record<string, string | undefined>;
  return env.VITE_GUNDAM_MATCHMAKING_URL || "https://tcg.online/gundam/matchmaking";
}

function isAllowedReturnUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.origin === "https://tcg.online" ||
      (url.protocol === "http:" && (url.hostname === "localhost" || url.hostname === "127.0.0.1"))
    );
  } catch {
    return false;
  }
}
