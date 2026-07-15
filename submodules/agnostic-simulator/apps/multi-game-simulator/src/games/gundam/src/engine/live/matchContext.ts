import type { EngineInteractionView } from "@tcg/protocol";
import type { GameSlug } from "@tcg/simulator-contract";

import { playUrl } from "../../../../../runtime/gameRuntimeApi.ts";
import { buildMountedHref } from "../../../../../routes/router-paths.ts";
import { gundamRuntimeRequestHeaders, readServerRuntimeHeaders } from "./runtimeHeaders.ts";

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

export interface LiveMatchOverview {
  readonly object: "match";
  readonly matchId: string;
  readonly status: "waiting" | "in_progress" | "completed" | "abandoned";
  readonly currentGameId?: string;
  readonly gameIds: readonly string[];
}

interface RawLiveMatchOverview {
  readonly object?: string;
  readonly matchId?: string;
  readonly status?: LiveMatchOverview["status"];
  readonly currentGameId?: string;
  readonly gameIds?: unknown;
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

export function buildMatchOverviewUrl(gameSlug: GameSlug, matchId: string): string {
  return playUrl(gameSlug, `/matches/${encodeURIComponent(matchId)}`);
}

export async function fetchLiveMatchOverview(
  gameSlug: GameSlug,
  matchId: string,
  fetcher: typeof fetch = fetch,
): Promise<LiveMatchOverview> {
  const response = await fetcher(buildMatchOverviewUrl(gameSlug, matchId), {
    credentials: "include",
    headers: gundamRuntimeRequestHeaders(),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message =
      body && typeof body === "object" && "message" in body && typeof body.message === "string"
        ? body.message
        : `Match overview request failed (${response.status}).`;
    throw new Error(message);
  }
  logRuntimeHeaderMismatch(response, "match-overview");
  return parseLiveMatchOverview(await response.json());
}

export function parseLiveMatchOverview(value: unknown): LiveMatchOverview {
  const raw = value as RawLiveMatchOverview;
  if (!raw || raw.object !== "match" || !raw.matchId) {
    throw new Error("Match overview response was not a match.");
  }
  return {
    object: "match",
    matchId: raw.matchId,
    status: raw.status ?? "in_progress",
    currentGameId: raw.currentGameId,
    gameIds: Array.isArray(raw.gameIds)
      ? raw.gameIds.filter((gameId): gameId is string => typeof gameId === "string")
      : [],
  };
}

export function resolveMatchOverviewDestination(
  overview: LiveMatchOverview,
  search: string,
  basename = import.meta.env.BASE_URL,
): URL {
  const gameId = overview.currentGameId ?? overview.gameIds[0];
  if (!gameId) {
    throw new Error("Match overview did not include a current game.");
  }
  const params = new URLSearchParams(search);
  params.delete("gameId");
  const query = params.toString();
  const path = `/matches/${encodeURIComponent(overview.matchId)}/games/${encodeURIComponent(gameId)}`;
  return new URL(
    `${buildMountedHref(path, basename)}${query ? `?${query}` : ""}`,
    window.location.origin,
  );
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

function logRuntimeHeaderMismatch(response: Response, context: string): void {
  const server = readServerRuntimeHeaders(response);
  const client = gundamRuntimeRequestHeaders();
  if (
    (server.runtime && server.runtime !== client["x-tcg-client-runtime"]) ||
    (server.engine && server.engine !== client["x-tcg-client-engine-runtime"]) ||
    (server.cards && server.cards !== client["x-tcg-client-cards-runtime"])
  ) {
    // eslint-disable-next-line no-console
    console.warn("[gundam-runtime] runtime fingerprint mismatch", { context, server, client });
  }
}
