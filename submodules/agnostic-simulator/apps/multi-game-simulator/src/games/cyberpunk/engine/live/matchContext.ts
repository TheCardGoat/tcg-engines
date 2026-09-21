import {
  P1,
  P2,
  type EngineCtx,
  type FilteredMatchView,
  type MatchState,
  type MoveLog,
} from "@tcg/cyberpunk-engine";
import {
  EngineInteractionView,
  type EngineInteractionView as EngineInteractionViewType,
} from "@tcg/protocol";
import type { GameSlug } from "@tcg/simulator-contract";
import { primeAuthSession } from "../../auth/auth-store";
import type { PlayerIdentityInfo } from "../sides";
import { playUrl } from "../../../../runtime/gameRuntimeApi";
import { CYBERPUNK_GAME_SLUG } from "./apiOrigin";
import { createLiveHttpError } from "./httpFeedback";
import { cyberpunkRuntimeRequestHeaders, readServerRuntimeHeaders } from "./runtimeHeaders";
import type { ChatPresetKey } from "../chat";
import { defaultMatchmakingUrl, matchReturnUrl } from "../../../../routes/match-return-url.ts";
import { buildMountedHref } from "../../../../routes/router-paths.ts";
import { MatchResolutionSchema, type LiveMatchBootstrapV1 } from "@tcg/game-page-contract";
import { isFilteredMatchView, isMatchState, viewerProjectionToMatchState } from "./liveState";

export interface LiveMatchContext {
  match: {
    matchId: string;
    status: "in_progress" | "completed" | "abandoned";
    format: "best_of_1" | "best_of_3";
    currentGameId?: string;
    gameIds: string[];
    winnerId?: string;
    player1Score?: number;
    player2Score?: number;
    participants?: LiveMatchParticipant[];
  };
  game: {
    gameId: string;
    gameNumber: number;
    status: "in_progress" | "completed";
    authority: "server" | "client";
    actorIds?: {
      player: string;
      opponent: string;
    };
    state: MatchState | null;
    viewerProjection?: FilteredMatchView;
    version: number;
    cardsMaps?: unknown;
    timeControl?: EngineCtx["timeControl"];
    clockState?: RemoteClockState;
    interactionView?: EngineInteractionViewType;
  };
  history?: {
    engineLogs: unknown[];
    chatMessages: RemoteChatMessage[];
    freeTextEnabled: boolean;
  };
}

export interface LiveMatchParticipant extends PlayerIdentityInfo {
  seat: 1 | 2;
  userId?: string;
  /** Server-authoritative bot-seat flag from the match bootstrap. */
  isBot?: boolean;
  deckName?: string;
  deckListId?: string;
}

export interface LiveMatchOverview {
  object: "match";
  matchId: string;
  status: "waiting" | "in_progress" | "completed" | "abandoned";
  currentGameId?: string;
  gameIds: string[];
}

interface CanonicalEngineLogMessage {
  readonly values?: Record<string, unknown>;
}

interface CanonicalEngineMoveLog {
  readonly moveType: string;
  readonly playerId: string;
  readonly timestamp: number;
  readonly turnNumber?: number;
  readonly public: readonly CanonicalEngineLogMessage[];
}

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

export interface RemoteClockPlayerState {
  reserveMsRemaining: number;
  totalConsumedMs: number;
  movesMade: number;
  lastUpdatedAtMs: number;
  timeoutCount?: number;
  isInNegativeTime?: boolean;
  isOnClock?: boolean;
}

export type RemoteClockState = Record<string, RemoteClockPlayerState>;

export function buildMatchOverviewUrl(gameSlug: GameSlug, matchId: string): string {
  return playUrl(gameSlug, `/matches/${encodeURIComponent(matchId)}`);
}

export function getMatchmakingReturnUrl(
  gameSlug: GameSlug = CYBERPUNK_GAME_SLUG,
  search = window.location.search,
): string {
  const requested = matchReturnUrl(gameSlug, search);
  if (requested !== `/${gameSlug}/matchmaking`) {
    return requested;
  }
  return defaultMatchmakingUrl(gameSlug, import.meta.env.VITE_MATCHMAKING_URL);
}

