import { getApiOrigin } from "$lib/config/public-url-config.js";
import { getServerApiOrigin } from "$lib/server/fetch-with-cf.js";
import { serverJsonOrNull } from "$lib/data/server/server-json.js";
import type { MatchmakingContext } from "$lib/features/matchmaking/api/player-context-api.js";
import type { MatchmakingDashboardResponse } from "$lib/features/matchmaking/api/matchmaking-dashboard-api.js";
import type {
  LeaderboardResponse,
  LeaderboardType,
} from "$lib/features/matchmaking/api/leaderboard-api.js";

export interface GatewayAuthData {
  ticket: string;
  authToken: string;
}

const LEADERBOARD_TYPES: LeaderboardType[] = ["mmr", "weekly", "win-streak", "sportsmanship"];

export async function loadMatchmakingData(request: Request) {
  const cookie = request.headers.get("cookie");
  const apiOrigin = getServerApiOrigin(getApiOrigin());

  const [matchmakingContextResult, dashboardResult, gatewayAuthResult, leaderboardsResult] =
    await Promise.allSettled([
      cookie
        ? serverJsonOrNull<MatchmakingContext>(
            `${apiOrigin}/v1/users/me/games/lorcana/matchmaking-context`,
            { headers: { cookie } },
          )
        : Promise.resolve(null),
      serverJsonOrNull<MatchmakingDashboardResponse>(
        `${apiOrigin}/v1/games/lorcana/play/matchmaking/dashboard?limit=25`,
        cookie ? { headers: { cookie } } : {},
      ),
      cookie
        ? serverJsonOrNull<{ ticket: string; authToken: string }>(
            `${apiOrigin}/v1/gateway/ticket`,
            {
              method: "POST",
              headers: { cookie },
            },
          )
        : Promise.resolve(null),
      fetchLeaderboardsOnServer(apiOrigin),
    ]);

  const matchmakingContext: MatchmakingContext | null =
    matchmakingContextResult.status === "fulfilled" ? matchmakingContextResult.value : null;

  const initialDashboard = dashboardResult.status === "fulfilled" ? dashboardResult.value : null;
  const gatewayAuth = gatewayAuthResult.status === "fulfilled" ? gatewayAuthResult.value : null;
  const initialLeaderboards =
    leaderboardsResult.status === "fulfilled" ? leaderboardsResult.value : null;

  return {
    matchmakingContext,
    initialLiveMatches: initialDashboard?.liveMatches ?? null,
    initialQueueStats: initialDashboard?.queueStats ?? null,
    activeMatchId: initialDashboard?.activeMatchId ?? null,
    gatewayTicket: gatewayAuth?.ticket ?? null,
    gatewayAuthToken: gatewayAuth?.authToken ?? null,
    matchmakingStatus: initialDashboard?.matchmakingStatus ?? null,
    initialLobbyRoom: initialDashboard?.lobbyRoom ?? null,
    initialLeaderboards,
  };
}

async function fetchLeaderboardsOnServer(apiOrigin: string): Promise<LeaderboardResponse[]> {
  const results = await Promise.allSettled(
    LEADERBOARD_TYPES.map(async (type) => {
      const data = await serverJsonOrNull<LeaderboardResponse>(
        `${apiOrigin}/v1/leaderboards/lorcana/${type}?limit=10`,
      );
      if (!data) return null;
      return { ...data, type };
    }),
  );

  const leaderboards: LeaderboardResponse[] = [];
  for (const result of results) {
    if (result.status === "fulfilled" && result.value && result.value.entries.length > 0) {
      leaderboards.push(result.value);
    }
  }
  return leaderboards;
}
