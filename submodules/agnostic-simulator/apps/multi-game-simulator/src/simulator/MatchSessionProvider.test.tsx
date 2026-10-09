import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { FabFirstPlayerChoice } from "../games/flesh-and-blood/FabFirstPlayerChoice";
import { MatchSessionRecovery } from "./MatchSessionRecovery";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MatchSessionSchema, type MatchSession } from "@tcg/game-page-contract";
import { MatchSessionProvider, useMatchSession } from "./MatchSessionProvider";
import { logBrowserInfo } from "../observability/browser";

vi.mock("../observability/browser", () => ({ logBrowserInfo: vi.fn() }));

const gateway = vi.hoisted(() => ({
  events: new Map<string, (event: Record<string, unknown>) => void>(),
  emit: vi.fn(),
  listeners: new Map<string, Set<(event: Record<string, unknown>) => void>>(),
  disconnected: undefined as (() => void) | undefined,
  authenticated: undefined as (() => void) | undefined,
  release: vi.fn(),
}));
vi.mock("../lib/gateway/root-socket", () => ({
  initRootSocket: vi.fn(),
  destroyRootSocket: vi.fn(),
  acquireRootGatewayHandle: () => ({
    on: (event: string, listener: (value: Record<string, unknown>) => void) => {
      const listeners = gateway.listeners.get(event) ?? new Set();
      listeners.add(listener);
      gateway.listeners.set(event, listeners);
      gateway.events.set(event, (value) => {
        for (const callback of [...listeners]) callback(value);
      });
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) gateway.events.delete(event);
      };
    },
    onAuthenticated: (listener: () => void) => {
      gateway.authenticated = listener;
      return vi.fn();
    },
    emit: gateway.emit,
    onDisconnected: (listener: () => void) => {
      gateway.disconnected = listener;
      return vi.fn();
    },
    release: gateway.release,
  }),
}));
const pending = MatchSessionSchema.parse({
  schemaVersion: 2,
  revision: 1,
  phase: "starting",
  gameId: "g1",
  match: {
    matchId: "m1",
    gameType: "flesh-and-blood",
    format: "best_of_1",
    matchType: "casual",
    status: "waiting",
    participants: [],
    gameIds: [],
  },
  viewer: {
    role: "spectator",
    spectatorId: "s1",
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
});
if (pending.phase !== "starting") throw new Error("Expected starting fixture");
const { gameId: _pendingGameId, ...common } = pending;
const playing = MatchSessionSchema.parse({
  ...common,
  phase: "playing",
  revision: 2,
  match: { ...pending.match, status: "in_progress", gameIds: ["g1"] },
  game: {
    gameId: "g1",
    gameNumber: 1,
    status: "in_progress",
    authority: "server",
    stateVersion: 4,
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
});
function Probe() {
  const { session, refresh, error } = useMatchSession();
  return (
    <>
      <output>{session?.phase}</output>
      <input aria-label="Unsent draft" defaultValue="" />
      {session?.phase === "preparation" && (
        <output aria-label="Preparation progress">
          {session.preparation.turnOrder.stage} /{" "}
          {session.preparation.opponentReady ? "opponent ready" : "opponent waiting"}
        </output>
      )}
      {error && <p role="alert">{error}</p>}
      <button onClick={() => void refresh()}>Refresh</button>
    </>
  );
}
function Page({ initial = pending }: { initial?: MatchSession }) {
  return (
    <MatchSessionProvider initial={initial} gameSlug="flesh-and-blood">
      <Probe />
    </MatchSessionProvider>
  );
}
beforeEach(() => {
  gateway.events.clear();
  gateway.listeners.clear();
  gateway.emit.mockImplementation(() => {
    throw new Error("Socket unavailable");
  });
  vi.spyOn(Math, "random").mockReturnValue(0.5);
  gateway.authenticated = undefined;
  vi.clearAllMocks();
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => Response.json(playing)),
  );
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.useRealTimers();
});
describe("shared match session lifecycle", () => {
  it("renders the server-selected phase on the server and first client render without polling", () => {
    expect(renderToString(<Page initial={playing} />)).toContain("playing");
    render(<Page initial={playing} />);
    expect(screen.getByText("playing")).toBeTruthy();
    expect(fetch).not.toHaveBeenCalled();
  });
  it("recovers the SSR-to-realtime gap after authentication", async () => {
    render(<Page />);
    await act(async () => gateway.authenticated?.());
    expect(screen.getByText("playing")).toBeTruthy();
    expect(fetch).toHaveBeenCalledTimes(1);
  });
  it("refreshes only relevant newer notifications, including spectator preparation", async () => {
    render(<Page />);
    await act(async () => {
      gateway.events.get("match_session_changed")?.({ matchId: "m2", revision: 3 });
      gateway.events.get("match_session_changed")?.({ matchId: "m1", revision: 1 });
    });
    expect(fetch).not.toHaveBeenCalled();
    await act(async () =>
      gateway.events.get("match_session_changed")?.({ matchId: "m1", revision: 2 }),
    );
    expect(screen.getByText("playing")).toBeTruthy();
  });
  it("keeps the current board on failure and accepts a user retry", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 503 }));
    render(<Page initial={playing} />);
    fireEvent.click(screen.getByRole("button", { name: "Refresh" }));
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.getByText("playing")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Refresh" }));
    await waitFor(() => expect(screen.queryByRole("alert")).toBeNull());
  });

  it("does not refresh unchanged join acknowledgments", async () => {
    render(<Page initial={playing} />);
    await act(async () => {
      const event = { ...playing.match, revision: 2, player1Score: 0, player2Score: 0 };
      gateway.events.get("match_state")?.(event);
      gateway.events.get("match_state")?.(event);
    });
    expect(fetch).not.toHaveBeenCalled();
  });
  it("recovers changed match metadata but ignores malformed acknowledgments", async () => {
    render(<Page initial={playing} />);
    await act(async () => {
      gateway.events.get("match_state")?.({ matchId: "m1", revision: 3 });
    });
    expect(fetch).not.toHaveBeenCalled();
    await act(async () => {
      gateway.events.get("match_state")?.({
        ...playing.match,
        status: "completed",
        revision: 3,
        player1Score: 1,
        player2Score: 0,
      });
    });
    expect(fetch).toHaveBeenCalledTimes(1);
  });
  it("ignores an older preparation response after playing", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(Response.json(pending));
    render(<Page initial={playing} />);
    fireEvent.click(screen.getByRole("button", { name: "Refresh" }));
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(screen.getByText("playing")).toBeTruthy();
  });
  it("serializes recovery requests and aborts when leaving", async () => {
    let resolve: (value: Response) => void = () => {};
    vi.mocked(fetch).mockImplementationOnce(
      () =>
        new Promise<Response>((done) => {
          resolve = done;
        }),
    );
    const page = render(<Page />);
    fireEvent.click(screen.getByRole("button", { name: "Refresh" }));
    fireEvent.click(screen.getByRole("button", { name: "Refresh" }));
    expect(fetch).toHaveBeenCalledTimes(1);
    await act(async () => resolve(Response.json(playing)));
    expect(fetch).toHaveBeenCalledTimes(1);
    page.unmount();
    expect(gateway.release).toHaveBeenCalled();
    expect(gateway.events.size).toBe(0);
  });
  it("accepts cancelled state without ever mounting preparation", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      Response.json({
        ...pending,
        phase: "cancelled",
        revision: 2,
        match: { ...pending.match, status: "abandoned" },
        reason: "Preparation expired.",
      }),
    );
    render(<Page />);
    fireEvent.click(screen.getByRole("button", { name: "Refresh" }));
    expect(await screen.findByText("cancelled")).toBeTruthy();
    await waitFor(() => {
      expect(gateway.release).toHaveBeenCalledTimes(1);
      expect(gateway.events.size).toBe(0);
    });
  });
});

