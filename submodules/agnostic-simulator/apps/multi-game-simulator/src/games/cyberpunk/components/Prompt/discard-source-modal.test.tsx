// @vitest-environment jsdom

import { waitFor } from "@testing-library/react";
import { afterEach, describe, test } from "vite-plus/test";
import { welcomeToNightCityRetailPanamPalmerStrengthThroughFamily } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "../../testing/cyberpunk-simulator-pom";
import { expectEqual } from "../../testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { ensureJsdomAnimationSupport } from "../../testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import { renderCyberpunkSimulatorScenario } from "../../testing/render-cyberpunk-simulator";
import { WindowCyberpunkHarnessClient } from "../../testing/window-cyberpunk-harness-client";
import { resetChoiceModalStateForTests } from "./choiceModalState";

describe("discard choice source title", () => {
  afterEach(() => {
    resetChoiceModalStateForTests();
  });

  test("names Panam Palmer in the discard modal title", async () => {
    ensureJsdomAnimationSupport();
    installResizeObserverStub();

    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "retailWtnc22TurnTriggerQa",
      layout: "mobile",
    });
    try {
      const harness = new WindowCyberpunkHarnessClient();
      await harness.waitForReady();
      await waitFor(() =>
        requiredElement(view.container, '[data-testid="mobile-cyberpunk-board"]'),
      );

      const panamId = await harness.evalEngine((engine, definitionId) => {
        const state = engine.getState();
        return (
          state.G.players[CYBERPUNK_P1]?.zones.field.find(
            (cardId) => state.G.cardIndex[cardId]?.definitionId === definitionId,
          ) ?? null
        );
      }, welcomeToNightCityRetailPanamPalmerStrengthThroughFamily.id);
      if (!panamId) {
        throw new Error("Missing Panam Palmer in the turn-trigger fixture.");
      }

      await harness.dispatchEngine(
        (engine, attackerId) => engine.attackRival(attackerId, { as: CYBERPUNK_P1 }),
        panamId,
      );

      const title = await waitFor(() =>
        requiredElement<HTMLElement>(document.body, '[data-testid="choice-modal-title"]'),
      );
      expectEqual(
        "Discard title identifies the effect source",
        title.textContent?.trim(),
        "Choose a card to discard for Panam Palmer: Strength Through Family",
      );
    } finally {
      view.unmount();
    }
  });
});

function installResizeObserverStub() {
  globalThis.ResizeObserver ??= class ResizeObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  };
}

function requiredElement<T extends Element>(container: ParentNode, selector: string): T {
  const element = container.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Missing required element: ${selector}`);
  }
  return element;
}
