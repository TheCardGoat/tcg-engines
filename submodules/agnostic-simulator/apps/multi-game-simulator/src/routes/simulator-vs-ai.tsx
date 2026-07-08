import { makeSimulatorRouteLoader, SimulatorRouteModule } from "./simulator-route-module";

export const loader = makeSimulatorRouteLoader("vs-ai");

export default function SimulatorVsAiRoute() {
  return <SimulatorRouteModule routeKind="vs-ai" />;
}
