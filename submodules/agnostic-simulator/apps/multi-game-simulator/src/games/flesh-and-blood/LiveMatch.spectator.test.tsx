import type { GatewayConnectionState } from "@tcg/gateway-client";
// @vitest-environment jsdom
import { MantineProvider } from "@mantine/core";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { installBrowserShims } from "../../testing/browser-shims";
import { FleshAndBloodSimulatorProviders } from "./App";
import { testPresentationEnvelope } from "./presentation-test-provider";
import { createOpeningFixtureRuntime } from "./fixtures";
import { LiveMatchPage } from "./LiveMatch.page";

const mocks = vi.hoisted(() => ({
  emit: vi.fn(),
  join: vi.fn(),
  leave: vi.fn(),
  release: vi.fn(),
  on: vi.fn<(event: string, callback: (payload: object) => void) => () => void>(() => vi.fn()),
  subscribeState: vi.fn<(callback: (state: GatewayConnectionState) => void) => () => void>(
    (callback) => {
      callback({
        status: "connected",
        authenticated: true,
        connectionId: "test",
        authMethod: "jwt",
        authStatus: "ok",
        authFailureReason: null,
        error: null,
        reconnectAttempt: 0,
        latencyMs: null,
      });
      return vi.fn();
    },
  ),
  route: vi.fn(),
}));

vi.mock("../../simulator/providers", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../../simulator/providers")>()),
  useSimulatorRoute: () => mocks.route(),
}));
vi.mock("react-router-dom", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react-router-dom")>()),
  useParams: () => ({ matchId: "spectator-fixture" }),
}));
vi.mock("../../lib/gateway/root-socket", () => ({
  acquireRootGatewayHandle: () => ({
    emit: mocks.emit,
    join: mocks.join,
    leave: mocks.leave,
    release: mocks.release,
    on: mocks.on,
    slug: "flesh-and-blood",
    subscribeState: mocks.subscribeState,
    getState: () => ({ authenticated: true }),
    onAny: (callback: (event: string, payload: object) => void) => {
      callback("game_joined", { gameId: "game-1" });
      return vi.fn();
    },
    onLatency: () => vi.fn(),
    onHeartbeatAck: () => vi.fn(),
  }),
}));

// Simulator wiring contract: real authored opening cards and the engine's
// public spectator projection, with only the HTTP/gateway transport replaced.
function spectatorRoute(userId?: string) {
  const runtime = createOpeningFixtureRuntime();
  const viewer = { role: "spectator" } as const;
  const view = runtime.viewer(viewer);
  const resources = runtime.viewerResources(viewer);
  return {
    error: null,
    session: null,
    matchPageData: {
      viewer: {
        role: "spectator",
        spectatorId: "anonymous-fixture",
        ...(userId ? { userId } : {}),
        permissions: { act: false, concede: false, spectate: true },
      },
      match: {
        participants: view.playerIds.map((id, index) => ({
          id,
          displayName: index === 0 ? "Alice" : "Bob",
        })),
      },
      presence: { players: [] },
      game: {
        gameId: "spectator-game",
        stateVersion: 1,
        view,
        resources,
        presentation: testPresentationEnvelope,
      },
    },
  };
}

function renderMatch() {
  return render(
    <MantineProvider>
      <FleshAndBloodSimulatorProviders>
        <LiveMatchPage />
      </FleshAndBloodSimulatorProviders>
    </MantineProvider>,
  );
}

