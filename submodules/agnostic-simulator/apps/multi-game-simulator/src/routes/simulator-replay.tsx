import { makeSimulatorRouteLoader, SimulatorRouteModule } from "./simulator-route-module";

export const loader = makeSimulatorRouteLoader("replay");

export default function SimulatorReplayRoute() {
  return <SimulatorRouteModule routeKind="replay" />;
}
