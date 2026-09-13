import { SimulatorRouteModule } from "./simulator-route-module";

/** Browser-owned fixture surface; the server route imports this only after hydration. */
export default function SimulatorTestFixtureClient() {
  return <SimulatorRouteModule routeKind="test-fixture" />;
}
