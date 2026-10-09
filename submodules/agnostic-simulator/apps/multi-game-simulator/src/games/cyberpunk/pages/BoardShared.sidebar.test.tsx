// @vitest-environment jsdom

import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vite-plus/test";
import type { CyberpunkTestEngine, DeckStrategyProfile } from "@tcg/cyberpunk-engine";
import { createPlayerId, withDeckProfile } from "@tcg/cyberpunk-engine";
import {
  composeDropEligibility,
  DISCONNECT_DROP_THRESHOLD_MS,
  unsupportedTimeoutChannel,
} from "@tcg/protocol";

import { CardPreviewProvider } from "../components/CardPreview/CardPreviewContext";
import type { LiveMatchSidebarParticipant } from "../components/BoardRuntimeContext";
import { AI_STRATEGIES, DEFAULT_SCENARIO, UserConfigProvider, getScenario } from "../engine";
import { FIRST_GAME_TUTORIAL_STORAGE_KEY } from "../components/FirstGameTutorial/storage";
import { createLiveMatchViewerEngine } from "../engine/live/liveState";
import { theme } from "../theme";
import { BoardSharedPage } from "./BoardShared.page";
import { CYBERPUNK_PAYMENT_DISCOVERY_STORAGE_KEY } from "../components/PaymentSelection/PaymentSelectionPlayerAction";
import { MemoryRouter } from "react-router";

vi.mock("../animation", async () => {
  const actual = await vi.importActual<typeof import("../animation")>("../animation");
  return {
    ...actual,
    CyberpunkSharedAnimationLayer: ({ children }: { children: ReactNode }) => children,
    SoundPlayer: () => null,
  };
});

// The V2 board is lazy-loaded for routed ?ui=v2 renders; WebGL is not under test here.
vi.mock("../components/BoardV2/Scene", () => ({ default: () => null }));

function renderBoard(children: ReactNode) {
  return render(
    <MantineProvider theme={theme} env="test">
      <Notifications position="top-right" />
      <CardPreviewProvider>
        <UserConfigProvider>{children}</UserConfigProvider>
      </CardPreviewProvider>
    </MantineProvider>,
  );
}

function renderHumanMatchSidebar(
  options: {
    opponentUserId?: string;
    pendingRemoteActionId?: string;
    format?: "best_of_1" | "best_of_3" | "best_of_5";
    gameNumber?: number;
    player1Score?: number;
    player2Score?: number;
  } = {},
) {
  return renderBoard(
    <BoardSharedPage
      scenarioId="gameStart"
      initialAi={{ player: null, opponent: null }}
      initialAiMode="step"
      playerConnections={{
        player: { status: "connected", connected: true },
        opponent: { status: "connected", connected: true },
      }}
      pendingRemoteActionId={options.pendingRemoteActionId}
      liveMatchSidebar={{
        matchId: "match_1",
        gameId: "game_1",
        format: options.format ?? "best_of_3",
        gameNumber: options.gameNumber ?? 2,
        localPlayerId: "gp_self",
        player1Score: options.player1Score ?? 1,
        player2Score: options.player2Score ?? 0,
        participants: [
          {
            id: "gp_self",
            seat: 1,
            userId: "user_self",
            displayName: "Wazar Testing",
            subscriptionTier: "tier2",
            isMobile: false,
            mmrAtMatch: 1425,
            deckName: "Corpo Control",
          },
          {
            id: "gp_opp",
            seat: 2,
            userId: options.opponentUserId,
            displayName: "MrGMBH",
            subscriptionTier: "free",
            isMobile: true,
            mmrAtMatch: 1510,
            deckName: "Mox Pressure",
            deckListId: "dl_secret_opp",
          },
        ],
      }}
    />,
  );
}

function renderLiveMatchSidebar(
  participants: LiveMatchSidebarParticipant[],
  options: {
    localPlayerId?: string;
    opponentStrategy?: boolean;
    initialEngineBuilder?: () => CyberpunkTestEngine;
    initialHumanSide?: "player" | "opponent";
  } = {},
) {
  return renderBoard(
    <BoardSharedPage
      scenarioId="gameStart"
      initialEngineBuilder={options.initialEngineBuilder}
      initialHumanSide={options.initialHumanSide}
      initialAi={{
        player: null,
        opponent: options.opponentStrategy ? (AI_STRATEGIES[0]?.strategy ?? null) : null,
      }}
      initialAiMode="step"
      playerConnections={{
        player: { status: "connected", connected: true },
        opponent: { status: "connected", connected: true },
      }}
      liveMatchSidebar={{
        matchId: "match_1",
        gameId: "game_1",
        format: "best_of_1",
        gameNumber: 1,
        localPlayerId: options.localPlayerId,
        participants,
      }}
    />,
  );
}

function fetchUrl(call: { input: RequestInfo | URL } | undefined): string {
  if (!call) return "";
  if (typeof call.input === "string") return call.input;
  if (call.input instanceof URL) return call.input.href;
  return call.input.url;
}

function fetchJsonBody(call: { init?: RequestInit } | undefined): unknown {
  const body = call?.init?.body;
  return typeof body === "string" ? JSON.parse(body) : null;
}

