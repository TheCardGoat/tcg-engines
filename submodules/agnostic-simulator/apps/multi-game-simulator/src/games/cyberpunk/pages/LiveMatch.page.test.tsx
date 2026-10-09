// @vitest-environment jsdom
import { MantineProvider } from "@mantine/core";
import type { MatchState, MoveLog } from "@tcg/cyberpunk-engine";
import { buildCyberpunkInteractionView } from "@tcg/cyberpunk-server-adapter/interaction-protocol";
import type { LiveMatchBootstrapV1 } from "@tcg/game-page-contract";
import type { EngineInteractionView, InteractionSubmissionValue } from "@tcg/protocol";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getScenario, P1, P2 } from "../engine/fixtures/scenarios";
import { isViewerHiddenIdentityDefinitionId } from "../engine/live/viewerPlaceholders";

const mocks = vi.hoisted(() => ({
  emit: vi.fn(),
  release: vi.fn(),
  route: vi.fn(),
  captureGameEvent: vi.fn(),
  requestStateSyncIfDue: vi.fn(),
  connection: {
    status: "connected" as "connected" | "reconnecting" | "disconnected",
    authenticated: true,
    authStatus: "ok" as const,
    authFailureReason: null,
    connectionId: "connection-1",
    latencyMs: null,
    lastPingAt: null,
    lastPongAt: null,
    lastHeartbeatSentAt: null,
    lastHeartbeatAckAt: null,
    reconnectAttempt: 0,
    error: null as string | null,
    joined: true,
    joinedRole: "player" as const,
    presence: [],
    requestStateSyncIfDue: vi.fn(),
  },
  notificationShow: vi.fn(),
  notificationHide: vi.fn(),
}));

vi.mock("@mantine/notifications", () => ({
  notifications: {
    show: mocks.notificationShow,
    hide: mocks.notificationHide,
  },
}));

vi.mock("react-router-dom", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react-router-dom")>()),
  useLocation: () => ({ pathname: "/matches/match-1/games/game-1", search: "" }),
  useParams: () => ({ matchId: "match-1", gameId: "game-1" }),
}));

vi.mock("../../../simulator/providers", () => ({
  useSimulatorRoute: () => mocks.route(),
  useSimulatorLiveConnection: () => mocks.connection,
  SimulatorLiveConnectionProvider: ({
    children,
    onGameEvent,
  }: {
    children: ReactNode;
    onGameEvent: (event: string, payload: unknown) => void;
  }) => {
    mocks.captureGameEvent(onGameEvent);
    return children;
  },
}));

vi.mock("../../../lib/gateway/root-socket", () => ({
  acquireRootGatewayHandle: () => ({
    emit: mocks.emit,
    release: mocks.release,
    getState: () => ({
      status: "connected",
      authenticated: true,
      authStatus: "ok",
      authFailureReason: null,
      connectionId: "connection-1",
    }),
    wouldHoldEmit: () => false,
  }),
}));

vi.mock("@tcg/shared/discord-rich-presence", () => ({
  buildDiscordRichPresenceMatchUrl: () => "https://example.test/match-1",
  clearDiscordPlayingGamePresence: vi.fn(async () => ({ ok: true, skipped: true })),
  updateDiscordPlayingGamePresence: vi.fn(async () => ({ ok: true, skipped: true })),
}));

