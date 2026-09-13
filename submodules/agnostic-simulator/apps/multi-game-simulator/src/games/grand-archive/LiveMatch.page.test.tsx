// @vitest-environment jsdom
import { createGrandArchiveCatalogSmokeFixture } from "@tcg/grand-archive-engine/automation";
import { GrandArchiveMatchRuntime } from "@tcg/grand-archive-engine/simulator";
import { GrandArchiveServerEngine } from "@tcg/grand-archive-server-adapter";
import { buildInteractionSubmission, type InteractionSubmission } from "@tcg/protocol";
import type { GrandArchiveHarnessFixture } from "./fixtureProjection";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";

const mocks = vi.hoisted(() => ({
  emit: vi.fn(),
  submissionResult: vi.fn(),
  join: vi.fn(),
  leave: vi.fn(),
  release: vi.fn(),
  listeners: new Map<string, (payload: never) => void>(),
  on: vi.fn((event: string, listener: (payload: never) => void) => {
    mocks.listeners.set(event, listener);
    return vi.fn();
  }),
  onDisconnected: vi.fn((listener: () => void) => {
    mocks.listeners.set("disconnect", listener);
    return vi.fn();
  }),
  acquire: vi.fn(),
  route: vi.fn(),
  refresh: vi.fn(async () => {}),
}));

vi.mock("../../simulator/MatchSessionProvider", () => ({
  useMatchSession: () => ({ refresh: mocks.refresh, refreshing: false, error: null }),
}));

vi.mock("../../simulator/providers", () => ({
  useSimulatorRoute: () => mocks.route(),
}));

vi.mock("../../lib/gateway/root-socket", () => ({
  acquireRootGatewayHandle: () => mocks.acquire(),
}));

vi.mock("./GrandArchiveTabletop", () => ({
  GrandArchiveTabletop: ({
    fixture,
    onSubmitProtocolInteraction,
    chat,
    canUndo,
    onUndo,
    errorMessage,
  }: {
    readonly fixture: GrandArchiveHarnessFixture;
    readonly onSubmitProtocolInteraction?: (submission: InteractionSubmission) => boolean;
    readonly chat?: ReactNode;
    readonly canUndo?: boolean;
    readonly onUndo?: () => void;
    readonly errorMessage?: string;
  }) => (
    <>
      {chat}
      <button
        type="button"
        onClick={() =>
          mocks.submissionResult(
            onSubmitProtocolInteraction?.(
              buildInteractionSubmission({
                view: fixture.interactionView!,
                action: fixture.interactionView!.actions[0]!,
              }),
            ),
          )
        }
      >
        Submit live action
      </button>
      <output data-testid="live-fixture">
        {JSON.stringify({
          seats: fixture.table.seats,
          eventLog: fixture.eventLog,
          interactions: fixture.interactions,
        })}
      </output>
      <button type="button" disabled={!canUndo} onClick={onUndo}>
        Undo live move
      </button>
      {errorMessage ? <p role="alert">{errorMessage}</p> : null}
    </>
  ),
}));

import {
  appendEngineLogs,
  eventEntriesFromEngineLogs,
  GrandArchiveLiveMatchPage,
  grandArchiveNextGameHref,
} from "./LiveMatch.page";

function liveBootstrap() {
  const { program, initialState } = createGrandArchiveCatalogSmokeFixture(20260826);
  const server = new GrandArchiveServerEngine(
    program,
    new GrandArchiveMatchRuntime(program, initialState),
  );
  const viewerId = initialState.turnOrder[0]!;
  return {
    server,
    viewerId,
    route: {
      error: null,
      matchPageData: {
        game: {
          gameId: "game-1",
          stateVersion: initialState.stateVersion,
          view: server.getViewerState({ role: "player" as const, actorId: viewerId }),
          resources: server.getViewerResources({ role: "player" as const, actorId: viewerId }),
          interactionView: server.getInteractionView(viewerId),
          undoable: false,
        },
        match: {
          matchId: "match-1",
          participants: [
            { id: "p1", displayName: "Player One", isBot: false },
            { id: "p2", displayName: "Player Two", isBot: false },
          ],
        },
        presence: {
          players: [
            { id: "p1", connected: true },
            { id: "p2", connected: true },
          ],
        },
        viewer: { role: "player" as const, actorId: viewerId, permissions: { chat: true } },
        capabilities: { conceding: true },
        history: { engineLogs: [], chatMessages: [], freeTextEnabled: false },
      },
    },
  };
}

function emitGateway<T>(event: string, payload: T): void {
  const listener = mocks.listeners.get(event) as ((value: T) => void) | undefined;
  listener?.(payload);
}