describe("FAB public live spectating", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    installBrowserShims();
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 1440 });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 404 }));
    window.history.replaceState(
      null,
      "",
      "/flesh-and-blood/simulator/matches/spectator-fixture/games/spectator-game?returnTo=%2Fflesh-and-blood%2Fmatchmaking%3Fmode%3Dranked",
    );
  });
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    window.history.replaceState(null, "", "/");
  });

  it.each([undefined, "logged-in-outsider"])(
    "renders a read-only public board for spectator %s without revealing either hand",
    async (userId) => {
      mocks.route.mockReturnValue(spectatorRoute(userId));
      renderMatch();

      await screen.findByTestId("fab-tabletop");
      expect(screen.getByText("Watching live")).toBeTruthy();
      expect(screen.getByText("Alice’s perspective")).toBeTruthy();
      expect(screen.getByText("Private cards stay hidden.")).toBeTruthy();
      expect(screen.getByRole("tab", { name: "Spectating" })).toBeTruthy();
      expect(screen.getByRole("link", { name: "Back to matchmaking" }).getAttribute("href")).toBe(
        "/flesh-and-blood/matchmaking?mode=ranked",
      );
      expect(screen.getByTestId("fab-sidebar-self").textContent).toContain("Alice");
      expect(screen.getByTestId("fab-sidebar-opponent").textContent).toContain("Bob");
      for (const label of [/Your hand, \d+ cards/, /Opponent hand, \d+ cards/]) {
        const hand = screen.getByLabelText(label);
        const cards = within(hand).getAllByRole("button", { name: /Hidden card/ });
        expect(cards.length).toBeGreaterThan(0);
        expect(hand.textContent).not.toContain("Image unavailable");
        expect(hand.textContent).not.toContain("visible only to you");
        fireEvent.click(cards[0]);
      }
      fireEvent.keyDown(window, { key: " ", code: "Space" });
      expect(screen.queryByRole("button", { name: /Concede match/ })).toBeNull();
      expect(screen.queryByTestId("fab-action-undo")).toBeNull();
      expect(screen.queryByTestId("fab-action-pass-priority")).toBeNull();
      expect(screen.queryByRole("button", { name: /Open your player actions/ })).toBeNull();
      expect(mocks.emit).not.toHaveBeenCalledWith("submit_interaction", expect.anything());
      expect(mocks.join).toHaveBeenCalledWith({ gameId: "spectator-game", stateVersion: 1 });
      expect(screen.queryByRole("alert")).toBeNull();
    },
  );

  it("accepts action-free reconnect/live snapshots and shows a neutral completed result", async () => {
    const route = spectatorRoute();
    mocks.route.mockReturnValue(route);
    renderMatch();
    await screen.findByTestId("fab-tabletop");
    const { view, resources } = route.matchPageData.game;
    for (const event of ["game_joined", "state_sync", "state_update"]) {
      const callback = mocks.on.mock.calls.find(([name]) => name === event)?.[1];
      if (!callback) throw new Error(`Missing ${event} subscription`);
      act(() =>
        callback({
          gameId: "spectator-game",
          stateVersion: 2,
          state: view,
          resources,
          players: route.matchPageData.presence.players,
        }),
      );
      expect(screen.queryByRole("alert")).toBeNull();
    }
    expect(mocks.emit).not.toHaveBeenCalledWith("request_game_state_sync", expect.anything());

    const update = mocks.on.mock.calls.find(([name]) => name === "state_update")?.[1];
    if (!update) throw new Error("Missing live update subscription");
    act(() =>
      update({
        gameId: "spectator-game",
        stateVersion: 3,
        state: { ...view, gameEnded: true, winnerId: view.playerIds[1], endReason: "concede" },
        resources,
      }),
    );
    expect(await screen.findByRole("heading", { name: "Bob wins" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Inspect board" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(screen.getByTestId("fab-tabletop")).toBeTruthy();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("discards the seated player's private board when the same game becomes anonymous", async () => {
    const runtime = createOpeningFixtureRuntime();
    const actorId = runtime.playerIds()[0];
    if (!actorId) throw new Error("Missing first seat");
    const player = { role: "player", actorId } as const;
    const publicRoute = spectatorRoute();
    mocks.route.mockReturnValue({
      ...publicRoute,
      matchPageData: {
        ...publicRoute.matchPageData,
        viewer: { ...player, permissions: { act: false, concede: false } },
        game: {
          ...publicRoute.matchPageData.game,
          stateVersion: 10,
          view: runtime.viewer(player),
          resources: runtime.viewerResources(player),
        },
      },
    });
    const rendered = renderMatch();
    await screen.findByTestId("fab-tabletop");
    expect(
      within(screen.getByLabelText(/Your hand, \d+ cards/)).getByRole("button", {
        name: /Alpha Rampage/,
      }),
    ).toBeTruthy();

    // The incoming public bootstrap can be older than the private live snapshot.
    // Principal changes must reset the cache, not discard it as a stale update.
    mocks.route.mockReturnValue(publicRoute);
    rendered.rerender(
      <MantineProvider>
        <FleshAndBloodSimulatorProviders>
          <LiveMatchPage />
        </FleshAndBloodSimulatorProviders>
      </MantineProvider>,
    );
    const hand = screen.getByLabelText(/Your hand, \d+ cards/);
    expect(within(hand).queryByRole("button", { name: /Alpha Rampage/ })).toBeNull();
    expect(within(hand).getAllByRole("button", { name: /Hidden card/ })).toHaveLength(4);
    expect(screen.queryByRole("alert")).toBeNull();
  });
});
