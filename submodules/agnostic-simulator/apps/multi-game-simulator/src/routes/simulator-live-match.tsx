import { makeSimulatorRouteLoader, SimulatorRouteModule } from "./simulator-route-module";

export const loader = makeSimulatorRouteLoader("live-match");

export default function SimulatorLiveMatchRoute() {
  return <SimulatorRouteModule routeKind="live-match" />;
}
