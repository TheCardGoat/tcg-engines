import type { GameSlug } from "@tcg/simulator-contract";
import { primeAuthSession } from "../../auth/auth-store";
import { CYBERPUNK_GAME_SLUG } from "../../engine/live/apiOrigin";
import { cyberpunkRuntimeRequestHeaders } from "../../engine/live/runtimeHeaders";
import { apiUrl, matchHistoryUrl } from "../../../../runtime/gameRuntimeApi";

export interface CyberpunkPostGameRecord {
  gameId: string;
  matchId: string | null;
  note: string;
  canSaveNote: boolean;
  analytics?: CyberpunkAnalyticsEnvelope;
}

export interface CyberpunkAnalyticsEnvelope {
  status: "missing" | "processing" | "saved" | "failed";
  errorMessage?: string | null;
  payload?: CyberpunkGameAnalyticsRecord;
}

export interface CyberpunkGameAnalyticsRecord {
  version: number;
  gameSlug: "cyberpunk";
  gameId: string;
  matchId: string;
  dimensions: {
    matchType: string;
    format: "best_of_1" | "best_of_3";
    queueFormatId?: string;
    authority: "server" | "client";
    gameNumber: number;
  };
  summary: {
    winnerId?: string;
    endReason?: string;
    totalTurns: number;
    totalMoves: number;
    durationMs: number;
    createdAt: string;
    completedAt: string;
    onThePlay: string;
    finalGigs: { player1: number; player2: number };
    finalStreetCred: { player1: number; player2: number };
    finalEddies: { player1: number; player2: number };
    finalDeckCount: { player1: number; player2: number };
  };
  players: [CyberpunkPlayerAnalytics, CyberpunkPlayerAnalytics];
}

export interface CyberpunkPlayerAnalytics {
  playerId: string;
  displayName: string | null;
  username: string | null;
  seat: 1 | 2;
  onThePlay: boolean;
  deckName?: string;
  deckListId?: string;
  deckColors: string[];
  deckCardIds: string[];
  final: {
    gigs: number;
    streetCred: number;
    eddies: number;
    spentEddies: number;
    deckCount: number;
    handCount: number;
    fieldCount: number;
    legendCount: number;
    trashCount: number;
  };
  counters: {
    cardsPlayed: number;
    unitsPlayed: number;
    gearPlayed: number;
    programsPlayed: number;
    cardsSold: number;
    legendsCalled: number;
    gigsGained: number;
    gigsStolen: number;
    directAttacks: number;
    unitAttacks: number;
    blockersUsed: number;
    abilitiesActivated: number;
    effectsResolved: number;
    phasesPassed: number;
    turnsEnded: number;
    conceded: boolean;
  };
  metrics: {
    avgCardsPlayedPerTurn: number;
    avgGigsGainedPerTurn: number;
    avgTurnDurationMs: number;
    firstPlayTurn: number | null;
    firstGigTurn: number | null;
    firstDirectAttackTurn: number | null;
    firstStolenGigTurn: number | null;
    firstLegendCallTurn: number | null;
  };
  cardEvents: Record<
    string,
    {
      cardPublicId: string;
      displayName: string;
      type: "legend" | "unit" | "gear" | "program" | "unknown";
      color: string | null;
      cost: number | null;
      power: number | null;
      ram: number | null;
      copiesInDeck: number;
      timesPlayed: number;
      timesSold: number;
      timesCalled: number;
      timesAttackedUnits: number;
      timesAttackedDirectly: number;
      timesDefended: number;
      timesBlocked: number;
      timesAbilityActivated: number;
      gigsStolen: number;
    }
  >;
  perTurn: Array<{
    turn: number;
    cardsPlayedThisTurn: number;
    cardsSoldThisTurn: number;
    legendCallsThisTurn: number;
    gigsGainedThisTurn: number;
    gigsStolenThisTurn: number;
    directAttacksThisTurn: number;
    unitAttacksThisTurn: number;
    blockersUsedThisTurn: number;
    abilitiesActivatedThisTurn: number;
    effectsResolvedThisTurn: number;
    runningGigs: number;
    runningStreetCred: number;
    durationMs: number;
  }>;
}

