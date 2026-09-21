import { Suspense, lazy, type ComponentType, type ReactNode } from "react";
import type { GameSlug } from "@tcg/simulator-contract";

import type { SimulatorRouteKind } from "./routeData";

type PageComponent = ComponentType;
type ProviderComponent = ComponentType<{ children: ReactNode }>;

function lazyPage(loader: () => Promise<{ default: PageComponent }>): PageComponent {
  return lazy(loader);
}

function lazyProvider(loader: () => Promise<{ default: ProviderComponent }>): ProviderComponent {
  const Provider = lazy(loader);
  return function SuspendedProvider({ children }: { children: ReactNode }) {
    return (
      <Suspense fallback={null}>
        <Provider>{children}</Provider>
      </Suspense>
    );
  };
}

const CyberpunkSimulatorProviders = lazyProvider(async () => {
  const module = await import("../games/cyberpunk/App");
  return { default: module.CyberpunkSimulatorProviders };
});
const CyberpunkDeckDetailPage = lazyPage(async () => {
  const module = await import("../games/cyberpunk/pages/Decks.page");
  return { default: module.DeckDetailPage };
});
const CyberpunkDecksPage = lazyPage(async () => {
  const module = await import("../games/cyberpunk/pages/Decks.page");
  return { default: module.DecksPage };
});
const CyberpunkLiveMatchPage = lazyPage(async () => {
  const module = await import("../games/cyberpunk/pages/LiveMatch.page");
  return { default: module.LiveMatchPage };
});
const CyberpunkLiveMatchLandingPage = lazyPage(async () => {
  const module = await import("../games/cyberpunk/pages/LiveMatchLanding.page");
  return { default: module.LiveMatchLandingPage };
});
const CyberpunkMatchmakingPage = lazyPage(async () => {
  const module = await import("../games/cyberpunk/pages/Matchmaking.page");
  return { default: module.MatchmakingPage };
});
const CyberpunkPracticeMatchPage = lazyPage(async () => {
  const module = await import("../games/cyberpunk/pages/PracticeMatch.page");
  return { default: module.PracticeMatchPage };
});
const CyberpunkPracticePage = lazyPage(async () => {
  const module = await import("../games/cyberpunk/pages/Practice.page");
  return { default: module.PracticePage };
});
const CyberpunkReplayPage = lazyPage(async () => {
  const module = await import("../games/cyberpunk/pages/Replay.page");
  return { default: module.ReplayPage };
});
const CyberpunkReplayForkPage = lazyPage(async () => {
  const module = await import("../games/cyberpunk/pages/ReplayFork.page");
  return { default: module.ReplayForkPage };
});
const CyberpunkTestFixturePage = lazyPage(async () => {
  const module = await import("../games/cyberpunk/pages/TestFixture.page");
  return { default: module.TestFixturePage };
});
const CyberpunkTestStatePage = lazyPage(async () => {
  const module = await import("../games/cyberpunk/pages/TestState.page");
  return { default: module.CyberpunkTestStatePage };
});
const CyberpunkTestsPage = lazyPage(async () => {
  const module = await import("../games/cyberpunk/pages/Tests.page");
  return { default: module.TestsPage };
});
const CyberpunkWebviewPracticePage = lazyPage(async () => {
  const module = await import("../games/cyberpunk/pages/WebviewPractice.page");
  return { default: module.WebviewPracticePage };
});