describe("BoardSharedPage sidebar", () => {
  test("offers the guided game only on opted-in practice boards and saves a skip", async () => {
    renderBoard(
      <BoardSharedPage
        showFirstGameInvitation
        scenarioId={DEFAULT_SCENARIO}
        initialAi={{ player: null, opponent: null }}
        initialAiMode="step"
      />,
    );

    const guide = await screen.findByLabelText("Your first game");
    expect(within(guide).getByRole("link", { name: "Try the guided game" })).toBeTruthy();
    fireEvent.click(within(guide).getByRole("button", { name: "Skip guide" }));
    expect(screen.queryByLabelText("Your first game")).toBeNull();
    expect(window.localStorage.getItem(FIRST_GAME_TUTORIAL_STORAGE_KEY)).toBe("dismissed");
  });

  test("does not interrupt a new player's live board with a guide invitation", () => {
    renderBoard(
      <BoardSharedPage
        scenarioId={DEFAULT_SCENARIO}
        initialAi={{ player: null, opponent: null }}
        initialAiMode="step"
      />,
    );

    expect(screen.queryByLabelText("Your first game")).toBeNull();
    expect(window.localStorage.getItem(FIRST_GAME_TUTORIAL_STORAGE_KEY)).toBeNull();
  });

  test("still invites routed V1 practice boards to the guided game", async () => {
    renderBoard(
      <MemoryRouter initialEntries={["/cyberpunk/simulator/tests/demo"]}>
        <BoardSharedPage
          showFirstGameInvitation
          scenarioId={DEFAULT_SCENARIO}
          initialAi={{ player: null, opponent: null }}
          initialAiMode="step"
        />
      </MemoryRouter>,
    );

    const guide = await screen.findByLabelText("Your first game");
    expect(
      within(guide).getByRole("link", { name: "Try the guided game" }).getAttribute("href"),
    ).toBe("/cyberpunk/simulator/tutorial");
  });

  test("invites V2 boards to the guided game for their board version", async () => {
    renderBoard(
      <MemoryRouter initialEntries={["/cyberpunk/simulator/tests/demo?ui=v2"]}>
        <BoardSharedPage
          showFirstGameInvitation
          scenarioId={DEFAULT_SCENARIO}
          initialAi={{ player: null, opponent: null }}
          initialAiMode="step"
        />
      </MemoryRouter>,
    );

    await screen.findByTestId("cyberpunk-board-v2");
    const guide = await screen.findByLabelText("Your first game");
    expect(
      within(guide).getByRole("link", { name: "Try the guided game" }).getAttribute("href"),
    ).toBe("/cyberpunk/simulator/tutorial?ui=v2");
  });

  test("invites V2 boards even when the V1 guide is already seen", async () => {
    window.localStorage.setItem(FIRST_GAME_TUTORIAL_STORAGE_KEY, "completed");
    renderBoard(
      <MemoryRouter initialEntries={["/cyberpunk/simulator/tests/demo?ui=v2"]}>
        <BoardSharedPage
          showFirstGameInvitation
          scenarioId={DEFAULT_SCENARIO}
          initialAi={{ player: null, opponent: null }}
          initialAiMode="step"
        />
      </MemoryRouter>,
    );

    await screen.findByTestId("cyberpunk-board-v2");
    const guide = await screen.findByLabelText("Your first game");
    expect(
      within(guide).getByRole("link", { name: "Try the guided game" }).getAttribute("href"),
    ).toBe("/cyberpunk/simulator/tutorial?ui=v2");
  });
  beforeEach(() => {
    window.localStorage.clear();
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
    vi.stubGlobal(
      "ResizeObserver",
      class ResizeObserver {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    );
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  test("renders a human match sidebar for two real seated players", () => {
    renderHumanMatchSidebar({ opponentUserId: "user_opp" });

    expect(screen.getByTestId("cyberpunk-human-match-sidebar")).toBeTruthy();
    expect(screen.queryByTestId("ai-control-panel")).toBeNull();
    const selfPanel = within(screen.getByTestId("human-sidebar-self"));
    expect(selfPanel.getByLabelText("Wazar Testing, Supporter")).toBeTruthy();
    expect(selfPanel.queryByText("Priority")).toBeNull();
    expect(selfPanel.queryByText("Connected")).toBeNull();
    expect(selfPanel.queryByText("Score")).toBeNull();
    expect(
      within(screen.getByTitle("Match score"))
        .getAllByRole("definition")
        .map((value) => value.textContent),
    ).toEqual(["1", "0"]);

    expect(screen.getByTestId("human-sidebar-opponent").textContent).toContain("MrGMBH");
    expect(screen.getByTestId("human-sidebar-self").textContent).toContain("Wazar Testing");
    expect(screen.getByTestId("human-sidebar-opponent").textContent).toContain("1510 MMR");
    expect(screen.getByTestId("human-sidebar-self").textContent).toContain("1425 MMR");
    expect(screen.getByTestId("human-sidebar-opponent").textContent).not.toContain("Champion");
    expect(screen.getByTestId("human-sidebar-self").textContent).not.toContain("Supporter");
    expect(
      within(screen.getByTestId("human-sidebar-opponent")).getByLabelText("On mobile"),
    ).toBeTruthy();
    expect(screen.getByTestId("human-sidebar-opponent").textContent).not.toContain("Mobile");
    expect(screen.getByTestId("human-sidebar-self").textContent).not.toContain("Desktop");
    fireEvent.click(screen.getByRole("button", { name: "Open MrGMBH actions" }));
    expect(screen.getByRole("menuitem", { name: "Add friend" })).toBeTruthy();
    expect(screen.getByRole("menuitem", { name: "Report player" })).toBeTruthy();
    fireEvent.click(screen.getByRole("menuitem", { name: "Report player" }));
    expect(screen.getByRole("dialog", { name: "Report MrGMBH" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Close report mrgmbh" }));

    fireEvent.click(screen.getByRole("button", { name: "Open your player actions" }));
    expect(screen.getByRole("menuitem", { name: "Choose payment for every cost" })).toBeTruthy();
    expect(screen.getByRole("menuitem", { name: "Enable Board State Correction" })).toBeTruthy();
    expect(screen.getByRole("menuitem", { name: "Undo to turn start" })).toBeTruthy();
    const guideLink = screen.getByRole("menuitem", { name: "Show first-game guide" });
    expect(guideLink.getAttribute("href")).toBe("/cyberpunk/simulator/tutorial");
    expect(screen.getByRole("menuitem", { name: "Settings" })).toBeTruthy();
    expect(screen.getByRole("menuitem", { name: "Report bug" })).toBeTruthy();
    expect(screen.getByRole("menuitem", { name: "Request feature" })).toBeTruthy();
    expect(screen.getByRole("menuitem", { name: "Share feedback" })).toBeTruthy();

    // The three legacy menu items collapsed into one tabbed settings dialog.
    fireEvent.click(screen.getByRole("menuitem", { name: "Settings" }));
    const settingsDialog = within(screen.getByRole("dialog", { name: "Settings" }));
    expect(settingsDialog.getAllByRole("tab").map((tab) => tab.textContent)).toEqual([
      "Simulator",
      "Game",
      "Account",
    ]);
    fireEvent.click(screen.getByRole("button", { name: "Close settings" }));

    fireEvent.click(screen.getByRole("button", { name: "MrGMBH connection status: Connected" }));
    const connectionDetails = screen.getByRole("dialog", { name: "MrGMBH connection details" });
    expect(screen.getByTestId("human-sidebar-opponent").contains(connectionDetails)).toBe(false);
    expect(screen.getByText("Rival presence is live")).toBeTruthy();
    expect(screen.getAllByText("Connected").length).toBeGreaterThan(0);
    fireEvent.click(screen.getByText("Technical details"));
    expect(screen.queryByText("dl_secret_opp")).toBeNull();
  });

  test.each([
    { format: "best_of_1" as const, gameNumber: 1 },
    { format: "best_of_1" as const, gameNumber: 2 },
    { format: "best_of_3" as const, gameNumber: 1 },
    { format: "best_of_5" as const, gameNumber: 1 },
  ])("hides the match score in $format game $gameNumber", ({ format, gameNumber }) => {
    renderHumanMatchSidebar({ format, gameNumber });

    expect(screen.queryByTitle("Match score")).toBeNull();
    expect(screen.getByTestId("human-sidebar-self").textContent).toContain("1425 MMR");
  });

  test("shows the match score from game two of a best-of-five match", () => {
    renderHumanMatchSidebar({ format: "best_of_5", gameNumber: 2 });

    expect(
      within(screen.getByTitle("Match score"))
        .getAllByRole("definition")
        .map((value) => value.textContent),
    ).toEqual(["1", "0"]);
  });

  test("shows the pending concession in the action dock and activity log", () => {
    renderHumanMatchSidebar({
      opponentUserId: "user_opp",
      pendingRemoteActionId: "concede",
    });

    const concedingButton = screen.getByRole("button", { name: "Conceding…" });
    expect((concedingButton as HTMLButtonElement).disabled).toBe(true);
    expect(screen.getByText("Conceding the game…")).toBeTruthy();
  });

  test("advertises manual payment once and keeps the control in Player Info", async () => {
    renderHumanMatchSidebar({ opponentUserId: "user_opp" });

    expect(await screen.findByLabelText("Choose how you pay")).toBeTruthy();
    const shortcut = screen.getByRole("button", { name: "Choose payment for every cost" });
    expect(shortcut.getAttribute("aria-pressed")).toBe("false");

    fireEvent.pointerEnter(shortcut);
    expect((await screen.findByRole("tooltip")).textContent).toBe(
      "Choose eligible Eddies or Legends for payment. Full-cost card plays pay automatically.",
    );

    fireEvent.click(shortcut);
    expect(window.localStorage.getItem(CYBERPUNK_PAYMENT_DISCOVERY_STORAGE_KEY)).toBe("dismissed");
    const armedShortcut = screen.getByRole("button", {
      name: "Manual payment enabled",
    });
    expect(armedShortcut.getAttribute("aria-pressed")).toBe("true");

    fireEvent.click(screen.getByRole("button", { name: "Open your player actions" }));
    const armedPayment = screen.getByRole("menuitem", {
      name: "Manual payment enabled",
    });
    expect(armedPayment.getAttribute("aria-pressed")).toBe("true");
    fireEvent.click(armedPayment);
    expect(
      screen
        .getByRole("button", { name: "Choose payment for every cost" })
        .getAttribute("aria-pressed"),
    ).toBe("false");
  });

  test("renders the human sidebar when the bootstrap omits userId (F5)", () => {
    // Production viewer-safe bootstraps omit userId for every seat, so the
    // sidebar must not require it: a live human match used to fall through
    // to the practice surface (TAKE OVER, bot quick controls).
    renderLiveMatchSidebar(
      [
        { id: "gp_self", seat: 1, displayName: "Wazar Testing" },
        { id: "gp_opp", seat: 2, displayName: "MrGMBH" },
      ],
      { localPlayerId: "gp_self" },
    );

    expect(screen.queryByTestId("cyberpunk-practice-sidebar")).toBeNull();
    expect(screen.queryByTestId("cyberpunk-practice-quick-take-control")).toBeNull();
    expect(screen.getByTestId("cyberpunk-human-match-sidebar")).toBeTruthy();
    expect(screen.getByTestId("human-sidebar-self").textContent).toContain("Wazar Testing");
    expect(screen.getByTestId("human-sidebar-opponent").textContent).toContain("MrGMBH");
  });

  test("keeps the practice sidebar with TAKE OVER when a seat is a bot", () => {
    renderLiveMatchSidebar(
      [
        { id: "gp_self", seat: 1, userId: "user_self", displayName: "Wazar Testing" },
        { id: "gp_opp", seat: 2, userId: "user_opp", isBot: true, displayName: "MrGMBH" },
      ],
      { localPlayerId: "gp_self", opponentStrategy: true },
    );

    expect(screen.getByTestId("cyberpunk-practice-sidebar")).toBeTruthy();
    expect(screen.queryByTestId("cyberpunk-human-match-sidebar")).toBeNull();
    expect(screen.getByTestId("cyberpunk-practice-quick-take-control").textContent).toBe(
      "Control opponent",
    );

    // Legacy fallback: a bot_-prefixed participant id routes to the practice
    // sidebar even when the payload predates the server isBot flag.
    cleanup();
    renderLiveMatchSidebar(
      [
        { id: "gp_self", seat: 1, userId: "user_self", displayName: "Wazar Testing" },
        { id: "bot_opp", seat: 2, displayName: "MrGMBH" },
      ],
      { localPlayerId: "gp_self", opponentStrategy: true },
    );

    expect(screen.getByTestId("cyberpunk-practice-sidebar")).toBeTruthy();
    expect(screen.queryByTestId("cyberpunk-human-match-sidebar")).toBeNull();
    expect(screen.getByTestId("cyberpunk-practice-quick-take-control").textContent).toBe(
      "Control opponent",
    );
  });

  test("shows a seated player's real opening hand before the mulligan decision", () => {
    const source = getScenario("gameStart").build();
    const viewerId = source.getState().ctx.playerIds[0]!;
    const rivalId = source.getState().ctx.playerIds[1]!;
    const playerProjection = source.getFilteredView(viewerId);
    const projectedHand = playerProjection.players[String(viewerId)]?.zones.hand;
    expect(Array.isArray(projectedHand)).toBe(true);
    if (!Array.isArray(projectedHand)) return;

    const expectedDefinitionIds = projectedHand.map((card) => card.definitionId);
    expect(new Set(expectedDefinitionIds).size).toBeGreaterThan(1);

    renderLiveMatchSidebar(
      [
        { id: String(viewerId), seat: 1, displayName: "Wazar Testing" },
        { id: String(rivalId), seat: 2, displayName: "MrGMBH" },
      ],
      {
        localPlayerId: String(viewerId),
        initialEngineBuilder: () =>
          createLiveMatchViewerEngine(playerProjection, "opening-hand-privacy-test"),
      },
    );

    const bottomHand = within(screen.getByTestId("player-hand-dock"));
    const displayedDefinitionIds = bottomHand.getAllByTestId("hand-card").map((card) => {
      expect(card.getAttribute("data-face-down")).not.toBe("true");
      expect(card.querySelector('img[alt="Hidden card"]')).toBeNull();
      return card.getAttribute("data-definition-id");
    });

    expect(displayedDefinitionIds).toEqual(expectedDefinitionIds);
    expect(bottomHand.getAllByAltText("Animals Wrecker")).toHaveLength(1);
    expect(screen.getByTestId("prompt-banner").getAttribute("data-state")).toBe("mulligan");
  });

  test("uses the authorized projection while the live sidebar seat is still unresolved", () => {
    const source = getScenario("gameStart").build();
    const state = source.getState();
    const viewerId = state.ctx.playerIds[0]!;
    const rivalId = state.ctx.playerIds[1]!;
    for (const cardId of state.G.players[String(viewerId)]!.zones.hand) {
      state.G.cardIndex[String(cardId)]!.meta.faceDown = true;
    }
    const playerProjection = source.getFilteredView(viewerId);

    renderLiveMatchSidebar(
      [
        { id: String(viewerId), seat: 1, displayName: "Wazar Testing" },
        { id: String(rivalId), seat: 2, displayName: "MrGMBH" },
      ],
      {
        initialEngineBuilder: () =>
          createLiveMatchViewerEngine(playerProjection, "unresolved-seat-opening-hand-test"),
      },
    );

    const bottomHand = within(screen.getByTestId("player-hand-dock"));
    const bottomCards = bottomHand.getAllByTestId("hand-card");
    expect(bottomCards).toHaveLength(6);
    for (const card of bottomCards) {
      expect(card.getAttribute("data-face-down")).toBe("false");
      expect(card.getAttribute("data-card-id")).not.toBeNull();
      expect(card.getAttribute("data-definition-id")).not.toBeNull();
    }
    expect(bottomHand.getAllByAltText("Animals Wrecker")).toHaveLength(1);
  });

  test("never renders the practice sidebar for spectators of a bot-free live match", () => {
    const source = getScenario("gameStart").build();
    const spectatorProjection = source.getFilteredView(createPlayerId("__public_spectator__"));
    renderLiveMatchSidebar(
      [
        { id: "gp_self", seat: 1, displayName: "Wazar Testing" },
        { id: "gp_opp", seat: 2, displayName: "MrGMBH" },
      ],
      {
        initialEngineBuilder: () =>
          createLiveMatchViewerEngine(spectatorProjection, "spectator-hand-privacy-test"),
      },
    );

    expect(screen.queryByTestId("cyberpunk-practice-sidebar")).toBeNull();
    expect(screen.queryByTestId("cyberpunk-practice-quick-take-control")).toBeNull();
    expect(screen.queryByTestId("cyberpunk-human-match-sidebar")).toBeNull();
    expect(screen.getByTestId("cyberpunk-spectator-sidebar")).toBeTruthy();
    expect(screen.queryByText("YOU")).toBeNull();
    expect(screen.queryByRole("button", { name: "Concede" })).toBeNull();

    const bottomHand = within(screen.getByTestId("player-hand-dock"));
    const bottomCards = bottomHand.getAllByTestId("hand-card");
    expect(bottomCards).toHaveLength(6);
    for (const card of bottomCards) {
      expect(card.getAttribute("data-face-down")).toBe("true");
      expect(card.getAttribute("data-card-id")).toBeNull();
      expect(card.getAttribute("data-definition-id")).toBeNull();
    }
    expect(bottomHand.queryByAltText("Animals Wrecker")).toBeNull();
    expect(bottomHand.getByTestId("hand-zone").getAttribute("data-zone-id")).toBe("p-hand");
    expect(bottomHand.getByTestId("hand-zone").getAttribute("data-drop-zone")).toBeNull();

    const topHand = within(screen.getByTestId("opponent-hand-overlay"));
    expect(topHand.getAllByTestId("hand-card")).toHaveLength(6);
    expect(topHand.queryByAltText("Animals Wrecker")).toBeNull();
  });

  test("keeps the first player's opening hand visible during their mulligan decision", () => {
    const source = getScenario("gameStart").build();
    const state = source.getState();
    const seatedPlayerId = state.ctx.playerIds[0]!;
    const rivalPlayerId = state.ctx.playerIds[1]!;
    state.G.players[String(seatedPlayerId)]!.firstPlayer = true;
    state.G.players[String(seatedPlayerId)]!.mulliganDone = false;
    state.G.players[String(rivalPlayerId)]!.firstPlayer = false;
    state.G.players[String(rivalPlayerId)]!.mulliganDone = false;
    for (const cardId of state.G.players[String(seatedPlayerId)]!.zones.hand) {
      state.G.cardIndex[String(cardId)]!.meta.faceDown = true;
    }

    const playerProjection = source.getFilteredView(seatedPlayerId);
    renderLiveMatchSidebar(
      [
        { id: String(seatedPlayerId), seat: 1, displayName: "Wazar Testing" },
        { id: String(rivalPlayerId), seat: 2, displayName: "MrGMBH" },
      ],
      {
        localPlayerId: String(seatedPlayerId),
        initialEngineBuilder: () =>
          createLiveMatchViewerEngine(playerProjection, "seated-setup-hand-visibility-test"),
      },
    );

    const bottomHand = within(screen.getByTestId("player-hand-dock"));
    const bottomCards = bottomHand.getAllByTestId("hand-card");
    expect(bottomCards).toHaveLength(6);
    for (const card of bottomCards) {
      expect(card.getAttribute("data-face-down")).toBe("false");
      expect(card.getAttribute("data-card-id")).not.toBeNull();
      expect(card.getAttribute("data-definition-id")).not.toBeNull();
    }
  });

  test("keeps the second player's opening hand visible while waiting to mulligan", () => {
    const source = getScenario("gameStart").build();
    const state = source.getState();
    const firstPlayerId = state.ctx.playerIds[0]!;
    const seatedPlayerId = state.ctx.playerIds[1]!;
    state.G.players[String(firstPlayerId)]!.firstPlayer = true;
    state.G.players[String(firstPlayerId)]!.mulliganDone = true;
    state.G.players[String(seatedPlayerId)]!.firstPlayer = false;
    state.G.players[String(seatedPlayerId)]!.mulliganDone = false;
    for (const cardId of state.G.players[String(seatedPlayerId)]!.zones.hand) {
      state.G.cardIndex[String(cardId)]!.meta.faceDown = true;
    }

    const playerProjection = source.getFilteredView(seatedPlayerId);
    renderLiveMatchSidebar(
      [
        { id: String(firstPlayerId), seat: 1, displayName: "Wazar Testing" },
        { id: String(seatedPlayerId), seat: 2, displayName: "MrGMBH" },
      ],
      {
        localPlayerId: String(seatedPlayerId),
        initialHumanSide: "opponent",
        initialEngineBuilder: () =>
          createLiveMatchViewerEngine(playerProjection, "waiting-setup-hand-visibility-test"),
      },
    );

    const bottomHand = within(screen.getByTestId("player-hand-dock"));
    const bottomCards = bottomHand.getAllByTestId("hand-card");
    expect(bottomCards).toHaveLength(6);
    for (const card of bottomCards) {
      expect(card.getAttribute("data-face-down")).toBe("false");
      expect(card.getAttribute("data-card-id")).not.toBeNull();
      expect(card.getAttribute("data-definition-id")).not.toBeNull();
    }
  });

  test("keeps the replacement opening hand visible after a mulligan", async () => {
    renderBoard(
      <BoardSharedPage
        scenarioId="gameStart"
        initialAi={{ player: null, opponent: null }}
        initialAiMode="step"
      />,
    );

    const initialHand = within(screen.getByTestId("player-hand-dock"));
    const initialDefinitionIds = initialHand
      .getAllByTestId("hand-card")
      .map((card) => card.getAttribute("data-definition-id"));

    fireEvent.click(screen.getByRole("button", { name: "Mulligan" }));

    await waitFor(() => {
      expect(screen.getByTestId("prompt-banner").getAttribute("data-state")).toBe(
        "waiting-opponent",
      );
    });

    const replacementHand = within(screen.getByTestId("player-hand-dock"));
    const replacementCards = replacementHand.getAllByTestId("hand-card");
    const replacementDefinitionIds = replacementCards.map((card) =>
      card.getAttribute("data-definition-id"),
    );

    expect(replacementCards).toHaveLength(6);
    expect(replacementDefinitionIds).not.toEqual(initialDefinitionIds);
    for (const card of replacementCards) {
      expect(card.getAttribute("data-face-down")).toBe("false");
      expect(card.getAttribute("data-definition-id")).not.toBeNull();
    }
  });

  test("never exposes practice controls to a spectator when a live seat is a bot", () => {
    renderLiveMatchSidebar(
      [
        { id: "gp_self", seat: 1, displayName: "Wazar Testing" },
        { id: "bot_opp", seat: 2, isBot: true, displayName: "Bot" },
      ],
      { opponentStrategy: true },
    );

    expect(screen.queryByTestId("cyberpunk-practice-sidebar")).toBeNull();
    expect(screen.queryByTestId("cyberpunk-practice-quick-take-control")).toBeNull();
    expect(screen.getByTestId("cyberpunk-spectator-sidebar")).toBeTruthy();
  });

  test("submits add friend and marks the action as done", async () => {
    const fetchCalls: Array<{ input: RequestInfo | URL; init?: RequestInit }> = [];
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      fetchCalls.push({ input, init });
      return {
        ok: true,
        json: async () => ({}),
        text: async () => "",
      } as Response;
    });
    vi.stubGlobal("fetch", fetchMock);
    renderHumanMatchSidebar({ opponentUserId: "user_opp" });

    fireEvent.click(screen.getByRole("button", { name: "Open MrGMBH actions" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Add friend" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(fetchUrl(fetchCalls[0])).toContain("/friends/by-user/user_opp");
    expect(fetchJsonBody(fetchCalls[0])).toMatchObject({
      matchId: "match_1",
      gameId: "game_1",
    });

    expect(
      (screen.getByRole("menuitem", { name: "Friend added" }) as HTMLButtonElement).disabled,
    ).toBe(true);
  });

  test("submits bug reports, feature requests, and feedback from the player actions menu", async () => {
    const fetchCalls: Array<{ input: RequestInfo | URL; init?: RequestInit }> = [];
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      fetchCalls.push({ input, init });
      return {
        ok: true,
        text: async () => "",
      } as Response;
    });
    vi.stubGlobal("fetch", fetchMock);
    renderHumanMatchSidebar({ opponentUserId: "user_opp" });

    fireEvent.click(screen.getByRole("button", { name: "Open your player actions" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Report bug" }));
    expect(screen.getByRole("dialog", { name: "Report bug" })).toBeTruthy();
    fireEvent.change(screen.getByPlaceholderText("What happened?"), {
      target: { value: "The game locked after I passed priority." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(fetchUrl(fetchCalls[0])).toContain("/feedback/bug-reports");
    expect(fetchJsonBody(fetchCalls[0])).toMatchObject({
      description: "The game locked after I passed priority.",
      source: "cyberpunk-live-participant-menu",
      context: {
        gameId: "game_1",
        gameSlug: "cyberpunk",
        matchId: "match_1",
        platform: "desktop",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Open your player actions" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Request feature" }));
    expect(screen.getByRole("dialog", { name: "Request feature" })).toBeTruthy();
    fireEvent.change(screen.getByPlaceholderText("What should we add or improve?"), {
      target: { value: "Add a visible priority timer." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    expect(fetchUrl(fetchCalls[1])).toContain("/feedback");
    expect(fetchJsonBody(fetchCalls[1])).toMatchObject({
      message: "Feature request: Add a visible priority timer.",
      source: "cyberpunk-live-participant-menu",
    });

    fireEvent.click(screen.getByRole("button", { name: "Open your player actions" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Share feedback" }));
    expect(screen.getByRole("dialog", { name: "Share feedback" })).toBeTruthy();
    fireEvent.change(screen.getByPlaceholderText("What should we improve?"), {
      target: { value: "The sidebar is useful." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(3));
    expect(fetchUrl(fetchCalls[2])).toContain("/feedback");
    expect(fetchJsonBody(fetchCalls[2])).toMatchObject({
      message: "The sidebar is useful.",
      source: "cyberpunk-live-participant-menu",
    });
  });

  test("keeps disconnect claim available in human matches", () => {
    const onClaimRivalDrop = vi.fn();
    // The Drop control renders from server-projected eligibility, so feed the
    // page the same disconnect the connections fixture describes (past the
    // 30s threshold, i.e. claimable now).
    const nowMs = Date.now();
    const dropEligibility = composeDropEligibility({
      nowMs,
      timeout: unsupportedTimeoutChannel(),
      disconnect: {
        connected: false,
        disconnectedAtMs: nowMs - DISCONNECT_DROP_THRESHOLD_MS - 5_000,
      },
    });
    renderBoard(
      <BoardSharedPage
        scenarioId="gameStart"
        initialAi={{ player: null, opponent: null }}
        initialAiMode="step"
        playerConnections={{
          player: { status: "connected", connected: true },
          opponent: {
            status: "disconnected",
            connected: false,
            disconnectedAt: new Date(nowMs - 31_000).toISOString(),
          },
        }}
        onClaimRivalDrop={onClaimRivalDrop}
        dropEligibility={dropEligibility}
        liveMatchSidebar={{
          matchId: "match_1",
          gameId: "game_1",
          format: "best_of_1",
          gameNumber: 1,
          localPlayerId: "gp_self",
          participants: [
            {
              id: "gp_self",
              seat: 1,
              userId: "user_self",
              displayName: "Wazar Testing",
            },
            {
              id: "gp_opp",
              seat: 2,
              userId: "user_opp",
              displayName: "MrGMBH",
            },
          ],
        }}
      />,
    );

    fireEvent.click(screen.getByRole("tab", { name: "More" }));
    fireEvent.click(screen.getByRole("button", { name: "MrGMBH connection status: Disconnected" }));
    const connectionDetails = screen.getByRole("dialog", { name: "MrGMBH connection details" });
    expect(screen.getByTestId("human-sidebar-opponent").contains(connectionDetails)).toBe(false);
    expect(screen.getByText("Rival disconnected")).toBeTruthy();
    fireEvent.click(screen.getByText("Drop opponent"));

    expect(onClaimRivalDrop).toHaveBeenCalledTimes(1);
  });

  test("prominently surfaces the active player's lost connection", () => {
    renderBoard(
      <BoardSharedPage
        scenarioId="gameStart"
        initialAi={{ player: null, opponent: null }}
        initialAiMode="step"
        playerConnections={{
          player: { status: "disconnected", connected: false },
          opponent: { status: "connected", connected: true },
        }}
        liveMatchSidebar={{
          matchId: "match_1",
          gameId: "game_1",
          format: "best_of_1",
          gameNumber: 1,
          localPlayerId: "gp_self",
          participants: [
            {
              id: "gp_self",
              seat: 1,
              userId: "user_self",
              displayName: "Wazar Testing",
            },
            {
              id: "gp_opp",
              seat: 2,
              userId: "user_opp",
              displayName: "MrGMBH",
            },
          ],
        }}
      />,
    );

    fireEvent.click(screen.getByRole("tab", { name: "More" }));
    expect(screen.getByText("Connection lost").closest('[role="status"]')).toBeTruthy();
    expect(screen.getByText("Actions are paused.")).toBeTruthy();
    expect(screen.getByText(/Wait for this to clear/)).toBeTruthy();
  });

  test("integrates chat into the unified log feed and composes from the floating chat dock", async () => {
    const sendPreset = vi.fn(() => true);
    const requestFreeText = vi.fn(() => true);
    renderBoard(
      <BoardSharedPage
        scenarioId="gameStart"
        initialAi={{ player: null, opponent: null }}
        initialAiMode="step"
        remoteChatMessages={[
          {
            id: 1,
            kind: "preset",
            senderSide: "opponent",
            presetKey: "good_luck",
            timestamp: Date.now(),
          },
          {
            id: 2,
            kind: "text",
            senderSide: "player",
            text: "Ready when you are.",
            timestamp: Date.now() + 1,
          },
        ]}
        remoteFreeTextEnabled={false}
        canRequestFreeText
        sendRemoteChatPreset={sendPreset}
        requestRemoteFreeTextChat={requestFreeText}
        playerConnections={{
          player: { status: "connected", connected: true },
          opponent: { status: "connected", connected: true },
        }}
        liveMatchSidebar={{
          matchId: "match_1",
          gameId: "game_1",
          format: "best_of_1",
          gameNumber: 1,
          localPlayerId: "gp_self",
          participants: [
            {
              id: "gp_self",
              seat: 1,
              userId: "user_self",
              displayName: "Wazar Testing",
            },
            {
              id: "gp_opp",
              seat: 2,
              userId: "user_opp",
              displayName: "MrGMBH",
            },
          ],
        }}
      />,
    );

    const chatMessages = await screen.findAllByTestId("event-log-chat-message");
    expect(chatMessages).toHaveLength(2);
    expect(chatMessages[0]?.textContent).toContain("Rival");
    expect(chatMessages[0]?.textContent).toContain("Good luck!");
    expect(chatMessages[1]?.textContent).toContain("You");
    expect(chatMessages[1]?.textContent).toContain("Ready when you are.");

    // Log and chat collapsed into one unified feed (Flesh and Blood pattern):
    // the compose dock floats over the feed instead of a dedicated Chat tab.
    expect(screen.queryByRole("tab", { name: "Chat" })).toBeNull();
    expect(screen.queryByRole("tab", { name: "All" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Open chat composer" }));
    expect(await screen.findByTestId("chat-presets")).toBeTruthy();
    expect(screen.getByText("Quick replies").closest("details")?.open).toBe(true);
    fireEvent.click(screen.getAllByTestId("chat-quick")[0]);
    expect(sendPreset).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("chat-free-text-gate").textContent).toContain(
      "Free text requires opponent approval.",
    );
    fireEvent.click(screen.getByTestId("chat-request-free-text"));
    expect(requestFreeText).toHaveBeenCalledTimes(1);
  });

  test("keeps AI controls in the fixed automation summary popover", async () => {
    renderBoard(
      <BoardSharedPage
        scenarioId="gameStart"
        initialAi={{ player: null, opponent: null }}
        initialAiMode="step"
      />,
    );

    expect(screen.getByTestId("cyberpunk-practice-sidebar")).toBeTruthy();
    expect(screen.queryByTestId("ai-control-panel")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Opponent controls" }));
    expect(await screen.findByTestId("ai-control-panel")).toBeTruthy();
    expect(screen.getByTestId("ai-mode-auto")).toBeTruthy();
    expect(screen.queryByTestId("cyberpunk-human-match-sidebar")).toBeNull();
  });

  test("takes over and releases the bot seat from the closed automation strip", async () => {
    renderBoard(
      <BoardSharedPage
        scenarioId="gameStart"
        initialAi={{ player: null, opponent: AI_STRATEGIES[0]?.strategy ?? null }}
        initialAiMode="step"
      />,
    );

    const quickTakeover = screen.getByTestId("cyberpunk-practice-quick-take-control");
    expect(quickTakeover.textContent).toBe("Control opponent");
    expect(quickTakeover).not.toHaveProperty("disabled", true);
    expect(screen.getByTestId("cyberpunk-practice-quick-next")).toBeTruthy();
    expect(screen.getByTestId("cyberpunk-practice-quick-play")).toBeTruthy();
    expect(screen.queryByTestId("ai-control-panel")).toBeNull();

    const initialHand = within(screen.getByTestId("player-hand-dock"));
    for (const card of initialHand.getAllByTestId("hand-card")) {
      expect(card.getAttribute("data-face-down")).toBe("false");
      expect(card.getAttribute("data-definition-id")).not.toBeNull();
    }

    fireEvent.click(screen.getByTestId("cyberpunk-practice-quick-play"));
    expect(screen.getByTestId("cyberpunk-practice-quick-pause")).toBeTruthy();
    expect(screen.queryByTestId("cyberpunk-practice-quick-next")).toBeNull();
    fireEvent.click(screen.getByTestId("cyberpunk-practice-quick-pause"));
    expect(screen.getByTestId("cyberpunk-practice-quick-next")).toBeTruthy();
    expect(screen.getByTestId("cyberpunk-practice-quick-play")).toBeTruthy();

    fireEvent.click(quickTakeover);

    await waitFor(() => {
      expect(screen.getByTestId("cyberpunk-practice-quick-take-control").textContent).toBe(
        "Return to bot",
      );
    });
    expect(screen.getByRole("button", { name: "Opponent controls" }).textContent).toContain(
      "You control the opponent",
    );
    expect(screen.queryByTestId("ai-control-panel")).toBeNull();
    const controlledOpponentHand = within(screen.getByTestId("player-hand-dock"));
    for (const card of controlledOpponentHand.getAllByTestId("hand-card")) {
      expect(card.getAttribute("data-face-down")).toBe("false");
      expect(card.getAttribute("data-definition-id")).not.toBeNull();
    }

    fireEvent.click(screen.getByTestId("cyberpunk-practice-quick-take-control"));

    await waitFor(() => {
      expect(screen.getByTestId("cyberpunk-practice-quick-take-control").textContent).toBe(
        "Control opponent",
      );
    });
    expect(screen.getByRole("button", { name: "Opponent controls" }).textContent).toContain(
      "Paused · step",
    );
  });

  test("keeps play-both-sides controls manual and announces the controlled player", async () => {
    renderBoard(
      <BoardSharedPage
        practiceMode="self"
        scenarioId="opponentTurn"
        initialAi={{ player: null, opponent: null }}
        initialAiMode="step"
      />,
    );

    expect(
      screen
        .getAllByRole("status")
        .some((status) => status.textContent?.includes("Controlling Player 1")),
    ).toBe(true);
    expect(screen.queryByTestId("cyberpunk-practice-quick-next")).toBeNull();
    expect(screen.queryByTestId("cyberpunk-practice-quick-play")).toBeNull();
    expect(screen.getAllByTestId("self-practice-switch-seat")[0]?.textContent).toBe("Switch seat");
    fireEvent.click(screen.getAllByTestId("self-practice-switch-seat")[0]!);
    await waitFor(() => {
      expect(
        screen
          .getAllByRole("status")
          .some((status) => status.textContent?.includes("Controlling Player 2")),
      ).toBe(true);
    });
    expect(screen.queryByTestId("self-practice-switch-seat")).toBeNull();
    expect(screen.getByTestId("cyberpunk-practice-quick-take-control").textContent).toBe(
      "Switch to your seat",
    );
    fireEvent.click(screen.getByTestId("cyberpunk-practice-quick-take-control"));
    await waitFor(() => {
      expect(
        screen
          .getAllByRole("status")
          .some((status) => status.textContent?.includes("Controlling Player 1")),
      ).toBe(true);
    });
    expect(screen.getAllByTestId("self-practice-switch-seat")).toHaveLength(1);
    fireEvent.click(screen.getByRole("button", { name: "Opponent controls" }));
    expect(screen.queryByTestId("ai-control-panel")).toBeNull();
    expect(screen.getByTestId("cyberpunk-self-control-status").textContent).toContain(
      "Automation is off",
    );
  });

  test("identifies a deck-plan-bound strategy and keeps the plan across strategy changes", async () => {
    const profile: DeckStrategyProfile = {
      deckId: "authored-sidebar-test-deck",
      plan: "Sidebar test plan",
      coreCards: [],
    };
    const bound = withDeckProfile(AI_STRATEGIES[0]?.strategy, profile);
    renderBoard(
      <BoardSharedPage
        scenarioId="gameStart"
        initialAi={{ player: null, opponent: bound }}
        initialAiMode="step"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Opponent controls" }));
    const panel = await screen.findByTestId("ai-control-panel");
    expect(panel.getAttribute("data-strategy-id")).toBe("default");
    expect(panel.textContent).not.toContain("No strategy");
    expect(panel.textContent).toContain("Deck plan bound");

    fireEvent.change(screen.getByTestId("ai-strategy"), { target: { value: "tactical" } });
    await waitFor(() => {
      expect(screen.getByTestId("ai-control-panel").getAttribute("data-strategy-id")).toBe(
        "tactical",
      );
    });
    expect(screen.getByTestId("ai-control-panel").textContent).toContain("Deck plan bound");
  });

  test("lands practice chat from the floating dock in the unified feed", async () => {
    renderBoard(
      <BoardSharedPage
        scenarioId="gameStart"
        initialAi={{ player: null, opponent: null }}
        initialAiMode="step"
      />,
    );

    expect(screen.getByTestId("cyberpunk-practice-sidebar")).toBeTruthy();
    expect(screen.queryByTestId("event-log-chat-message")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Open chat composer" }));
    expect(await screen.findByTestId("chat-presets")).toBeTruthy();
    fireEvent.click(screen.getAllByTestId("chat-quick")[0]);
    const chatRows = await screen.findAllByTestId("event-log-chat-message");
    expect(chatRows.some((row) => row.textContent.includes("Good luck!"))).toBe(true);
    expect(chatRows.some((row) => row.textContent.includes("You"))).toBe(true);
  });
});
