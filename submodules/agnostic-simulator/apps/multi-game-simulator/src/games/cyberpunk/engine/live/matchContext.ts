import { P1, P2, type EngineCtx, type MatchState, type MoveLog } from "@tcg/cyberpunk-engine";
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
import { buildMountedHref } from "../../../../router-paths";

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
}

export interface LiveMatchOverview {
  object: "match";
  matchId: string;
  status: "waiting" | "in_progress" | "completed" | "abandoned";
  currentGameId?: string;
  gameIds: string[];
}

interface RawLiveMatchContext {
  object?: string;
  match?: Partial<LiveMatchContext["match"]> & {
    participants?: unknown;
  };
  game?: Partial<LiveMatchContext["game"]> & {
    player1Id?: unknown;
    player2Id?: unknown;
    state?: unknown;
    cardsMaps?: unknown;
    timeControl?: unknown;
    clockState?: unknown;
    interactionView?: unknown;
  };
  history?: {
    engineLogs?: unknown;
    chatMessages?: unknown;
    freeTextEnabled?: unknown;
  };
}

interface RawLiveMatchOverview {
  object?: string;
  matchId?: string;
  status?: LiveMatchOverview["status"];
  currentGameId?: string;
  gameIds?: string[];
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
type CyberpunkTimeControl = NonNullable<EngineCtx["timeControl"]>;

export function buildMatchOverviewUrl(gameSlug: GameSlug, matchId: string): string {
  return playUrl(gameSlug, `/matches/${encodeURIComponent(matchId)}`);
}

export function buildMatchContextUrl(gameSlug: GameSlug, matchId: string, gameId: string): string {
  return playUrl(
    gameSlug,
    `/matches/${encodeURIComponent(matchId)}/games/${encodeURIComponent(gameId)}/context`,
  );
}

export function getMatchmakingReturnUrl(
  gameSlug: GameSlug = CYBERPUNK_GAME_SLUG,
  search = window.location.search,
): string {
  const params = new URLSearchParams(search);
  const requested = params.get("returnTo");
  if (requested && isAllowedReturnUrl(requested)) {
    return requested;
  }
  return import.meta.env.VITE_MATCHMAKING_URL || `https://tcg.online/${gameSlug}/matchmaking`;
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

export async function fetchLiveMatchContext(
  gameSlug: GameSlug,
  matchId: string,
  gameId: string,
  fetcher: typeof fetch = fetch,
): Promise<LiveMatchContext> {
  await primeAuthSession();
  const response = await fetcher(buildMatchContextUrl(gameSlug, matchId, gameId), {
    credentials: "include",
    headers: cyberpunkRuntimeRequestHeaders(),
  });
  if (!response.ok) {
    throw await createLiveHttpError(response, "Match context request failed");
  }
  logRuntimeHeaderMismatch(response, "match-context");
  const payload = await response.json();
  logLiveMatchPayload(payload, { matchId, gameId });
  return parseLiveMatchContext(payload);
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
    gameIds: Array.isArray(raw.gameIds) ? raw.gameIds : [],
  };
}

export function parseLiveMatchContext(value: unknown): LiveMatchContext {
  const raw = value as RawLiveMatchContext;
  if (!raw || raw.object !== "game_context" || !raw.match || !raw.game) {
    throw new Error("Match context response was not a game context.");
  }
  if (!raw.match.matchId || !raw.game.gameId) {
    throw new Error("Match context response is missing match or game identifiers.");
  }
  if (raw.game.state !== null && raw.game.state !== undefined && !isMatchState(raw.game.state)) {
    throw new Error("Match context response did not include a Cyberpunk match state.");
  }
  const interactionView = parseInteractionView(raw.game.interactionView);
  const actorIds = parseActorIds(raw.game);
  const timeControl = parseRemoteTimeControl(raw.game.timeControl);
  const clockState = parseRemoteClockState(raw.game.clockState);
  const state =
    raw.game.state && isMatchState(raw.game.state)
      ? mergeClockIntoState(raw.game.state, timeControl, clockState)
      : null;
  return {
    match: {
      matchId: raw.match.matchId,
      status: raw.match.status ?? "in_progress",
      format: raw.match.format === "best_of_3" ? "best_of_3" : "best_of_1",
      currentGameId: raw.match.currentGameId,
      gameIds: Array.isArray(raw.match.gameIds) ? raw.match.gameIds : [raw.game.gameId],
      winnerId: raw.match.winnerId,
      player1Score: raw.match.player1Score,
      player2Score: raw.match.player2Score,
      participants: parseParticipants(raw.match.participants),
    },
    game: {
      gameId: raw.game.gameId,
      gameNumber: raw.game.gameNumber ?? 1,
      status: raw.game.status ?? "in_progress",
      authority: raw.game.authority ?? "server",
      ...(actorIds ? { actorIds } : {}),
      state,
      version: raw.game.version ?? 0,
      ...(raw.game.cardsMaps ? { cardsMaps: raw.game.cardsMaps } : {}),
      ...(timeControl ? { timeControl } : {}),
      ...(clockState ? { clockState } : {}),
      ...(interactionView ? { interactionView } : {}),
    },
    history: {
      engineLogs: Array.isArray(raw.history?.engineLogs) ? raw.history.engineLogs : [],
      chatMessages: parseRemoteChatMessages(raw.history?.chatMessages),
      freeTextEnabled: raw.history?.freeTextEnabled === true,
    },
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

export function parseRemoteClockState(value: unknown): RemoteClockState | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return undefined;
  }
  const out: RemoteClockState = {};
  for (const [playerId, rawClock] of Object.entries(value)) {
    if (!rawClock || typeof rawClock !== "object" || Array.isArray(rawClock)) {
      continue;
    }
    const clock = rawClock as Record<string, unknown>;
    if (
      typeof clock.reserveMsRemaining !== "number" ||
      typeof clock.totalConsumedMs !== "number" ||
      typeof clock.movesMade !== "number"
    ) {
      continue;
    }
    out[playerId] = {
      reserveMsRemaining: clock.reserveMsRemaining,
      totalConsumedMs: clock.totalConsumedMs,
      movesMade: clock.movesMade,
      lastUpdatedAtMs: typeof clock.lastUpdatedAtMs === "number" ? clock.lastUpdatedAtMs : 0,
      ...(typeof clock.timeoutCount === "number" ? { timeoutCount: clock.timeoutCount } : {}),
      ...(typeof clock.isInNegativeTime === "boolean"
        ? { isInNegativeTime: clock.isInNegativeTime }
        : {}),
      ...(typeof clock.isOnClock === "boolean" ? { isOnClock: clock.isOnClock } : {}),
    };
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

function parseParticipants(value: unknown): LiveMatchParticipant[] {
  if (!Array.isArray(value)) {
    return [];
  }
  const participants: LiveMatchParticipant[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") {
      continue;
    }
    const raw = item as Record<string, unknown>;
    if (typeof raw.id !== "string" || typeof raw.displayName !== "string") {
      continue;
    }
    if (raw.seat !== 1 && raw.seat !== 2) {
      continue;
    }
    participants.push({
      id: raw.id,
      seat: raw.seat,
      displayName: raw.displayName,
      ...(typeof raw.userId === "string" ? { userId: raw.userId } : {}),
      ...(typeof raw.subscriptionTier === "string"
        ? { subscriptionTier: raw.subscriptionTier }
        : {}),
      ...(typeof raw.isMobile === "boolean" ? { isMobile: raw.isMobile } : {}),
      ...(typeof raw.mmrAtMatch === "number" ? { mmrAtMatch: raw.mmrAtMatch } : {}),
    });
  }
  return participants;
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
  return `${buildMountedHref(path, basename)}${currentPathSearch}`;
}

export function projectLiveStateForSimulator(state: MatchState): MatchState {
  const [serverP1, serverP2] = state.ctx.playerIds.map(String);
  if (!serverP1 || !serverP2 || (serverP1 === String(P1) && serverP2 === String(P2))) {
    return state;
  }
  const replacements = new Map<string, string>([
    [serverP1, String(P1)],
    [serverP2, String(P2)],
  ]);
  return replaceExactStrings(state, replacements) as MatchState;
}

export function projectLiveValueForSimulator<T>(value: T, state: MatchState): T {
  const [serverP1, serverP2] = state.ctx.playerIds.map(String);
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

function isMatchState(value: unknown): value is MatchState {
  if (!value || typeof value !== "object") {
    return false;
  }
  const maybe = value as Partial<MatchState>;
  return Boolean(maybe.G && maybe.ctx);
}

function mergeClockIntoState(
  state: MatchState,
  timeControl: EngineCtx["timeControl"] | undefined,
  clockState: RemoteClockState | undefined,
): MatchState {
  if (!timeControl && !clockState) {
    return state;
  }
  return {
    ...state,
    ctx: {
      ...state.ctx,
      ...(timeControl ? { timeControl } : {}),
      ...(clockState ? { clockState } : {}),
    },
  };
}

function parseRemoteTimeControl(value: unknown): CyberpunkTimeControl | undefined {
  if (!isRecord(value) || typeof value.mode !== "string") {
    return undefined;
  }

  if (value.mode === "none") {
    return { mode: "none" };
  }

  const config = isRecord(value.config) ? value.config : value;
  if (value.mode === "chess") {
    const initialReserveMs = config.initialReserveMs;
    if (typeof initialReserveMs !== "number") {
      return undefined;
    }
    return {
      mode: "chess",
      config: {
        initialReserveMs,
        incrementMs: numberProperty(config, "incrementMs", 0),
        delayMs: numberProperty(config, "delayMs", 0),
        graceMs: numberProperty(config, "graceMs", 0),
        resetTimeOnSkipMs: numberProperty(config, "resetTimeOnSkipMs", 0),
        lossPolicy: "lose-on-time",
        ...optionalNumberConfig(config, "maxDecisionTimeMs"),
      },
    };
  }

  if (value.mode === "priority") {
    const perPriorityWindowMs = config.perPriorityWindowMs;
    const reserveMs = config.reserveMs ?? config.initialReserveMs;
    if (typeof perPriorityWindowMs !== "number" || typeof reserveMs !== "number") {
      return undefined;
    }
    return {
      mode: "priority",
      config: {
        perPriorityWindowMs,
        reserveMs,
        perMoveBonusMs: numberProperty(config, "perMoveBonusMs", 0),
        endGameBaselineMs: numberProperty(config, "endGameBaselineMs", 0),
        graceMs: numberProperty(config, "graceMs", 0),
        onWindowExpiry: "auto-pass-if-legal-else-forfeit",
        onReserveExpiry: "lose-on-time",
      },
    };
  }

  if (value.mode === "dynamic") {
    const initialReserveMs = config.initialReserveMs;
    if (typeof initialReserveMs !== "number") {
      return undefined;
    }
    return {
      mode: "dynamic",
      config: {
        initialReserveMs,
        reserveCapMs: numberProperty(config, "reserveCapMs", initialReserveMs),
        perActionBonusMs: numberProperty(config, "perActionBonusMs", 0),
        perTurnPassBonusMs: numberProperty(
          config,
          "perTurnPassBonusMs",
          numberProperty(config, "turnPassBonusMs", 0),
        ),
        resetTimeOnSkipMs: numberProperty(config, "resetTimeOnSkipMs", 0),
        graceMs: numberProperty(config, "graceMs", 0),
        ...optionalNumberConfig(config, "maxDecisionTimeMs"),
      },
    };
  }

  return undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function numberProperty(value: Record<string, unknown>, key: string, fallback: number): number {
  return typeof value[key] === "number" ? value[key] : fallback;
}

function optionalNumberConfig<K extends string>(
  value: Record<string, unknown>,
  key: K,
): Partial<Record<K, number>> {
  return typeof value[key] === "number"
    ? ({ [key]: value[key] } as Partial<Record<K, number>>)
    : {};
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

function parseActorIds(value: {
  player1Id?: unknown;
  player2Id?: unknown;
}): LiveMatchContext["game"]["actorIds"] {
  return typeof value.player1Id === "string" && typeof value.player2Id === "string"
    ? { player: value.player1Id, opponent: value.player2Id }
    : undefined;
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

const LIVE_MATCH_PAYLOAD_LOG_STORAGE_KEY = "tcg:live-match-payload-log";
const LIVE_MATCH_PAYLOAD_LOG_QUERY_PARAMS = [
  "livePayloadLog",
  "payloadDebug",
  "redisPayloadLog",
  "ssrPayloadLog",
];

function logLiveMatchPayload(payload: unknown, ids: { matchId: string; gameId: string }): void {
  if (!shouldLogLiveMatchPayload()) return;
  // eslint-disable-next-line no-console
  console.log("[live-match] SSR/context payload", {
    ...ids,
    payload,
  });
}

function shouldLogLiveMatchPayload(): boolean {
  if (import.meta.env.DEV) return true;
  if (typeof window === "undefined") return false;

  try {
    const params = new URLSearchParams(window.location.search);
    for (const key of LIVE_MATCH_PAYLOAD_LOG_QUERY_PARAMS) {
      const value = params.get(key);
      if (value == null) continue;
      const normalized = value.toLowerCase();
      if (normalized === "1" || normalized === "true" || normalized === "on") {
        window.localStorage.setItem(LIVE_MATCH_PAYLOAD_LOG_STORAGE_KEY, "1");
        return true;
      }
      if (normalized === "0" || normalized === "false" || normalized === "off") {
        window.localStorage.removeItem(LIVE_MATCH_PAYLOAD_LOG_STORAGE_KEY);
        return false;
      }
    }
    return window.localStorage.getItem(LIVE_MATCH_PAYLOAD_LOG_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
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
