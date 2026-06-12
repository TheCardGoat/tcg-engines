import type { LayoutLoad } from "./$types";

export const ssr = false;

export const load: LayoutLoad = ({ data }) => {
  return {
    matchmakingContext: data.matchmakingContext,
    initialLiveMatches: data.initialLiveMatches,
    initialQueueStats: data.initialQueueStats,
    activeMatchId: data.activeMatchId,
    gatewayTicket: data.gatewayTicket,
    gatewayAuthToken: data.gatewayAuthToken,
    matchmakingStatus: data.matchmakingStatus,
    initialLobbyRoom: data.initialLobbyRoom,
    initialLeaderboards: data.initialLeaderboards,
  };
};
