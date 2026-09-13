import {
  MatchSessionSchema,
  MatchResolutionSchema,
  type MatchSession,
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
  session: MatchSession | null;
  matchResolution: MatchResolution | null;
  error: string | null;
}

interface FetchSharedSimulatorRouteDataInput {
  request: Request;
  env?: RuntimeApiEnv;
  fetcher?: typeof fetch;
  onSetCookie?: (cookie: string) => void;
}

interface FetchSharedSimulatorRouteDataForRouteInput extends FetchSharedSimulatorRouteDataInput {
  route: SharedSimulatorRouteParams;
}

const EMPTY_ROUTE_DATA: SharedSimulatorRouteData = {
  gameSlug: null,
  routeKind: "other",
  session: null,
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
  onSetCookie,
}: FetchSharedSimulatorRouteDataInput): Promise<SharedSimulatorRouteData> {
  const route = parseSharedSimulatorRoute(new URL(request.url));
  return fetchSharedSimulatorRouteDataForRoute({ request, route, env, fetcher, onSetCookie });
}

export async function fetchSharedSimulatorRouteDataForRoute({
  request,
  route,
  env,
  fetcher = fetch,
  onSetCookie,
}: FetchSharedSimulatorRouteDataForRouteInput): Promise<SharedSimulatorRouteData> {
  if (!route.gameSlug) {
    return EMPTY_ROUTE_DATA;
  }

  const base: SharedSimulatorRouteData = {
    ...route,
    session: null,
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
          )}/session`,
          env,
        ),
        { headers: forwardedRequestHeaders(request) },
      );
      for (const cookie of response.headers.getSetCookie()) onSetCookie?.(cookie);
      if (!response.ok) {
        return { ...base, error: matchRequestErrorMessage(response.status) };
      }
      const session = MatchSessionSchema.parse(await response.json());
      return { ...base, session };
    }

    if (route.routeKind === "match-landing" && route.matchId) {
      const response = await fetcher(
        playUrl(route.gameSlug, `/matches/${encodeURIComponent(route.matchId)}`, env),
        { headers: forwardedRequestHeaders(request) },
      );
      if (!response.ok) {
        return { ...base, error: matchRequestErrorMessage(response.status) };
      }
      return {
        ...base,
        matchResolution: MatchResolutionSchema.parse(await response.json()),
      };
    }
  } catch (error) {
    // Deliberately omit request headers, query strings and schema values.
    console.error("[simulator-route] bootstrap failed", {
      gameSlug: route.gameSlug,
      routeKind: route.routeKind,
      matchId: route.matchId,
      gameId: route.gameId,
      cause: error instanceof Error ? error.name : "UnknownError",
    });
    return {
      ...base,
      error: matchRequestErrorMessage(),
    };
  }

  return base;
}

function matchRequestErrorMessage(status?: number): string {
  if (status === 404 || status === 410) {
    // A 404 also protects private matches. Do not claim a confirmed expiry or
    // result when the API cannot distinguish absence from restricted access.
    return "This match may have expired after inactivity, ended, or no longer be accessible to you. You can return to matchmaking to start another match.";
  }
  if (status === 401 || status === 403) {
    return "You don't have access to this match. Check that you're signed in with the account you used to join, then try again.";
  }
  return "We couldn't load this match right now. Please try again in a moment.";
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