const GundamSimulatorProviders = lazyProvider(async () => {
  const module = await import("../games/gundam/App");
  return { default: module.GundamSimulatorProviders };
});
const GundamBotBenchUiPage = lazyPage(async () => {
  const module = await import("../games/gundam/pages/BotBenchUi.page");
  return { default: module.BotBenchUiPage };
});
const GundamBotVsBotPage = lazyPage(async () => {
  const module = await import("../games/gundam/pages/BotVsBot.page");
  return { default: module.BotVsBotPage };
});
const GundamFixtureIndexPage = lazyPage(async () => {
  const module = await import("../games/gundam/pages/FixtureRoutes.page");
  return { default: module.GundamFixtureIndexPage };
});
const GundamLiveMatchLandingPage = lazyPage(async () => {
  const module = await import("../games/gundam/pages/LiveMatchLanding.page");
  return { default: module.LiveMatchLandingPage };
});
const GundamLiveMatchPage = lazyPage(async () => {
  const module = await import("../games/gundam/pages/LiveMatch.page");
  return { default: module.LiveMatchPage };
});
const GundamPracticePage = lazyPage(async () => {
  const module = await import("../games/gundam/pages/Practice.page");
  return { default: module.PracticePage };
});
const GundamReplayPage = lazyPage(async () => {
  const module = await import("../games/gundam/pages/Replay.page");
  return { default: module.ReplayPage };
});
const GundamReplayForkPage = lazyPage(async () => {
  const module = await import("../games/gundam/pages/ReplayFork.page");
  return { default: module.ReplayForkPage };
});
const GundamTestStatePage = lazyPage(async () => {
  const module = await import("../games/gundam/pages/TestState.page");
  return { default: module.GundamTestStatePage };
});
const GundamVsAiPage = lazyPage(async () => {
  const module = await import("../games/gundam/pages/VsAi.page");
  return { default: module.VsAiPage };
});

const OnePieceSimulatorProviders = lazyProvider(async () => {
  const module = await import("../games/one-piece/App");
  return { default: module.OnePieceSimulatorProviders };
});
const AlphaClashSimulatorProviders = lazyProvider(async () => {
  const module = await import("../games/alpha-clash/App");
  return { default: module.AlphaClashSimulatorProviders };
});
const NarutoSimulatorProviders = lazyProvider(async () => {
  const module = await import("../games/naruto/App");
  return { default: module.NarutoSimulatorProviders };
});
const FleshAndBloodSimulatorProviders = lazyProvider(async () => {
  const module = await import("../games/flesh-and-blood/App");
  return { default: module.FleshAndBloodSimulatorProviders };
});
const GrandArchiveSimulatorProviders = lazyProvider(async () => {
  const module = await import("../games/grand-archive/App");
  return { default: module.GrandArchiveSimulatorProviders };
});
const GrandArchivePracticePage = lazyPage(async () => {
  const module = await import("../games/grand-archive/Practice.page");
  return { default: module.GrandArchivePracticePage };
});
const GrandArchiveHomePage = lazyPage(async () => {
  const module = await import("../games/grand-archive/Home.page");
  return { default: module.GrandArchiveHomePage };
});
const GrandArchiveFixturesPage = lazyPage(async () => {
  const module = await import("../games/grand-archive/Fixtures.page");
  return { default: module.GrandArchiveFixturesPage };
});
const GrandArchiveLiveMatchPage = lazyPage(async () => {
  const module = await import("../games/grand-archive/LiveMatch.page");
  return { default: module.GrandArchiveLiveMatchPage };
});
const GrandArchiveLiveMatchLandingPage = lazyPage(async () => {
  const module = await import("../games/grand-archive/LiveMatchLanding.page");
  return { default: module.GrandArchiveLiveMatchLandingPage };
});
const FleshAndBloodPracticePage = lazyPage(async () => {
  const module = await import("../games/flesh-and-blood/Practice.page");
  return { default: module.FleshAndBloodPracticePage };
});
const FleshAndBloodFixtureIndexPage = lazyPage(async () => {
  const module = await import("../games/flesh-and-blood/Fixtures.page");
  return { default: module.FleshAndBloodFixtureIndexPage };
});
const FleshAndBloodLiveMatchPage = lazyPage(async () => {
  const module = await import("../games/flesh-and-blood/LiveMatch.page");
  return { default: module.LiveMatchPage };
});
const FabLiveMatchLandingPage = lazyPage(async () => {
  const module = await import("../games/flesh-and-blood/LiveMatchLanding.page");
  return { default: module.FabLiveMatchLandingPage };
});
const RiftboundSimulatorProviders = lazyProvider(async () => {
  const module = await import("../games/riftbound/App");
  return { default: module.RiftboundSimulatorProviders };
});
const RiftboundLiveMatchLandingPage = lazyPage(async () => {
  const module = await import("../games/riftbound/LiveMatchLanding.page");
  return { default: module.RiftboundLiveMatchLandingPage };
});
const RiftboundLiveMatchPage = lazyPage(async () => {
  const module = await import("../games/riftbound/LiveMatch.page");
  return { default: module.RiftboundLiveMatchPage };
});
const RiftboundReplayPage = lazyPage(async () => {
  const module = await import("../games/riftbound/Replay.page");
  return { default: module.RiftboundReplayPage };
});
const RiftboundFixturesPage = lazyPage(async () => {
  const module = await import("../games/riftbound/Fixtures.page");
  return { default: module.RiftboundFixturesPage };
});

