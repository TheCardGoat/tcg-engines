import { act, cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vite-plus/test";
import { AIPlayer, firstLegalStrategy, type AIPlayerDecision } from "@tcg/cyberpunk-engine";
import { createSimulatorExternalCommandGate } from "@tcg/simulator-runtime/animation";
import { EngineProvider, type EngineContextValue } from "./EngineProvider";
import { useEngine } from "./engineContext";
import { getScenario, P1 } from "./fixtures/scenarios";
import { createAiDecisionClient } from "./ai-worker-client";

vi.mock("./ai-worker-client", () => ({ createAiDecisionClient: vi.fn() }));

beforeEach(() => vi.stubGlobal("Worker", class {}));
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

function setup(mode: "auto" | "step" = "step") {
  let resolve: (selection: AIPlayerDecision | null) => void = () => {};
  const promise = new Promise<AIPlayerDecision | null>((done) => {
    resolve = done;
  });
  const client = { decide: vi.fn(() => promise), dispose: vi.fn() };
  vi.mocked(createAiDecisionClient).mockReturnValue(client);
  let latest: EngineContextValue | undefined;
  const build = () => getScenario("openingMain").build();
  const engine = build();
  const selection = new AIPlayer(engine.getLocalEngine().fork(), P1, firstLegalStrategy).decide();
  function Probe() {
    latest = useEngine();
    return null;
  }
  const view = render(
    <EngineProvider
      initialEngineBuilder={build}
      initialHumanSide="opponent"
      initialAi={{ player: firstLegalStrategy, opponent: null }}
      initialAiMode={mode}
      animationCommandGate={createSimulatorExternalCommandGate()}
    >
      <Probe />
    </EngineProvider>,
  );
  return {
    view,
    client,
    selection,
    resolve,
    current() {
      if (!latest) throw new Error("Missing provider");
      return latest;
    },
  };
}

test("a pending worker leaves the board responsive and commits its decision exactly once", async () => {
  const fixture = setup();
  const before = fixture.current().matchState;
  act(() => {
    fixture.current().stepOnce();
    fixture.current().stepOnce();
  });
  expect(fixture.client.decide).toHaveBeenCalledOnce();
  expect(fixture.current().matchState).toBe(before);
  act(() => fixture.current().setAiSpeed("fast"));
  expect(fixture.current().aiSpeed).toBe("fast");
  await act(async () => fixture.resolve(fixture.selection));
  expect(fixture.current().matchState.ctx.stateID).toBe(before.ctx.stateID + 1);
  expect(fixture.current().eventLog).toHaveLength(1);
  expect(fixture.current().rawEngineEvents).toHaveLength(1);
});

test.each(["restart", "mode change", "takeover", "state change"])(
  "discards a late result after %s, including a restart with the same state number",
  async (change) => {
    const fixture = setup();
    act(() => fixture.current().stepOnce());
    act(() => {
      if (change === "restart") fixture.current().resetScenario();
      if (change === "mode change") fixture.current().setAiMode("auto");
      if (change === "takeover") fixture.current().takeOverAiSide("player");
      if (change === "state change") fixture.current().dispatch({ type: "passPhase", as: P1 });
    });
    const afterChange = fixture.current().matchState;
    await act(async () => fixture.resolve(fixture.selection));
    expect(fixture.client.dispose).toHaveBeenCalled();
    expect(fixture.current().matchState).toBe(afterChange);
    expect(fixture.current().eventLog).toHaveLength(0);
  },
);

test("unmount terminates pending work", async () => {
  const fixture = setup();
  act(() => fixture.current().stepOnce());
  fixture.view.unmount();
  await act(async () => fixture.resolve(fixture.selection));
  expect(fixture.client.dispose).toHaveBeenCalledOnce();
});

test("starts thinking during the pacing delay and commits only when both are ready", async () => {
  vi.useFakeTimers();
  const fixture = setup("auto");
  const before = fixture.current().matchState;
  expect(fixture.client.decide).toHaveBeenCalledOnce();
  await act(async () => {
    await vi.advanceTimersByTimeAsync(300);
    fixture.resolve(fixture.selection);
  });
  expect(fixture.current().matchState).toBe(before);
  await act(async () => {
    await vi.advanceTimersByTimeAsync(299);
  });
  expect(fixture.current().matchState).toBe(before);
  await act(async () => {
    await vi.advanceTimersByTimeAsync(1);
  });
  expect(fixture.current().matchState.ctx.stateID).toBe(before.ctx.stateID + 1);
});
