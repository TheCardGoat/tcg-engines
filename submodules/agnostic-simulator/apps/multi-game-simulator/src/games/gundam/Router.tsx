import { useMemo } from "react";
import { Navigate, createBrowserRouter, RouterProvider, type RouteObject } from "react-router-dom";
import { normalizeRouterBasename } from "../../router-paths";
import { BotBenchUiPage } from "./pages/BotBenchUi.page";
import { BotVsBotPage } from "./pages/BotVsBot.page";
import { LiveMatchPage } from "./pages/LiveMatch.page";
import { PracticePage } from "./pages/Practice.page";
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
    path: "/practice",
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
];

export function createGundamRouter(basename: string) {
  return createBrowserRouter(gundamSimulatorRoutes, {
    basename: normalizeRouterBasename(basename),
  });
}

export interface RouterProps {
  basename?: string;
}

export function Router({ basename = "/gundam/simulator" }: RouterProps) {
  const router = useMemo(() => createGundamRouter(basename), [basename]);
  return <RouterProvider router={router} />;
}
