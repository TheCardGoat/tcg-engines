import { Suspense, lazy, type ComponentType, type ReactNode } from "react";
import type { GameSlug } from "@tcg/simulator-contract";

import { CyberpunkSimulatorProviders } from "../games/cyberpunk/App";
import { DeckDetailPage, DecksPage } from "../games/cyberpunk/pages/Decks.page";
import { LiveMatchPage as CyberpunkLiveMatchPage } from "../games/cyberpunk/pages/LiveMatch.page";
import { LiveMatchLandingPage } from "../games/cyberpunk/pages/LiveMatchLanding.page";
import { MatchmakingPage } from "../games/cyberpunk/pages/Matchmaking.page";
import { PracticeMatchPage } from "../games/cyberpunk/pages/PracticeMatch.page";
import { PracticePage as CyberpunkPracticePage } from "../games/cyberpunk/pages/Practice.page";
import { ReplayPage } from "../games/cyberpunk/pages/Replay.page";
import { ReplayForkPage } from "../games/cyberpunk/pages/ReplayFork.page";
import { TestFixturePage as CyberpunkTestFixturePage } from "../games/cyberpunk/pages/TestFixture.page";
import { CyberpunkTestStatePage } from "../games/cyberpunk/pages/TestState.page";
import { HomePage as CyberpunkHomePage, TestsPage } from "../games/cyberpunk/pages/Tests.page";
import { WebviewPracticePage } from "../games/cyberpunk/pages/WebviewPractice.page";
import { GundamSimulatorProviders } from "../games/gundam/App";
import { BotBenchUiPage } from "../games/gundam/pages/BotBenchUi.page";
import { BotVsBotPage } from "../games/gundam/pages/BotVsBot.page";
import { GundamFixtureIndexPage } from "../games/gundam/pages/FixtureRoutes.page";
import { LiveMatchLandingPage as GundamLiveMatchLandingPage } from "../games/gundam/pages/LiveMatchLanding.page";
import { LiveMatchPage as GundamLiveMatchPage } from "../games/gundam/pages/LiveMatch.page";
import { PracticePage as GundamPracticePage } from "../games/gundam/pages/Practice.page";
import { ReplayPage as GundamReplayPage } from "../games/gundam/pages/Replay.page";
import { ReplayForkPage as GundamReplayForkPage } from "../games/gundam/pages/ReplayFork.page";
import { GundamTestStatePage } from "../games/gundam/pages/TestState.page";
import { VsAiPage } from "../games/gundam/pages/VsAi.page";
import { OnePieceSimulatorProviders } from "../games/one-piece/App";
import type { SimulatorRouteKind } from "./routeData";

const OnePiecePracticePage = lazy(async () => {
  const module = await import("../games/one-piece/pages/Practice.page");
  return { default: module.OnePiecePracticePage };
});
const OnePieceFixtureIndexPage = lazy(async () => {
  const module = await import("../games/one-piece/pages/FixtureRoutes.page");
  return { default: module.OnePieceFixtureIndexPage };
});
const OnePieceFixturePage = lazy(async () => {
  const module = await import("../games/one-piece/pages/FixtureRoutes.page");
  return { default: module.OnePieceFixturePage };
});
const OnePieceTestStatePage = lazy(async () => {
  const module = await import("../games/one-piece/pages/TestState.page");
  return { default: module.OnePieceTestStatePage };
});

type PageComponent = ComponentType;
type ProviderComponent = ComponentType<{ children: ReactNode }>;

interface SimulatorRouteRegistration {
  Providers: ProviderComponent;
  pages: Partial<Record<SimulatorRouteKind, PageComponent>>;
}

function withSuspense(Page: PageComponent): PageComponent {
  return function SuspendedRoutePage() {
    return (
      <Suspense fallback={null}>
        <Page />
      </Suspense>
    );
  };
}

const onePiecePractice = withSuspense(OnePiecePracticePage);
const onePieceFixtures = withSuspense(OnePieceFixtureIndexPage);
const onePieceFixture = withSuspense(OnePieceFixturePage);
const onePieceTestState = withSuspense(OnePieceTestStatePage);

type RegisteredRouteGame = "one-piece" | "gundam" | "cyberpunk";

const ROUTE_REGISTRY: Record<RegisteredRouteGame, SimulatorRouteRegistration> = {
  "one-piece": {
    Providers: OnePieceSimulatorProviders,
    pages: {
      "game-index": onePiecePractice,
      "play-practice": onePiecePractice,
      "practice-vs-ai": onePiecePractice,
      tests: onePieceFixtures,
      "test-engine-state": onePieceTestState,
      "test-fixture": onePieceFixture,
    },
  },
  gundam: {
    Providers: GundamSimulatorProviders,
    pages: {
      "game-index": VsAiPage,
      "play-practice": GundamPracticePage,
      "practice-vs-ai": GundamPracticePage,
      tests: GundamFixtureIndexPage,
      "test-engine-state": GundamTestStatePage,
      "match-landing": GundamLiveMatchLandingPage,
      "live-match": GundamLiveMatchPage,
      replay: GundamReplayPage,
      "replay-fork": GundamReplayForkPage,
      "vs-ai": VsAiPage,
      "bot-vs-bot": BotVsBotPage,
      "bot-bench-ui": BotBenchUiPage,
    },
  },
  cyberpunk: {
    Providers: CyberpunkSimulatorProviders,
    pages: {
      "game-index": CyberpunkHomePage,
      "play-practice": WebviewPracticePage,
      "practice-vs-ai": CyberpunkPracticePage,
      tests: TestsPage,
      "test-engine-state": CyberpunkTestStatePage,
      "test-fixture": CyberpunkTestFixturePage,
      "match-landing": LiveMatchLandingPage,
      "live-match": CyberpunkLiveMatchPage,
      replay: ReplayPage,
      "replay-fork": ReplayForkPage,
      matchmaking: MatchmakingPage,
      decks: DecksPage,
      "deck-detail": DeckDetailPage,
      "practice-match": PracticeMatchPage,
      "vs-ai": CyberpunkPracticePage,
    },
  },
};

export interface ResolvedSimulatorRoute {
  Providers: ProviderComponent;
  Page: PageComponent;
}

export function resolveSimulatorRoute(
  gameSlug: GameSlug | null,
  routeKind: SimulatorRouteKind,
): ResolvedSimulatorRoute | null {
  if (!gameSlug) {
    return null;
  }
  const registration = isRegisteredRouteGame(gameSlug) ? ROUTE_REGISTRY[gameSlug] : undefined;
  const Page = registration?.pages[routeKind];
  if (!registration || !Page) {
    return null;
  }
  return { Providers: registration.Providers, Page };
}

function isRegisteredRouteGame(gameSlug: GameSlug): gameSlug is RegisteredRouteGame {
  return gameSlug in ROUTE_REGISTRY;
}
