import type { GatewayConnectionState } from "@tcg/gateway-client";
import { FabPresentationCatalogProvider } from "./FabPresentationCatalog";
import { createFabClock } from "@tcg/flesh-and-blood-server-adapter/clock";
import { MantineProvider } from "@mantine/core";
import {
  createDefaultFabPregameSelection,
  type FabPregameCardPool,
} from "@tcg/flesh-and-blood-engine/simulator";
import { EngineInteractionView, INTERACTION_PROTOCOL_VERSION } from "@tcg/protocol";
import { defineFleshAndBloodCardUnchecked } from "@tcg/flesh-and-blood-types";
import {
  act,
  cleanup,
  fireEvent,
  render as renderRaw,
  screen,
  waitFor,
} from "@testing-library/react";
import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { FleshAndBloodTabletop } from "./FleshAndBloodTabletop";
import { resolvePracticeDeckSelection } from "./data/resolve-text-deck";

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
  onAny: vi.fn<(callback: (event: string, payload: object) => void) => () => void>((callback) => {
    callback("game_joined", { gameId: "game-1" });
    return vi.fn();
  }),
  route: vi.fn(),
  logCommandSent: vi.fn(),
  logCommandResponse: vi.fn(),
  logCommandTimeout: vi.fn(),
  logStateSyncRequested: vi.fn(),
}));

vi.mock("./live-command-observability", () => ({
  logFabLiveCommandSent: mocks.logCommandSent,
  logFabLiveCommandResponse: mocks.logCommandResponse,
  logFabLiveCommandTimeout: mocks.logCommandTimeout,
  logFabLiveStateSyncRequested: mocks.logStateSyncRequested,
}));

vi.mock("@mantine/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@mantine/core")>();
  return {
    ...actual,
    Modal: ({
      opened,
      title,
      children,
    }: {
      opened: boolean;
      title: ReactNode;
      children: ReactNode;
    }) =>
      opened ? (
        <div role="dialog">
          <h2>{title}</h2>
          {children}
        </div>
      ) : null,
    Button: ({
      color: _color,
      variant: _variant,
      ...props
    }: ButtonHTMLAttributes<HTMLButtonElement> & { color?: string; variant?: string }) => (
      <button type="button" {...props} />
    ),
    Group: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    Text: ({ children }: { children: ReactNode }) => <p>{children}</p>,
  };
});

vi.mock("react-router-dom", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react-router-dom")>()),
  useParams: () => ({ matchId: "match-1" }),
}));

vi.mock("../../simulator/providers", () => ({
  useSimulatorRoute: () => mocks.route(),
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
    onAny: mocks.onAny,
    onLatency: () => vi.fn(),
    onHeartbeatAck: () => vi.fn(),
  }),
}));

vi.mock("./FleshAndBloodTabletop", () => ({
  FabPriorityAutomationSettingsPanel: () => null,
  FleshAndBloodTabletop: (
    props: Pick<
      ComponentProps<typeof FleshAndBloodTabletop>,
      | "onConcede"
      | "pending"
      | "readOnly"
      | "onCardAction"
      | "interactionView"
      | "animationVersion"
      | "state"
      | "matchNotice"
      | "participantPresentation"
    >,
  ) => (
    <>
      <button type="button" disabled={!props.onConcede} onClick={props.onConcede}>
        Concede from board
      </button>
      {props.matchNotice}
      {Object.values(props.participantPresentation ?? {}).map((player, i) => (
        <div key={i}>
          {player.clock}
          {player.connection}
        </div>
      ))}
      <output aria-label="Rendered version">{props.animationVersion}</output>
      <output aria-label="Rendered cards">{JSON.stringify(props.state.cards)}</output>
      <output aria-label="Rendered definitions">
        {JSON.stringify(props.state.cardDefinitions)}
      </output>
      <output aria-label="Action state">
        {props.interactionView?.stateVersion ?? "unavailable"}
      </output>
      <output aria-label="Saving state">{props.pending ? "saving" : "ready"}</output>
      <button type="button" onClick={() => props.onCardAction?.("test-card-action")}>
        Submit card action
      </button>
    </>
  ),
}));

vi.mock("../../simulator/MatchSessionProvider", () => ({
  useMatchSession: () => ({ refresh: vi.fn() }),
}));

import { LiveMatchPage } from "./LiveMatch.page";

function liveRoute(concede: boolean) {
  return {
    error: null,
    session: null,
    matchPageData: {
      match: {
        participants: [
          { id: "p1", userId: "user-1", displayName: "Player One", isBot: false },
          { id: "p2", userId: "user-2", displayName: "Player Two", isBot: false },
        ],
      },
      presence: {
        players: [
          { id: "p1", connected: true },
          { id: "p2", connected: true },
        ],
      },
      game: {
        gameId: "game-1",
        stateVersion: 7,
        view: { players: [{ id: "p1" }, { id: "p2" }], cards: {} } as unknown,
        resources: undefined as unknown,
        interactionView: {
          protocolVersion: INTERACTION_PROTOCOL_VERSION,
          gameSlug: "flesh-and-blood",
          actorId: "p1",
          stateVersion: 7,
          status: "ready",
          actions: [
            {
              id: "fab:concede",
              requestId: "fab:7",
              intent: "concede",
              text: { key: "Concede" },
              enabled: true,
              inputs: [],
            },
          ],
        },
      },
      viewer: {
        role: "player",
        actorId: "p1",
        permissions: { concede, act: true },
      },
    },
  };
}

