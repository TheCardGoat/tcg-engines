import { Navigate, type RouteObject } from "react-router-dom";
import { createSimulatorBrowserRouter, SimulatorRouterProvider } from "../../lib/router.tsx";
import { BotBenchUiPage } from "./pages/BotBenchUi.page";
import { BotVsBotPage } from "./pages/BotVsBot.page";
import { GundamFixtureIndexPage } from "./pages/FixtureRoutes.page";
import { LiveMatchLandingPage } from "./pages/LiveMatchLanding.page";
import { LiveMatchPage } from "./pages/LiveMatch.page";
import { PracticePage } from "./pages/Practice.page";
import { ReplayPage } from "./pages/Replay.page";
import { ReplayForkPage } from "./pages/ReplayFork.page";
import { GundamTestStatePage } from "./pages/TestState.page";
import { VsAiPage } from "./pages/VsAi.page";

export const gundamSimulatorRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to="/vs-ai" replace />,
  },
  {
    path: "/vs-ai",
    element: <VsAiPage />,
  },
  {
    path: "/tests",
    element: <GundamFixtureIndexPage />,
  },
  {
    path: "/tests/test-engine-state",
    element: <GundamTestStatePage />,
  },
  {
    path: "/practice",
    element: <PracticePage />,
  },
  {
    path: "/play/practice",
    element: <PracticePage />,
  },
  {
    path: "/bot-vs-bot",
    element: <BotVsBotPage />,
  },
  {
    path: "/bot-bench-ui",
    element: <BotBenchUiPage />,
  },
  {
    path: "/match/:matchId",
    element: <LiveMatchPage />,
  },
  {
    path: "/matches/:matchId",
    element: <LiveMatchLandingPage />,
  },
  {
    path: "/matches/:matchId/games/:gameId",
    element: <LiveMatchPage />,
  },
  {
    path: "/replay/:gameId",
    element: <ReplayPage />,
  },
  {
    path: "/replay/:gameId/fork",
    element: <ReplayForkPage />,
  },
];

export function createGundamRouter(basename: string) {
  return createSimulatorBrowserRouter(gundamSimulatorRoutes, basename);
}

export interface RouterProps {
  basename?: string;
}

export function Router({ basename = "/gundam/simulator" }: RouterProps) {
  return <SimulatorRouterProvider basename={basename} routes={gundamSimulatorRoutes} />;
}
