import { makeSimulatorRouteLoader, SimulatorRouteModule } from "./simulator-route-module";

export const loader = makeSimulatorRouteLoader("match-landing");

export default function SimulatorMatchLandingRoute() {
  return <SimulatorRouteModule routeKind="match-landing" />;
}
