import { makeSimulatorRouteLoader, SimulatorRouteModule } from "./simulator-route-module";

export const loader = makeSimulatorRouteLoader("play-practice");

export default function SimulatorPracticeVsAiRoute() {
  return <SimulatorRouteModule routeKind="play-practice" />;
}
