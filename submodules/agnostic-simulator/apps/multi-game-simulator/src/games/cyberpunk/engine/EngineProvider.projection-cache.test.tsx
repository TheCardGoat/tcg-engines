import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vite-plus/test";
import { createSimulatorExternalCommandGate } from "@tcg/simulator-runtime/animation";
import { buildCyberpunkInteractionView } from "@tcg/cyberpunk-server-adapter/interaction-protocol";
import { EngineProvider } from "./EngineProvider";
import { useEngine } from "./engineContext";
import { useSimulatorProjection } from "./useSimulatorProjection";
import { getScenario, P1 } from "./fixtures/scenarios";

afterEach(cleanup);
type Observation = {
  engine: ReturnType<typeof useEngine>;
  projection: ReturnType<typeof useSimulatorProjection>;
};
function Probe({ observe }: { observe: (value: Observation) => void }) {
  const engine = useEngine();
  const projection = useSimulatorProjection();
  observe({ engine, projection });
  const sell = engine.prompts.player.availableMoves.find((m) => m.moveId === "sellCard");
  const cardId = sell?.inputSpec.type === "selectCard" ? sell.inputSpec.candidates[0] : undefined;
  return (
    <>
      <output data-testid="actions">
        {engine.interactionViews[engine.humanSide].actions.map((a) => a.id).join(",")}
      </output>
      <button onClick={() => engine.setAiSpeed("fast")}>Speed</button>
      <button onClick={() => engine.setHumanSide("opponent")}>Seat</button>
      <button onClick={() => cardId && engine.dispatch({ type: "sellCard", cardId, as: P1 })}>
        Sell
      </button>
      <button onClick={() => engine.dispatch({ type: "undo" })}>Undo</button>
      <button onClick={engine.resetScenario}>Restart</button>
      <button onClick={() => engine.dispatch({ type: "passPhase", as: P1 })}>Pass</button>
    </>
  );
}
function observer() {
  let latest: Observation | undefined;
  return {
    observe: (value: Observation) => {
      latest = value;
    },
    read() {
      if (!latest) throw Error("Probe not rendered");
      return latest;
    },
  };
}
const ai = { player: null, opponent: null };
test("caches unrelated controls and refreshes sell, undo, turn and seat", () => {
  const o = observer(),
    game = getScenario("openingMain").build();
  const prompts = vi.spyOn(game, "getPrompt"),
    build = () => game;
  const gate = createSimulatorExternalCommandGate();
  render(
    <EngineProvider initialEngineBuilder={build} initialAi={ai} animationCommandGate={gate}>
      <Probe observe={o.observe} />
    </EngineProvider>,
  );
  const initial = o.read();
  prompts.mockClear();
  fireEvent.click(screen.getByText("Speed"));
  expect(prompts).not.toHaveBeenCalled();
  expect(o.read().projection.fixture).toBe(initial.projection.fixture);
  expect(o.read().engine.interactionViews).toBe(initial.engine.interactionViews);
  fireEvent.click(screen.getByText("Sell"));
  expect(screen.getByTestId("actions").textContent).not.toContain("sellCard");
  expect(o.read().projection.fixture).not.toBe(initial.projection.fixture);
  expect(o.read().engine.matchState.G.players[P1].soldThisTurn).toBe(true);
  fireEvent.click(screen.getByText("Undo"));
  expect(screen.getByTestId("actions").textContent).toContain("sellCard");
  expect(o.read().engine.matchState.G.players[P1].soldThisTurn).toBe(false);
  fireEvent.click(screen.getByText("Pass"));
  expect(o.read().projection.fixture.table.status.turn).toBe(2);
  fireEvent.click(screen.getByText("Seat"));
  expect(o.read().engine.humanSide).toBe("opponent");
  expect(screen.getByTestId("actions").textContent).not.toBe("");
});
test("invalidates restarted and replacement engines even when stateID repeats", () => {
  const o = observer(),
    build = () => getScenario("openingMain").build();
  const props = {
    initialEngineBuilder: build,
    initialAi: ai,
    animationCommandGate: createSimulatorExternalCommandGate(),
  };
  const view = render(
    <EngineProvider {...props}>
      <Probe observe={o.observe} />
    </EngineProvider>,
  );
  const before = o.read();
  fireEvent.click(screen.getByText("Restart"));
  expect(o.read().engine.matchState.ctx.stateID).toBe(before.engine.matchState.ctx.stateID);
  expect(o.read().projection.fixture).not.toBe(before.projection.fixture);
  const restarted = o.read(),
    replacement = () => getScenario("retailCardCatalog").build();
  view.rerender(
    <EngineProvider {...props} initialEngineBuilder={replacement}>
      <Probe observe={o.observe} />
    </EngineProvider>,
  );
  expect(o.read().engine.matchState.ctx.stateID).toBe(restarted.engine.matchState.ctx.stateID);
  expect(o.read().engine.matchState).not.toBe(restarted.engine.matchState);
  expect(screen.getByTestId("actions").textContent).not.toContain("sellCard");
  expect(o.read().projection.fixture).not.toBe(restarted.projection.fixture);
});
test("updates same-version remote overrides and restores local views", () => {
  const o = observer(),
    game = getScenario("openingMain").build(),
    build = () => game;
  const state = game.getState(),
    prompt = game.getPrompt(P1);
  const remote = buildCyberpunkInteractionView({
    actorId: P1,
    stateVersion: state.ctx.stateID,
    prompt,
    state,
  });
  const props = {
    initialEngineBuilder: build,
    initialAi: ai,
    animationCommandGate: createSimulatorExternalCommandGate(),
  };
  const view = render(
    <EngineProvider {...props} remoteInteractionView={remote} remotePrompt={prompt}>
      <Probe observe={o.observe} />
    </EngineProvider>,
  );
  const initial = o.read();
  view.rerender(
    <EngineProvider
      {...props}
      remoteInteractionView={{ ...remote, actions: [] }}
      remotePrompt={{ ...prompt, availableMoves: [] }}
    >
      <Probe observe={o.observe} />
    </EngineProvider>,
  );
  expect(screen.getByTestId("actions").textContent).toBe("");
  expect(o.read().engine.prompts.player.availableMoves).toEqual([]);
  expect(o.read().projection.fixture.interactions).toEqual([]);
  expect(o.read().projection.fixture).not.toBe(initial.projection.fixture);
  view.rerender(
    <EngineProvider {...props}>
      <Probe observe={o.observe} />
    </EngineProvider>,
  );
  expect(screen.getByTestId("actions").textContent).toContain("sellCard");
});
