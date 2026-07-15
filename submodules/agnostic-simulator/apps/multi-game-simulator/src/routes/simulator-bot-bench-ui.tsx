import { makeSimulatorRouteLoader, SimulatorRouteModule } from "./simulator-route-module";

export const loader = makeSimulatorRouteLoader("bot-bench-ui");

export default function SimulatorBotBenchUiRoute() {
  return <SimulatorRouteModule routeKind="bot-bench-ui" />;
}
