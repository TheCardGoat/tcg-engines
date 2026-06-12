import { beforeEach, describe, expect, it, mock } from "bun:test";

import type { MatchmakingContext, ProfileDeckSummary } from "../api/player-context-api.js";

const testGlobals = globalThis as any;

testGlobals.$state = Object.assign(<T>(value: T): T => value, {
  eager: <T>(value: T): T => value,
  raw: <T>(value: T): T => value,
  snapshot: <T>(value: T): T => value,
});

testGlobals.$derived = Object.assign(<T>(value: T): T => value, {
  by: <T>(fn: () => T): T => fn(),
});

testGlobals.$effect = Object.assign(
  (fn: () => void | (() => void)): void => {
    fn();
  },
  {
    pre: (fn: () => void | (() => void)): void => {
      fn();
    },
    pending: (): boolean => false,
    tracking: (): boolean => false,
    root: <T>(fn: () => T): T => fn(),
  },
);

const baseDeck: ProfileDeckSummary = {
  deckId: "deck-1",
  deckName: "Ruby Sapphire",
  activeDeckVersionId: "version-1",
  activeDeckListId: "deck-list-1",
  cardCount: 60,
  colorMask: 3,
  updatedAt: "2026-03-31T00:00:00.000Z",
  validFormats: ["infinity"],
};

const initialContext: MatchmakingContext = {
  account: {
    userId: "user-1",
    name: "Tester",
    email: "tester@example.com",
    image: null,
    username: "tester",
    displayUsername: "Tester",
    linkedAccounts: [],
  },
  activeGameProfileId: "profile-1",
  engagement: {
    walletBalance: 0,
    featuredEvent: null,
    activeEvents: [],
  },
  profiles: [
    {
      gameProfileId: "profile-1",
      displayName: "Tester",
      selectedDeckId: "deck-1",
      selectedDeckSummary: baseDeck,
      decks: [baseDeck],
    },
  ],
  dailyStreak: { currentStreak: 0, multiplier: 1.0, nextTier: { days: 3, multiplier: 1.1 } },
};

const fetchDeckListSnapshotByDeckListId = mock(async () => ({
  historicDeck: [],
  deckText: "4 Simba - Protective Cub",
}));
const importDeckForProfile = mock(async () => ({
  deckId: "deck-imported",
  deckName: "Imported Deck",
  activeDeckVersionId: "version-2",
  activeDeckListId: "deck-list-2",
}));
const importLegacyDecksForProfile = mock(async () => ({
  ...initialContext,
  profiles: initialContext.profiles.map((profile) => ({ ...profile, decks: null })),
}));
const trackEvent = mock(() => {});
const openWindow = mock(() => null);
const fetchGatewayTicket = mock(async () => ({
  ticket: "ticket-123",
  authToken: "auth-token-456",
}));
const authSession = {
  isAuthenticated: true,
  isLoading: false,
  user: {
    id: "user-1",
    email: "tester@example.com",
    name: "Tester",
    displayUsername: "Tester",
  },
  session: null,
  fetchSession: async () => {},
  hydrateFromServer: () => {},
  signInWithDiscord: async () => {},
  signOut: async () => {},
};

