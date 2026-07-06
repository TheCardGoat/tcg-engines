import { makeSimulatorRouteLoader, SimulatorRouteModule } from "./simulator-route-module";

export const loader = makeSimulatorRouteLoader("tests");

export default function SimulatorTestsRoute() {
  return <SimulatorRouteModule routeKind="tests" />;
}