export async function fetchLiveMatchOverview(
  gameSlug: GameSlug,
  matchId: string,
  fetcher: typeof fetch = fetch,
): Promise<LiveMatchOverview> {
  await primeAuthSession();
  const response = await fetcher(buildMatchOverviewUrl(gameSlug, matchId), {
    credentials: "include",
    headers: cyberpunkRuntimeRequestHeaders(),
  });
  if (!response.ok) {
    throw await createLiveHttpError(response, "Match overview request failed");
  }
  logRuntimeHeaderMismatch(response, "match-overview");
  return parseLiveMatchOverview(await response.json());
}

export function liveMatchContextFromBootstrap(bootstrap: LiveMatchBootstrapV1): LiveMatchContext {
  const viewerState = bootstrap.game.view;
  if (viewerState !== null && !isMatchState(viewerState) && !isFilteredMatchView(viewerState)) {
    throw new Error("Live bootstrap did not include a Cyberpunk viewer projection.");
  }
  const matchStatus = bootstrap.match.status;
  if (matchStatus === "waiting") {
    throw new Error("Live bootstrap cannot initialize Cyberpunk before the match starts.");
  }
  const viewerId = bootstrap.viewer.role === "player" ? bootstrap.viewer.actorId : undefined;
  const opponentId = viewerId
    ? bootstrap.match.participants.find((participant) => participant.id !== viewerId)?.id
    : undefined;
  const resources = bootstrap.game.resources;
  const cardsMaps =
    resources && typeof resources === "object" && "cardsMaps" in resources
      ? (resources as { cardsMaps?: unknown }).cardsMaps
      : undefined;
  return {
    match: {
      matchId: bootstrap.match.matchId,
      status: matchStatus,
      format: bootstrap.match.format === "best_of_3" ? "best_of_3" : "best_of_1",
      currentGameId: bootstrap.game.gameId,
      gameIds: bootstrap.match.gameIds,
      winnerId: bootstrap.match.winnerId,
      player1Score: bootstrap.match.scores?.[bootstrap.match.participants[0]?.id ?? ""],
      player2Score: bootstrap.match.scores?.[bootstrap.match.participants[1]?.id ?? ""],
      participants: bootstrap.match.participants.map((participant) => ({
        id: participant.id,
        displayName: participant.displayName,
        seat: participant.seat === 2 ? 2 : 1,
        ...(participant.userId ? { userId: participant.userId } : {}),
        ...(participant.isBot ? { isBot: true } : {}),
      })),
    },
    game: {
      gameId: bootstrap.game.gameId,
      gameNumber: bootstrap.game.gameNumber,
      status: bootstrap.game.status,
      authority: bootstrap.game.authority,
      ...(viewerId && opponentId ? { actorIds: { player: viewerId, opponent: opponentId } } : {}),
      state:
        viewerState === null
          ? null
          : isMatchState(viewerState)
            ? viewerState
            : viewerProjectionToMatchState(viewerState, bootstrap.match.matchId),
      ...(!viewerState || isMatchState(viewerState) ? {} : { viewerProjection: viewerState }),
      version: bootstrap.game.stateVersion,
      ...(cardsMaps ? { cardsMaps } : {}),
      ...(bootstrap.game.interactionView
        ? { interactionView: parseInteractionView(bootstrap.game.interactionView) }
        : {}),
    },
    history: {
      engineLogs: bootstrap.history.engineLogs.map((entry) => ({
        timestamp: entry.ts,
        log: entry.data,
      })),
      chatMessages: parseRemoteChatMessages(bootstrap.history.chatMessages),
      freeTextEnabled: bootstrap.history.freeTextEnabled === true,
    },
  };
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

export function parseRemoteChatMessages(value: unknown): RemoteChatMessage[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.flatMap((item) => {
    const parsed = parseRemoteChatMessage(item);
    return parsed ? [parsed] : [];
  });
}

export function resolveMatchOverviewDestination(
  overview: LiveMatchOverview,
  currentPathSearch: string,
  basename = import.meta.env.BASE_URL,
  gameSlug: GameSlug = CYBERPUNK_GAME_SLUG,
): { type: "game"; href: string } | { type: "return"; href: string } {
  if (overview.status === "completed" || !overview.currentGameId) {
    return { type: "return", href: getMatchmakingReturnUrl(gameSlug, currentPathSearch) };
  }
  return {
    type: "game",
    href: buildLiveMatchGameHref(
      overview.matchId,
      overview.currentGameId,
      currentPathSearch,
      basename,
    ),
  };
}

export function resolveSeriesDestination(
  context: LiveMatchContext,
  currentPathSearch: string,
  basename = import.meta.env.BASE_URL,
  gameSlug: GameSlug = CYBERPUNK_GAME_SLUG,
): { type: "stay" } | { type: "nextGame"; href: string } | { type: "return"; href: string } {
  const currentGameId = context.match.currentGameId;
  if (
    context.match.status !== "completed" &&
    currentGameId &&
    currentGameId !== context.game.gameId
  ) {
    return {
      type: "nextGame",
      href: buildLiveMatchGameHref(
        context.match.matchId,
        currentGameId,
        currentPathSearch,
        basename,
      ),
    };
  }
  if (context.match.status !== "completed" && !currentGameId) {
    return { type: "return", href: getMatchmakingReturnUrl(gameSlug, currentPathSearch) };
  }
  return { type: "stay" };
}

export function buildLiveMatchGameHref(
  matchId: string,
  gameId: string,
  currentPathSearch: string,
  basename = import.meta.env.BASE_URL,
): string {
  const path = `/matches/${encodeURIComponent(matchId)}/games/${encodeURIComponent(gameId)}`;
  const params = new URLSearchParams(currentPathSearch);
  for (const key of ["playerId", "role", "spectate", "ticket", "authToken"]) params.delete(key);
  const query = params.toString();
  return `${buildMountedHref(path, basename)}${query ? `?${query}` : ""}`;
}

export function projectLiveStateForSimulator(
  state: MatchState,
  actorIds?: LiveMatchContext["game"]["actorIds"],
): MatchState {
  const [serverP1, serverP2] = actorIds
    ? [actorIds.player, actorIds.opponent]
    : state.ctx.playerIds.map(String);
  if (!serverP1 || !serverP2 || (serverP1 === String(P1) && serverP2 === String(P2))) {
    return state;
  }
  const replacements = new Map<string, string>([
    [serverP1, String(P1)],
    [serverP2, String(P2)],
  ]);
  const projected = replaceExactStrings(state, replacements) as MatchState;
  return {
    ...projected,
    ctx: {
      ...projected.ctx,
      // Local renderer semantics are viewer-relative: P1 is always this
      // browser and P2 is the rival, regardless of the server seat order.
      playerIds: [P1, P2],
    },
  };
}

export function projectLiveValueForSimulator<T>(
  value: T,
  state: MatchState,
  actorIds?: LiveMatchContext["game"]["actorIds"],
): T {
  const [serverP1, serverP2] = actorIds
    ? [actorIds.player, actorIds.opponent]
    : state.ctx.playerIds.map(String);
  if (!serverP1 || !serverP2 || (serverP1 === String(P1) && serverP2 === String(P2))) {
    return value;
  }
  const replacements = new Map<string, string>([
    [serverP1, String(P1)],
    [serverP2, String(P2)],
  ]);
  return replaceExactStrings(value, replacements) as T;
}

export function normalizeRemoteMoveLog(log: unknown): MoveLog | null {
  if (isCanonicalEngineMoveLog(log)) {
    return moveLogFromCanonical(log);
  }

  if (isLegacyMoveLog(log)) {
    return log as MoveLog;
  }

  return null;
}

export function projectSimulatorStateForLive(
  state: MatchState,
  actorIds: NonNullable<LiveMatchContext["game"]["actorIds"]>,
): MatchState {
  return projectSimulatorValueForLive(state, actorIds);
}

export function projectSimulatorValueForLive<T>(
  value: T,
  actorIds: NonNullable<LiveMatchContext["game"]["actorIds"]>,
): T {
  const replacements = new Map<string, string>([
    [String(P1), actorIds.player],
    [String(P2), actorIds.opponent],
  ]);
  return replaceExactStrings(value, replacements) as T;
}

function moveLogFromCanonical(log: CanonicalEngineMoveLog): MoveLog {
  const values: Record<string, unknown> = {};
  for (const message of log.public) {
    Object.assign(values, message.values);
  }

  delete values.playerId;

  return {
    ...values,
    type: log.moveType,
    playerId: log.playerId,
    timestamp: log.timestamp,
    turnNumber: typeof log.turnNumber === "number" ? log.turnNumber : 0,
  } as MoveLog;
}

function isCanonicalEngineMoveLog(value: unknown): value is CanonicalEngineMoveLog {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<CanonicalEngineMoveLog>;
  return (
    typeof candidate.moveType === "string" &&
    typeof candidate.playerId === "string" &&
    typeof candidate.timestamp === "number" &&
    Array.isArray(candidate.public)
  );
}

function isLegacyMoveLog(value: unknown): boolean {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as { type?: unknown; playerId?: unknown; timestamp?: unknown };
  return (
    typeof candidate.type === "string" &&
    typeof candidate.playerId === "string" &&
    typeof candidate.timestamp === "number"
  );
}

function parseInteractionView(value: unknown): EngineInteractionViewType | undefined {
  const parsed = EngineInteractionView.safeParse(value);
  return parsed.success ? parsed.data : undefined;
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
  if (raw.kind === "preset" && typeof raw.presetKey === "string") {
    return {
      id: raw.id,
      matchId: raw.matchId,
      gameId: raw.gameId,
      senderPlayerId: raw.senderPlayerId,
      senderSeat: raw.senderSeat,
      kind: "preset",
      createdAt: raw.createdAt,
      ...(typeof raw.expiresAt === "string" ? { expiresAt: raw.expiresAt } : {}),
      presetKey: raw.presetKey as ChatPresetKey,
    };
  }
  if (raw.kind === "text" && typeof raw.text === "string") {
    return {
      id: raw.id,
      matchId: raw.matchId,
      gameId: raw.gameId,
      senderPlayerId: raw.senderPlayerId,
      senderSeat: raw.senderSeat,
      kind: "text",
      createdAt: raw.createdAt,
      ...(typeof raw.expiresAt === "string" ? { expiresAt: raw.expiresAt } : {}),
      text: raw.text,
    };
  }
  if (raw.kind === "system" && typeof raw.systemEvent === "string") {
    return {
      id: raw.id,
      matchId: raw.matchId,
      gameId: raw.gameId,
      senderPlayerId: raw.senderPlayerId,
      senderSeat: 0,
      kind: "system",
      createdAt: raw.createdAt,
      ...(typeof raw.expiresAt === "string" ? { expiresAt: raw.expiresAt } : {}),
      systemEvent: raw.systemEvent,
    };
  }
  return null;
}

function replaceExactStrings(value: unknown, replacements: ReadonlyMap<string, string>): unknown {
  if (typeof value === "string") {
    return replacements.get(value) ?? value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => replaceExactStrings(item, replacements));
  }
  if (!value || typeof value !== "object") {
    return value;
  }
  const out: Record<string, unknown> = {};
  for (const [key, nested] of Object.entries(value)) {
    out[replacements.get(key) ?? key] = replaceExactStrings(nested, replacements);
  }
  return out;
}

function logRuntimeHeaderMismatch(response: Response, route: string): void {
  const server = readServerRuntimeHeaders(response);
  const client = cyberpunkRuntimeRequestHeaders();
  if (
    (server.runtime && server.runtime !== client["x-tcg-client-runtime"]) ||
    (server.engine && server.engine !== client["x-tcg-client-engine-runtime"]) ||
    (server.cards && server.cards !== client["x-tcg-client-cards-runtime"])
  ) {
    // eslint-disable-next-line no-console
    console.warn("[live-match] runtime fingerprint mismatch", {
      route,
      clientRuntime: client["x-tcg-client-runtime"],
      clientEngine: client["x-tcg-client-engine-runtime"],
      clientCards: client["x-tcg-client-cards-runtime"],
      serverRuntime: server.runtime,
      serverEngine: server.engine,
      serverCards: server.cards,
    });
  }
}