export async function fetchCyberpunkPostGameRecord(
  gameId: string,
  fetcher: typeof fetch = fetch,
  gameSlug: GameSlug = CYBERPUNK_GAME_SLUG,
): Promise<CyberpunkPostGameRecord> {
  await primeAuthSession();
  const response = await fetcher(
    matchHistoryUrl(gameSlug, `/games/${encodeURIComponent(gameId)}/post-game`),
    {
      credentials: "include",
      headers: cyberpunkRuntimeRequestHeaders(),
    },
  );
  if (!response.ok) {
    throw new Error(`Post-game record request failed (${response.status})`);
  }
  return parsePostGameRecord(await response.json());
}

export async function saveCyberpunkPostGameNote(params: {
  gameId: string;
  gameSlug?: GameSlug;
  note: string;
  fetcher?: typeof fetch;
}): Promise<CyberpunkPostGameRecord> {
  await primeAuthSession();
  const response = await (params.fetcher ?? fetch)(
    matchHistoryUrl(
      params.gameSlug ?? CYBERPUNK_GAME_SLUG,
      `/games/${encodeURIComponent(params.gameId)}/notes`,
    ),
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...cyberpunkRuntimeRequestHeaders(),
      },
      body: JSON.stringify({ note: params.note }),
    },
  );
  if (!response.ok) {
    throw new Error(
      response.status === 401 ? "Sign in to save match notes." : "Failed to save notes.",
    );
  }
  return parsePostGameRecord(await response.json());
}

export async function submitCyberpunkFeedback(params: {
  gameSlug?: GameSlug;
  message: string;
  source: string;
  fetcher?: typeof fetch;
}): Promise<void> {
  await primeAuthSession();
  const response = await (params.fetcher ?? fetch)(
    apiUrl(params.gameSlug ?? CYBERPUNK_GAME_SLUG, "/feedback"),
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...cyberpunkRuntimeRequestHeaders(),
      },
      body: JSON.stringify({ message: params.message, source: params.source }),
    },
  );
  if (!response.ok) {
    throw new Error("Failed to submit feedback.");
  }
}

export async function submitCyberpunkBugReport(params: {
  description: string;
  source: string;
  context: {
    gameId: string;
    gameSlug: "cyberpunk";
    matchId?: string;
    stateVersion?: number;
    winnerId?: string;
    endReason?: string;
    turn?: number;
    platform?: "mobile" | "desktop";
  };
  fetcher?: typeof fetch;
}): Promise<void> {
  await primeAuthSession();
  const response = await (params.fetcher ?? fetch)(
    apiUrl(params.context.gameSlug, "/feedback/bug-reports"),
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...cyberpunkRuntimeRequestHeaders(),
      },
      body: JSON.stringify({
        description: params.description,
        source: params.source,
        context: params.context,
      }),
    },
  );
  if (!response.ok) {
    throw new Error("Failed to submit bug report.");
  }
}

function parsePostGameRecord(value: unknown): CyberpunkPostGameRecord {
  if (!isRecord(value) || typeof value.gameId !== "string") {
    throw new Error("Invalid post-game record.");
  }

  return {
    gameId: value.gameId,
    matchId: typeof value.matchId === "string" ? value.matchId : null,
    note: typeof value.note === "string" ? value.note : "",
    canSaveNote: value.canSaveNote === true,
    analytics: parseAnalyticsEnvelope(value.analytics),
  };
}

function parseAnalyticsEnvelope(value: unknown): CyberpunkAnalyticsEnvelope | undefined {
  if (!isRecord(value)) return undefined;
  if (
    value.status !== "missing" &&
    value.status !== "processing" &&
    value.status !== "saved" &&
    value.status !== "failed"
  ) {
    return undefined;
  }

  const payload = parseCyberpunkAnalytics(value.payload);
  return {
    status: value.status,
    errorMessage: typeof value.errorMessage === "string" ? value.errorMessage : null,
    ...(payload ? { payload } : {}),
  };
}

function parseCyberpunkAnalytics(value: unknown): CyberpunkGameAnalyticsRecord | undefined {
  if (!isRecord(value) || value.gameSlug !== "cyberpunk" || !Array.isArray(value.players)) {
    return undefined;
  }
  return value as unknown as CyberpunkGameAnalyticsRecord;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
