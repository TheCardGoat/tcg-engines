import { makeSimulatorRouteLoader, SimulatorRouteModule } from "./simulator-route-module";

export const loader = makeSimulatorRouteLoader("practice-vs-ai");

export default function SimulatorPracticeRoute() {
  return <SimulatorRouteModule routeKind="practice-vs-ai" />;
}