mock.module("$env/dynamic/public", () => ({
  env: {},
}));
mock.module("$lib/config/public-url-config.js", () => ({
  getGatewayWsUrl: () => "wss://gateway.example.test",
  getApiOrigin: () => "https://api.example.test",
  getGameServerOrigin: () => "https://game.example.test",
}));
mock.module("$lib/config/feature-flags.js", () => ({
  getFeatureFlags: () => ({
    rankedEnabled: false,
    testingQueueEnabled: false,
    testingQueueAccountIds: new Set(),
  }),
}));
mock.module("$lib/analytics/analytics.js", () => ({
  trackEvent,
  setUserProperties: () => {},
  isAnalyticsConfigured: () => false,
  normalizePathForAnalytics: (p: string) => p,
  initAnalytics: () => {},
  trackPageView: () => {},
  truncateForAnalytics: (input: unknown) =>
    typeof input === "string" ? input.slice(0, 100) : undefined,
  analyticsErrorFields: (error: unknown) => {
    const code = error instanceof Error ? error.name : undefined;
    const rawMessage =
      error instanceof Error ? error.message : typeof error === "string" ? error : undefined;
    const message =
      typeof rawMessage === "string" && rawMessage.length > 0
        ? rawMessage.slice(0, 100)
        : undefined;
    return {
      ...(code ? { error_code: code } : {}),
      ...(message ? { error_message: message } : {}),
    };
  },
  trackException: () => {},
  updateConsent: () => {},
  ANALYTICS_TEXT_MAX_LENGTH: 100,
}));
mock.module("$app/navigation", () => ({
  goto: async () => {},
}));
mock.module("$lib/auth/session.svelte.js", () => ({
  authSession,
}));

class FakeGatewayClientStore {
  static instances: FakeGatewayClientStore[] = [];

  url: string;
  ticket?: string;
  onGameMessage?: (msg: { type: string; [key: string]: unknown }) => void;
  onOpen?: () => void;

  connect = mock(() => {});
  destroy = mock(() => {});
  send = mock(() => {});

  constructor(
    url: string,
    ticket?: string,
    onGameMessage?: (msg: { type: string; [key: string]: unknown }) => void,
    onOpen?: () => void,
  ) {
    this.url = url;
    this.ticket = ticket;
    this.onGameMessage = onGameMessage;
    this.onOpen = onOpen;
    FakeGatewayClientStore.instances.push(this);
  }
}

class FakePlayerContextState {
  initialize = mock(async () => {});
  onboard = mock(async () => true);
  loadProfileDecks = mock(async () => [baseDeck]);
  setSelectedDeck = mock(async () => {});
  reset = mock(() => {});
  loading = false;
  savingDeck = false;
  savingProfile = false;
  onboarding = false;
  onboardingError: string | null = null;
  error: string | null = null;
  activeProfile = initialContext.profiles[0] ?? null;
  selectedDeck: ProfileDeckSummary | null = baseDeck;
  profiles = initialContext.profiles;
  needsOnboarding = false;

  constructor(public context: MatchmakingContext | null) {}

  isLoadingDecks(): boolean {
    return false;
  }

  deckLoadError(): string | null {
    return null;
  }

  areDecksLoaded(): boolean {
    return true;
  }
}

class FakeQueueStore {
  checkStatus = mock(async () => {});
  hydrateFromStatus = mock(() => {});
  join = mock(async () => {
    this.status = "queued";
    this.queuedAt = Date.now();
    this.expiresAt = Date.now() + 300_000;
    this.queuedFormat = "infinity";
    this.queuedMode = "3";
  });
  leave = mock(async () => {
    this.status = "idle";
  });
  destroy = mock(() => {});
  handleMatchFound = mock(() => {
    this.status = "match_found";
  });
  handleStatusUpdate = mock((msg: { queued: boolean; queuedAt?: number; expiresAt?: number }) => {
    this.status = msg.queued ? "queued" : "idle";
    this.queuedAt = msg.queuedAt ?? null;
    this.expiresAt = msg.expiresAt ?? null;
  });
  handleCancelled = mock(() => {
    this.status = "idle";
  });
  captureQueuedDeck = mock((deckListId: string) => {
    this.queuedDeckListId = deckListId;
  });
  status: "idle" | "checking" | "joining" | "queued" | "match_found" | "blocked" = "idle";
  queuedAt: number | null = null;
  expiresAt: number | null = null;
  timeRemainingMs = 120_000;
  position: number | null = 2;
  queuedGameProfileId: string | null = "profile-1";
  queuedDeckListId: string | null = null;
  queuedFormat: "infinity" | "cc-011" | null = null;
  queuedMode: "1" | "3" | null = null;
  blockReason: string | null = null;
  activeMatchId: string | null = null;
  error: string | null = null;
}

