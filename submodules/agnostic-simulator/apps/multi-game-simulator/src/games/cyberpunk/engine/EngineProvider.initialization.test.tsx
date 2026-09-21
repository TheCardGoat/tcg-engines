import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vite-plus/test";
import { createSimulatorExternalCommandGate } from "@tcg/simulator-runtime/animation";
import { EngineProvider } from "./EngineProvider";
import { useEngine } from "./engineContext";
import { getScenario } from "./fixtures/scenarios";

afterEach(cleanup);

function Controls() {
  const engine = useEngine();
  return (
    <>
      <output>{engine.humanSide}</output>
      <button onClick={() => engine.setHumanSide("opponent")}>Switch seat</button>
      <button onClick={engine.resetScenario}>Restart</button>
    </>
  );
}

test("constructs once across seat changes and parent renders, but reconstructs on restart", () => {
  const gate = createSimulatorExternalCommandGate();
  const build = vi.fn(() => getScenario("openingMain").build());
  const view = render(
    <EngineProvider
      animationCommandGate={gate}
      initialEngineBuilder={build}
      initialAi={{ player: null, opponent: null }}
    >
      <Controls />
    </EngineProvider>,
  );
  expect(build).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByRole("button", { name: "Switch seat" }));
  expect(screen.getByText("opponent")).toBeTruthy();
  view.rerender(
    <EngineProvider
      animationCommandGate={gate}
      initialEngineBuilder={build}
      initialAi={{ player: null, opponent: null }}
    >
      <Controls />
    </EngineProvider>,
  );
  expect(build).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByRole("button", { name: "Restart" }));
  expect(build).toHaveBeenCalledTimes(2);
});

test("replaces a hosted engine when its builder changes without rebuilding it on subsequent renders", () => {
  const gate = createSimulatorExternalCommandGate();
  const build = vi.fn(() => getScenario("openingMain").build());
  const replacement = vi.fn(() => getScenario("openingMain").build());
  const view = render(
    <EngineProvider
      animationCommandGate={gate}
      initialEngineBuilder={build}
      initialAi={{ player: null, opponent: null }}
    >
      <Controls />
    </EngineProvider>,
  );
  view.rerender(
    <EngineProvider
      animationCommandGate={gate}
      initialEngineBuilder={replacement}
      initialAi={{ player: null, opponent: null }}
    >
      <Controls />
    </EngineProvider>,
  );
  expect(build).toHaveBeenCalledTimes(1);
  expect(replacement).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByRole("button", { name: "Switch seat" }));
  expect(replacement).toHaveBeenCalledTimes(1);
});
