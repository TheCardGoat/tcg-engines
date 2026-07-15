import { getApiOrigin } from "$lib/config/public-url-config.js";
import { requestJson } from "$lib/data/transport/http-client.js";

export interface LiveMatchPlayer {
  id: string;
  displayName: string;
  isMobile?: boolean;
  mmr?: number;
  subscriptionTier?: string;
}

export interface LiveMatchEntry {
  matchId: string;
  currentGameId: string | undefined;
  player1: LiveMatchPlayer;
  player2: LiveMatchPlayer;
  player1Score: number;
  player2Score: number;
  player1Inks: string[];
  player2Inks: string[];
  turnNumber: number;
  format: "best_of_1" | "best_of_3";
  matchType: string;
  createdAt: string;
  spectatorCount: number;
}

export interface LiveMatchListResponse {
  object: "live_match_list";
  matches: LiveMatchEntry[];
  total: number;
}

export interface LiveMatchFetchFilters {
  matchType?: string;
  format?: "best_of_1" | "best_of_3";
  inks?: string[];
}

export async function fetchLiveMatches(
  limit = 25,
  filters: LiveMatchFetchFilters = {},
): Promise<LiveMatchListResponse> {
  const url = new URL(`${getApiOrigin()}/v1/games/lorcana/play/matches/live`);
  url.searchParams.set("limit", String(limit));
  if (filters.matchType) url.searchParams.set("matchType", filters.matchType);
  if (filters.format) url.searchParams.set("format", filters.format);
  if (filters.inks && filters.inks.length > 0) url.searchParams.set("inks", filters.inks.join(","));

  return requestJson<LiveMatchListResponse>(
    url.toString(),
    undefined,
    "Failed to fetch live matches",
  );
}
