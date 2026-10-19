// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vite-plus/test";
import { MantineProvider } from "@mantine/core";
import { MemoryRouter } from "react-router";
import type { ComponentProps } from "react";
import type Arena from "../components/Arena3D/AlphaClashArena3D";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { AlphaClashServerEngine } from "@tcg/alpha-clash-server-adapter";
import { createAlphaClashPracticeEngine } from "../practice-setup";
import type { AlphaClashBotContext, AlphaClashBotInput } from "../bot-decision";
import type { DecisionRequest, DecisionResponse } from "../../../simulator/bot/decision-worker";
import { SIMULATOR_BOT_SPEED_MS } from "../../../simulator/SimulatorBotQuickControls";
import type { AcCommand } from "@tcg/alpha-clash-engine";
import { AlphaClashPracticePage } from "./Practice.page";
vi.mock("../practice-setup", async (original) => ({
  ...(await original<typeof import("../practice-setup")>()),
  createAlphaClashPracticeEngine: vi.fn(),
}));
// Retain the production controls and real adapter; only omit the WebGL canvas.
vi.mock("../components/Arena3D/AlphaClashArena3D", () => ({
  default: ({ controls, utilities }: ComponentProps<typeof Arena>) => (
    <>
      {utilities}
      {controls}
    </>
  ),
}));
vi.mock("../components/useAlphaClashPresentation", () => ({
  useAlphaClashPresentation: () => ({
    busy: false,
    strike: null,
    finishStrike: vi.fn(),
    onSceneAnchors: vi.fn(),
  }),
}));

type BotOutput = { command: AcCommand | null };
class WorkerDouble {
  static instances: WorkerDouble[] = [];
  onmessage: ((event: MessageEvent<DecisionResponse<BotOutput>>) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;
  onmessageerror: ((event: MessageEvent) => void) | null = null;
  postMessage =
    vi.fn<(request: DecisionRequest<AlphaClashBotInput, AlphaClashBotContext>) => void>();
  terminate = vi.fn();
  constructor() {
    WorkerDouble.instances.push(this);
  }
  reply(command: AcCommand) {
    const request = this.postMessage.mock.calls.at(-1)?.[0];
    if (!request) throw new Error("Expected a worker request");
    this.onmessage?.(
      new MessageEvent("message", { data: { id: request.id, output: { command } } }),
    );
  }
}
beforeEach(() => {
  vi.clearAllMocks();
  WorkerDouble.instances = [];
  vi.stubGlobal("Worker", WorkerDouble);
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
    })),
  );
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

async function startBotTurn() {
  const g = Spec.fromFixture({
    phase: { name: "expansion", step: "resource" },
    activePlayer: "player-two",
    playerTwo: { resource: 3 },
  });
  const engine = new AlphaClashServerEngine(g.state, { human: "player-one", bot: "player-two" });
  vi.mocked(createAlphaClashPracticeEngine).mockResolvedValue(engine);
  const dispatch = vi.spyOn(engine, "dispatch");
  const synchronous = vi.spyOn(engine, "takeAutomatedAction");
  vi.useFakeTimers();
  const view = render(
    <MantineProvider env="test">
      <MemoryRouter
        initialEntries={[
          "/alpha-clash/simulator/practice?playerDeck=clarity-hyper-aggro&opponentDeck=absence-makati&mode=bot&strategy=expert-oracle",
        ]}
      >
        <AlphaClashPracticePage />
      </MemoryRouter>
    </MantineProvider>,
  );
  await act(async () => {});
  const worker = WorkerDouble.instances[0];
  expect(worker).toBeDefined();
  return { engine, dispatch, synchronous, worker, ...view };
}

it("continues after a native in-place transition and supports pause, step and resume", async () => {
  const { engine, worker, synchronous } = await startBotTurn();
  const original = engine.state;
  expect(worker.postMessage).toHaveBeenCalledTimes(1);
  await act(async () => {
    worker.reply({ type: "pass", playerId: "player-two" });
    await vi.advanceTimersByTimeAsync(SIMULATOR_BOT_SPEED_MS.balanced);
  });
  expect(engine.state).toBe(original);
  expect(engine.state.phase.name).toBe("primary");
  expect(worker.postMessage).toHaveBeenCalledTimes(2);
  fireEvent.click(screen.getByRole("button", { name: "Pause automatic bot playback" }));
  expect(worker.terminate).toHaveBeenCalledTimes(1);
  await act(async () => vi.advanceTimersByTimeAsync(1000));
  expect(worker.postMessage).toHaveBeenCalledTimes(2);
  fireEvent.click(screen.getByRole("button", { name: "Run next bot move" }));
  const stepped = WorkerDouble.instances.at(-1)!;
  fireEvent.click(screen.getByRole("button", { name: "Run next bot move" }));
  expect(stepped.postMessage).toHaveBeenCalledTimes(1);
  await act(async () => {
    stepped.reply({ type: "endTurn", playerId: "player-two" });
    await vi.advanceTimersByTimeAsync(0);
  });
  expect(engine.getActivePlayerId()).toBe("human");
  expect(synchronous).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Resume automatic bot playback" }));
  expect(screen.getByRole("button", { name: "Pause automatic bot playback" })).toBeTruthy();
});