class FakeLiveMatchesStore {
  startPolling = mock(() => {});
  destroy = mock(() => {});
  total = 0;

  constructor(_: unknown) {}
}

class FakeQueueStatsStore {
  startPolling = mock(() => {});
  destroy = mock(() => {});

  constructor(_: unknown) {}

  statsByPartition() {
    return null;
  }

  totalInQueue() {
    return 0;
  }

  totalLiveMatches() {
    return 0;
  }
}

class FakePlayerSettingsStore {
  initialize = mock(() => {});
  selectedLocale = "en";
  skipActionConfirmation = false;
  hotkeyMode = "none";
  cardPreviewMode = "hover";
  primaryClickAction = "select";
  animationSpeed = 1;
  soundVolume = 0;
  accessibleMobileControls = false;
  handleLocaleSelection = mock(() => {});
  handleSkipActionConfirmationToggle = mock(() => {});
  handleHotkeyModeChange = mock(() => {});
  handleCardPreviewModeChange = mock(() => {});
  handlePrimaryClickActionChange = mock(() => {});
  handleAnimationSpeedChange = mock(() => {});
  handleSoundVolumeChange = mock(() => {});
  handleAccessibleMobileControlsToggle = mock(() => {});
  selectedPlaymat = "default";
  selectedCardBack = "default";
  handlePlaymatChange = mock(() => {});
  handleCardBackChange = mock(() => {});
  setSaveVisualSettingsToServer = mock(() => {});
}

const { createMatchmakingLobbyController } =
  await import("./useMatchmakingLobbyController.svelte.ts");