vi.mock("./BoardShared.page", () => ({
  BoardSharedPage: ({
    scenarioId,
    initialEngineBuilder,
    remoteInteractionView,
    remoteSubmitInteraction,
    requestRemoteUndo,
    hasPendingRemoteMove,
    remoteMoveLogs,
    liveMatchSidebar,
  }: {
    scenarioId?: string;
    initialEngineBuilder?: () => { getState: () => MatchState };
    remoteInteractionView?: EngineInteractionView;
    remoteSubmitInteraction?: (
      input: {
        side: "player";
        interactionView: EngineInteractionView;
        actionId: string;
        values?: Record<string, InteractionSubmissionValue>;
      },
      state: MatchState,
    ) => boolean;
    requestRemoteUndo?: (scope: "last_move" | "turn_start") => boolean;
    hasPendingRemoteMove?: boolean;
    remoteMoveLogs?: ReadonlyArray<MoveLog>;
    liveMatchSidebar?: { localPlayerId?: string };
  }) => {
    if (scenarioId && !initialEngineBuilder)
      return <output aria-label="Preparation board">{scenarioId}</output>;
    if (!initialEngineBuilder) throw new Error("Live board requires an engine");
    const boardState = initialEngineBuilder().getState();
    const playerHand = boardState.G.players[P1]?.zones.hand ?? [];
    const identifiedPlayerCards = playerHand.filter((cardId) => {
      const definitionId = boardState.G.cardIndex[String(cardId)]?.definitionId;
      return Boolean(definitionId && !isViewerHiddenIdentityDefinitionId(definitionId));
    }).length;
    const action = remoteInteractionView?.actions.find(
      (candidate) => candidate.inputs.length === 0,
    );
    return (
      <>
        <button
          type="button"
          disabled={!action}
          onClick={() => {
            if (!action || !remoteInteractionView) return;
            remoteSubmitInteraction?.(
              {
                side: "player",
                interactionView: remoteInteractionView,
                actionId: action.id,
                values: {},
              },
              initialEngineBuilder().getState(),
            );
          }}
        >
          Submit live action
        </button>
        <button type="button" onClick={() => requestRemoteUndo?.("last_move")}>
          Request undo
        </button>
        <output aria-label="Pending move">{hasPendingRemoteMove ? "pending" : "ready"}</output>
        <output aria-label="Rejected move log">
          {remoteMoveLogs
            ?.flatMap((log) =>
              log.type === "action" &&
              log.messageKey === "move.rejected" &&
              typeof log.params.reason === "string"
                ? [log.params.reason]
                : [],
            )
            .at(-1) ?? "none"}
        </output>
        <output aria-label="Local player">{liveMatchSidebar?.localPlayerId ?? "unknown"}</output>
        <output aria-label="Board version">{boardState.ctx.stateID}</output>
        <output aria-label="Identified player cards">{identifiedPlayerCards}</output>
      </>
    );
  },
}));

import { LiveMatchPage, liveTitlePriority } from "./LiveMatch.page";

describe("Cyberpunk cancelled match", () => {
  afterEach(cleanup);

  it("shows the cancellation reason and a route back to matchmaking", () => {
    mocks.route.mockReturnValue({
      error: null,
      session: { phase: "cancelled", reason: "The other player left the match." },
    });

    render(<LiveMatchPage />);

    expect(screen.getByRole("heading", { name: "Match cancelled" })).not.toBeNull();
    expect(screen.getByText("The other player left the match.")).not.toBeNull();
    expect(
      new URL(
        (screen.getByRole("link", { name: "Return to matchmaking" }) as HTMLAnchorElement).href,
      ).pathname,
    ).toBe("/cyberpunk/matchmaking");
  });
});

describe("Cyberpunk live title priority", () => {
  it("uses viewer-scoped interaction status for any server actor ID", () => {
    expect(liveTitlePriority("ready", true)).toBe("self");
    expect(liveTitlePriority("choosing", true)).toBe("self");
    expect(liveTitlePriority("waiting", true)).toBe("opponent");
    expect(liveTitlePriority("ready", false)).toBeNull();
  });
});