it.each(["pause", "hot-seat", "unmount"])(
  "discards late worker replies after %s",
  async (cancel) => {
    const { engine, worker, unmount } = await startBotTurn();
    const revision = engine.getStateID();
    if (cancel === "pause")
      fireEvent.click(screen.getByRole("button", { name: "Pause automatic bot playback" }));
    else if (cancel === "hot-seat")
      fireEvent.click(screen.getByRole("button", { name: "Hot seat" }));
    else unmount();
    expect(worker.terminate).toHaveBeenCalledTimes(1);
    await act(async () => {
      worker.reply({ type: "pass", playerId: "player-two" });
      await vi.advanceTimersByTimeAsync(1000);
    });
    expect(engine.getStateID()).toBe(revision);
  },
);

it("rejects a proposal from an older revision even before React rerenders", async () => {
  const { engine, worker, dispatch } = await startBotTurn();
  expect(
    engine.dispatch("pass", "bot", {}, { gameId: "test", sourceAuthority: "server" }).success,
  ).toBe(true);
  const revision = engine.getStateID();
  await act(async () => {
    worker.reply({ type: "pass", playerId: "player-two" });
    await vi.advanceTimersByTimeAsync(SIMULATOR_BOT_SPEED_MS.balanced);
  });
  expect(engine.getStateID()).toBe(revision);
  expect(dispatch).toHaveBeenCalledTimes(1);
});

it.each(["next", "resume"])("recovers from worker failure using %s", async (retry) => {
  const { engine, worker } = await startBotTurn();
  await act(async () => worker.onerror?.(new ErrorEvent("error")));
  expect(screen.getByText("Bot worker failed to load or execute")).toBeTruthy();
  expect(screen.getByRole("button", { name: "Resume automatic bot playback" })).toBeTruthy();
  fireEvent.click(
    screen.getByRole("button", {
      name: retry === "next" ? "Run next bot move" : "Resume automatic bot playback",
    }),
  );
  expect(WorkerDouble.instances).toHaveLength(2);
  const resumed = WorkerDouble.instances[1];
  await act(async () => {
    resumed.reply({ type: "pass", playerId: "player-two" });
    await vi.advanceTimersByTimeAsync(SIMULATOR_BOT_SPEED_MS.balanced);
  });
  expect(engine.state.phase.name).toBe("primary");
  expect(screen.queryByText("Bot worker failed to load or execute")).toBeNull();
});

it("pauses a successful move that publishes no new revision", async () => {
  const { engine, worker } = await startBotTurn();
  vi.spyOn(engine, "getStateID").mockReturnValue(engine.getStateID());
  await act(async () => {
    worker.reply({ type: "pass", playerId: "player-two" });
    await vi.advanceTimersByTimeAsync(SIMULATOR_BOT_SPEED_MS.balanced);
  });
  expect(screen.getByText("The practice bot did not advance the match.")).toBeTruthy();
  expect(screen.getByRole("button", { name: "Resume automatic bot playback" })).toBeTruthy();
});

// A malformed planner/adapter pair must not run an unbounded sequence in one
// priority window. Keep the real page controls and worker transport in this test.
it("bounds consecutive bot moves and lets the player resume deliberately", async () => {
  const { engine, worker, dispatch } = await startBotTurn();
  const probe = new AlphaClashServerEngine(structuredClone(engine.state), engine.playerIdToSeat);
  const accepted = probe.dispatch(
    "pass",
    "bot",
    {},
    {
      gameId: "test",
      sourceAuthority: "server",
    },
  );
  expect(accepted.success).toBe(true);
  let revision = engine.getStateID();
  vi.spyOn(engine, "getStateID").mockImplementation(() => revision);
  dispatch.mockImplementation(() => {
    revision += 1;
    return { ...accepted, stateID: revision };
  });
  for (let move = 0; move < 200; move++) {
    await act(async () => {
      worker.reply({ type: "pass", playerId: "player-two" });
      await vi.advanceTimersByTimeAsync(SIMULATOR_BOT_SPEED_MS.balanced);
    });
  }
  expect(dispatch).toHaveBeenCalledTimes(200);
  expect(worker.postMessage).toHaveBeenCalledTimes(200);
  expect(screen.getByText("Bot playback paused after 200 moves.")).toBeTruthy();
  await act(async () => vi.advanceTimersByTimeAsync(10_000));
  expect(dispatch).toHaveBeenCalledTimes(200);
  fireEvent.click(screen.getByRole("button", { name: "Resume automatic bot playback" }));
  expect(worker.postMessage).toHaveBeenCalledTimes(201);
  await act(async () => {
    worker.reply({ type: "pass", playerId: "player-two" });
    await vi.advanceTimersByTimeAsync(SIMULATOR_BOT_SPEED_MS.balanced);
  });
  expect(dispatch).toHaveBeenCalledTimes(201);
  expect(screen.queryByText("Bot playback paused after 200 moves.")).toBeNull();
});
