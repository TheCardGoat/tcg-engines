import type { LoaderFunctionArgs, Params } from "react-router";
import { data as routeResponse, redirect } from "react-router";

import { runtimeApiEnvForServer } from "../runtime/gameRuntimeApi";
import { isGameSlug } from "../simulator/games";
import {
  fetchSharedSimulatorRouteDataForRoute,
  type SharedSimulatorRouteParams,
  type SimulatorRouteKind,
} from "../simulator/routeData";

/**
 * Server-safe loader boundary for simulator routes.
 *
 * Keep game pages and the route registry out of this module. Test-fixture
 * routes import it during SSR, then load the selected game surface in the
 * browser after hydration.
 */
export function makeSimulatorRouteLoader(routeKind: SimulatorRouteKind) {
  return async function simulatorRouteLoader({ request, params }: LoaderFunctionArgs) {
    const route = buildSimulatorRouteParams(routeKind, params);
    const headers = new Headers();
    const data = await fetchSharedSimulatorRouteDataForRoute({
      request,
      route,
      env: runtimeApiEnvForServer(process.env),
      onSetCookie: (cookie) => headers.append("Set-Cookie", cookie),
    });
    if (
      routeKind === "match-landing" &&
      route.gameSlug &&
      route.matchId &&
      data.matchResolution?.currentGameId
    ) {
      const url = new URL(request.url);
      url.pathname = `/${route.gameSlug}/simulator/matches/${encodeURIComponent(route.matchId)}/games/${encodeURIComponent(data.matchResolution.currentGameId)}`;
      throw redirect(url.pathname + url.search);
    }
    return routeResponse(data, { headers });
  };
}

export function buildSimulatorRouteParams(
  routeKind: SimulatorRouteKind,
  params: Params,
): SharedSimulatorRouteParams {
  const rawGameSlug = params.gameSlug;
  const gameSlug = rawGameSlug && isGameSlug(rawGameSlug) ? rawGameSlug : null;
  const route: SharedSimulatorRouteParams = { gameSlug, routeKind };
  if (params.matchId) {
    route.matchId = params.matchId;
  }
  if (params.gameId) {
    route.gameId = params.gameId;
  }
  return route;
}
