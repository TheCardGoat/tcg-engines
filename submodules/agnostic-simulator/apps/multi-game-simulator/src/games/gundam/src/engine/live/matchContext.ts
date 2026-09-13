import type { AnimationPlanV2, EngineInteractionView } from "@tcg/protocol";
import type { ChatPresetKey } from "@tcg/protocol/chat";
import type { CanonicalEngineMoveLog } from "@tcg/shared/game-engine";
import type { GameSlug } from "@tcg/simulator-contract";
import { MatchResolutionSchema } from "@tcg/game-page-contract";
import type { FilteredMatchView, GundamG } from "@tcg/gundam-engine";
import type { GundamPresentation } from "@tcg/gundam-server-adapter";

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
  /** Last validated `state_sync` / `state_update` player projection, if any. */
  state: FilteredMatchView<GundamG> | null;
  /** Protocol interaction projection for the controlled seat. */
  interactionView?: EngineInteractionView;
  /** Server-authoritative eligibility for this seated player only. */
  canUndo: boolean;
  /** Authoritative, viewer-safe packets delivered by the gateway. */
  animationPackets: readonly LiveAnimationPacket[];
  /**
   * Viewer-safe engine move logs accumulated from `state_update` /
   * `move_accepted` payloads. Drives the battle log in live matches —
   * the viewer runtime itself never executes commands, and `loadState`
   * snapshots don't carry the runtime's move-log history.
   */
  engineLogRecords: readonly LiveEngineLogRecord[];
  /**
   * Viewer-safe presentation overlay accumulated from the bootstrap
   * resources and every gateway message that carries refreshed
   * viewer-filtered cards maps (`game_joined`, `state_sync`). Entries are
   * per-instance and immutable once assigned, so the accumulation unions
   * earlier and later maps instead of replacing them.
   */
  presentation?: GundamPresentation;
  /** Set when `game_ended` arrives. */
  ended: { winnerId: string | null; reason: string | null } | null;
}

export interface LiveEngineLogRecord {
  readonly stateVersion: number;
  readonly timestamp: number;
  readonly log: CanonicalEngineMoveLog;
}

export interface LiveAnimationPacket {
  readonly plan: AnimationPlanV2;
  readonly stateVersion: number;
  readonly turnNumber: number;
}

export interface LiveMatchOverview {
  readonly object: "match";
  readonly matchId: string;
  readonly status: "waiting" | "in_progress" | "completed" | "abandoned";
  readonly currentGameId?: string;
  readonly gameIds: readonly string[];
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
    canUndo: false,
    animationPackets: [],
    engineLogRecords: [],
    ended: null,
  };
}

export function buildMatchOverviewUrl(gameSlug: GameSlug, matchId: string): string {
  return playUrl(gameSlug, `/matches/${encodeURIComponent(matchId)}`);
}

export function buildGundamReplayHref(gameId: string, basename = "/gundam/simulator"): string {
  return buildMountedHref(`/replay/${encodeURIComponent(gameId)}`, basename);
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
  const resolved = MatchResolutionSchema.parse(value);
  return {
    object: "match",
    matchId: resolved.match.matchId,
    status: resolved.match.status,
    ...(resolved.currentGameId ? { currentGameId: resolved.currentGameId } : {}),
    gameIds: resolved.match.gameIds,
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
  for (const key of ["playerId", "role", "spectate", "ticket", "authToken"]) params.delete(key);
  const query = params.toString();
  const path = `/matches/${encodeURIComponent(overview.matchId)}/games/${encodeURIComponent(gameId)}`;
  const origin = typeof window === "undefined" ? "http://localhost" : window.location.origin;
  return new URL(`${buildMountedHref(path, basename)}${query ? `?${query}` : ""}`, origin);
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

/**
 * Wire shape of a chat message delivered by the gateway (`game_chat_history`
 * / `chat_message`). Mirrors cyberpunk's `RemoteChatMessage`.
 */
export interface RemoteChatMessage {
  id: string;
  matchId: string;
  gameId: string;
  senderPlayerId: string;
  senderSeat: 0 | 1 | 2;
  kind: "preset" | "text" | "system";
  createdAt: string;
  expiresAt?: string;
  presetKey?: ChatPresetKey;
  text?: string;
  systemEvent?: string;
}

export function parseRemoteChatMessages(value: unknown): RemoteChatMessage[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.flatMap((item) => {
    const parsed = parseRemoteChatMessage(item);
    return parsed ? [parsed] : [];
  });
}

function parseRemoteChatMessage(value: unknown): RemoteChatMessage | null {
  if (!value || typeof value !== "object") {
    return null;
  }
  const raw = value as Record<string, unknown>;
  if (
    typeof raw.id !== "string" ||
    typeof raw.matchId !== "string" ||
    typeof raw.gameId !== "string" ||
    typeof raw.senderPlayerId !== "string" ||
    typeof raw.createdAt !== "string"
  ) {
    return null;
  }
  if (raw.senderSeat !== 0 && raw.senderSeat !== 1 && raw.senderSeat !== 2) {
    return null;
  }
  const base = {
    id: raw.id,
    matchId: raw.matchId,
    gameId: raw.gameId,
    senderPlayerId: raw.senderPlayerId,
    senderSeat: raw.senderSeat as 0 | 1 | 2,
    createdAt: raw.createdAt,
    ...(typeof raw.expiresAt === "string" ? { expiresAt: raw.expiresAt } : {}),
  };
  if (raw.kind === "preset" && typeof raw.presetKey === "string") {
    return { ...base, kind: "preset", presetKey: raw.presetKey as ChatPresetKey };
  }
  if (raw.kind === "text" && typeof raw.text === "string") {
    return { ...base, kind: "text", text: raw.text };
  }
  if (raw.kind === "system" && typeof raw.systemEvent === "string") {
    return { ...base, kind: "system", systemEvent: raw.systemEvent };
  }
  return null;
}
