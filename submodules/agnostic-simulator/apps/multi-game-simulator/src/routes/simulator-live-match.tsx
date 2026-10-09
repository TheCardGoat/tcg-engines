import { makeSimulatorRouteLoader, SimulatorRouteModule } from "./simulator-route-module";
import { useParams, type ClientLoaderFunctionArgs } from "react-router";
import { initRootSocket, destroyRootSocket } from "../lib/gateway/root-socket";
import { logDebugPayload } from "../lib/debug-logging";
import { sessionGameId } from "@tcg/game-page-contract";
import { isPlayableGameSlug } from "@tcg/protocol";
import { CyberpunkMatchLoading } from "./CyberpunkMatchLoading";
import { SimulatorRouteStatus } from "@tcg/simulator-ui";

export const loader = makeSimulatorRouteLoader("live-match");

export async function clientLoader({ serverLoader }: ClientLoaderFunctionArgs) {
  const data = await serverLoader<typeof loader>().catch((error: unknown) => {
    destroyRootSocket();
    throw error;
  });
  logDebugPayload("[simulator:ssr] live-match loader payload", data);
  const session = data.session;
  if (session?.realtime && data.gameSlug && isPlayableGameSlug(data.gameSlug)) {
    initRootSocket({
      session: null,
      gameSlug: data.gameSlug,
      ticket: session.realtime.ticket,
      expiresAt: session.realtime.expiresAt,
      authToken: session.realtime.reconnectToken,
      requireAuth: true,
      matchId: session.match.matchId,
      gameId: sessionGameId(session),
      playerId: session.viewer.role === "player" ? session.viewer.actorId : undefined,
    });
  } else destroyRootSocket();
  return data;
}
clientLoader.hydrate = true as const;

export function HydrateFallback() {
  const { gameSlug } = useParams();
  return gameSlug === "cyberpunk" ? (
    <CyberpunkMatchLoading />
  ) : (
    <SimulatorRouteStatus title="Loading match" message="Connecting to the match server." />
  );
}

export default function SimulatorLiveMatchRoute() {
  return <SimulatorRouteModule routeKind="live-match" />;
}
