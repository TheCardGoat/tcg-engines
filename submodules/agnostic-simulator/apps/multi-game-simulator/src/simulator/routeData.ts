import {
  MatchPageDataSchema,
  MatchResolutionSchema,
  type MatchPageData,
  type MatchResolution,
  type Participant,
} from "@tcg/game-page-contract";
import type { GameSlug } from "@tcg/simulator-contract";

import { playUrl, type RuntimeApiEnv } from "../runtime/gameRuntimeApi";
import { isGameSlug } from "./games";

export type SimulatorRouteKind =
  | "game-index"
  | "play-practice"
  | "practice-vs-ai"
  | "tests"
  | "test-engine-state"
  | "test-fixture"
  | "match-landing"
  | "live-match"
  | "replay"
  | "replay-fork"
  | "matchmaking"
  | "decks"
  | "deck-detail"
  | "practice-match"
  | "vs-ai"
  | "bot-vs-bot"
  | "bot-bench-ui"
  | "other";

export interface SharedSimulatorRouteParams {
  gameSlug: GameSlug | null;
  routeKind: SimulatorRouteKind;
  matchId?: string;
  gameId?: string;
}

export interface SharedSimulatorRouteData extends SharedSimulatorRouteParams {
  matchPageData: MatchPageData | null;
  matchResolution: MatchResolution | null;
  error: string | null;
}

interface FetchSharedSimulatorRouteDataInput {
  request: Request;
  env?: RuntimeApiEnv;
  fetcher?: typeof fetch;
}

interface FetchSharedSimulatorRouteDataForRouteInput extends FetchSharedSimulatorRouteDataInput {
  route: SharedSimulatorRouteParams;
}

const EMPTY_ROUTE_DATA: SharedSimulatorRouteData = {
  gameSlug: null,
  routeKind: "other",
  matchPageData: null,
  matchResolution: null,
  error: null,
};

export function parseSharedSimulatorRoute(url: URL): SharedSimulatorRouteParams {
  const segments = url.pathname.split("/").filter(Boolean).map(decodePathSegment);
  const [gameSegment, simulatorSegment, first, second, third, fourth] = segments;

  if (!gameSegment || !isGameSlug(gameSegment) || simulatorSegment !== "simulator") {
    return { gameSlug: null, routeKind: "other" };
  }

  if (!first) {
    return { gameSlug: gameSegment, routeKind: "game-index" };
  }

  if (first === "play" && second === "practice") {
    return { gameSlug: gameSegment, routeKind: "play-practice" };
  }

  if (first === "practice") {
    return { gameSlug: gameSegment, routeKind: "practice-vs-ai" };
  }

  if (first === "matches" && second && third === "games" && fourth) {
    return {
      gameSlug: gameSegment,
      routeKind: "live-match",
      matchId: second,
      gameId: fourth,
    };
  }

  if (first === "matches" && second) {
    return {
      gameSlug: gameSegment,
      routeKind: "match-landing",
      matchId: second,
    };
  }

  const legacyGameId = url.searchParams.get("gameId") ?? undefined;
  if (first === "match" && second) {
    return {
      gameSlug: gameSegment,
      routeKind: legacyGameId ? "live-match" : "match-landing",
      matchId: second,
      gameId: legacyGameId,
    };
  }

  return { gameSlug: gameSegment, routeKind: "other" };
}

export async function fetchSharedSimulatorRouteData({
  request,
  env,
  fetcher = fetch,
}: FetchSharedSimulatorRouteDataInput): Promise<SharedSimulatorRouteData> {
  const route = parseSharedSimulatorRoute(new URL(request.url));
  return fetchSharedSimulatorRouteDataForRoute({ request, route, env, fetcher });
}

export async function fetchSharedSimulatorRouteDataForRoute({
  request,
  route,
  env,
  fetcher = fetch,
}: FetchSharedSimulatorRouteDataForRouteInput): Promise<SharedSimulatorRouteData> {
  if (!route.gameSlug) {
    return EMPTY_ROUTE_DATA;
  }

  const base: SharedSimulatorRouteData = {
    ...route,
    matchPageData: null,
    matchResolution: null,
    error: null,
  };

  try {
    if (route.routeKind === "live-match" && route.matchId && route.gameId) {
      const response = await fetcher(
        playUrl(
          route.gameSlug,
          `/matches/${encodeURIComponent(route.matchId)}/games/${encodeURIComponent(
            route.gameId,
          )}/context`,
          env,
        ),
        { headers: forwardedRequestHeaders(request) },
      );
      if (!response.ok) {
        return { ...base, error: `Match context request failed with HTTP ${response.status}.` };
      }
      return {
        ...base,
        matchPageData: MatchPageDataSchema.parse(await response.json()),
      };
    }

    if (route.routeKind === "match-landing" && route.matchId) {
      const response = await fetcher(
        playUrl(route.gameSlug, `/matches/${encodeURIComponent(route.matchId)}`, env),
        { headers: forwardedRequestHeaders(request) },
      );
      if (!response.ok) {
        return { ...base, error: `Match metadata request failed with HTTP ${response.status}.` };
      }
      return {
        ...base,
        matchResolution: MatchResolutionSchema.parse(await response.json()),
      };
    }
  } catch (error) {
    return {
      ...base,
      error: error instanceof Error ? error.message : "Shared simulator route data failed to load.",
    };
  }

  return base;
}

export function participantIsPremium(participant: Participant | null | undefined): boolean {
  if (!participant) {
    return false;
  }
  if (typeof participant.isPremium === "boolean") {
    return participant.isPremium;
  }
  return Boolean(participant.subscriptionTier && participant.subscriptionTier !== "free");
}

function forwardedRequestHeaders(request: Request): Headers {
  const headers = new Headers();
  const cookie = request.headers.get("cookie");
  const authorization = request.headers.get("authorization");
  if (cookie) {
    headers.set("cookie", cookie);
  }
  if (authorization) {
    headers.set("authorization", authorization);
  }
  return headers;
}

function decodePathSegment(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}
