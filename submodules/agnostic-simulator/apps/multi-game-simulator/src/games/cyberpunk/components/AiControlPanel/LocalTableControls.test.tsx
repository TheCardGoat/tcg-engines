import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { afterEach, expect, it } from "vite-plus/test";
import { createSimulatorExternalCommandGate } from "@tcg/simulator-runtime/animation";
import { EngineProvider } from "../../engine/EngineProvider";
import { getStrategyById, useEngine } from "../../engine";
import { BotShortcuts } from "../BoardV2/BotShortcuts";
import { getScenario } from "../../engine/fixtures/scenarios";
import { LocalTableControls } from "./LocalTableControls";

afterEach(cleanup);
function Evidence() {
  const engine = useEngine();
  return (
    <output data-testid="evidence">
      {JSON.stringify({
        bot: Boolean(engine.aiStrategies.opponent),
        side: engine.humanSide,
        mode: engine.aiMode,
        takeover: Boolean(engine.aiTakeover),
        version: engine.matchState.ctx.stateID,
        decisions: engine.eventLog.length,
      })}
    </output>
  );
}
function mount(shortcuts = false, aiEnabled = false, creator = false) {
  render(
    <MantineProvider>
      <EngineProvider
        animationCommandGate={createSimulatorExternalCommandGate()}
        initialEngineBuilder={() => getScenario("opponentTurn").build()}
        initialAi={{
          player: null,
          opponent: aiEnabled ? (getStrategyById("default")?.strategy ?? null) : null,
        }}
        initialAiMode="step"
      >
        {shortcuts ? <BotShortcuts alwaysVisible={creator} /> : <LocalTableControls />}
        <Evidence />
      </EngineProvider>
    </MantineProvider>,
  );
}
const evidence = () => JSON.parse(screen.getByTestId("evidence").textContent ?? "{}");
it("starts bot off, switches seats without rebuilding, and takes and releases bot control", () => {
  mount();
  const initial = evidence();
  expect(initial.bot).toBe(false);
  fireEvent.click(screen.getByRole("button", { name: "Switch player" }));
  expect(evidence()).toMatchObject({ side: "opponent", version: initial.version });
  fireEvent.click(screen.getByText("Step", { exact: true }));
  expect(evidence()).toMatchObject({ bot: true, side: "player", mode: "step" });
  fireEvent.click(screen.getByRole("button", { name: "Next bot decision" }));
  expect(evidence().decisions).toBe(1);
  fireEvent.click(screen.getByRole("button", { name: "Take over opponent" }));
  expect(evidence()).toMatchObject({ bot: false, side: "opponent", takeover: true });
  fireEvent.click(screen.getByRole("button", { name: "Return to bot" }));
  expect(evidence()).toMatchObject({ bot: true, side: "player", takeover: false });
  fireEvent.click(screen.getByText("Bot off", { exact: true }));
  expect(evidence()).toMatchObject({ bot: false, mode: "step", takeover: false });
});

it("shows board shortcuts only for a bot and supports step, pause and takeover without a menu", () => {
  mount(true);
  expect(screen.queryByRole("group", { name: "Bot shortcuts" })).toBeNull();
  cleanup();
  mount(true, true);
  expect(screen.getByRole("group", { name: "Bot shortcuts" })).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Next bot decision" }));
  expect(evidence().decisions).toBe(1);
  fireEvent.click(screen.getByRole("button", { name: "Resume bot" }));
  expect(evidence().mode).toBe("auto");
  fireEvent.click(screen.getByRole("button", { name: "Pause bot" }));
  expect(evidence().mode).toBe("step");
  fireEvent.click(screen.getByRole("button", { name: "Take over opponent" }));
  expect(evidence()).toMatchObject({ bot: false, takeover: true, side: "opponent" });
  fireEvent.click(screen.getByRole("button", { name: "Return opponent to bot" }));
  expect(evidence()).toMatchObject({ bot: true, takeover: false, side: "player" });
});

it("keeps creator shortcuts visible with bot off and can enable, take over, and disable the bot", () => {
  mount(true, false, true);
  const initial = evidence();
  expect(screen.getByRole("group", { name: "Bot shortcuts" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Next bot decision" }).hasAttribute("disabled")).toBe(
    true,
  );
  fireEvent.click(screen.getByRole("button", { name: "Switch player" }));
  expect(evidence()).toMatchObject({ side: "opponent", version: initial.version });
  fireEvent.click(screen.getByRole("button", { name: "Enable bot in step mode" }));
  expect(evidence()).toMatchObject({ bot: true, side: "player", mode: "step" });
  fireEvent.click(screen.getByRole("button", { name: "Take over opponent" }));
  expect(evidence().takeover).toBe(true);
  fireEvent.click(screen.getByRole("button", { name: "Disable bot" }));
  expect(evidence()).toMatchObject({ bot: false, mode: "step", takeover: false });
  expect(screen.getByRole("button", { name: "Enable bot in step mode" })).toBeTruthy();
});
