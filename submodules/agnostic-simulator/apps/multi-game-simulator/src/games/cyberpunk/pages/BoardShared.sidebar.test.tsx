// @vitest-environment jsdom

import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";

import { CardPreviewProvider } from "../components/CardPreview/CardPreviewContext";
import { UserConfigProvider } from "../engine";
import { theme } from "../theme";
import { BoardSharedPage } from "./BoardShared.page";

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
    fireEvent.click(screen.getByRole("button", { name: "Player actions" }));
    expect(screen.getByRole("menuitem", { name: "Add friend" })).toBeTruthy();
    expect(screen.getByRole("menuitem", { name: "Report player" })).toBeTruthy();
    expect(screen.getByRole("menuitem", { name: "Report bug" })).toBeTruthy();
    expect(screen.getByRole("menuitem", { name: "Request feature" })).toBeTruthy();
    expect(screen.getByRole("menuitem", { name: "Share feedback" })).toBeTruthy();
    expect(screen.getByLabelText("Open simulator settings")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "MrGMBH connection status: Connected" }));
    expect(screen.getByRole("dialog", { name: "MrGMBH connection details" })).toBeTruthy();
    expect(screen.getByText("Rival presence is live")).toBeTruthy();
    expect(screen.getByText("Connected")).toBeTruthy();
    fireEvent.click(screen.getByText("Technical details"));
    expect(screen.queryByText("dl_secret_opp")).toBeNull();

    fireEvent.click(screen.getByRole("menuitem", { name: "Report player" }));
    expect(screen.getByRole("dialog", { name: "Report MrGMBH" })).toBeTruthy();
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

    fireEvent.click(screen.getByRole("button", { name: "Player actions" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Add friend" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(fetchUrl(fetchCalls[0])).toContain("/friends/by-user/user_opp");
    expect(fetchJsonBody(fetchCalls[0])).toMatchObject({
      matchId: "match_1",
      gameId: "game_1",
    });

    fireEvent.click(screen.getByRole("button", { name: "Player actions" }));
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

    fireEvent.click(screen.getByRole("button", { name: "Player actions" }));
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
      source: "cyberpunk-live-match-sidebar",
      context: {
        gameId: "game_1",
        gameSlug: "cyberpunk",
        matchId: "match_1",
        platform: "desktop",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Player actions" }));
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
      source: "cyberpunk-live-match-sidebar",
    });

    fireEvent.click(screen.getByRole("button", { name: "Player actions" }));
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
      source: "cyberpunk-live-match-sidebar",
    });
  });

  test("keeps disconnect claim available in human matches", () => {
    const onClaimRivalDrop = vi.fn();
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
            disconnectedAt: new Date(Date.now() - 31_000).toISOString(),
          },
        }}
        onClaimRivalDrop={onClaimRivalDrop}
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

    expect(screen.getByText("Connection lost").closest('[role="status"]')).toBeTruthy();
    expect(screen.getByText("Actions are paused.")).toBeTruthy();
    expect(screen.getByText(/Wait for this to clear/)).toBeTruthy();
  });

  test("integrates chat messages into the human event log and keeps compose controls in the floating chat bubble", () => {
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

    const logMessages = screen.getAllByTestId("event-log-chat-message");
    expect(logMessages).toHaveLength(2);
    expect(logMessages[0].textContent).toContain("Rival");
    expect(logMessages[0].textContent).toContain("Good luck!");
    expect(logMessages[1].textContent).toContain("You");
    expect(logMessages[1].textContent).toContain("Ready when you are.");

    fireEvent.click(screen.getByLabelText("Open chat controls"));
    expect(screen.getByTestId("chat-presets")).toBeTruthy();
    expect(screen.queryByTestId("chat-messages")).toBeNull();
    fireEvent.click(screen.getAllByTestId("chat-quick")[0]);
    expect(sendPreset).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByTestId("chat-request-free-text"));
    expect(requestFreeText).toHaveBeenCalledTimes(1);
  });

  test("keeps the AI sidebar when no human match metadata is provided", () => {
    renderBoard(
      <BoardSharedPage
        scenarioId="gameStart"
        initialAi={{ player: null, opponent: null }}
        initialAiMode="step"
      />,
    );

    expect(screen.getByTestId("cyberpunk-practice-sidebar")).toBeTruthy();
    expect(screen.getByTestId("ai-control-panel")).toBeTruthy();
    expect(screen.queryByTestId("cyberpunk-human-match-sidebar")).toBeNull();
  });

  test("shows chat controls in the bot sidebar and feeds messages into the event log", () => {
    renderBoard(
      <BoardSharedPage
        scenarioId="gameStart"
        initialAi={{ player: null, opponent: null }}
        initialAiMode="step"
      />,
    );

    expect(screen.getByTestId("cyberpunk-practice-sidebar")).toBeTruthy();
    expect(screen.queryByTestId("event-log-chat-message")).toBeNull();

    fireEvent.click(screen.getByLabelText("Open chat controls"));
    expect(screen.getByTestId("chat-presets")).toBeTruthy();
    expect(screen.queryByTestId("chat-messages")).toBeNull();
    expect(screen.getByLabelText("Close chat popover")).toBeTruthy();

    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByTestId("chat-presets")).toBeNull();

    fireEvent.click(screen.getByLabelText("Open chat controls"));
    expect(screen.getByTestId("chat-presets")).toBeTruthy();
    fireEvent.click(screen.getByLabelText("Close chat popover"));
    expect(screen.queryByTestId("chat-presets")).toBeNull();

    fireEvent.click(screen.getByLabelText("Open chat controls"));
    expect(screen.getByTestId("chat-presets")).toBeTruthy();

    fireEvent.click(screen.getAllByTestId("chat-quick")[0]);

    const logMessage = screen.getByTestId("event-log-chat-message");
    expect(logMessage.textContent).toContain("You");
    expect(logMessage.textContent).toContain("Good luck!");
  });
});
