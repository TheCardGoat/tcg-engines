import { getApiOrigin } from "$lib/config/public-url-config.js";
import { requestJson, requestVoid } from "$lib/data/transport/http-client.js";
import type { LeaderboardType } from "./leaderboard-api.js";

export interface Community {
  id: string;
  publicId: string;
  name: string;
  description: string | null;
  visibility: "public" | "private";
  ownerUserId: string;
  memberCount: number;
  isActive: boolean;
  createdAt: string;
}

export interface CommunityLeaderboardEntry {
  rank: number;
  gameProfileId: string;
  displayName: string | null;
  value: number;
}

export interface CommunityLeaderboardResponse {
  communityPublicId: string;
  type: LeaderboardType;
  entries: CommunityLeaderboardEntry[];
  playerRank: number | null;
  playerEntry: CommunityLeaderboardEntry | null;
}

export interface CommunityLeague {
  id: string;
  communityId: string;
  name: string;
  status: "draft" | "active" | "completed" | "archived";
  startsAt: string;
  endsAt: string;
  scoringConfig: {
    winPoints: number;
    drawPoints: number;
    lossPoints: number;
  };
}

export interface CommunityLeagueStanding {
  rank: number;
  gameProfileId: string;
  displayName: string | null;
  played: number;
  wins: number;
  losses: number;
  draws: number;
  points: number;
  winRate: number;
}

export interface CommunityLeagueStandingsResponse {
  league: CommunityLeague;
  standings: CommunityLeagueStanding[];
}

export async function listCommunities(limit: number = 20): Promise<Community[]> {
  const params = new URLSearchParams({ limit: String(limit) });
  return requestJson<Community[]>(`${getApiOrigin()}/v1/communities?${params.toString()}`);
}

export async function getCommunityLeaderboard(params: {
  communityPublicId: string;
  type: LeaderboardType;
  gameSlug?: string;
  gameProfileId?: string | null;
  limit?: number;
}): Promise<CommunityLeaderboardResponse> {
  const query = new URLSearchParams();
  query.set("type", params.type);
  if (params.gameSlug) query.set("gameSlug", params.gameSlug);
  if (params.gameProfileId) query.set("gameProfileId", params.gameProfileId);
  if (params.limit) query.set("limit", String(params.limit));

  return requestJson<CommunityLeaderboardResponse>(
    `${getApiOrigin()}/v1/communities/${params.communityPublicId}/leaderboard?${query.toString()}`,
    undefined,
    "Failed to load community leaderboard",
  );
}

export async function joinCommunity(
  communityPublicId: string,
  gameProfileId: string,
): Promise<{ ok: true; alreadyMember: boolean }> {
  return requestJson<{ ok: true; alreadyMember: boolean }>(
    `${getApiOrigin()}/v1/communities/${communityPublicId}/join`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameProfileId }),
    },
    "Failed to join community",
  );
}

export async function leaveCommunity(
  communityPublicId: string,
  gameProfileId: string,
): Promise<void> {
  await requestVoid(
    `${getApiOrigin()}/v1/communities/${communityPublicId}/leave`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameProfileId }),
    },
    "Failed to leave community",
  );
}

export async function createLeague(params: {
  communityPublicId: string;
  actorGameProfileId: string;
  name: string;
  startsAt: string;
  endsAt: string;
}): Promise<CommunityLeague> {
  return requestJson<CommunityLeague>(
    `${getApiOrigin()}/v1/communities/${params.communityPublicId}/leagues`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        actorGameProfileId: params.actorGameProfileId,
        name: params.name,
        startsAt: params.startsAt,
        endsAt: params.endsAt,
      }),
    },
    "Failed to create league",
  );
}

export async function enrollInLeague(
  communityPublicId: string,
  leagueId: string,
  gameProfileId: string,
): Promise<void> {
  await requestVoid(
    `${getApiOrigin()}/v1/communities/${communityPublicId}/leagues/${leagueId}/enroll`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameProfileId }),
    },
    "Failed to enroll in league",
  );
}

export async function getLeagueStandings(
  communityPublicId: string,
  leagueId: string,
): Promise<CommunityLeagueStandingsResponse> {
  return requestJson<CommunityLeagueStandingsResponse>(
    `${getApiOrigin()}/v1/communities/${communityPublicId}/leagues/${leagueId}/standings`,
    undefined,
    "Failed to load league standings",
  );
}
