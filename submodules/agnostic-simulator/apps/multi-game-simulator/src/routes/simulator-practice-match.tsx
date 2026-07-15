import { makeSimulatorRouteLoader, SimulatorRouteModule } from "./simulator-route-module";

export const loader = makeSimulatorRouteLoader("practice-match");

export default function SimulatorPracticeMatchRoute() {
  return <SimulatorRouteModule routeKind="practice-match" />;
}