describe("Grand Archive live match", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.listeners.clear();
    mocks.acquire.mockReturnValue({
      emit: mocks.emit,
      join: mocks.join,
      leave: mocks.leave,
      release: mocks.release,
      on: mocks.on,
      onDisconnected: mocks.onDisconnected,
    });
    vi.stubGlobal("crypto", { randomUUID: () => "correlation-1" });
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("renders the viewer projection and submits the selected protocol interaction", async () => {
    const { server, viewerId, route } = liveBootstrap();
    const interactionView = server.getInteractionView(viewerId);
    mocks.route.mockReturnValue(route);

    render(<GrandArchiveLiveMatchPage />);
    expect(mocks.join).toHaveBeenCalledWith({ gameId: "game-1" });
    fireEvent.click(screen.getByRole("button", { name: "Submit live action" }));
    expect(mocks.emit).not.toHaveBeenCalledWith("submit_interaction", expect.anything());
    act(() => emitGateway("game_joined", { gameId: "game-1" }));
    fireEvent.click(screen.getByRole("button", { name: "Submit live action" }));

    const action = interactionView.actions[0]!;
    await waitFor(() =>
      expect(mocks.emit).toHaveBeenCalledWith("submit_interaction", {
        gameId: "game-1",
        expectedVersion: interactionView.stateVersion,
        submission: {
          protocolVersion: interactionView.protocolVersion,
          requestId: action.requestId,
          actionId: action.id,
          stateVersion: interactionView.stateVersion,
          values: {},
        },
        correlationId: "correlation-1",
      }),
    );

    expect(mocks.submissionResult).toHaveBeenLastCalledWith(true);
    expect(mocks.emit.mock.calls.filter(([event]) => event === "submit_interaction")).toHaveLength(
      1,
    );

    fireEvent.click(screen.getAllByTestId("chat-quick")[0]!);
    expect(mocks.emit).toHaveBeenCalledWith("send_chat_message", {
      gameId: "game-1",
      presetKey: expect.any(String),
    });
    expect(mocks.acquire).toHaveBeenCalledTimes(1);
  });

  it("blocks submissions after disconnect until this game is joined again", () => {
    const { route } = liveBootstrap();
    mocks.route.mockReturnValue(route);
    render(<GrandArchiveLiveMatchPage />);
    act(() => emitGateway("game_joined", { gameId: "game-1" }));
    fireEvent.click(screen.getByRole("button", { name: "Submit live action" }));
    const submissions = () =>
      mocks.emit.mock.calls.filter(([event]) => event === "submit_interaction");
    expect(submissions()).toHaveLength(1);
    act(() => emitGateway("disconnect", undefined));
    fireEvent.click(screen.getByRole("button", { name: "Submit live action" }));
    expect(submissions()).toHaveLength(1);
    act(() => emitGateway("game_joined", { gameId: "another-game" }));
    fireEvent.click(screen.getByRole("button", { name: "Submit live action" }));
    expect(submissions()).toHaveLength(1);
    act(() => emitGateway("game_joined", { gameId: "game-1" }));
    fireEvent.click(screen.getByRole("button", { name: "Submit live action" }));
    expect(submissions()).toHaveLength(2);
  });

  it("applies live presence and recent history updates", () => {
    const { route } = liveBootstrap();
    mocks.route.mockReturnValue(route);
    render(<GrandArchiveLiveMatchPage />);

    act(() => {
      emitGateway("presence_change", {
        gameId: "game-1",
        playerId: "p2",
        status: "disconnected",
      });
      emitGateway("game_recent_history", {
        gameId: "game-1",
        engineLogs: [
          {
            stateVersion: 2,
            timestamp: 100,
            log: {
              turnNumber: 1,
              playerId: "p2",
              public: [{ eventId: "event-1", defaultMessage: "Player Two passes." }],
            },
          },
        ],
      });
    });

    const fixture = JSON.parse(screen.getByTestId("live-fixture").textContent!) as {
      seats: Array<{ id: string; connectionStatus: string }>;
      eventLog: Array<{ seatId?: string; section: { label: string } }>;
    };
    expect(fixture.seats.find(({ id }) => id === "p2")?.connectionStatus).toBe("offline");
    expect(fixture.eventLog).toContainEqual(
      expect.objectContaining({
        seatId: "p2",
        section: expect.objectContaining({ label: "Turn 1" }),
      }),
    );
    act(() =>
      emitGateway("game_joined", {
        gameId: "game-1",
        players: [
          { id: "p1", connected: true },
          { id: "p2", connected: true },
        ],
      }),
    );
    expect(JSON.parse(screen.getByTestId("live-fixture").textContent!).seats).toContainEqual(
      expect.objectContaining({ id: "p2", label: "Player Two", connectionStatus: "online" }),
    );
  });

  it("updates hosted undo and invalidates stale actions without erasing rejection errors", () => {
    const { route } = liveBootstrap();
    route.matchPageData.game.undoable = true;
    mocks.route.mockReturnValue(route);
    render(<GrandArchiveLiveMatchPage />);

    fireEvent.click(screen.getByRole("button", { name: "Undo live move" }));
    expect(mocks.emit).toHaveBeenCalledWith("execute_move", {
      gameId: "game-1",
      expectedVersion: 0,
      moveType: "undo",
      payload: {},
      correlationId: "correlation-1",
    });

    const bootstrapView = route.matchPageData.game.view;
    if (!bootstrapView || typeof bootstrapView !== "object" || Array.isArray(bootstrapView)) {
      throw new Error("Expected an object viewer projection");
    }
    const advancedState = { ...bootstrapView, stateVersion: 1 };
    act(() => {
      emitGateway("state_update", {
        gameId: "game-1",
        state: advancedState,
        resources: {},
        undoable: false,
      });
    });
    const fixture = JSON.parse(screen.getByTestId("live-fixture").textContent!) as {
      interactions: unknown[];
    };
    expect(fixture.interactions).toEqual([]);
    expect(screen.getByRole("button", { name: "Undo live move" }).hasAttribute("disabled")).toBe(
      true,
    );

    act(() => {
      emitGateway("move_rejected", { gameId: "game-1", reason: "State changed." });
      emitGateway("state_sync", { gameId: "game-1", state: advancedState, resources: {} });
    });
    expect(screen.getByRole("alert").textContent).toBe("State changed.");
  });

  it("preserves distinct logs and derives actor-aware turn sections", () => {
    const shared = { stateVersion: 4, timestamp: 100 };
    const logs = appendEngineLogs(
      [],
      [
        { ...shared, log: { public: [{ eventId: "one", defaultMessage: "First event" }] } },
        { ...shared, log: { public: [{ eventId: "two", defaultMessage: "Second event" }] } },
      ],
    );
    expect(logs).toHaveLength(2);
    expect(
      eventEntriesFromEngineLogs([
        {
          log: {
            turnNumber: 2,
            public: [
              {
                key: "grand-archive.turn.started",
                eventId: "turn-2",
                defaultMessage: "Player Two starts turn 2.",
                values: { turnNumber: 2, playerId: "p2" },
              },
              { eventId: "move-2", defaultMessage: "Player Two acts.", values: { playerId: "p2" } },
            ],
          },
        },
      ]),
    ).toEqual([
      expect.objectContaining({
        seatId: "p2",
        section: expect.objectContaining({ actorSeatId: "p2" }),
      }),
      expect.objectContaining({
        seatId: "p2",
        section: expect.objectContaining({ actorSeatId: "p2" }),
      }),
    ]);
    expect(grandArchiveNextGameHref("match / one", "game / two")).toBe(
      "/grand-archive/simulator/matches/match%20%2F%20one/games/game%20%2F%20two",
    );
  });
});

