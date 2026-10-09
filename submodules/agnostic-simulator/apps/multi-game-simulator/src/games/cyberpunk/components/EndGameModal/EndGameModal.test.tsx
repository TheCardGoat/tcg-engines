// @vitest-environment jsdom

import {
  act,
  cleanup,
  fireEvent,
  render as testingRender,
  screen,
  waitFor,
} from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { MemoryRouter, useLocation } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { EndGameModal } from "./EndGameModal";

const mocks = vi.hoisted(() => {
  const playCue = vi.fn();
  const gameState = {
    activeSide: "player",
    prioritySide: "player",
    phase: "main",
    gameEnded: true,
    overtimeActive: false,
    winnerSide: "player",
    winReason: "gig_victory",
    turnNumber: 7,
    advancePhase: vi.fn(),
  };
  const engine = {
    humanSide: "player",
    resetScenario: vi.fn(),
    canResetScenario: true,
    isRemote: false,
    remoteReturnUrl: null,
    postGameContext: null as Record<string, unknown> | null,
    postGameSurface: "deck-builder-practice",
    matchState: {
      ctx: {
        playerIds: ["player-1", "player-2"],
        stateID: 42,
      },
    },
  };

  const saveHostedReplayOnDevice = vi.fn();
  const downloadHostedReplay = vi.fn();
  return { engine, gameState, playCue, saveHostedReplayOnDevice, downloadHostedReplay };
});

vi.mock("@tcg/simulator-runtime/replay-library", () => ({
  isBrowserReplayStorageAvailable: () => true,
  listDeviceReplays: async () => [],
}));

vi.mock("../../../../runtime/replayActions", () => ({
  saveHostedReplayOnDevice: mocks.saveHostedReplayOnDevice,
  downloadHostedReplay: mocks.downloadHostedReplay,
}));

function render(ui: React.ReactElement) {
  return testingRender(ui, { wrapper: TestProviders });
}

function TestProviders({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider env="test">
      <MemoryRouter initialEntries={["/matches/match-1/games/game-1"]}>
        {children}
        <CurrentLocation />
      </MemoryRouter>
    </MantineProvider>
  );
}

function CurrentLocation() {
  const location = useLocation();
  return <span data-testid="current-location">{location.pathname + location.search}</span>;
}

vi.mock("../../engine", () => ({
  PLAYER_SIDE_TO_ID: {
    player: "player-1",
    opponent: "player-2",
  },
  useEngine: () => mocks.engine,
}));

vi.mock("../GameBoard/gameStateContext", () => ({
  useGameState: () => mocks.gameState,
}));

vi.mock("../../../../simulator/audio", () => ({
  useSimulatorAudio: () => ({
    playCue: mocks.playCue,
    scheduleAnimationSteps: vi.fn(),
    cancelScheduledCues: vi.fn(),
  }),
}));

// Keep postGameApi real so the envelope parser runs; stub the network and the
// auth/URL boundary modules it depends on instead.
vi.mock("../../auth/auth-store", async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  primeAuthSession: async () => {},
}));
vi.mock("../../engine/live/runtimeHeaders", async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  cyberpunkRuntimeRequestHeaders: () => ({}),
}));
vi.mock("../../../../runtime/gameRuntimeApi", async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  matchHistoryUrl: (_slug: string, suffix: string) => `https://api.test/v1/match-history${suffix}`,
  apiUrl: () => "https://api.test/v1",
  playUrl: (_slug: string, suffix: string) => `https://api.test/v1/games/cyberpunk/play${suffix}`,
}));