describe("pending session recovery without realtime delivery", () => {
  beforeEach(() => vi.useFakeTimers());

  it("recovers a missed game-start notification and stops reading once playing", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(Response.json(pending));
    render(<Page />);
    await act(() => vi.advanceTimersByTimeAsync(3_000));
    expect(screen.getByText("starting")).toBeTruthy();
    await act(() => vi.advanceTimersByTimeAsync(3_000));
    expect(screen.getByText("playing")).toBeTruthy();
    await act(() => vi.advanceTimersByTimeAsync(60_000));
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("backs off after a failed read and recovers without another event", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 503 }));
    render(<Page />);
    await act(() => vi.advanceTimersByTimeAsync(3_000));
    expect(screen.queryByRole("alert")).toBeNull();
    await act(() => vi.advanceTimersByTimeAsync(5_999));
    expect(fetch).toHaveBeenCalledTimes(1);
    await act(() => vi.advanceTimersByTimeAsync(1));
    expect(screen.getByText("playing")).toBeTruthy();
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("times out a stalled request, never overlaps it, then retries", async () => {
    vi.mocked(fetch).mockImplementationOnce(
      (_url, options) =>
        new Promise((_resolve, reject) => {
          options?.signal?.addEventListener("abort", () =>
            reject(new DOMException("Aborted", "AbortError")),
          );
        }),
    );
    render(<Page />);
    await act(() => vi.advanceTimersByTimeAsync(12_999));
    expect(fetch).toHaveBeenCalledTimes(1);
    await act(() => vi.advanceTimersByTimeAsync(1));
    expect(screen.queryByRole("alert")).toBeNull();
    await act(() => vi.advanceTimersByTimeAsync(6_000));
    expect(screen.getByText("playing")).toBeTruthy();
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("cancels an in-flight read and all scheduled recovery on unmount", async () => {
    let signal: AbortSignal | null | undefined;
    vi.mocked(fetch).mockImplementationOnce(
      (_url, options) =>
        new Promise((_resolve, reject) => {
          signal = options?.signal;
          signal?.addEventListener("abort", () =>
            reject(new DOMException("Aborted", "AbortError")),
          );
        }),
    );
    const page = render(<Page />);
    await act(() => vi.advanceTimersByTimeAsync(3_000));
    page.unmount();
    expect(signal?.aborted).toBe(true);
    await act(() => vi.advanceTimersByTimeAsync(60_000));
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});

function preparation(deadlineAt: string): MatchSession {
  return MatchSessionSchema.parse({
    ...pending,
    phase: "preparation",
    viewer: {
      permissions: pending.viewer.permissions,
      role: "player",
      userId: "u1",
      actorId: "p1",
      seat: 1,
    },
    preparation: {
      object: "game_pregame",
      phase: "selecting",
      phaseToken: "test-phase",
      serverTime: new Date().toISOString(),
      selectionOutcome: "pending",
      kind: "fab",
      matchId: "m1",
      gameId: "g1",
      status: "waiting",
      playerId: "p1",
      deadlineAt,
      turnOrder: { stage: "choosing", chooserId: "p2" },
      pool: {},
      selection: {},
      locked: false,
      opponentReady: false,
      player: { playerId: "p1", label: "You" },
      opponent: { playerId: "p2", label: "Opponent" },
    },
  });
}

describe("preparation deadline and dialog recovery", () => {
  it("applies missed opponent choices and readiness updates before entering the board", async () => {
    vi.useFakeTimers();
    const initial = preparation(new Date(Date.now() + 60_000).toISOString());
    if (initial.phase !== "preparation") throw new Error("Expected preparation");
    const chosen = {
      ...initial,
      revision: 2,
      preparation: {
        ...initial.preparation,
        turnOrder: { stage: "chosen", chooserId: "p2", firstPlayerId: "p1", source: "player" },
        opponentReady: true,
      },
    };
    vi.mocked(fetch).mockResolvedValueOnce(Response.json(chosen));
    render(<Page initial={initial} />);
    expect(screen.getByLabelText("Preparation progress").textContent).toBe(
      "choosing / opponent waiting",
    );
    await act(() => vi.advanceTimersByTimeAsync(3_000));
    expect(screen.getByLabelText("Preparation progress").textContent).toBe(
      "chosen / opponent ready",
    );
    await act(() => vi.advanceTimersByTimeAsync(3_000));
    expect(screen.getByText("playing")).toBeTruthy();
  });

  it("refreshes an expired deadline once, then uses paced recovery until the board is ready", async () => {
    vi.useFakeTimers();
    const initial = preparation(new Date(Date.now() + 500).toISOString());
    vi.mocked(fetch).mockResolvedValueOnce(Response.json(initial));
    render(<Page initial={initial} />);
    await act(() => vi.advanceTimersByTimeAsync(750));
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(screen.getByText("preparation")).toBeTruthy();
    await act(() => vi.advanceTimersByTimeAsync(1_000));
    expect(fetch).toHaveBeenCalledTimes(1);
    await act(() => vi.advanceTimersByTimeAsync(1_250));
    expect(screen.getByText("playing")).toBeTruthy();
  });

  it("shows one recovery notice after a sustained failure and lets the player retry", async () => {
    vi.useFakeTimers();
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 503 }));
    function WaitingScreen() {
      const { session } = useMatchSession();
      if (session?.phase === "playing") return <main>Game board</main>;
      return (
        <FabFirstPlayerChoice
          player={{ label: "You" }}
          opponent={{ label: "Opponent" }}
          canChoose={false}
          deadline={Date.now() + 60_000}
          onChoose={() => {}}
          recovery={<MatchSessionRecovery />}
        />
      );
    }
    render(
      <MantineProvider>
        <MatchSessionProvider
          initial={preparation(new Date(Date.now() + 60_000).toISOString())}
          gameSlug="flesh-and-blood"
        >
          <WaitingScreen />
        </MatchSessionProvider>
      </MantineProvider>,
    );
    expect(screen.queryByRole("button", { name: "Retry connection" })).toBeNull();
    await act(() => vi.advanceTimersByTimeAsync(11_000));
    const button = screen.getByRole("button", { name: "Retry connection" });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(
      screen.getByRole("status", { name: "Waiting for the first-player choice" }).contains(button),
    ).toBe(true);
    vi.mocked(fetch).mockResolvedValue(Response.json(playing));
    await act(async () => fireEvent.click(button));
    expect(screen.getByText("Game board")).toBeTruthy();
    expect(screen.queryByTestId("fab-first-player-choice")).toBeNull();
  });
});

