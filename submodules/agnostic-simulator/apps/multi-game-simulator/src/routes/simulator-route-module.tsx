import { lazy, Suspense, type ReactNode } from "react";
import { MatchSessionRecovery } from "../simulator/MatchSessionRecovery";
import { Alert, Button } from "@mantine/core";
import { MatchSessionProvider, useMatchSession } from "../simulator/MatchSessionProvider";
import { Link, useLoaderData, useLocation, useRouteLoaderData } from "react-router";
import { SimulatorViewportSidebarToolsProvider } from "@tcg/simulator-ui";
import type { loader as rootLoader } from "../root";
import { type SharedSimulatorRouteData, type SimulatorRouteKind } from "../simulator/routeData";
import { resolveSimulatorRoute } from "../simulator/routeRegistry";
import { SimulatorProviders } from "../simulator/providers";
import { SimulatorDebugExportControl } from "../simulator/debug-export/SimulatorDebugExportControl";
import { SimulatorDebugExportProvider } from "../simulator/debug-export/SimulatorDebugExportContext";
import { MatchUnavailable } from "./MatchUnavailable";

export { buildSimulatorRouteParams, makeSimulatorRouteLoader } from "./simulator-route-loader";

type RootRouteData = Awaited<ReturnType<typeof rootLoader>> & { rootSocketReady?: boolean };

const CyberpunkServerAuthSessionHydrator = lazy(async () => {
  const module = await import("../games/cyberpunk/auth/ServerAuthSessionHydrator");
  return { default: module.ServerAuthSessionHydrator };
});

export interface SimulatorRouteModuleProps {
  routeKind: SimulatorRouteKind;
}

export function SimulatorRouteModule({ routeKind }: SimulatorRouteModuleProps) {
  const routeData = useLoaderData<SharedSimulatorRouteData>();
  return (
    <MatchSessionProvider
      key={`${routeData.gameSlug}:${routeData.matchId}:${routeData.gameId}`}
      initial={routeData.session}
      gameSlug={routeData.gameSlug}
    >
      <SessionRouteModule routeKind={routeKind} />
    </MatchSessionProvider>
  );
}

function SessionRouteModule({ routeKind }: SimulatorRouteModuleProps) {
  const rootData = useRouteLoaderData<typeof rootLoader>("root") as RootRouteData | undefined;
  const routeData = useLoaderData<SharedSimulatorRouteData>();
  const { session, error: sessionError, refresh } = useMatchSession();
  const location = useLocation();
  if (
    routeData.gameSlug &&
    routeData.error &&
    (routeKind === "live-match" || routeKind === "match-landing")
  ) {
    return <MatchUnavailable gameSlug={routeData.gameSlug} message={routeData.error} />;
  }
  const auth = rootData?.auth ?? null;
  const resolved = resolveSimulatorRoute(routeData?.gameSlug ?? null, routeKind);

  if (!resolved) {
    return <UnsupportedSimulatorRoute routeData={routeData ?? null} routeKind={routeKind} />;
  }

  const { Providers, Page } = resolved;

  return (
    <GameAuthSessionHydrator auth={auth} gameSlug={routeData.gameSlug}>
      <SimulatorProviders
        auth={auth}
        gameSlug={rootData?.gameSlug ?? null}
        gatewayTicket={
          session?.realtime
            ? { ticket: session.realtime.ticket, authToken: session.realtime.reconnectToken }
            : (rootData?.gatewayTicket ?? null)
        }
        rootSocketReady={Boolean(session?.realtime) || rootData?.rootSocketReady === true}
        simulatorRouteData={{ ...routeData, session }}
        simulatorSettings={rootData?.simulatorSettings ?? null}
        viewerSettings={rootData?.viewerSettings ?? null}
      >
        <Providers>
          <SimulatorDebugExportProvider>
            <SimulatorViewportSidebarToolsProvider
              tools={
                rootData?.debugExportEnabled === true && debugExportRoute(routeKind) ? (
                  <SimulatorDebugExportControl />
                ) : null
              }
            >
              <Page />
              {session?.phase === "finished" &&
              session.match.currentGameId &&
              session.match.currentGameId !== session.game.gameId ? (
                <Alert
                  title="Next game ready"
                  style={{ position: "fixed", bottom: 16, left: 16, zIndex: 1000 }}
                >
                  <Button
                    component={Link}
                    to={`/${routeData.gameSlug}/simulator/matches/${encodeURIComponent(session.match.matchId)}/games/${encodeURIComponent(session.match.currentGameId)}${location.search}`}
                  >
                    Continue to next game
                  </Button>
                </Alert>
              ) : null}
              {session?.phase === "starting" ? (
                <Alert
                  title="Waiting for the match"
                  style={{ position: "fixed", bottom: 16, right: 16, maxWidth: 360, zIndex: 1000 }}
                >
                  <MatchSessionRecovery />
                </Alert>
              ) : null}
              {sessionError && session?.phase !== "starting" && session?.phase !== "preparation" ? (
                <Alert
                  role="alert"
                  title="Match synchronization interrupted"
                  style={{ position: "fixed", bottom: 16, right: 16, maxWidth: 360, zIndex: 1000 }}
                >
                  {sessionError}
                  <Button size="xs" onClick={() => void refresh()}>
                    Retry
                  </Button>
                </Alert>
              ) : null}
            </SimulatorViewportSidebarToolsProvider>
          </SimulatorDebugExportProvider>
        </Providers>
      </SimulatorProviders>
    </GameAuthSessionHydrator>
  );
}

function debugExportRoute(routeKind: SimulatorRouteKind): boolean {
  return (
    routeKind === "live-match" ||
    routeKind === "replay" ||
    routeKind === "play-practice" ||
    routeKind === "practice-vs-ai" ||
    routeKind === "practice-match" ||
    routeKind === "vs-ai"
  );
}

function GameAuthSessionHydrator({
  auth,
  children,
  gameSlug,
}: {
  auth: RootRouteData["auth"];
  children: ReactNode;
  gameSlug: SharedSimulatorRouteData["gameSlug"];
}) {
  if (gameSlug !== "cyberpunk") return children;

  return (
    <Suspense fallback={null}>
      <CyberpunkServerAuthSessionHydrator auth={auth}>
        {children}
      </CyberpunkServerAuthSessionHydrator>
    </Suspense>
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
