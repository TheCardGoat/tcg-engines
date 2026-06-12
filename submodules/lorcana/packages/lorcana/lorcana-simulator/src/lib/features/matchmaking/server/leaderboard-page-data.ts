import type { MatchmakingContext } from "../api/player-context-api.js";

export type LeaderboardTab = "competitive" | "casual";

export interface LeaderboardFormatOption {
  id: "infinity" | "core-constructed";
  labelKey: string;
}

export interface CompetitiveLeaderboardEntry {
  rank: number;
  gameProfileId: string;
  displayName: string | null;
  region: string | null;
  mmr: number;
  gamesPlayed: number;
  gamesWon: number;
  losses: number;
  winStreak: number;
  bracket: string | null;
}

export interface CasualLeaderboardEntry {
  rank: number;
  gameProfileId: string;
  displayName: string | null;
  region: string | null;
  goatScore: number;
  badges: string[];
  gamesPlayedMonth: number;
  activeDaysMonth: number;
  currentStreak: number;
}

export interface CompetitiveLeaderboardResponse {
  type: "competitive";
  formatId: string;
  region: string | null;
  seasonId: string | null;
  entries: CompetitiveLeaderboardEntry[];
  total: number;
  currentUser: { rank: number; mmr: number } | null;
}

export interface CasualLeaderboardResponse {
  type: "casual";
  month: string;
  region: string | null;
  entries: CasualLeaderboardEntry[];
  total: number;
  currentUser: { rank: number; goatScore: number } | null;
}

export interface LeaderboardFetchError {
  url: string;
  message: string;
}

export interface LeaderboardPageData {
  tab: LeaderboardTab;
  formatId: LeaderboardFormatOption["id"];
  availableFormats: LeaderboardFormatOption[];
  region: string | null;
  month: string;
  competitive: CompetitiveLeaderboardResponse | null;
  casual: CasualLeaderboardResponse | null;
  errors: LeaderboardFetchError[];
}

interface JsonResult<T> {
  data: T | null;
  error?: LeaderboardFetchError;
}

export type LeaderboardJsonFetcher = <T>(url: string, init?: RequestInit) => Promise<JsonResult<T>>;
export type MatchmakingContextFetcher = (init?: RequestInit) => Promise<MatchmakingContext | null>;

export interface LoadLeaderboardPageDataOptions {
  url: URL;
  cookie?: string | null;
  apiOrigin?: string;
  now?: Date;
  fetchJson?: LeaderboardJsonFetcher;
  fetchMatchmakingContext?: MatchmakingContextFetcher;
}

export const LEADERBOARD_PAGE_SIZE = 50;
export const RANKED_PLACEMENT_GAMES = 20;

export const LORCANA_LEADERBOARD_FORMATS: LeaderboardFormatOption[] = [
  { id: "infinity", labelKey: "sim.leaderboard.format.infinity" },
  { id: "core-constructed", labelKey: "sim.leaderboard.format.coreConstructed" },
];

function isLeaderboardFormat(value: string | null): value is LeaderboardFormatOption["id"] {
  return LORCANA_LEADERBOARD_FORMATS.some((format) => format.id === value);
}

export function currentUtcMonth(date: Date): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

function appendCommonParams(
  params: URLSearchParams,
  options: {
    region: string | null;
    gameProfileId: string | null;
  },
) {
  params.set("limit", String(LEADERBOARD_PAGE_SIZE));
  if (options.region) params.set("region", options.region);
  if (options.gameProfileId) params.set("gameProfileId", options.gameProfileId);
}

export function competitiveLeaderboardUrl(
  apiOrigin: string,
  options: {
    formatId: string;
    region: string | null;
    gameProfileId: string | null;
  },
): string {
  const params = new URLSearchParams();
  appendCommonParams(params, options);
  params.set("formatId", options.formatId);
  return `${apiOrigin}/v1/leaderboards/lorcana/page/competitive?${params.toString()}`;
}

export function casualLeaderboardUrl(
  apiOrigin: string,
  options: {
    month: string;
    region: string | null;
    gameProfileId: string | null;
  },
): string {
  const params = new URLSearchParams();
  appendCommonParams(params, options);
  params.set("month", options.month);
  return `${apiOrigin}/v1/leaderboards/lorcana/page/casual?${params.toString()}`;
}