it.each([
  [false, false],
  [true, false],
  [false, true],
  [false, "html"],
  [false, "empty"],
])(
  "routes human preparation safely (unknown card: %s, rejected response: %s)",
  async (unknownCard, rejectedResponse) => {
    mocks.refresh.mockClear();
    const { practicePreparationPool } = await import("./practice-preparation");
    const { GrandArchiveSimulatorProviders } = await import("./App");
    const { server } = liveBootstrap();
    const pool = practicePreparationPool(server, "p1");
    if (unknownCard) pool.registered.main[0]!.canonicalId = "unknown-card-from-new-server";
    mocks.route.mockReturnValue({
      session: {
        phase: "preparation",
        match: { matchId: "match-prep" },
        preparation: {
          kind: "grand-archive",
          gameId: "game-prep",
          pool,
          selection: pool.previous,
          player: { label: "Player One", playerId: "p1" },
          opponent: { label: "Player Two", playerId: "p2" },
          playerId: "p1",
          locked: false,
          opponentReady: false,
          deadlineAt: new Date(Date.now() + 180000).toISOString(),
          turnOrder: { stage: "chosen", chooserId: "p1", firstPlayerId: "p2", source: "random" },
        },
      },
    });
    const fetch = vi.fn(
      async () =>
        new Response(
          rejectedResponse === "html"
            ? "<html>Bad Gateway</html>"
            : rejectedResponse === "empty"
              ? ""
              : JSON.stringify(
                  rejectedResponse ? { object: "error", status: 422 } : { object: "game_pregame" },
                ),
          { status: rejectedResponse === "html" ? 502 : 200 },
        ),
    );
    vi.stubGlobal("fetch", fetch);
    render(
      <GrandArchiveSimulatorProviders>
        <GrandArchiveLiveMatchPage />
      </GrandArchiveSimulatorProviders>,
    );
    if (unknownCard) {
      expect(screen.getByText("Preparation unavailable")).toBeTruthy();
      expect(screen.queryByRole("button", { name: "Confirm selection" })).toBeNull();
      cleanup();
      vi.unstubAllGlobals();
      return;
    }
    expect(screen.getByRole("heading", { name: "Review your starting decks" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Submit live action" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Confirm selection" }));
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(fetch.mock.calls[0]).toEqual([
      expect.stringContaining("/matches/match-prep/pregame"),
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify({ gameId: "game-prep", selection: pool.previous }),
      }),
    ]);
    if (rejectedResponse) {
      await screen.findByText("Could not save preparation. Synchronize and try again.");
      expect(mocks.refresh).not.toHaveBeenCalled();
      expect(
        screen.getByRole("button", { name: "Confirm selection" }).hasAttribute("disabled"),
      ).toBe(false);
    } else {
      await waitFor(() => expect(mocks.refresh).toHaveBeenCalled());
    }
    cleanup();
    vi.unstubAllGlobals();
  },
);
