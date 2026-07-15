import { type RouteObject } from "react-router-dom";
import { TestsPage, HomePage } from "./pages/Tests.page";
import { TestFixturePage } from "./pages/TestFixture.page";
import { CyberpunkTestStatePage } from "./pages/TestState.page";
import { PracticePage } from "./pages/Practice.page";
import { PracticeMatchPage } from "./pages/PracticeMatch.page";
import { MatchmakingPage } from "./pages/Matchmaking.page";
import { DeckDetailPage, DecksPage } from "./pages/Decks.page";
import { WebviewPracticePage } from "./pages/WebviewPractice.page";
import { LiveMatchPage } from "./pages/LiveMatch.page";
import { LiveMatchLandingPage } from "./pages/LiveMatchLanding.page";
import { ReplayPage } from "./pages/Replay.page";
import { ReplayForkPage } from "./pages/ReplayFork.page";
import { createSimulatorBrowserRouter, SimulatorRouterProvider } from "../../lib/router.tsx";

export const cyberpunkSimulatorRoutes: RouteObject[] = [
  // Root home — fixture chooser.
  {
    path: "/",
    element: <HomePage />,
  },
  // Dev-only fixture hub. Same listing, different framing. Mirrors the
  // lorcana-simulator's /tests/[fixtureId] pattern.
  {
    path: "/tests",
    element: <TestsPage />,
  },
  {
    path: "/tests/test-engine-state",
    element: <CyberpunkTestStatePage />,
  },
  {
    path: "/tests/:fixtureId",
    element: <TestFixturePage />,
  },
  {
    path: "/practice",
    element: <PracticePage />,
  },
  {
    path: "/matchmaking",
    element: <MatchmakingPage />,
  },
  {
    path: "/practice/:matchId",
    element: <PracticeMatchPage />,
  },
  {
    path: "/play/practice",
    element: <WebviewPracticePage />,
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
  {
    path: "/matches/:matchId",
    element: <LiveMatchLandingPage />,
  },
  {
    path: "/decks",
    element: <DecksPage />,
  },
  {
    path: "/decks/:deckId",
    element: <DeckDetailPage />,
  },
];

export function createCyberpunkRouter(basename: string) {
  return createSimulatorBrowserRouter(cyberpunkSimulatorRoutes, basename);
}

export interface RouterProps {
  basename?: string;
}

export function Router({ basename = import.meta.env.BASE_URL }: RouterProps) {
  return <SimulatorRouterProvider basename={basename} routes={cyberpunkSimulatorRoutes} />;
}
