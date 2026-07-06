import { makeSimulatorRouteLoader, SimulatorRouteModule } from "./simulator-route-module";

export const loader = makeSimulatorRouteLoader("deck-detail");

export default function SimulatorDeckDetailRoute() {
  return <SimulatorRouteModule routeKind="deck-detail" />;
}