const OnePiecePracticePage = lazy(async () => {
  const module = await import("../games/one-piece/pages/Practice.page");
  return { default: module.OnePiecePracticePage };
});
const AlphaClashPracticePage = lazy(async () => {
  const module = await import("../games/alpha-clash/pages/Practice.page");
  return { default: module.AlphaClashPracticePage };
});
const AlphaClashHomePage = lazy(async () => {
  const module = await import("../games/alpha-clash/pages/Home.page");
  return { default: module.AlphaClashHomePage };
});
const AlphaClashLiveMatchPage = lazy(async () => {
  const module = await import("../games/alpha-clash/pages/LiveMatch.page");
  return { default: module.AlphaClashLiveMatchPage };
});
const AlphaClashLiveMatchLandingPage = lazy(async () => {
  const module = await import("../games/alpha-clash/pages/LiveMatchLanding.page");
  return { default: module.AlphaClashLiveMatchLandingPage };
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
const NarutoPracticePage = lazy(async () => {
  const module = await import("../games/naruto/pages/Practice.page");
  return { default: module.NarutoPracticePage };
});
const NarutoFixtureIndexPage = lazy(async () => {
  const module = await import("../games/naruto/pages/FixtureRoutes.page");
  return { default: module.NarutoFixtureIndexPage };
});
const NarutoFixturePage = lazy(async () => {
  const module = await import("../games/naruto/pages/FixtureRoutes.page");
  return { default: module.NarutoFixturePage };
});
const NarutoTestStatePage = lazy(async () => {
  const module = await import("../games/naruto/pages/TestState.page");
  return { default: module.NarutoTestStatePage };
});
const NarutoLiveMatchPage = lazy(async () => {
  const module = await import("../games/naruto/pages/LiveMatch.page");
  return { default: module.NarutoLiveMatchPage };
});
const NarutoLiveMatchLandingPage = lazy(async () => {
  const module = await import("../games/naruto/pages/LiveMatchLanding.page");
  return { default: module.NarutoLiveMatchLandingPage };
});
const TesterHubPage = lazy(async () => {
  const module = await import("./testingHub");
  return { default: module.TesterHubPage };
});

function testerHubPage(
  game: Exclude<RegisteredRouteGame, "grand-archive" | "alpha-clash">,
): PageComponent {
  return function GameTesterHubPage() {
    return <TesterHubPage game={game} />;
  };
}

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
const narutoPractice = withSuspense(NarutoPracticePage);
const narutoFixtures = withSuspense(NarutoFixtureIndexPage);
const narutoFixture = withSuspense(NarutoFixturePage);
const narutoTestState = withSuspense(NarutoTestStatePage);
const narutoLiveMatch = withSuspense(NarutoLiveMatchPage);
const narutoLiveMatchLanding = withSuspense(NarutoLiveMatchLandingPage);
type RegisteredRouteGame =
  | "one-piece"
  | "alpha-clash"
  | "gundam"
  | "cyberpunk"
  | "riftbound"
  | "flesh-and-blood"
  | "grand-archive"
  | "naruto";

const ROUTE_REGISTRY: Record<RegisteredRouteGame, SimulatorRouteRegistration> = {
  "grand-archive": {
    Providers: GrandArchiveSimulatorProviders,
    pages: {
      "game-index": withSuspense(GrandArchiveHomePage),
      "play-practice": withSuspense(GrandArchivePracticePage),
      "practice-vs-ai": withSuspense(GrandArchivePracticePage),
      tests: withSuspense(GrandArchiveFixturesPage),
      "test-fixture": withSuspense(GrandArchiveFixturesPage),
      "live-match": withSuspense(GrandArchiveLiveMatchPage),
      "match-landing": withSuspense(GrandArchiveLiveMatchLandingPage),
    },
  },
  "flesh-and-blood": {
    Providers: FleshAndBloodSimulatorProviders,
    pages: {
      replay: lazyPage(async () => {
        const module = await import("../games/flesh-and-blood/Replay.page");
        return { default: module.FabReplayPage };
      }),
      "replay-fork": lazyPage(async () => {
        const module = await import("../games/flesh-and-blood/ReplayFork.page");
        return { default: module.FabReplayForkPage };
      }),
      "game-index": withSuspense(testerHubPage("flesh-and-blood")),
      // Real player local-play surface (also used for fixtures).
      "play-practice": withSuspense(FleshAndBloodPracticePage),
      "practice-vs-ai": withSuspense(FleshAndBloodPracticePage),
      // Catalog helper only — discovery, not the play surface.
      tests: withSuspense(FleshAndBloodFixtureIndexPage),
      // Same component as practice (Gundam VsAi / Cyberpunk BoardShared pattern).
      "test-fixture": withSuspense(FleshAndBloodPracticePage),
      "live-match": withSuspense(FleshAndBloodLiveMatchPage),
      "match-landing": FabLiveMatchLandingPage,
    },
  },
  riftbound: {
    Providers: RiftboundSimulatorProviders,
    pages: {
      "game-index": withSuspense(testerHubPage("riftbound")),
      tests: RiftboundFixturesPage,
      "match-landing": RiftboundLiveMatchLandingPage,
      "live-match": RiftboundLiveMatchPage,
      replay: RiftboundReplayPage,
    },
  },
  "alpha-clash": {
    Providers: AlphaClashSimulatorProviders,
    pages: {
      "game-index": withSuspense(AlphaClashHomePage),
      "play-practice": withSuspense(AlphaClashPracticePage),
      "practice-vs-ai": withSuspense(AlphaClashPracticePage),
      "match-landing": withSuspense(AlphaClashLiveMatchLandingPage),
      "live-match": withSuspense(AlphaClashLiveMatchPage),
    },
  },
  "one-piece": {
    Providers: OnePieceSimulatorProviders,
    pages: {
      "game-index": withSuspense(testerHubPage("one-piece")),
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
      "game-index": withSuspense(testerHubPage("gundam")),
      "play-practice": GundamPracticePage,
      "practice-vs-ai": GundamPracticePage,
      tests: GundamFixtureIndexPage,
      "test-engine-state": GundamTestStatePage,
      "test-fixture": GundamVsAiPage,
      "match-landing": GundamLiveMatchLandingPage,
      "live-match": GundamLiveMatchPage,
      replay: GundamReplayPage,
      "replay-fork": GundamReplayForkPage,
      "vs-ai": GundamVsAiPage,
      "bot-vs-bot": GundamBotVsBotPage,
      "bot-bench-ui": GundamBotBenchUiPage,
    },
  },
  cyberpunk: {
    Providers: CyberpunkSimulatorProviders,
    pages: {
      "game-index": withSuspense(testerHubPage("cyberpunk")),
      "play-practice": CyberpunkWebviewPracticePage,
      "practice-vs-ai": CyberpunkPracticePage,
      tests: CyberpunkTestsPage,
      "test-engine-state": CyberpunkTestStatePage,
      "test-fixture": CyberpunkTestFixturePage,
      "match-landing": CyberpunkLiveMatchLandingPage,
      "live-match": CyberpunkLiveMatchPage,
      replay: CyberpunkReplayPage,
      "replay-fork": CyberpunkReplayForkPage,
      matchmaking: CyberpunkMatchmakingPage,
      decks: CyberpunkDecksPage,
      "deck-detail": CyberpunkDeckDetailPage,
      "practice-match": CyberpunkPracticeMatchPage,
      "vs-ai": CyberpunkPracticePage,
    },
  },
  naruto: {
    Providers: NarutoSimulatorProviders,
    pages: {
      "game-index": withSuspense(testerHubPage("naruto")),
      "play-practice": narutoPractice,
      "practice-vs-ai": narutoPractice,
      tests: narutoFixtures,
      "test-engine-state": narutoTestState,
      "test-fixture": narutoFixture,
      "match-landing": narutoLiveMatchLanding,
      "live-match": narutoLiveMatch,
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
