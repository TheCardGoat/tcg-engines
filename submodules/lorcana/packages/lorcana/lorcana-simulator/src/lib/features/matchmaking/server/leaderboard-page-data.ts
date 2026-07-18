import type { MatchmakingContext } from "../api/player-context-api.js";

export type LeaderboardTab = "competitive" | "casual";

export interface LeaderboardFormatOption {
  id: string;
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

export interface LeaderboardSeasonOption {
  seasonId: string;
  name: string;
  slug: string;
  startsAt: string;
  endsAt: string | null;
  isCurrent: boolean;
}

export interface CompetitiveLeaderboardResponse {
  type: "competitive";
  formatId: string;
  mode: LeaderboardQueueMode;
  region: string | null;
  seasonId: string | null;
  availableSeasons: LeaderboardSeasonOption[];
  availablePartitions: Array<{
    seasonId: string;
    formatId: string;
    mode: LeaderboardQueueMode;
  }>;
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
  queueMode: LeaderboardQueueMode;
  availableFormats: LeaderboardFormatOption[];
  seasonId: string | null;
  availableSeasons: LeaderboardSeasonOption[];
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
export const DEFAULT_LEADERBOARD_FORMAT_ID: LeaderboardFormatOption["id"] = "core-constructed";
export type LeaderboardQueueMode = "1" | "3";

export const LORCANA_LEADERBOARD_FORMATS: LeaderboardFormatOption[] = [
  { id: "infinity", labelKey: "sim.leaderboard.format.infinity" },
  { id: "core-constructed", labelKey: "sim.leaderboard.format.coreConstructed" },
];

function normalizeLeaderboardFormat(value: string | null): string | null {
  const normalized = value?.trim() ?? "";
  return /^[a-z0-9][a-z0-9._-]{0,127}$/.test(normalized) ? normalized : null;
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
    mode: LeaderboardQueueMode;
    seasonId: string | null;
    region: string | null;
    gameProfileId: string | null;
  },
): string {
  const params = new URLSearchParams();
  appendCommonParams(params, options);
  params.set("formatId", options.formatId);
  params.set("mode", options.mode);
  if (options.seasonId) params.set("seasonId", options.seasonId);
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
  const requestedFormatId = normalizeLeaderboardFormat(url.searchParams.get("formatId"));
  const formatId = requestedFormatId ?? DEFAULT_LEADERBOARD_FORMAT_ID;
  const queueMode: LeaderboardQueueMode = url.searchParams.get("mode") === "1" ? "1" : "3";
  const requestedSeasonId = url.searchParams.get("seasonId") || null;
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
      mode: queueMode,
      seasonId: requestedSeasonId,
      region,
      gameProfileId,
    });
  const casualUrl = casualLeaderboardUrl(resolvedApiOrigin, { month, region, gameProfileId });

  let competitive: CompetitiveLeaderboardResponse | null = null;
  let casual: CasualLeaderboardResponse | null = null;
  [competitive, casual] = await Promise.all([
    safeJson<CompetitiveLeaderboardResponse>(competitiveUrlFor(formatId)),
    safeJson<CasualLeaderboardResponse>(casualUrl),
  ]);
  const seasonId = competitive?.seasonId ?? requestedSeasonId;
  const knownFormatIds = new Set(LORCANA_LEADERBOARD_FORMATS.map((format) => format.id));
  const partitionFormats = (competitive?.availablePartitions ?? [])
    .map((partition) => partition.formatId)
    .filter(
      (partitionFormatId, index, all) =>
        !knownFormatIds.has(partitionFormatId) && all.indexOf(partitionFormatId) === index,
    )
    .map((partitionFormatId) => ({ id: partitionFormatId, labelKey: partitionFormatId }));

  return {
    tab,
    formatId,
    queueMode,
    availableFormats: [...LORCANA_LEADERBOARD_FORMATS, ...partitionFormats],
    seasonId,
    availableSeasons: competitive?.availableSeasons ?? [],
    region,
    month,
    competitive,
    casual,
    errors,
  };
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
