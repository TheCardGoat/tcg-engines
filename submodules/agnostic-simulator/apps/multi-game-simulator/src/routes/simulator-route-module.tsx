import { useLoaderData, useRouteLoaderData } from "react-router";
import type { LoaderFunctionArgs, Params } from "react-router";
import type { loader as rootLoader } from "../root";
import { ServerAuthSessionHydrator } from "../games/cyberpunk/auth/ServerAuthSessionHydrator";
import { isGameSlug } from "../simulator/games";
import {
  fetchSharedSimulatorRouteDataForRoute,
  type SharedSimulatorRouteData,
  type SharedSimulatorRouteParams,
  type SimulatorRouteKind,
} from "../simulator/routeData";
import { resolveSimulatorRoute } from "../simulator/routeRegistry";
import { SimulatorProviders } from "../simulator/providers";

export type SimulatorRouteParams = Params<
  "gameSlug" | "matchId" | "gameId" | "fixtureId" | "deckId"
>;
type RootRouteData = Awaited<ReturnType<typeof rootLoader>> & { rootSocketReady?: boolean };

export function makeSimulatorRouteLoader(routeKind: SimulatorRouteKind) {
  return async function simulatorRouteLoader({
    request,
    params,
  }: LoaderFunctionArgs): Promise<SharedSimulatorRouteData> {
    const route = buildSimulatorRouteParams(routeKind, params);
    return fetchSharedSimulatorRouteDataForRoute({
      request,
      route,
      env: process.env,
    });
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

export interface SimulatorRouteModuleProps {
  routeKind: SimulatorRouteKind;
}

export function SimulatorRouteModule({ routeKind }: SimulatorRouteModuleProps) {
  const rootData = useRouteLoaderData<typeof rootLoader>("root") as RootRouteData | undefined;
  const routeData = useLoaderData<SharedSimulatorRouteData>();
  const auth = rootData?.auth ?? null;
  const resolved = resolveSimulatorRoute(routeData?.gameSlug ?? null, routeKind);

  if (!resolved) {
    return <UnsupportedSimulatorRoute routeData={routeData ?? null} routeKind={routeKind} />;
  }

  const { Providers, Page } = resolved;

  return (
    <ServerAuthSessionHydrator auth={auth}>
      <SimulatorProviders
        auth={auth}
        gameSlug={rootData?.gameSlug ?? null}
        gatewayTicket={rootData?.gatewayTicket ?? null}
        rootSocketReady={rootData?.rootSocketReady === true}
        simulatorRouteData={routeData ?? null}
        simulatorSettings={rootData?.simulatorSettings ?? null}
        viewerSettings={rootData?.viewerSettings ?? null}
      >
        <Providers>
          <Page />
        </Providers>
      </SimulatorProviders>
    </ServerAuthSessionHydrator>
  );
}

function UnsupportedSimulatorRoute({
  routeData,
  routeKind,
}: {
  routeData: SharedSimulatorRouteData | null;
  routeKind: SimulatorRouteKind;
}) {
  const gameSlug = routeData?.gameSlug ?? "unknown";
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-[1200px] items-center justify-center p-6">
      <div className="text-center">
        <p className="text-2xl font-extrabold text-[var(--text)]">Route not supported</p>
        <p className="mt-2 text-[var(--muted)]">
          {gameSlug} does not support the {routeKind} simulator route.
        </p>
        <a
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[var(--game-accent)] px-4 py-2 text-sm font-semibold text-white"
        >
          Back to index
        </a>
      </div>
    </main>
  );
}
