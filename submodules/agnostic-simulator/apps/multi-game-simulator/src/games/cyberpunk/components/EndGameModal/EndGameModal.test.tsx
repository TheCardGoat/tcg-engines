// @vitest-environment jsdom

import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";

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

  return { engine, gameState, playCue };
});

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
}));

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
      stealEvents: seat === 1 ? 3 : 0,
      eddiesFloating: seat === 1 ? 4 : 2,
      lowestDeckCount: seat === 1 ? 12 : 3,
      turnsAtSevenGigs: seat === 1 ? 1 : 0,
    },
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
    actions,
    reason,
  }: {
    sections?: Array<{ id: string; label: string; content?: React.ReactNode }>;
    actions?: React.ReactNode;
    reason?: string;
  }) => (
    <div data-testid="post-game-modal">
      <span>{reason}</span>
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
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    vi.unstubAllGlobals();
    mocks.engine.postGameContext = null;
    mocks.engine.postGameSurface = "deck-builder-practice";
  });

  test("plays the win cue once when the player wins a finished game", () => {
    const view = render(<EndGameModal />);

    expect(mocks.playCue).toHaveBeenCalledTimes(1);
    expect(mocks.playCue).toHaveBeenCalledWith("game.win");

    view.rerender(<EndGameModal />);

    expect(mocks.playCue).toHaveBeenCalledTimes(1);
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
    expect(screen.getByRole("img", { name: "Gigs progression by turn" })).toBeTruthy();
    expect(screen.getByText("Closing turn")).toBeTruthy();
    expect(screen.getByText("Match highlights")).toBeTruthy();
    expect(screen.getByText("Biggest steal")).toBeTruthy();
    expect(
      screen.getByText((_, element) => element?.textContent === "wazar · 2 gigs"),
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

    const chart = screen.getByRole("img", { name: "Gigs progression by turn" });
    expect(chart.textContent).toContain("T4");
  });
});
