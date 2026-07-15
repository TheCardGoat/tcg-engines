import { getApiOrigin } from "$lib/config/public-url-config.js";
import { requestJson } from "$lib/data/transport/http-client.js";
import type {
  AcceptedMoveRecord,
  EngineLogRecord,
  LorcanaProjectedBoardView,
} from "@tcg/lorcana-engine";

export interface PostGamePlayerIdentity {
  id: string;
  side: "playerOne" | "playerTwo";
  displayName: string | null;
  username: string | null;
  mmr: number | null;
}

export interface PostGameCanonicalData {
  source: "redis" | "analytics";
  gameId: string;
  matchId: string;
  status: "completed" | "abandoned";
  winnerId: string | null;
  reason: string | null;
  createdAt: string;
  completedAt: string;
  durationMs: number;
  authority: "server" | "client" | null;
  matchType: "ranked" | "casual" | "practice_vs_bot" | "private" | null;
  players: [PostGamePlayerIdentity, PostGamePlayerIdentity];
  board: LorcanaProjectedBoardView;
  /** Raw move history — only present when source: "redis" (expires after ~1hr) */
  acceptedMoves?: AcceptedMoveRecord[];
  /** Raw engine logs — only present when source: "redis" (expires after ~1hr) */
  engineLogs?: EngineLogRecord[];
  /** Structured game analytics — present when source: "analytics" */
  analytics?: GameAnalyticsSummary;
}

/**
 * Per-card aggregate from the analytics record.
 * Mirrors the backend GameAnalyticsRecord CardEventAggregate (subset used by the frontend).
 */
export interface GameAnalyticsCardEvent {
  cardPublicId: string;
  fullName: string;
  loreGenerated: number;
  timesPlayed: number;
  timesAttacked: number;
  timesDefended: number;
  timesAbilityActivated: number;
}

/** Per-turn stats from the analytics record. */
export interface GameAnalyticsTurnStats {
  turn: number;
  loreGainedThisTurn: number;
  loreFromQuests: number;
  loreFromLocations: number;
  runningLore: number;
  cardsPlayedThisTurn: number;
  cardsInkedThisTurn: number;
  challengesMadeThisTurn: number;
  questsMadeThisTurn: number;
  durationMs: number;
}

export interface PlayerAnalyticsSummary {
  playerId: string;
  displayName: string | null;
  username: string | null;
  seat: 1 | 2;
  onThePlay: boolean;
  deckColors: string[];
  counters: {
    cardsPlayed: number;
    cardsInked: number;
    quests: number;
    challenges: number;
    songsSung: number;
    movesToLocations: number;
    abilitiesActivated: number;
    effectsResolved: number;
    turnsPassed: number;
    conceded: boolean;
  };
  metrics: {
    avgLorePerTurn: number;
    avgCardsPlayedPerTurn: number;
    avgTurnDurationMs: number;
    totalLoreFromQuests: number;
    totalLoreFromLocations: number;
    firstPlayTurn: number | null;
    firstQuestTurn: number | null;
    firstChallengeTurn: number | null;
  };
  /** Per-card aggregates — used for spotlight cards (top lore, most played, challenges) */
  cardEvents: Record<string, GameAnalyticsCardEvent>;
  /** Per-turn breakdown — used for turn summaries */
  perTurn: GameAnalyticsTurnStats[];
}

/** Full analytics summary — mirrors the backend GameAnalyticsRecord shape */
export interface GameAnalyticsSummary {
  version: number;
  summary: {
    totalTurns: number;
    totalMoves: number;
    durationMs: number;
    onThePlay: string;
    finalLore: { player1: number; player2: number };
  };
  players: [PlayerAnalyticsSummary, PlayerAnalyticsSummary];
}

export interface PostGameRecordEnvelope {
  gameId: string;
  matchId: string | null;
  note: string;
  postGame: PostGameCanonicalData | null;
}

export interface SavePostGameNoteParams {
  gameId: string;
  note: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isPostGamePlayerIdentity(value: unknown): value is PostGamePlayerIdentity {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    (value.side === "playerOne" || value.side === "playerTwo") &&
    (typeof value.displayName === "string" || value.displayName === null) &&
    (typeof value.username === "string" || value.username === null) &&
    (typeof value.mmr === "number" || value.mmr === null)
  );
}

function isPostGameCanonicalData(value: unknown): value is PostGameCanonicalData {
  return (
    isRecord(value) &&
    (value.source === "redis" || value.source === "analytics") &&
    typeof value.gameId === "string" &&
    typeof value.matchId === "string" &&
    (value.status === "completed" || value.status === "abandoned") &&
    (typeof value.winnerId === "string" || value.winnerId === null) &&
    (typeof value.reason === "string" || value.reason === null) &&
    typeof value.createdAt === "string" &&
    typeof value.completedAt === "string" &&
    typeof value.durationMs === "number" &&
    (value.authority === "server" || value.authority === "client" || value.authority === null) &&
    (value.matchType === "ranked" ||
      value.matchType === "casual" ||
      value.matchType === "practice_vs_bot" ||
      value.matchType === "private" ||
      value.matchType === null) &&
    Array.isArray(value.players) &&
    value.players.length === 2 &&
    value.players.every(isPostGamePlayerIdentity) &&
    isRecord(value.board) &&
    (value.acceptedMoves === undefined || Array.isArray(value.acceptedMoves)) &&
    (value.engineLogs === undefined || Array.isArray(value.engineLogs))
  );
}

function parsePostGameRecordEnvelope(payload: unknown): PostGameRecordEnvelope {
  if (
    !isRecord(payload) ||
    typeof payload.gameId !== "string" ||
    (typeof payload.matchId !== "string" && payload.matchId !== null) ||
    typeof payload.note !== "string" ||
    !(payload.postGame === null || isPostGameCanonicalData(payload.postGame))
  ) {
    throw new Error("Received an invalid post-game record payload from the API.");
  }

  return {
    gameId: payload.gameId,
    matchId: payload.matchId,
    note: payload.note,
    postGame: payload.postGame,
  };
}

export async function fetchPostGameRecord(gameId: string): Promise<PostGameRecordEnvelope> {
  const payload = await requestJson<unknown>(
    `${getApiOrigin()}/v1/match-history/games/${gameId}/post-game`,
    undefined,
    "Failed to load post-game record",
  );
  return parsePostGameRecordEnvelope(payload);
}

export async function savePostGameNote(
  params: SavePostGameNoteParams,
): Promise<PostGameRecordEnvelope> {
  const payload = await requestJson<unknown>(
    `${getApiOrigin()}/v1/match-history/games/${params.gameId}/notes`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ note: params.note }),
    },
    "Failed to save notes",
  );

  return parsePostGameRecordEnvelope(payload);
}