export async function loadLeaderboardPageData({
  url,
  cookie = null,
  apiOrigin,
  now = new Date(),
  fetchJson = defaultFetchJson,
  fetchMatchmakingContext,
}: LoadLeaderboardPageDataOptions): Promise<LeaderboardPageData> {
  const resolvedApiOrigin = apiOrigin ?? (await getDefaultApiOrigin());
  const resolvedFetchMatchmakingContext =
    fetchMatchmakingContext ?? defaultFetchMatchmakingContext(resolvedApiOrigin);
  const requestedTab = url.searchParams.get("tab");
  let tab: LeaderboardTab = requestedTab === "casual" ? "casual" : "competitive";
  const region = url.searchParams.get("region") || null;
  const requestedFormatId = url.searchParams.get("formatId");
  let formatId: LeaderboardFormatOption["id"] = isLeaderboardFormat(requestedFormatId)
    ? requestedFormatId
    : "infinity";
  const month = currentUtcMonth(now);
  const requestInit = cookie ? { headers: { cookie } } : undefined;
  const context = cookie
    ? await fetchContextOrNull(resolvedFetchMatchmakingContext, requestInit)
    : null;
  const gameProfileId = context?.activeGameProfileId ?? null;
  const errors: LeaderboardFetchError[] = [];

  async function safeJson<T>(requestUrl: string): Promise<T | null> {
    const result = await fetchJson<T>(requestUrl, requestInit);
    if (result.error) errors.push(result.error);
    return result.data;
  }

  const competitiveUrlFor = (nextFormatId: string) =>
    competitiveLeaderboardUrl(resolvedApiOrigin, {
      formatId: nextFormatId,
      region,
      gameProfileId,
    });
  const casualUrl = casualLeaderboardUrl(resolvedApiOrigin, { month, region, gameProfileId });

  let competitive: CompetitiveLeaderboardResponse | null = null;
  let casual: CasualLeaderboardResponse | null = null;
  const hasExplicitQueue = url.searchParams.has("tab") || url.searchParams.has("formatId");

  if (hasExplicitQueue) {
    [competitive, casual] = await Promise.all([
      safeJson<CompetitiveLeaderboardResponse>(competitiveUrlFor(formatId)),
      safeJson<CasualLeaderboardResponse>(casualUrl),
    ]);
  } else {
    const [competitiveResults, casualResult] = await Promise.all([
      Promise.all(
        LORCANA_LEADERBOARD_FORMATS.map(async (format, order) => ({
          formatId: format.id,
          order,
          board: await safeJson<CompetitiveLeaderboardResponse>(competitiveUrlFor(format.id)),
        })),
      ),
      safeJson<CasualLeaderboardResponse>(casualUrl),
    ]);

    casual = casualResult;
    const candidates = [
      ...competitiveResults.map((result) => ({
        tab: "competitive" as const,
        formatId: result.formatId,
        matchVolume: matchVolume(result.board),
        totalPlayers: result.board?.total ?? result.board?.entries.length ?? 0,
        board: result.board,
        order: result.order,
      })),
      {
        tab: "casual" as const,
        formatId,
        matchVolume: matchVolume(casual),
        totalPlayers: casual?.total ?? casual?.entries.length ?? 0,
        board: casual,
        order: competitiveResults.length,
      },
    ];
    const selected = candidates
      .filter((candidate) => candidate.board !== null)
      .sort(
        (a, b) =>
          b.matchVolume - a.matchVolume || b.totalPlayers - a.totalPlayers || a.order - b.order,
      )[0];

    if (selected) {
      tab = selected.tab;
      formatId = selected.formatId;
    }

    competitive =
      competitiveResults.find((result) => result.formatId === formatId)?.board ??
      competitiveResults[0]?.board ??
      null;
  }

  return {
    tab,
    formatId,
    availableFormats: LORCANA_LEADERBOARD_FORMATS,
    region,
    month,
    competitive,
    casual,
    errors,
  };
}

function matchVolume(board: CompetitiveLeaderboardResponse | CasualLeaderboardResponse | null) {
  if (!board) return 0;
  if (board.type === "competitive") {
    return board.entries.reduce((sum, entry) => sum + entry.gamesPlayed, 0);
  }
  return board.entries.reduce((sum, entry) => sum + entry.gamesPlayedMonth, 0);
}

async function defaultFetchJson<T>(url: string, init?: RequestInit): Promise<JsonResult<T>> {
  try {
    const { serverJsonOrNull } = await import("$lib/data/server/server-json.js");
    const data = await serverJsonOrNull<T>(url, init);
    return data
      ? { data }
      : {
          data: null,
          error: {
            url,
            message: "Failed to load leaderboard data",
          },
        };
  } catch (error) {
    return {
      data: null,
      error: {
        url,
        message: error instanceof Error ? error.message : "Failed to load leaderboard data",
      },
    };
  }
}

function defaultFetchMatchmakingContext(apiOrigin: string): MatchmakingContextFetcher {
  return async (init) => {
    const { serverJsonOrNull } = await import("$lib/data/server/server-json.js");
    return serverJsonOrNull<MatchmakingContext>(
      `${apiOrigin}/v1/users/me/games/lorcana/matchmaking-context`,
      init,
    );
  };
}

async function fetchContextOrNull(
  fetchMatchmakingContext: MatchmakingContextFetcher,
  init?: RequestInit,
): Promise<MatchmakingContext | null> {
  try {
    return await fetchMatchmakingContext(init);
  } catch {
    return null;
  }
}

async function getDefaultApiOrigin(): Promise<string> {
  const [{ getApiOrigin }, { getServerApiOrigin }] = await Promise.all([
    import("$lib/config/public-url-config.js"),
    import("$lib/server/fetch-with-cf.js"),
  ]);
  return getServerApiOrigin(getApiOrigin());
}
