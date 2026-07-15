import { getApiOrigin } from "$lib/config/public-url-config.js";
import { requestJson } from "$lib/data/transport/http-client.js";

export type LeaderboardType = "mmr" | "weekly" | "win-streak" | "sportsmanship";

export interface LeaderboardEntry {
  rank: number;
  gameProfileId: string;
  displayName: string | null;
  value: number;
}

export interface LeaderboardResponse {
  type: LeaderboardType;
  entries: LeaderboardEntry[];
  playerRank: number | null;
  playerEntry: LeaderboardEntry | null;
}

export async function fetchLeaderboard(
  gameSlug: string,
  type: LeaderboardType,
  gameProfileId?: string,
  limit: number = 50,
): Promise<LeaderboardResponse> {
  const params = new URLSearchParams();
  if (gameProfileId) params.set("gameProfileId", gameProfileId);
  if (limit !== 50) params.set("limit", String(limit));

  const qs = params.toString();
  const url = `${getApiOrigin()}/v1/leaderboards/${gameSlug}/${type}${qs ? `?${qs}` : ""}`;
  return requestJson<LeaderboardResponse>(url, undefined, "Failed to load leaderboard");
}
