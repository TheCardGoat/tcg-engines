import { fireEvent, waitFor, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vite-plus/test";
import { CyberpunkTestEngine, P1, P2 } from "@tcg/cyberpunk-engine";
import {
  welcomeToNightCityRetailOffdutyMalfini as attacker,
  welcomeToNightCityRetailCorpoSecurity as defender,
} from "@tcg/cyberpunk-cards";
import { renderCyberpunkSimulatorScenario } from "./render-cyberpunk-simulator";
import { ensureJsdomAnimationSupport } from "./fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";

vi.mock("../animation", async () => {
  const actual = await vi.importActual<typeof import("../animation")>("../animation");
  return { ...actual, SoundPlayer: () => null };
});

function game(held: boolean) {
  const engine = CyberpunkTestEngine.createWithFixture(
    { field: [{ card: attacker, hasLag: false, spent: false }] },
    { field: [{ card: defender, spent: true }], legendArea: [], hand: [], eddies: 0 },
    { combatProgression: "automatic" },
  );
  if (held) {
    engine.executeMove("setCombatPriority", { args: { mode: "hold" } }, P2);
    engine.attackUnit(attacker, defender, { as: P1 });
  }
  return engine;
}

describe.each(["desktop", "mobile"] as const)("combat hold (%s)", (layout) => {
  it("arms while waiting and stays enabled until switched off", async () => {
    ensureJsdomAnimationSupport();
    const engine = game(false);
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "attackStep",
      layout,
      initialHumanSide: "opponent",
      boardProps: { initialEngineBuilder: () => engine },
    });
    try {
      const button = within(view.container).getByRole("button", { name: "Hold combat priority" });
      expect(button.getAttribute("aria-pressed")).toBe("false");
      fireEvent.click(button);
      await waitFor(() => expect(button.getAttribute("aria-pressed")).toBe("true"));
      expect(engine.getState().G.players[P2]!.combatPriority).toBe("hold");
      expect(engine.getPrompt(P2).status).toBe("waiting");
      fireEvent.click(button);
      await waitFor(() => expect(button.getAttribute("aria-pressed")).toBe("false"));
    } finally {
      view.unmount();
    }
  });

  it("switching off during an empty held React window resolves combat", async () => {
    ensureJsdomAnimationSupport();
    const engine = game(true);
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "attackStep",
      layout,
      initialHumanSide: "opponent",
      boardProps: { initialEngineBuilder: () => engine },
    });
    try {
      expect(engine.getState().G.attackState?.step).toBe("react");
      fireEvent.click(within(view.container).getByRole("button", { name: "Hold combat priority" }));
      await waitFor(() => expect(engine.getState().G.attackState).toBeNull());
      expect(engine.getState().G.players[P2]!.combatPriority).toBe("automatic");
      expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
        defender.id,
      );
    } finally {
      view.unmount();
    }
  });
});
