import { getApiOrigin } from "$lib/config/public-url-config.js";
import { requestJson } from "$lib/data/transport/http-client.js";
import type { LiveMatchListResponse } from "./live-matches-api.js";
import type { QueueStatsResponse } from "./queue-stats-api.js";
import type { MatchmakingStatusResponse } from "./matchmaking-api.js";
import type { LobbyRoomResponse } from "./lobby-api.js";

export interface MatchmakingDashboardResponse {
  object: "matchmaking_dashboard";
  queueStats: QueueStatsResponse;
  liveMatches: LiveMatchListResponse;
  activeMatchId: string | null;
  matchmakingStatus: MatchmakingStatusResponse | null;
  lobbyRoom: LobbyRoomResponse | null;
}

export async function fetchMatchmakingDashboard(limit = 25): Promise<MatchmakingDashboardResponse> {
  const url = new URL(`${getApiOrigin()}/v1/games/lorcana/play/matchmaking/dashboard`);
  url.searchParams.set("limit", String(limit));

  return requestJson<MatchmakingDashboardResponse>(
    url.toString(),
    undefined,
    "Failed to fetch matchmaking dashboard",
  );
}
