import { makeSimulatorRouteLoader, SimulatorRouteModule } from "./simulator-route-module";

export const loader = makeSimulatorRouteLoader("test-fixture");

export default function SimulatorTestFixtureRoute() {
  return <SimulatorRouteModule routeKind="test-fixture" />;
}
