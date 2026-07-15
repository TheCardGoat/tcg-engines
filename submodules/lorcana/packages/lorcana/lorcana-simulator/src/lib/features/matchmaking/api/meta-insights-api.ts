import { getApiOrigin } from "$lib/config/public-url-config.js";
import { requestJson } from "$lib/data/transport/http-client.js";

export interface MetaPeriod {
  id: string;
  periodType: string;
  startDate: string;
  endDate: string;
  label: string;
  isClosed: boolean;
}

export interface ActivityResponse {
  object: "meta.activity";
  period: MetaPeriod;
  totalGames: number;
  totalMatches: number;
  distinctPlayers: number;
  avgTurns: number | null;
  avgDurationSec: number | null;
  winRateOtp: number | null;
  winRateOtd: number | null;
  gamesOtp: number;
  gamesOtd: number;
  gamesPerDay: Array<{ periodId: string; games: number }>;
  avgGamesPerDay: number | null;
}

export interface ColorPairStat {
  colorPairId: number;
  code: string;
  colors: string[];
  label: string;
  games: number;
  wins: number;
  winRate: number;
  playRate: number;
  winRateOtp: number | null;
  winRateOtd: number | null;
  distinctPlayers: number;
}

export interface ColorPairsResponse {
  object: "meta.color_pairs";
  period: MetaPeriod;
  data: ColorPairStat[];
  totalGames: number;
}

export interface PeakHoursResponse {
  object: "meta.peak_hours";
  period: MetaPeriod;
  buckets: Array<{ hourUtc: number; games: number }>;
}

export interface ColorPairMatchupsResponse {
  object: "meta.color_pair_matchups";
  period: MetaPeriod;
  colorPairs: Array<{
    id: number;
    code: string;
    colors: string[];
    label: string;
  }>;
  cells: Array<{
    colorPairId: number;
    opponentColorPairId: number;
    games: number;
    wins: number;
    winRate: number;
  }>;
}

export interface MetaInsightsSnapshot {
  periods: MetaPeriod[];
  activity: ActivityResponse | null;
  colorPairs: ColorPairsResponse | null;
  peakHours: PeakHoursResponse | null;
  colorPairMatchups: ColorPairMatchupsResponse | null;
}

export interface MetaInsightsParams {
  periodId: string;
  formatId: string;
  bestOf: string;
  matchupMinGames: number;
  includeExtended?: boolean;
}

function queryString(params: Record<string, string | number | undefined>): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "") continue;
    query.set(key, String(value));
  }

  const serialized = query.toString();
  return serialized ? `?${serialized}` : "";
}

function segmentParams(params: MetaInsightsParams): Record<string, string | number | undefined> {
  return {
    periodId: params.periodId || undefined,
    formatId: params.formatId,
    bestOf: params.bestOf === "all" ? undefined : Number(params.bestOf),
    eventId: "*",
    bracketId: "all",
  };
}

async function requestMeta<T>(path: string, signal?: AbortSignal): Promise<T | null> {
  try {
    return await requestJson<T>(
      `${getApiOrigin()}/v1${path}`,
      signal ? { signal } : undefined,
      "Failed to load meta insights",
    );
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }

    console.warn("[matchmaking-meta] request failed", {
      path,
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return null;
  }
}

export async function fetchMetaInsightsSnapshot(
  params: MetaInsightsParams,
  signal?: AbortSignal,
): Promise<MetaInsightsSnapshot> {
  const query = queryString(segmentParams(params));
  const matchupQuery = queryString({
    ...segmentParams(params),
    minGames: params.matchupMinGames,
  });
  const [periods, activity, colorPairs, peakHours, colorPairMatchups] = await Promise.all([
    requestMeta<{ object: "list"; data: MetaPeriod[] }>("/meta/lorcana/periods", signal),
    requestMeta<ActivityResponse>(`/meta/lorcana/activity${query}`, signal),
    requestMeta<ColorPairsResponse>(`/meta/lorcana/color-pairs${query}`, signal),
    params.includeExtended
      ? requestMeta<PeakHoursResponse>(`/meta/lorcana/peak-hours${query}`, signal)
      : Promise.resolve(null),
    params.includeExtended
      ? requestMeta<ColorPairMatchupsResponse>(
          `/meta/lorcana/color-pairs/matchups${matchupQuery}`,
          signal,
        )
      : Promise.resolve(null),
  ]);

  return {
    periods: periods?.data ?? [],
    activity,
    colorPairs,
    peakHours,
    colorPairMatchups,
  };
}
