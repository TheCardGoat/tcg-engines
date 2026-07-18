import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";

import type {
  LobbyMatchResultResponse,
  LobbyRoomResponse,
} from "@/features/matchmaking/api/lobby-api.js";
import type { MatchmakingCatalogQueue } from "@/features/matchmaking/api/matchmaking-api.js";
import type { MatchmakingContext, ProfileDeckSummary } from "../api/player-context-api.js";

const testGlobals = globalThis as any;
const localStorageValues = new Map<string, string>();
const originalLocalStorage = testGlobals.localStorage;

const localStorage = {
  getItem: (key: string): string | null => localStorageValues.get(key) ?? null,
  setItem: (key: string, value: string): void => {
    localStorageValues.set(key, value);
  },
  removeItem: (key: string): void => {
    localStorageValues.delete(key);
  },
  clear: (): void => {
    localStorageValues.clear();
  },
};

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
const getLobbyRoomStatus = mock(async (): Promise<LobbyRoomResponse | null> => null);
const getLobbyMatchResult = mock(async (): Promise<LobbyMatchResultResponse | null> => null);
const createLobbyRoom = mock(async () => ({
  object: "lobby_room",
  roomCode: "ABC123",
}));
const joinLobbyRoom = mock(async () => ({
  object: "lobby_room",
  roomCode: "ABC123",
  status: "ready",
}));
const cancelLobbyRoom = mock(async () => {});
const startLobbyRoom = mock(async () => ({
  object: "lobby_match",
  matchId: "match-1",
  gameId: "game-1",
}));
const leaveLobbyRoom = mock(async () => {});
const goto = mock(async () => {});
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
  goto,
}));
mock.module("$lib/auth/session.svelte.js", () => ({
  authSession,
}));
mock.module("@/features/matchmaking/api/lobby-api.js", () => ({
  LobbyApiError: class LobbyApiError extends Error {
    readonly roomCode?: string;
    readonly matchId?: string;

    constructor(message: string, roomCode?: string, matchId?: string) {
      super(message);
      this.name = "LobbyApiError";
      this.roomCode = roomCode;
      this.matchId = matchId;
    }
  },
  createLobbyRoom,
  joinLobbyRoom,
  cancelLobbyRoom,
  startLobbyRoom,
  leaveLobbyRoom,
  getLobbyRoomStatus,
  getLobbyMatchResult,
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
  initializeFromServer = mock(() => {});
  initializeVisualSettingsFromServer = mock(() => {});
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
  setSaveToServer = mock(() => {});
  setSaveVisualSettingsToServer = mock(() => {});
}

const { createMatchmakingLobbyController } =
  await import("./useMatchmakingLobbyController.svelte.ts");

describe("createMatchmakingLobbyController", () => {
  const fetchMatchmakingCatalog = mock(
    async (): Promise<MatchmakingCatalogQueue[]> => [
      {
        queueId: "mmq_test",
        displayName: "Infinity Casual BO1",
        formatId: "infinity",
        mode: "1",
        matchType: "casual" as const,
        availability: "available" as const,
        unavailableReason: null,
        season: {
          seasonId: "season_test",
          name: "Test",
          slug: "test",
          startsAt: "2026-07-12T00:00:00.000Z",
          endsAt: "2026-10-02T00:00:00.000Z",
        },
      },
    ],
  );
  beforeEach(() => {
    testGlobals.localStorage = localStorage;
    localStorageValues.clear();
    fetchDeckListSnapshotByDeckListId.mockClear();
    importDeckForProfile.mockClear();
    importLegacyDecksForProfile.mockClear();
    trackEvent.mockClear();
    openWindow.mockClear();
    fetchGatewayTicket.mockClear();
    createLobbyRoom.mockClear();
    joinLobbyRoom.mockClear();
    cancelLobbyRoom.mockClear();
    startLobbyRoom.mockClear();
    leaveLobbyRoom.mockClear();
    getLobbyRoomStatus.mockReset();
    getLobbyRoomStatus.mockResolvedValue(null);
    getLobbyMatchResult.mockReset();
    getLobbyMatchResult.mockResolvedValue(null);
    goto.mockClear();
    FakeGatewayClientStore.instances = [];
    authSession.isAuthenticated = true;
    authSession.isLoading = false;
  });

  afterEach(() => {
    if (originalLocalStorage === undefined) {
      delete testGlobals.localStorage;
    } else {
      testGlobals.localStorage = originalLocalStorage;
    }
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
        fetchMatchmakingCatalog,
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
        fetchMatchmakingCatalog,
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

  it("does not select Testing when the loaded catalog has no available Testing queue", async () => {
    fetchMatchmakingCatalog.mockResolvedValueOnce([
      {
        queueId: "mmq_core_casual_bo1",
        displayName: "Core Casual BO1",
        formatId: "core-constructed",
        mode: "1",
        matchType: "casual",
        availability: "available",
        unavailableReason: null,
        season: null,
      },
    ]);
    const controller = createControllerWithFlags({
      testingQueueEnabled: true,
      rankedEnabled: false,
    });
    await controller.initialize();

    controller.selectMatchType("testing");

    expect(controller.queue.selectedMatchType).toBe("casual");
    expect(trackEvent).not.toHaveBeenCalledWith("matchmaking_match_type_select", {
      matchType: "testing",
    });
  });

  it("falls back from a persisted Testing selection when the catalog has no Testing queue", async () => {
    localStorageValues.set(
      "tcg.matchmaking.prefs",
      JSON.stringify({ format: "core-constructed", mode: "1", matchType: "testing" }),
    );
    fetchMatchmakingCatalog.mockResolvedValueOnce([
      {
        queueId: "mmq_core_casual_bo1",
        displayName: "Core Casual BO1",
        formatId: "core-constructed",
        mode: "1",
        matchType: "casual",
        availability: "available",
        unavailableReason: null,
        season: null,
      },
    ]);
    const controller = createControllerWithFlags({
      testingQueueEnabled: true,
      rankedEnabled: false,
    });

    await controller.initialize();

    expect(controller.queue.selectedMatchType).toBe("casual");
  });

  it("retains BO1 when switching to ranked before the catalog is loaded", () => {
    const controller = createControllerWithFlags({ rankedEnabled: true });
    controller.selectMatchType("casual");
    controller.selectQueueMode("1");
    expect(controller.queue.selectedQueueMode).toBe("1");

    controller.selectMatchType("ranked");

    expect(controller.queue.selectedMatchType).toBe("ranked");
    expect(controller.queue.selectedQueueMode).toBe("1");
  });

  it("restores persisted ranked BO1 preferences until the catalog is loaded", () => {
    localStorageValues.set(
      "tcg.matchmaking.prefs",
      JSON.stringify({ format: "infinity", mode: "1", matchType: "ranked" }),
    );

    const controller = createControllerWithFlags({ rankedEnabled: true });

    expect(controller.queue.selectedMatchType).toBe("ranked");
    expect(controller.queue.selectedQueueMode).toBe("1");
  });

  it("does not expose Early Access without a catalog queue", () => {
    const controller = createControllerWithFlags({
      rankedEnabled: true,
      testingQueueEnabled: true,
    });

    expect(controller.queue.queueCards.map((card) => card.definition.format)).not.toContain(
      "attack-of-the-vine",
    );
  });

  it("exposes and selects only queues that the catalog marks available", async () => {
    fetchMatchmakingCatalog.mockResolvedValueOnce([
      {
        queueId: "mmq_infinity_casual_bo1",
        displayName: "Infinity Casual BO1",
        formatId: "infinity",
        mode: "1",
        matchType: "casual",
        availability: "unavailable",
        unavailableReason: "Queue is not enabled.",
        season: null,
      },
      {
        queueId: "mmq_aotv_casual_bo1",
        displayName: "Attack of the Vine Casual BO1",
        formatId: "attack-of-the-vine",
        mode: "1",
        matchType: "casual",
        availability: "available",
        unavailableReason: null,
        season: {
          seasonId: "season-aotv",
          name: "Attack of the Vine",
          slug: "aotv",
          startsAt: "2026-07-12T00:00:00.000Z",
          endsAt: "2026-10-02T00:00:00.000Z",
        },
      },
    ]);
    const controller = createController();

    await controller.initialize();

    expect(controller.queue.queueCards.map((card) => card.definition.format)).toEqual([
      "attack-of-the-vine",
    ]);
    expect(controller.queue.queueCards[0]?.isSelected).toBe(true);

    controller.selectQueueFormat("infinity");

    expect(controller.queue.queueCards[0]?.isSelected).toBe(true);
    expect(trackEvent).not.toHaveBeenCalledWith("matchmaking_format_select", {
      format: "infinity",
    });
  });

  it("selects an available ranked BO1 partition", async () => {
    fetchMatchmakingCatalog.mockResolvedValueOnce([
      {
        queueId: "mmq_infinity_ranked_bo1",
        displayName: "Infinity Ranked BO1",
        formatId: "infinity",
        mode: "1",
        matchType: "ranked",
        availability: "available",
        unavailableReason: null,
        season: null,
      },
      {
        queueId: "mmq_infinity_ranked_bo3",
        displayName: "Infinity Ranked BO3",
        formatId: "infinity",
        mode: "3",
        matchType: "ranked",
        availability: "available",
        unavailableReason: null,
        season: null,
      },
    ]);
    const controller = createControllerWithFlags({ rankedEnabled: true });
    await controller.initialize();
    controller.selectMatchType("ranked");
    controller.selectQueueMode("1");

    expect(controller.queue.selectedQueueMode).toBe("1");
    expect(trackEvent).toHaveBeenCalledWith("matchmaking_mode_select", { mode: "1" });
  });

  it("uses the selected queue's season and keeps unavailable modes unselected", async () => {
    fetchMatchmakingCatalog.mockResolvedValueOnce([
      {
        queueId: "mmq_infinity_casual_bo1",
        displayName: "Infinity Casual BO1",
        formatId: "infinity",
        mode: "1",
        matchType: "casual",
        availability: "available",
        unavailableReason: null,
        season: {
          seasonId: "season-casual",
          name: "Casual Season",
          slug: "casual-season",
          startsAt: "2026-07-12T00:00:00.000Z",
          endsAt: "2026-10-03T00:00:00.000Z",
        },
      },
      {
        queueId: "mmq_infinity_ranked_bo3",
        displayName: "Infinity Ranked BO3",
        formatId: "infinity",
        mode: "3",
        matchType: "ranked",
        availability: "available",
        unavailableReason: null,
        season: {
          seasonId: "season-ranked",
          name: "Ranked Season",
          slug: "ranked-season",
          startsAt: "2026-07-12T00:00:00.000Z",
          endsAt: "2026-10-03T00:00:00.000Z",
        },
      },
    ]);
    const controller = createControllerWithFlags({ rankedEnabled: true });

    expect(controller.queue.season).toBeNull();

    await controller.initialize();
    controller.selectQueueMode("1");

    expect(controller.queue.season?.name).toBe("Casual Season");

    controller.selectMatchType("ranked");

    expect(controller.queue.season?.name).toBe("Ranked Season");

    trackEvent.mockClear();
    controller.selectQueueMode("1");

    expect(controller.queue.selectedQueueMode).toBe("3");
    expect(trackEvent).not.toHaveBeenCalledWith("matchmaking_mode_select", { mode: "1" });
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

  it("recovers a started lobby match when hydrating a consumed room", async () => {
    getLobbyMatchResult.mockResolvedValue({
      object: "lobby_match_result",
      roomCode: "ABC123",
      matchId: "match-1",
      gameId: "game-1",
    });
    const controller = createController();

    await controller.hydrateRoom("abc123");

    expect(getLobbyMatchResult).toHaveBeenCalledWith("abc123");
    expect(controller.lobby.status).toBe("match_found");
    expect(controller.lobby.activeMatchId).toBeNull();
    expect(controller.lobby.navigatingToMatch).toBe(true);
    expect(goto).toHaveBeenCalledWith("/matches/match-1/games/game-1");
  });

  it("recovers a started lobby match when hydrating a matched room", async () => {
    getLobbyRoomStatus.mockResolvedValue({
      object: "lobby_room",
      roomCode: "ABC123",
      status: "matched",
      bestOf: 1,
      isCreator: true,
      creatorDisplayName: "Host",
      joinerDisplayName: "Tester",
    });
    getLobbyMatchResult.mockResolvedValue({
      object: "lobby_match_result",
      roomCode: "ABC123",
      matchId: "match-3",
      gameId: "game-3",
    });
    const controller = createController();

    await controller.hydrateRoom("ABC123");

    expect(getLobbyMatchResult).toHaveBeenCalledWith("ABC123");
    expect(controller.lobby.status).toBe("match_found");
    expect(controller.lobby.navigatingToMatch).toBe(true);
    expect(goto).toHaveBeenCalledWith("/matches/match-3/games/game-3");
  });

  it("recovers a started lobby match while polling a joined room", async () => {
    getLobbyRoomStatus.mockResolvedValueOnce({
      object: "lobby_room",
      roomCode: "ABC123",
      status: "ready",
      bestOf: 1,
      isJoiner: true,
      creatorDisplayName: "Host",
      joinerDisplayName: "Tester",
    });
    getLobbyMatchResult.mockResolvedValue({
      object: "lobby_match_result",
      roomCode: "ABC123",
      matchId: "match-2",
      gameId: "game-2",
    });
    const controller = createController();
    await controller.hydrateRoom("ABC123");
    getLobbyRoomStatus.mockResolvedValue(null);

    await controller.pollRoomStatus();

    expect(getLobbyRoomStatus).toHaveBeenCalledWith("ABC123");
    expect(getLobbyMatchResult).toHaveBeenCalledWith("ABC123");
    expect(controller.lobby.status).toBe("match_found");
    expect(goto).toHaveBeenCalledWith("/matches/match-2/games/game-2");
  });
});
