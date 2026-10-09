// @vitest-environment jsdom

import { fireEvent, waitFor } from "@testing-library/react";
import { afterEach, describe, test } from "vite-plus/test";
import { CYBERPUNK_P1 } from "../../testing/cyberpunk-simulator-pom";
import { ensureJsdomAnimationSupport } from "../../testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import { renderCyberpunkSimulatorScenario } from "../../testing/render-cyberpunk-simulator";
import { WindowCyberpunkHarnessClient } from "../../testing/window-cyberpunk-harness-client";
import { resetChoiceModalStateForTests } from "./choiceModalState";

const PANAM_PALMER_STRENGTH_THROUGH_FAMILY_DEFINITION_ID = "34774f04-4f16-40eb-8ee4-999144e572ab";

describe("visible hand discard", () => {
  afterEach(() => {
    resetChoiceModalStateForTests();
  });

  test("resolves Panam Palmer's optional discard from the hand with one click", async () => {
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

      const panamId = await harness.evalEngine((engine, definitionId: string) => {
        const state = engine.getState();
        return (
          state.G.players[CYBERPUNK_P1]?.zones.field.find(
            (cardId) => state.G.cardIndex[cardId]?.definitionId === definitionId,
          ) ?? null
        );
      }, PANAM_PALMER_STRENGTH_THROUGH_FAMILY_DEFINITION_ID);
      if (!panamId) {
        throw new Error("Missing Panam Palmer in the turn-trigger fixture.");
      }

      await harness.dispatchEngine(
        (engine, attackerId) => engine.attackRival(attackerId, { as: CYBERPUNK_P1 }),
        panamId,
      );

      const discardId = await harness.evalEngine((engine) => {
        const choice = engine.getState().G.turnMetadata.pendingChoice;
        return choice?.type === "chooseTarget" && choice.payload.type === "discardFromHand"
          ? (choice.payload.eligibleIds?.[0] ?? null)
          : null;
      });
      if (!discardId) {
        throw new Error("Expected Panam Palmer to offer a visible hand card to discard.");
      }
      if (document.body.querySelector('[data-testid="choice-modal-sheet"]')) {
        throw new Error("Visible hand discard must not open a choice modal.");
      }
      if (document.body.querySelector('[data-testid="prompt-target-modal-open"]')) {
        throw new Error("Visible hand discard must not offer a target modal.");
      }

      const discardCard = await waitFor(() =>
        requiredElement<HTMLElement>(
          view.container,
          `[data-testid="card"][data-card-id="${discardId}"][data-choice-type="resolveDiscardFromHand"]`,
        ),
      );
      fireEvent.click(discardCard);

      await waitFor(async () => {
        const pendingChoice = await harness.evalEngine(
          (engine) => engine.getState().G.turnMetadata.pendingChoice,
        );
        if (pendingChoice != null) {
          throw new Error("Discard click did not resolve the pending choice.");
        }
      });
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