describe("Cyberpunk starting transition", () => {
  beforeEach(() => {
    vi.stubGlobal("matchMedia", () => ({
      matches: false,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
    }));
  });
  afterEach(cleanup);
  afterEach(() => vi.unstubAllGlobals());

  it("shows the board without a blocking shuffle dialog", () => {
    mocks.route.mockReturnValue({
      error: null,
      matchId: "match-1",
      gameId: "game-1",
      matchPageData: null,
      session: { phase: "starting" },
    });
    render(
      <MantineProvider env="test">
        <LiveMatchPage />
      </MantineProvider>,
    );
    expect(screen.getByLabelText("Preparation board").textContent).toBe("gameStart");
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});

function liveBootstrap(): {
  bootstrap: LiveMatchBootstrapV1;
  state: MatchState;
  interactionView: EngineInteractionView;
} {
  const engine = getScenario("openingMain").build();
  const state = engine.getState();
  const version = state.ctx.stateID;
  const interactionView = buildCyberpunkInteractionView({
    actorId: P1,
    stateVersion: version,
    prompt: engine.getPrompt(P1),
    state,
  });
  const bootstrap = {
    schemaVersion: 1,
    match: {
      matchId: "match-1",
      gameType: "cyberpunk",
      format: "best_of_1",
      matchType: "ranked",
      status: "in_progress",
      participants: [
        { id: String(P1), seat: 1, displayName: "Player One" },
        { id: String(P2), seat: 2, displayName: "Player Two" },
      ],
      gameIds: ["game-1"],
    },
    game: {
      gameId: "game-1",
      gameNumber: 1,
      status: "in_progress",
      authority: "server",
      stateVersion: version,
      view: engine.getFilteredView(P1),
      interactionView,
    },
    viewer: {
      role: "player",
      actorId: String(P1),
      seat: 1,
      userId: "user-1",
      permissions: {
        act: true,
        chat: true,
        propose: true,
        useManualControls: false,
        concede: true,
        spectate: false,
        viewReplay: false,
        downloadReplay: false,
        forkReplay: false,
      },
    },
    capabilities: {
      actions: true,
      chat: true,
      proposals: true,
      manualControls: false,
      spectating: true,
      conceding: true,
      replay: false,
    },
    presence: {
      players: [
        { id: String(P1), connected: true },
        { id: String(P2), connected: true },
      ],
    },
    history: { recentMoves: [], engineLogs: [], chatMessages: [] },
  } satisfies LiveMatchBootstrapV1;
  return { bootstrap, state, interactionView };
}

function latestGameEvent(): (event: string, payload: unknown) => void {
  const call = mocks.captureGameEvent.mock.lastCall;
  if (!call) throw new Error("Live game event handler was not mounted.");
  return call[0];
}

describe("Cyberpunk live pending move lifecycle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("crypto", { randomUUID: () => "correlation-1" });
    vi.stubGlobal("matchMedia", () => ({
      matches: false,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
    }));
    mocks.connection = {
      ...mocks.connection,
      status: "connected",
      authenticated: true,
      error: null,
    };
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it.each([
    { event: "proposal_resolved", resolution: "accepted", title: "Undo complete" },
    { event: "proposal_resolved", resolution: "declined", title: "Undo declined" },
    { event: "proposal_expired", resolution: undefined, title: "Undo request expired" },
  ])(
    "closes the pending undo notice when $event is $resolution",
    async ({ event, resolution, title }) => {
      const { bootstrap } = liveBootstrap();
      mocks.route.mockReturnValue({
        error: null,
        matchId: "match-1",
        gameId: "game-1",
        matchPageData: bootstrap,
      });

      render(
        <MantineProvider env="test">
          <LiveMatchPage />
        </MantineProvider>,
      );

      fireEvent.click(await screen.findByRole("button", { name: "Request undo" }));
      expect(mocks.notificationShow).toHaveBeenCalledWith(
        expect.objectContaining({ id: "undo-proposal-sent:game-1", title: "Undo requested" }),
      );

      act(() => {
        latestGameEvent()(event, {
          gameId: "game-1",
          matchId: "match-1",
          actionType: "undo",
          ...(resolution ? { resolution } : {}),
        });
      });

      expect(mocks.notificationHide).toHaveBeenCalledWith("undo-proposal-sent:game-1");
      expect(mocks.notificationShow).toHaveBeenLastCalledWith(
        expect.objectContaining({ title, autoClose: 4_000 }),
      );
      expect(mocks.notificationHide.mock.invocationCallOrder.at(-1)).toBeLessThan(
        mocks.notificationShow.mock.invocationCallOrder.at(-1)!,
      );
    },
  );

  it("replaces the reconnecting notice with confirmation when the match server returns", async () => {
    const { bootstrap } = liveBootstrap();
    mocks.route.mockReturnValue({
      error: null,
      matchId: "match-1",
      gameId: "game-1",
      matchPageData: bootstrap,
    });

    const view = render(
      <MantineProvider env="test">
        <LiveMatchPage />
      </MantineProvider>,
    );

    mocks.connection = { ...mocks.connection, status: "reconnecting", error: "transport close" };
    view.rerender(
      <MantineProvider env="test">
        <LiveMatchPage />
      </MantineProvider>,
    );
    await waitFor(() =>
      expect(mocks.notificationShow).toHaveBeenLastCalledWith(
        expect.objectContaining({
          id: "live-match:gateway-connection:game-1",
          title: "Connection interrupted",
        }),
      ),
    );

    mocks.connection = { ...mocks.connection, status: "connected", error: null };
    view.rerender(
      <MantineProvider env="test">
        <LiveMatchPage />
      </MantineProvider>,
    );
    await waitFor(() =>
      expect(mocks.notificationHide).toHaveBeenCalledWith("live-match:gateway-connection:game-1"),
    );
    expect(mocks.notificationShow).toHaveBeenLastCalledWith(
      expect.objectContaining({
        color: "green",
        title: "Reconnected to match server",
      }),
    );
  });

  it("replaces the reconnecting notice with a recovery action when reconnection ends", async () => {
    const { bootstrap } = liveBootstrap();
    mocks.route.mockReturnValue({
      error: null,
      matchId: "match-1",
      gameId: "game-1",
      matchPageData: bootstrap,
    });

    const view = render(
      <MantineProvider env="test">
        <LiveMatchPage />
      </MantineProvider>,
    );

    mocks.connection = { ...mocks.connection, status: "reconnecting", error: "transport close" };
    view.rerender(
      <MantineProvider env="test">
        <LiveMatchPage />
      </MantineProvider>,
    );
    await waitFor(() => expect(mocks.notificationShow).toHaveBeenCalledTimes(1));

    mocks.connection = {
      ...mocks.connection,
      status: "disconnected",
      error: "The server is unavailable.",
    };
    view.rerender(
      <MantineProvider env="test">
        <LiveMatchPage />
      </MantineProvider>,
    );
    await waitFor(() =>
      expect(mocks.notificationHide).toHaveBeenCalledWith("live-match:gateway-connection:game-1"),
    );
    expect(mocks.notificationShow).toHaveBeenLastCalledWith(
      expect.objectContaining({
        color: "red",
        title: "Could not reconnect to match server",
        message: "The server is unavailable.",
      }),
    );
  });

  it("keeps the rendered board latched through transport OK and releases it after applied authoritative state", async () => {
    const { bootstrap, state, interactionView } = liveBootstrap();
    mocks.route.mockReturnValue({
      error: null,
      matchId: "match-1",
      gameId: "game-1",
      matchPageData: bootstrap,
    });

    render(
      <MantineProvider env="test">
        <LiveMatchPage />
      </MantineProvider>,
    );

    const submit = await screen.findByRole("button", { name: "Submit live action" });
    fireEvent.click(submit);
    await waitFor(() => expect(screen.getByLabelText("Pending move").textContent).toBe("pending"));
    expect(mocks.emit).toHaveBeenCalledWith(
      "submit_interaction",
      expect.objectContaining({ correlationId: "correlation-1" }),
    );

    act(() => {
      latestGameEvent()("submit_interaction:response", {
        status: "ok",
        correlationId: "correlation-1",
      });
    });
    expect(screen.getByLabelText("Pending move").textContent).toBe("pending");

    const nextVersion = state.ctx.stateID + 1;
    act(() => {
      latestGameEvent()("move_accepted", {
        gameId: "game-1",
        stateVersion: nextVersion,
        patches: [],
        engineLogs: [],
        animationPlan: null,
        state: { ...state, ctx: { ...state.ctx, stateID: nextVersion } },
        interactionView: { ...interactionView, stateVersion: nextVersion },
        moveType: "interaction:pass",
        actorId: String(P1),
        correlationId: "correlation-1",
      });
    });

    await waitFor(() => expect(screen.getByLabelText("Pending move").textContent).toBe("ready"));
  });

  it("marks an equal-version illegal rejection for recovery through the page event path", async () => {
    const { bootstrap, state, interactionView } = liveBootstrap();
    mocks.route.mockReturnValue({
      error: null,
      matchId: "match-1",
      gameId: "game-1",
      matchPageData: bootstrap,
    });

    render(
      <MantineProvider env="test">
        <LiveMatchPage />
      </MantineProvider>,
    );

    fireEvent.click(await screen.findByRole("button", { name: "Submit live action" }));
    await waitFor(() => expect(screen.getByLabelText("Pending move").textContent).toBe("pending"));

    act(() => {
      latestGameEvent()("move_rejected", {
        gameId: "game-1",
        code: "rejected_illegal",
        reason: "The advertised action is no longer legal.",
        currentVersion: state.ctx.stateID,
        correlationId: "correlation-1",
      });
    });
    expect(screen.getByLabelText("Pending move").textContent).toBe("pending");
    expect(screen.getByRole("alert").textContent).toContain("Action list out of sync");
    expect(screen.getByLabelText("Rejected move log").textContent).toBe(
      "The advertised action is no longer legal.",
    );
    expect(screen.getByRole("button", { name: "Retry sync" })).toBeTruthy();

    act(() => {
      latestGameEvent()("state_sync", {
        gameId: "game-1",
        stateVersion: state.ctx.stateID,
        engineLogs: [],
        animationPlan: null,
        state,
        interactionView,
      });
    });

    await waitFor(() => expect(screen.getByLabelText("Pending move").textContent).toBe("ready"));
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("reconciles a corrected viewer seat without dropping the same-game gateway session", async () => {
    const { bootstrap, state } = liveBootstrap();
    if (bootstrap.viewer.role !== "player") throw new Error("Test bootstrap must be a player.");
    const rivalInteractionView = buildCyberpunkInteractionView({
      actorId: P2,
      stateVersion: state.ctx.stateID,
      prompt: getScenario("openingMain").build().getPrompt(P2),
      state,
    });
    const staleBootstrap: LiveMatchBootstrapV1 = {
      ...bootstrap,
      game: {
        ...bootstrap.game,
        view: getScenario("openingMain").build().getFilteredView(P2),
        interactionView: rivalInteractionView,
      },
      viewer: {
        ...bootstrap.viewer,
        actorId: String(P2),
        seat: 2,
      },
    };
    const route = {
      error: null,
      matchId: "match-1",
      gameId: "game-1",
      matchPageData: staleBootstrap,
    };
    mocks.route.mockImplementation(() => route);

    const view = render(
      <MantineProvider env="test">
        <LiveMatchPage />
      </MantineProvider>,
    );

    await waitFor(() => expect(screen.getByLabelText("Local player").textContent).toBe(String(P2)));
    const serverEngine = getScenario("openingMain").build();
    act(() => {
      latestGameEvent()("state_sync", {
        gameId: "game-1",
        stateVersion: state.ctx.stateID,
        engineLogs: [],
        animationPlan: null,
        state: serverEngine.getFilteredView(P1),
        interactionView: buildCyberpunkInteractionView({
          actorId: P1,
          stateVersion: state.ctx.stateID,
          prompt: serverEngine.getPrompt(P1),
          state: serverEngine.getState(),
        }),
      });
    });
    await waitFor(() =>
      expect(screen.getByLabelText("Identified player cards").textContent).toBe("0"),
    );
    route.matchPageData = bootstrap;
    view.rerender(
      <MantineProvider env="test">
        <LiveMatchPage />
      </MantineProvider>,
    );

    await waitFor(() => expect(mocks.connection.requestStateSyncIfDue).toHaveBeenCalled());
    expect(screen.queryByLabelText("Local player")).toBeNull();
    act(() => {
      latestGameEvent()("state_sync", {
        gameId: "game-1",
        stateVersion: state.ctx.stateID,
        engineLogs: [],
        animationPlan: null,
        state: serverEngine.getFilteredView(P1),
        interactionView: buildCyberpunkInteractionView({
          actorId: P1,
          stateVersion: state.ctx.stateID,
          prompt: serverEngine.getPrompt(P1),
          state: serverEngine.getState(),
        }),
      });
    });

    await waitFor(() => expect(screen.getByLabelText("Local player").textContent).toBe(String(P1)));
    expect(Number(screen.getByLabelText("Identified player cards").textContent)).toBeGreaterThan(0);
    expect(mocks.release).not.toHaveBeenCalled();
  });

  it("does not roll a gateway projection back to an older same-seat bootstrap", async () => {
    const { bootstrap, state, interactionView } = liveBootstrap();
    const route = {
      error: null,
      matchId: "match-1",
      gameId: "game-1",
      matchPageData: bootstrap,
    };
    mocks.route.mockImplementation(() => route);

    const view = render(
      <MantineProvider env="test">
        <LiveMatchPage />
      </MantineProvider>,
    );
    const nextVersion = state.ctx.stateID + 1;
    act(() => {
      latestGameEvent()("state_sync", {
        gameId: "game-1",
        stateVersion: nextVersion,
        engineLogs: [],
        animationPlan: null,
        state: { ...state, ctx: { ...state.ctx, stateID: nextVersion } },
        interactionView: { ...interactionView, stateVersion: nextVersion },
      });
    });
    await waitFor(() =>
      expect(screen.getByLabelText("Board version").textContent).toBe(String(nextVersion)),
    );

    route.matchPageData = { ...bootstrap };
    view.rerender(
      <MantineProvider env="test">
        <LiveMatchPage />
      </MantineProvider>,
    );

    expect(screen.getByLabelText("Board version").textContent).toBe(String(nextVersion));
  });
});
