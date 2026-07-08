import { makeSimulatorRouteLoader, SimulatorRouteModule } from "./simulator-route-module";

export const loader = makeSimulatorRouteLoader("game-index");

export default function SimulatorGameIndexRoute() {
  return <SimulatorRouteModule routeKind="game-index" />;
}
