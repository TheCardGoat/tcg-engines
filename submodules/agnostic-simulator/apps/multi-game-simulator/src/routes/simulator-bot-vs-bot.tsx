import { makeSimulatorRouteLoader, SimulatorRouteModule } from "./simulator-route-module";

export const loader = makeSimulatorRouteLoader("bot-vs-bot");

export default function SimulatorBotVsBotRoute() {
  return <SimulatorRouteModule routeKind="bot-vs-bot" />;
}
