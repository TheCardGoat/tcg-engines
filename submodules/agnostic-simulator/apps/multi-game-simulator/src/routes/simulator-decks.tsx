import { makeSimulatorRouteLoader, SimulatorRouteModule } from "./simulator-route-module";

export const loader = makeSimulatorRouteLoader("decks");

export default function SimulatorDecksRoute() {
  return <SimulatorRouteModule routeKind="decks" />;
}
