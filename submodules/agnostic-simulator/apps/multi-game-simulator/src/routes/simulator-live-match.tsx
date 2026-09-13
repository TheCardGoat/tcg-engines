import { makeSimulatorRouteLoader, SimulatorRouteModule } from "./simulator-route-module";
import type { ClientLoaderFunctionArgs } from "react-router";
import { initRootSocket, destroyRootSocket } from "../lib/gateway/root-socket";
import { sessionGameId } from "@tcg/game-page-contract";
import { isPlayableGameSlug } from "@tcg/protocol";

export const loader = makeSimulatorRouteLoader("live-match");

export async function clientLoader({ serverLoader }: ClientLoaderFunctionArgs) {
  const data = await serverLoader<typeof loader>().catch((error: unknown) => {
    destroyRootSocket();
    throw error;
  });
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

export default function SimulatorLiveMatchRoute() {
  return <SimulatorRouteModule routeKind="live-match" />;
}
