// @vitest-environment jsdom

import { waitFor } from "@testing-library/react";
import { afterEach, describe, expect, test } from "vite-plus/test";
import { defOf } from "@tcg/cyberpunk-engine";
import { CYBERPUNK_P1 } from "../../testing/cyberpunk-simulator-pom";
import { ensureJsdomAnimationSupport } from "../../testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import { renderCyberpunkSimulatorScenario } from "../../testing/render-cyberpunk-simulator";
import { WindowCyberpunkHarnessClient } from "../../testing/window-cyberpunk-harness-client";
import { resetChoiceModalStateForTests } from "./choiceModalState";

describe("pending effects modal", () => {
  afterEach(() => {
    resetChoiceModalStateForTests();
  });

  test("shows source card art and makes each pending effect a resolve-next choice", async () => {
    const { view, harness, sourceCards } = await renderPendingChoiceFixture();
    try {
      await harness.dispatchEngine((engine, cards) => {
        engine.judgeSetPendingChoice({
          type: "chooseTrigger",
          chooserId: CYBERPUNK_P1,
          effectId: "pending-effects-ui",
          payload: {
            options: cards.map((card, index) => ({
              triggerId: `pending-effect-${index + 1}`,
              sourceCardId: card.instanceId,
              sourcePlayerId: CYBERPUNK_P1,
              abilityIndex: index,
              abilityText:
                index === 0
                  ? "Search the top 2 cards of your deck and trash 1."
                  : "Play another Unit with cost 9 or less from your trash for free.",
              cardName: card.name,
            })),
          },
        });
      }, sourceCards);

      const sheet = await waitForChoiceSheet();
      expect(sheet.textContent).toContain("Choose the next effect");
      expect(sheet.textContent).toContain("2 effects are pending");

      const options = sheet.querySelectorAll<HTMLButtonElement>(
        '[data-testid="pending-effect-option"]',
      );
      expect(options).toHaveLength(2);
      expect(options[0]?.textContent).toContain("Resolve next");
      expect(options[1]?.textContent).toContain("Resolve next");
      expect(options[0]?.querySelector(`img[alt="${sourceCards[0]!.name}"]`)).not.toBeNull();
      expect(options[1]?.querySelector(`img[alt="${sourceCards[1]!.name}"]`)).not.toBeNull();
    } finally {
      view.unmount();
    }
  });
});

async function renderPendingChoiceFixture() {
  ensureJsdomAnimationSupport();
  installResizeObserverStub();
  const view = renderCyberpunkSimulatorScenario({
    scenarioId: "retailReleaseAug2026AllCards",
    layout: "mobile",
  });
  const harness = new WindowCyberpunkHarnessClient();
  await harness.waitForReady();
  await waitFor(() => requiredElement(view.container, '[data-testid="mobile-cyberpunk-board"]'));
  const sourceCards = await harness.evalEngine((engine) =>
    [
      engine.getCardsInZone("field", CYBERPUNK_P1)[0],
      engine.getCardsInZone("field", CYBERPUNK_P1)[2],
    ]
      .filter((card): card is NonNullable<typeof card> => card !== undefined)
      .map((card) => ({
        instanceId: card.instanceId,
        name: defOf(card).displayName,
      })),
  );
  expect(sourceCards).toHaveLength(2);
  return { view, harness, sourceCards };
}

async function waitForChoiceSheet() {
  return waitFor(() =>
    requiredElement<HTMLElement>(document.body, '[data-testid="choice-modal-sheet"]'),
  );
}

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
