import { makeSimulatorRouteLoader, SimulatorRouteModule } from "./simulator-route-module";

export const loader = makeSimulatorRouteLoader("matchmaking");

export default function SimulatorMatchmakingRoute() {
  return <SimulatorRouteModule routeKind="matchmaking" />;
}