function nextGameSession(phase: "starting" | "playing" = "playing") {
  return {
    schemaVersion: 2,
    revision: 2,
    phase,
    ...(phase === "starting" ? { gameId: "game 2" } : {}),
    match: {
      matchId: "match 1",
      gameType: "cyberpunk",
      format: "best_of_3",
      matchType: "casual",
      status: phase === "starting" ? "waiting" : "in_progress",
      participants: [],
      gameIds: ["game 1", "game 2"],
    },
    viewer: {
      role: "spectator",
      spectatorId: "spectator-1",
      permissions: {
        act: false,
        chat: false,
        propose: false,
        useManualControls: false,
        concede: false,
        spectate: true,
        viewReplay: true,
        downloadReplay: false,
        forkReplay: false,
      },
    },
    ...(phase === "playing"
      ? {
          game: {
            gameId: "game 2",
            gameNumber: 2,
            status: "in_progress",
            authority: "server",
            stateVersion: 1,
            view: {},
          },
          capabilities: {
            actions: false,
            chat: false,
            proposals: false,
            manualControls: false,
            spectating: true,
            conceding: false,
            replay: false,
          },
          presence: { players: [] },
          history: { recentMoves: [], engineLogs: [] },
        }
      : {}),
  };
}

function stubFetchWithPostGameRecord(payload: unknown): ReturnType<typeof vi.fn> {
  const fetchMock = vi.fn(async () => ({
    ok: true,
    status: 200,
    json: async () => payload,
  }));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

function savedAnalyticsPlayer(seat: 1 | 2, playerId: string, overrides?: Record<string, unknown>) {
  return {
    playerId,
    displayName: seat === 1 ? "wazar" : "LeoMosiah",
    username: null,
    seat,
    onThePlay: seat === 1,
    deckColors: seat === 1 ? ["yellow"] : ["blue"],
    deckCardIds: [],
    final: {
      gigs: seat === 1 ? 7 : 3,
      streetCred: seat === 1 ? 9 : 4,
      eddies: seat === 1 ? 2 : 0,
      spentEddies: seat === 1 ? 4 : 1,
      deckCount: seat === 1 ? 30 : 28,
      handCount: 4,
      fieldCount: 3,
      legendCount: 1,
      trashCount: 5,
    },
    counters: {
      cardsPlayed: seat === 1 ? 9 : 6,
      unitsPlayed: 4,
      gearPlayed: 1,
      programsPlayed: 2,
      cardsSold: 2,
      legendsCalled: 1,
      gigsGained: seat === 1 ? 7 : 3,
      gigsStolen: seat === 1 ? 2 : 0,
      directAttacks: seat === 1 ? 3 : 1,
      unitAttacks: 2,
      blockersUsed: 1,
      abilitiesActivated: 2,
      effectsResolved: 4,
      phasesPassed: 8,
      turnsEnded: 4,
      fightsWon: seat === 1 ? 2 : 0,
      unitsLost: seat === 1 ? 1 : 2,
      mulligans: seat === 1 ? 1 : 0,
      conceded: false,
    },
    metrics: {
      avgCardsPlayedPerTurn: 2.2,
      avgGigsGainedPerTurn: 1.7,
      avgTurnDurationMs: 21000,
      firstPlayTurn: 1,
      firstGigTurn: 1,
      firstDirectAttackTurn: 2,
      firstStolenGigTurn: 3,
      firstLegendCallTurn: null,
      biggestSteal: seat === 1 ? 2 : 0,
      biggestStealCardName: seat === 1 ? "Netrunner Mk II" : undefined,
      stealEvents: seat === 1 ? 3 : 0,
      eddiesFloating: seat === 1 ? 4 : 2,
      lowestDeckCount: seat === 1 ? 12 : 3,
      turnsAtSevenGigs: seat === 1 ? 1 : 0,
    },
    priorityTimeByTurn:
      seat === 1
        ? [
            { turn: 0, thinkingTimeMs: 4_000 },
            { turn: 1, thinkingTimeMs: 12_000 },
            { turn: 2, thinkingTimeMs: 3_000 },
          ]
        : [
            { turn: 0, thinkingTimeMs: 3_000 },
            { turn: 1, thinkingTimeMs: 2_000 },
            { turn: 2, thinkingTimeMs: 11_000 },
          ],
    cardEvents:
      seat === 1
        ? {
            c1: {
              cardPublicId: "c1",
              displayName: "Netrunner Mk II",
              type: "program",
              color: "blue",
              cost: 2,
              power: 2,
              ram: 1,
              copiesInDeck: 3,
              timesPlayed: 2,
              timesSold: 0,
              timesCalled: 0,
              timesAttackedUnits: 0,
              timesAttackedDirectly: 2,
              timesDefended: 0,
              timesBlocked: 0,
              timesAbilityActivated: 1,
              gigsStolen: 2,
            },
          }
        : {},
    perTurn:
      seat === 1
        ? [
            {
              turn: 1,
              cardsPlayedThisTurn: 2,
              cardsSoldThisTurn: 0,
              legendCallsThisTurn: 0,
              gigsGainedThisTurn: 1,
              gigsStolenThisTurn: 0,
              directAttacksThisTurn: 0,
              unitAttacksThisTurn: 0,
              blockersUsedThisTurn: 0,
              abilitiesActivatedThisTurn: 0,
              effectsResolvedThisTurn: 1,
              runningGigs: 1,
              runningStreetCred: 1,
              eddies: 2,
              eddiesSpentThisTurn: 1,
              handCount: 5,
              deckCount: 31,
              fieldCount: 2,
              readyUnitCount: 1,
              spentUnitCount: 0,
              durationMs: 20000,
            },
            {
              turn: 2,
              cardsPlayedThisTurn: 3,
              cardsSoldThisTurn: 1,
              legendCallsThisTurn: 0,
              gigsGainedThisTurn: 2,
              gigsStolenThisTurn: 1,
              directAttacksThisTurn: 1,
              unitAttacksThisTurn: 1,
              blockersUsedThisTurn: 0,
              abilitiesActivatedThisTurn: 1,
              effectsResolvedThisTurn: 2,
              runningGigs: 3,
              runningStreetCred: 4,
              eddies: 1,
              eddiesSpentThisTurn: 3,
              handCount: 4,
              deckCount: 29,
              fieldCount: 3,
              readyUnitCount: 2,
              spentUnitCount: 1,
              durationMs: 22000,
            },
            {
              turn: 4,
              cardsPlayedThisTurn: 2,
              cardsSoldThisTurn: 0,
              legendCallsThisTurn: 1,
              gigsGainedThisTurn: 4,
              gigsStolenThisTurn: 1,
              directAttacksThisTurn: 2,
              unitAttacksThisTurn: 1,
              blockersUsedThisTurn: 1,
              abilitiesActivatedThisTurn: 1,
              effectsResolvedThisTurn: 1,
              runningGigs: 7,
              runningStreetCred: 9,
              eddies: 3,
              eddiesSpentThisTurn: 2,
              handCount: 4,
              deckCount: 27,
              fieldCount: 4,
              readyUnitCount: 3,
              spentUnitCount: 1,
              durationMs: 21000,
            },
          ]
        : [
            {
              turn: 1,
              cardsPlayedThisTurn: 1,
              cardsSoldThisTurn: 0,
              legendCallsThisTurn: 0,
              gigsGainedThisTurn: 1,
              gigsStolenThisTurn: 0,
              directAttacksThisTurn: 0,
              unitAttacksThisTurn: 0,
              blockersUsedThisTurn: 0,
              abilitiesActivatedThisTurn: 0,
              effectsResolvedThisTurn: 0,
              runningGigs: 1,
              runningStreetCred: 1,
              eddies: 4,
              eddiesSpentThisTurn: 0,
              handCount: 5,
              deckCount: 33,
              fieldCount: 1,
              readyUnitCount: 1,
              spentUnitCount: 0,
              durationMs: 18000,
            },
            {
              turn: 3,
              cardsPlayedThisTurn: 2,
              cardsSoldThisTurn: 0,
              legendCallsThisTurn: 0,
              gigsGainedThisTurn: 2,
              gigsStolenThisTurn: 0,
              directAttacksThisTurn: 1,
              unitAttacksThisTurn: 0,
              blockersUsedThisTurn: 0,
              abilitiesActivatedThisTurn: 0,
              effectsResolvedThisTurn: 1,
              runningGigs: 3,
              runningStreetCred: 4,
              eddies: 2,
              eddiesSpentThisTurn: 2,
              handCount: 4,
              deckCount: 31,
              fieldCount: 2,
              readyUnitCount: 1,
              spentUnitCount: 1,
              durationMs: 19000,
            },
          ],
    ...overrides,
  };
}

function savedAnalyticsPayload() {
  return {
    version: 1,
    gameSlug: "cyberpunk",
    gameId: "cyberpunk-game-saved",
    matchId: "match_test",
    dimensions: {
      matchType: "practice",
      format: "best_of_1",
      authority: "server",
      gameNumber: 1,
    },
    summary: {
      winnerId: "player-1",
      endReason: "gig_victory",
      totalTurns: 4,
      totalMoves: 23,
      durationMs: 120000,
      createdAt: "2026-09-18T10:00:00Z",
      completedAt: "2026-09-18T10:02:00Z",
      onThePlay: "player-1",
      overtimeActive: false,
      finalGigs: { player1: 7, player2: 3 },
      finalStreetCred: { player1: 9, player2: 4 },
      finalEddies: { player1: 2, player2: 0 },
      finalDeckCount: { player1: 30, player2: 28 },
    },
    players: [savedAnalyticsPlayer(1, "player-1"), savedAnalyticsPlayer(2, "player-2")],
  };
}

vi.mock("@tcg/simulator-ui", () => ({
  PostGameModal: ({
    sections,
    participants,
    actions,
    meta,
    reason,
  }: {
    sections?: Array<{ id: string; label: string; content?: React.ReactNode }>;
    participants?: { left: React.ReactNode; right: React.ReactNode };
    actions?: React.ReactNode;
    meta?: React.ReactNode;
    reason?: string;
  }) => (
    <div data-testid="post-game-modal">
      <span>{reason}</span>
      {meta}
      {participants?.left}
      {participants?.right}
      {sections?.map((section) => (
        <section key={section.id} data-testid={`post-game-section-${section.id}`}>
          {section.content}
        </section>
      ))}
      {actions}
    </div>
  ),
}));

describe("EndGameModal", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    );
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    vi.unstubAllGlobals();
    mocks.engine.postGameContext = null;
    mocks.engine.postGameSurface = "deck-builder-practice";
    mocks.engine.isRemote = false;
  });

  test("plays the win cue once when the player wins a finished game", () => {
    const view = render(<EndGameModal />);

    expect(mocks.playCue).toHaveBeenCalledTimes(1);
    expect(mocks.playCue).toHaveBeenCalledWith("game.win");

    view.rerender(<EndGameModal />);

    expect(mocks.playCue).toHaveBeenCalledTimes(1);
  });

  test.each(["in_progress", "waiting"] as const)(
    "enables the mounted next-game link for a %s series only after its session is available",
    async (matchStatus) => {
      mocks.engine.isRemote = true;
      mocks.engine.postGameSurface = "default";
      mocks.engine.postGameContext = {
        gameId: "game 1",
        matchId: "match 1",
        format: "best_of_3",
        matchStatus,
        nextGameId: "game 2",
        analytics: { status: "skipped" },
      };
      let resolveSession!: (response: Response) => void;
      const fetchMock = vi.fn(
        () =>
          new Promise<Response>((resolve) => {
            resolveSession = resolve;
          }),
      );
      vi.stubGlobal("fetch", fetchMock);

      render(<EndGameModal />);

      expect(screen.getByTestId("post-game-modal")).toBeTruthy();
      expect(screen.getByTestId("end-game-next-game-waiting").hasAttribute("disabled")).toBe(true);
      expect(screen.queryByTestId("end-game-next-game")).toBeNull();
      expect(fetchMock).toHaveBeenCalledWith(
        "https://api.test/v1/games/cyberpunk/play/matches/match%201/games/game%202/session",
        expect.objectContaining({ credentials: "include" }),
      );

      await act(async () => resolveSession(Response.json(nextGameSession())));

      expect(screen.getByTestId("end-game-next-game").getAttribute("href")).toBe(
        "/cyberpunk/simulator/matches/match%201/games/game%202",
      );
    },
  );

  test("retries a missing next-game session while keeping navigation disabled", async () => {
    vi.useFakeTimers();
    try {
      mocks.engine.isRemote = true;
      mocks.engine.postGameSurface = "default";
      mocks.engine.postGameContext = {
        gameId: "game 1",
        matchId: "match 1",
        format: "best_of_3",
        matchStatus: "in_progress",
        nextGameId: "game 2",
        analytics: { status: "skipped" },
      };
      let sessionCalls = 0;
      const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
        const requestUrl =
          typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
        if (requestUrl.endsWith("/post-game")) {
          return Response.json({
            gameId: "game 1",
            analytics: { status: "skipped" },
            rating: { status: "in_progress" },
          });
        }
        sessionCalls++;
        if (sessionCalls === 1) return Response.json({}, { status: 404 });
        return Response.json(nextGameSession(sessionCalls === 2 ? "starting" : "playing"));
      });
      vi.stubGlobal("fetch", fetchMock);

      render(<EndGameModal />);
      await act(async () => Promise.resolve());
      expect(screen.getByTestId("end-game-next-game-waiting").hasAttribute("disabled")).toBe(true);

      await act(async () => vi.advanceTimersByTimeAsync(1_500));
      expect(sessionCalls).toBe(2);
      expect(screen.getByTestId("end-game-next-game-waiting").hasAttribute("disabled")).toBe(true);

      await act(async () => vi.advanceTimersByTimeAsync(3_000));
      expect(sessionCalls).toBe(3);
      expect(screen.getByTestId("end-game-next-game").getAttribute("href")).toBe(
        "/cyberpunk/simulator/matches/match%201/games/game%202",
      );
    } finally {
      vi.useRealTimers();
    }
  });

  test("describes the rules-accurate seven-gig start-of-turn victory", () => {
    const view = render(<EndGameModal />);

    expect(view.getAllByText("Gig victory: start your turn with 7 gigs").length).toBeGreaterThan(0);
  });

  test("describes the rules-accurate overtime seven-Gig-dice win", () => {
    mocks.gameState.winReason = "overtime_majority";
    const view = render(<EndGameModal />);

    expect(view.getAllByText("Overtime: first to 7 Gig dice").length).toBeGreaterThan(0);
    mocks.gameState.winReason = "gig_victory";
  });

  test("uses the saved overtime result for the hosted post-game summary", () => {
    const payload = savedAnalyticsPayload();
    mocks.engine.postGameSurface = "default";
    mocks.engine.postGameContext = {
      gameId: payload.gameId,
      format: "best_of_1",
      analytics: {
        status: "saved",
        payload: {
          ...payload,
          summary: {
            ...payload.summary,
            endReason: "overtime_majority",
            overtimeActive: true,
          },
        },
      },
    };

    const view = render(<EndGameModal />);

    expect(view.getAllByText("Overtime: first to 7 Gig dice").length).toBeGreaterThan(0);
    expect(view.getAllByText("Overtime").length).toBeGreaterThan(0);
  });

  test("shows a terminal unavailable state when the server skipped analytics", async () => {
    mocks.engine.postGameSurface = "default";
    mocks.engine.postGameContext = { gameId: "cyberpunk-game-skipped", format: "best_of_1" };
    const fetchMock = stubFetchWithPostGameRecord({
      gameId: "cyberpunk-game-skipped",
      matchId: "match_test",
      note: "",
      canSaveNote: false,
      analytics: { status: "skipped", errorMessage: "skipped_missing_replay_data" },
    });

    render(<EndGameModal />);

    expect(
      (await screen.findAllByText("Analytics were not generated for this game.")).length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText("Analytics unavailable").length).toBeGreaterThan(0);
    expect(screen.queryAllByText("Waiting for analytics processing to finish.")).toHaveLength(0);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test("keeps polling while the server reports analytics processing", async () => {
    vi.useFakeTimers();
    try {
      mocks.engine.postGameSurface = "default";
      mocks.engine.postGameContext = { gameId: "cyberpunk-game-processing", format: "best_of_1" };
      const fetchMock = stubFetchWithPostGameRecord({
        gameId: "cyberpunk-game-processing",
        matchId: "match_test",
        note: "",
        canSaveNote: false,
        analytics: { status: "processing" },
      });

      render(<EndGameModal />);

      await act(async () => {
        await vi.advanceTimersByTimeAsync(0);
      });
      expect(
        screen.getAllByText("Waiting for analytics processing to finish.").length,
      ).toBeGreaterThan(0);
      await act(async () => {
        await vi.advanceTimersByTimeAsync(2500);
      });
      expect(fetchMock).toHaveBeenCalledTimes(2);
    } finally {
      vi.useRealTimers();
    }
  });

  test("refreshes a pending rating while keeping saved analytics visible", async () => {
    vi.useFakeTimers();
    try {
      mocks.engine.postGameSurface = "default";
      mocks.engine.postGameContext = { gameId: "cyberpunk-game-saved", format: "best_of_1" };
      const payload = savedAnalyticsPayload();
      payload.dimensions.matchType = "ranked";
      const record = { gameId: "cyberpunk-game-saved", analytics: { status: "saved", payload } };
      const fetchMock = vi
        .fn()
        .mockResolvedValueOnce(Response.json({ ...record, rating: { status: "pending" } }))
        .mockResolvedValueOnce(
          Response.json({
            ...record,
            rating: {
              status: "ready",
              seasonId: "current",
              players: [
                { status: "rated", seat: 1, before: 1400, after: 1418 },
                { status: "rated", seat: 2, before: 1500, after: 1482 },
              ],
            },
          }),
        );
      vi.stubGlobal("fetch", fetchMock);
      render(<EndGameModal />);
      await act(async () => Promise.resolve());
      expect(screen.getAllByText("Rating update pending")).toHaveLength(2);
      expect(screen.getByText("Head-to-head")).toBeTruthy();
      await act(async () => vi.advanceTimersByTimeAsync(2500));
      expect(screen.getByText("1400 → 1418 (+18)")).toBeTruthy();
      expect(screen.getByText("1500 → 1482 (-18)")).toBeTruthy();
      await act(async () => vi.advanceTimersByTimeAsync(5000));
      expect(fetchMock).toHaveBeenCalledTimes(2);
    } finally {
      vi.useRealTimers();
    }
  });

  test("shows starting MMR and a real zero change from the rating response", async () => {
    mocks.engine.postGameSurface = "default";
    mocks.engine.postGameContext = { gameId: "cyberpunk-game-saved", format: "best_of_1" };
    const payload = savedAnalyticsPayload();
    payload.dimensions.matchType = "ranked";
    payload.players = [
      savedAnalyticsPlayer(1, "player-1", { mmrAtMatch: 1400, bracket: "silver" }),
      savedAnalyticsPlayer(2, "player-2", { mmrAtMatch: 1300, bracket: "silver" }),
    ];
    stubFetchWithPostGameRecord({
      gameId: "cyberpunk-game-saved",
      analytics: { status: "saved", payload },
      rating: {
        status: "ready",
        seasonId: "season-current",
        players: [
          { status: "rated", seat: 1, before: 1400, after: 1400 },
          { status: "rated", seat: 2, before: 1300, after: 1318 },
        ],
      },
    });
    render(<EndGameModal />);
    expect(await screen.findByText("Starting MMR · 1400")).toBeTruthy();
    expect(screen.getByText("1400 → 1400 (+0)")).toBeTruthy();
    expect(screen.getByText("1300 → 1318 (+18)")).toBeTruthy();
  });

  test.each(["player", "opponent"])("shows supporter identities from the %s perspective", async (humanSide) => {
    mocks.engine.humanSide = humanSide;
    mocks.engine.postGameSurface = "default";
    mocks.engine.postGameContext = { gameId: "cyberpunk-game-saved", format: "best_of_1" };
    const payload = savedAnalyticsPayload();
    payload.players = [savedAnalyticsPlayer(1, "player-1"), savedAnalyticsPlayer(2, "player-2")];
    stubFetchWithPostGameRecord({
      gameId: "cyberpunk-game-saved",
      analytics: { status: "saved", payload },
    });
    render(<EndGameModal playerIdentities={{
      player: { id: "player-1", displayName: "Premium Runner", subscriptionTier: "tier3" },
      opponent: { id: "player-2", displayName: "Free Rival", subscriptionTier: "free" },
    }} />);
    const premium = await screen.findByLabelText("Premium Runner, Champion");
    expect(premium.closest("article")?.getAttribute("data-position")).toBe(humanSide === "player" ? "left" : "right");
    expect(screen.getByLabelText("Free Rival")).toBeTruthy();
    mocks.engine.humanSide = "player";
  });

  test("shows placement without exposing starting or settlement MMR", async () => {
    mocks.engine.postGameSurface = "default";
    mocks.engine.postGameContext = { gameId: "cyberpunk-game-saved", format: "best_of_1" };
    const payload = savedAnalyticsPayload();
    payload.dimensions.matchType = "ranked";
    payload.players = [
      savedAnalyticsPlayer(1, "player-1", { mmrAtMatch: 1234, bracket: "placement" }),
      savedAnalyticsPlayer(2, "player-2", { mmrAtMatch: 1567, bracket: "placement" }),
    ];
    stubFetchWithPostGameRecord({
      gameId: "cyberpunk-game-saved",
      analytics: { status: "saved", payload },
      rating: {
        status: "ready",
        seasonId: "season-current",
        players: [
          { status: "placement", seat: 1 },
          { status: "placement", seat: 2 },
        ],
      },
    });
    render(<EndGameModal />);
    expect(await screen.findAllByText("Placement match")).toHaveLength(2);
    expect(screen.getAllByText("Starting rank · Placement")).toHaveLength(2);
    expect(screen.queryByText(/1234|1567/)).toBeNull();
  });

  test("renders the head-to-head overview, progression chart, and breakdowns from saved analytics", async () => {
    mocks.engine.postGameSurface = "default";
    mocks.engine.postGameContext = { gameId: "cyberpunk-game-saved", format: "best_of_1" };
    stubFetchWithPostGameRecord({
      gameId: "cyberpunk-game-saved",
      matchId: "match_test",
      note: "",
      canSaveNote: false,
      analytics: { status: "saved", payload: savedAnalyticsPayload() },
    });

    render(<EndGameModal />);

    expect(await screen.findByText("Head-to-head")).toBeTruthy();
    expect(screen.getByText("Units lost")).toBeTruthy();
    expect(screen.getByRole("img", { name: "Gigs progression by turn" })).toBeTruthy();
    expect(screen.getByText("Closing turn")).toBeTruthy();
    expect(screen.getByText("Match highlights")).toBeTruthy();
    expect(screen.getByText("Biggest steal")).toBeTruthy();
    expect(
      screen.getByText((_, element) => element?.textContent === "Netrunner Mk II · wazar · 2 gigs"),
    ).toBeTruthy();
    expect(screen.getByText("Closest to decking out")).toBeTruthy();
    expect(
      screen.getByText((_, element) => element?.textContent === "LeoMosiah · 3 cards left"),
    ).toBeTruthy();
    expect(
      screen.getByText((_, element) => element?.textContent === "Cards that shaped the game"),
    ).toBeTruthy();
    expect(screen.getByText("Netrunner Mk II")).toBeTruthy();
    expect(screen.getByText("Turn breakdown")).toBeTruthy();
    expect(screen.getByText("23 moves recorded across 4 turns.")).toBeTruthy();
    expect(screen.getByText("Eddies left")).toBeTruthy();
    expect(screen.getByText("Thinking time (excluding setup)")).toBeTruthy();
    expect(screen.getByText("Thinking time by turn")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "About thinking time" }));
    expect(
      await screen.findByText(/Time with priority, including reactions and choices/),
    ).toBeTruthy();
    const turnsSection = screen.getByText("Turn breakdown").closest("section");
    const rows = turnsSection?.querySelectorAll('[aria-label="Thinking time by turn"] tbody tr');
    expect(rows?.[0]?.textContent).toContain("Setup");
    expect(rows?.[0]?.children[1]?.textContent).toBe("4s");
    expect(rows?.[0]?.children[2]?.textContent).toBe("3s");
    expect(rows?.[1]?.children[1]?.textContent).toBe("12s");
    expect(rows?.[1]?.children[2]?.textContent).toBe("2s");

    const total = screen.getByRole("row", { name: /Total thinking time/ });
    expect(total.children[1]?.textContent).toBe("15s");
    expect(total.children[2]?.textContent).toBe("13s");

    const chart = screen.getByRole("img", { name: "Gigs progression by turn" });
    expect(chart.textContent).toContain("T4");
  });

  test("offers three replay actions and saves before opening the device replay", async () => {
    mocks.engine.postGameSurface = "default";
    mocks.engine.postGameContext = {
      gameId: "game 1",
      format: "best_of_1",
      analytics: { status: "skipped" },
    };
    mocks.saveHostedReplayOnDevice.mockResolvedValue({ gameId: "game 1" });

    render(<EndGameModal />);
    fireEvent.click(screen.getByRole("button", { name: "Replay" }));

    expect(screen.getByText("Watch replay")).toBeTruthy();
    expect(screen.getByText("Download replay")).toBeTruthy();
    expect(screen.getByText("Save on this device")).toBeTruthy();

    fireEvent.click(screen.getByText("Watch replay"));
    await waitFor(() =>
      expect(mocks.saveHostedReplayOnDevice).toHaveBeenCalledWith("cyberpunk", "game 1"),
    );
    await waitFor(() =>
      expect(screen.getByTestId("current-location")).toHaveProperty(
        "textContent",
        "/cyberpunk/simulator/replay/game%201?source=device",
      ),
    );
  });

  test("keeps the player on the summary when the replay cannot be saved", async () => {
    mocks.engine.postGameSurface = "default";
    mocks.engine.postGameContext = {
      gameId: "game 1",
      format: "best_of_1",
      analytics: { status: "skipped" },
    };
    mocks.saveHostedReplayOnDevice.mockRejectedValue(
      new DOMException("request timed out", "TimeoutError"),
    );

    render(<EndGameModal />);
    fireEvent.click(screen.getByRole("button", { name: "Replay" }));
    fireEvent.click(screen.getByText("Watch replay"));

    expect(await screen.findByText("Replay server did not respond. Try again later.")).toBeTruthy();
    expect(screen.getByTestId("current-location")).toHaveProperty(
      "textContent",
      "/matches/match-1/games/game-1",
    );
  });
});