describe("preparation over WebSocket", () => {
  it("does not start HTTP fallback when a socket request times out after leaving", async () => {
    vi.useFakeTimers();
    gateway.emit.mockImplementation(() => {});
    const page = render(
      <Page initial={preparation(new Date(Date.now() + 180_000).toISOString())} />,
    );
    await act(async () => gateway.authenticated?.());
    expect(gateway.emit).toHaveBeenCalledWith("request_preparation_sync", expect.anything());
    page.unmount();
    await act(() => vi.advanceTimersByTimeAsync(60_000));
    expect(fetch).not.toHaveBeenCalled();
    expect(gateway.events.size).toBe(0);
  });

  it("retries a lost socket acknowledgement through HTTP with the same command ID", async () => {
    vi.useFakeTimers();
    const initial = preparation(new Date(Date.now() + 180_000).toISOString());
    gateway.emit.mockImplementation((event: string, payload: { correlationId: string }) => {
      if (event === "request_preparation_sync") {
        gateway.events.get("preparation_state")?.({
          correlationId: payload.correlationId,
          snapshot: {
            state: "unchanged",
            matchId: "m1",
            gameId: "g1",
            revision: initial.revision,
            serverTime: new Date().toISOString(),
          },
        });
      }
      // The server may have committed confirmation; its acknowledgement is lost.
    });
    vi.mocked(fetch).mockImplementation(async (_url, options) => {
      const body = JSON.parse(String(options?.body));
      return Response.json({
        status: "accepted",
        matchId: "m1",
        gameId: body.gameId,
        commandId: body.commandId,
        phaseToken: body.phaseToken,
        revision: 2,
      });
    });
    const outcomes: string[] = [];
    function Confirm() {
      const { submitPreparation } = useMatchSession();
      return (
        <button
          onClick={() =>
            void submitPreparation({
              type: "confirm_preparation",
              selection: { sideboard: [] },
            }).then((result) => {
              outcomes.push(result.status);
            })
          }
        >
          Confirm selection
        </button>
      );
    }
    render(
      <MatchSessionProvider initial={initial} gameSlug="flesh-and-blood">
        <Probe />
        <Confirm />
      </MatchSessionProvider>,
    );
    await act(async () => gateway.authenticated?.());
    fireEvent.click(screen.getByRole("button", { name: "Confirm selection" }));
    expect(fetch).not.toHaveBeenCalled();
    await act(() => vi.advanceTimersByTimeAsync(4_000));
    const socketCommand = gateway.emit.mock.calls.find(
      ([event]) => event === "confirm_preparation",
    )?.[1];
    expect(socketCommand).toBeDefined();
    expect(fetch).toHaveBeenCalledTimes(1);
    const [url, options] = vi.mocked(fetch).mock.calls[0]!;
    expect(String(url)).toContain("/matches/m1/pregame");
    expect(options?.method).toBe("PUT");
    expect({ matchId: "m1", ...JSON.parse(String(options?.body)) }).toEqual(socketCommand);
    expect(outcomes).toEqual(["accepted"]);
    expect(logBrowserInfo).toHaveBeenCalledWith("preparation.command_fallback", {
      reason: "socket_reply_failed",
    });
    expect(logBrowserInfo).toHaveBeenCalledWith("preparation.command_reply", {
      command: "confirm_preparation",
      transport: "http",
      outcome: "accepted",
      duration_ms: expect.any(Number),
    });
    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.queryByText("Refreshing match…")).toBeNull();
  });

  it("pushes private readiness without HTTP polling or disturbing input and focus", async () => {
    vi.useFakeTimers();
    const initial = preparation(new Date(Date.now() + 180_000).toISOString());
    if (initial.phase !== "preparation") throw new Error("Expected preparation");
    gateway.emit.mockImplementation((event: string, payload: { correlationId: string }) => {
      if (event !== "request_preparation_sync") return;
      gateway.events.get("preparation_state")?.({
        correlationId: payload.correlationId,
        snapshot: {
          state: "unchanged",
          matchId: "m1",
          gameId: "g1",
          revision: initial.revision,
          serverTime: new Date().toISOString(),
        },
      });
    });
    render(<Page initial={initial} />);
    const input = screen.getByRole("textbox", { name: "Unsent draft" });
    fireEvent.change(input, { target: { value: "keep this selection" } });
    input.focus();
    await act(async () => gateway.authenticated?.());
    await act(() => vi.advanceTimersByTimeAsync(9_000));
    expect(fetch).not.toHaveBeenCalled();
    await act(async () =>
      gateway.events.get("preparation_state")?.({
        snapshot: {
          state: "preparation",
          matchId: "m1",
          gameId: "g1",
          revision: 2,
          serverTime: new Date().toISOString(),
          preparation: { ...initial.preparation, opponentReady: true },
        },
      }),
    );
    expect(screen.getByLabelText("Preparation progress").textContent).toContain("opponent ready");
    expect(screen.getByRole("textbox", { name: "Unsent draft" })).toBe(input);
    expect(input).toHaveProperty("value", "keep this selection");
    expect(document.activeElement).toBe(input);
    expect(fetch).not.toHaveBeenCalled();
    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.queryByText("Refreshing match…")).toBeNull();
  });

  it("ignores old revisions and preparation projected for another actor", async () => {
    const initial = preparation(new Date(Date.now() + 180_000).toISOString());
    if (initial.phase !== "preparation") throw new Error("Expected preparation");
    render(<Page initial={initial} />);
    for (const [revision, playerId] of [
      [0, "p1"],
      [2, "p2"],
    ] as const) {
      await act(async () =>
        gateway.events.get("preparation_state")?.({
          snapshot: {
            state: "preparation",
            matchId: "m1",
            gameId: "g1",
            revision,
            serverTime: new Date().toISOString(),
            preparation: { ...initial.preparation, playerId, opponentReady: true },
          },
        }),
      );
    }
    expect(screen.getByLabelText("Preparation progress").textContent).toContain("opponent waiting");
    expect(fetch).not.toHaveBeenCalled();
  });
});
