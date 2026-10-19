import { act, cleanup, render } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vite-plus/test";
import { createSimulatorExternalCommandGate } from "@tcg/simulator-runtime/animation";
import { buildCyberpunkInteractionView } from "@tcg/cyberpunk-server-adapter/interaction-protocol";
import {
  EngineProvider,
  type EngineContextValue,
  type RawEngineEventEntry,
} from "./EngineProvider";
import { useEngine } from "./engineContext";
import { getScenario, P1 } from "./fixtures/scenarios";
import { createLiveMatchViewerEngine } from "./live/liveState";

afterEach(cleanup);
const ai = { player: null, opponent: null };
function Probe({ observe }: { observe: (value: EngineContextValue) => void }) {
  observe(useEngine());
  return null;
}

test("hosted state, interaction and animation event reach children in the same render", () => {
  const source = getScenario("emptyFieldPlayTargets").build();
  const before = source.getState();
  const initialBuilder = () => createLiveMatchViewerEngine(before);
  const remoteDispatch = () => true;
  const observed: number[][] = [];
  const observe = (engine: EngineContextValue) =>
    observed.push([
      engine.matchState.ctx.stateID,
      engine.interactionViews.player.stateVersion,
      engine.rawEngineEvents.at(-1)?.stateID ?? before.ctx.stateID,
    ]);
  const props = {
    initialAi: ai,
    animationCommandGate: createSimulatorExternalCommandGate(),
    remoteDispatch,
  };
  const view = render(
    <EngineProvider {...props} initialEngineBuilder={initialBuilder}>
      <Probe observe={observe} />
    </EngineProvider>,
  );
  const result = source.passPhase({ as: P1 });
  expect(result.success).toBe(true);
  const state = result.state;
  const prompt = source.getPrompt(P1);
  const interactionView = buildCyberpunkInteractionView({
    actorId: P1,
    stateVersion: state.ctx.stateID,
    state,
    prompt,
  });
  const events: RawEngineEventEntry[] = [
    {
      id: 1,
      timestamp: 1,
      side: "player",
      move: "passPhase",
      input: {},
      stateID: result.stateID,
      beforeState: before,
      afterState: state,
      events: result.gameEvents,
      moveLogs: result.moveLogs,
      animationScript: result.animationScript,
    },
  ];
  observed.length = 0;
  view.rerender(
    <EngineProvider
      {...props}
      initialEngineBuilder={() => createLiveMatchViewerEngine(state)}
      remoteInteractionView={interactionView}
      remotePrompt={prompt}
      remoteEngineEvents={events}
      remoteMoveLogs={result.moveLogs}
    >
      <Probe observe={observe} />
    </EngineProvider>,
  );
  expect(observed.length).toBeGreaterThan(0);
  expect(
    observed.every((versions) => versions.every((version) => version === result.stateID)),
  ).toBe(true);
});

test("a retained input callback reads the current gate and pending remote writes stay serialized", () => {
  const source = getScenario("emptyFieldPlayTargets").build();
  const build = () => source;
  const gate = createSimulatorExternalCommandGate();
  const send = vi.fn(() => true);
  let current: EngineContextValue | undefined;
  const observe = vi.fn((value: EngineContextValue) => {
    current = value;
  });
  const props = {
    initialEngineBuilder: build,
    initialAi: ai,
    animationCommandGate: gate,
    remoteDispatch: send,
  };
  const view = render(
    <EngineProvider {...props}>
      <Probe observe={observe} />
    </EngineProvider>,
  );
  if (!current) throw Error("Missing provider");
  const dispatch = current.dispatch;
  observe.mockClear();
  act(() => gate.setBlocked(true));
  expect(observe).not.toHaveBeenCalled();
  expect(dispatch({ type: "passPhase", as: P1 }).success).toBe(false);
  expect(send).not.toHaveBeenCalled();
  act(() => gate.setBlocked(false));
  expect(observe).not.toHaveBeenCalled();
  expect(dispatch({ type: "passPhase", as: P1 }).success).toBe(true);
  expect(send).toHaveBeenCalledTimes(1);
  view.rerender(
    <EngineProvider {...props} hasPendingRemoteMove>
      <Probe observe={observe} />
    </EngineProvider>,
  );
  expect(current.dispatch({ type: "passPhase", as: P1 }).success).toBe(false);
  expect(send).toHaveBeenCalledTimes(1);
  // A rejected write clears the pending flag without inventing a new state.
  view.rerender(
    <EngineProvider {...props}>
      <Probe observe={observe} />
    </EngineProvider>,
  );
  expect(current.dispatch({ type: "passPhase", as: P1 }).success).toBe(true);
  expect(send).toHaveBeenCalledTimes(2);
});
