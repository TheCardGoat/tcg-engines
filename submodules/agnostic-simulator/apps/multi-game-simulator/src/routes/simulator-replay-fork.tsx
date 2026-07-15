import { makeSimulatorRouteLoader, SimulatorRouteModule } from "./simulator-route-module";

export const loader = makeSimulatorRouteLoader("replay-fork");

export default function SimulatorReplayForkRoute() {
  return <SimulatorRouteModule routeKind="replay-fork" />;
}