describe.sequential("FAB live concession", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 404 }));
    vi.stubGlobal("crypto", { randomUUID: () => "correlation-1" });
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("allows a connected opponent's timeout claim only after the server clock grace expires", () => {
    const route = liveRoute(true);
    const clock = createFabClock(
      { mode: "dynamic", initialReserveMs: 180_000, extras: { graceMs: 15_000 } },
      ["p1", "p2"],
      "p2",
      Date.now() - 196_000,
    );
    route.matchPageData.game.view = {
      players: [{ id: "p1" }, { id: "p2" }],
      cards: {},
      ctx: clock,
    };
    mocks.route.mockReturnValue(route);
    render(
      <MantineProvider>
        <LiveMatchPage />
      </MantineProvider>,
    );
    expect(screen.getByText("Opponent timed out.")).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Claim win" }));
    expect(mocks.emit).toHaveBeenCalledWith("drop_player", { gameId: "game-1" });
  });

  it("explains the opponent timeout grace period before a claim becomes available", () => {
    const route = liveRoute(true);
    const clock = createFabClock(
      { mode: "dynamic", initialReserveMs: 180_000, extras: { graceMs: 15_000 } },
      ["p1", "p2"],
      "p2",
      Date.now() - 185_000,
    );
    route.matchPageData.game.view = {
      players: [{ id: "p1" }, { id: "p2" }],
      cards: {},
      ctx: clock,
    };
    mocks.route.mockReturnValue(route);

    render(
      <MantineProvider>
        <LiveMatchPage />
      </MantineProvider>,
    );

    expect(screen.getByText(/Opponent's time expired\. Claim available in \d+s\./)).toBeTruthy();
    expect(screen.getByRole("button", { name: "Claim win" }).hasAttribute("disabled")).toBe(true);
  });

  it("explains when the viewer's own clock expires", () => {
    const route = liveRoute(true);
    const clock = createFabClock(
      { mode: "dynamic", initialReserveMs: 180_000, extras: { graceMs: 15_000 } },
      ["p1", "p2"],
      "p1",
      Date.now() - 185_000,
    );
    route.matchPageData.game.view = {
      players: [{ id: "p1" }, { id: "p2" }],
      cards: {},
      ctx: clock,
    };
    mocks.route.mockReturnValue(route);

    render(
      <MantineProvider>
        <LiveMatchPage />
      </MantineProvider>,
    );

    expect(screen.getByText(/Your time expired\. Grace period: \d+s remaining\./)).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Claim win" })).toBeNull();
  });

  it("uses live disconnect timestamps, permits a claim after 30 seconds, and cancels it on reconnect", async () => {
    mocks.route.mockReturnValue(liveRoute(true));
    render(
      <MantineProvider>
        <LiveMatchPage />
      </MantineProvider>,
    );
    const onPresence = mocks.on.mock.calls.find(([event]) => event === "presence_change")?.[1];
    expect(onPresence).toBeDefined();
    act(() =>
      onPresence?.({
        gameId: "game-1",
        playerId: "p2",
        status: "disconnected",
        disconnectedAt: new Date(Date.now() - 31_000).toISOString(),
      }),
    );
    const claim = screen.getByRole("button", { name: "Claim win" });
    expect(claim.hasAttribute("disabled")).toBe(false);
    fireEvent.click(claim);
    expect(mocks.emit).toHaveBeenCalledWith("drop_player", { gameId: "game-1" });
    act(() => onPresence?.({ gameId: "game-1", playerId: "p2", status: "connected" }));
    expect(screen.queryByRole("button", { name: "Claim win" })).toBeNull();
    act(() =>
      onPresence?.({
        gameId: "game-1",
        playerId: "p2",
        status: "disconnected",
        disconnectedAt: new Date().toISOString(),
      }),
    );
    expect(screen.getByRole("button", { name: "Claim win" }).hasAttribute("disabled")).toBe(true);
  });

  it("shows opponent disconnects even when the timestamp is unavailable", () => {
    mocks.route.mockReturnValue(liveRoute(true));
    render(
      <MantineProvider>
        <LiveMatchPage />
      </MantineProvider>,
    );
    const onPresence = mocks.on.mock.calls.find(([event]) => event === "presence_change")?.[1];
    expect(onPresence).toBeDefined();

    act(() => onPresence?.({ gameId: "game-1", playerId: "p2", status: "disconnected" }));

    expect(screen.getByText("Opponent disconnected.")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Claim win" }).hasAttribute("disabled")).toBe(true);
  });

  it("shows connection loss, blocks actions, and recovers after an authenticated rejoin", () => {
    mocks.route.mockReturnValue(liveRoute(true));
    render(
      <MantineProvider>
        <LiveMatchPage />
      </MantineProvider>,
    );
    const onState = mocks.subscribeState.mock.calls[0]?.[0];
    const onEvent = mocks.onAny.mock.calls[0]?.[0];
    if (!onState || !onEvent) throw new Error("Missing live session subscriptions");
    const connected: GatewayConnectionState = {
      status: "connected",
      authenticated: true,
      connectionId: "new-connection",
      authMethod: "jwt",
      authStatus: "ok",
      authFailureReason: null,
      error: null,
      reconnectAttempt: 0,
      latencyMs: null,
    };
    act(() =>
      onState({ ...connected, status: "reconnecting", authenticated: false, reconnectAttempt: 1 }),
    );
    expect(screen.getByTestId("fab-live-recovery-notice").textContent).toContain(
      "Connection lost. Reconnecting to the match…",
    );
    fireEvent.click(screen.getByRole("button", { name: "Concede from board" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    act(() => onState(connected));
    expect(screen.getByTestId("fab-live-recovery-notice").textContent).toContain(
      "Synchronizing the match…",
    );
    act(() => onEvent("game_joined", { gameId: "game-1" }));
    expect(screen.queryByTestId("fab-live-recovery-notice")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Concede from board" }));
    expect(screen.getByRole("dialog")).toBeTruthy();
  });

  it("sends live game heartbeats and stops them when the board unmounts", () => {
    vi.useFakeTimers();
    try {
      mocks.route.mockReturnValue(liveRoute(true));
      const mounted = render(
        <MantineProvider>
          <LiveMatchPage />
        </MantineProvider>,
      );
      void act(() => vi.advanceTimersByTime(15_000));
      expect(mocks.emit).toHaveBeenCalledWith(
        "heartbeat",
        expect.objectContaining({
          game: { gameId: "game-1", matchId: "match-1", stateVersion: 7 },
        }),
      );
      mounted.unmount();
      mocks.emit.mockClear();
      void act(() => vi.advanceTimersByTime(15_000));
      expect(mocks.emit).not.toHaveBeenCalled();
    } finally {
      vi.useRealTimers();
    }
  });

  it("requires confirmation before submitting the authoritative concession interaction", async () => {
    const route = liveRoute(true);
    const parsed = EngineInteractionView.safeParse(route.matchPageData.game.interactionView);
    if (!parsed.success) throw new Error(JSON.stringify(parsed.error.issues));
    mocks.route.mockReturnValue(route);
    render(
      <MantineProvider>
        <LiveMatchPage />
      </MantineProvider>,
    );

    const concedeButton = screen.getByRole("button", {
      name: "Concede from board",
    }) as HTMLButtonElement;
    expect(concedeButton.disabled).toBe(false);
    fireEvent.click(concedeButton);
    expect((await screen.findByRole("dialog")).textContent).toContain("cannot be undone");
    expect(mocks.emit).not.toHaveBeenCalledWith("submit_interaction", expect.anything());

    fireEvent.click(screen.getByRole("button", { name: "Keep playing" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(mocks.emit).not.toHaveBeenCalledWith("submit_interaction", expect.anything());

    fireEvent.click(concedeButton);
    fireEvent.click(screen.getByTestId("fab-live-concede-confirm"));

    await waitFor(() =>
      expect(mocks.emit).toHaveBeenCalledWith("submit_interaction", {
        gameId: "game-1",
        expectedVersion: 7,
        submission: {
          protocolVersion: INTERACTION_PROTOCOL_VERSION,
          requestId: "fab:7",
          actionId: "fab:concede",
          stateVersion: 7,
          values: {},
        },
        correlationId: "correlation-1",
      }),
    );
  });

  it("accepts a terminal update without actions and clears pending synchronization", () => {
    const route = liveRoute(true);
    mocks.route.mockReturnValue(route);
    render(
      <MantineProvider>
        <LiveMatchPage />
      </MantineProvider>,
    );
    const update = mocks.on.mock.calls.find(([event]) => event === "state_update")?.[1];
    if (!update) throw new Error("Missing update listener");
    act(() => update({ gameId: "game-1", stateVersion: 8, state: route.matchPageData.game.view }));
    expect(screen.getByTestId("fab-live-recovery-notice").textContent).toContain(
      "could not be synchronized",
    );
    mocks.emit.mockClear();
    act(() =>
      update({
        gameId: "game-1",
        stateVersion: 9,
        state: {
          players: [{ id: "p1" }, { id: "p2" }],
          cards: {},
          result: { kind: "win", winnerId: "p2", loserId: "p1", reason: "concede" },
        },
      }),
    );
    expect(screen.getByRole("dialog").textContent).toContain("Defeat");
    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.getByLabelText("Saving state").textContent).toBe("ready");
    expect(mocks.emit).not.toHaveBeenCalledWith("request_game_state_sync", expect.anything());
  });

  it("keeps a blocked concede open and submits after the outstanding action is confirmed", () => {
    const route = liveRoute(true);
    route.matchPageData.game.interactionView.actions.push({
      id: "test-card-action",
      requestId: "fab:7",
      intent: "play-card",
      text: { key: "Play" },
      enabled: true,
      inputs: [],
    });
    mocks.route.mockReturnValue(route);
    render(
      <MantineProvider>
        <LiveMatchPage />
      </MantineProvider>,
    );
    fireEvent.click(screen.getByText("Submit card action"));
    fireEvent.click(screen.getByText("Concede from board"));
    fireEvent.click(screen.getByTestId("fab-live-concede-confirm"));
    expect(screen.getByRole("dialog").textContent).toContain("Wait for the current action");
    expect(mocks.emit.mock.calls.filter(([event]) => event === "submit_interaction")).toHaveLength(
      1,
    );
    const sync = mocks.on.mock.calls.find(([event]) => event === "state_sync")?.[1];
    if (!sync) throw new Error("Missing sync listener");
    act(() =>
      sync({
        gameId: "game-1",
        stateVersion: 8,
        state: route.matchPageData.game.view,
        interactionView: { ...route.matchPageData.game.interactionView, stateVersion: 8 },
      }),
    );
    fireEvent.click(screen.getByTestId("fab-live-concede-confirm"));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(mocks.emit.mock.calls.filter(([event]) => event === "submit_interaction")).toHaveLength(
      2,
    );
  });

  it("ignores older snapshots and clears actions when a newer snapshot has no interaction view", () => {
    mocks.route.mockReturnValue(liveRoute(true));
    render(
      <MantineProvider>
        <LiveMatchPage />
      </MantineProvider>,
    );
    const accept = mocks.on.mock.calls.find(([event]) => event === "state_sync")?.[1];
    if (!accept) throw new Error("Missing state sync listener");
    const route = liveRoute(true);
    act(() =>
      accept({
        gameId: "game-1",
        stateVersion: 9,
        state: route.matchPageData.game.view,
        interactionView: { ...route.matchPageData.game.interactionView, stateVersion: 9 },
      }),
    );
    act(() =>
      accept({
        gameId: "game-1",
        stateVersion: 8,
        state: route.matchPageData.game.view,
        interactionView: { ...route.matchPageData.game.interactionView, stateVersion: 8 },
      }),
    );
    expect(screen.getByLabelText("Rendered version").textContent).toBe("9");
    expect(screen.getByLabelText("Action state").textContent).toBe("9");
    act(() => accept({ gameId: "game-1", stateVersion: 10, state: route.matchPageData.game.view }));
    expect(screen.getByLabelText("Action state").textContent).toBe("unavailable");
    expect(screen.getByTestId("fab-live-recovery-notice").textContent).toContain(
      "could not be synchronized",
    );
    act(() =>
      accept({
        gameId: "game-1",
        stateVersion: 10,
        state: route.matchPageData.game.view,
        interactionView: { ...route.matchPageData.game.interactionView, stateVersion: 10 },
      }),
    );
    expect(screen.getByLabelText("Action state").textContent).toBe("10");
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("prevents duplicate submissions and shows a server rejection before resynchronizing", () => {
    const route = liveRoute(true);
    route.matchPageData.game.interactionView.actions.push({
      id: "test-card-action",
      requestId: "fab:7",
      intent: "play-card",
      text: { key: "Play" },
      enabled: true,
      inputs: [],
    });
    mocks.route.mockReturnValue(route);
    render(
      <MantineProvider>
        <LiveMatchPage />
      </MantineProvider>,
    );
    fireEvent.click(screen.getByText("Submit card action"));
    fireEvent.click(screen.getByText("Submit card action"));
    expect(mocks.emit.mock.calls.filter(([event]) => event === "submit_interaction")).toHaveLength(
      1,
    );
    expect(screen.getByLabelText("Saving state").textContent).toBe("saving");
    const reject = mocks.on.mock.calls.find(([event]) => event === "move_rejected")?.[1];
    if (!reject) throw new Error("Missing rejection listener");
    act(() =>
      reject({
        gameId: "game-1",
        reason: "That card is no longer playable.",
        currentVersion: 8,
        code: "rejected_illegal",
        correlationId: "correlation-1",
      }),
    );
    expect(screen.getByLabelText("Saving state").textContent).toBe("saving");
    expect(screen.getByTestId("fab-live-recovery-notice").textContent).toContain(
      "That card is no longer playable.",
    );
    expect(screen.getByLabelText("Action state").textContent).toBe("unavailable");
    expect(mocks.emit).toHaveBeenCalledWith("request_game_state_sync", { gameId: "game-1" });
    const sync = mocks.on.mock.calls.find(([event]) => event === "state_sync")?.[1];
    if (!sync) throw new Error("Missing sync listener");
    act(() =>
      sync({
        gameId: "game-1",
        stateVersion: 8,
        state: route.matchPageData.game.view,
        interactionView: { ...route.matchPageData.game.interactionView, stateVersion: 8 },
      }),
    );
    expect(screen.getByLabelText("Saving state").textContent).toBe("ready");
    expect(screen.getByRole("alert").textContent).toContain("That card is no longer playable.");
    fireEvent.click(screen.getByRole("button", { name: "Dismiss action notice" }));
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("uses the authoritative move acknowledgement without waiting for a room broadcast", () => {
    const route = liveRoute(true);
    route.matchPageData.game.interactionView.actions.push({
      id: "test-card-action",
      requestId: "fab:7",
      intent: "play-card",
      text: { key: "Play" },
      enabled: true,
      inputs: [],
    });
    mocks.route.mockReturnValue(route);
    render(
      <MantineProvider>
        <LiveMatchPage />
      </MantineProvider>,
    );
    fireEvent.click(screen.getByText("Submit card action"));
    const accepted = mocks.on.mock.calls.find(([event]) => event === "move_accepted")?.[1];
    if (!accepted) throw new Error("Missing accepted listener");
    act(() =>
      accepted({
        gameId: "game-1",
        actorId: "p1",
        moveType: "interaction:test-card-action",
        stateVersion: 8,
        state: route.matchPageData.game.view,
        patches: [],
        engineLogs: [],
        animationPlan: null,
        correlationId: "correlation-1",
        interactionView: { ...route.matchPageData.game.interactionView, stateVersion: 8 },
      }),
    );
    expect(screen.getByLabelText("Rendered version").textContent).toBe("8");
    expect(screen.getByLabelText("Action state").textContent).toBe("8");
    expect(screen.getByLabelText("Saving state").textContent).toBe("ready");
    expect(mocks.logCommandSent).toHaveBeenCalledWith(
      expect.objectContaining({ correlationId: "correlation-1", expectedVersion: 7 }),
    );
    expect(mocks.logCommandResponse).toHaveBeenCalledWith(
      "accepted",
      expect.objectContaining({ correlationId: "correlation-1", stateVersion: 8 }),
      expect.objectContaining({ correlationId: "correlation-1" }),
    );
  });

  it("keeps the confirmed board locked and retries sync until a same-version snapshot arrives", () => {
    vi.useFakeTimers();
    try {
      const route = liveRoute(true);
      route.matchPageData.game.interactionView.actions.push({
        id: "test-card-action",
        requestId: "fab:7",
        intent: "play-card",
        text: { key: "Play" },
        enabled: true,
        inputs: [],
      });
      mocks.route.mockReturnValue(route);
      render(
        <MantineProvider>
          <LiveMatchPage />
        </MantineProvider>,
      );
      fireEvent.click(screen.getByText("Submit card action"));
      void act(() => vi.advanceTimersByTime(10_000));
      expect(screen.getByTestId("fab-live-recovery-notice").textContent).toContain(
        "has not been confirmed",
      );
      expect(screen.getByLabelText("Rendered version").textContent).toBe("7");
      expect(screen.getByLabelText("Action state").textContent).toBe("7");
      expect(screen.getByLabelText("Saving state").textContent).toBe("saving");
      expect(mocks.logCommandTimeout).toHaveBeenCalledWith(
        expect.objectContaining({ correlationId: "correlation-1" }),
      );
      const syncRequests = () =>
        mocks.emit.mock.calls.filter(([event]) => event === "request_game_state_sync");
      expect(syncRequests()).toHaveLength(1);
      void act(() => vi.advanceTimersByTime(5_000));
      expect(syncRequests()).toHaveLength(2);

      const sync = mocks.on.mock.calls.find(([event]) => event === "state_sync")?.[1];
      if (!sync) throw new Error("Missing sync listener");
      act(() =>
        sync({
          gameId: "game-1",
          stateVersion: 7,
          state: route.matchPageData.game.view,
          interactionView: route.matchPageData.game.interactionView,
        }),
      );
      expect(screen.getByLabelText("Saving state").textContent).toBe("ready");
      mocks.emit.mockClear();
      void act(() => vi.advanceTimersByTime(5_000));
      expect(syncRequests()).toHaveLength(0);
    } finally {
      vi.useRealTimers();
    }
  });

  it("offers safe recovery and support actions after bounded sync retries", () => {
    vi.useFakeTimers();
    try {
      const route = liveRoute(true);
      route.matchPageData.game.interactionView.actions.push({
        id: "test-card-action",
        requestId: "fab:7",
        intent: "play-card",
        text: { key: "Play" },
        enabled: true,
        inputs: [],
      });
      mocks.route.mockReturnValue(route);
      render(
        <MantineProvider>
          <LiveMatchPage />
        </MantineProvider>,
      );
      fireEvent.click(screen.getByText("Submit card action"));
      void act(() => vi.advanceTimersByTime(10_000));
      void act(() => vi.advanceTimersByTime(5_000));
      void act(() => vi.advanceTimersByTime(5_000));
      void act(() => vi.advanceTimersByTime(5_000));

      const notice = screen.getByTestId("fab-live-recovery-notice");
      expect(notice.textContent).toContain("Match needs attention");
      expect(notice.textContent).toContain("Please do not submit the action again");
      expect(screen.getByRole("button", { name: "Retry now" })).toBeTruthy();
      expect(screen.getByRole("button", { name: "Copy support details" })).toBeTruthy();
      expect(screen.getByRole("button", { name: "Reload match" })).toBeTruthy();

      mocks.emit.mockClear();
      fireEvent.click(screen.getByRole("button", { name: "Retry now" }));
      expect(mocks.emit).toHaveBeenCalledWith("request_game_state_sync", { gameId: "game-1" });
    } finally {
      vi.useRealTimers();
    }
  });

  it("stops automatic synchronization immediately for terminal server errors", () => {
    vi.useFakeTimers();
    try {
      const route = liveRoute(true);
      route.matchPageData.game.interactionView.actions.push({
        id: "test-card-action",
        requestId: "fab:7",
        intent: "play-card",
        text: { key: "Play" },
        enabled: true,
        inputs: [],
      });
      mocks.route.mockReturnValue(route);
      render(
        <MantineProvider>
          <LiveMatchPage />
        </MantineProvider>,
      );
      fireEvent.click(screen.getByText("Submit card action"));
      const reject = mocks.on.mock.calls.find(([event]) => event === "move_rejected")?.[1];
      const gatewayError = mocks.on.mock.calls.find(([event]) => event === "gateway_error")?.[1];
      if (!reject || !gatewayError) throw new Error("Missing recovery listeners");
      act(() =>
        reject({
          gameId: "game-1",
          reason: "The action is stale.",
          code: "rejected_stale",
          correlationId: "correlation-1",
        }),
      );
      act(() => gatewayError({ code: "not_a_player", message: "You are not a player." }));
      const syncRequestCount = mocks.emit.mock.calls.filter(
        ([event]) => event === "request_game_state_sync",
      ).length;

      void act(() => vi.advanceTimersByTime(30_000));

      expect(
        mocks.emit.mock.calls.filter(([event]) => event === "request_game_state_sync"),
      ).toHaveLength(syncRequestCount);
      expect(screen.getByTestId("fab-live-recovery-notice").textContent).toContain(
        "You are not a player.",
      );
      expect(screen.getByLabelText("Action state").textContent).toBe("unavailable");
    } finally {
      vi.useRealTimers();
    }
  });

  it("shows a reversed play's reason from an accepted command outcome after state sync", () => {
    const route = liveRoute(true);
    mocks.route.mockReturnValue(route);
    render(
      <MantineProvider>
        <LiveMatchPage />
      </MantineProvider>,
    );
    const accepted = mocks.on.mock.calls.find(([event]) => event === "move_accepted")?.[1];
    const sync = mocks.on.mock.calls.find(([event]) => event === "state_sync")?.[1];
    if (!accepted || !sync) throw new Error("Missing gateway listeners");
    act(() =>
      accepted({
        gameId: "game-1",
        actorId: "p1",
        stateVersion: 8,
        outcome: {
          kind: "rules-action-reversed",
          action: "play-card",
          reason: {
            code: "required_targets_unavailable",
            message: "Shift the Tide of Battle couldn't be played because it had no legal target.",
          },
        },
      }),
    );
    act(() =>
      sync({
        gameId: "game-1",
        stateVersion: 8,
        state: route.matchPageData.game.view,
        interactionView: { ...route.matchPageData.game.interactionView, stateVersion: 8 },
      }),
    );
    expect(screen.getByRole("alert").textContent).toContain(
      "Shift the Tide of Battle couldn't be played because it had no legal target.",
    );
    expect(screen.getByRole("alert").textContent).toContain("Nothing was spent.");
  });

  it("rejects card submissions when the viewer lacks act permission", () => {
    const route = liveRoute(true);
    route.matchPageData.viewer.permissions.act = false;
    route.matchPageData.game.interactionView.actions.push({
      id: "test-card-action",
      requestId: "fab:7",
      intent: "play-card",
      text: { key: "Play" },
      enabled: true,
      inputs: [],
    });
    mocks.route.mockReturnValue(route);
    render(
      <MantineProvider>
        <LiveMatchPage />
      </MantineProvider>,
    );
    fireEvent.click(screen.getByText("Submit card action"));
    expect(mocks.emit).not.toHaveBeenCalledWith("submit_interaction", expect.anything());
    expect(screen.getByRole("alert").textContent).toContain("You do not have permission");
  });

  it("applies newer HTTP recovery through the same version guard as realtime snapshots", () => {
    const route = liveRoute(true);
    mocks.route.mockReturnValue(route);
    const page = render(
      <MantineProvider>
        <LiveMatchPage />
      </MantineProvider>,
    );
    const update = mocks.on.mock.calls.find(([event]) => event === "state_sync")?.[1];
    act(() =>
      update?.({
        gameId: "game-1",
        stateVersion: 9,
        state: route.matchPageData.game.view,
        interactionView: { ...route.matchPageData.game.interactionView, stateVersion: 9 },
      }),
    );
    expect(screen.getByLabelText("Rendered version").textContent).toBe("9");
    const recovered = liveRoute(true);
    recovered.matchPageData.game.stateVersion = 8;
    recovered.matchPageData.game.interactionView.stateVersion = 8;
    mocks.route.mockReturnValue(recovered);
    page.rerender(
      <MantineProvider>
        <LiveMatchPage />
      </MantineProvider>,
    );
    expect(screen.getByLabelText("Rendered version").textContent).toBe("9");
    const latest = liveRoute(true);
    latest.matchPageData.game.stateVersion = 10;
    latest.matchPageData.game.interactionView.stateVersion = 10;
    mocks.route.mockReturnValue(latest);
    page.rerender(
      <MantineProvider>
        <LiveMatchPage />
      </MantineProvider>,
    );
    expect(screen.getByLabelText("Rendered version").textContent).toBe("10");
    expect(screen.getByLabelText("Action state").textContent).toBe("10");
  });

  it("renders the board without requesting a second preparation resource", async () => {
    mocks.route.mockReturnValue(liveRoute(false));
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          status: "completed",
          gameId: "game-1",
        }),
      ),
    );
    render(
      <MantineProvider>
        <LiveMatchPage />
      </MantineProvider>,
    );
    await act(async () => {
      await Promise.resolve();
    });
    expect(fetch).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Concede from board" })).not.toBeNull();
    expect(screen.queryByText("Starting deck")).toBeNull();
  });

  it("shows the result without analytics and lets the player inspect the board", () => {
    const route = liveRoute(false);
    route.matchPageData.game.view = {
      players: [{ id: "p1" }, { id: "p2" }],
      cards: {},
      result: { kind: "win", winnerId: "p2", loserId: "p1", reason: "concede" },
    };
    mocks.route.mockReturnValue(route);
    render(
      <MantineProvider>
        <LiveMatchPage />
      </MantineProvider>,
    );
    expect(screen.getByRole("dialog").textContent).toContain("Defeat");
    fireEvent.click(screen.getByRole("button", { name: "Inspect board" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.getByRole("button", { name: "Concede from board" })).not.toBeNull();
  });

  it("does not enable the board concession control without permission", () => {
    mocks.route.mockReturnValue(liveRoute(false));
    render(
      <MantineProvider>
        <LiveMatchPage />
      </MantineProvider>,
    );

    expect(
      (screen.getByRole("button", { name: "Concede from board" }) as HTMLButtonElement).disabled,
    ).toBe(true);
  });
});

describe("FAB live session routing", () => {
  afterEach(cleanup);
  it("waits for session preparation and renders cancellation without joining a game", () => {
    vi.clearAllMocks();
    mocks.route.mockReturnValue({ error: null, session: { phase: "starting" } });
    const { rerender } = render(
      <MantineProvider>
        <LiveMatchPage />
      </MantineProvider>,
    );
    expect(screen.getByText("Starting match")).not.toBeNull();
    expect(mocks.join).not.toHaveBeenCalled();
    mocks.route.mockReturnValue({
      error: null,
      session: { phase: "cancelled", reason: "Opponent left preparation." },
    });
    rerender(
      <MantineProvider>
        <LiveMatchPage />
      </MantineProvider>,
    );
    expect(screen.getByText("Opponent left preparation.")).not.toBeNull();
    expect(mocks.join).not.toHaveBeenCalled();
  });
});

describe("FAB live pregame projection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 404 }));
    vi.stubGlobal("crypto", { randomUUID: () => "correlation-1" });
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("renders a JSON-round-tripped owner pool hydrated from real authored cards", () => {
    const resolved = resolvePracticeDeckSelection(
      "cc-las-vegas-3rd-dorinthea",
      "live-pregame-projection",
    );
    const playerPool = JSON.parse(JSON.stringify(resolved.cardPool)) as FabPregameCardPool;
    mocks.route.mockReturnValue({
      error: null,
      session: {
        phase: "preparation",
        preparation: {
          playerId: "player-1",
          turnOrder: {
            stage: "chosen",
            chooserId: "player-1",
            firstPlayerId: "player-2",
            source: "player",
          },
          gameId: "game-1",
          status: "waiting",
          deadlineAt: new Date(Date.now() + 60_000).toISOString(),
          pool: playerPool,
          selection: createDefaultFabPregameSelection(playerPool),
          player: { label: "Player One", heroName: "Dorinthea Ironsong" },
          opponent: { label: "Player Two", heroName: "Rhinar, Reckless Rampage" },
          locked: false,
          opponentReady: false,
        },
      },
      matchPageData: null,
    });

    render(
      <MantineProvider>
        <LiveMatchPage />
      </MantineProvider>,
    );

    expect(screen.getByRole("button", { name: "Confirm selection" })).not.toBeNull();
    expect(screen.getByText("Dorinthea Ironsong")).not.toBeNull();
  });
});

describe("FAB live match wire-state conversion", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 404 }));
    vi.stubGlobal("crypto", { randomUUID: () => "correlation-1" });
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("applies fresh reveal resources atomically and replaces rather than merges snapshots", () => {
    const route = liveRoute(true);
    const emptyZones = Object.fromEntries(
      [
        "deck",
        "hand",
        "graveyard",
        "banished",
        "arsenal",
        "pitch",
        "combatChain",
        "stack",
        "arena",
        "head",
        "chest",
        "arms",
        "legs",
        "weapon1",
        "weapon2",
        "heroZone",
      ].map((zone) => [zone, []]),
    );
    route.matchPageData.game.view = {
      playerIds: ["p1", "p2"],
      optionalTriggerAutomation: [],
      priorityAutomation: null,
      priorityHoldArmed: null,
      players: {
        p1: {
          playerId: "p1",
          heroCardId: "p1-hero",
          life: 20,
          actionPoints: 1,
          resourcePoints: 0,
          chiPoints: 0,
          intellect: 4,
          marked: false,
          zones: { ...emptyZones, hand: ["p1-wtr-snatch-0"] },
        },
        p2: {
          playerId: "p2",
          heroCardId: "p2-hero",
          life: 20,
          actionPoints: 0,
          resourcePoints: 0,
          chiPoints: 0,
          intellect: 4,
          marked: false,
          zones: emptyZones,
        },
      },
      activePlayerId: "p1",
      priorityPlayerId: "p1",
      turnNumber: 1,
      phase: "action",
      combat: null,
      rulesStack: [],
      effects: [],
      subcardsByHostId: {},
      activeFaceIdsByInstanceId: {},
      faceDownInstanceIds: [],
      stateID: 1,
      gameEnded: false,
      winnerId: null,
      endReason: null,
    };
    route.matchPageData.game.resources = {
      cardInstances: { "p1-wtr-snatch-0": "canon-snatch" },
      cardDefinitions: {},
      matchArt: { "p1-wtr-snatch-0": "printing-x" },
    };
    mocks.route.mockReturnValue(route);
    render(
      <MantineProvider>
        <LiveMatchPage />
      </MantineProvider>,
    );

    // A null state would skip the board entirely; the concede control only
    // renders when the converted presentation state mounted the table.
    const concedeButton = screen.getByRole("button", {
      name: "Concede from board",
    }) as HTMLButtonElement;
    expect(concedeButton.disabled).toBe(false);
    expect(screen.getByLabelText("Rendered cards").textContent).toContain("printing-x");
    const accept = mocks.on.mock.calls.find(([event]) => event === "state_update")?.[1];
    expect(accept).toBeDefined();
    const resources = {
      cardInstances: { "p1-wtr-snatch-0": "canon-revealed" },
      cardDefinitions: {
        "canon-revealed": defineFleshAndBloodCardUnchecked({
          canonicalId: "canon-revealed",
          slug: "newly-revealed-card",
          types: ["Action"],
        }),
      },
    };
    const envelope = {
      gameId: "game-1",
      state: route.matchPageData.game.view,
      stateVersion: 8,
      resources,
    };
    act(() => accept?.(envelope));
    expect(screen.getByLabelText("Rendered version").textContent).toBe("8");
    expect(screen.getByLabelText("Rendered cards").textContent).toContain("canon-revealed");
    expect(screen.getByLabelText("Rendered cards").textContent).toContain("printing-x");
    expect(screen.getByLabelText("Rendered definitions").textContent?.toLowerCase()).toContain(
      "newly revealed card",
    );
    act(() =>
      accept?.({ ...envelope, stateVersion: 7, resources: route.matchPageData.game.resources }),
    );
    expect(screen.getByLabelText("Rendered version").textContent).toBe("8");
    expect(screen.getByLabelText("Rendered definitions").textContent?.toLowerCase()).toContain(
      "newly revealed card",
    );
    act(() => accept?.({ ...envelope, stateVersion: 9, resources: { cardInstances: null } }));
    expect(screen.getByLabelText("Rendered version").textContent).toBe("8");
    expect(mocks.emit).toHaveBeenCalledWith("request_game_state_sync", { gameId: "game-1" });
    act(() =>
      accept?.({
        ...envelope,
        stateVersion: 9,
        resources: { cardInstances: {}, cardDefinitions: {}, matchArt: {} },
      }),
    );
    expect(screen.getByLabelText("Rendered definitions").textContent?.toLowerCase()).not.toContain(
      "newly revealed card",
    );
    expect(screen.getByLabelText("Rendered cards").textContent).not.toContain("canon-revealed");
    expect(screen.getByLabelText("Rendered cards").textContent).not.toContain("printing-x");
  });
});

function render(ui: Parameters<typeof renderRaw>[0]) {
  return renderRaw(ui, { wrapper: FabPresentationCatalogProvider });
}
