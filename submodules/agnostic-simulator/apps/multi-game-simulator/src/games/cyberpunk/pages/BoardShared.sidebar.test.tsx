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
import { AI_STRATEGIES, UserConfigProvider, getScenario } from "../engine";
import { createLiveMatchViewerEngine } from "../engine/live/liveState";
import { theme } from "../theme";
import { BoardSharedPage } from "./BoardShared.page";
import { CYBERPUNK_PAYMENT_DISCOVERY_STORAGE_KEY } from "../components/PaymentSelection/PaymentSelectionPlayerAction";

vi.mock("../animation", async () => {
  const actual = await vi.importActual<typeof import("../animation")>("../animation");
  return {
    ...actual,
    CyberpunkSharedAnimationLayer: ({ children }: { children: ReactNode }) => children,
    SoundPlayer: () => null,
  };
});

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

function renderHumanMatchSidebar(options: { opponentUserId?: string } = {}) {
  return renderBoard(
    <BoardSharedPage
      scenarioId="gameStart"
      initialAi={{ player: null, opponent: null }}
      initialAiMode="step"
      playerConnections={{
        player: { status: "connected", connected: true },
        opponent: { status: "connected", connected: true },
      }}
      liveMatchSidebar={{
        matchId: "match_1",
        gameId: "game_1",
        localPlayerId: "gp_self",
        player1Score: 1,
        player2Score: 0,
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
  } = {},
) {
  return renderBoard(
    <BoardSharedPage
      scenarioId="gameStart"
      initialEngineBuilder={options.initialEngineBuilder}
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
    expect(screen.getByTestId("human-sidebar-opponent").textContent).toContain("MrGMBH");
    expect(screen.getByTestId("human-sidebar-self").textContent).toContain("Wazar Testing");
    expect(screen.getByTestId("human-sidebar-opponent").textContent).toContain("1510 MMR");
    expect(screen.getByTestId("human-sidebar-self").textContent).toContain("1425 MMR");
    fireEvent.click(screen.getByRole("button", { name: "Open MrGMBH actions" }));
    expect(screen.getByRole("menuitem", { name: "Add friend" })).toBeTruthy();
    expect(screen.getByRole("menuitem", { name: "Report player" })).toBeTruthy();
    fireEvent.click(screen.getByRole("menuitem", { name: "Report player" }));
    expect(screen.getByRole("dialog", { name: "Report MrGMBH" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Close report mrgmbh" }));

    fireEvent.click(screen.getByRole("button", { name: "Open your player actions" }));
    expect(screen.getByRole("menuitem", { name: "Choose payment for next cost" })).toBeTruthy();
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
    expect(screen.getByRole("dialog", { name: "MrGMBH connection details" })).toBeTruthy();
    expect(screen.getByText("Rival presence is live")).toBeTruthy();
    expect(screen.getAllByText("Connected").length).toBeGreaterThan(0);
    fireEvent.click(screen.getByText("Technical details"));
    expect(screen.queryByText("dl_secret_opp")).toBeNull();
  });

  test("advertises manual payment once and keeps the control in Player Info", async () => {
    renderHumanMatchSidebar({ opponentUserId: "user_opp" });

    expect(await screen.findByLabelText("Choose how you pay")).toBeTruthy();
    const shortcut = screen.getByRole("button", { name: "Choose payment for next cost" });
    expect(shortcut.getAttribute("aria-pressed")).toBe("false");

    fireEvent.pointerEnter(shortcut);
    expect((await screen.findByRole("tooltip")).textContent).toBe(
      "Choose the eligible Eddies or Legends spent for your next cost instead of paying automatically.",
    );

    fireEvent.click(shortcut);
    expect(window.localStorage.getItem(CYBERPUNK_PAYMENT_DISCOVERY_STORAGE_KEY)).toBe("dismissed");
    const armedShortcut = screen.getByRole("button", {
      name: "Manual payment armed for next cost",
    });
    expect(armedShortcut.getAttribute("aria-pressed")).toBe("true");

    fireEvent.click(screen.getByRole("button", { name: "Open your player actions" }));
    const armedPayment = screen.getByRole("menuitem", {
      name: "Manual payment armed for next cost",
    });
    expect(armedPayment.getAttribute("aria-pressed")).toBe("true");
    fireEvent.click(armedPayment);
    expect(
      screen
        .getByRole("button", { name: "Choose payment for next cost" })
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

  test("keeps a seated player's setup hand visible while the rival mulligan is pending", () => {
    const source = getScenario("gameStart").build();
    const state = source.getState();
    const seatedPlayerId = state.ctx.playerIds[0]!;
    const rivalPlayerId = state.ctx.playerIds[1]!;
    state.G.players[String(seatedPlayerId)]!.firstPlayer = true;
    state.G.players[String(seatedPlayerId)]!.mulliganDone = true;
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
    expect(screen.getByRole("dialog", { name: "MrGMBH connection details" })).toBeTruthy();
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
        scenarioId="gameStart"
        initialAi={{ player: null, opponent: AI_STRATEGIES[0]?.strategy ?? null }}
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
    fireEvent.click(screen.getByRole("button", { name: "Opponent controls" }));
    expect(screen.queryByTestId("ai-control-panel")).toBeNull();
    expect(screen.getByTestId("cyberpunk-self-control-status").textContent).toContain(
      "Automation is off",
    );
    fireEvent.click(screen.getByTestId("cyberpunk-practice-quick-take-control"));
    await waitFor(() => {
      expect(
        screen
          .getAllByRole("status")
          .some((status) => status.textContent?.includes("Controlling Player 2")),
      ).toBe(true);
    });
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
