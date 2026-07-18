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
  formatId?: string;
  mode?: "1" | "3";
  seasonId?: string | null;
  entries: LeaderboardEntry[];
  playerRank: number | null;
  playerEntry: LeaderboardEntry | null;
}

export async function fetchLeaderboard(
  gameSlug: string,
  type: LeaderboardType,
  gameProfileId?: string,
  limit: number = 50,
  partition?: { formatId: string; mode: "1" | "3"; seasonId?: string },
): Promise<LeaderboardResponse> {
  if (gameSlug === "lorcana" && type === "mmr" && !partition) {
    throw new Error("Lorcana MMR requires a format and best-of mode");
  }
  const params = new URLSearchParams();
  if (gameProfileId) params.set("gameProfileId", gameProfileId);
  if (limit !== 50) params.set("limit", String(limit));
  if (partition) {
    params.set("formatId", partition.formatId);
    params.set("mode", partition.mode);
    if (partition.seasonId) params.set("seasonId", partition.seasonId);
  }

  const qs = params.toString();
  const url = `${getApiOrigin()}/v1/leaderboards/${gameSlug}/${type}${qs ? `?${qs}` : ""}`;
  return requestJson<LeaderboardResponse>(url, undefined, "Failed to load leaderboard");
}