describe("createMatchmakingLobbyController", () => {
  beforeEach(() => {
    fetchDeckListSnapshotByDeckListId.mockClear();
    importDeckForProfile.mockClear();
    importLegacyDecksForProfile.mockClear();
    trackEvent.mockClear();
    openWindow.mockClear();
    fetchGatewayTicket.mockClear();
    FakeGatewayClientStore.instances = [];
    authSession.isAuthenticated = true;
    authSession.isLoading = false;
  });

  function createController() {
    return createMatchmakingLobbyController(
      {
        initialContext,
      },
      {
        getGatewayWsUrl: () => "wss://gateway.example.test",
        getFeatureFlags: () => ({
          rankedEnabled: false,
          testingQueueEnabled: false,
          testingQueueAccountIds: new Set(),
        }),
        importDeckForProfile,
        importLegacyDecksForProfile,
        fetchDeckListSnapshotByDeckListId: fetchDeckListSnapshotByDeckListId as never,
        trackEvent,
        openWindow,
        fetchGatewayTicket,
        authSession: authSession as never,
        GatewayClientStore: FakeGatewayClientStore as never,
        MatchmakingPlayerContextState: FakePlayerContextState as never,
        MatchmakingQueueStore: FakeQueueStore as never,
        LiveMatchesStore: FakeLiveMatchesStore as never,
        QueueStatsStore: FakeQueueStatsStore as never,
        PlayerSettingsStore: FakePlayerSettingsStore as never,
      },
    );
  }

  it("initializes authenticated lobby with SSR-provided gateway ticket and matchmaking status", async () => {
    const controller = createMatchmakingLobbyController(
      {
        initialContext,
        gatewayTicket: "ticket-123",
        initialMatchmakingStatus: {
          object: "matchmaking_status",
          queued: false,
        },
      },
      {
        getGatewayWsUrl: () => "wss://gateway.example.test",
        getFeatureFlags: () => ({
          rankedEnabled: false,
          testingQueueEnabled: false,
          testingQueueAccountIds: new Set(),
        }),
        importDeckForProfile,
        importLegacyDecksForProfile,
        fetchDeckListSnapshotByDeckListId: fetchDeckListSnapshotByDeckListId as never,
        trackEvent,
        openWindow,
        fetchGatewayTicket,
        authSession: authSession as never,
        GatewayClientStore: FakeGatewayClientStore as never,
        MatchmakingPlayerContextState: FakePlayerContextState as never,
        MatchmakingQueueStore: FakeQueueStore as never,
        LiveMatchesStore: FakeLiveMatchesStore as never,
        QueueStatsStore: FakeQueueStatsStore as never,
        PlayerSettingsStore: FakePlayerSettingsStore as never,
      },
    );

    await controller.initialize();

    // Gateway ticket applied from SSR — no client-side fetch
    expect(fetchGatewayTicket).not.toHaveBeenCalled();
    expect(FakeGatewayClientStore.instances).toHaveLength(2);
    expect(FakeGatewayClientStore.instances[0]?.destroy).toHaveBeenCalledTimes(1);
    expect(FakeGatewayClientStore.instances[1]?.ticket).toBe("ticket-123");
    expect(FakeGatewayClientStore.instances[1]?.connect).toHaveBeenCalledTimes(1);
    // Queue status hydrated from SSR — no client-side fetch
    expect((controller.queueStore as unknown as FakeQueueStore).checkStatus).not.toHaveBeenCalled();
  });

  it("fetches gateway ticket client-side when SSR omitted it but queue status was hydrated on server", async () => {
    const controller = createMatchmakingLobbyController(
      {
        initialContext,
        initialMatchmakingStatus: {
          object: "matchmaking_status",
          queued: false,
        },
      },
      {
        getGatewayWsUrl: () => "wss://gateway.example.test",
        getFeatureFlags: () => ({
          rankedEnabled: false,
          testingQueueEnabled: false,
          testingQueueAccountIds: new Set(),
        }),
        importDeckForProfile,
        importLegacyDecksForProfile,
        fetchDeckListSnapshotByDeckListId: fetchDeckListSnapshotByDeckListId as never,
        trackEvent,
        openWindow,
        fetchGatewayTicket,
        authSession: authSession as never,
        GatewayClientStore: FakeGatewayClientStore as never,
        MatchmakingPlayerContextState: FakePlayerContextState as never,
        MatchmakingQueueStore: FakeQueueStore as never,
        LiveMatchesStore: FakeLiveMatchesStore as never,
        QueueStatsStore: FakeQueueStatsStore as never,
        PlayerSettingsStore: FakePlayerSettingsStore as never,
      },
    );

    await controller.initialize();

    expect(fetchGatewayTicket).toHaveBeenCalled();
    expect((controller.queueStore as unknown as FakeQueueStore).checkStatus).not.toHaveBeenCalled();
    expect(FakeGatewayClientStore.instances.at(-1)?.ticket).toBe("ticket-123");
  });

  it("skips ticket and queue hydration for anonymous users", async () => {
    authSession.isAuthenticated = false;

    const controller = createController();

    await controller.initialize();

    expect(fetchGatewayTicket).not.toHaveBeenCalled();
    expect(FakeGatewayClientStore.instances).toHaveLength(1);
    expect(FakeGatewayClientStore.instances[0]?.connect).toHaveBeenCalledTimes(1);
    expect((controller.queueStore as unknown as FakeQueueStore).checkStatus).not.toHaveBeenCalled();
  });

  it("opens sign-in instead of joining queue when unauthenticated", async () => {
    authSession.isAuthenticated = false;
    const controller = createController();

    await controller.handleJoinQueue();

    expect(controller.signInDialogOpen).toBe(true);
    expect((controller.queueStore as unknown as FakeQueueStore).join).not.toHaveBeenCalled();
  });

  it("captures the queued deck and polls the gateway after a successful join", async () => {
    const controller = createController();

    await controller.handleJoinQueue();

    expect(
      (controller.queueStore as unknown as FakeQueueStore).captureQueuedDeck,
    ).toHaveBeenCalledWith("deck-list-1");
    expect(FakeGatewayClientStore.instances[0]?.send).toHaveBeenCalledWith({
      type: "matchmaking_poll",
    });
  });

  it("imports a deck, refreshes the active profile, and selects the imported deck", async () => {
    const controller = createController();
    controller.importDeckName = "Imported Deck";
    controller.importDeckText = "4 Card One\n4 Card Two";

    await controller.handleImportDeckSubmit();

    expect(importDeckForProfile).toHaveBeenCalledWith("profile-1", {
      deckName: "Imported Deck",
      deckText: "4 Card One\n4 Card Two",
    });
    expect(
      (controller.playerContext as unknown as FakePlayerContextState).loadProfileDecks,
    ).toHaveBeenCalledWith("profile-1", { force: true });
    expect(
      (controller.playerContext as unknown as FakePlayerContextState).setSelectedDeck,
    ).toHaveBeenCalledWith("deck-imported");
    expect(controller.deckSelection.success).toContain("Imported Deck");
  });

  it("imports legacy decks into the active profile and uses the refreshed deck list", async () => {
    const controller = createController();

    await controller.handleImportLegacy();

    expect(importLegacyDecksForProfile).toHaveBeenCalledWith("profile-1");
    expect(
      (controller.playerContext as unknown as FakePlayerContextState).loadProfileDecks,
    ).toHaveBeenCalledWith("profile-1", { force: true });
    expect(controller.deckSelection.importLegacyError).toBeNull();
    expect(controller.deckSelection.importLegacySuccess).toBe("Decks imported successfully!");
  });

  it("opens the legacy quick AI route in a new tab for the selected deck", async () => {
    const controller = createController();

    await controller.startPracticeMatch();

    expect(fetchDeckListSnapshotByDeckListId).toHaveBeenCalledWith("deck-list-1");
    expect(openWindow).toHaveBeenCalledWith(
      "/sandbox/simulator/vs-ai/quick?deck=NCBTaW1iYSAtIFByb3RlY3RpdmUgQ3Vi",
      "_blank",
      "noopener,noreferrer",
    );
    expect(trackEvent).toHaveBeenCalledWith("practice_start");
    expect(controller.practice.error).toBeNull();
  });

  it("passes selected bot fixture and strategy to the quick AI route", async () => {
    const controller = createController();
    controller.handleBotFixtureChange("amber-amethyst-control");
    controller.handleBotStrategyChange("board-control-lore-race");

    await controller.startPracticeMatch();

    expect(openWindow).toHaveBeenCalledWith(
      "/sandbox/simulator/vs-ai/quick?deck=NCBTaW1iYSAtIFByb3RlY3RpdmUgQ3Vi&opponentFixtureId=amber-amethyst-control&strategyId=board-control-lore-race",
      "_blank",
      "noopener,noreferrer",
    );
  });

  it("keeps the existing deck validation when starting an AI match without a selected deck", async () => {
    const controller = createController();
    (controller.playerContext as unknown as FakePlayerContextState).selectedDeck = null;

    await controller.startPracticeMatch();

    expect(fetchDeckListSnapshotByDeckListId).not.toHaveBeenCalled();
    expect(openWindow).not.toHaveBeenCalled();
    expect(controller.practice.error).toBe("Please select a deck first.");
  });

  it("clears queued AI overlay state when queue status leaves queued or match_found", async () => {
    const controller = createController();
    controller.queuedAiOverlayOpen = true;
    controller.queuedAiConfig = {
      playerOneDeckText: "4 Simba - Protective Cub",
      playerTwoDeckText: "4 Elsa - Snow Queen",
      strategyId: "default",
      seed: "seed-1",
    };

    const gateway = controller.gateway as unknown as FakeGatewayClientStore;
    gateway.onGameMessage?.({
      type: "matchmaking_status",
      queued: false,
    });

    expect(controller.queuedAiOverlayOpen).toBe(false);
    expect(controller.queuedAiConfig).toBeNull();
    expect(controller.queue.queuedAiError).toBeNull();
  });

  it("opens AI quick-play URL with defaults when no optional bot config is selected", async () => {
    const controller = createController();

    await controller.startQueuedAiMatch();

    expect(fetchDeckListSnapshotByDeckListId).toHaveBeenCalledWith("deck-list-1");
    expect(openWindow).toHaveBeenCalledWith(
      expect.stringContaining("/sandbox/simulator/vs-ai/quick?deck="),
      "_blank",
      "noopener,noreferrer",
    );
    // URL should NOT contain opponentFixtureId or strategyId when empty
    const calls = openWindow.mock.calls as unknown as string[][];
    const url = calls[0]![0]!;
    expect(url).not.toContain("opponentFixtureId");
    expect(url).not.toContain("strategyId");
  });

  function createControllerWithFlags(flags: {
    rankedEnabled: boolean;
    testingQueueEnabled?: boolean;
    testingQueueAccountIds?: ReadonlySet<string>;
  }) {
    const fullFlags = {
      testingQueueEnabled: false,
      testingQueueAccountIds: new Set<string>(),
      ...flags,
    };
    return createMatchmakingLobbyController(
      { initialContext },
      {
        getGatewayWsUrl: () => "wss://gateway.example.test",
        getFeatureFlags: () => fullFlags,
        importDeckForProfile,
        importLegacyDecksForProfile,
        fetchDeckListSnapshotByDeckListId: fetchDeckListSnapshotByDeckListId as never,
        trackEvent,
        openWindow,
        fetchGatewayTicket,
        authSession: authSession as never,
        GatewayClientStore: FakeGatewayClientStore as never,
        MatchmakingPlayerContextState: FakePlayerContextState as never,
        MatchmakingQueueStore: FakeQueueStore as never,
        LiveMatchesStore: FakeLiveMatchesStore as never,
        QueueStatsStore: FakeQueueStatsStore as never,
        PlayerSettingsStore: FakePlayerSettingsStore as never,
      },
    );
  }

  it("ignores selectMatchType('ranked') when the rankedEnabled flag is off", () => {
    const controller = createControllerWithFlags({ rankedEnabled: false });
    const before = controller.queue.selectedMatchType;

    controller.selectMatchType("ranked");

    expect(controller.queue.selectedMatchType).toBe(before);
    expect(controller.queue.rankedEnabled).toBe(false);
    expect(trackEvent).not.toHaveBeenCalledWith("matchmaking_match_type_select", expect.anything());
  });

  it("accepts selectMatchType('ranked') when the rankedEnabled flag is on", () => {
    const controller = createControllerWithFlags({ rankedEnabled: true });

    controller.selectMatchType("ranked");

    expect(controller.queue.selectedMatchType).toBe("ranked");
    expect(controller.queue.rankedEnabled).toBe(true);
    expect(trackEvent).toHaveBeenCalledWith("matchmaking_match_type_select", {
      matchType: "ranked",
    });
  });

  it("snaps queue mode to BO3 when switching to ranked from a BO1 selection", () => {
    const controller = createControllerWithFlags({ rankedEnabled: true });
    controller.selectMatchType("casual");
    controller.selectQueueMode("1");
    expect(controller.queue.selectedQueueMode).toBe("1");

    controller.selectMatchType("ranked");

    expect(controller.queue.selectedMatchType).toBe("ranked");
    expect(controller.queue.selectedQueueMode).toBe("3");
  });

  it("rejects selectQueueMode('1') while ranked is selected", () => {
    const controller = createControllerWithFlags({ rankedEnabled: true });
    controller.selectMatchType("ranked");
    expect(controller.queue.selectedQueueMode).toBe("3");

    controller.selectQueueMode("1");

    expect(controller.queue.selectedQueueMode).toBe("3");
  });

  it("passes selected bot fixture and strategy into AI quick-play URL", async () => {
    const controller = createController();
    controller.handleBotFixtureChange("amber-amethyst-control");
    controller.handleBotStrategyChange("board-control-lore-race");

    await controller.startQueuedAiMatch();

    expect(fetchDeckListSnapshotByDeckListId).toHaveBeenCalledWith("deck-list-1");
    const calls = openWindow.mock.calls as unknown as string[][];
    const url = calls[0]![0]!;
    expect(url).toContain("opponentFixtureId=amber-amethyst-control");
    expect(url).toContain("strategyId=board-control-lore-race");
  });
});
