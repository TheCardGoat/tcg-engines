import { makeSimulatorRouteLoader, SimulatorRouteModule } from "./simulator-route-module";
import type { ClientLoaderFunctionArgs } from "react-router";
import { destroyRootSocket } from "../lib/gateway/root-socket";

export const loader = makeSimulatorRouteLoader("match-landing");

export async function clientLoader({ serverLoader }: ClientLoaderFunctionArgs) {
  const data = await serverLoader<typeof loader>().catch((error: unknown) => {
    destroyRootSocket();
    throw error;
  });
  // Successful landings redirect server-side; a returned landing has no live scope.
  destroyRootSocket();
  return data;
}
clientLoader.hydrate = true as const;

export default function SimulatorMatchLandingRoute() {
  return <SimulatorRouteModule routeKind="match-landing" />;
}
