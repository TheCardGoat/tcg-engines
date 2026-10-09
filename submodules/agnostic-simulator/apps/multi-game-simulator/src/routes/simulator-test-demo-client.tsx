import { SimulatorRouteModule } from "./simulator-route-module";

/** Browser-owned demo surface; the server route imports this only after hydration. */
export default function SimulatorTestDemoClient() {
  return <SimulatorRouteModule routeKind="test-demo" />;
}
