import { getApiOrigin } from "$lib/config/public-url-config.js";
import { requestJson } from "$lib/data/transport/http-client.js";
import type {
  DeckRundownResponse,
  MatchListResponse,
  MilestonesResponse,
  MmrHistoryPoint,
  PlayingStreak,
  PlayerStats,
} from "../types.js";

// biome-ignore lint/suspicious/noConsole: debug-only logging
const debug = import.meta.env.DEV ? console.debug.bind(console) : () => {};

export async function fetchPlayerStats(): Promise<PlayerStats> {
  const url = `${getApiOrigin()}/v1/match-history/players/me/stats`;
  debug("[match-history] fetchPlayerStats →", url);
  const data = await requestJson<PlayerStats>(url, undefined, "Failed to load player stats");
  debug("[match-history] fetchPlayerStats result: gamesPlayed=%d", data.gamesPlayed);
  return data;
}

export type FetchMatchesParams = {
  cursor?: string;
  limit?: number;
  deckListId?: string;
  formatId?: string;
  matchType?: string;
};

export async function fetchMatches(params?: FetchMatchesParams): Promise<MatchListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.cursor) searchParams.set("cursor", params.cursor);
  if (params?.limit != null) searchParams.set("limit", String(params.limit));
  if (params?.deckListId) searchParams.set("deckListId", params.deckListId);
  if (params?.formatId) searchParams.set("formatId", params.formatId);
  if (params?.matchType) searchParams.set("matchType", params.matchType);

  const query = searchParams.toString();
  const url = `${getApiOrigin()}/v1/match-history/players/me/matches${query ? `?${query}` : ""}`;
  debug("[match-history] fetchMatches →", url);
  const data = await requestJson<MatchListResponse>(url, undefined, "Failed to load matches");
  debug(
    "[match-history] fetchMatches result: %d matches, nextCursor=%s",
    data.matches.length,
    data.nextCursor,
  );
  return data;
}

export async function fetchMmrHistory(): Promise<MmrHistoryPoint[]> {
  const url = `${getApiOrigin()}/v1/match-history/players/me/mmr-history`;
  debug("[match-history] fetchMmrHistory →", url);
  const data = await requestJson<MmrHistoryPoint[]>(url, undefined, "Failed to load MMR history");
  debug("[match-history] fetchMmrHistory result: %d points", data.length);
  return data;
}

export async function fetchMilestones(): Promise<MilestonesResponse> {
  const url = `${getApiOrigin()}/v1/match-history/players/me/milestones`;
  debug("[match-history] fetchMilestones →", url);
  const data = await requestJson<MilestonesResponse>(url, undefined, "Failed to load milestones");
  debug("[match-history] fetchMilestones result: %d milestones", data.milestones.length);
  return data;
}

export async function fetchPlayingStreak(): Promise<PlayingStreak> {
  const url = `${getApiOrigin()}/v1/match-history/players/me/playing-streak`;
  debug("[match-history] fetchPlayingStreak →", url);
  const data = await requestJson<PlayingStreak>(url, undefined, "Failed to load playing streak");
  debug("[match-history] fetchPlayingStreak result: streak=%d", data.currentStreak);
  return data;
}

export type FetchDeckRundownParams = {
  deckColorMask: number;
  deckListId?: string;
  formatId?: string;
  since?: string;
};

export async function fetchDeckRundown(
  params: FetchDeckRundownParams,
): Promise<DeckRundownResponse> {
  const searchParams = new URLSearchParams();
  searchParams.set("deckColorMask", String(params.deckColorMask));
  if (params.deckListId) searchParams.set("deckListId", params.deckListId);
  if (params.formatId) searchParams.set("formatId", params.formatId);
  if (params.since) searchParams.set("since", params.since);

  const query = searchParams.toString();
  const url = `${getApiOrigin()}/v1/match-history/players/me/deck-rundown?${query}`;
  debug("[match-history] fetchDeckRundown →", url);
  const data = await requestJson<DeckRundownResponse>(
    url,
    undefined,
    "Failed to load deck rundown",
  );
  debug("[match-history] fetchDeckRundown result: %d matchups", data.matchups.length);
  return data;
}
