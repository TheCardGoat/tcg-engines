// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import { SimulatorViewportShell } from "@tcg/simulator-ui";

import {
  SimulatorOpponentParticipantActions,
  SimulatorSelfParticipantActions,
} from "./SimulatorParticipantActions";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("desktop participant actions", () => {
  test("keeps the selected settings tab when responsive chrome removes the menu host", () => {
    const menuHost = document.createElement("div");
    document.body.append(menuHost);
    const props = {
      gameConfiguration: { onSelect: vi.fn() },
      support: { source: "responsive-settings", gameSlug: "gundam" as const },
    };
    const { rerender } = render(
      <SimulatorSelfParticipantActions {...props} menuHost={menuHost} viewportLayout="desktop" />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Open your player actions" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Settings" }));
    fireEvent.click(screen.getByRole("tab", { name: "Account" }));

    rerender(
      <SimulatorSelfParticipantActions {...props} menuHost={null} viewportLayout="mobile" />,
    );
    menuHost.remove();
    expect(screen.getByRole("dialog", { name: "Settings" })).toBeTruthy();
    expect(screen.getByRole("tab", { name: "Account" }).getAttribute("aria-selected")).toBe("true");
    expect(screen.queryByRole("button", { name: "Open your player actions" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Close settings" }));
    expect(screen.queryByRole("dialog", { name: "Settings" })).toBeNull();
  });

  test("combines simulator, game, and account settings in one tabbed dialog", () => {
    const openGameConfiguration = vi.fn();
    render(
      <SimulatorSelfParticipantActions
        gameConfiguration={{
          requiresConfirmation: false,
          settings: <div>Game-specific preferences</div>,
          onSelect: openGameConfiguration,
        }}
        support={{ source: "test-participant-menu", gameSlug: "flesh-and-blood" }}
      />,
    );

    const trigger = screen.getByRole("button", { name: "Open your player actions" });
    fireEvent.pointerEnter(trigger);
    expect(screen.getByRole("tooltip").textContent).toBe("Open your player actions");
    fireEvent.click(trigger);
    expect(screen.queryByRole("tooltip")).toBeNull();

    expect(screen.getByRole("menuitem", { name: "Settings" })).toBeTruthy();
    expect(screen.getByRole("menuitem", { name: "Report bug" })).toBeTruthy();
    expect(screen.getByRole("menuitem", { name: "Request feature" })).toBeTruthy();
    expect(screen.getByRole("menuitem", { name: "Share feedback" })).toBeTruthy();

    fireEvent.click(screen.getByRole("menuitem", { name: "Settings" }));
    expect(screen.getByRole("dialog", { name: "Settings" })).toBeTruthy();
    expect(screen.getAllByRole("tab").map((tab) => tab.textContent)).toEqual([
      "Simulator",
      "Game",
      "Account",
    ]);
    fireEvent.click(screen.getByRole("tab", { name: "Account" }));
    expect(screen.getByRole("link", { name: "Open account settings" }).getAttribute("href")).toBe(
      "/dashboard/settings",
    );
    fireEvent.click(screen.getByRole("tab", { name: "Game" }));
    expect(screen.getByText("Game-specific preferences")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Open configuration" }));
    expect(openGameConfiguration).toHaveBeenCalledTimes(1);
  });

  test("moves tab selection and focus with arrow keys and keeps panels mounted", () => {
    render(
      <SimulatorSelfParticipantActions
        gameConfiguration={{
          settings: <div>Game-specific preferences</div>,
          onSelect: vi.fn(),
        }}
        support={{ source: "test-participant-menu", gameSlug: "flesh-and-blood" }}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Open your player actions" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Settings" }));

    // Roving tabindex: only the selected tab participates in the tab order.
    const tabs = screen.getAllByRole("tab");
    expect(tabs.map((tab) => tab.tabIndex)).toEqual([0, -1, -1]);
    // Every aria-controls id resolves: inactive panels stay mounted, hidden.
    for (const tab of tabs) {
      const panelId = tab.getAttribute("aria-controls");
      expect(panelId).not.toBeNull();
      const panel = document.getElementById(panelId!);
      expect(panel).not.toBeNull();
      expect(panel!.getAttribute("role")).toBe("tabpanel");
    }
    expect(document.getElementById("simulator-settings-panel-simulator")!.hidden).toBe(false);
    expect(document.getElementById("simulator-settings-panel-game")!.hidden).toBe(true);

    fireEvent.keyDown(screen.getByRole("tab", { name: "Simulator" }), { key: "ArrowRight" });
    expect(screen.getByRole("tab", { name: "Game" }).getAttribute("aria-selected")).toBe("true");
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: "Game" }));
    expect(document.getElementById("simulator-settings-panel-game")!.hidden).toBe(false);
    expect(document.getElementById("simulator-settings-panel-simulator")!.hidden).toBe(true);

    // End jumps to the last tab; ArrowLeft walks back from there.
    fireEvent.keyDown(screen.getByRole("tab", { name: "Game" }), { key: "End" });
    expect(screen.getByRole("tab", { name: "Account" }).getAttribute("aria-selected")).toBe("true");
    fireEvent.keyDown(screen.getByRole("tab", { name: "Account" }), { key: "ArrowLeft" });
    expect(screen.getByRole("tab", { name: "Game" }).getAttribute("aria-selected")).toBe("true");
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: "Game" }));
  });

  test("confirms configuration changes through the change-game dialog by default", () => {
    const openGameConfiguration = vi.fn();
    render(
      <SimulatorSelfParticipantActions
        gameConfiguration={{
          settings: <div>Game-specific preferences</div>,
          onSelect: openGameConfiguration,
        }}
        support={{ source: "test-participant-menu", gameSlug: "flesh-and-blood" }}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Open your player actions" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Settings" }));
    fireEvent.click(screen.getByRole("tab", { name: "Game" }));
    fireEvent.click(screen.getByRole("button", { name: "Open configuration" }));

    // Default branch: the settings dialog is replaced by the confirmation.
    expect(screen.queryByRole("dialog", { name: "Settings" })).toBeNull();
    expect(screen.getByRole("dialog", { name: "Change game configuration?" })).toBeTruthy();
    expect(openGameConfiguration).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    expect(openGameConfiguration).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("dialog", { name: "Change game configuration?" })).toBeNull();
  });

  test("keeps bot takeover contextual and reversible", () => {
    const toggleTakeover = vi.fn();
    const { rerender } = render(
      <SimulatorOpponentParticipantActions
        participant={{ kind: "bot", displayName: "Practice bot" }}
        onToggleTakeover={toggleTakeover}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Open Practice bot actions" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Take over seat" }));
    expect(toggleTakeover).toHaveBeenCalledTimes(1);

    rerender(
      <SimulatorOpponentParticipantActions
        participant={{ kind: "bot", displayName: "Practice bot" }}
        takeoverActive
        onToggleTakeover={toggleTakeover}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Open Practice bot actions" }));
    expect(screen.getByRole("menuitem", { name: "Return to your seat" })).toBeTruthy();
  });

  test("submits a human opponent report with match identity", async () => {
    const fetchCalls: Array<{ input: RequestInfo | URL; init?: RequestInit }> = [];
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      fetchCalls.push({ input, init });
      return new Response("{}", { status: 200 });
    });
    vi.stubGlobal("fetch", fetchMock);
    render(
      <SimulatorOpponentParticipantActions
        participant={{
          kind: "human",
          gameProfileId: "profile_opponent",
          userId: "user_opponent",
          displayName: "Opponent",
          connected: true,
        }}
        match={{ matchId: "match_1", gameId: "game_1", gameSlug: "gundam" }}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Open Opponent actions" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Report player" }));
    fireEvent.change(screen.getByLabelText("Reason"), { target: { value: "stalling" } });
    fireEvent.change(screen.getByLabelText("Details"), {
      target: { value: "Stopped responding during priority." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Submit report" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const requestBody = fetchCalls[0]?.init?.body;
    if (typeof requestBody !== "string") {
      throw new Error("Expected the report request body to be JSON text.");
    }
    expect(JSON.parse(requestBody)).toEqual({
      reportedGameProfileId: "profile_opponent",
      matchId: "match_1",
      gameId: "game_1",
      reason: "stalling",
      details: "Stopped responding during priority.",
    });
  });

  test("submits bug reports with the game shell's active mobile layout", async () => {
    const fetchMock = vi.fn(
      async (_input: RequestInfo | URL, _init?: RequestInit) => new Response("{}", { status: 200 }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const participantActions = (
      <SimulatorSelfParticipantActions
        gameConfiguration={{ onSelect: vi.fn() }}
        support={{
          source: "test-participant-menu",
          gameSlug: "flesh-and-blood",
          matchId: "match_mobile",
          gameId: "game_mobile",
        }}
      />
    );
    render(
      <SimulatorViewportShell
        layoutOverride="mobile"
        tabletop={<div>Tabletop</div>}
        sidebar={<div>Desktop sidebar</div>}
        mobilePanel={participantActions}
        mobileTopRail={({ openSidebar }) => (
          <button type="button" onClick={openSidebar}>
            Open mobile panel
          </button>
        )}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Open mobile panel" }));
    fireEvent.click(screen.getByRole("button", { name: "Open your player actions" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Report bug" }));
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "Actions overlap on a narrow viewport." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const requestBody = fetchMock.mock.calls[0]?.[1]?.body;
    if (typeof requestBody !== "string") {
      throw new Error("Expected the bug report request body to be JSON text.");
    }
    expect(JSON.parse(requestBody)).toMatchObject({
      context: {
        platform: "mobile",
        matchId: "match_mobile",
        gameId: "game_mobile",
      },
    });
  });
});
