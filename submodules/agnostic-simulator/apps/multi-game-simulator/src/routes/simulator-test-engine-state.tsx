import { makeSimulatorRouteLoader, SimulatorRouteModule } from "./simulator-route-module";

export const loader = makeSimulatorRouteLoader("test-engine-state");

export default function SimulatorTestEngineStateRoute() {
  return <SimulatorRouteModule routeKind="test-engine-state" />;
}
